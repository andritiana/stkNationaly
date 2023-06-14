import { EnvironmentInjector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  Observable,
  Subject,
  Subscription,
  asapScheduler,
  filter,
  firstValueFrom,
  mergeMapTo,
  observeOn,
  startWith,
  switchMap,
  switchMapTo,
  tap
} from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { asyncTick } from 'src/testing';
import type { RxCache } from './cache';
import { createCache } from './cache';
fdescribe('Cache', () => {
  let request: () => Observable<number>;
  let feeder: () => Observable<number>;
  let signal: Subject<void>;
  let testScheduler: TestScheduler;
  let cache: RxCache<string>;
  let injector: EnvironmentInjector;

  beforeEach(() => {
    signal = new Subject();
    testScheduler = new TestScheduler((actual, expected) => {
      // console.log(JSON.stringify(actual));
      expect(actual).toEqual(expected);
    });
    let counter = 0;
    feeder = () => new Observable((sub) => {
      // executed on new subscriptions (simulating an outgoing http request)
      counter = 0;
      const teardown = new Subscription(() => sub.complete());
      teardown.add(signal
        .pipe(
          startWith(null),
          observeOn(asapScheduler)
        )
        .subscribe(() => {
          sub.next(counter++);
        }));
        return teardown;
    });
    injector = TestBed.inject(EnvironmentInjector);
    initCache();
  });

  it('should share replay', () => {
    // prettier-ignore
    testScheduler.run(({ cold, hot, expectObservable, expectSubscriptions }) => {
      const src$ =        cold('-a---b---c---d---e|');
      const subscriber1$ = hot('a| ');
      const expected1 =        '-a---b---c---d---e';
      const subscriber2$ = hot('----------a| ');
      const expected2 =        '----------c--d---e';
      const cached$ = src$.pipe(cache.doCache());

      expectObservable(subscriber1$.pipe(mergeMapTo(cached$))).toBe(expected1);
      expectObservable(subscriber2$.pipe(mergeMapTo(cached$))).toBe(expected2);
    });
  });

  it('expiration should complete the first observable and restart the source for the second', () => {
    // prettier-ignore
    testScheduler.run(({ cold, hot, expectObservable, }) => {
      const src$ =        cold('-a---b---c---d---e|');
      const subscriber1$ = hot('s- ');
      const expected1 =        '-a---b---c-';
      //                                     \/ expiration unsubscribes the src$, so the 1st observable gets no further emission
      const subscriber2$ = hot('---s-------s-n----------t-| ');
      //           src$ = cold('-a---b---c---d---e|');
      const expected2 =        '---a-b---c-c--a---b---c-c-d---e';
      //                                     ^ src$ restarts
      //           src$ =              cold('-a---b---c---d---e|');
      const cached$ = src$.pipe(cache.doCache());

      expectObservable(subscriber1$.pipe(switchMapTo(cached$))).toBe(expected1);
      expectObservable(subscriber2$.pipe(tap(v => {
        v === 'n' && cache.expireNow();
      } ),switchMapTo(cached$))).toBe(expected2);
    });
  });

  it('should cache the source and not re-trigger it', async () => {
    const cache = initCache() as unknown as RxCache<number>;
    request = () => feeder().pipe(cache.doCache());
    request().subscribe((v) => {
      expect(v).toEqual(0);
    });
    return firstValueFrom(request()).then((v) => {
      expect(v).toEqual(0);
    });
  });

  it('should expire the source imperatively', async () => {
    const cache = initCache() as unknown as RxCache<number>;
    request = () => feeder().pipe(cache.doCache());
    await firstValueFrom(request()).then((v) => expect(v).toEqual(0));
    await signalNext();
    await firstValueFrom(request()).then((v) => expect(v).toEqual(1));
    await signalNext();
    await firstValueFrom(request()).then((v) => expect(v).toEqual(2));

    cache.expireNow();
    await firstValueFrom(request()).then((v) => expect(v).toEqual(0));
    await signalNext();
    await firstValueFrom(request()).then((v) => expect(v).toEqual(1));
    await signalNext();
    await firstValueFrom(request()).then((v) => expect(v).toEqual(2));
  });

  it('should expire the source in due time', async () => {
    const expiry = 500;
    const cache = initCache({expiry}) as unknown as RxCache<number>;
    request = () => feeder().pipe(cache.doCache());
    await firstValueFrom(request()).then((v) => expect(v).toEqual(0));
    await signalNext();
    await firstValueFrom(request()).then((v) => expect(v).toEqual(1));
    await signalNext();
    await firstValueFrom(request()).then((v) => expect(v).toEqual(2));

    await asyncTick(expiry);
    await firstValueFrom(request()).then((v) => expect(v).toEqual(0));
    await signalNext();
    await firstValueFrom(request()).then((v) => expect(v).toEqual(1));
    await signalNext();
    await firstValueFrom(request()).then((v) => expect(v).toEqual(2));

    await asyncTick(expiry);
    await asyncTick(expiry/2);
    await firstValueFrom(request()).then((v) => expect(v).toEqual(0));
    await signalNext();
    await firstValueFrom(request()).then((v) => expect(v).toEqual(1));
    await asyncTick(expiry/2); // check expiration timer started after the request, not as soon as the previous expiration
    await signalNext();
    await firstValueFrom(request()).then((v) => expect(v).toEqual(2));
  });

  it('should refresh and trigger the source synchronously', () => {
    // prettier-ignore
    testScheduler.run(({ cold, hot, expectObservable, flush }) => {
      const src$ =        cold('a--b--|');
      const subscriber1$ = hot('-n-n---r| ');
      const expected1 =        '-a-ab--a--b';

      let counter = 0;
      const cached$ = src$.pipe(tap(() => counter++ ), cache.doCache());

      expectObservable(subscriber1$.pipe(
        tap(v => v === 'r' && cache.refresh()),
        filter(v => v !== 'r'),
        switchMap(() => cached$),
      )).toBe(expected1);
      flush();
      expect(counter).withContext('src$ should emit 2 values, twice').toBe(2*2);
    });
  });

  it('should feed the given value', () => {
    // prettier-ignore
    testScheduler.run(({ cold, hot, expectObservable, flush }) => {
      // refresh with a computed value
      const src$ =        cold('a--b--|');
      const subscriber1$ = hot('-n-n---r--n| ');
      const expected1 =        '-a-ab--c--c';

      let counter1 = 0, counter2 = 0;
      const cache1 = cache;
      const cached$ = src$.pipe(tap(() => counter1++ ), cache1.doCache());

      expectObservable(subscriber1$.pipe(
        tap(v => v === 'r' && cache1.refresh(v => v + 'c')),
        filter(v => v !== 'r'),
        switchMap(() => cached$),
      )).toBe(expected1, {a: 'a', b: 'b', c: 'bc'});

      // refresh with static value
      const subscriber2$ = hot('-n-n---r--n| ');
      const cache2 = initCache();
      const cached2$ = src$.pipe(tap(() => counter2++ ), cache2.doCache());
      expectObservable(subscriber2$.pipe(
        tap(v => v === 'r' && cache2.refresh('ac')),
        filter(v => v !== 'r'),
        switchMap(() => cached2$),
      )).toBe(expected1, {a: 'a', b: 'b', c: 'ac'});
      flush();
      expect(counter1).withContext('src$ should emit 2 values, once').toBe(2);
      expect(counter2).withContext('src$ should emit 2 values, once').toBe(2);
    });
  });

  function initCache(opts?: Parameters<typeof createCache>[number]) {
    return (cache = injector.runInContext(() => createCache(opts)));
  }

  function signalNext() {
    signal.next();
    return asyncTick();
  }
});
