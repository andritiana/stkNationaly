import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FpmaApiService } from './services/fpma-api.service';
import { ContentUpdateService } from './services/content-update.service';
import { LastVisitTimestamps } from './models/lastVisitTimestamps.interface';
import { Storage } from '@ionic/storage';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';

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
    private firebaseAnalytics: FirebaseAnalytics,
    private oneSignal: OneSignal
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.firebaseAnalytics.logEvent('page_view', {page: 'home'})
        .then?.((res: any) => console.log(res))
        .catch((error: any) => console.error(error));
*/
      if (this.platform.is('cordova')) {
        this.setupPushNotifications();
      }

      this.checkNbUpdatedContent();
      this.splashScreen.hide();
      if (typeof ngDevMode === 'undefined') {
      setTimeout(() => {
        this.showSplash = false;
      }, 3000);
      } else {
        this.showSplash = false;
      }
    });
  }

  checkNbUpdatedContent() {
    this.storage.get('lastVisitTimestamp').then((val: LastVisitTimestamps) => {
      if (val) {
        this.fpmaService.getContentUpdated(val).subscribe(contentUpdated => {
          this.contentUpdateService.initNbUpdated(contentUpdated);
        });
      } else {
        const now = new Date();
        const secondsSinceEpoch = Math.round(now.getTime() / 1000);
        const currentTimestamp: LastVisitTimestamps = {
          broadcasts: secondsSinceEpoch,
          news: secondsSinceEpoch,
          partages: secondsSinceEpoch,
          events: secondsSinceEpoch
        };
        this.storage.set('lastVisitTimestamp', currentTimestamp);
      }
    });
  }

  setupPushNotifications() {
    this.oneSignal.startInit('e9e7ad63-5400-451d-8ab9-e2ea5d814fe5', '974013671728');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);

    this.oneSignal.handleNotificationReceived().subscribe(data => {
      // Si l'application est deja ouverte
      // on force le rafraichissement du nombre de contenus mis a jour, comme si on venait de lancer l'application
      if (data.isAppInFocus) {
        this.checkNbUpdatedContent();
      }
    });

    this.oneSignal.endInit();
  }

}
