import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResetPasswordRoutingModule } from './reset-password-routing.module';
import { ResetPasswordComponent } from './reset-password.component';
import { GlobalHeaderModule } from '../../global-header/global-header.module';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [
    CommonModule,
    IonicModule,
    ResetPasswordRoutingModule,
    GlobalHeaderModule,
    ReactiveFormsModule,
  ]
})
export class ResetPasswordModule { }
