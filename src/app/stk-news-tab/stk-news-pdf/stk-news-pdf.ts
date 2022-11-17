import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-stk-news-pdf-page',
  templateUrl: 'stk-news-pdf.html',
  styleUrls: ['stk-news-pdf.page.scss']
})

export class StkNewsPdfPage {

  public pdf = '';
  public pdfTitle = '';
  public zoomTo = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ){
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        const navState = this.router.getCurrentNavigation()!.extras.state;
        this.pdf = navState?.pdfUrl;
        this.pdfTitle = navState?.title;
      }
    });
  }

  zoom(value: string) {
    switch (value) {
      case 'in' : {
        this.zoomTo = this.zoomTo + 0.25;
        break;
      }
      case 'out' : {
        if (this.zoomTo > 1) {
          this.zoomTo = this.zoomTo - 0.25;
       }
        break;
      }
      default: {
        break;
      }
    }
  }
}
