import { Component, Input, OnInit } from '@angular/core';
import { isAfter, isBefore, parseISO } from 'date-fns/esm';
import { Badge, Profile } from '../profile.model';

@Component({
  selector: 'mystk-badge-card',
  templateUrl: './badge-card.component.html',
  styleUrls: ['./badge-card.component.scss']
})
export class BadgeCardComponent implements OnInit {

  @Input()
  badge?: Badge;
  @Input()
  profile?: Profile;

  badgeView!: EventBadge;
  qrCodeData: string = '';

  constructor() { }

  ngOnInit(): void {
    const { building = '', floor = '', id = '' } = this.badge?.roomInfos.match(/BAT-(?<building>[^-]*)-(?<floor>[^-]*)-CH(?<id>[^-]*)/)?.groups ?? {}
    const profile = this.profile;
    const room = { building, floor, id };
    this.badgeView = {
      event: this.badge?.eventName ?? '',
      fullName: profile?.firstname.trim()
        .replace(/^(.)(.*)/, (substr, firstLetter: string, otherLetters: string) => firstLetter + otherLetters) + ` ${profile?.lastname.toUpperCase()}`,
      groups: this.badge?.remarks?.split('|') ?? [],
      location: {
        district: profile?.entityRegion ?? '',
        tafo: profile?.entityName ?? '',
      },
      responsabilities: profile?.responsabilities?.map(({ name }) => name) ?? [],
      room,
      meals: null,//{ total: 7, remaining: 7 },
      timeCategory: this.badge ? this.computeTimeCategory(this.badge) : 'past',
    }

    this.qrCodeData = this.badge?.badgeString ?? '';
  }

  computeTimeCategory(badge: Badge): EventBadge['timeCategory'] {
    const { eventStartAt, eventEndAt } = badge;
    const now = new Date();

    if (isBefore(now, parseISO(eventStartAt))) {
      return 'future';
    } else if (isAfter(now, parseISO(eventEndAt))) {
      return 'past';
    } else {
      return 'current'
    }
  }

  join(arr: unknown[], separator = ' ') {
    return arr.join(separator);
  }

}

interface EventBadge {
  event: string;
  fullName: string;
  responsabilities: string[];
  location: {
    tafo: string;
    district: string;
  }
  groups: string[];
  room: {
    id: string;
    building: string;
    floor: string
  } | null,
  meals: {
    total: number;
    remaining: number;
  } | null,
  timeCategory: 'past' | 'current' | 'future';
}
