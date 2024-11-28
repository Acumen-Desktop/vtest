import { paneStore } from "$lib/stores/paneStore";
import Welcome from "$lib/components/layout/panes/Welcome.svelte";
import FileExplorer from "$lib/components/layout/panes/FileExplorer.svelte";
import CodeEditor from "$lib/components/layout/panes/CodeEditor.svelte";
import Terminal from "$lib/components/layout/panes/Terminal.svelte";
import type { PaneId, PaneContent } from "../types/pane";

// Define the default layout configuration
export const defaultLayout: Record<PaneId, PaneContent> = {
  // Left side: File Explorer
  topLeft: {
    id: "file-explorer",
    component: FileExplorer,
    title: "Files",
    closeable: true,
    props: {
      rootNode: null, // Will use default mock data
    },
  },

  // Main editor area
  topRight: {
    id: "code-editor",
    component: CodeEditor,
    title: "Editor",
    closeable: true,
    props: {
      content: "// Welcome to the Code Editor\n",
      language: "javascript",
    },
  },

  // Bottom panels
  bottomLeft: {
    id: "terminal-1",
    component: Terminal,
    title: "Terminal 1",
    closeable: true,
    props: {
      initialText: "$ Terminal 1 ready\n",
    },
  },

  bottomCenter: {
    id: "terminal-2",
    component: Terminal,
    title: "Terminal 2",
    closeable: true,
    props: {
      initialText: "$ Terminal 2 ready\n",
    },
  },

  bottomRight: {
    id: "welcome",
    component: Welcome,
    title: "Welcome",
    closeable: true,
    props: {
      message: "Welcome to the IDE!",
    },
  },

  // Footer area
  footer: {
    id: "status",
    component: Welcome,
    title: "Status",
    closeable: false,
    props: {
      message: "Ready",
    },
  },
};

/**
 * Initialize the default layout for all panes
 */
export function initializeDefaultLayout(): void {
  // Clear any existing content
  paneStore.reset();

  // Add each component to its respective pane
  (Object.keys(defaultLayout) as PaneId[]).forEach((paneId) => {
    paneStore.addContent(paneId, defaultLayout[paneId]);
  });
}
