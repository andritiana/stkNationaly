import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrcodeGeneratorComponent } from './qrcode-generator.component';



@NgModule({
  declarations: [QrcodeGeneratorComponent],
  imports: [
    CommonModule
  ],
  exports: [QrcodeGeneratorComponent],
})
export class QrcodeGeneratorModule { }
