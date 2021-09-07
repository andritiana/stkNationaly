import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
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

  public events: AgendaEvent[];
  public eventId: number;
  public loading = true;
  public slideOpts = {
    initialSlide: 1,
    speed: 400,
    slideShadows: false
  };


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitized: DomSanitizer,
  ) { 
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.events = this.router.getCurrentNavigation().extras.state.events;
        this.eventId = this.router.getCurrentNavigation().extras.state.id;
        this.slideOpts.initialSlide = this.eventId;
        this.loading = false;
      }
     });
  }

  public removeHtmlLink(textHtml: string) {
    let htmlWithoutLink = textHtml.replace(/href/g, 'alt');
    htmlWithoutLink = this.sanitized.bypassSecurityTrustHtml(htmlWithoutLink) as string;
    return htmlWithoutLink;
  }

  goToHome() {
    this.router.navigate(['/tabs/tab0']);
  }

  public isDateValid(date: Date) {
    if (date.toString() !== 'Invalid Date') {
      return true;
    } else {
      return false;
    }
  }
  
}
