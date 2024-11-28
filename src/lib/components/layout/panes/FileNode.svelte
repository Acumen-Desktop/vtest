<script lang="ts">
  import FileNode_1 from './FileNode.svelte';
  import { ChevronRight, ChevronDown, Folder, File } from "lucide-svelte";
  import type { FileNode } from "$lib/types/fileExplorer";

  interface Props {
    node: FileNode;
    level?: number;
    onToggle: (node: FileNode) => void;
  }

  let { node, level = 0, onToggle }: Props = $props();

  let paddingLeft = $derived(`${level * 1.5}rem`);
</script>

<div class="file-node" style="padding-left: {paddingLeft}">
  <button
    class="flex items-center gap-2 w-full hover:bg-gray-700/50 p-1 rounded"
    onclick={() => onToggle(node)}
  >
    {#if node.type === "directory"}
      {@const SvelteComponent = node.expanded ? ChevronDown : ChevronRight}
      <span class="icon">
        <SvelteComponent
          class="size-4"
        />
      </span>
      <Folder class="size-4" />
    {:else}
      <span class="w-4"></span>
      <File class="size-4" />
    {/if}
    <span class="text-sm">{node.name}</span>
  </button>

  {#if node.type === "directory" && node.expanded}
    {#each node.children || [] as child}
      <FileNode_1 node={child} level={level + 1} {onToggle} />
    {/each}
  {/if}
</div>
