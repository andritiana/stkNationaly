import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomeTabPage } from './home-tab.page';

import { HomeTabPageRoutingModule } from './home-tab-routing.module';
import { GlobalHeaderModule } from '../global-header/global-header.module';
import { PurifyMethodPipe } from '../utils/purify-method/purify-method.pipe';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HomeTabPageRoutingModule,
    GlobalHeaderModule,
    PurifyMethodPipe,
  ],
  declarations: [HomeTabPage]
})
export class HomeTabPageModule {}
