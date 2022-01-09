import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LiveSectionsEmbeddedPagePage } from './live-sections-embedded-page.page';

const routes: Routes = [
  {
    path: '',
    component: LiveSectionsEmbeddedPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LiveSectionsEmbeddedPagePageRoutingModule {}
