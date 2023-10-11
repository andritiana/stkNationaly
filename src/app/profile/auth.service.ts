import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { inject, Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { JwtConfig, JwtHelperService } from '@auth0/angular-jwt';
import { differenceInMinutes } from 'date-fns';
import { BehaviorSubject, combineLatest, EMPTY, firstValueFrom, forkJoin, Observable, of, timer } from 'rxjs';
import { distinctUntilChanged, filter, map, retry, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { StorageService } from '../utils/storage.service';
import { FpmaApiService } from './../services/fpma-api.service';

export const AUTH_STORAGE_KEY = 'auth_token';
export const REFRESH_STORAGE_KEY = 'refresh_token';

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
    await this.setAccesToken(null);
    await this.setRefreshToken(null);
    this.isPasswordTemporary$()
      .pipe(switchMap((isTemporary) => (isTemporary ? this.invalidateRefreshToken() : of(true))))
      .subscribe();
    return redirect ? this.router.navigateByUrl('/') : Promise.resolve(false);
  }

  /**
   * Uses the refresh token to refresh the access token. If no refresh token is available, complete immediately.
   * Completes without emitting any value to signify it couldn't refresh (AuthExpirationInterceptor relies on that behaviour)
   */
  refresh() {
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
            tap(() => this.pendingRefreshes--),
          );
        } else if (!!refreshToken && userId) {
          if (differenceInMinutes(new Date(), this.lastSuccessfulRefresh) < 1) {
            return of(true);
          }
          this.isRefreshing$.next(true);
          return this.http.post<AuthPairResponse>(`${this.baseAPI}/auth/token/refresh`, { refreshToken, userId });
        } else {
          return EMPTY;
        }
      }),
      switchMap((tokensOrRefresh) =>
        // if `tokensOrRefresh` is boolean, no http request was necessary
        typeof tokensOrRefresh === 'boolean'
          ? of(null)
          : forkJoin([
              this.setAccesToken(tokensOrRefresh.accessToken),
              this.setRefreshToken(tokensOrRefresh.refreshToken),
            ])
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
            return timer((1000 * 2) ^ retryCount).pipe(take(1), tap(() => this.isRefreshing$.next(false)));
          } else {
            this.isRefreshing$.next(false);
            return of(1);
          }
        },
      }),
      take(1),
      tap({
        next: (r) => {
          if (typeof ngDevMode !== 'undefined' && !!ngDevMode || this.fpmaService.isDevMode) {
            console.log('refreshed %o', r);
          }
          if (r instanceof Array) {
            this.lastSuccessfulRefresh = new Date();
            // wait for this stream to fully process before letting pending streams through
            this.ngZone.runOutsideAngular(() => setTimeout(() => this.isRefreshing$.next(false)));
          }
        },
        error: () => {
          this.isRefreshing$.next(false);
          void this.setRefreshToken(null);
        },
      }),
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

  private invalidateRefreshToken() {
    const refreshToken = refreshToken$.value;
    return refreshToken ? this.http.post(`${this.baseAPI}/auth/token/invalidate`, { refreshToken }) : of();
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
