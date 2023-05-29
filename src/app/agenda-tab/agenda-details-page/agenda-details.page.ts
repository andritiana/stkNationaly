import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgendaEvent } from 'src/app/models/agenda-event.interface';
import { DateHelper } from 'src/app/utils/date-helper';

@Component({
  selector: 'app-agenda-details',
  templateUrl: './agenda-details.page.html',
  styleUrls: ['./agenda-details.page.scss'],
})
export class AgendaDetailsPage {

  public DateHelper = DateHelper;

  public events: AgendaEvent[] = [];
  public eventId?: number;
  public loading = true;
  public slideOpts = {
    initialSlide: 1,
    speed: 400,
    slideShadows: false
  };


  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        const navState = this.router.getCurrentNavigation()!.extras.state!;
        this.events = navState.events;
        this.eventId = navState.id;
        this.slideOpts.initialSlide = this.eventId ?? this.slideOpts.initialSlide;
        this.loading = false;
      }
     });
  }

  goToHome() {
    this.router.navigate(['/tabs/home']);
  }

  public isDateValid(date: Date) {
    if (date.toString() !== 'Invalid Date') {
      return true;
    } else {
      return false;
    }
  }

}
