<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Separator } from "$lib/components/ui/separator";
  import {
    ToggleGroup,
    ToggleGroupItem,
  } from "$lib/components/ui/toggle-group";
  import * as Tooltip from "$lib/components/ui/tooltip";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
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
  import type { EditorView } from "@codemirror/view";
  import type { ComponentType } from "svelte";

  let { editorView } = $props<{ editorView: EditorView | undefined }>();

  type FormatAction = {
    icon: ComponentType;
    label: string;
    markdown: string;
    cursorOffset?: number;
    block?: boolean;
    tooltip: string;
  };

  let activeFormats = $state(new Set<string>());

  const formatActions: Record<string, FormatAction[]> = {
    text: [
      {
        icon: Bold,
        label: "Bold",
        markdown: "**",
        tooltip: "**bold**",
      },
      {
        icon: Italic,
        label: "Italic",
        markdown: "*",
        tooltip: "*italic*",
      },
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

  function applyFormat(action: FormatAction) {
    if (!editorView) return;

    const state = editorView.state;
    const { from, to } = state.selection.main;
    const selectedText = state.sliceDoc(from, to);

    let insertText = "";
    let newCursor = from;

    if (from === to) {
      // No text selected
      insertText = action.markdown;
      newCursor = from + (action.cursorOffset ?? action.markdown.length);
    } else {
      // Text selected
      if (action.block) {
        // For block-level elements, apply to each line
        const lines = selectedText.split("\n");
        insertText = lines
          .map((line: string) => action.markdown + line)
          .join("\n");
        newCursor = to + action.markdown.length * lines.length;
      } else {
        // For inline elements, wrap the selection
        const delimiter = action.markdown;
        insertText = `${delimiter}${selectedText}${delimiter}`;
        newCursor = to + delimiter.length * 2;
      }
    }

    editorView.dispatch({
      changes: { from, to, insert: insertText },
      selection: { anchor: newCursor },
    });

    editorView.focus();
  }
</script>

<Tooltip.Provider>
  <div class="editor-toolbar">
    {#each Object.entries(formatActions) as [group, actions]}
      <div class="toolbar-group">
        {#each actions as action}
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button
                variant="ghost"
                size="icon"
                class="toolbar-btn"
                onclick={() => applyFormat(action)}
              >
                {#key action.icon}
                  <action.icon class="h-4 w-4" />
                {/key}
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content side="bottom" sideOffset={20}>
              <p>{action.tooltip}</p>
            </Tooltip.Content>
          </Tooltip.Root>
        {/each}
      </div>
      {#if group !== "special"}
        <Separator orientation="vertical" class="mx-1" />
      {/if}
    {/each}
  </div>
</Tooltip.Provider>

<style lang="postcss">
  .editor-toolbar {
    @apply flex items-center gap-2 p-2 flex-wrap;
    min-height: 3rem;
    background-color: hsl(var(--accent));
    border-bottom: 1px solid hsl(var(--border));
  }

  .toolbar-group {
    @apply flex items-center gap-1;
  }

  :global(.toolbar-btn) {
    color: hsl(var(--accent-foreground));
  }

  :global(.toolbar-btn:hover) {
    background-color: hsl(var(--accent-foreground));
    color: hsl(var(--accent));
  }

  /* Add padding to ensure last items are visible when scrolling */
  .toolbar-group:last-child {
    @apply pr-4;
  }
</style>
