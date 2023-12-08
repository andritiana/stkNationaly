import type { HttpErrorResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

import { inject, Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import type { JwtConfig} from '@auth0/angular-jwt';
import { JwtHelperService } from '@auth0/angular-jwt';
import { differenceInMinutes } from 'date-fns';
import type {
  Observable} from 'rxjs';
import {
  asapScheduler,
  BehaviorSubject,
  combineLatest,
  concat,
  EMPTY,
  firstValueFrom,
  forkJoin,
  iif,
  of,
  timer,
} from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  last,
  map,
  observeOn,
  retry,
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { StorageService } from '../utils/storage.service';
import { FpmaApiService } from './../services/fpma-api.service';

export const AUTH_STORAGE_KEY = 'auth_token';
export const REFRESH_STORAGE_KEY = 'refresh_token';

type RefreshResult = { type: 'FRESH' } | { type: 'FAIL'; error?: unknown } | (AuthPairResponse & { type: 'SUCCESS' });
interface AuthPairResponse {
  accessToken: string;
  refreshToken: string;
}

export interface MyStkJwtPayload {
  features: string[];
  /** @type dd-MM-yyyy HH:mm:ss */
  recoveryPasswordExpiration?: string;
}
// standard claims https://datatracker.ietf.org/doc/html/rfc7519#section-4.1
export interface JwtPayload {
  aud?: string | string[] | undefined;
  exp?: number | undefined;
  iat?: number | undefined;
  iss?: string | undefined;
  jti?: string | undefined;
  nbf?: number | undefined;
  sub?: string | undefined;
}

export function initializeTokensFromStorage() {
  const storage = inject(StorageService);
  return () =>
    Promise.all([
      storage.get<string>(REFRESH_STORAGE_KEY).then((refreshToken) => refreshToken && refreshToken$.next(refreshToken)),
      storage.get<string>(AUTH_STORAGE_KEY).then((jwtString) => jwtString && accessToken$.next(jwtString)),
    ]);
}

export function jwtOptionsFactory(): JwtConfig {
  return {
    allowedDomains: ['stk.fpma.church'],
    disallowedRoutes: [new RegExp(String.raw`/api/mystk/auth/.*`)],
    tokenGetter: () => firstValueFrom(accessToken$.pipe(take(1))),
  };
}

const accessToken$ = new BehaviorSubject<string | null>(null);
const refreshToken$ = new BehaviorSubject<string | null>(null);

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly accessTokenPayload$: Observable<(JwtPayload & MyStkJwtPayload) | null> =
    this.getAccessTokenPayload();
  private readonly baseAPI = 'https://stk.fpma.church/api/mystk';
  private isRefreshing$ = new BehaviorSubject(false);
  private readonly userId$ = this.accessTokenPayload$.pipe(map((jwt) => jwt?.sub));
  private fpmaService = inject(FpmaApiService);
  private ngZone = inject(NgZone);
  /** To inspect how many refresh requests are queued */
  private pendingRefreshes = 0;
  private lastSuccessfulRefresh = new Date('1970-01-01');
  constructor(
    private storage: StorageService,
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private router: Router
  ) {}

  getMyId() {
    return this.userId$.pipe(take(1));
  }

  isAccesTokenExpired$() {
    return accessToken$.pipe(map((token) => (token ? this.jwtHelper.isTokenExpired(token) : true)));
  }

  isLoggedIn$() {
    return combineLatest([this.userId$, this.isAccesTokenExpired$()]).pipe(
      map(([userId, expired]) => !!userId && !expired)
    );
  }

  isPasswordTemporary$() {
    return this.accessTokenPayload$.pipe(map((payload) => payload?.recoveryPasswordExpiration));
  }

  logIn(login: string, password: string) {
    return this.http
      .post<AuthPairResponse>(`${this.baseAPI}/auth`, { login, password })
      .pipe(
        switchMap(({ accessToken, refreshToken }) =>
          forkJoin([this.setAccesToken(accessToken), this.setRefreshToken(refreshToken)])
        )
      );
  }

  async logOut(redirect = true) {
    return firstValueFrom(
      this.isPasswordTemporary$().pipe(
        take(1),
        switchMap((isTemporary) => {
          if (isTemporary) {
            return this.invalidateRefreshToken();
          } else {
            return this.setRefreshToken(null);
          }
        }),
        switchMap(() => this.setAccesToken(null)),
        switchMap(() => (redirect ? this.router.navigateByUrl('/') : of(false)))
      )
    );
  }

  /**
   * Uses the refresh token to refresh the access token.
   * Returns {type: 'FAIL'} if it couldn't refresh (AuthExpirationInterceptor relies on that behaviour)
   */
  refresh(): Observable<RefreshResult> {
    const refreshResult: { [k in Exclude<RefreshResult['type'], 'SUCCESS'>]: RefreshResult } = {
      FRESH: { type: 'FRESH' },
      FAIL: { type: 'FAIL' },
    };
    return combineLatest([refreshToken$, this.userId$]).pipe(
      take(1),
      switchMap(([refreshToken, userId]) => {
        if (this.isRefreshing$.value) {
          // a refresh is already ongoing, so wait for it to finish and the next switchMap will just emit null
          this.pendingRefreshes++;
          return this.isRefreshing$.pipe(
            distinctUntilChanged(),
            filter((isRefreshing) => !isRefreshing),
            take(1),
            observeOn(asapScheduler), // give priority of execution to the main refreshing loop
            tap(() => this.pendingRefreshes--),
            switchMap(() => this.shouldRefresh$()),
            take(1),
            map((shouldRefresh) => (shouldRefresh ? refreshResult.FAIL : refreshResult.FRESH))
          );
        } else if (!!refreshToken && userId) {
          if (differenceInMinutes(new Date(), this.lastSuccessfulRefresh) < 1) {
            return of(refreshResult.FRESH);
          }
          this.isRefreshing$.next(true);
          return this.http
            .post<AuthPairResponse>(`${this.baseAPI}/auth/token/refresh`, { refreshToken, userId })
            .pipe(map((pair) => ({ type: 'SUCCESS' as const, ...pair })));
        } else {
          return of(refreshResult.FAIL);
        }
      }),
      switchMap(
        (result) =>
          concat(
            result.type === 'SUCCESS'
              ? forkJoin([this.setAccesToken(result.accessToken), this.setRefreshToken(result.refreshToken)])
              : EMPTY,
            of(result)
          ).pipe(last()) as Observable<RefreshResult>
      ),
      tap({
        // eslint-disable-next-line rxjs/no-implicit-any-catch
        error: (e: HttpErrorResponse) => {
          console.error(e);
        },
      }),
      take(1),
      retry({
        count: 3,
        resetOnSuccess: true,
        delay: (error: HttpErrorResponse, retryCount) => {
          if (error.status === 0) {
            return timer((1000 * 2) ^ retryCount).pipe(
              take(1),
              tap(() => this.isRefreshing$.next(false))
            );
          } else {
            this.isRefreshing$.next(false);
            return of(1);
          }
        },
      }),
      take(1),
      tap({
        next: ({ type: result, ...resultRest }) => {
          if ((typeof ngDevMode !== 'undefined' && !!ngDevMode) || this.fpmaService.isDevMode) {
            console.log('refreshed %o', { type: result, ...(resultRest ?? {}) });
          }
          if ('accessToken' in resultRest) {
            this.lastSuccessfulRefresh = new Date();
            // wait for this stream to fully process before letting pending streams through
            this.isRefreshing$.next(false);
          }
        },
        error: (e: unknown) => {
          console.error('refresh failed after retries, %o', e);
          this.isRefreshing$.next(false);
          void this.setRefreshToken(null);
        },
      })
    );
  }

  resetPassword(body: { email: string }) {
    return this.http.post(`${this.baseAPI}/resetpassword`, body);
  }

  shouldRefresh$() {
    return accessToken$.pipe(
      map((token) =>
        token ? differenceInMinutes(this.jwtHelper.getTokenExpirationDate(token) ?? new Date(), new Date()) < 5 : true
      )
    );
  }

  private getAccessTokenPayload() {
    if (this.accessTokenPayload$) {
      return this.accessTokenPayload$;
    } else {
      return accessToken$.pipe(
        map((jwtString) => (jwtString ? this.jwtHelper.decodeToken<JwtPayload & MyStkJwtPayload>(jwtString) : null)),
        shareReplay({ refCount: false, bufferSize: 1 })
      );
    }
  }

  /**
   * Invalidate the refresh token on the server and nullify the local copy
   */
  private invalidateRefreshToken() {
    const refreshToken = refreshToken$.value;
    return iif(
      () => !!refreshToken,
      this.http.post(`${this.baseAPI}/auth/token/invalidate`, { refreshToken }),
      of(null)
    ).pipe(switchMap(() => this.setRefreshToken(null)));
  }

  private setAccesToken(accessToken: string | null): Promise<string | null> {
    accessToken$.next(accessToken);
    return this.storage.set(AUTH_STORAGE_KEY, accessToken);
  }

  private setRefreshToken(refreshToken: string | null): Promise<string | null> {
    refreshToken$.next(refreshToken);
    return this.storage.set(REFRESH_STORAGE_KEY, refreshToken);
  }
}
