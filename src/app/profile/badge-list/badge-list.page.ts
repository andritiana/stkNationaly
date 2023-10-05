import type { OnInit } from '@angular/core';
import { Component, HostBinding, inject } from '@angular/core';
import type { Observable} from 'rxjs';
import { Subject, combineLatest, map, shareReplay, startWith } from 'rxjs';

import type { CdkDragDrop} from '@angular/cdk/drag-drop';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import type { Badge, Profile } from '../profile.model';
import { ProfileService } from '../profile.service';
import { FpmaApiService } from 'src/app/services/fpma-api.service';

@Component({
  selector: 'mystk-badge-list-page',
  templateUrl: './badge-list.page.html',
  styleUrls: ['./badge-list.page.scss'],
})
export class BadgeListPage implements OnInit {
  badgeList$!: Observable<Badge[]>;
  profile$!: Observable<Profile>;
  transforms$?: Observable<string[]>;
  drop$ = new Subject<CdkDragDrop<Badge>>();
  isDevMode$ = inject(FpmaApiService).isDevMode$;

  @HostBinding('style.--badge-event-height')
  badgeHeaderHeight = '4.125rem';

  readonly halfHeaderHeight = (Number(this.badgeHeaderHeight.replace('rem', '')) * 16) / 2;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profile$ = this.profileService.getMyProfile();
    this.badgeList$ = combineLatest([
      this.profileService.getMyBadges(),
      this.drop$.pipe(startWith(null)),
    ]).pipe(
      map(([list, drop]) => {
        if (drop) {
          moveItemInArray(list, drop.previousIndex, drop.currentIndex);
        }
        return list;
      }),
      shareReplay({ refCount: true, bufferSize: 1 }),
    );
    this.transforms$ = this.badgeList$.pipe(
      map((list) => {
        const size = list.length;
        return list.map((_, idx) => {
          const translateY = idx < size - 1 ? (this.halfHeaderHeight * idx).toString() + 'px' : '0px';
          const translateZ = (-5 * (size - idx - 1) + 1).toString() + 'px';
          return `translateZ(${translateZ}) translateY(${translateY})`;
        });
      })
    );
  }

  drop(event: CdkDragDrop<Badge>) {
    this.drop$.next(event);
  }
}
