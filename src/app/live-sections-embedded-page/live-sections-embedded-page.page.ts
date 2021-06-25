import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-live-sections-embedded-page',
  templateUrl: './live-sections-embedded-page.page.html',
  styleUrls: ['./live-sections-embedded-page.page.scss'],
})
export class LiveSectionsEmbeddedPagePage {

  public title: string;
  public url: string;
  public loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
    ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.title = this.router.getCurrentNavigation().extras.state.title;
        this.url = this.router.getCurrentNavigation().extras.state.url;
      }
    });
  }

  goToHome() {
    this.router.navigate(['/tabs/tab0']);
  }

  getUrlSanitized() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

}
