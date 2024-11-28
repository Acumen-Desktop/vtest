import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";
import path from "path";

//https://vitejs.dev/config
export default defineConfig({
  plugins: [sveltekit()],
  clearScreen: false,
  resolve: {
    alias: {
      $root: path.resolve(__dirname, "../src"),
    },
  },
  optimizeDeps: {
    exclude: [
      "svelte-codemirror-editor",
      "codemirror",
      "@codemirror/language-javascript",
    ],
  },
});
