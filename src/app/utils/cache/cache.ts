import type { Type } from '@angular/core';
import { Injectable, NgZone, inject } from '@angular/core';
import type { Duration } from 'date-fns';
import { milliseconds } from 'date-fns/esm';
import type { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { EMPTY, ReplaySubject, Subject, asyncScheduler, firstValueFrom } from 'rxjs';
import { filter, map, share, shareReplay, startWith, switchMap, take, takeUntil, tap } from 'rxjs/operators';


type RxCacheEvent = LoadingEvent | {
  resetSource: true;
};
interface LoadingEvent {
  error: boolean;
  isFirstSourceEmission: boolean;
  loading: boolean;
}

class RxCache<Src> {
  private $?: Observable<Src>;
  private events = new CacheEventsInternal();
  private expiration$ = new Subject<void>();
  private feeder$!: ReplaySubject<Src | RxCache<Src>['NON_VALUE']>;
  private NON_VALUE = Symbol();
  private refresher$ = new Subject();
  constructor(private lifetime?: number | Duration, private runnerOutsideAngular = (cb: () => unknown) => cb()) {
  }

  destroy() {
    this.feeder$?.complete();
    this.expiration$.next();
    this.expiration$.complete();
    this.refresher$?.complete();
    this.events.destroy();
  }

  doCache(): MonoTypeOperatorFunction<Src> {
    if (this.$) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return () => this.$!;
    } else {
      let isFirstSourceEmission = true;
      return (src$: Observable<Src>) =>
        (this.$ = this.refresher$.pipe(
          startWith(null),
          tap(() => this.events.setLoading(true, {isFirstSourceEmission})),
          switchMap(() => src$),
          // eslint-disable-next-line rxjs/no-unsafe-takeuntil
          takeUntil(this.expiration$),
          share({
            connector: () => {
              this.events.setResettingSource();
              this.setExpiration(this.lifetime);
              return (this.feeder$ = new ReplaySubject<Src | RxCache<Src>['NON_VALUE']>(
                1,
                undefined /* _timestampProvider */
              ));
            },
            resetOnRefCountZero: false,
            resetOnError: true,
            resetOnComplete: true,
          }),
          this.isActualValue(),
          tap({
            next: () => {
            this.events.setLoading(false, {isFirstSourceEmission});
            isFirstSourceEmission = false;
          },
          error: () => {this.events.setLoading(false, {isFirstSourceEmission, error: true})}
        })
        ));
    }
  }

  expireNow() {
    this.expiration$.next();
  }

  getEvents() {
    return this.events as CacheEventsPublic;
  }

  refresh(value?: Src | ((prev: Src) => Src)) {
    if (value) {
      if (value instanceof Function) {
        const updated$ = this.feeder$.pipe(
          this.isActualValue(),
          map((v) => value(v)),
          tap((v) => this.feeder$.next(v)),
        );
        return firstValueFrom(updated$);
      } else {
        this.feeder$.next(value);
        return firstValueFrom(this.$ ?? EMPTY);
      }
    } else {
      // invalidate the feeder first so the next subscription won't receive the expired value
      this.feeder$.next(this.NON_VALUE);
      this.refresher$.next(this.NON_VALUE);
      return firstValueFrom(this.$ ?? EMPTY);
    }
  }

  setExpiration(expiry?: number | Duration) {
    if (typeof expiry !== 'undefined') {
      let expirationMs: number;
      if (typeof expiry === 'number') {
        expirationMs = expiry;
      } else if (!!expiry) {
        expirationMs = milliseconds(expiry);
      }
      this.runnerOutsideAngular(() => asyncScheduler.schedule(() => this.expiration$.next(), expirationMs));
    }
  }

  private isActualValue() {
    return filter((v): v is Src => v !== this.NON_VALUE);
  }
}

export type CacheEventsPublic = Omit<CacheEventsInternal, 'setLoading' | 'setResettingSource'>;
class CacheEventsInternal {
  $ = new ReplaySubject<LoadingEvent | {resetSource: true}>(1, 100);

  destroy() {
    this.$.complete();
  }

  isLoading$() {
    return this.$.pipe(this.getLoadingEvents(), map(({loading}) => loading));
  }

  setLoading(loading: boolean, opts: {isFirstSourceEmission: boolean; error?: boolean}) {
    const {isFirstSourceEmission, error = false} = opts;
    this.$.next({loading, isFirstSourceEmission, error});
  }

  setResettingSource() {
    this.$.next({resetSource: true});
  }

  private getLoadingEvents() {
    return filter((event: RxCacheEvent): event is LoadingEvent => 'loading' in event && event.loading);
  }

// export function isLoadingEvent() {
//   return filter((event: RxCacheEvent): event is LoadingEvent => 'loading' in event && event.loading);
// }
}

export class RxCacheByKey<Key, Value> {
  private registry = new Map<Key,RxCache<Value>>();
  constructor(private lifetime?: number | Duration, private runnerOutsideAngular = (cb: () => unknown) => cb()) {
  }

  destroy() {
    this.registry.forEach(cache => cache.destroy());
  }

  doCacheByKey(k: Key) {
    if (this.registry.has(k)) {
      return this.registry.get(k)?.doCache();
    } else {
      const cache = new RxCache<Value>(this.lifetime, this.runnerOutsideAngular);
      this.registry.set(k, cache);
      return cache.doCache();
    }
  }

}
@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private registry: Set<RxCache<any>> = new Set();
  private registryOfCacheByKey: Set<RxCacheByKey<unknown, unknown>> = new Set();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register<Src>(cacheInstance: RxCache<Src> | RxCacheByKey<any, any>) {
    if (cacheInstance instanceof RxCacheByKey) {
      return this.registryOfCacheByKey.add(cacheInstance);
    } else {
      return this.registry.add(cacheInstance);
    }
  }

  ngOnDestroy() {
    this.registry.forEach((instance) => instance.destroy());
    this.registryOfCacheByKey.forEach((instance) => instance.destroy());
  }
}

export function createCache<V>(opts?: { expiry?: number | Duration; inject?: <T>(Ctor: Type<T>) => T }) {

  const { expiry /* , inject: injekt = inject */ } = (opts ??= {});
  const service = inject(CacheService);
  const ngZone = inject(NgZone);
  const runOutsideNgZone = ngZone.runOutsideAngular.bind(ngZone);
  // const timestampProvider = inject(TIMESTAMP_PROVIDER, {optional: true}) ?? undefined;
  const sharedCache = new RxCache<V>(expiry, runOutsideNgZone);
  service.register(sharedCache);
  return sharedCache;
}
export function createCacheByKey<K,V>(opts?: { expiry?: number | Duration; inject?: <T>(Ctor: Type<T>) => T }) {

  const { expiry /* , inject: injekt = inject */ } = (opts ??= {});
  const service = inject(CacheService);
  const ngZone = inject(NgZone);
  const runOutsideNgZone = ngZone.runOutsideAngular.bind(ngZone);
  // const timestampProvider = inject(TIMESTAMP_PROVIDER, {optional: true}) ?? undefined;
  const sharedCache = new RxCacheByKey<K,V>(expiry, runOutsideNgZone);
  service.register(sharedCache);
  return sharedCache;
}
