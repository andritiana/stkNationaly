import { Component, ViewChild } from '@angular/core';
import { FpmaApiService } from '../services/fpma-api.service';
import { AgendaEvent } from '../models/agenda-event.interface';
import { DateHelper } from '../utils/date-helper';
import { NavigationExtras, Router } from '@angular/router';
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
  public start = 0;

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
      });
  }

  private loadNewAgenda(m: String, y: String){
      this.fpmaApiService.loadMonthsEventsAgenda(m,y).subscribe((events: AgendaEvent[]) =>{ 
          this.events = events;
          this.loading = false;
        }, err => {
          this.loading = false;
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
    this.router.navigate(['/tabs/home']);
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

    const monthNames = {
      "janvier":"01", 
      "février":"02",
      "mars":"03",
      "avril":"04",
      "mai":"05",
      "juin":"06",
      "juillet":"07",
      "août":"08",
      "septembre":"09",
      "octobre":"10",
      "novembre":"11",
      "décembre":"12"
    }

    var monthText = title.substr(0,title.length-5);
    var monthNum = monthNames[monthText]
    var year = title.substr(title.length-4)
    this.loadNewAgenda(monthNum, year)
  }

  public onEventSelected(event: AgendaEvent) {
    const navigationExtras: NavigationExtras = { state: { events: this.events, id: event.id } };
    this.router.navigate(['/tabs/agenda-tab/details'], navigationExtras);
  }
}
