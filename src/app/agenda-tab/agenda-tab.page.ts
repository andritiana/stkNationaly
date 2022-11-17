import { Component, ViewChild } from '@angular/core';
import { FpmaApiService } from '../services/fpma-api.service';
import type { AgendaEvent } from '../models/agenda-event.interface';
import { DateHelper } from '../utils/date-helper';
import type { NavigationExtras } from '@angular/router';
import { Router } from '@angular/router';
import { ContentUpdateService } from '../services/content-update.service';
import { CalendarComponent } from 'ionic2-calendar';

@Component({
  selector: 'app-agenda-tab',
  templateUrl: 'agenda-tab.page.html',
  styleUrls: ['agenda-tab.page.scss'],
})
export class AgendaTabPage {
  url = '';
  events: AgendaEvent[] = [];
  DateHelper = DateHelper;
  loading = true;
  start = 0;

  currentMonth: string | undefined;
  calendar = {
    mode: 'month',
    currentDate: new Date(),
  };

  selectedDate: Date | undefined;

  @ViewChild(CalendarComponent) myCal: CalendarComponent | undefined;

  constructor(
    private fpmaApiService: FpmaApiService,
    private router: Router,
    private contentUpdateService: ContentUpdateService
  ) {
    this.loadAgenda();
    this.contentUpdateService.resetNbUpdated('events');
  }

  private loadAgenda() {
    this.loading = true;
    this.fpmaApiService.loadAgenda().subscribe(
      (events: AgendaEvent[]) => {
        this.events = events;
        this.loading = false;
      },
      (err) => {
        this.loading = false;
      }
    );
  }

  private loadNewAgenda(m: string, y: string) {
    this.fpmaApiService.loadMonthsEventsAgenda(m, y).subscribe(
      (events: AgendaEvent[]) => {
        this.events = events;
        this.loading = false;
      },
      (err) => {
        this.loading = false;
      }
    );
  }

  isDateValid(date: Date) {
    if (date.toString() !== 'Invalid Date') {
      return true;
    } else {
      return false;
    }
  }

  refresh() {
    this.loadAgenda();
  }

  goToHome() {
    this.router.navigate(['/tabs/home']);
  }

  next() {
    this.myCal?.slideNext();
  }

  back() {
    this.myCal?.slidePrev();
  }

  // Selected date range hence title changed
  onViewTitleChanged(title: string) {
    this.currentMonth = title;

    const monthNames = {
      janvier: '01',
      février: '02',
      mars: '03',
      avril: '04',
      mai: '05',
      juin: '06',
      juillet: '07',
      août: '08',
      septembre: '09',
      octobre: '10',
      novembre: '11',
      décembre: '12',
    };

    const monthText = title.slice(0, -5) as keyof typeof monthNames;
    const monthNum = monthNames[monthText];
    const year = title.slice(-4);
    this.loadNewAgenda(monthNum, year);
  }

  onEventSelected(event: AgendaEvent) {
    const navigationExtras: NavigationExtras = { state: { events: this.events, id: event.id } };
    this.router.navigate(['/tabs/agenda-tab/details'], navigationExtras);
  }
}
