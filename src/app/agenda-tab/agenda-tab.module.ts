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
import { GlobalHeaderModule } from '../global-header/global-header.module';
import { DecodeHtmlEntitiesModule } from '../utils/html-entities/decode-html-entities.module';
registerLocaleData(localeFr, 'fr-FR');

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    AgendaTabPageRoutingModule,
    NgCalendarModule,
    GlobalHeaderModule,
    DecodeHtmlEntitiesModule
  ],
  declarations: [AgendaTabPage, AgendaDetailsPage]
})
export class AgendaTabPageModule {}
