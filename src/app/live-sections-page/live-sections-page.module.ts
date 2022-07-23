import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { GlobalHeaderModule } from "../global-header/global-header.module";
import { LiveSectionDetailsPagePage } from "./live-section-details-page/live-section-details-page.page";
import { LiveSectionsPagePageRoutingModule } from "./live-sections-page-routing.module";
import { LiveSectionsPagePage } from "./live-sections-page.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LiveSectionsPagePageRoutingModule,
    GlobalHeaderModule,
  ],
  declarations: [LiveSectionsPagePage, LiveSectionDetailsPagePage],
})
export class LiveSectionsPagePageModule {}
