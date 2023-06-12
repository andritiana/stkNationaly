import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';
import { FirebaseAnalytics } from '@awesome-cordova-plugins/firebase-analytics/ngx';
import { OneSignal } from '@awesome-cordova-plugins/onesignal/ngx';
import { JwtModule, JWT_OPTIONS, JwtInterceptor, JwtHelperService } from '@auth0/angular-jwt';
import { initializeTokensFromStorage, jwtOptionsFactory } from './profile/auth.service';
import { AuthExpirationInterceptor } from './profile/auth/auth-expiration.interceptor';

@NgModule({
    declarations: [AppComponent],
    imports: [
      BrowserModule,
      IonicModule.forRoot({
          animated: true,
      }),
      AppRoutingModule,
      HttpClientModule,
      IonicStorageModule.forRoot(),
    ],
    providers: [
        StatusBar,
        SplashScreen,
        FirebaseAnalytics,
        OneSignal,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: HTTP_INTERCEPTORS, multi: true, useClass: AuthExpirationInterceptor },
        /* copied from `JwtModule.forRoot` to set the JWT interceptor after AuthExpirationInterceptor
         https://github.com/auth0/angular2-jwt/blob/main/projects/angular-jwt/src/lib/angular-jwt.module.ts */
        {
          provide: HTTP_INTERCEPTORS,
          useClass: JwtInterceptor,
          multi: true,
        },
        {
          provide: JWT_OPTIONS,
          useFactory: jwtOptionsFactory,
        },
        JwtHelperService,

        { provide: APP_INITIALIZER, multi: true, useFactory: initializeTokensFromStorage }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
