import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, isEmpty, map, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../auth.service';

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
              isEmpty(),
              catchError(error => error.status === 401 ? of(true) : throwError(error)),
              map(wontRefresh => {
                if (wontRefresh && route.url[0]?.path !== 'login') {
                  return this.router.parseUrl('/login')
                } else {
                  return true;
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
