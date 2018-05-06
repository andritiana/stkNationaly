import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams, Tabs } from 'ionic-angular';
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

  @ViewChild('mainTabs') tabRef: Tabs;

  tabHomeRoot = HomePage;
  tab1Root = ActualityPage;
  tab2Root = PresentationPage;
  tab3Root = SpiPage;
  tab4Root = StkNewsPage;
  tab5Root = AgendaPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ngOnInit(): void {
  }

}
