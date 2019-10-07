import { StkPage } from './../pages/stk/stk';
import { CommissionsPage } from './../pages/commissions/commissions';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';

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
    PresentationDetailPage,
    CommissionsPage,
    StkPage
  ],
  imports: [
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
    PresentationDetailPage,
    CommissionsPage,
    StkPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    VerseService,
    FpmaApiService
  ]
})
export class AppModule {}
