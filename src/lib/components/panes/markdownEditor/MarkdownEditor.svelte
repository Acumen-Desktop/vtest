<script lang="ts">
  import MarkdownToolbar from "./MarkdownToolbar.svelte";
  import { onMount } from "svelte";
  import { EditorState } from "@codemirror/state";
  import { EditorView } from "@codemirror/view";
  import { basicSetup } from "codemirror";
  import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
  import { languages } from "@codemirror/language-data";
  import { oneDark } from "@codemirror/theme-one-dark";
  import { marked } from "marked";
  import DOMPurify from "dompurify";
  import type { ComponentProps } from "svelte";

  const initialValue = `# Welcome to Markdown Editor

Type your **Markdown** here and see the *live preview* on the right!

## Features
- Real-time preview
- Syntax highlighting
- Support for code blocks
`;

  let editorContainer: HTMLDivElement;
  let previewContainer: HTMLDivElement;
  let editorView = $state<EditorView | undefined>(undefined);

  let value = $state(initialValue);
  let renderedHtml = $state(initialValue);
  let wordCount = $derived(value.trim().split(/\s+/).length);
  let characterCount = $derived(value.length);

  $effect(() => {
    async function parseMarkdown() {
      try {
        const parsed = await marked.parse(value, { async: true });
        renderedHtml = DOMPurify.sanitize(parsed);
      } catch (error) {
        console.error("Markdown parsing error:", error);
      }
    }
    parseMarkdown();
  });

  onMount(() => {
    // Create the editor
    editorView = new EditorView({
      state: EditorState.create({
        doc: initialValue,
        extensions: [
          basicSetup,
          EditorView.lineWrapping,
          markdown({
            base: markdownLanguage,
            codeLanguages: languages,
          }),
          oneDark,
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              value = update.state.doc.toString();
            }
          }),
        ],
      }),
      parent: editorContainer,
    });

    return () => {
      if (editorView) {
        editorView.destroy();
      }
    };
  });
</script>

<div class="markdown-editor-container">
  <MarkdownToolbar {editorView} />

  <div class="editor-preview-container">
    <div bind:this={editorContainer} class="editor-panel h-full"></div>
    <div bind:this={previewContainer} class="preview-panel">
      <div class="prose dark:prose-invert max-w-none h-full">
        {@html renderedHtml}
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  .markdown-editor-container {
    @apply h-full flex flex-col;
    background-color: hsl(var(--accent));
    @apply dark:bg-accent;
  }

  .editor-preview-container {
    @apply flex flex-1 overflow-hidden;
    @apply dark:bg-accent;
  }

  .editor-panel,
  .preview-panel {
    @apply w-1/2 h-full overflow-auto p-4;
    @apply dark:bg-accent;
  }

  .preview-panel {
    @apply border-l border-gray-200 dark:border-gray-700;
  }
</style>
