import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FpmaApiService } from '../../services/fpma-api/fpma-api.service';
import { DateHelper } from '../../services/utils/date-helper';
import { ArticleSpi } from '../../models/article-spi.interface';

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

  constructor(
    public navCtrl: NavController,
    private fpmaApiService: FpmaApiService) {
  }

  ionViewDidLoad(){
    this.loadPartages();
  }

  loadPartages(){
    this.fpmaApiService.loadPartageSpi().subscribe((partages: ArticleSpi[]) => {
        this.partages = partages;
      },err => {
        console.log(err);
      });
  }

  public goToHome() {
    this.navCtrl.parent.select(0);
  }

}
