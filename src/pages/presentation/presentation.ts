import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { FpmaApiService } from '../../services/fpma-api/fpma-api.service';
import { Presentation } from '../../models/presentation.interface';
import { PresentationDetailPage } from './presentation-detail/presentation-detail';

/**
 * Generated class for the PresentationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-presentation',
  templateUrl: 'presentation.html',
})
export class PresentationPage {

  public presentations: Presentation[];
  public loading = true;

  constructor(
    public navCtrl: NavController,
    private fpmaApiService: FpmaApiService,
    private app:  App) {
  }

  ionViewDidLoad(){
    this.loadPresentations();
  }

  loadPresentations(){
    this.loading = true;
    this.fpmaApiService.loadPresentations().subscribe((presentations: Presentation[]) => {
      this.presentations = presentations;
        this.loading = false;
      },() => {
        this.loading = false;
      });
  }

  public goToDetails(index: number) {
    this.app.getActiveNav().push(PresentationDetailPage, {id: index});
  }

  goToHome() {
    this.navCtrl.parent.select(0);
  }

}
