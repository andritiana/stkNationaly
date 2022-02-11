import { Component } from '@angular/core';
import { FpmaApiService } from '../services/fpma-api.service';
import { Router, NavigationExtras } from '@angular/router';
import { ArticleSpi } from '../models/article-spi.interface';
import { DateHelper } from '../utils/date-helper';
import { ContentUpdateService } from '../services/content-update.service';

@Component({
  selector: 'app-spi-tab',
  templateUrl: 'spi-tab.page.html',
  styleUrls: ['spi-tab.page.scss']
})
export class SpiTabPage {

  public partages: ArticleSpi[];
  public DateHelper = DateHelper;
  public loading = true;
  private start = 0; 

  constructor(
    private fpmaApiService: FpmaApiService,
    private router: Router,
    private contentUpdateService: ContentUpdateService) {
    this.loadPartages();
    this.contentUpdateService.resetNbUpdated('partages');
  }

  public loadPartages(){
    this.loading = true;
    this.fpmaApiService.loadPartageSpi().subscribe((partages: ArticleSpi[]) => {
        this.partages = partages;
        this.loading = false;
      }, () => {
        this.loading = false;
      });
  }

  public loadNewPartages(event){

    setTimeout(() => {
      this.start += 10; 
      this.fpmaApiService.loadPartageSpiWithStart(this.start.toString()).subscribe((partages: ArticleSpi[]) =>{ 
        if (partages.length == 0) {
          event.target.disabled = true;
         } else {
          this.partages = this.partages.concat(partages);
        } 
      }, () => { }
      );
      event.target.complete();
    }, 500);
  }    

  public refresh() {
    this.loadPartages();
  }

  public goToDetails(index: number) {
    const navigationExtras: NavigationExtras = { state: { articles: this.partages, id: index } };
    this.router.navigate(['/tabs/spi-tab/' + index], navigationExtras);
  }


  goToHome() {
    this.router.navigate(['/tabs/tab0']);
  }

}
