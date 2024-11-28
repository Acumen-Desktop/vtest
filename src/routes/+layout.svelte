<script lang="ts">
  import type { Snippet } from "svelte";
  import type { LayoutData } from "./$types";
  import TitleBar from "$lib/components/layout/TitleBar.svelte";
  import "../styles/app.css";

  let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<TitleBar />
{@render children()}
