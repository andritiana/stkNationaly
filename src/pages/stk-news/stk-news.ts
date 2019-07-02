import { Component } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';
import { FpmaApiService } from '../../services/fpma-api/fpma-api.service';
import { StkNews } from '../../models/stk-news.interface';
import { StkNewsPdfPage } from './stk-new-pdf/stk-news-pdf';

/**
 * Generated class for the StkNewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-stk-news',
  templateUrl: 'stk-news.html'
})
export class StkNewsPage {

  public listOfStkNews: StkNews[];
  public pdfToDisplay: string | null = null;


  constructor(
    public navCtrl: NavController,
    private app:  App,
    public navParams: NavParams,
    private fpmaApiService: FpmaApiService) {
  }

  ionViewDidLoad() {
    this.loadStkNews();
  }

  loadStkNews() {
    this.fpmaApiService.loadStkNews().subscribe((stkNews: StkNews[]) => {
      this.listOfStkNews = stkNews;
    })
  }


  public refresh() {
    this.loadStkNews();
  }

  public openPdf(stkNews: StkNews) {
    this.pdfToDisplay = stkNews.pdf;
    this.app.getActiveNav().push(StkNewsPdfPage, {pdfUrl: stkNews.pdf, title: stkNews.title});
  }

  goToHome() {
    this.navCtrl.parent.select(0);
  }

}
