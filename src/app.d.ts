// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
type GtagEventParameters = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    gtag?: (command: 'event', eventName: string, eventParameters?: GtagEventParameters) => void;
  }

  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
  }
}

export {};
