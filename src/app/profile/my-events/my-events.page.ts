import type { OnInit} from '@angular/core';
import { Component, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { isAfter, isWithinInterval, parseISO } from 'date-fns/esm';
import type { Observable} from 'rxjs';
import { partition, shareReplay, toArray } from 'rxjs';
import { PurifyMethodPipe } from 'src/app/utils/purify-method/purify-method.pipe';
import { GlobalHeaderModule } from '../../global-header/global-header.module';
import type { EventCardInfo} from '../profile.service';
import { ProfileService } from '../profile.service';


@Component({
  standalone: true,
  selector: 'mystk-my-events',
  template: `
    <ion-header>
      <ion-toolbar>
        <app-global-header></app-global-header>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen>
      <main class="my-events-outer">
        <mystk-page-title>Mes évènements</mystk-page-title>
        <p class="my-events-subtitle">Tu peux retrouver ici les infos des évènements auxquels tu es inscrit·e.</p>
        <ion-accordion-group
          multiple
          [value]="['past', 'future', 'ongoing']">
          <ion-accordion value="ongoing" mode="ios">
            <ion-item slot="header"
                      class="my-events-event-time">
              <ion-label>En cours</ion-label>
            </ion-item>
            <ul
              slot="content"
              class="my-events-event-list">
              <li
                class="my-events-event-card ion-activatable"
                *ngFor="let event of ongoingEvent$ | async">
                <a
                  class="my-events-event-card-anchor"
                  [routerLink]="[(event.websiteCategoryId ? event.eventName : '.') | method:replaceSpaces]">
                  <ion-icon
                    class="my-events-event-card-anchor-icon"
                    src="/assets/icon/icon-event.svg"></ion-icon>
                  {{ event.eventName }}
                </a>
                <ion-ripple-effect></ion-ripple-effect>
              </li>
            </ul>
          </ion-accordion>
          <ion-accordion value="future" mode="ios">
            <ion-item slot="header"
                      class="my-events-event-time">
              <ion-label>À venir</ion-label>
            </ion-item>
            <ul
              slot="content"
              class="my-events-event-list">
              <li
                class="my-events-event-card ion-activatable"
                *ngFor="let event of futureEvents$ | async">
                <a
                  class="my-events-event-card-anchor"
                  [routerLink]="[(event.websiteCategoryId ? event.eventName : '.') | method:replaceSpaces]">
                  <ion-icon
                    class="my-events-event-card-anchor-icon"
                    src="/assets/icon/icon-event.svg"></ion-icon>
                  {{ event.eventName }}
                </a>
                <ion-ripple-effect></ion-ripple-effect>
              </li>
            </ul>
          </ion-accordion>
          <ion-accordion value="past" mode="ios">
            <ion-item slot="header"
                      class="my-events-event-time">
              <ion-label>Passés</ion-label>
            </ion-item>
            <ul
              slot="content"
              class="my-events-event-list">
              <li
                class="my-events-event-card ion-activatable"
                *ngFor="let event of pastEvents$ | async">
                <a
                  class="my-events-event-card-anchor"
                  [routerLink]="[(event.websiteCategoryId ? event.eventName : '.') | method:replaceSpaces]">
                  <ion-icon
                    class="my-events-event-card-anchor-icon"
                    src="/assets/icon/icon-event.svg"></ion-icon>
                  {{ event.eventName }}
                </a>
                <ion-ripple-effect></ion-ripple-effect>
              </li>
            </ul>
          </ion-accordion>
        </ion-accordion-group>
      </main>
    </ion-content>
  `,
  styleUrls: ['./my-events.page.scss'],
  imports: [CommonModule, IonicModule, GlobalHeaderModule, RouterModule, PurifyMethodPipe],
})
export class MyEventsPage implements OnInit {
  futureEvents$!: Observable<EventCardInfo[]>;
  ongoingEvent$!: Observable<EventCardInfo[]>;
  pastEvents$!: Observable<EventCardInfo[]>;
  private readonly profileService = inject(ProfileService);

  ionViewDidEnter() {
    const [ongoingEvent$, pastOrFutureEvents$] = partition(
      this.profileService
        .getMyEvents()
        .pipe(shareReplay({ refCount: true })),
      ({ eventStartAt, eventEndAt }) =>
        isWithinInterval(new Date(), { start: parseISO(eventStartAt), end: parseISO(eventEndAt) })
    );

    this.ongoingEvent$ = ongoingEvent$.pipe(toArray());
    [this.pastEvents$, this.futureEvents$] = partition(pastOrFutureEvents$, ({ eventEndAt }) =>
      isAfter(new Date(), parseISO(eventEndAt))
    ).map(e$ => e$.pipe(toArray()));
  }

  ngOnInit(): void {}

  replaceSpaces(txt: string) {
    return txt.replace(' ', '_');
  }
}
