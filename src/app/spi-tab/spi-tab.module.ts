import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpiTabPageRoutingModule } from './spi-tab-routing.module';
import { SpiTabPage } from './spi-tab.page';
import { SpiDetailsPage } from './spi-details-page/spi-details.page';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SpiTabPageRoutingModule
  ],
  declarations: [ SpiTabPage, SpiDetailsPage ]
})
export class SpiTabModule {}
