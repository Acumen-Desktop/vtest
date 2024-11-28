<script lang="ts">
  import { page } from "$app/stores";
  import { Button } from "$lib/components/ui/button";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  const { status, error } = $page;

  onMount(() => {
    // Only log non-404 errors to avoid noise
    if (status !== 404) {
      console.log("Line 11 - +error.svelte - Error page loaded:", {
        status,
        error,
      });
    }
  });

  async function goHome() {
    try {
      await goto("/", { replaceState: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log("Line 19 - +error.svelte - Navigation error:", err);
      }
    }
  }
</script>

<div class="error-container">
  <div class="error-content">
    <h1>{status}</h1>
    <p class="error-message">
      {#if status === 404}
        Page not found
      {:else}
        {error?.message || "An unexpected error occurred"}
      {/if}
    </p>
    <Button variant="default" onclick={goHome}>Go Home</Button>
  </div>
</div>

<style lang="postcss">
  .error-container {
    @apply flex items-center justify-center min-h-screen bg-background text-foreground p-4;
  }

  .error-content {
    @apply flex flex-col items-center gap-4 p-8 rounded-lg bg-card;
  }

  h1 {
    @apply text-6xl font-bold text-primary;
  }

  .error-message {
    @apply text-xl text-muted-foreground mb-4;
  }
</style>
