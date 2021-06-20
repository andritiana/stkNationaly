import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FpmaApiService } from './services/fpma-api.service';
import { ContentUpdateService } from './services/content-update.service';
import { LastVisitTimestamps } from './models/lastVisitTimestamps.interface';
import { Storage } from '@ionic/storage';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public showSplash = true;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private fpmaService: FpmaApiService,
    private contentUpdateService: ContentUpdateService,
    private firebaseAnalytics: FirebaseAnalytics
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.firebaseAnalytics.logEvent('page_view', {page: 'home'})
        .then((res: any) => console.log(res))
        .catch((error: any) => console.error(error));
      this.storage.get('lastVisitTimestamp').then((val: LastVisitTimestamps) => {
        if (val) {
          this.fpmaService.getContentUpdated(val).subscribe( contentUpdated => {
            this.contentUpdateService.initNbUpdated(contentUpdated);
          });
        } else {
          const now = new Date();
          const secondsSinceEpoch = Math.round(now.getTime() / 1000);
          const currentTimestamp: LastVisitTimestamps = {
            broadcasts: secondsSinceEpoch,
            news : secondsSinceEpoch,
            partages: secondsSinceEpoch,
            events: secondsSinceEpoch
          };
          this.storage.set('lastVisitTimestamp', currentTimestamp);
        }
      });
      this.splashScreen.hide();
      setTimeout(() => {
        this.showSplash = false;
      }, 3000);
    });
  }
}
