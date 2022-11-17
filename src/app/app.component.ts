import { Component, HostBinding, NgZone } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FpmaApiService } from './services/fpma-api.service';
import { ContentUpdateService } from './services/content-update.service';
import { LastVisitTimestamps, LastVisitUpdates } from './models/lastVisitTimestamps.interface';
import { Storage } from '@ionic/storage';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Router, NavigationExtras } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  @HostBinding('class.splash-showing')
  public showSplash = true;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private fpmaService: FpmaApiService,
    private contentUpdateService: ContentUpdateService,
    private firebaseAnalytics: FirebaseAnalytics,
    private oneSignal: OneSignal,
    private router: Router,
    private zone: NgZone,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();

      this.firebaseAnalytics.logEvent('page_view', {page: 'home'})
        .then?.((res: any) => console.log(res))
        .catch((error: any) => console.error(error));
      if (this.platform.is('cordova')) {
        this.setupPushNotifications();
      }

      this.checkNbUpdatedContent();

      // Spécifique à Android : ferme l'application lorsque l'on clique sur le back button
      this.handleAndroidBackButton();

      if (typeof ngDevMode !== 'undefined' && !!ngDevMode) {
        this.splashScreen.hide();
      }
    });
  }

  checkNbUpdatedContent() {
    this.storage.get('lastVisitTimestamp').then((val: LastVisitTimestamps) => {
      if (val) {
        this.fpmaService.getContentUpdated(val).pipe(
          filter((timestamps): timestamps is LastVisitUpdates => !!timestamps),
        ).subscribe(contentUpdated => {
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

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

    this.oneSignal.handleNotificationReceived().subscribe(data => {
      // Si l'application est deja ouverte
      // on force le rafraichissement du nombre de contenus mis a jour, comme si on venait de lancer l'application
      if (data.isAppInFocus) {
        this.checkNbUpdatedContent();
      }
    });

    this.oneSignal.handleNotificationOpened().subscribe(data => {
      // Redirige vers le détail de l'article selon sa catégorie
      // On reutilise les tabs de details de chaque catégorie, en passant comme seul element l'article pour le slider

      const { section, id } = data.notification.payload?.additionalData;

      if (section && id && !isNaN(parseInt(id))) {
        switch (section) {
          case 'spirituel':
            this.fpmaService.loadPartageSpiById(id).subscribe(post => {
              if (post) {
                const navigationExtras: NavigationExtras = { state: { articles: [post], id: 0 } };
                this.zone.run(() => {
                  this.router.navigate(['/tabs/spi-tab/' + 0], navigationExtras);
                });
              }
            });
            break;
          case 'actualites':
            this.fpmaService.loadActualityById(id).subscribe(post => {
              if (post) {
                const navigationExtras: NavigationExtras = { state: { actualities: [post], id: 0 } };
                this.zone.run(() => {
                  this.router.navigate(['/tabs/actualities-tab/details'], navigationExtras);
                });
              }
            });
            break;
          case 'evenements':
            this.fpmaService.loadAgendaById(id).subscribe(post => {
              if (post) {
                const navigationExtras: NavigationExtras = { state: { events: [post], id: 0 } };
                this.zone.run(() => {
                  this.router.navigate(['/tabs/agenda-tab/details'], navigationExtras);
                });
              }
            });
            break;
        }
      }

    });

    this.oneSignal.endInit();
  }

  handleAndroidBackButton() {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      const url = this.router.url;

      // Si on clique sur le back button depuis la page d'accueil, on ferme l'application
      if (url === '/tabs/home') {
        (navigator as any)['app'].exitApp();
      }
      // Si on clique sur la back button depuis une page de catégorie située au même niveau
      // que la page d'accueil, on revient sur la page d'accueil (ex : /tabs/{rootCategory}, /(profile|profile))
      else if (/^\/tabs\/[^\/]+$/.test(url) || /^\/profile\/[^\/]+$/.test(url) || /^\/login\/[^\/]+$/.test(url)) {
        this.router.navigateByUrl('/tabs/home');
      }
      // Sinon, comportement par défaut d'Ionic
    });
  }

}
