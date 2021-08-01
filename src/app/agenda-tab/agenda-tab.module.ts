import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgendaTabPage } from './agenda-tab.page';

import { AgendaTabPageRoutingModule } from './agenda-tab-routing.module';

import { NgCalendarModule  } from 'ionic2-calendar';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { AgendaDetailsPage } from './agenda-details-page/agenda-details.page';
registerLocaleData(localeFr, 'fr-FR');

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    AgendaTabPageRoutingModule,
    NgCalendarModule
  ],
  declarations: [AgendaTabPage, AgendaDetailsPage]
})
export class AgendaTabPageModule {}
