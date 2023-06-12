import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, from, Observable, throwError } from 'rxjs';
import { catchError, isEmpty, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthExpirationInterceptor implements HttpInterceptor {
  private readonly authenticatedPaths = ['/mystk/profile'].map(
    (path) => new RegExp(String.raw`${path}`)
  );

  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
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
              isEmpty(),
              catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                  return throwError(() => this.router.navigateByUrl('/login')).pipe(
                    switchMap(() => EMPTY)
                  );
                } else {
                  return throwError(() => error);
                }
              }),
              switchMap((wontRefresh) => {
                return this.authService.isAccesTokenExpired$().pipe(
                  take(1),
                  switchMap((isExpired) => {
                    if (wontRefresh && isExpired) {
                      return from(this.authService.logOut(true)).pipe(switchMap(() => EMPTY));
                    } else {
                      return next.handle(request);
                    }
                  })
                );
              })
            );
          } else {
            // should refresh but the current request doesn't need it so refresh as a side effect
            return next
              .handle(request)
              .pipe(
                tap(() => this.authService.refresh().pipe(take(1)).subscribe())
              );
          }
        } else {
          return next.handle(request);
        }
      })
    );
  }
}
