import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { FpmaApiService } from '../../services/fpma-api/fpma-api.service';
import { DateHelper } from '../../services/utils/date-helper';
import { ArticleSpi } from '../../models/article-spi.interface';
import { SpiDetailPage } from './spi-detail/spi-detail';
import { ContentUpdateService } from '../../services/utils/content-update.service';

/**
 * Generated class for the SpiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-spi',
  templateUrl: 'spi.html',
})
export class SpiPage {

  public partages: ArticleSpi[];
  public DateHelper = DateHelper;
  public loading = true;

  constructor(
    public navCtrl: NavController,
    private app:  App,
    private fpmaApiService: FpmaApiService,
    private contentUpdateService: ContentUpdateService) {
  }

  ionViewDidLoad(){
    this.loadPartages();
    this.contentUpdateService.resetNbUpdated('partages');
  }

  loadPartages(){
    this.loading = true;
    this.fpmaApiService.loadPartageSpi().subscribe((partages: ArticleSpi[]) => {
        this.partages = partages;
        this.loading = false;
      },() => {
        this.loading = false;
      });
  }

  public goToHome() {
    this.navCtrl.parent.select(0);
  }

  public refresh() {
    this.loadPartages();
  }

  public goToDetails(index: number) {
    this.app.getActiveNav().push(SpiDetailPage, {articles: this.partages, index});
  }

}
