import { Component, HostBinding, NgZone } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { FpmaApiService } from './services/fpma-api.service';
import { ContentUpdateService } from './services/content-update.service';
import type { LastVisitTimestamps, LastVisitUpdates } from './models/lastVisitTimestamps.interface';
import { Storage } from '@ionic/storage-angular';
import { FirebaseAnalytics } from '@awesome-cordova-plugins/firebase-analytics/ngx';
import OneSignal from 'onesignal-cordova-plugin';
import type { NavigationExtras } from '@angular/router';
import { Router } from '@angular/router';
import type { Observable} from 'rxjs';
import { bindCallback, EMPTY, filter, from, map, of, switchMap, tap, throwError } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
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
    private router: Router,
    private zone: NgZone,
  ) {
    void this.initializeApp();
  }

  initializeApp() {
    return this.platform.ready().then(() => {
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

  private checkNbUpdatedContent(): Observable<unknown> {
    return from(this.storage.get('lastVisitTimestamp')).pipe(
      switchMap((val: LastVisitTimestamps) => {
        if (val) {
          return this.fpmaService.getContentUpdated(val).pipe(
            filter((timestamps): timestamps is LastVisitUpdates => !!timestamps),
            tap(contentUpdated =>
              this.contentUpdateService.initNbUpdated(contentUpdated)
            )
          );
        } else {
          const now = new Date();
          const secondsSinceEpoch = Math.round(now.getTime() / 1000);
          const currentTimestamp: LastVisitTimestamps = {
            broadcasts: secondsSinceEpoch,
            news: secondsSinceEpoch,
            partages: secondsSinceEpoch,
            events: secondsSinceEpoch
          };
          return this.storage.set('lastVisitTimestamp', currentTimestamp);
        }
      }),
    );
  }

  setupPushNotifications() {
    OneSignal.setAppId('e9e7ad63-5400-451d-8ab9-e2ea5d814fe5');

    // Si l'application est deja ouverte
    // on force le rafraichissement du nombre de contenus mis a jour, comme si on venait de lancer l'application
    // eslint-disable-next-line @typescript-eslint/unbound-method
    bindCallback(OneSignal.setNotificationWillShowInForegroundHandler)().pipe(
      switchMap(event =>
          this.checkNbUpdatedContent().pipe(map(() => event)),
      ),
      untilDestroyed(this),
    ).subscribe(event =>
      // Pass the notification to the `complete` function in order to display it while the app is in the foreground, pass null to silence it
      event.complete(event.getNotification()),
      );

    // eslint-disable-next-line @typescript-eslint/unbound-method
    bindCallback(OneSignal.setNotificationOpenedHandler)().pipe(
      switchMap(data => {
      // Redirige vers le détail de l'article selon sa catégorie
      // On reutilise les tabs de details de chaque catégorie, en passant comme seul element l'article pour le slider

      const { section, id } = data.notification.additionalData as {section: string; id: number};

      if (section && id && !isNaN(parseInt(id as unknown as string))) {
        switch (section) {
          case 'spirituel':
            return this.fpmaService.loadPartageSpiById(id).pipe(
              switchMap(post => {
                if (post) {
                  const navigationExtras: NavigationExtras = { state: { articles: [post], id: 0 } };
                  return of([['/tabs/spi-tab/', 0], navigationExtras] as [string[], NavigationExtras]);
                } else {
                  return throwError(() => new Error());
                }
              }),
            );
          case 'actualites':
            return this.fpmaService.loadActualityById(id).pipe(
              switchMap(post => {
              if (post) {
                const navigationExtras: NavigationExtras = { state: { actualities: [post], id: 0 } };
                return of([['/tabs/actualities-tab/details'], navigationExtras] as [string[], NavigationExtras]);
              } else {
                  return throwError(() => new Error());
                }
            }),
          );
          case 'evenements':
            return this.fpmaService.loadAgendaById(id).pipe(
              switchMap(post => {
              if (post) {
                const navigationExtras: NavigationExtras = { state: { events: [post], id: 0 } };
                return of([['/tabs/agenda-tab/details'], navigationExtras] as [string[], NavigationExtras]);
              } else {
                  return throwError(() => new Error());
              }
            }),
          );
        }
      }
      return EMPTY;
    }),
    untilDestroyed(this),
    ).subscribe(commands => this.zone.run(() =>
      void this.router.navigate(...commands),
    ));

  }

  handleAndroidBackButton() {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      const url = this.router.url;

      // Si on clique sur le back button depuis la page d'accueil, on ferme l'application
      if (url === '/tabs/home') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        (navigator as any)['app'].exitApp();
      }
      // Si on clique sur la back button depuis une page de catégorie située au même niveau
      // que la page d'accueil, on revient sur la page d'accueil (ex : /tabs/{rootCategory}, /(profile|profile))
      else if (/^\/tabs\/[^\/]+$/.test(url) || /^\/profile\/[^\/]+$/.test(url) || /^\/login\/[^\/]+$/.test(url)) {
        void this.router.navigateByUrl('/tabs/home');
      }
      // Sinon, comportement par défaut d'Ionic
    });
  }

}
