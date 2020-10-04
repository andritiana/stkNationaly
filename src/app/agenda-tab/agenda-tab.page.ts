import { Component } from '@angular/core';
import { FpmaApiService } from '../services/fpma-api.service';
import { AgendaEvent } from '../models/agenda-event.interface';
import { DateHelper } from '../utils/date-helper';
import { Router } from '@angular/router';
import { ContentUpdateService } from '../services/content-update.service';

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
}
