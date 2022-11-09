
import Page from './page';
import { withSlides } from './slides.page';
import { withTabBar } from './tab-bar.page';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class ActualitiesPage extends withTabBar(Page) {
  readonly selectorCard = '.actuality-card';
  readonly selectorCardTitle = '.actuality-title';

  getCard(nth?: number) {
    return $(`>>>${this.selectorCard}${nth ? `:nth-of-type(${nth})` : ''}`)
  }

  openDetail(nth?: number): Promise<ActualityDetailPage> {
    return this.getCard(nth).click().then(() => detailPage);
  }

  scrollFarDown(): Promise<WebdriverIO.Element> {
    return $('>>>app-actualities-tab .inner-scroll')
      .then(elt => elt.scrollFarDown().then(() => elt));
  }

}

class ActualityDetailPage extends withTabBar(withSlides(Page)) {
  readonly selectorCurrent = '.swiper-slide-active';
  readonly selectorContent = `${this.selectorCurrent} .article-content`;
  readonly slideAnimationTimeout = 400;

  getAllText() {
    return $(`>>>${this.selectorContent}`).getText();
  }

  scrollFarDown() {
    return $('>>>.swiper-slide-active').then(elt => elt.scrollFarDown());
  }
}

export const actualitiesPage = new ActualitiesPage();
export const detailPage = new ActualityDetailPage();
