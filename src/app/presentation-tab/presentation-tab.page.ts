import { Component } from '@angular/core';
import { FpmaApiService } from '../services/fpma-api.service';
import { Router, NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Presentation } from '../models/presentation.interface';

@Component({
  selector: 'app-presentation-tab',
  templateUrl: 'presentation-tab.page.html',
  styleUrls: ['presentation-tab.page.scss']
})
export class PresentationTabPage {

  public presentations: Presentation[];
  public loading = true;

  constructor(
    public navCtrl: NavController,
    private fpmaApiService: FpmaApiService,
    private router: Router) {
      this.loadPresentations();
  }

  loadPresentations(){
    this.loading = true;
    this.fpmaApiService.loadPresentations().subscribe((presentations: Presentation[]) => {
      this.presentations = presentations;
      this.loading = false;
    }, () => {
        this.loading = false;
      });
  }

  public goToDetails(index: number) {
    this.router.navigate(['/tabs/presentation-tab/' + index]);
  }


  goToHome() {
    this.router.navigate(['/tabs/tab0']);
  }

}
