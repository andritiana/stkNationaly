import { NgModule } from '@angular/core';
import { PurifyMethodPipe } from './purify-method.pipe';



@NgModule({
  imports: [
    PurifyMethodPipe
  ],
  exports: [PurifyMethodPipe]
})
export class PurifyMethodModule { }
