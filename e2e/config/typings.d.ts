export type Constructor<T> = new (...args: any[]) => T;


/* COMMANDS */
declare global {
  namespace WebdriverIO {
      interface Browser {
      }

      interface Element {
        scrollFarDown: () => Promise<boolean>
      }
  }
}
