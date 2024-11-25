<!-- +layout.svelte -->
<script lang="ts">
    import { setContext, createRawSnippet } from "svelte";
    import { writable } from "svelte/store";

    // Create dummy snippets for each slot
    const dummySnippet = (text: string) =>
        createRawSnippet(() => ({ render: () => text }));

    // Define writable stores for each slot
    let slotLeft = writable(dummySnippet("LEFT"));
    let slotCenter = writable(dummySnippet("CENTER"));
    let slotRight = writable(dummySnippet("RIGHT"));

    // Set context for slots
    setContext("LayoutSlot", { slotLeft, slotCenter, slotRight });

    let { children } = $props();
</script>

<div class="layout">
    <aside class="left-slot">
        {@render $slotLeft()}
    </aside>

    <main class="center-slot">
        {@render $slotCenter()}
        {@render children()}
        <!-- Default children content -->
    </main>

    <aside class="right-slot">
        {@render $slotRight()}
    </aside>
</div>
