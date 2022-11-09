import { WaitForOptions } from "webdriverio";
import type { Constructor } from "../config/typings";
import Page from "./page";

export function withTabBar<T extends Constructor<Page>>(Base: T) {
  return class TabBarMixin extends Base {
    readonly selectorTabButton = 'ion-tab-button';
    actualitiesButton() {
      return $(`>>>${this.selectorTabButton}[tab="actualities-tab"]`);
    }

    spiTabButton() {
      return $(`>>>${this.selectorTabButton}[tab="spi-tab"]`);
    }

    async clickActualitiesTab() {
      await this.actualitiesButton().waitForExist();
      return this.actualitiesButton().click();
    }

    async clickSpiTab() {
      await this.spiTabButton().waitForExist();
      return this.spiTabButton().click();
    }

    assertInActualitiesPage(waitForOptions?: WaitForOptions) {
      return $('mystk-page-title*=Actualités').waitForDisplayed(waitForOptions);
    }
    assertInSpiPage(waitForOptions?: WaitForOptions) {
      return $('mystk-page-title*=SPI').waitForDisplayed(waitForOptions);
    }
  }
}
