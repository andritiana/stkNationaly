import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DecodeHtmlEntitiesPipe } from './decode-html-entities.pipe';

@NgModule({
  declarations: [DecodeHtmlEntitiesPipe],
  imports: [
    CommonModule
  ],
  exports: [DecodeHtmlEntitiesPipe]
})
export class DecodeHtmlEntitiesModule { }
