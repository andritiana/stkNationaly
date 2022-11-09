export function addCustomCommands() {
  browser.addCommand('scrollFarDown', async function(this: WebdriverIO.Element) {
    const scrollT: number = await this.execute((elt: HTMLElement) => {
      const { scrollHeight, scrollTop, clientHeight } = elt;
      const remainingScroll = scrollHeight - scrollTop - clientHeight;
      elt.scrollBy({ top: remainingScroll, behavior: 'smooth' });
      return (remainingScroll + scrollTop);
      // @ts-expect-error
    }, this);
    await this.waitUntil(async () => {
      const scrollTop = await this.getProperty('scrollTop');
      return scrollTop === scrollT;
    });
  }, true);
  browser.addCommand('scrollByAnWait', async function(this: WebdriverIO.Element, top: number) {
    const scrollT: number = await this.execute((elt: HTMLElement) => {
      const { scrollHeight, scrollTop, clientHeight } = elt;
      const remainingScroll = scrollHeight - scrollTop - clientHeight;
      elt.scrollBy({ top, behavior: 'smooth' });
      return (remainingScroll + scrollTop);
      // @ts-expect-error
    }, this);
    await this.waitUntil(async () => {
      const scrollTop = await this.getProperty('scrollTop');
      return scrollTop === scrollT;
    });
  }, true);
}
