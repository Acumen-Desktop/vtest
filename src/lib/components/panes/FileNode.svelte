<script lang="ts">
  import { ChevronRight, ChevronDown, Folder, File } from "lucide-svelte";
  import type { FileNode } from "$lib/types/fileExplorer";

  export let node: FileNode;
  export let level: number = 0;
  export let onToggle: (node: FileNode) => void;

  $: paddingLeft = `${level * 1.5}rem`;
</script>

<div class="file-node" style="padding-left: {paddingLeft}">
  <button
    class="flex items-center gap-2 w-full hover:bg-gray-700/50 p-1 rounded"
    on:click={() => onToggle(node)}
  >
    {#if node.type === "directory"}
      <span class="icon">
        <svelte:component
          this={node.expanded ? ChevronDown : ChevronRight}
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
      <svelte:self node={child} level={level + 1} {onToggle} />
    {/each}
  {/if}
</div>
