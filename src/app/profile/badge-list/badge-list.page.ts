import { Component, HostBinding, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';

import type { Badge, Profile } from '../profile.model';
import { ProfileService } from '../profile.service';
import { compareDesc, parseISO } from 'date-fns/esm';

@Component({
  selector: 'mystk-badge-list-page',
  templateUrl: './badge-list.page.html',
  styleUrls: ['./badge-list.page.scss'],
})
export class BadgeListPage implements OnInit {
  badgeList$!: Observable<(Badge & { transform: string })[]>;
  profile$!: Observable<Profile>;
  @HostBinding('style.--badge-event-height')
  badgeHeaderHeight = '4.125rem';

  readonly halfHeaderHeight = (Number(this.badgeHeaderHeight.replace('rem', '')) * 16) / 2;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profile$ = this.profileService.getMyProfile();
    this.badgeList$ = this.profileService.getMyBadges().pipe(
      map((badges) => {
        const size = badges.length;
        return badges
          .map((b, idx) => {
            const translateY = idx < size - 1 ? (this.halfHeaderHeight * idx).toString() + 'px' : '0px';
            const translateZ = (-5 * (size - idx - 1) + 1).toString() + 'px';
            return { ...b, transform: `translateZ(${translateZ}) translateY(${translateY})` };
          });
      })
    );
  }
}
