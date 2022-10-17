import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { ArticleSpi } from 'src/app/models/article-spi.interface';
import { DateHelper } from 'src/app/utils/date-helper';

@Component({
  selector: 'app-spi-details',
  templateUrl: 'spi-details.page.html',
  styleUrls: ['spi-details.page.scss']
})
export class SpiDetailsPage {

  @ViewChild(IonSlides, { static: false }) slides: IonSlides;

  public partages: ArticleSpi[];
  public articleIndex: number;
  public DateHelper = DateHelper;
  currentIndex$ = new BehaviorSubject(0);
  public slideOpts = {
    initialSlide: 1,
    speed: 400,
    slideShadows: false
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private actRoute: ActivatedRoute,
  ) {
    this.route.queryParams.subscribe(params => {
        this.articleIndex = this.actRoute.snapshot.params.id;
        if (this.router.getCurrentNavigation().extras.state) {
          this.partages = this.router.getCurrentNavigation().extras.state.articles;
          this.slideOpts.initialSlide = this.articleIndex;
        }
    });
  }

  async ionSlideDidChange() {
    this.currentIndex$.next(await this.slides.getActiveIndex());
  }

  goToHome() {
    this.router.navigate(['/tabs/home']);
  }

}
