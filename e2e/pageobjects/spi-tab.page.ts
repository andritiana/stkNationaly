import Page from "./page";
import { withTabBar } from "./tab-bar.page";

class SpiTabPage extends withTabBar(Page) {
  readonly selectorCard = '.card-spi';
}

export const spiTapPage = new SpiTabPage();
