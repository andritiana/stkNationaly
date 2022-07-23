import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActualitiesTabPage } from './actualities-tab.page';
import { ActualitiesTabPageRoutingModule } from './actualities-tab-routing.module';
import { ActualityDetailsPage } from './actuality-details-page/actuality-details.page';
import { GlobalHeaderModule } from '../global-header/global-header.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ActualitiesTabPageRoutingModule,
    GlobalHeaderModule,
  ],
  declarations: [ActualitiesTabPage, ActualityDetailsPage]
})
export class ActualitiesTabModule {}
