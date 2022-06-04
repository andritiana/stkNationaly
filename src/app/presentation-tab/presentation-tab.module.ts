import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresentationTabPageRoutingModule } from './presentation-tab-routing.module';
import { PresentationTabPage } from './presentation-tab.page';
import { PresentationDetailsPage } from './presentation-details-page/presentation-details.page';
import { GlobalHeaderModule } from '../global-header/global-header.module';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    PresentationTabPageRoutingModule,
    GlobalHeaderModule,
  ],
  declarations: [PresentationTabPage, PresentationDetailsPage]
})
export class PresentationTabModule {}
