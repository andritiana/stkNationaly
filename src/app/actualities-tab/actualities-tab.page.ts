import { Component } from '@angular/core';
import { Actualities } from '../models/actuality.interface';
import { DateHelper } from '../utils/date-helper';
import { FpmaApiService } from '../services/fpma-api.service';
import { Router, NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ContentUpdateService } from '../services/content-update.service';

@Component({
  selector: 'app-actualities-tab',
  templateUrl: 'actualities-tab.page.html',
  styleUrls: ['actualities-tab.page.scss']
})
export class ActualitiesTabPage {

  public actualities: Actualities[];
  public DateHelper = DateHelper;
  public loading = true;

  constructor(
    private fpmaApiService: FpmaApiService,
    private router: Router,
    private contentUpdateService: ContentUpdateService
    ) {
      this.loadActuality();
      this.contentUpdateService.resetNbUpdated('broadcasts');
  }

  loadActuality(){
    this.loading = true;
    this.fpmaApiService.loadActuality().subscribe((actuality: Actualities[]) => {
        this.actualities = actuality;
        this.loading = false;
      }, () => {
        this.loading = false;
      });
  }

  public goToDetails(index: number) {
    const navigationExtras: NavigationExtras = { state: { actualities: this.actualities, id: index } };
    this.router.navigate(['/tabs/actualities-tab/details'], navigationExtras);
  }

  public refresh() {
    this.loadActuality();
  }

  goToHome() {
    this.router.navigate(['/tabs/tab0']);
  }

}
