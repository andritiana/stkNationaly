import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleSpi } from 'src/app/models/article-spi.interface';
import { DateHelper } from 'src/app/utils/date-helper';

@Component({
  selector: 'app-spi-details',
  templateUrl: 'spi-details.page.html',
  styleUrls: ['spi-details.page.scss']
})
export class SpiDetailsPage {

  public partages: ArticleSpi[];
  public articleIndex: number;
  public DateHelper = DateHelper;
  public slideOpts = {
    initialSlide: 1,
    speed: 400,
    slideShadows: false
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private actRoute: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
        this.articleIndex = this.actRoute.snapshot.params.id;
        if (this.router.getCurrentNavigation().extras.state) {
          this.partages = this.router.getCurrentNavigation().extras.state.articles;
          this.slideOpts.initialSlide = this.articleIndex;
        }
    });
  }

  goToHome() {
    this.router.navigate(['/tabs/home']);
  }

}
