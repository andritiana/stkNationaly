import { formatDate } from '@angular/common';
import { Component, LOCALE_ID, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import type { NavigationExtras } from '@angular/router';
import { Router } from '@angular/router';
import type { RefresherEventDetail } from '@ionic/core';
import { add, format, getMonth, getYear, isSameDay, isSameMinute } from 'date-fns/esm';
import { fr } from 'date-fns/esm/locale';
import { CalendarComponent } from 'ionic2-calendar';
import type { AgendaEvent } from '../models/agenda-event.interface';
import { ContentUpdateService } from '../services/content-update.service';
import { FpmaApiService } from '../services/fpma-api.service';
import { CacheService, createCacheByKey } from '../utils/cache/cache';

@Component({
  selector: 'app-agenda-tab',
  templateUrl: 'agenda-tab.page.html',
  styleUrls: ['agenda-tab.page.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [CacheService],
})
export class AgendaTabPage {
  url = '';
  events: AgendaEvent[] = [];
  loading = true;
  start = 0;

  currentMonth: string | undefined;
  calendar = {
    mode: 'month' as const,
    currentDate: new Date(),
    queryMode: 'remote' as const,
  };
  readonly agendaCache = createCacheByKey<string, AgendaEvent[]>({ expiry: { minutes: 10 } });
  readonly locale = inject(LOCALE_ID);

  @ViewChild(CalendarComponent, { static: true }) myCal: CalendarComponent | undefined;

  constructor(
    private fpmaApiService: FpmaApiService,
    private router: Router,
    private contentUpdateService: ContentUpdateService
  ) {}

  ionViewWillEnter() {
    /* could be today or the last selected date if we entered the page before */
    const currentDay = this.myCal?.currentDate ?? this.calendar.currentDate;
    this.loadNewAgenda(getMonth(currentDay) + 1, getYear(currentDay));
  }
  ionViewDidEnter() {
    this.contentUpdateService.resetNbUpdated('events');
  }
  ionViewDidLeave() {
    this.agendaCache.expireAll();
  }

  computeEventTime = (event: AgendaEvent) => {
    const { startTime, endTime, allDay } = event;
    if (!allDay) {
      let format: string;
      if (isSameDay(startTime, endTime)) {
        format = 'HH:mm';
      } else {
        format = 'dd/MM/yyyy';
      }
      return (isSameMinute(startTime, endTime) ? [startTime] : [startTime, endTime])
        .map((t) => formatDate(t, format, this.locale))
        .join(' - ');
    } else {
      return 'Toute la journée';
    }
  };

  isDateValid(date: Date) {
    if (date.toString() !== 'Invalid Date') {
      return true;
    } else {
      return false;
    }
  }

  next() {
    this.loading = true;
    this.myCal?.slideNext();
  }

  back() {
    this.loading = true;
    this.myCal?.slidePrev();
  }

  calendarViewRangeChanged(e: { startTime: Date; endTime: Date }) {
    const { startTime } = e;
    this.loading = true;
    const dayInViewedMonth = add(startTime, { weeks: 1 });
    this.currentMonth = format(dayInViewedMonth, 'MMMM yyyy', { locale: fr });

    const monthNum = getMonth(dayInViewedMonth) + 1;
    const year = getYear(dayInViewedMonth);
    this.loadNewAgenda(monthNum, year);
  }

  onEventSelected(event: Pick<AgendaEvent, 'id'>) {
    const navigationExtras: NavigationExtras = { state: { events: this.events, id: event.id } };
    this.router.navigate(['/tabs/agenda-tab/details'], navigationExtras);
  }

  refresh(evt?: CustomEvent<RefresherEventDetail>) {
    if (this.loading === false) {
      this.loading = true;
      this.agendaCache.refreshAll().finally(() => {
        this.loading = false;
        evt?.detail.complete();
      });
    }
  }

  private loadNewAgenda(m: number, y: number) {
    this.fpmaApiService
      .loadMonthsEventsAgenda(m, y)
      .pipe(this.agendaCache.doCacheByKey([m, y].join('-')))
      .subscribe(
        (events: AgendaEvent[]) => {
          this.events = events;
          this.loading = false;
        },
        (err: unknown) => {
          this.loading = false;
        }
      );
  }
}
