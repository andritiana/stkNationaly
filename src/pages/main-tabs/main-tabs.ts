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

  public nbBroadcastsUpdated: number;
  public nbNewsUpdated: number;
  public nbEventsUpdated: number;
  public nbPartagesUpdated: number;

  constructor(
    private contentUpdateService: ContentUpdateService
  ) {
  }

  ngOnInit(): void {
    this.contentUpdateService.getNbBroadcastsUpdated().subscribe( nb => this.nbBroadcastsUpdated = nb);
    this.contentUpdateService.getNbNewsUpdated().subscribe( nb => this.nbNewsUpdated = nb);
    this.contentUpdateService.getNbEventsUpdated().subscribe( nb => this.nbEventsUpdated = nb);
    this.contentUpdateService.getNbPartagesUpdated().subscribe( nb => this.nbPartagesUpdated = nb);
  }

  ngAfterViewInit(): void {
    const spanNb = document.createElement("SPAN");                 // Create a <span> node
    const textnode = document.createTextNode("2");         // Create a text node
    spanNb.appendChild(textnode);                              // Append the text to <li>
    document.getElementsByClassName('tab-button')[1].appendChild(spanNb);
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

}
