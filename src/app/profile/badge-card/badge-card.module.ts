import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeCardComponent } from './badge-card.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GlobalHeaderModule } from 'src/app/global-header/global-header.module';
import { PurifyMethodModule } from 'src/app/utils/purify-method/purify-method.module';
import { QrcodeGeneratorModule } from 'src/app/utils/qrcode-generator/qrcode-generator.module';



@NgModule({
  declarations: [BadgeCardComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PurifyMethodModule,
    QrcodeGeneratorModule,
    GlobalHeaderModule,
  ],
  exports: [BadgeCardComponent],
})
export class BadgeCardModule { }
