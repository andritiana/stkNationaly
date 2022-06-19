import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtConfig, JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, combineLatest, EMPTY, forkJoin, from, Observable, of } from 'rxjs';
import { map, shareReplay, switchMap, take, tap } from 'rxjs/operators';

const AUTH_STORAGE_KEY = 'auth_token';
const REFRESH_STORAGE_KEY = 'refresh_token';

interface AuthPairResponse {
  accessToken: string;
  refreshToken: string;
}

export interface MyStkJwtPayload {
  features: string[];
  /** @type dd-MM-YYYY HH:mm:ss */
  recoveryPasswordExpiration?: string;
}
// standard claims https://datatracker.ietf.org/doc/html/rfc7519#section-4.1
export interface JwtPayload {
  iss?: string | undefined;
  sub?: string | undefined;
  aud?: string | string[] | undefined;
  exp?: number | undefined;
  nbf?: number | undefined;
  iat?: number | undefined;
  jti?: string | undefined;
}

export function jwtOptionsFactory(): JwtConfig {
  return {
    allowedDomains: ['stk.fpma.church'],
    tokenGetter: () => accessToken$.pipe(take(1)).toPromise(),
  };
}

const accessToken$ = new BehaviorSubject<string|null>(null);

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseAPI = 'https://stk.fpma.church/api/mystk';
  private readonly refreshToken$ = new BehaviorSubject<string|null>(null);
  private readonly accessTokenPayload$: Observable<JwtPayload & MyStkJwtPayload | null>  = this.getAccessTokenPayload();
  private readonly userId$ = this.accessTokenPayload$.pipe(
    map(jwt => jwt?.sub),
  );

  constructor(
    private storage: Storage,
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private router: Router,
  ) { }


  getMyId() {
    return this.userId$.pipe(
      take(1),
    );
  }

  logIn(login: string, password: string) {
    return this.http.post<AuthPairResponse>(`${this.baseAPI}/auth`, { login, password }).pipe(
      switchMap(({ accessToken, refreshToken }) => forkJoin([
        this.setAccesToken(accessToken),
        this.setRefreshToken(refreshToken)
      ])),
    )
  }

  async logOut() {
    await this.setAccesToken(null);
    await this.setRefreshToken(null);
    this.isPasswordTemporary$().pipe(
      switchMap(isTemporary => isTemporary
        ? this.invalidateRefreshToken()
        : of(true),
      )
    )
      .subscribe();
    return this.router.navigateByUrl('/');
  }

  private invalidateRefreshToken() {
    const refreshToken = this.refreshToken$.value;
    return refreshToken
      ? this.http.post(`${this.baseAPI}/auth/token/invalidate`, { refreshToken })
      : of();
  }

  isLoggedIn$() {
    return combineLatest([
      this.userId$,
      this.isAccesTokenExpired$(),
    ]).pipe(
      map(([userId, expired]) => !!userId && !expired),
    );
  }

  isPasswordTemporary$() {
    return this.accessTokenPayload$.pipe(
      map(payload => payload?.recoveryPasswordExpiration),
    )
  }

  isAccesTokenExpired$() {
    return accessToken$.pipe(
      map(token => token
          ? this.jwtHelper.isTokenExpired(token)
          : true,
        ),
    )
  }

  /**
   * Uses the refresh token to refresh the access token. If no refresh token is available, complete immediately.
   */
  refresh() {
    return combineLatest([this.refreshToken$, this.userId$]).pipe(
      take(1),
      switchMap(([refreshToken, userId]) => (!!refreshToken && userId)
          ? this.http.post<AuthPairResponse>(`${this.baseAPI}/auth/token/refresh`, { refreshToken, userId })
          : EMPTY,
      ),
      tap(({accessToken}) => this.setAccesToken(accessToken)),
      tap(({refreshToken}) => this.setRefreshToken(refreshToken)),
    )
  }

  resetPassword(body: { email: string; }) {
    return this.http.post(`${this.baseAPI}/resetpassword`, body);
  }

  private getAccessTokenPayload() {
    if (this.accessTokenPayload$) {
      return this.accessTokenPayload$;
    } else {
      return from(this.storage.get(AUTH_STORAGE_KEY)).pipe(
        tap(jwtString => {
          if (jwtString) {
            accessToken$.next(jwtString);
          }
        }),
          switchMap(() => accessToken$),
        map(jwtString => jwtString
          ? this.jwtHelper.decodeToken<JwtPayload & MyStkJwtPayload>(jwtString)
          : null,
        ),
        shareReplay({ refCount: false, bufferSize: 1 }),
      );
    }
  }

  private setRefreshToken(refreshToken: string | null): Promise<unknown> {
    this.refreshToken$.next(refreshToken);
    return this.storage.set(REFRESH_STORAGE_KEY, refreshToken);
  }

  private setAccesToken(accessToken: string | null): Promise<unknown> {
    accessToken$.next(accessToken);
    return this.storage.set(AUTH_STORAGE_KEY, accessToken);
  }
}
