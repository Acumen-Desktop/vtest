import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";

//https://vitejs.dev/config
export default defineConfig({
  plugins: [sveltekit()],
  clearScreen: false,
  optimizeDeps: {
    exclude: [
      "svelte-codemirror-editor",
      "codemirror",
      "@codemirror/language-javascript",
    ],
  },
});
