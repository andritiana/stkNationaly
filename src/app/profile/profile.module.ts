import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PurifyMethodModule } from '../utils/purify-method/purify-method.module';
import { ProfilePageRoutingModule } from './profile-routing.module';
import { ProfilePage } from './profile.page';
import { QrcodeGeneratorModule } from '../utils/qrcode-generator/qrcode-generator.module';
import { GlobalHeaderModule } from '../global-header/global-header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    PurifyMethodModule,
    QrcodeGeneratorModule,
    GlobalHeaderModule,
  ],
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
