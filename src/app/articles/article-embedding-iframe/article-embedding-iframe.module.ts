import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ArticleEmbeddingIframeComponent } from './article-embedding-iframe.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule,],
  declarations: [ArticleEmbeddingIframeComponent],
  exports: [ArticleEmbeddingIframeComponent]
})
export class ArticleEmbeddingIframeComponentModule {}
