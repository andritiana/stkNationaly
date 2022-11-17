import type { QueryList} from '@angular/core';
import { Component, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { ArticleEmbeddingIframeComponent } from 'src/app/articles/article-embedding-iframe/article-embedding-iframe.component';
import type { Actualities } from 'src/app/models/actuality.interface';
import { DateHelper } from 'src/app/utils/date-helper';

@Component({
  selector: 'app-actuality-details',
  templateUrl: 'actuality-details.page.html',
  styleUrls: ['actuality-details.page.scss'],
})
export class ActualityDetailsPage {

  @ViewChild(IonSlides, { static: false }) slides: IonSlides | undefined;
  @ViewChildren(ArticleEmbeddingIframeComponent) articlesWithPlayer: QueryList<ArticleEmbeddingIframeComponent> | undefined;

  public actualities: Actualities[] | undefined;
  public DateHelper = DateHelper;
  public actualityId: number | undefined;
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
      if (this.router.getCurrentNavigation()?.extras.state) {
        const navState = this.router.getCurrentNavigation()?.extras.state;
        this.actualities = navState?.actualities;
        this.actualityId = navState?.id;
        this.slideOpts.initialSlide = this.actualityId ?? 1;
      }
    });
  }

  async ionSlideDidChange() {
    this.currentIndex$.next(await this.slides!.getActiveIndex());
  }

  goToHome() {
    this.router.navigate(['/tabs/home']);
  }

}
