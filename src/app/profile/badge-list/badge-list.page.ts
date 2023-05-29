import { Component, OnInit } from '@angular/core';
import type { Observable } from 'rxjs';
import type { Badge, Profile } from '../profile.model';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'mystk-badge-list-page',
  templateUrl: './badge-list.page.html',
  styleUrls: ['./badge-list.page.scss']
})
export class BadgeListPage implements OnInit {
  badgeList$!: Observable<Badge[]>;
  profile$!: Observable<Profile>;

  constructor(
    private profileService: ProfileService,
  ) { }

  ngOnInit(): void {
    this.profile$ = this.profileService.getMyProfile();
    this.badgeList$ = this.profileService.getMyBadges();
  }

}
