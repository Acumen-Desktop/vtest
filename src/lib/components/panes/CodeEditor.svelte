<script lang="ts">
  import { onMount } from "svelte";
  import { basicSetup } from "codemirror";
  import { EditorView } from "@codemirror/view";
  import { javascript } from "@codemirror/lang-javascript";
  import { oneDark } from "@codemirror/theme-one-dark";

  export let content = "// Write your code here\n";
  // export let language = "javascript";

  let editorElement: HTMLElement;

  onMount(() => {
    const view = new EditorView({
      doc: content,
      extensions: [basicSetup, javascript(), oneDark],
      parent: editorElement,
    });

    return () => view.destroy();
  });
</script>

<div class="editor-container" bind:this={editorElement}></div>

<style>
  .editor-container {
    height: 100%;
    width: 100%;
  }

  :global(.editor-container .cm-editor) {
    height: 100%;
  }
</style>
