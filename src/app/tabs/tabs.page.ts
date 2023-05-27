import { Component, ElementRef } from '@angular/core';
import { ContentUpdateService } from '../services/content-update.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private eltRef: ElementRef<HTMLElement>, private contentUpdateService: ContentUpdateService) {
    this.contentUpdateService.getBroadcastUpdateObservable().subscribe( (isNew) => {
      this.updateNotificationIcon('broadcastNotification', isNew);
    });
    this.contentUpdateService.getEventUpdateObservable().subscribe( (isNew) => {
      this.updateNotificationIcon('eventNotification', isNew);
    });
    this.contentUpdateService.getNewsUpdateObservable().subscribe( (isNew) => {
      this.updateNotificationIcon('newsNotification', isNew);
    });
    this.contentUpdateService.getPartageUpdateObservable().subscribe( (isNew) => {
      this.updateNotificationIcon('partageNotification', isNew);
    });
  }

  private updateNotificationIcon(id: string, isNew: boolean) {
    setTimeout(() => {
      let tabId: number = -1;
      switch (id) {
        case 'broadcastNotification':
          tabId = 1
          break;
        case 'eventNotification':
          tabId = 5
          break;
        case 'newsNotification':
          tabId = 4
          break;
        case 'partageNotification':
          tabId = 3
          break;
      }

      const el: Element | undefined = this.eltRef.nativeElement.getElementsByClassName('tab-layout-icon-top')[tabId];
      if (!el) {
        return;
      }

      // Si la rubrique contient du nouveau contenu
      // on rajoute la class CSS "new"
      if (isNew) {
        el.classList.add('new');
      } else {
        el.classList.remove('new');
      }
    }, 1000);
  }

}
