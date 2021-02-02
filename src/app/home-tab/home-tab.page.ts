import { Component, OnInit } from '@angular/core';
import { Verse } from '../models/verse.interface';
import { VerseService } from '../services/verse.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FpmaApiService } from '../services/fpma-api.service';

@Component({
  selector: 'app-home-tab',
  templateUrl: 'home-tab.page.html',
  styleUrls: ['home-tab.page.scss']
})
export class HomeTabPage implements OnInit {

  public verse: Verse;
  public loading = true;
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
    this.verseService.getVerseOfTheDay().subscribe((verse: Verse) => {
      this.verse = verse;
      this.loading = false;
    }, () => {
      this.verse = { ref: '1 Corinthiens 11:1', verse: 'Soyez mes imitateurs, comme je le suis moi-même de Christ.' };
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
          }
        }
      ]
    });

    await alert.present();
  }

}
