<script lang="ts">
  import { onMount } from "svelte";
  import FileNode from "./FileNode.svelte";
  import type { FileNode as FileNodeType } from "$lib/types/fileExplorer";

  export let rootNode: FileNodeType | null = null;

  let loading = !rootNode;

  onMount(() => {
    if (!rootNode) {
      // Default mock data if no root node provided
      rootNode = {
        name: "src",
        type: "directory",
        expanded: true,
        children: [
          {
            name: "lib",
            type: "directory",
            children: [
              { name: "components", type: "directory", children: [] },
              { name: "stores", type: "directory", children: [] },
              { name: "utils", type: "directory", children: [] },
            ],
          },
          {
            name: "routes",
            type: "directory",
            children: [
              { name: "+layout.svelte", type: "file" },
              { name: "+page.svelte", type: "file" },
            ],
          },
          { name: "app.css", type: "file" },
        ],
      };
      loading = false;
    }
  });

  function toggleNode(node: FileNodeType) {
    if (node.type === "directory") {
      node.expanded = !node.expanded;
      rootNode = rootNode; // Trigger reactivity
    }
  }
</script>

<div class="file-explorer">
  {#if loading}
    <div class="flex items-center justify-center h-full">
      <span class="loading">Loading...</span>
    </div>
  {:else if rootNode}
    <FileNode node={rootNode} onToggle={toggleNode} />
  {/if}
</div>

<style lang="postcss">
  .file-explorer {
    @apply h-full bg-gray-800/50 text-gray-200;
  }

  .loading {
    @apply text-sm text-gray-400;
  }

  :global(.file-node button:hover) {
    @apply bg-gray-700/50;
  }

  :global(.file-node .icon) {
    @apply w-4 h-4 flex items-center justify-center;
  }
</style>
