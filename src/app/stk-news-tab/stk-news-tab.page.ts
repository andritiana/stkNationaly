import { Component } from '@angular/core';
import { StkNews } from '../models/stk-news.interface';
import { FpmaApiService } from '../services/fpma-api.service';
import { Router, NavigationExtras } from '@angular/router';
import { ContentUpdateService } from '../services/content-update.service';
import { finalize, tap } from 'rxjs/operators';
import { IonRefresherCustomEvent, RefresherEventDetail } from '@ionic/core';

@Component({
  selector: 'app-stk-news',
  templateUrl: 'stk-news-tab.page.html',
  styleUrls: ['stk-news-tab.page.scss']
})
export class StkNewsTabPage {

  public listOfStkNews: StkNews[] = [];
  public pdfToDisplay: string | null = null;
  public start = 0;

  constructor(
    private fpmaApiService: FpmaApiService,
    private router: Router,
    private contentUpdateService: ContentUpdateService) {
    this.loadStkNews().subscribe();
    this.contentUpdateService.resetNbUpdated('news');
  }

  loadStkNews() {
    return this.fpmaApiService.loadStkNews().pipe(
      tap((stkNews: StkNews[]) => {
        this.listOfStkNews = stkNews;
      }),
    );
  }

  public loadNewStkNews(event: IonRefresherCustomEvent<void>){
      this.start += 10;
      this.fpmaApiService.loadStkNewsWithStart(this.start.toString()).subscribe((listOfStkNews: StkNews[]) =>{
        if (listOfStkNews.length == 0) {
          event.target.disabled = true;
         } else {
          this.listOfStkNews = this.listOfStkNews.concat(listOfStkNews);
        }
        event.target.complete();
      }, () => { }
      );
  }


  public refresh(evt: CustomEvent<RefresherEventDetail>) {
    this.loadStkNews().pipe(finalize(() => evt.detail.complete()))
    .subscribe();
  }

  public openPdf(stkNews: StkNews) {
    const navigationExtras: NavigationExtras = { state: { pdfUrl: stkNews.pdf, title: stkNews.title } };
    this.router.navigate(['/tabs/stk-news-tab/' + stkNews.id], navigationExtras);
  }

  goToHome() {
    this.router.navigate(['/tabs/home']);
  }

}
