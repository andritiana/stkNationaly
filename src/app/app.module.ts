import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { ErrorHandler, NgModule, LOCALE_ID } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { NgCalendarModule  } from 'ionic2-calendar';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { VerseService } from '../services/verse/verse.service';
import { AgendaPage } from '../pages/agenda/agenda';
import { SpiPage } from '../pages/spi/spi';
import { ActualityPage } from '../pages/actuality/actuality';
import { StkNewsPage } from '../pages/stk-news/stk-news';
import { MainTabsPage } from '../pages/main-tabs/main-tabs';
import { PresentationPage } from '../pages/presentation/presentation';
import { FpmaApiService } from '../services/fpma-api/fpma-api.service';
import { SpiDetailPage } from '../pages/spi/spi-detail/spi-detail';
import { StkNewsPdfPage } from '../pages/stk-news/stk-new-pdf/stk-news-pdf';
import { PresentationDetailPage } from '../pages/presentation/presentation-detail/presentation-detail';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AgendaPage,
    SpiPage,
    ActualityPage,
    StkNewsPage,
    MainTabsPage,
    PresentationPage,
    SpiDetailPage,
    StkNewsPdfPage,
    PresentationDetailPage
  ],
  imports: [
    NgCalendarModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    IonicModule.forRoot(MyApp),
    PdfViewerModule,
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AgendaPage,
    SpiPage,
    ActualityPage,
    StkNewsPage,
    MainTabsPage,
    PresentationPage,
    SpiDetailPage,
    StkNewsPdfPage,
    PresentationDetailPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    VerseService,
    FpmaApiService
  ]
})
export class AppModule {}
