import { Component, EnvironmentInjector, NgZone, inject } from '@angular/core';
import type { NavigationExtras } from '@angular/router';
import { Router } from '@angular/router';
import { FirebaseAnalytics } from '@awesome-cordova-plugins/firebase-analytics/ngx';
import { ActionSheetController, Platform, ToastController } from '@ionic/angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { differenceInBusinessDays } from 'date-fns/esm';
import OneSignal from 'onesignal-cordova-plugin';
import type { Observable} from 'rxjs';
import { EMPTY, bindCallback, combineLatest, concat, distinctUntilChanged, filter, from, map, of, switchMap, tap, throwError } from 'rxjs';
import { register } from 'swiper/element/bundle';
import type { LastVisitTimestamps, LastVisitUpdates } from './models/lastVisitTimestamps.interface';
import { ContentUpdateService } from './services/content-update.service';
import { FpmaApiService } from './services/fpma-api.service';
import { StorageService } from './utils/storage.service';

const enum NotificationPermissionStatus {
  /** The user hasn't yet made a choice about whether the app is allowed to schedule notifications. */
  not_determined = 0,
  /**	The application is not authorized to post user notifications. */
  denied = 1,
  /**	The application is authorized to post user notifications. */
  authorized = 2,
  /**	The application is provisionally authorized to post noninterruptive user notifications. See iOS Customizations */
  provisional = 3,
  /** For App Clips. The app is authorized to schedule or receive notifications for a limited amount of time */
  ephemeral = 4,
};

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  environmentInjector = inject(EnvironmentInjector);

  constructor(
    private platform: Platform,
    private storage: StorageService,
    private fpmaService: FpmaApiService,
    private contentUpdateService: ContentUpdateService,
    private firebaseAnalytics: FirebaseAnalytics,
    private router: Router,
    private zone: NgZone,
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController,
  ) {
    void this.initializeApp();
    register(true);
  }

  initializeApp() {
    return this.platform.ready().then(() => {

      this.firebaseAnalytics.logEvent('page_view', {page: 'home'})
        .then?.((res: any) => console.log(res))
        .catch((error: any) => console.error(error));
      if (this.platform.is('cordova')) {
        this.setupPushNotifications();
        this.logSubscriptionState();
        this.promptForNotificationPermission();
      }

      this.checkNbUpdatedContent().pipe(untilDestroyed(this)).subscribe();

      // Spécifique à Android : ferme l'application lorsque l'on clique sur le back button
      this.handleAndroidBackButton();

    });
  }

  private promptForNotificationPermission() {
    return combineLatest([
      bindCallback(OneSignal.getDeviceState.bind(OneSignal))(),
      from(this.storage.get<Date>('lastPromptDate')),
    ])
      .pipe(
        map(([deviceState, lastPrompt]) => {
          if (deviceState.hasNotificationPermission) {
            return false;
          }
          if (deviceState.notificationPermissionStatus === NotificationPermissionStatus.denied) {
            return isLastPromptOlderThan(13);
          }
          return isLastPromptOlderThan(6);

          function isLastPromptOlderThan(days: number) {
            if (lastPrompt) {
              const daysSinceLastPrompt = differenceInBusinessDays(new Date(), lastPrompt);
              if (daysSinceLastPrompt > days) {
                return true;
              } else {
                return false;
              }
            }
            return true;
          }
        }),
        switchMap((doPromptCustom) => doPromptCustom
          ? this.actionSheetCtrl
            .create({
              header: 'Pour rester au courant des derniers évènements et publications de MySTK, nous avons besoin de ton autorisation pour envoyer des notifications',
              subHeader: "Tu pourras autoriser les notifications via l'invite qui apparaîtra.",
              buttons: [
                {
                  role: 'destructive',
                  text: 'Autoriser',
                  data: true,
                },
                {
                  role: 'cancel',
                  text: 'Annuler',
                  data: false,
                },
              ],
            })
            .then(async (actionSheet) => {
              await actionSheet.present();
              return actionSheet.onDidDismiss().then(({ data }) => data as boolean);
            })
          : of(false)
        ),
        switchMap((promptForPermission) => {
          if (promptForPermission) {
            return new Promise((resolve) => OneSignal.promptForPushNotificationsWithUserResponse(true, (grant) => resolve(grant))
            ).then((permissionGranted) => {
              if (permissionGranted) {
                return this.toastCtrl
                  .create({
                    message: 'Cool ! Tu seras notifié quand des nouvelles publications dans MySTK',
                    buttons: [{ role: 'cancel', text: 'OK' }],
                    duration: 3000,
                  })
                  .then(async (toast) => toast.present());
              }
              return void 0;
            });
          } else {
            return EMPTY;
          }
        }),
        untilDestroyed(this)
      )
      .subscribe(() => {
        void this.storage.set('lastPromptDate', new Date());
      });
  }

  private logSubscriptionState() {
    this.fpmaService.isDevMode$.pipe(
      distinctUntilChanged(),
      switchMap(isDevMode => isDevMode
        ? concat(bindCallback(OneSignal.getDeviceState.bind(OneSignal))(), bindCallback(OneSignal.addSubscriptionObserver.bind(OneSignal))())
        : (OneSignal.addSubscriptionObserver(() => void 0), EMPTY)
      ),
      untilDestroyed(this)
    ).subscribe(event => {
      console.group('Push messaging\'s subscription state');
      console.table(event);
      console.groupEnd();
    });
  }

  private checkNbUpdatedContent(): Observable<LastVisitUpdates> {
    return from(this.storage.get<LastVisitTimestamps>('lastVisitTimestamp')).pipe(
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

    bindCallback(OneSignal.setNotificationWillShowInForegroundHandler.bind(OneSignal))().pipe(
      switchMap(event =>
          this.checkNbUpdatedContent().pipe(map(() => event)),
      ),
      untilDestroyed(this),
    ).subscribe(event =>
      // Pass the notification to the `complete` function in order to display it while the app is in the foreground, pass null to silence it
      event.complete(event.getNotification()),
      );


    bindCallback(OneSignal.setNotificationOpenedHandler.bind(OneSignal))().pipe(
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
    this.platform.backButton.subscribeWithPriority(-1, (processNext) => {
      const url = this.router.url;

      // Si on clique sur le back button depuis la page d'accueil, on ferme l'application
      if (url === '/tabs/home') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        (navigator as any)['app'].exitApp();
      }
      // Si on clique sur la back button depuis une page de catégorie située au même niveau
      // que la page d'accueil, on revient sur la page d'accueil (ex : /tabs/{rootCategory}, /(profile|login))
      else if (/^\/tabs\/[^\/]+$/.test(url) || /^\/profile$/.test(url) || /^\/login\/[^\/]+$/.test(url)) {
        void this.router.navigateByUrl('/tabs/home');
      }
      // Sinon, comportement par défaut d'Ionic
      processNext();
    });
  }

}
