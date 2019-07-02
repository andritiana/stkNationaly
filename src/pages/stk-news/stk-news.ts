import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FpmaApiService } from '../../services/fpma-api/fpma-api.service';
import { StkNews } from '../../models/stk-news.interface';
import { PdfViewerComponent } from 'ng2-pdf-viewer';

/**
 * Generated class for the StkNewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-stk-news',
  templateUrl: 'stk-news.html',
  providers: [PdfViewerComponent]
})
export class StkNewsPage {

  public listOfStkNews: StkNews[];
  public pdfToDisplay: string | null = null;


  constructor(
    public navCtrl: NavController,
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
    console.log(stkNews.pdf);
  }

  goToHome() {
    this.navCtrl.parent.select(0);
  }

}
