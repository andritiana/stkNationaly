import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { GlobalHeaderModule } from '../../global-header/global-header.module';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, IonicModule, GlobalHeaderModule, LoginRoutingModule, ReactiveFormsModule],
})
export class LoginModule {}
