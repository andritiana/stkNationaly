import { Component, ViewChild } from '@angular/core';
import { FpmaApiService } from '../services/fpma-api.service';
import { AgendaEvent } from '../models/agenda-event.interface';
import { DateHelper } from '../utils/date-helper';
import { Router } from '@angular/router';
import { ContentUpdateService } from '../services/content-update.service';
import { CalendarComponent } from 'ionic2-calendar';


@Component({
  selector: 'app-agenda-tab',
  templateUrl: 'agenda-tab.page.html',
  styleUrls: ['agenda-tab.page.scss']
})
export class AgendaTabPage {

  public url: string;
  public events: AgendaEvent[];
  public DateHelper = DateHelper;
  public loading = true;

  public currentMonth: string;
  public calendar = {
    mode: 'month',
    currentDate: new Date(),
  };
 
  public selectedDate: Date;

  @ViewChild(CalendarComponent) myCal: CalendarComponent;

  constructor(
    private fpmaApiService: FpmaApiService,
    private router: Router,
    private contentUpdateService: ContentUpdateService
    ) {
    this.loadAgenda();
    this.contentUpdateService.resetNbUpdated('events');
  }

  private loadAgenda(){
    this.loading = true;
    this.fpmaApiService.loadAgenda().subscribe((events: AgendaEvent[]) => {
        this.events = events;
        this.loading = false;
      }, err => {
        this.loading = false;
        console.log(err);
      });
  }

  public isDateValid(date: Date) {
    if (date.toString() !== 'Invalid Date') {
      return true;
    } else {
      return false;
    }
  }

  public refresh() {
    this.loadAgenda();
  }

  public goToHome() {
    this.router.navigate(['/tabs/tab0']);
  }

  public next() {
    this.myCal.slideNext();
  }
 
  public back() {
    this.myCal.slidePrev();
  }

  // Selected date reange and hence title changed
  onViewTitleChanged(title) {
    this.currentMonth = title;
  }

  public onEventSelected(event: AgendaEvent ) {
    this.router.navigate(['/tabs/agenda-tab/' + event.id]);

  }
}
