import type { Constructor } from "../config/typings";
import Page from "./page";

export function withSlides<T extends Constructor<Page>>(Base: T) {
  return class SliderMixin extends Base {
    readonly selectorActiveSlide = '.swiper-slide-active';

    swipe(direction: 'left' | 'right', amount = 100) {
      return $(`>>>${this.selectorActiveSlide}`).dragAndDrop({ x: amount * (direction === 'right' ? 1 : -1), y: 0 });
    }
  }
}
