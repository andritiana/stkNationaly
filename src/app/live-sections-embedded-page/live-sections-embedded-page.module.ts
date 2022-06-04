import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GlobalHeaderModule } from '../global-header/global-header.module';
import { LiveSectionsEmbeddedPagePageRoutingModule } from './live-sections-embedded-page-routing.module';
import { LiveSectionsEmbeddedPagePage } from './live-sections-embedded-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LiveSectionsEmbeddedPagePageRoutingModule,
    GlobalHeaderModule,
  ],
  declarations: [LiveSectionsEmbeddedPagePage]
})
export class LiveSectionsEmbeddedPagePageModule {}
