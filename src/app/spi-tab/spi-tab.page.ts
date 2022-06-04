import { Component } from '@angular/core';
import { FpmaApiService } from '../services/fpma-api.service';
import { Router, NavigationExtras } from '@angular/router';
import { ArticleSpi } from '../models/article-spi.interface';
import { DateHelper } from '../utils/date-helper';
import { ContentUpdateService } from '../services/content-update.service';
import { finalize, tap } from 'rxjs/operators';
import { RefresherCustomEvent } from '@ionic/core';

@Component({
  selector: 'app-spi-tab',
  templateUrl: 'spi-tab.page.html',
  styleUrls: ['spi-tab.page.scss']
})
export class SpiTabPage {

  public partages: ArticleSpi[];
  public DateHelper = DateHelper;
  public loading = true;

  constructor(
    private fpmaApiService: FpmaApiService,
    private router: Router,
    private contentUpdateService: ContentUpdateService) {
    this.loadPartages().subscribe();
    this.contentUpdateService.resetNbUpdated('partages');
  }

  public loadPartages(){
    this.loading = true;
    return this.fpmaApiService.loadPartageSpi().pipe(
      tap({
        next: (partages: ArticleSpi[]) => {
        this.partages = partages;
        this.loading = false;
    },
      error: () => {
        this.loading = false;
        }
      }),
    );
  }

  public refresh(evt: RefresherCustomEvent) {
    this.loadPartages()
      .pipe(finalize(() => evt.detail.complete()))
      .subscribe();
  }

  public goToDetails(index: number) {
    const navigationExtras: NavigationExtras = { state: { articles: this.partages, id: index } };
    this.router.navigate(['/tabs/spi-tab/' + index], navigationExtras);
  }


  goToHome() {
    this.router.navigate(['/tabs/home']);
  }

}
