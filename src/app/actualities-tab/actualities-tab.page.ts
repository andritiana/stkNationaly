import { Component } from '@angular/core';
import { Actualities } from '../models/actuality.interface';
import { DateHelper } from '../utils/date-helper';
import { FpmaApiService } from '../services/fpma-api.service';
import { Router, NavigationExtras } from '@angular/router';
import { ContentUpdateService } from '../services/content-update.service';
import { RefresherEventDetail } from '@ionic/core';
import { filter, shareReplay, startWith, switchMap, take, tap } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';

@Component({
  selector: 'app-actualities-tab',
  templateUrl: 'actualities-tab.page.html',
  styleUrls: ['actualities-tab.page.scss']
})
export class ActualitiesTabPage {

  actualities$: Observable<Actualities[]>;
  public DateHelper = DateHelper;
  public loading = true;
  private actualityRefresher$ = new Subject<true | ActualitiesTabPage['NON_VALUE']>();
  private readonly NON_VALUE = Symbol();
  private start = 0; 

  constructor(
    private fpmaApiService: FpmaApiService,
    private router: Router,
    private contentUpdateService: ContentUpdateService
    ) {
      this.loadActuality();
      this
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
      shareReplay({ refCount: true, bufferSize: 1 }),
      filter(((e): e is Actualities[] => e !== this.NON_VALUE)),
    );
  }

  public loadNewActuality(event){

    setTimeout(() => {
      this.start += 10; 
      this.fpmaApiService.loadActualyWithStart(this.start.toString()).subscribe((actualities: Actualities[]) =>{ 
        if (actualities.length == 0) {
          event.target.disabled = true;
         } else {
          this.actualities = this.actualities.concat(actualities);
        } 
      }, () => { }
      );
      event.target.complete();
    }, 500);
  }
  

  public goToDetails(index: number) {
    const navigationExtras: NavigationExtras = { state: { actualities: this.actualities, id: index } };
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
