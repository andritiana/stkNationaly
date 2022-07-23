import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class HasTemporaryPasswordGuard implements CanDeactivate<unknown> {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.isPasswordTemporary$().pipe(
      take(1),
      switchMap(isTemporary => isTemporary
        ? this.authService.logOut()
        : of(true),
      )
    )
  }

}
