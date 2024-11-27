<script lang="ts">
  import { onMount } from 'svelte';
  import CodeMirror from "svelte-codemirror-editor";
  import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
  import { languages } from "@codemirror/language-data";
  import { oneDark } from "@codemirror/theme-one-dark";
  import type { Extension } from "@codemirror/state";
  import { EditorView, basicSetup } from "codemirror";
  import { marked } from "marked";
  import DOMPurify from 'dompurify';

  const initialValue = `# Welcome to Markdown Editor

Type your **Markdown** here and see the *live preview* on the right!

## Features
- Real-time preview
- Syntax highlighting
- Support for code blocks
`;

  let value = $state(initialValue);
  let editor: CodeMirror | null = null;
  let editorView: EditorView | null = null;

  // Explicitly create extensions
  const editorExtensions: Extension[] = [
    basicSetup,
    EditorView.lineWrapping,
    markdown({
      base: markdownLanguage,
      codeLanguages: languages
    }),
    oneDark
  ];

  let renderedHtml = $state(initialValue);
  let wordCount = $derived(value.trim().split(/\s+/).length);
  let characterCount = $derived(value.length);

  $effect(() => {
    async function parseMarkdown() {
      try {
        const parsed = await marked.parse(value, { async: true });
        renderedHtml = DOMPurify.sanitize(parsed);
      } catch (error) {
        console.error('Markdown parsing error:', error);
      }
    }
    parseMarkdown();
  });

  function applyFormat(type: 'bold' | 'italic' | 'list') {
    if (!editorView) return;

    const { state, dispatch } = editorView;
    const { from, to } = state.selection.main;

    // If no text selected, insert at cursor
    if (from === to) {
      switch (type) {
        case 'bold':
          dispatch({
            changes: { from, insert: '****' },
            selection: { anchor: from + 2 }
          });
          break;
        case 'italic':
          dispatch({
            changes: { from, insert: '**' },
            selection: { anchor: from + 1 }
          });
          break;
        case 'list':
          dispatch({
            changes: { from, insert: '- ' },
            selection: { anchor: from + 2 }
          });
          break;
      }
    } else {
      // Text is selected
      const selectedText = state.sliceDoc(from, to);
      switch (type) {
        case 'bold':
          dispatch({
            changes: [
              { from, to, insert: `**${selectedText}**` }
            ],
            selection: { anchor: from + selectedText.length + 4 }
          });
          break;
        case 'italic':
          dispatch({
            changes: [
              { from, to, insert: `*${selectedText}*` }
            ],
            selection: { anchor: from + selectedText.length + 2 }
          });
          break;
        case 'list':
          dispatch({
            changes: [
              { from, to, insert: `- ${selectedText}` }
            ],
            selection: { anchor: from + selectedText.length + 2 }
          });
          break;
      }
    }

    // Focus back to the editor
    editorView.focus();
  }

  function handleEditorMount(event: CustomEvent<EditorView>) {
    editorView = event.detail;
  }
</script>

<div class="markdown-editor-container bg-white dark:bg-gray-900">
  <div class="editor-toolbar">
    <button onclick={() => applyFormat('bold')}>Bold</button>
    <button onclick={() => applyFormat('italic')}>Italic</button>
    <button onclick={() => applyFormat('list')}>List</button>
    <span class="stats">Words: {wordCount} | Chars: {characterCount}</span>
  </div>
  
  <div class="editor-preview-container">
    <div class="editor-panel bg-white dark:bg-gray-800">
      <CodeMirror 
        bind:this={editor}
        bind:value 
        extensions={editorExtensions} 
        placeholder="Start typing your Markdown here..."
        class="h-full"
        on:mount={handleEditorMount}
      />
    </div>
    <div class="preview-panel bg-white dark:bg-gray-800">
      <div class="prose dark:prose-invert max-w-none h-full">
        {@html renderedHtml}
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  :global(.cm-editor) {
    height: 100%;
  }

  :global(.cm-scroller) {
    height: 100%;
  }

  .markdown-editor-container {
    @apply h-full flex flex-col;
  }

  .editor-toolbar {
    @apply bg-gray-100 dark:bg-gray-800 p-2 flex items-center justify-between border-b border-gray-200 dark:border-gray-700;
  }

  .editor-toolbar button {
    @apply mr-2 px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded;
  }

  .editor-preview-container {
    @apply flex flex-1 overflow-hidden;
  }

  .editor-panel, .preview-panel {
    @apply w-1/2 h-full overflow-auto p-4;
  }

  .preview-panel {
    @apply border-l border-gray-200 dark:border-gray-700;
  }

  .stats {
    @apply text-sm text-gray-500 dark:text-gray-400;
  }
</style>
