import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LiveSectionsPagePage } from './live-sections-page.page';

const routes: Routes = [
  {
    path: '',
    component: LiveSectionsPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LiveSectionsPagePageRoutingModule {}
