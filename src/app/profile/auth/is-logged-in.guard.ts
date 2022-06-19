import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { isEmpty, map, switchMap, take } from 'rxjs/operators';
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
        if (route.url[0].path === 'login') {
          if (isLoggedIn) {
            return of(this.router.parseUrl('/profile'));
          } else {
            return of(true)
          }
        }
        else {
          if (isLoggedIn) {
            return of(true);
          } else {
            return this.authService.refresh().pipe(
              isEmpty(),
              map(wontRefresh => {
                if (wontRefresh && route.url[0].path !== 'login') {
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

}
