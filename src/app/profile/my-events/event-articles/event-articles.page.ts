import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ForModule } from '@rx-angular/template/for';
import { LetModule } from '@rx-angular/template/let';
import { BehaviorSubject, Observable, combineLatest, distinctUntilChanged, exhaustMap, filter, map, of, shareReplay, switchMap, take, tap } from 'rxjs';
import { ArticleEmbeddingIframeComponentModule } from 'src/app/articles/article-embedding-iframe/article-embedding-iframe.module';
import { FpmaApiService } from 'src/app/services/fpma-api.service';
import { PurifyMethodPipe } from 'src/app/utils/purify-method/purify-method.pipe';
import { GlobalHeaderModule } from '../../../global-header/global-header.module';
import { EventCardInfo, ProfileService } from '../../profile.service';
import { type GenericPost } from 'src/app/models/generic-post.interface';
import type Swiper from 'swiper';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SwiperContainer } from 'swiper/element';

@Component({
  selector: 'mystk-event-articles',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ion-header>
      <ion-toolbar>
        <app-global-header></app-global-header>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen>
      <main class="event-article-outer">
        <mystk-page-title>{{ (event$ | async)?.eventName }}</mystk-page-title>
        <ng-template
          [rxLet]="currentIndex$"
          let-currentIndex>
          <ng-container *rxLet="trio$ as articlesTrio">
            <ion-segment [formControl]="segmentControl">
              <ion-segment-button
                *ngFor="let article of articlesTrio"
                [value]="article.title">
                <ion-label>{{ article.title }}</ion-label>
              </ion-segment-button>
            </ion-segment>
            <swiper-container (slidechange)="slideChanged($any($event))"
                              #swiper>
              <swiper-slide *ngFor="let article of articlesTrio">
                <mystk-article-embedding-iframe
                  class="event-article-content"
                  isVisible
                  [article]="article?.fulltext"></mystk-article-embedding-iframe>
              </swiper-slide>
            </swiper-container>
          </ng-container>
        </ng-template>
      </main>
    </ion-content>
  `,
  styleUrls: ['./event-articles.page.scss'],
  imports: [
    CommonModule,
    IonicModule,
    GlobalHeaderModule,
    PurifyMethodPipe,
    ArticleEmbeddingIframeComponentModule,
    LetModule,
    ForModule,
    ReactiveFormsModule,
  ],
})
export class EventArticlesPage implements OnInit {
  @ViewChild('swiper')
  swiper?: ElementRef<SwiperContainer>;

  private getEvent = () =>
    switchMap((eventName: string) =>
      this.routeState
        ? of(this.routeState)
        : this.profileService.getMyEvents().pipe(
            filter((evt) => evt.eventName.replace(' ', '_') === eventName),
            // take(1),
            shareReplay({ refCount: true }),
          )
    );
  private getArticles = () =>
    switchMap(({ websiteCategoryId }: EventCardInfo) => this.fpmaService.loadGenericPosts(websiteCategoryId));

    segmentControl = new FormControl('');

  event$ = inject(ActivatedRoute).paramMap.pipe(
    map((params) => params.get('eventName')),
    filter((p): p is string => !!p),
    this.getEvent(),
    shareReplay({ refCount: true })
  );
  private articles$ = this.event$.pipe(this.getArticles(), shareReplay({ refCount: false }));
  currentIndex$ = new BehaviorSubject(0);
  // currentArticle$ = combineLatest([this.currentIndex$, this.articles$]).pipe(
  //   map(([currentIdx, articles]) => articles[currentIdx]),
  //   tap( article => this.segmentControl.setValue(article.title)),
  // );

  trio$ = combineLatest([this.articles$, this.currentIndex$]).pipe(
    distinctUntilChanged((previous, current) => previous[0] == current[0] && previous[1] === current[1]),
    map(([articles, index]): [GenericPost[], number] => {
      if (index === 0) {
        return [articles.slice(0, 3), 0];
      }
      if (index === articles.length - 1) {
        const trio = articles.slice(-3, articles.length);
        return [trio, trio.length - 1];
      } else {
        return [articles.slice(index - 1, index + 2), 1];
      }
      return [[], 0];
    }),
    map(([trio, relativeIndex]) => Object.assign([] as GenericPost[], trio, { relativeIndex })),
    tap(trio => this.segmentControl.setValue(trio[trio.relativeIndex].title)),
    shareReplay(),
  );

  private readonly fpmaService = inject(FpmaApiService);
  private readonly profileService = inject(ProfileService);
  private readonly routeState? = inject(Router).getCurrentNavigation()?.extras.state as EventCardInfo;

  constructor() {}

  ngOnInit(): void {
    combineLatest([this.segmentControl.valueChanges, this.trio$]).pipe(
      distinctUntilChanged((previous, current) => previous[0] === current[0] && previous[1] === current[1]),
      map(([selectedTitle, trio]) => trio.findIndex(({title}) => title === selectedTitle ))
    ).subscribe(index => {
      this.currentIndex$.next(index);
      this.swiper?.nativeElement.swiper.slideTo(index);
    });
  }

  getSlideArticlesAround = (index: number): Observable<GenericPost[] & { relativeIndex: number }> =>
    this.articles$.pipe(
      map((articles): [GenericPost[], number] => {
        if (index === 0) {
          return [articles.slice(0, 3), 0];
        }
        if (index === articles.length - 1) {
          const trio = articles.slice(-3, articles.length);
          return [trio, trio.length - 1];
        } else {
          return [articles.slice(index - 1, index + 2), 1];
        }
        return [[], 0];
      }),
      map(([trio, relativeIndex]) => {
        const mergedObject = Object.assign([], trio, { relativeIndex });
        return Object.setPrototypeOf(mergedObject, Array.prototype);
      }),
      tap(trio => this.segmentControl.setValue(trio[trio.relativeIndex].title)),
    );

  slideChanged(event: CustomEvent<[Swiper]>) {
    const [swiper] = event.detail;
    this.currentIndex$.next(swiper.realIndex);
  }

  segmentChanged(e: any) {
    console.log(e);
  }
}
