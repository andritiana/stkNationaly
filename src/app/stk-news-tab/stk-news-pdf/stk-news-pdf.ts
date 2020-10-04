import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-stk-news-pdf-page',
  templateUrl: 'stk-news-pdf.html'
})

export class StkNewsPdfPage {

  public pdf: string;
  public pdfTitle: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ){
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.pdf = this.router.getCurrentNavigation().extras.state.pdfUrl;
        this.pdfTitle = this.router.getCurrentNavigation().extras.state.title;
      }
    });
  }
}
