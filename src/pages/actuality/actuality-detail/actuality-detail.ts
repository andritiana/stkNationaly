import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FpmaApiService } from '../../../services/fpma-api/fpma-api.service';
import { DateHelper } from '../../../services/utils/date-helper';
import { Actualities } from '../../../models/actuality.interface';

/**
 * Generated class for the ActualityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-actuality-detail',
  templateUrl: 'actuality-detail.html',
})
export class ActualityDetailPage {

  public actualities: Actualities[];
  public DateHelper = DateHelper;
  public actualityId: number;
  public loading = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, private fpmaApiService: FpmaApiService) {
  }

  ngOnInit(): void {
    this.actualities = this.navParams.get('actualities');
    this.actualityId = this.navParams.get('index');
  }

  goToHome() {
    this.navCtrl.parent.select(0);
  }
}
