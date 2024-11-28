<script lang="ts">
  interface Props {
    message?: string;
  }

  let { message = "Welcome to the application!" }: Props = $props();
</script>

<div class="welcome-pane">
  <h2>{message}</h2>
  <p>This is a sample pane component.</p>
</div>

<style lang="postcss">
  .welcome-pane {
    @apply p-4;
  }

  h2 {
    @apply text-lg font-semibold mb-2;
  }

  p {
    @apply text-sm text-gray-400;
  }
</style>
