import { Injectable } from '@angular/core';
import { BehaviorSubject, merge, MonoTypeOperatorFunction, Observable, Subject } from 'rxjs';
import { shareReplay, switchMap, tap } from 'rxjs/operators';
import { isAfter } from 'date-fns';
import { addMilliseconds } from 'date-fns/esm';

export class CacheBuffer<T> {
  private readonly manualValue$ = new Subject<T>();
  private readonly refresher$ = new BehaviorSubject(null);
  private readonly emits$ = new Subject<T>();
  private cachedSource$: Observable<T>;
  private expiration?: number;
  private expirationDate?: Date;

  setExpiration(expiresAt: number) {
    this.expiration = expiresAt;
    return this;
  }

  cacheEm(): MonoTypeOperatorFunction<T> {
    return source => {
      if (this.cachedSource$ && !this.isExpired()) {
        return this.cachedSource$;
      } else {
        this.updateExpiration();
        return this.cachedSource$ = this.refresher$.pipe(
          switchMap(() => merge(source, this.manualValue$)),
          shareReplay({ bufferSize: 1, refCount: true }),
          tap({
            next: (value) => queueMicrotask(() => this.emits$.next(value)),
            complete: () => this.cachedSource$ = null,
          }),
        );
      }
    }
  }

  expireNow() {
    this.expirationDate = new Date();
  }

  private isExpired(): boolean {
    if (this.expirationDate) {
      return isAfter(new Date(), this.expirationDate);
    } else if (this.expiration === undefined) {
      return false;
    } else {
      this.updateExpiration();
      return this.isExpired();
    }
  }

  private updateExpiration() {
    if (typeof this.expiration === 'number') {
      this.expirationDate = addMilliseconds(new Date(), this.expiration);
    }
  }

  refresh(value?: T) {
    if (value !== undefined) {
      this.manualValue$.next(value);
    } else {
      this.refresher$.next(null);
    }
    return this.emits$;
  }
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  constructor() { }
}
