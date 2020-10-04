import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PresentationTabPage } from './presentation-tab.page';
import { PresentationDetailsPage } from './presentation-details-page/presentation-details.page';

const routes: Routes = [
  {
    path: '',
    component: PresentationTabPage
  },
  {
    path: ':id',
    component: PresentationDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PresentationTabPageRoutingModule {}
