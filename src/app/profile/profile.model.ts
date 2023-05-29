interface Responsability {
  name: string;
  /** @type ISO date only */
  startAt: string;
  /** @type ISO date only */
  endAt: string;
}

export interface Profile {
  firstname: string;
  lastname: string;
  email: string;
  entityName: string;
  entityRegion: string;
  tagValue: string;
  /** @type ISO date only */
  tagExpireAt: string;
  responsabilities: Responsability[];
  ongoingSubscribedEvent: string;
}

export interface Badge {
  badgeString: string;
  roomInfos: string;
  remarks: string | null;
  eventName: string;
  /** @type ISO date only */
  eventStartAt: string;
  /** @type ISO date only */
  eventEndAt: string;
  websiteCategoryId: number;
}

export interface EditProfileBodyRequest {
  email: string;
  oldPassword: string;
  newPassword?: string;
}
