import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { GlobalHeaderModule } from '../../global-header/global-header.module';
import { BadgeCardModule } from '../badge-card/badge-card.module';
import { BadgePage } from './badge.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    GlobalHeaderModule,
    BadgeCardModule,
  ],
  declarations: [BadgePage],
  exports: [BadgePage],
})
export class BadgePageModule {}
