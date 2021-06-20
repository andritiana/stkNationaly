import { Component, AfterViewInit } from '@angular/core';
import { ContentUpdateService } from '../services/content-update.service';
import { ViewDidEnter } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private contentUpdateService: ContentUpdateService) {
    this.contentUpdateService.getBroadcastUpdateObservable().subscribe( (nbBroadcasts) => {
      this.updateNotificationIcon('broadcastNotification', nbBroadcasts);
    });
    this.contentUpdateService.getEventUpdateObservable().subscribe( (nbEvents) => {
      this.updateNotificationIcon('eventNotification', nbEvents);
    });
    this.contentUpdateService.getNewsUpdateObservable().subscribe( (nbNews) => {
      this.updateNotificationIcon('newsNotification', nbNews);
    });
    this.contentUpdateService.getPartageUpdateObservable().subscribe( (nbPartages) => {
      this.updateNotificationIcon('partageNotification', nbPartages);
    });
  }

  private updateNotificationIcon(id: string, nb: number) {
    setTimeout(() => {
      const existingElmt = document.getElementById(id);
      if (existingElmt) {
        if (nb) {
          existingElmt.innerHTML = nb.toString();
        } else {
          existingElmt.remove();
        }
      } else {
        if (nb) {
          const spanNb = document.createElement('SPAN');
          spanNb.id = id;
          spanNb.innerHTML = nb.toString();
          this.createElementNotification(spanNb, id);
        }
      }
    }, 1000);
}

private createElementNotification(element, id) {
  switch (id) {
    case 'broadcastNotification':
      document.getElementsByClassName('tab-layout-icon-top')[1].appendChild(element);
      break;
    case 'eventNotification':
      document.getElementsByClassName('tab-layout-icon-top')[5].appendChild(element);
      break;
    case 'newsNotification':
      document.getElementsByClassName('tab-layout-icon-top')[4].appendChild(element);
      break;
    case 'partageNotification':
      document.getElementsByClassName('tab-layout-icon-top')[3].appendChild(element);
      break;
    default:
      console.log(`no notification`);
  }
}

}
