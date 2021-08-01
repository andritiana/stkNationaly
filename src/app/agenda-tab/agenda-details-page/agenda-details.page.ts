import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AgendaEvent } from 'src/app/models/agenda-event.interface';
import { FpmaApiService } from 'src/app/services/fpma-api.service';
import { DateHelper } from 'src/app/utils/date-helper';

@Component({
  selector: 'app-agenda-details',
  templateUrl: './agenda-details.page.html',
  styleUrls: ['./agenda-details.page.scss'],
})
export class AgendaDetailsPage {

  public DateHelper = DateHelper;

  public event: AgendaEvent;
  public eventId: number;
  public loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitized: DomSanitizer,
    private fpmaApiService: FpmaApiService,
    private actRoute: ActivatedRoute
  ) { 
    this.route.queryParams.subscribe(params => {
      this.eventId = this.actRoute.snapshot.params.id;
      this.loadEvent(this.eventId);
     });
  }

  private loadEvent(id){
    this.loading = true; 
    this.fpmaApiService.loadEvent(id).subscribe((event : AgendaEvent | null) => {
      this.event = event; 
      this.loading = false;
    }, () => {
      this.loading = false;
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
