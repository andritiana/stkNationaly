import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpiTabPageRoutingModule } from './spi-tab-routing.module';
import { SpiTabPage } from './spi-tab.page';
import { SpiDetailsPage } from './spi-details-page/spi-details.page';
import { GlobalHeaderModule } from '../global-header/global-header.module';
import { ArticleEmbeddingIframeComponentModule } from '../articles/article-embedding-iframe/article-embedding-iframe.module';
import { DecodeHtmlEntitiesModule } from '../utils/html-entities/decode-html-entities.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ArticleEmbeddingIframeComponentModule,
    SpiTabPageRoutingModule,
    GlobalHeaderModule,
    DecodeHtmlEntitiesModule
  ],
  declarations: [ SpiTabPage, SpiDetailsPage ]
})
export class SpiTabModule {}
