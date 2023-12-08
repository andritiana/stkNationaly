import { formatDate } from '@angular/common';
import { Component, LOCALE_ID, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import type { NavigationExtras } from '@angular/router';
import { Router } from '@angular/router';
import type { RefresherEventDetail } from '@ionic/core';
import { add, compareAsc, format, getMonth, getYear, isSameDay, isSameMinute } from 'date-fns/esm';
import { fr } from 'date-fns/esm/locale';
import { CalendarComponent } from 'ionic2-calendar';
import type { AgendaEvent } from '../models/agenda-event.interface';
import { ContentUpdateService } from '../services/content-update.service';
import { CacheService } from '../utils/cache/cache';
import { AgendaService } from './../agenda/agenda.service';


@Component({
  selector: 'app-agenda-tab',
  templateUrl: 'agenda-tab.page.html',
  styleUrls: ['agenda-tab.page.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [CacheService, AgendaService],
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
  readonly locale = inject(LOCALE_ID);
  private readonly agendaService = inject(AgendaService);

  @ViewChild(CalendarComponent, { static: true }) myCal: CalendarComponent | undefined;

  constructor(
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
    this.agendaService.agendaCache.expireAll();
  }

  computeEventTime = (event: Pick<AgendaEvent, 'startTime' | 'endTime' | 'allDay'>) => {
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

  onEventSelected(event: AgendaEvent) {
    const navigationExtras: NavigationExtras = { state: { events: this.events, id: [event.startTime, event.title].join('_') } };
    this.router.navigate(['/tabs/agenda-tab/details'], navigationExtras);
  }

  refresh(evt?: CustomEvent<RefresherEventDetail>) {
    if (this.loading === false) {
      this.loading = true;
      this.agendaService.agendaCache.refreshAll().finally(() => {
        this.loading = false;
        evt?.detail.complete();
      });
    }
  }

  private loadNewAgenda(m: number, y: number) {
    this.agendaService
      .loadMonthsEventsAgenda(m, y)
      .subscribe(
        (events: AgendaEvent[]) => {
          this.events = events.sort(({startTime: a}, {startTime: b}) => compareAsc(a, b));
          this.loading = false;
        },
        (err: unknown) => {
          this.loading = false;
        }
      );
  }
}
