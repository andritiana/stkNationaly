import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { IsLoggedInGuard } from './profile/auth/is-logged-in.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfileModule)
  },
  {
    path: 'login',
    canActivate: [IsLoggedInGuard],
    loadChildren: () => import('./profile/login/login.module').then( m => m.LoginModule)
  },
  { path: 'reset-password', loadChildren: () => import('./profile/reset-password/reset-password.module').then(m => m.ResetPasswordModule) },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
