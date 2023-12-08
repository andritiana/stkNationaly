import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { GlobalHeaderModule } from '../../global-header/global-header.module';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { PasswordRevelatorDirective } from './../../forms/reveal-password.directive';
import { PurifyMethodPipe } from 'src/app/utils/purify-method/purify-method.pipe';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    IonicModule,
    GlobalHeaderModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    PasswordRevelatorDirective,
    PurifyMethodPipe,
  ],
})
export class LoginModule {}
