import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { format, isSameDay, isSameMinute, lightFormat } from 'date-fns/esm';
import { fr } from 'date-fns/esm/locale';
import { ArticleEmbeddingIframeComponentModule } from 'src/app/articles/article-embedding-iframe/article-embedding-iframe.module';
import { GlobalHeaderModule } from 'src/app/global-header/global-header.module';
import type { AgendaEvent } from 'src/app/models/agenda-event.interface';
import { DecodeHtmlEntitiesPipe } from 'src/app/utils/html-entities/decode-html-entities.pipe';
import { PurifyMethodPipe } from 'src/app/utils/purify-method/purify-method.pipe';

@Component({
  selector: 'app-agenda-details',
  templateUrl: './agenda-details.page.html',
  styleUrls: ['./agenda-details.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgIf,
    NgFor,
    GlobalHeaderModule,
    ArticleEmbeddingIframeComponentModule,
    DecodeHtmlEntitiesPipe,
    PurifyMethodPipe,
  ]
})
export class AgendaDetailsPage {

  events: AgendaEvent[] = [];
  loading = true;
  slideOpts = {
    initialSlide: 1,
    speed: 400,
    slideShadows: false
  };


  constructor(
    private router: Router,
  ) {
    const navState = this.router.getCurrentNavigation()?.extras.state as {events: AgendaEvent[]; id: string} | undefined;
    if (navState) {
      this.events = navState.events;
      const eventIndex = this.events.map(({startTime, title}) => [startTime, title].join('_')).indexOf(navState.id);
      this.slideOpts.initialSlide = eventIndex;
    }
    this.loading = false;
  }

  protected formatToFrDate(date: Date) {
    return format(date, 'eeee dd MMMM yyyy', {locale: fr})
  }

  protected formatToTime(date: Date) {
    return lightFormat(date, 'HH:mm');
  }

  protected hasDifferentStartAndEndDate({startTime, endTime}: AgendaEvent) {
    return !isSameMinute(startTime, endTime);
  }

  protected isEventSameDay = ({startTime, endTime}: AgendaEvent) =>
    isSameDay(startTime, endTime)
      ? {startDay: this.formatToFrDate(startTime), startTime: this.formatToTime(startTime), endTime: this.formatToTime(endTime)}
      : null;

}
