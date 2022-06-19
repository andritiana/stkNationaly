import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtConfig, JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, combineLatest, concat, EMPTY, from, Observable, ReplaySubject } from 'rxjs';
import { map, pluck, shareReplay, startWith, switchMap, take, tap } from 'rxjs/operators';

const AUTH_STORAGE_KEY = 'auth_token';
const REFRESH_STORAGE_KEY = 'refresh_token';

interface AuthPairResponse {
  accessToken: string;
  refreshToken: string;
}

export interface MyStkJwtPayload {
  features: string[];
  /** @type seconds since the Epoch */
  recoveryPasswordExpirationDate?: string;
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
  const storage = inject(Storage);
  return {
    allowedDomains: ['stk.fpma.church'],
    tokenGetter: () => storage.get(AUTH_STORAGE_KEY)
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseAPI = 'https://stk.fpma.church/api/mystk';
  private readonly accessToken$ = new BehaviorSubject<string|null>(null);
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
    return this.userId$;
  }

  logIn(login: string, password: string) {
    return this.http.post<AuthPairResponse>(`${this.baseAPI}/auth`, { login, password }).pipe(
      tap(({accessToken}) => this.setAccesToken(accessToken)),
      tap(({refreshToken}) => this.setRefreshToken(refreshToken)),
    )
  }

  logOut() {
    this.setAccesToken(null);
    this.setRefreshToken(null);
    return this.router.navigateByUrl('/');
  }

  isLoggedIn$() {
    return combineLatest([
      this.userId$,
      this.isAccesTokenExpired$(),
    ]).pipe(
      map(([userId, expired]) => !!userId && !expired),
    );
  }

  isAccesTokenExpired$() {
    return this.accessToken$.pipe(
      map(token => token
          ? this.jwtHelper.isTokenExpired(token)
          : true,
        ),
    )
  }

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
    return this.http.post(`${this.baseAPI}/resetpassword`, { body });
  }

  private getAccessTokenPayload() {
    if (this.accessTokenPayload$) {
      return this.accessTokenPayload$;
    } else {
      return from(this.storage.get(AUTH_STORAGE_KEY)).pipe(
        tap(jwtString => {
          if (jwtString) {
            this.accessToken$.next(jwtString);
          }
        }),
          switchMap(() => this.accessToken$),
      ).pipe(
        map(jwtString => jwtString
          ? this.jwtHelper.decodeToken<JwtPayload & MyStkJwtPayload>(jwtString)
          : null,
        ),
        shareReplay({ refCount: true, bufferSize: 1 }),
      );
    }
  }

  private setRefreshToken(refreshToken: string | null): void {
    this.refreshToken$.next(refreshToken);
    this.storage.set(REFRESH_STORAGE_KEY, refreshToken);
  }

  private setAccesToken(accessToken: string | null): void {
    this.accessToken$.next(accessToken);
    this.storage.set(AUTH_STORAGE_KEY, accessToken);
  }
}
