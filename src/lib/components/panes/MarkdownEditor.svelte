<script lang="ts">
  import CodeMirror from "svelte-codemirror-editor";
  import { javascript } from "@codemirror/lang-javascript";
  import { oneDark } from "@codemirror/theme-one-dark";
  import { EditorView, basicSetup } from "codemirror";
  import type { Extension } from "@codemirror/state";

  let value = "";

  const extensions: Extension[] = [
    basicSetup,
    EditorView.lineWrapping,
    javascript(),
  ];
</script>

<CodeMirror bind:value {extensions} theme={oneDark} />

<style>
  :global(.codemirror-wrapper) {
    height: 100%;
  }

  :global(.cm-editor) {
    height: 100%;
  }
  :global(.cm-scroller) {
    overflow-y: auto;
  }
</style>
