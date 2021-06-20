import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpiTabPage } from './spi-tab.page';
import { SpiDetailsPage } from './spi-details-page/spi-details.page';

const routes: Routes = [
  {
    path: '',
    component: SpiTabPage
  },
  {
    path: ':id',
    component: SpiDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpiTabPageRoutingModule {}
