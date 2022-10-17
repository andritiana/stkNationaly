import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        // Route par defaut. Lors de l'utilisation du back button depuis la home, on quitte l'application
        path: 'home',
        loadChildren: () => import('../home-tab/home-tab.module').then(m => m.HomeTabPageModule)
      },
      {
        path: 'actualities-tab',
        loadChildren: () => import('../actualities-tab/actualities-tab.module').then(m => m.ActualitiesTabModule)
      },
      {
        path: 'presentation-tab',
        loadChildren: () => import('../presentation-tab/presentation-tab.module').then(m => m.PresentationTabModule)
      },
      {
        path: 'spi-tab',
        loadChildren: () => import('../spi-tab/spi-tab.module').then(m => m.SpiTabModule)
      },
      {
        path: 'stk-news-tab',
        loadChildren: () => import('../stk-news-tab/stk-news-tab.module').then(m => m.StkNewsTabPageModule)
      },
      {
        path: 'agenda-tab',
        loadChildren: () => import('../agenda-tab/agenda-tab.module').then(m => m.AgendaTabPageModule)
      },
      {
        path: 'live-sections-page',
        loadChildren: () => import('../live-sections-page/live-sections-page.module').then(m => m.LiveSectionsPagePageModule)
      },
      {
        path: 'live-sections-embedded-page',
        loadChildren: () => import('../live-sections-embedded-page/live-sections-embedded-page.module').then(m => m.LiveSectionsEmbeddedPagePageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
