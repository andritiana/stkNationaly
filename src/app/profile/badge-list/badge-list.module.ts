import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BadgeListRoutingModule } from './badge-list-routing.module';
import { BadgeListPage } from './badge-list.page';
import { IonicModule } from '@ionic/angular';
import { GlobalHeaderModule } from 'src/app/global-header/global-header.module';
import { BadgeCardModule } from '../badge-card/badge-card.module';


@NgModule({
  declarations: [BadgeListPage],
  imports: [
    CommonModule,
    IonicModule,
    GlobalHeaderModule,
    BadgeCardModule,
    BadgeListRoutingModule
  ]
})
export class BadgeListModule { }
