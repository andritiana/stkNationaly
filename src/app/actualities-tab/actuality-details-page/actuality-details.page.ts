import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { ArticleEmbeddingIframeComponent } from 'src/app/articles/article-embedding-iframe/article-embedding-iframe.component';
import { Actualities } from 'src/app/models/actuality.interface';
import { DateHelper } from 'src/app/utils/date-helper';

@Component({
  selector: 'app-actuality-details',
  templateUrl: 'actuality-details.page.html',
  styleUrls: ['actuality-details.page.scss'],
})
export class ActualityDetailsPage {

  @ViewChild(IonSlides, { static: false }) slides: IonSlides;
  @ViewChildren(ArticleEmbeddingIframeComponent) articlesWithPlayer: QueryList<ArticleEmbeddingIframeComponent>;

  public actualities: Actualities[];
  public DateHelper = DateHelper;
  public actualityId: number;
  public loading = true;
  currentIndex$ = new BehaviorSubject(0);

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
      if (this.router.getCurrentNavigation().extras.state) {
        this.actualities = this.router.getCurrentNavigation().extras.state.actualities;
        this.actualityId = this.router.getCurrentNavigation().extras.state.id;
        this.slideOpts.initialSlide = this.actualityId;
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
