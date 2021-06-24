import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LiveSectionDetailsPagePage } from './live-section-details-page/live-section-details-page.page';

import { LiveSectionsPagePage } from './live-sections-page.page';

const routes: Routes = [
  {
    path: '',
    component: LiveSectionsPagePage
  },
  {
    path: 'details',
    component: LiveSectionDetailsPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LiveSectionsPagePageRoutingModule {}
