import { numberOfElementsToBeMoreThan } from "wdio-wait-for";
import { spiTapPage } from "../pageobjects/spi-tab.page";

describe('Actualités', () => {
  beforeEach(async () => {
    await spiTapPage.open('');
    expect(browser).toHaveUrlContaining('/tabs/home');
    await spiTapPage.clickActualitiesTab();
    await spiTapPage.assertInSpiPage();
    await browser.waitUntil(numberOfElementsToBeMoreThan(spiTapPage.selectorCard, 2));
  });

  it('navigates through the list', async () => {
    // scroll down to the last card
  });
});
