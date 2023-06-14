import { HttpErrorResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { compareDesc, parseISO } from 'date-fns/esm';
import type { Observable } from 'rxjs';
import { EMPTY, throwError } from 'rxjs';
import { catchError, exhaustMap, filter, map, switchMap } from 'rxjs/operators';
import { createCache } from '../utils/cache/cache';
import { AuthService } from './auth.service';
import type { Badge, EditProfileBodyRequest, Profile } from './profile.model';

export type EventCardInfo = Omit<Badge, 'badgeString' | 'roomInfos' | 'remarks'>;

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  readonly badgeCache = createCache<Badge[]>({expiry: {days: 1}});
  readonly eventsCache = createCache<EventCardInfo>({expiry: {days: 1}});
  readonly profileCache = createCache<Profile>({expiry: {days: 1}});
  private readonly baseAPI = 'https://stk.fpma.church/api/mystk';

  constructor(
    private authService: AuthService,
    private http: HttpClient,
  ) {
    this.authService.isLoggedIn$().pipe(
      filter(isLoggedIn => !isLoggedIn),
    ).subscribe(() => {
      this.profileCache.expireNow();
    })
  }

  editMyProfile(body: EditProfileBodyRequest) {
    return this.authService.getMyId().pipe(
      switchMap(id => this.http.patch(`${this.baseAPI}/profile/${id}`, body)),
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse) {
          switch (error.status) {
            case 401:
              return throwError(() => new Error('Mot de passe invalide'));
            case 403:
              return throwError(() => new Error('Tu n\' as pas accès à cette fonctionnalité'));
            default:
              return throwError(() => new MySTKUnexpectedError('Une erreur est survenue, merci de réessayer', error));
          }
        }
        console.error(error);
        return throwError(() => new MySTKUnexpectedError('Une erreur est survenue, merci de réessayer', error));
      }),
    );
  }

  getMyProfile(): Observable<Profile> {
    return this.authService.getMyId().pipe(
      switchMap(id => {
        if (id == null) {
          return EMPTY;
        } else {
          return this.http.get<Profile>(`${this.baseAPI}/profile/${id}`);
        }
      }),
      map(profile => correctNulls(profile)),
      this.profileCache.doCache(),
    )
  }

  getMyBadges(): Observable<Badge[]> {
    return this.authService.getMyId().pipe(
      switchMap(id => {
        if (id == null) {
          return EMPTY;
        } else {
          return this.http.get<Badge[]>(`${this.baseAPI}/profile/${id}/badges`).pipe(
            map(badges => badges.sort((a, b) => compareDesc(parseISO(b.eventStartAt), parseISO(a.eventStartAt)))),
            this.badgeCache.doCache(),
          )
        }
      })
    )
  }

  /**
   * Extracts events from badges and spreads the resulting array.
   */
  getMyEvents(): Observable<EventCardInfo> {
    return this.getMyBadges()
    .pipe(
      exhaustMap((badges) => badges), // prefer exhaustMap to switchMap so the Observable completes at the end of the array
      map((badge) => {
        const { badgeString, roomInfos, remarks, ...event } = badge;
        return event;
      }),
      this.eventsCache.doCache(),
      // shareReplay({refCount: false, bufferSize: 1, windowTime: milliseconds({days: 1})}),
    );
  }
}

function correctNulls<O extends object>(o: O): O {
  return JSON.parse(JSON.stringify(o, (k, v) =>
    /null/i.test(v)
      ? null
      : v,
  ));
}

class MySTKUnexpectedError extends Error {
  constructor(message: string, private context: unknown) {
    super(message);
  }

  override toString() {
    return `${this.name} : ${this.message}
    ${this.context}

    ${this.stack}`
  }
}
