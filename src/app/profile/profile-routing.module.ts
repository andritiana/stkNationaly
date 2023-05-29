import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HasTemporaryPasswordGuard } from './auth/has-temporary-password.guard';
import { IsLoggedInGuard } from './auth/is-logged-in.guard';

import { ProfilePage } from './profile.page';

const routes: Routes = [
  {
    path: '',
    canActivate: [IsLoggedInGuard],
    component: ProfilePage,
    pathMatch: 'full',
  },
  {
    path: 'my-events',
    loadComponent: () => import('./my-events/my-events.page').then(m => m.MyEventsPage)
  },
  {
    path: 'badge-list',
    loadChildren: () => import('./badge-list/badge-list.module').then(m => m.BadgeListModule)
  },
  {
    path: 'edit',
    canDeactivate: [HasTemporaryPasswordGuard],
    loadChildren: () => import('./edit-profile/edit-profile.module').then(m => m.EditProfileModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}
