import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditProfileRoutingModule } from './edit-profile-routing.module';
import { EditProfilePage } from './edit-profile.page';
import { IonicModule } from '@ionic/angular';
import { GlobalHeaderModule } from 'src/app/global-header/global-header.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [EditProfilePage],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    GlobalHeaderModule,
    EditProfileRoutingModule,
  ],
})
export class EditProfileModule { }
