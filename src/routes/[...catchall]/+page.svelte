<script lang="ts">
  import { page } from "$app/stores";
  import { Button } from "$lib/components/ui/button";
  import { goto } from "$app/navigation";

  const { url } = $page;

  console.log(
    "Line 7 - [...catchall]/+page.svelte - Rendering 404 for path:",
    url.pathname
  );

  async function goHome() {
    try {
      await goto("/", { replaceState: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log(
          "Line 14 - [...catchall]/+page.svelte - Navigation error:",
          err
        );
      }
    }
  }
</script>

<div class="error-container">
  <div class="error-content">
    <h1>404</h1>
    <p class="error-message">Page not found</p>
    <Button variant="default" onclick={goHome}>Go Home</Button>
  </div>
</div>

<style lang="postcss">
  .error-container {
    @apply flex items-center justify-center min-h-screen text-foreground p-4;
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
