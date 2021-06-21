import { Component, OnInit } from '@angular/core';
import { Verse } from '../models/verse.interface';
import { VerseService } from '../services/verse.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FpmaApiService } from '../services/fpma-api.service';
import { LiveSection } from '../models/live-section.interface';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-home-tab',
  templateUrl: 'home-tab.page.html',
  styleUrls: ['home-tab.page.scss']
})
export class HomeTabPage implements OnInit {

  public verse: Verse;
  public loading = true;
  public liveSections: LiveSection[];
  public displayLiveSections = false;
  public isDevMode = false;
  private devModeCounter = 0;
  private DEV_MODE_ACTIVATION_NUMBER = 4;
  private previousClickTimestamp: number;

  constructor(
    private verseService: VerseService,
    private router: Router,
    private fpmaApiService: FpmaApiService,
    public alertController: AlertController
    ) {
  }

  ngOnInit(): void {
    this.loading = true;

    const verse$ = this.verseService.getVerseOfTheDay().pipe(catchError(e => of(null)));
    const liveSections$ = this.fpmaApiService.loadLiveSections().pipe(catchError(e => of(null)));
    forkJoin({
      verse: verse$,
      liveSections: liveSections$
    }).subscribe(({ verse, liveSections}) => {
      this.verse = verse || { ref: '1 Corinthiens 11:1', verse: 'Soyez mes imitateurs, comme je le suis moi-même de Christ.' };
      this.liveSections = liveSections || [];

      this.displayLiveSections = this.liveSections.some(ls => !ls.isDevModeOnly);

      this.loading = false;
    });
  }

  goToPage(page: string): void {
    if (page === 'partage') {
      this.router.navigate(['/tabs/spi-tab']);
    } else if (page === 'stk') {
      this.router.navigate(['/tabs/presentation-tab/' + 27]);
    } else if (page === 'hymne') {
      this.router.navigate(['/tabs/presentation-tab/' + 149]);
    } else if (page === 'actus') {
      this.router.navigate(['/tabs/actualities-tab']);
    }
  }

  public enableDevMode() {
    const currentClickTimestamp = Date.now();
    if (this.previousClickTimestamp && (currentClickTimestamp - this.previousClickTimestamp <= 1000)){
      this.devModeCounter++;
    } else {
      this.devModeCounter = 0;
    }
    this.previousClickTimestamp = currentClickTimestamp;

    if (this.devModeCounter === this.DEV_MODE_ACTIVATION_NUMBER){
      this.presentAlertConfirm();
      this.devModeCounter = 0;
    }
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-pop-up',
      header: 'Dev Mode',
      message: 'Activer le mode developper ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        }, {
          text: 'Confirmer',
          handler: () => {
            this.fpmaApiService.activateDevMode();
            this.isDevMode = true;
          }
        }
      ]
    });

    await alert.present();
  }

  async quitDevModePopup() {
    const alert = await this.alertController.create({
      cssClass: 'my-pop-up',
      header: 'Dev Mode',
      message: 'Desactiver le mode developper ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        }, {
          text: 'Confirmer',
          handler: () => {
            this.fpmaApiService.deactivateDevMode();
            this.isDevMode = false;
          }
        }
      ]
    });

    await alert.present();
  }

}
