import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BadgeListPage } from './badge-list.page';

const routes: Routes = [{ path: '', component: BadgeListPage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BadgeListRoutingModule { }
