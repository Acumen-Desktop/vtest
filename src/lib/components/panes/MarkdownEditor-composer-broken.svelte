<script lang="ts">
  import { onMount } from "svelte";
  import { EditorState, type Extension } from "@codemirror/state";
  import { EditorView } from "@codemirror/view";
  import { basicSetup } from "codemirror";
  import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
  import { languages } from "@codemirror/language-data";
  import { oneDark } from "@codemirror/theme-one-dark";
  import { marked } from "marked";
  import DOMPurify from "dompurify";
  import { Button } from "$lib/components/ui/button";
  import { Separator } from "$lib/components/ui/separator";
  import {
    ToggleGroup,
    ToggleGroupItem,
  } from "$lib/components/ui/toggle-group";
  import * as Tooltip from "$lib/components/ui/tooltip";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import type { Icon } from "lucide-svelte";
  import {
    Bold,
    Italic,
    Strikethrough,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    CheckSquare,
    Quote,
    Code2,
    Table,
    Link2,
    Image,
    Minus,
    FileText,
    ChevronDown,
  } from "lucide-svelte";

  interface FormatAction {
    icon:
      | typeof Bold
      | typeof Italic
      | typeof Strikethrough
      | typeof Heading1
      | typeof Heading2
      | typeof Heading3
      | typeof List
      | typeof ListOrdered
      | typeof CheckSquare
      | typeof Quote
      | typeof Code2
      | typeof Table
      | typeof Link2
      | typeof Image
      | typeof Minus
      | typeof FileText;
    label: string;
    markdown: string;
    cursorOffset?: number;
    block?: boolean;
    tooltip: string;
  }

  const initialValue = `# Welcome to Markdown Editor

Type your **Markdown** here and see the *live preview* on the right!

## Features
- Real-time preview
- Syntax highlighting
- Support for code blocks
` as const;

  type MarkdownContent = string;

  let editorContainer: HTMLDivElement;
  let previewContainer: HTMLDivElement;
  let editorView: EditorView | undefined = undefined;
  let value = initialValue as MarkdownContent;
  let renderedHtml = initialValue as MarkdownContent;
  let activeFormats = new Set<string>();

  const formatActions: Record<string, FormatAction[]> = {
    text: [
      { icon: Bold, label: "Bold", markdown: "**", tooltip: "**bold**" },
      { icon: Italic, label: "Italic", markdown: "*", tooltip: "*italic*" },
      {
        icon: Strikethrough,
        label: "Strikethrough",
        markdown: "~~",
        tooltip: "~~strikethrough~~",
      },
    ],
    headers: [
      {
        icon: Heading1,
        label: "H1",
        markdown: "# ",
        cursorOffset: 2,
        block: true,
        tooltip: "# Heading 1",
      },
      {
        icon: Heading2,
        label: "H2",
        markdown: "## ",
        cursorOffset: 3,
        block: true,
        tooltip: "## Heading 2",
      },
      {
        icon: Heading3,
        label: "H3",
        markdown: "### ",
        cursorOffset: 4,
        block: true,
        tooltip: "### Heading 3",
      },
    ],
    lists: [
      {
        icon: List,
        label: "Bullet List",
        markdown: "- ",
        cursorOffset: 2,
        block: true,
        tooltip: "- bullet list",
      },
      {
        icon: ListOrdered,
        label: "Numbered List",
        markdown: "1. ",
        cursorOffset: 3,
        block: true,
        tooltip: "1. numbered list",
      },
      {
        icon: CheckSquare,
        label: "Task List",
        markdown: "- [ ] ",
        cursorOffset: 6,
        block: true,
        tooltip: "- [ ] task list",
      },
    ],
    blocks: [
      {
        icon: Quote,
        label: "Quote",
        markdown: "> ",
        cursorOffset: 2,
        block: true,
        tooltip: "> blockquote",
      },
      {
        icon: Code2,
        label: "Code Block",
        markdown: "```\n\n```",
        cursorOffset: 4,
        block: true,
        tooltip: "```code block```",
      },
      {
        icon: Table,
        label: "Table",
        markdown:
          "| Header | Header |\n|---------|----------|\n| Cell | Cell |",
        cursorOffset: 2,
        block: true,
        tooltip: "Insert table",
      },
    ],
    media: [
      {
        icon: Link2,
        label: "Link",
        markdown: "[]()",
        cursorOffset: 1,
        tooltip: "[text](url)",
      },
      {
        icon: Image,
        label: "Image",
        markdown: "![]()",
        cursorOffset: 2,
        tooltip: "![alt text](url)",
      },
    ],
    special: [
      {
        icon: Minus,
        label: "Horizontal Rule",
        markdown: "\n---\n",
        cursorOffset: 5,
        block: true,
        tooltip: "Horizontal rule",
      },
      {
        icon: FileText,
        label: "Table of Contents",
        markdown: "[TOC]\n\n",
        cursorOffset: 6,
        block: true,
        tooltip: "Table of contents",
      },
    ],
  };

  // Computed values using $derived
  let wordCount = $derived(value.trim().split(/\s+/).length);
  let characterCount = $derived(value.length);

  // Effect for markdown parsing
  $effect(() => {
    parseMarkdown(value);
  });

  async function parseMarkdown(text: MarkdownContent) {
    try {
      const parsed = await marked.parse(text, { async: true });
      renderedHtml = DOMPurify.sanitize(parsed) as MarkdownContent;
    } catch (error) {
      console.error("Markdown parsing error:", error);
    }
  }

  function applyFormat(action: FormatAction) {
    if (!editorView) return;

    const state = editorView.state;
    const { from, to } = state.selection.main;
    const selectedText = state.sliceDoc(from, to);

    let insertText = "";
    let cursorOffset = action.cursorOffset;

    if (from === to) {
      insertText = action.markdown;
    } else {
      if (action.block) {
        const lines = selectedText.split("\n");
        insertText = lines
          .map((line: string) => action.markdown + line)
          .join("\n");
        cursorOffset =
          selectedText.length + action.markdown.length * lines.length;
      } else {
        const [start, end] = action.markdown.split(
          action.cursorOffset === 1 ? "*" : "**"
        );
        insertText = start + selectedText + (end || start);
        cursorOffset = selectedText.length + action.markdown.length;
      }
    }

    editorView.dispatch({
      changes: { from, to, insert: insertText },
      selection: {
        anchor: from + (action.cursorOffset ?? action.markdown.length),
      },
    });

    editorView.focus();
  }

  onMount(() => {
    editorContainer = document.getElementById("editor") as HTMLDivElement;
    previewContainer = document.getElementById("preview") as HTMLDivElement;

    const extensions: Extension[] = [
      basicSetup,
      EditorView.lineWrapping,
      markdown({
        base: markdownLanguage,
        codeLanguages: languages,
      }),
      oneDark,
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          value = update.state.doc.toString() as MarkdownContent;
        }
      }),
    ];

    editorView = new EditorView({
      state: EditorState.create({
        doc: initialValue,
        extensions,
      }),
      parent: editorContainer,
    });

    return () => {
      editorView?.destroy();
    };
  });
