import { Component, inject } from '@angular/core';
import { Platform, RefresherEventDetail } from '@ionic/angular';
import { UntilDestroy } from '@ngneat/until-destroy';
import { addWeeks } from 'date-fns';
import { isAfter, parseISO } from 'date-fns/esm';
import OneSignal from 'onesignal-cordova-plugin';
import type { Observable, Subscription } from 'rxjs';
import { bindCallback, combineLatest, map } from 'rxjs';
import { AuthService } from './auth.service';
import type { Profile } from './profile.model';
import { ProfileService } from './profile.service';

const EVENT_PARTICIPATION_KEY = 'event_participation';
const ADDITIONAL_KEY = 'additional_tag';
interface MySTKTag {
  [ADDITIONAL_KEY]: string;
  [EVENT_PARTICIPATION_KEY]: string;
}

let readTagsOnce = false;

@UntilDestroy()
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  loading$!: Observable<boolean>;
  myProfile$?: Observable<Profile>;
  private platform = inject(Platform);

  constructor(private profileService: ProfileService, private authService: AuthService) {}

  ngOnInit() {
    this.profileService.profileCache.setExpiration(1000 * 60 * 10);
    this.loading$ = this.profileService.profileCache.getEvents().isLoading$();
    this.myProfile$ = this.profileService.getMyProfile();

    void this.platform.ready().then((readySource) => {
      if (readySource === 'cordova' && !readTagsOnce) {
        this.sendOrDeleteEventTags();
        readTagsOnce = true;
      }

    });
  }

  logOut() {
    return this.authService.logOut();
  }

  public async refresh(evt: CustomEvent<RefresherEventDetail>) {
    await this.profileService.profileCache.refresh();
    evt.detail.complete();
  }

  private sendOrDeleteEventTags(): Subscription {
    return combineLatest([
      bindCallback((cb: (tags: Partial<MySTKTag>) => void) => OneSignal.getTags(cb))(),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.myProfile$!.pipe(
        map(({ ongoingSubscribedEvent, tagValue, tagExpireAt }) => ({
          ongoingSubscribedEvent: ongoingSubscribedEvent?.replace(/ /g, '_'),
          tagValue,
          tagExpireAt,
        }))
      ),
    ])
      // we want to keep the request going even if navigating through profile
      // eslint-disable-next-line rxjs-angular/prefer-takeuntil
      .subscribe(([tags, { ongoingSubscribedEvent, tagExpireAt, tagValue }]) => {
        const mySTKTags: Partial<MySTKTag> = {};
        const mySTKTags2Delete: (keyof MySTKTag)[] = [];

        if (tagIsNotPresent(tags, EVENT_PARTICIPATION_KEY, ongoingSubscribedEvent)) {
          mySTKTags[EVENT_PARTICIPATION_KEY] = ongoingSubscribedEvent;
        } else if (tags[EVENT_PARTICIPATION_KEY]) {
          mySTKTags2Delete.push(EVENT_PARTICIPATION_KEY);
        }

        const tagExpiryDate = parseISO(tagExpireAt ?? addWeeks(new Date(), 1).toISOString());
        if (tagIsNotPresent(tags, ADDITIONAL_KEY, tagValue) && isAfter(tagExpiryDate, new Date())  && !!tagValue) {
          mySTKTags[ADDITIONAL_KEY] = tagValue;
        } else if (tags[ADDITIONAL_KEY]) {
          mySTKTags2Delete.push(ADDITIONAL_KEY);
        }

        if (Object.keys(mySTKTags).length > 0) {
          OneSignal.sendTags(mySTKTags);
        }
        if (mySTKTags2Delete.length > 0) {
          OneSignal.deleteTags(mySTKTags2Delete);
        }
      });

      function tagIsNotPresent(tags: Partial<MySTKTag>, key: keyof MySTKTag, value: string) {
        return !(tags[key]?.includes(value) ?? false);
      }
  }
}
