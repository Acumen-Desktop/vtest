<script lang="ts">
  import { onMount } from "svelte";
  import { paneStore } from "$lib/stores/paneStore";
  import FileExplorer from "$lib/components/panes/FileExplorer.svelte";
  import CodeEditor from "$lib/components/panes/CodeEditor.svelte";
  import Terminal from "$lib/components/panes/Terminal.svelte";
  import type { FileNode } from "$lib/types/fileExplorer";
  import type { PaneId } from "$lib/types/pane";

  const sampleCode = `// Welcome to the Code Editor
import { greet } from './utils';

function main() {
    const message = greet('Developer');
    // console.log(message);
}

main();
`;

  const fileTree: FileNode = {
    name: "src",
    type: "directory",
    expanded: true,
    children: [
      {
        name: "lib",
        type: "directory",
        expanded: true,
        children: [
          { name: "components", type: "directory", children: [] },
          { name: "stores", type: "directory", children: [] },
          { name: "utils", type: "directory", children: [] },
        ],
      },
      {
        name: "routes",
        type: "directory",
        expanded: true,
        children: [
          { name: "+layout.svelte", type: "file" },
          { name: "+page.svelte", type: "file" },
        ],
      },
      { name: "app.css", type: "file" },
    ],
  };

  onMount(() => {
    // Reset existing content
    paneStore.reset();

    // Define and add content for each pane
    const panes: Record<
      PaneId,
      { id: string; component: any; title: string; props: any }
    > = {
      topLeft: {
        id: "file-explorer",
        component: FileExplorer,
        title: "File Explorer",
        props: { rootNode: fileTree },
      },
      topRight: {
        id: "main-editor",
        component: CodeEditor,
        title: "Code Editor",
        props: {
          content: sampleCode,
          language: "javascript",
        },
      },
      bottomLeft: {
        id: "main-terminal",
        component: Terminal,
        title: "Terminal",
        props: {
          initialText: "$ Welcome to the Terminal\n$ Ready for commands...\n",
        },
      },
      bottomCenter: {
        id: "secondary-editor",
        component: CodeEditor,
        title: "Secondary Editor",
        props: {
          content: "// Secondary Editor\n",
          language: "javascript",
        },
      },
      bottomRight: {
        id: "output-terminal",
        component: Terminal,
        title: "Output",
        props: {
          initialText: "$ Output Terminal\n",
        },
      },
      footer: {
        id: "status-terminal",
        component: Terminal,
        title: "Status",
        props: {
          initialText: "$ Status and Logs\n",
        },
      },
    };

    // Add each pane's content
    Object.entries(panes).forEach(([paneId, content]) => {
      paneStore.addContent(paneId as PaneId, { ...content, closeable: true });
    });
  });
</script>

<div class="page">
  <!-- Page content will be rendered through the layout -->
</div>

<style>
  .page {
    height: 100%;
  }
</style>
