import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { Directive, NgModule, TemplateRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgCalendarModule } from 'ionic2-calendar';
import { GlobalHeaderModule } from '../global-header/global-header.module';
import { DecodeHtmlEntitiesModule } from '../utils/html-entities/decode-html-entities.module';
import { AgendaDetailsPage } from './agenda-details-page/agenda-details.page';
import { AgendaTabPageRoutingModule } from './agenda-tab-routing.module';
import { AgendaTabPage } from './agenda-tab.page';
import { PurifyMethodPipe } from '../utils/purify-method/purify-method.pipe';

type MonthViewEventDetailTemplateContext = import('ionic2-calendar/calendar').IMonthViewEventDetailTemplateContext & {showEventDetail: boolean};
type TimeSelected = import('ionic2-calendar/calendar').ITimeSelected

@Directive({
  selector: '[monthViewEventDetail]',
  exportAs: 'monthViewEventDetail',
  standalone: true,
})
export class MonthViewEventDetailTemplateDirective {
  templateRef = inject(TemplateRef<MonthViewEventDetailTemplateContext>);
  static ngTemplateContextGuard(directive: MonthViewEventDetailTemplateDirective, context: unknown): context is MonthViewEventDetailTemplateContext {
    return true;
  }
}

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    AgendaTabPageRoutingModule,
    NgCalendarModule,
    GlobalHeaderModule,
    DecodeHtmlEntitiesModule,
    MonthViewEventDetailTemplateDirective,
    PurifyMethodPipe,
  ],
  declarations: [AgendaTabPage, AgendaDetailsPage]
})
export class AgendaTabPageModule {}
