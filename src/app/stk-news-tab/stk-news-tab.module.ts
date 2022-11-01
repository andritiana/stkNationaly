import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StkNewsTabPage } from './stk-news-tab.page';
import { StkNewsTabPageRoutingModule } from './stk-news-tab-routing.module';
import { StkNewsPdfPage } from './stk-news-pdf/stk-news-pdf';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { GlobalHeaderModule } from '../global-header/global-header.module';
import { DecodeHtmlEntitiesModule } from '../utils/html-entities/decode-html-entities.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    StkNewsTabPageRoutingModule,
    PdfViewerModule,
    GlobalHeaderModule,
    DecodeHtmlEntitiesModule
  ],
  declarations: [StkNewsTabPage, StkNewsPdfPage]
})
export class StkNewsTabPageModule {}
