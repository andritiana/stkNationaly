import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActualitiesTabPage } from './actualities-tab.page';
import { ActualityDetailsPage } from './actuality-details-page/actuality-details.page';

const routes: Routes = [
  {
    path: '',
    component: ActualitiesTabPage
  },
  {
    path: 'details',
    component: ActualityDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActualitiesTabPageRoutingModule {}
