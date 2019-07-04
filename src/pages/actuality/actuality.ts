import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FpmaApiService } from '../../services/fpma-api/fpma-api.service';
import { DateHelper } from '../../services/utils/date-helper';
import { Actualities } from '../../models/actuality.interface';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private fpmaApiService: FpmaApiService) {
  }

  ionViewDidLoad(){
    this.loadActuality();
  }

  loadActuality(){
    this.loading = true;
    this.fpmaApiService.loadActuality().subscribe((actuality: Actualities[]) => {
        console.log(actuality);
        
        this.actualities = actuality;
        this.loading = false;
      },() => {
        this.loading = false;
      });
  }

  goToHome() {
    this.navCtrl.parent.select(0);
  }
}
