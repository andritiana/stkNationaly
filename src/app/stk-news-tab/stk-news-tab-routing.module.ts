import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StkNewsTabPage } from './stk-news-tab.page';
import { StkNewsPdfPage } from './stk-news-pdf/stk-news-pdf';

const routes: Routes = [
  {
    path: '',
    component: StkNewsTabPage,
  },
  {
    path: ':id',
    component: StkNewsPdfPage,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class StkNewsTabPageRoutingModule {}
