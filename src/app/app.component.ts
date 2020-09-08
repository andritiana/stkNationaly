import { Component, trigger, transition, animate, style } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MainTabsPage } from '../pages/main-tabs/main-tabs';
import { LastVisitTimestamps } from '../models/lastVisitTimestamps.interface';
import { FpmaApiService } from '../services/fpma-api/fpma-api.service';
import { ContentUpdateService } from '../services/utils/content-update.service';
@Component({
  templateUrl: 'app.html',
  animations: [
    trigger(
      'enterAnimation', [
        transition(':leave', [
          style({opacity: 1}),
          animate('500ms', style({opacity: 0}))
        ])
      ]
    )
  ]
})
export class MyApp {
  rootPage:any = MainTabsPage;
  showSplash = true; 
  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private storage: Storage,
    private fpmaService: FpmaApiService,
    private contentUpdateService: ContentUpdateService
    ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      this.storage.get('lastVisitTimestamp').then((val: LastVisitTimestamps) => {
        if (val) {
          this.fpmaService.getContentUpdated(val).subscribe( contentUpdated => {
            this.contentUpdateService.initNbUpdated(contentUpdated);
          })
        } else {
          const now = new Date();
          const secondsSinceEpoch = Math.round(now.getTime() / 1000);
          const currentTimestamp:LastVisitTimestamps = {
            broadcasts: secondsSinceEpoch,
            news : secondsSinceEpoch,
            partages: secondsSinceEpoch,
            events: secondsSinceEpoch
          }
          this.storage.set('lastVisitTimestamp', currentTimestamp);
        }
      });
      
      splashScreen.hide();
      setTimeout(() => {
        this.showSplash = false
      }, 3000);
    });
  }
}

