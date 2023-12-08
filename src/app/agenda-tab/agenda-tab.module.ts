import { CommonModule } from '@angular/common';
import { Directive, NgModule, TemplateRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgCalendarModule } from 'ionic2-calendar';
import { GlobalHeaderModule } from '../global-header/global-header.module';
import { DecodeHtmlEntitiesModule } from '../utils/html-entities/decode-html-entities.module';
import { PurifyMethodPipe } from '../utils/purify-method/purify-method.pipe';
import { AgendaTabPageRoutingModule } from './agenda-tab-routing.module';
import { AgendaTabPage } from './agenda-tab.page';

type MonthViewEventDetailTemplateContext = import('ionic2-calendar/calendar').IMonthViewEventDetailTemplateContext & {showEventDetail: boolean};

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
  declarations: [AgendaTabPage]
})
export class AgendaTabPageModule {}
