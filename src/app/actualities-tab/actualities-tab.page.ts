import { Component } from '@angular/core';
import { Actualities } from '../models/actuality.interface';
import { DateHelper } from '../utils/date-helper';
import { FpmaApiService } from '../services/fpma-api.service';
import { Router, NavigationExtras } from '@angular/router';
import { ContentUpdateService } from '../services/content-update.service';
import { IonInfiniteScrollCustomEvent, RefresherEventDetail } from '@ionic/core';
import { filter, startWith, switchMap, take, tap, multicast } from 'rxjs/operators';
import { Observable, of, BehaviorSubject, Subject } from 'rxjs';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-actualities-tab',
  templateUrl: 'actualities-tab.page.html',
  styleUrls: ['actualities-tab.page.scss']
})
export class ActualitiesTabPage {

  actualities$!: Observable<Actualities[]>;
  public DateHelper = DateHelper;
  public loading = true;
  private actualityRefresher$ = new Subject<true | ActualitiesTabPage['NON_VALUE']>();
  private readonly NON_VALUE = Symbol();
  private start = 0;
  private cachedActualities$ = new BehaviorSubject<Actualities[] | symbol>(this.NON_VALUE);

  constructor(
    private fpmaApiService: FpmaApiService,
    private router: Router,
    private contentUpdateService: ContentUpdateService
    ) {
      this.loadActuality();
      this.contentUpdateService.resetNbUpdated('broadcasts');
  }

  loadActuality(){
    this.actualities$ = this.actualityRefresher$.pipe(
      startWith(true),
      tap(refreshEvent => (refreshEvent === true) ? this.loading = true : void 0),
      switchMap((refreshEvent) => (refreshEvent === true) ? this.fpmaApiService.loadActuality().pipe(
        tap({
          next: () => {
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          },
        })
      )
        : of(this.NON_VALUE)),
      multicast(() => this.cachedActualities$ = new BehaviorSubject<Actualities[] | symbol>([]), shared => shared),
      filter(((e): e is Actualities[] => e !== this.NON_VALUE)),
    );
  }

  public loadNewActuality(event: IonInfiniteScrollCustomEvent<void>){
      this.start += 10;
      this.fpmaApiService.loadActualityWithStart(this.start.toString()).subscribe((actualities: Actualities[]) =>{
        if (actualities.length == 0) {
          event.target.disabled = true;
         } else if (this.cachedActualities$.value instanceof Array) {
           this.cachedActualities$.next(this.cachedActualities$.value.concat(actualities));
        } else {
          this.cachedActualities$.next(actualities);
        }
        event.target.complete();
      });
  }


  public goToDetails(index: number, actualities: Actualities[]) {
    const navigationExtras: NavigationExtras = { state: { actualities, id: index } };
    this.router.navigate(['/tabs/actualities-tab/details'], navigationExtras);
  }

  public refresh(evt: CustomEvent<RefresherEventDetail>) {
    this.actualityRefresher$.next(this.NON_VALUE);
    this.actualities$.pipe(take(1)).subscribe(() => evt.detail.complete());
    this.actualityRefresher$.next(true);
  }

  goToHome() {
    this.router.navigate(['/tabs/home']);
  }

}
