import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JWT_OPTIONS, JwtHelperService, JwtInterceptor } from '@auth0/angular-jwt';
import { FirebaseAnalytics } from '@awesome-cordova-plugins/firebase-analytics/ngx';
import { OneSignal } from '@awesome-cordova-plugins/onesignal/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
