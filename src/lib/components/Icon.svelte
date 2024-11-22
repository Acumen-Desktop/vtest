<script lang="ts">
    // import { onMount } from "svelte";
    // import { tick } from "svelte";

    let { name, size = 22, class_name = "" } = $props();

    let svg = $state("");

    async function loadIcon(iconName: string) {
        try {
            const response = await fetch(
                `/src/lib/assets/icons/${iconName}.svg`,
            );
            svg = await response.text();
        } catch (error) {
            console.error(`Failed to load icon: ${iconName}`, error);
        }
    }

    $effect(() => {
        loadIcon(name);
    });
</script>

<div
    class="inline-block {class_name}"
    style="width: {size}px; height: {size}px;"
>
    {@html svg}
</div>

<style>
    div :global(svg) {
        width: 100%;
        height: 100%;
    }
</style>
