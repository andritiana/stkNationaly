import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgendaTabPage } from './agenda-tab.page';

import { AgendaTabPageRoutingModule } from './agenda-tab-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    AgendaTabPageRoutingModule
  ],
  declarations: [AgendaTabPage]
})
export class AgendaTabPageModule {}
