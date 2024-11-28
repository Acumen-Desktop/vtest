<script lang="ts">
  import "../styles/app.css";
  import TitleBar from "$lib/components/layout/TitleBar.svelte";
  import AppSidebar from "$lib/components/layout/app-sidebar.svelte";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";

  let { children } = $props();

  $effect(() => {
    // if (preferredTheme.theme === "dark")
    // 	window.setTitleBarColors("#374151", "#f8fafc");
    // else window.setTitleBarColors("#e5e7eb", "#020617");
  });
</script>

<div
  id="mainLayout"
  class="overflow-hidden h-full bg-gradient-to-br from-white to-zinc-50 text-slate-950 dark:from-zinc-800 dark:to-zinc-900 dark:text-slate-50"
>
  <TitleBar />
  <Sidebar.Provider style="--sidebar-width: 350px;">
    <AppSidebar />
    <Sidebar.Inset>
      <header
        class="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4"
      >
        <Sidebar.Trigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-2 h-4" />
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item class="hidden md:block">
              <Breadcrumb.Link href="#">All Inboxes</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator class="hidden md:block" />
            <Breadcrumb.Item>
              <Breadcrumb.Page>Inbox</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      </header>
      <div class="flex flex-1 flex-col gap-4 p-4">
        {#each Array.from({ length: 24 }) as _, index (index)}
          <div class="bg-muted/50 aspect-video h-12 w-full rounded-lg"></div>
        {/each}
      </div>
    </Sidebar.Inset>
  </Sidebar.Provider>
  {@render children()}
</div>

<style>
  :global(:root) {
    --background: theme("colors.white");
    --background-secondary: theme("colors.gray.100");
    --foreground: theme("colors.slate.950");
    --muted-foreground: theme("colors.slate.500");
    --border: theme("colors.gray.200");
    --accent: theme("colors.gray.100");
  }

  :global(.dark) {
    --background: theme("colors.zinc.900");
    --background-secondary: theme("colors.zinc.800");
    --foreground: theme("colors.slate.50");
    --muted-foreground: theme("colors.slate.400");
    --border: theme("colors.zinc.800");
    --accent: theme("colors.zinc.800");
  }
</style>
