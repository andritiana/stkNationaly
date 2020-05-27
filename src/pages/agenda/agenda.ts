import { Component, ViewChild } from "@angular/core";
import { NavController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { AgendaEvent } from "../../models/agenda-event.interface";
import { FpmaApiService } from "../../services/fpma-api/fpma-api.service";
import { DateHelper } from "../../services/utils/date-helper";
import { CalendarComponent } from "ionic2-calendar/calendar";
import { Slides } from 'ionic-angular';

@Component({
  selector: 'agenda-page',
  templateUrl: 'agenda.html'
})

export class AgendaPage {
  public url: string;
  public events: AgendaEvent[];
  public DateHelper = DateHelper;
  public loading = true;
  @ViewChild(CalendarComponent, null) myCalendar: CalendarComponent;
  @ViewChild(Slides) slides: Slides;
  eventSource = [];

  calendar = {
    mode: 'month',
    currentDate: new Date(),
  };
  selectedDate = new Date();
  title;
  isToday: boolean;

  constructor(public fpmaApiService: FpmaApiService, public navCtrl: NavController) {
  }

  changeMode(mode) {
    this.calendar.mode = mode;
  }
  
  // loadEvents(){
  //   this.eventSource = this.createRandomEvents();
  // }
  onViewTitleChanged(title) {
    this.title = title;
  }

  onEventSelected(event) {
    console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
  }

  onTimeSelected(ev) {
    console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' +
      (ev.events !== undefined && ev.events.length !== 0) + ', disabled: ' + ev.disabled);
  }

  onCurrentDateChanged(event: Date) {
    console.log('current date change: ' + event);
  }

  onRangeChanged(ev) {
    console.log('range changed: startTime: ' + ev.startTime + ', endTime: ' + ev.endTime);
  }

  ionViewDidLoad() {
    this.loadEvents();
    this.loadAgenda();
  }

  today() {
    this.calendar.currentDate = new Date();
  }

  loadEvents() {
    this.fpmaApiService.loadAgenda().subscribe(events => {
      for (let i = 0; i < events.length; i++) {
        console.log(events[i].startDate);
        this.eventSource.push({
          title: events[i].title,
          startTime: events[i].startDate,
          endTime: events[i].endDate,
          allDay: false,
        });
      }
      this.myCalendar.loadEvents();
    })
  }

  loadAgenda() {
    this.loading = true;
    this.fpmaApiService.loadAgenda().subscribe((events: AgendaEvent[]) => {
      this.events = events;
      this.loading = false;
    }, err => {
      this.loading = false;
      console.log(err);
    });
  }

  isDateValid(date: Date) {
    if (date.toString() !== 'Invalid Date') {
      return true;
    } else {
      return false;
    }
  }

  goToHome() {
    this.navCtrl.parent.select(0);
  }

  public refresh() {
    this.loadAgenda();
  }
}
