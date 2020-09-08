import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HomePage } from '../home/home';
import { PresentationPage } from '../presentation/presentation';
import { SpiPage } from '../spi/spi';
import { StkNewsPage } from '../stk-news/stk-news';
import { AgendaPage } from '../agenda/agenda';
import { ActualityPage } from '../actuality/actuality';
import { ContentUpdateService } from '../../services/utils/content-update.service';

/**
 * Generated class for the MainTabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-main-tabs',
  templateUrl: 'main-tabs.html',
})
export class MainTabsPage implements OnInit, AfterViewInit {
  tabHomeRoot = HomePage;
  tab1Root = ActualityPage;
  tab2Root = PresentationPage;
  tab3Root = SpiPage;
  tab4Root = StkNewsPage;
  tab5Root = AgendaPage;

  public nbBroadcastsUpdated = 0;
  public nbNewsUpdated = 0;
  public nbEventsUpdated = 0;
  public nbPartagesUpdated = 0;

  constructor(
    private contentUpdateService: ContentUpdateService
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
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

  tabChanged($ev){
    switch ($ev.tabTitle) {
      case 'Home':
        $ev.setRoot(HomePage);
        break;
      case 'Actualites':
        $ev.setRoot(ActualityPage);
        break;
      case 'Presentation':
        $ev.setRoot(PresentationPage);
        break;
      case 'Spi':
        $ev.setRoot(SpiPage);
        break;
      case 'Stk-News':
        $ev.setRoot(StkNewsPage);
        break;
      case 'Agenda':
        $ev.setRoot(AgendaPage);
        break;
      default:
        console.log(`no page`);
    }
  }

  private updateNotificationIcon(id: string, nb: number) {
      const existingElmt = document.getElementById(id);
      if (existingElmt) {
        if (nb) {
          existingElmt.innerHTML = nb.toString();
        } else {
          existingElmt.remove();
        }
      } else {
        if (nb) {
          const spanNb = document.createElement("SPAN");
          spanNb.id = id;
          spanNb.innerHTML = nb.toString();
          this.createElementNotification(spanNb, id);
        }
      }
  }

  private createElementNotification(element, id) {
    switch (id) {
      case 'broadcastNotification':
        document.getElementsByClassName('tab-button')[1].appendChild(element);
        break;
      case 'eventNotification':
        document.getElementsByClassName('tab-button')[5].appendChild(element);
        break;
      case 'newsNotification':
        document.getElementsByClassName('tab-button')[4].appendChild(element);
        break;
      case 'partageNotification':
        document.getElementsByClassName('tab-button')[3].appendChild(element);
        break;
      default:
        console.log(`no notification`);
    }
  }

}
