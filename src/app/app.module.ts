import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
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
        JwtModule.forRoot({
            jwtOptionsProvider: {
                provide: JWT_OPTIONS,
                useFactory: jwtOptionsFactory,
            }
        }),
        IonicStorageModule.forRoot(),
    ],
    providers: [
        StatusBar,
        SplashScreen,
        FirebaseAnalytics,
        OneSignal,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: HTTP_INTERCEPTORS, multi: true, useClass: AuthExpirationInterceptor },
        { provide: APP_INITIALIZER, multi: true, useFactory: initializeTokensFromStorage }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
