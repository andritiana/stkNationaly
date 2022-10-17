import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurifyMethodPipe } from './purify-method.pipe';



@NgModule({
  declarations: [PurifyMethodPipe],
  imports: [
    CommonModule
  ],
  exports: [PurifyMethodPipe]
})
export class PurifyMethodModule { }
