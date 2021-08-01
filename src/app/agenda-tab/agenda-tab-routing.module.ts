import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgendaDetailsPage } from './agenda-details-page/agenda-details.page';
import { AgendaTabPage } from './agenda-tab.page';

const routes: Routes = [
  {
    path: '',
    component: AgendaTabPage,
  },
  {
    path : ':id',
    component: AgendaDetailsPage,
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgendaTabPageRoutingModule {}
