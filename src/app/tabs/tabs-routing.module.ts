import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab0',
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
        path: '',
        redirectTo: '/tabs/tab0',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab0',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
