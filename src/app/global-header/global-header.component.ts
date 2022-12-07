import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FpmaApiService } from '../services/fpma-api.service';

@Component({
  selector: 'app-global-header',
  templateUrl: './global-header.component.html',
  styleUrls: ['./global-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GlobalHeaderComponent implements OnInit {
  isDevMode$ = this.fpmaApiService.isDevMode$;
  devModeCounter = 0;
  private DEV_MODE_ACTIVATION_NUMBER = 4;
  previousClickTimestamp?: number;
  @Input() defaultHref = '../';
  constructor(
    private fpmaApiService: FpmaApiService,
    public alertController: AlertController
  ) { }

  ngOnInit(): void {
  }

  enableDevMode() {
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

  presentAlertConfirm() {
     this.alertController.create({
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
     })
       .then(alert => alert.present());
  }

  async quitDevModePopup(e: MouseEvent) {
    e.stopPropagation();
    this.alertController.create({
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
          }
        }
      ]
    }).then(alert => alert.present());
  }
}
