# ***V***ite + ***T***ypescript + ***E***lectron Forge + ***S***velteKit + ***T***ailwind CSS

Template project with ***V***ite, ***T***ypescript, ***E***lectron Forge, ***S***velteKit, ***T***ailwind CSS

> [!Note]
>
> This template contains numerous comments with explanations and links throughout the source code.

![](./static/readme001.png)

```
git clone https://github.com/codec-xyz/vtest MyAwesomeApp

cd MyAwesomeApp

npm install

npm run start
```

> [!Note]
>
> Typescript will complain in the editor when you first clone the template. When you first run `npm run start` a `.svelte-kit` folder will be generated and the errors and warnings should go away.

# How the template works

Here are various details about the template's workings. However nothing beats looking thought the code.

## The Electron Forge x Vite setup

Svelte is build on top of Vite. The included `electronForgeVitePlugin.cts` exports an Electron Forge plugin that integrates Vite into Electron Forge's build process. During dev mode `npm run start` and packaging `npm run package` vite is used to transform and bundle the code. This template has 3 separate Vite setups:
- Main Electron Node process
- Preload - https://www.electronjs.org/docs/latest/tutorial/tutorial-preload
- Renderer aka SvelteKit

All the Vite configs are inside the `vite` folder.

This template **used to** use the official [`@electron-forge/plugin-vite`](https://www.npmjs.com/package/@electron-forge/plugin-vite) however I do not recommend using it.

## The `.cts` files

The `forge.config.cts` and its dependency `electronForgeVitePlugin.cts` need to end in a `.cts` meaning the typescript should be transpiled to CommonJS. This is the only way I found to make things work and this is a know issue [#3671](https://github.com/electron/forge/issues/3671).

## SvelteKit building and adaptor-static

SvelteKit build outputs code to render your files on a server. These will be located in `.svelte-kit/output/`. [Adaptor-static](https://kit.svelte.dev/docs/adapter-static) will then run this code during the build to make the browser html/css/js files. These will be placed in `.vite/renderer/main_window/` as specified in `svelte.config.js`.

I recommend you do not use SvelteKit's prerendering for your Electron apps. SvelteKit prerendering will slightly speed up the first load (when you open a window). However when navigating, SvelteKit will load Javascript and render pages even if they have been prerendered. Unlike web use cases Electron apps are likely to see almost none of the prerender benefits. Not using the prerendering will slightly simplify development. If you do however want prerendering here is how to do it...

<details>
These two options placed in `+layout.ts` or `+page.ts` files tell adapter-static how to render the files...

```
export const prerender = false;
export const ssr = false;
```

> [!Note]
>
> For adaptor-static keep the values the same, so either both true or both false.

- `prerender` - weather or not adapter-static will output an html file for this page
- `ssr` - weather or no adapter-static will prerender the page aka: false = blank page (and browser js to render the page)

Values of `prerender = false` and `ssr = false` means no html file is output for the this page. It will work as an [SPA (Single Page Application)](https://kit.svelte.dev/docs/single-page-apps) where this or any other page that are not present will use the fallback page `200.html` which is specified to adapter-static in `svelte.config.js`.

Values of `prerender = true` and `ssr = true` will prerender the page at build time and output an html file. One that is not blank. Reactivity, event handlers, and all other svelte features will still work. However this is prerendered during build time meaning no Electron feature and some other features will not be present. For example, state cannot be dependent on preferred color theme or window size. Use this to detect browser vs prerender...
```
import { browser } from '$app/environment';
if(browser) { ... }
```
</details>

## SvelteKit `tsconfig.json`

You may notice SvelteKit warns that...
```
Your tsconfig.json should extend the configuration generated by SvelteKit:
{
  "extends": "./.svelte-kit/tsconfig.json"
}
```
Ignore this. Due to the forge config being picky the root needs a `tsconfig.json` with specific settings and the SvelteKit files need different one. The SvelteKit `tsconfig.json` is located under `src`. It seems that SvelteKit does not account for this, however everything still works correctly.

## Tabs btw

## Typescript

Some of the config file can't be Typescript due to reasons :(

Make sure to put `lang='ts'` in the svelte files to use Typescript...
```
<script lang="ts">
	// ...
</script>
```

## Serving files

The Vite SvelteKit dev server serves a fallback html file for all urls that do no point to a file. This is replicated in the built version of the app by registering an `app://` schema and handling resolving urls manual. This uses Electrons `protocol.handle` and `protocol.registerSchemesAsPrivileged`. The window url is set to the dev server in dev mode or `app://-/` when built. The Electron `protocol.handle` simply takes a callback that is invoked to handle every request to the specified schema however it wants. The code is located in `src/main.ts`.

https://www.electronjs.org/docs/latest/api/protocol

# License

Code/assets in this template come from...
- Electron Forge's [Vite Typescript template](https://github.com/electron/forge/tree/main/packages/template/vite-typescript) licensed under [MIT](https://github.com/electron/forge/blob/main/LICENSE).
- SvelteKit's [create-svelte template](https://github.com/sveltejs/kit/tree/main/packages/create-svelte) licensed under [MIT](https://github.com/sveltejs/kit/blob/main/LICENSE)
- Logos from https://svgl.app/

And everything else done by <span property="cc:attributionName">me (codec)</span> is marked with <a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">CC0 1.0<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" alt=""><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/zero.svg" alt=""></a>