</script>

<div class="markdown-editor-container bg-white dark:bg-gray-900">
  <Tooltip.Provider>
    <div class="editor-toolbar">
      <!-- Text formatting -->
      <div class="toolbar-group">
        {#each formatActions.text as action}
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button
                variant="ghost"
                size="sm"
                data-state={activeFormats.has(action.label) ? "on" : "off"}
                onclick={() => {
                  if (activeFormats.has(action.label)) {
                    activeFormats.delete(action.label);
                  } else {
                    activeFormats.add(action.label);
                  }
                  applyFormat(action);
                }}
                class="hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {#key action.icon}
                  <action.icon size={16} />
                {/key}
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>{action.tooltip}</Tooltip.Content>
          </Tooltip.Root>
        {/each}
      </div>

      <Separator orientation="vertical" class="h-8" />

      <!-- Headers dropdown -->
      <div class="toolbar-group">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button variant="ghost" size="sm" class="toolbar-btn">
              <Heading1 size={16} />
              <ChevronDown size={16} class="ml-1" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="start" class="w-56">
            {#each formatActions.headers as action}
              <DropdownMenu.Item onclick={() => applyFormat(action)}>
                <div class="flex items-center">
                  <action.icon size={16} class="mr-2" />
                  <span>{action.label}</span>
                  <span class="text-muted-foreground ml-auto text-xs"
                    >{action.tooltip}</span
                  >
                </div>
              </DropdownMenu.Item>
            {/each}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>

      <Separator orientation="vertical" class="h-8" />

      <!-- Lists -->
      <div class="toolbar-group">
        {#each formatActions.lists as action}
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button
                variant="ghost"
                size="sm"
                onclick={() => applyFormat(action)}
              >
                {#key action.icon}
                  <action.icon size={16} />
                {/key}
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>{action.tooltip}</Tooltip.Content>
          </Tooltip.Root>
        {/each}
      </div>

      <Separator orientation="vertical" class="h-8" />

      <!-- Blocks -->
      <div class="toolbar-group">
        {#each formatActions.blocks as action}
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button
                variant="ghost"
                size="sm"
                onclick={() => applyFormat(action)}
              >
                {#key action.icon}
                  <action.icon size={16} />
                {/key}
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>{action.tooltip}</Tooltip.Content>
          </Tooltip.Root>
        {/each}
      </div>

      <Separator orientation="vertical" class="h-8" />

      <!-- Media -->
      <div class="toolbar-group">
        {#each formatActions.media as action}
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button
                variant="ghost"
                size="sm"
                onclick={() => applyFormat(action)}
              >
                {#key action.icon}
                  <action.icon size={16} />
                {/key}
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>{action.tooltip}</Tooltip.Content>
          </Tooltip.Root>
        {/each}
      </div>

      <Separator orientation="vertical" class="h-8" />

      <!-- Special -->
      <div class="toolbar-group">
        {#each formatActions.special as action}
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button
                variant="ghost"
                size="sm"
                onclick={() => applyFormat(action)}
              >
                {#key action.icon}
                  <action.icon size={16} />
                {/key}
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>{action.tooltip}</Tooltip.Content>
          </Tooltip.Root>
        {/each}
      </div>

      <div class="flex-1"></div>
      <span class="stats">Words: {wordCount} | Chars: {characterCount}</span>
    </div>
  </Tooltip.Provider>

  <div class="editor-preview-container">
    <div
      id="editor"
      class="editor-panel bg-white dark:bg-gray-800 h-full"
    ></div>
    <div id="preview" class="preview-panel bg-white dark:bg-gray-800">
      <div class="prose dark:prose-invert max-w-none h-full">
        {@html renderedHtml}
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  .markdown-editor-container {
    @apply h-full flex flex-col;
  }

  .editor-toolbar {
    @apply flex items-center gap-2 p-2 bg-accent border-b border-border overflow-x-auto;
    min-height: 3rem; /* Ensure consistent height even when scrolling */
  }

  .toolbar-group {
    @apply flex items-center gap-1;
  }

  :global(.toolbar-btn) {
    @apply hover:bg-gray-200 dark:hover:bg-gray-700;
  }

  .editor-preview-container {
    @apply flex flex-1 overflow-hidden;
  }

  .editor-panel,
  .preview-panel {
    @apply w-1/2 h-full overflow-auto p-4;
  }

  .preview-panel {
    @apply border-l border-gray-200 dark:border-gray-700;
  }

  .stats {
    @apply text-sm text-gray-500 dark:text-gray-400;
  }

  /* Add padding to ensure last items are visible when scrolling */
  .toolbar-group:last-child {
    @apply pr-4;
  }

  /* Ensure dropdown content is positioned correctly */
  :global(.dropdown-content) {
    position: fixed;
    z-index: 50;
  }
</style>
