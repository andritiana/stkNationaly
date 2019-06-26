import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FpmaApiService } from '../../services/fpma-api/fpma-api.service';
import { StkNews } from '../../models/stk-news.interface';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';

/**
 * Generated class for the StkNewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-stk-news',
  templateUrl: 'stk-news.html',
})
export class StkNewsPage {

  public listOfStkNews: StkNews[];


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fpmaApiService: FpmaApiService,
    private document: DocumentViewer) {
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

  public openPdf(urlPdf: string) {
    const options: DocumentViewerOptions = {
      title: 'My PDF'
    }
    
    this.document.viewDocument(urlPdf, 'application/pdf', options);
  }

  goToHome() {
    this.navCtrl.parent.select(0);
  }

}
