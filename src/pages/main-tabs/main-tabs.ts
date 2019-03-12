import { Component, OnInit } from '@angular/core';
import { HomePage } from '../home/home';
import { PresentationPage } from '../presentation/presentation';
import { SpiPage } from '../spi/spi';
import { StkNewsPage } from '../stk-news/stk-news';
import { AgendaPage } from '../agenda/agenda';
import { ActualityPage } from '../actuality/actuality';

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
export class MainTabsPage implements OnInit {
  tabHomeRoot = HomePage;
  tab1Root = ActualityPage;
  tab2Root = PresentationPage;
  tab3Root = SpiPage;
  tab4Root = StkNewsPage;
  tab5Root = AgendaPage;

  constructor() {
  }

  ngOnInit(): void {
  }

}
