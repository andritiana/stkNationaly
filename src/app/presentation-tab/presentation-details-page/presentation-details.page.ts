import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Presentation } from 'src/app/models/presentation.interface';
import { DomSanitizer } from '@angular/platform-browser';
import { FpmaApiService } from 'src/app/services/fpma-api.service';

@Component({
  selector: 'app-presentation-details',
  templateUrl: 'presentation-details.page.html',
  styleUrls: ['presentation-details.page.scss']
})
export class PresentationDetailsPage {

  public presentation: Presentation;
  public presentationId: number;
  public loading = true;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitized: DomSanitizer,
    private fpmaApiService: FpmaApiService,
    private actRoute: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
        this.presentationId = this.actRoute.snapshot.params.id;
        this.loadPresentation(this.presentationId);
    });
  }

  private loadPresentation(id){
    this.loading = true;
    this.fpmaApiService.loadPresentation(id).subscribe((presentation: Presentation | null) => {
      this.presentation = presentation;
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

}
