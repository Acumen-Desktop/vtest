<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import Icon from "$lib/components/common/Icon.svelte";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  // Create a store for panel states
  const panelState = writable<Record<string, boolean>>({});

  onMount(async () => {
    // Get the initial panel states from config
    try {
      const response = await window.api.invoke("getPanelStates");
      if (response.success) {
        // Update both the local state and the store
        isDevToolsOpen = response.panelStates.devTools ?? false;
        panelState.set(response.panelStates);
      }
    } catch (error) {
      console.error("Failed to get initial panel states:", error);
    }
  });

  let isDevToolsOpen = $state(false);

  async function toggleDevtools() {
    try {
      const newState = !isDevToolsOpen;
      const result = await window.api.invoke("toggleDevTools", {
        panelId: "devTools",
        isOpen: newState,
      });

      if (result.success) {
        isDevToolsOpen = newState;
      }
    } catch (error) {
      console.error("Failed to toggle devtools:", error);
    }
  }
</script>

<Button onclick={toggleDevtools} variant="ghost" size="sm" class="title-button">
  <Icon name={isDevToolsOpen ? "debug" : "bug"} />
</Button>
