import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { BadgeListRoutingModule } from './badge-list-routing.module';
import { BadgeListPage } from './badge-list.page';
import { IonicModule } from '@ionic/angular';
import { GlobalHeaderModule } from 'src/app/global-header/global-header.module';
import { BadgeCardModule } from '../badge-card/badge-card.module';
import { LetModule } from '@rx-angular/template/let';


@NgModule({
  declarations: [BadgeListPage],
  imports: [
    CommonModule,
    IonicModule,
    GlobalHeaderModule,
    BadgeCardModule,
    BadgeListRoutingModule,
    DragDropModule,
    LetModule,
  ]
})
export class BadgeListModule { }
