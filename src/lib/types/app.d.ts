/// <reference types="svelte" />
/// <reference types="@sveltejs/kit" />
/// <reference types="vite/client" />
/// <reference path="./types/electron.d.ts" />

declare global {
  // See https://kit.svelte.dev/docs/types#app
  namespace App {
    interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
