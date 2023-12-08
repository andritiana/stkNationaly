import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, isEmpty, map, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedInGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.authService.isLoggedIn$().pipe(
      take(1),
      switchMap(isLoggedIn => {
        if (route.url[0]?.path === 'login') {
          if (isLoggedIn) {
            return this.allowUnlessTemporaryPassword('/profile');
          } else {
            return of(true);
          }
        }
        else {
          if (isLoggedIn) {
            return this.allowUnlessTemporaryPassword();
          } else {
            return this.authService.refresh().pipe(
              catchError((error: unknown) => {
                if (error instanceof HttpErrorResponse && error.status === 401) {
                  return of({type: 'FAIL'});
                } else {
                  console.error('refreshing token failed in guard %o', error);
                  return throwError(() => error);
                }
              }),
              map(({type: refreshResult}) => {
                if (['SUCCESS', 'FRESH'].includes(refreshResult)) {
                  return true;
                } else {
                  return this.router.parseUrl('/login')
                }
              }),
            );
          }
        }
      }),
    );
  }


  private allowUnlessTemporaryPassword(redirect?: string): Observable<boolean> | Observable<true | UrlTree> {
    return this.authService
      .isPasswordTemporary$()
      .pipe(
        take(1),
        map((isTemporary) => isTemporary ? this.router.parseUrl('/profile/edit')
          : (redirect ? this.router.parseUrl(redirect) : true)
        )
      );
  }
}
