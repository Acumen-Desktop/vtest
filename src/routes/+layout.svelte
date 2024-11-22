<script lang="ts">
    import "../app.css";
    import Devtools from "$lib/components/Devtools.svelte";
    import TitleBar from "$lib/components/TitleBar.svelte";
    import { preferredTheme } from "$lib/preferredTheme.svelte";

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
