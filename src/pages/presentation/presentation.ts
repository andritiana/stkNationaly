import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FpmaApiService } from '../../services/fpma-api/fpma-api.service';
import { ArticleSpi } from '../../models/article-spi.interface';
import { DateHelper } from '../../services/utils/date-helper';
import { Presentations } from '../../models/presentations.interface';

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

  public presentations: Presentations[];
  public DateHelper = DateHelper; 
  public loading = true;

  constructor(public navCtrl: NavController, private fpmaApiService: FpmaApiService) {
  }

  ionViewDidLoad(){
    this.loadPresentations();
  }

  loadPresentations(){
    this.loading = true;
    this.fpmaApiService.loadPresentation().subscribe((presentations: Presentations[]) => {
      console.log(presentations);
        
      this.presentations = presentations;
        this.loading = false;
      },() => {
        this.loading = false;
      });
  }

  goToHome() {
    this.navCtrl.parent.select(0);
  }

}
