import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilePage } from './profile.page';
import { IonicModule } from '@ionic/angular';
import { ProfilePageRoutingModule } from './profile-routing.module';
import { GlobalHeaderModule } from '../global-header/global-header.module';

@NgModule({
  declarations: [ProfilePage],
  imports: [
    CommonModule,
    IonicModule,
    GlobalHeaderModule,
    ProfilePageRoutingModule,
  ],
})
export class ProfileModule {}
