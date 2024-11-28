<script lang="ts">
  import { paneStore } from "$lib/stores/paneStore";
  import type {
    PaneId,
    PaneState,
    PaneContent as PaneContentType,
  } from "$lib/types/pane";

  const { paneId } = $props<{ paneId: PaneId }>();

  let error = $state<string | null>(null);
  let content = $derived<PaneContentType | null>(
    $paneStore[paneId as keyof PaneState]
  );

  $effect(() => {
    try {
      paneStore.loadFromStorage();
    } catch (e) {
      console.error("Failed to load pane state:", e);
    }

    return () => {
      try {
        paneStore.saveToStorage();
      } catch (e) {
        console.error("Failed to save pane state:", e);
      }
    };
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

<div class="pane-wrapper">
  {#if error}
    <div class="error-message">
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
          <button class="close-button" onclick={handleRemove} title="Close">
            ×
          </button>
        {/if}
      </div>
    </div>
    <div class="pane-content">
      {#key content.id}
        <div>
          {#if content.component && content.props}
            <content.component {...content.props} />
          {/if}
        </div>
      {/key}
    </div>
  {:else}
    <div class="empty-pane">
      <span>Empty Pane</span>
    </div>
  {/if}
</div>

export default PaneContent;

<style>
  .pane-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--background);
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    animation: fadeIn 200ms ease-out;
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
    animation: slideIn 150ms ease-out;
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
    animation: fadeIn 150ms ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideIn {
    from {
      transform: translateY(-100%);
    }
    to {
      transform: translateY(0);
    }
  }
</style>
