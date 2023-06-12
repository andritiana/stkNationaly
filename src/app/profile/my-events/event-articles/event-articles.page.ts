import { CommonModule } from '@angular/common';
import type { ElementRef, OnInit } from '@angular/core';
import { ApplicationRef, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, ViewChild, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { RxStrategyProvider } from '@rx-angular/cdk/render-strategies';
import { ForModule } from '@rx-angular/template/for';
import { LetModule } from '@rx-angular/template/let';
import { deepEqual, strictDeepEqual } from 'fast-equals';
import { EMPTY, Observable, tap } from 'rxjs';
import {
  BehaviorSubject,
  combineLatest,
  delayWhen,
  distinctUntilChanged,
  filter,
  fromEventPattern,
  map,
  of,
  pairwise,
  shareReplay,
  startWith,
  switchMap,
  take,
  withLatestFrom,
} from 'rxjs';
import { ArticleEmbeddingIframeComponentModule } from 'src/app/articles/article-embedding-iframe/article-embedding-iframe.module';
import { type GenericPost } from 'src/app/models/generic-post.interface';
import { FpmaApiService } from 'src/app/services/fpma-api.service';
import { PurifyMethodPipe } from 'src/app/utils/purify-method/purify-method.pipe';
import { distinctUntilChangedDeep } from 'src/app/utils/rx/distinct-until-changed-deep';
import type Swiper from 'swiper';
import type { SwiperContainer } from 'swiper/element';
import { GlobalHeaderModule } from '../../../global-header/global-header.module';
import type { EventCardInfo } from '../../profile.service';
import { ProfileService } from '../../profile.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

type GenericPostIndexed = GenericPost & {
  /** Absolute index in the global array */
  index: number;
};
type ListWithSelectedIndexOfGenericPost = GenericPostIndexed[] & {
  /** Index of the currently selected slide (in the trio of slides in the DOM) */
  slideIndex: number;
};

@UntilDestroy()
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
          rxLetStrategy="native"
          let-currentIndex>
          <ng-container *rxLet="trio$ as articlesTrio; suspense: loadingTplt; suspenseTrigger: susp; strategy: 'native'">
            <ion-segment
              [formControl]="segmentControl"
              class="event-article-segment"
              mode="ios">
              <!-- only 3 segment buttons are shown, but all are in the DOM because they have quite a latency before initializing that disrupts the flow of events -->
              <ion-segment-button
                class="event-article-segment-button ion-activatable"
                *ngFor="let article of articles$ | async; index as idx"
                [value]="article.index"
                [class.event-article-segment-button-shown]="articlesTrio | method : articleShouldShow : article"
                (touchstart)="touchStart($event)">
                <ion-label class="event-article-segment-button-label">{{ article.title }}</ion-label>
                <ion-ripple-effect class="event-article-segment-button-ripple"></ion-ripple-effect>
              </ion-segment-button>
            </ion-segment>
            <swiper-container
              class="event-article-content-wrapper"
              (slidechange)="slideChanged($any($event), articlesTrio)"
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
        <ng-template #loadingTplt>
        <ion-segment
              class="event-article-segment"
              mode="ios">
              <ion-segment-button
                class="event-article-segment-button event-article-segment-button-shown">
                <ion-label class="event-article-segment-button-label"><ion-skeleton-text></ion-skeleton-text></ion-label>
              </ion-segment-button>
              <ion-segment-button
                class="event-article-segment-button event-article-segment-button-shown">
                <ion-label class="event-article-segment-button-label"><ion-skeleton-text></ion-skeleton-text></ion-label>
              </ion-segment-button>
              <ion-segment-button
                class="event-article-segment-button event-article-segment-button-shown">
                <ion-label class="event-article-segment-button-label"><ion-skeleton-text></ion-skeleton-text></ion-label>
              </ion-segment-button>
            </ion-segment>
            <section class="event-article-content-wrapper">
              <p *ngFor="let p of skeletonArticle">
                <ion-skeleton-text></ion-skeleton-text>
              </p>
            </section>
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
  articles$: Observable<GenericPostIndexed[]>;
  currentIndex$ = new BehaviorSubject(0);
  event$: Observable<EventCardInfo>;
  segmentControl = new FormControl('0', { nonNullable: true });
  swiper?: Swiper;
  trio$: Observable<ListWithSelectedIndexOfGenericPost>;
  skeletonArticle = new Array(40);
  susp = new BehaviorSubject(true);
  @ViewChild('swiper')
  set swiperContainer(elt: ElementRef<SwiperContainer> | undefined) {
    this.swiper = elt?.nativeElement.swiper;
  }

  private readonly cdRef = inject(ChangeDetectorRef);
  private readonly fpmaService = inject(FpmaApiService);
  private readonly profileService = inject(ProfileService);
  private readonly routeState? = inject(Router).getCurrentNavigation()?.extras.state as EventCardInfo;

  constructor() {
    this.event$ = inject(ActivatedRoute).paramMap.pipe(
      map((params) => params.get('eventName')),
      filter((p): p is string => !!p),
      this.getEvent(),
      shareReplay({ refCount: true })
    );

    this.articles$ = this.event$.pipe(
      switchMap(({ websiteCategoryId }: EventCardInfo) => this.fpmaService.loadGenericPosts(websiteCategoryId)),
      map((articles) =>
        articles
          .map((a, index) => ({ ...a, index }))
      ),
      shareReplay({ refCount: false, bufferSize: 1 })
    );

    this.trio$ = combineLatest([this.articles$, this.currentIndex$]).pipe(
      distinctUntilChangedDeep(),
      map(([articles, index]): [articles: GenericPostIndexed[], segment: number] => {
        if (index === 0) {
          return [articles.slice(0, 3), 0];
        }
        if (index === articles.length - 1) {
          const trio = articles.slice(-3, articles.length);
          return [trio, trio.length - 1];
        } else {
          return [articles.slice(index - 1, index + 2), 1];
        }
      }),
      map(([trio, slideIndex]) => Object.assign(trio, { slideIndex })),
      shareReplay({ refCount: true, bufferSize: 1 })
    );
  }

  articleShouldShow(trio: GenericPostIndexed[], article: GenericPostIndexed) {
    return !!trio.find((a) => deepEqual(a, article));
  }

  ngOnInit(): void {
    const articlesChangedInTrio$ = this.trio$.pipe(
      startWith([] as unknown as ListWithSelectedIndexOfGenericPost),
      pairwise(),
      map(([prev, curr]): [trio: ListWithSelectedIndexOfGenericPost, changed: boolean] =>
        // deepEqual ignores the relativeIndex when comparing, so we actually compare the array only
        prev.length !== 0 && !deepEqual(prev, curr) ? [curr, true] : [curr, false]
      ),
      shareReplay({ refCount: true, windowTime: 300, bufferSize: 1 })
    );

    this.segmentControl.valueChanges
      .pipe(distinctUntilChanged())
      .pipe(
        startWith(this.segmentControl.value),
        map((v) => Number(v)),
        withLatestFrom(this.trio$),
        map(([absoluteIndex, trio]) => {
          return {
            relativeIndex: trio.findIndex(({ index }) => index === absoluteIndex),
            absoluteIndex,
          };
        }),
        // will trigger the stream of `trio$` immediately, before resuming this pipe
        tap(({ absoluteIndex }) => this.currentIndex$.next(absoluteIndex)),
        withLatestFrom(articlesChangedInTrio$),
        // if the articles in trio changed (and not just the cursor), let the stream of `articlesChangedInTrio$` handle it
        switchMap(([indices, [, articlesChanged]]) => (articlesChanged ? EMPTY : of(null)).pipe(map(() => indices))),
        untilDestroyed(this)
      )
      .subscribe(({ relativeIndex }) => {
        if (this.swiper?.realIndex !== relativeIndex) {
          this.swiper?.slideTo(relativeIndex);
        }
      });

    articlesChangedInTrio$
      .pipe(
        delayWhen(([, changed]) => {
          if (changed) {
            const swiper = this.swiper;
            /* queue detectChanges and swiper update in the next loop so the template (segments and slides) gets the change of articles first */
            return Promise.resolve().then(() => {
              this.cdRef.detectChanges();
              swiper?.update();
              return swiperUpdate$(swiper);
            });
          } else {
            return of(null);
          }
        }),
        untilDestroyed(this)
      )
      .subscribe(([trio]) => {
        // if the change came from the segment buttons, swiper is late and trio holds the reference
        if (this.swiper?.realIndex !== trio.slideIndex) {
          this.swiper?.slideTo(trio.slideIndex);
        }
      });

    function swiperUpdate$(swiper?: Swiper) {
      return fromEventPattern(
        (fn) => swiper?.on('update', fn),
        (fn) => swiper?.off('update', fn)
      ).pipe(take(1));
    }
  }

  slideChanged(event: CustomEvent<[Swiper]>, trio: ListWithSelectedIndexOfGenericPost) {
    const [swiper] = event.detail;
    // swiper's slide changed so it holds the reference and the segment should follow
    if (swiper.realIndex !== trio.slideIndex) {
      this.segmentControl.setValue(trio[swiper.realIndex].index.toString());
    }
  }

  touchStart(event: TouchEvent) {
    // prevent click after touch, otherwise segment button is triggered twice (with old *and* new value)
    event.preventDefault();
  }

  private getEvent = () =>
    switchMap((eventName: string) =>
      this.routeState
        ? of(this.routeState)
        : this.profileService.getMyEvents().pipe(
            filter((evt) => evt.eventName.replace(' ', '_') === eventName),
            shareReplay({ refCount: true })
          )
    );
}
