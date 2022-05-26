import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePage implements OnInit {

  badge: EventBadge = {
    fullName: 'Tianasoa DIMBIHARIMANANA',
    positions: ['Président(e) local(e)'],
    location: {
      tafo: 'STK Orléans',
      district: 'FAfAts',
    },
    groups: ['Groupe 2'],
    meals: {
      total: 6,
      remaining: 3,
    },
    room: {
      id: '512',
      bulding: '1',
    }
  };

  qrCodeData = {
    name: this.badge.fullName,
    groups: this.badge.groups,
    id: '12345RNSTK2022'
  }

  constructor() { }

  ngOnInit() {
  }

  join(arr: unknown[], separator = ' ') {
    return arr.join(separator);
  }
}

interface EventBadge {
  fullName: string;
  positions: string[];
  location: {
    tafo: string;
    district: string;
  }
  groups: string[];
  room: {
    id: string;
    bulding: string;
  }
  meals: {
    total: number;
    remaining: number;
  }
}
