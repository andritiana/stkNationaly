import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Presentation } from 'src/app/models/presentation.interface';

@Component({
  selector: 'app-presentation-details',
  templateUrl: 'presentation-details.page.html',
  styleUrls: ['presentation-details.page.scss']
})
export class PresentationDetailsPage {

  public presentation?: Presentation;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitized: DomSanitizer,
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.presentation = this.router.getCurrentNavigation()!.extras.state!.presentation;
      }
    });
  }

  public removeHtmlLink(textHtml: string) {
    let htmlWithoutLink = textHtml.replace(/href/g, 'alt');
    htmlWithoutLink = this.sanitized.bypassSecurityTrustHtml(htmlWithoutLink) as string;
    return htmlWithoutLink;
  }

  goToHome() {
    this.router.navigate(['/tabs/home']);
  }

}
