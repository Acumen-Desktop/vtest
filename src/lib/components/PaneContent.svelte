<script lang="ts">
  import { paneStore } from "$lib/stores/paneStore";
  import type { PaneId } from "$lib/types/pane";
  import { fade, slide } from "svelte/transition";
  import { onMount, onDestroy } from "svelte";

  export let paneId: PaneId;

  let error: string | null = null;
  $: content = $paneStore[paneId];

  onMount(() => {
    try {
      paneStore.loadState();
    } catch (e) {
      console.error("Failed to load pane state:", e);
    }
  });

  onDestroy(() => {
    try {
      paneStore.saveState();
    } catch (e) {
      console.error("Failed to save pane state:", e);
    }
  });

  function handleRemove() {
    try {
      paneStore.removeContent(paneId);
    } catch (e) {
      error = "Failed to remove content";
      setTimeout(() => (error = null), 3000);
    }
  }
</script>

<div class="pane-wrapper" transition:fade={{ duration: 200 }}>
  {#if error}
    <div class="error-message" transition:slide>
      {error}
    </div>
  {/if}

  {#if content}
    <div class="pane-header">
      <div class="header-left">
        {#if content.title}
          <span class="pane-title">{content.title}</span>
        {/if}
      </div>
      <div class="header-right">
        {#if content.closeable}
          <button class="close-button" on:click={handleRemove} title="Close">
            ×
          </button>
        {/if}
      </div>
    </div>
    <div class="pane-content">
      {#key content.id}
        <div transition:fade={{ duration: 150 }}>
          <svelte:component this={content.component} {...content.props} />
        </div>
      {/key}
    </div>
  {:else}
    <div class="empty-pane" transition:fade>
      <span>Empty Pane</span>
    </div>
  {/if}
</div>

<style>
  .pane-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--background);
    border-radius: 4px;
    overflow: hidden;
    position: relative;
  }

  .error-message {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    padding: 0.5rem;
    background-color: rgb(220, 38, 38);
    color: white;
    text-align: center;
    z-index: 100;
  }

  .pane-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    background-color: var(--muted);
    border-bottom: 1px solid var(--border);
  }

  .header-left,
  .header-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .pane-title {
    font-size: 0.875rem;
    font-weight: 500;
  }

  .close-button {
    padding: 0.25rem 0.5rem;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--muted-foreground);
    transition: color 0.2s;
  }

  .close-button:hover {
    color: var(--foreground);
  }

  .pane-content {
    flex: 1;
    overflow: auto;
    padding: 0.5rem;
  }

  .empty-pane {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--muted-foreground);
    font-size: 0.875rem;
  }
</style>
