import { visibilityOf, numberOfElementsToBeMoreThan, } from 'wdio-wait-for';
import { actualitiesPage, detailPage} from '../pageobjects/actualities.page';



describe('Actualités', () => {
  beforeEach(async () => {
    await actualitiesPage.open('');
    expect(browser).toHaveUrlContaining('/tabs/home');
    await actualitiesPage.clickActualitiesTab();
    await actualitiesPage.assertInActualitiesPage();
    await browser.waitUntil(numberOfElementsToBeMoreThan(actualitiesPage.selectorCard, 2));
  })

  it('navigates through the list', async () => {
    // scroll down to the last card
    const scroller =  $('>>>app-actualities-tab .inner-scroll').then(elt => elt.scrollFarDown());
    await expect(browser.waitUntil(visibilityOf('>>>ion-infinite-scroll-content .infinite-loading'))).toBeTruthy();

    // @ts-expect-error
    await scroller.then(e => e.executeAsync((elt: HTMLElement, done) => {
      elt.scrollTo({ top: 0, behavior: 'smooth' });
      done();
    }, e));
  })

  it('navigates through articles', async () => {
    const firstTitle = await actualitiesPage.getCard(1).$(`>>>${actualitiesPage.selectorCardTitle}`).getText();
    const title3 = await actualitiesPage.getCard(3).$(`>>>${actualitiesPage.selectorCardTitle}`).getText();
    const article = actualitiesPage.getCard(2);
    const title2 = await article.$(`>>>${actualitiesPage.selectorCardTitle}`).getText();
    await article.click();
    $(`>>>${detailPage.selectorContent}`).waitForDisplayed();
    expect($(`>>>${detailPage.selectorContent}`)).resolves.toContain(title2);

    await detailPage.scrollFarDown();

    // swipe to 1st article
    await detailPage.swipe('right');
    expect(detailPage.getAllText()).resolves.toContain(firstTitle);
    await browser.pause(detailPage.slideAnimationTimeout);
    // swipe to 2nd article
    await detailPage.swipe('left');
    expect(detailPage.getAllText()).resolves.toContain(title2);
    await browser.pause(detailPage.slideAnimationTimeout);
    // swipe to 3rd article
    await detailPage.swipe('left');
    expect(detailPage.getAllText()).resolves.toContain(title3);
    await browser.pause(detailPage.slideAnimationTimeout);
    await $(`>>>ion-back-button`).click();
    await browser.pause(detailPage.slideAnimationTimeout);
    await actualitiesPage.assertInActualitiesPage();
  });

  it('displays and plays embedded iframes', async () => {
    async function* searchForSTKNews() {
      let stkNewsFound = false;
      const needle: WebdriverIO.Element =  await $$(`>>>${actualitiesPage.selectorCard}`).find(async (elt) =>
        elt.getText().then(title =>
          !!title.match(/STK NEWS 2022 .S1/i),
        )
      );
      stkNewsFound = !!needle;
      if (!stkNewsFound) {
        await actualitiesPage.scrollFarDown();
        yield* searchForSTKNews();
      } else {
        yield needle;
      }
    }
    let article;
    for await (article of searchForSTKNews()) {
    }
    await article.click();
    const iframe = $(`>>>${detailPage.selectorContent} iframe`);
    await expect(iframe).toBeDisplayed();
    await iframe.scrollIntoView();
    await iframe.click();
    await browser.pause(1000);
    // leave and get back
    await detailPage.swipe('left');
    await browser.pause(detailPage.slideAnimationTimeout * 2);
    await detailPage.swipe('right');
    await browser.pause(detailPage.slideAnimationTimeout * 2);
    await iframe.click();
    await browser.pause(2000);
    await iframe.click();
  })
})
