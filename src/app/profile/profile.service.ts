import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY } from 'rxjs';
import type { Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import type { Profile, Badge } from './profile.model';
import { CacheBuffer } from '../utils/cache/cache';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly baseAPI = 'https://stk.fpma.church/api/mystk';
  private readonly profileCache = new CacheBuffer<Profile>();

  constructor(
    private authService: AuthService,
    private http: HttpClient,
  ) {
    this.authService.isAccesTokenExpired$().pipe(
      filter(isExpired => isExpired),
    ).subscribe(() => {
      this.profileCache.expireNow();
    })
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
      this.profileCache.cacheEm(),
    )
  }

  getMyBadges(): Observable<Badge[]> {
    return this.authService.getMyId().pipe(
      switchMap(id => {
        if (id == null) {
          return EMPTY;
        } else {
          return this.http.get<Badge[]>(`${this.baseAPI}/profile/${id}/badges`)
        }
      })
    )
  }
}

function correctNulls(o: object) {
  return JSON.parse(JSON.stringify(o, (k, v) =>
    /null/i.test(v)
      ? null
      : v,
  ));
}
