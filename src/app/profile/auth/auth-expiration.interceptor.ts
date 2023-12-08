import type { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import type { Observable } from 'rxjs';
import { from, of } from 'rxjs';
import { catchError, ignoreElements, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthExpirationInterceptor implements HttpInterceptor {
  private readonly authenticatedPaths = ['/mystk/profile'].map((path) => new RegExp(String.raw`${path}`));

  private toastCtrl = inject(ToastController);

  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (new RegExp(String.raw`/mystk/auth`).test(request.url)) {
      return next.handle(request);
    }
    return this.authService.shouldRefresh$().pipe(
      take(1),
      switchMap((shouldRefresh) => {
        if (shouldRefresh) {
          if (this.authenticatedPaths.some((path) => path.test(request.url))) {
            // need to refresh for the current request
            return this.authService.refresh().pipe(
              catchError((error: unknown) => of({ type: 'FAIL' as const, error })),
              switchMap(({ type: refreshResult, ...otherResults }) => {
                return this.authService.isAccesTokenExpired$().pipe(
                  take(1),
                  switchMap((isExpired) => {
                    if (refreshResult === 'FAIL' && 'error' in otherResults) {
                      console.error(otherResults.error);
                    }
                    if (isExpired) {
                      return from(
                        this.authService
                          .logOut(false)
                          .then(() => this.router.navigateByUrl('/login'))
                          .then(() =>
                            this.toastCtrl.create({
                              message: 'Une reconnexion est nécessaire pour cette action.',
                              buttons: [{ role: 'cancel', text: 'OK' }],
                              duration: 3000,
                              color: 'danger',
                            })
                          )
                          .then(async (toast) => toast.present())
                      ).pipe(ignoreElements());
                    } else {
                      return next.handle(request);
                    }
                  })
                );
              })
            );
          } else {
            // should refresh but the current request doesn't need it so refresh as a side effect
            return next.handle(request).pipe(tap(() => this.authService.refresh().pipe(take(1)).subscribe()));
          }
        } else {
          return next.handle(request);
        }
      })
    );
  }
}
