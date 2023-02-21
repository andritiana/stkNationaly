import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActualitiesTabPage } from './actualities-tab.page';
import { ActualitiesTabPageRoutingModule } from './actualities-tab-routing.module';
import { ActualityDetailsPage } from './actuality-details-page/actuality-details.page';
import { GlobalHeaderModule } from '../global-header/global-header.module';
import { ArticleEmbeddingIframeComponentModule } from '../articles/article-embedding-iframe/article-embedding-iframe.module';
import { DecodeHtmlEntitiesModule } from '../utils/html-entities/decode-html-entities.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ActualitiesTabPageRoutingModule,
    ArticleEmbeddingIframeComponentModule,
    GlobalHeaderModule,
    DecodeHtmlEntitiesModule
  ],
  declarations: [ActualitiesTabPage, ActualityDetailsPage]
})
export class ActualitiesTabModule {}
