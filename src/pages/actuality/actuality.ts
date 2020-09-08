import { ActualityDetailPage } from './actuality-detail/actuality-detail';
import { Component } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';
import { FpmaApiService } from '../../services/fpma-api/fpma-api.service';
import { DateHelper } from '../../services/utils/date-helper';
import { Actualities } from '../../models/actuality.interface';
import { ContentUpdateService } from '../../services/utils/content-update.service';

/**
 * Generated class for the ActualityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-actuality',
  templateUrl: 'actuality.html',
})
export class ActualityPage {

  public actualities: Actualities[];
  public DateHelper = DateHelper;
  public loading = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fpmaApiService: FpmaApiService,
    private app:  App,
    private contentUpdateService: ContentUpdateService
    ) {
  }

  ionViewDidLoad(){
    this.loadActuality();
    this.contentUpdateService.resetNbUpdated('broadcasts');
  }

  loadActuality(){
    this.loading = true;
    this.fpmaApiService.loadActuality().subscribe((actuality: Actualities[]) => {
        this.actualities = actuality;
        this.loading = false;
      },() => {
        this.loading = false;
      });
  }

  public goToDetails(index: number) {
    this.app.getActiveNav().push(ActualityDetailPage, {actualities: this.actualities, index});
  }

  public refresh() {
    this.loadActuality();
  }

  goToHome() {
    this.navCtrl.parent.select(0);
  }
}
