<!-- Title bar component that overlays the native window controls -->
<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Separator } from "$lib/components/ui/separator";
    import { onMount } from "svelte";
    import Devtools from "./Devtools.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Grip from "lucide-svelte/icons/grip";

    // OS detection
    let isMac = false;
    let isLinux = false;

    onMount(() => {
        // Get platform info from the electron process
        isMac = window.api?.platform === "darwin";
        isLinux = window.api?.platform === "linux";
        console.log(
            "Line 15 - TitleBar.svelte - window.api.platform: ",
            window.api.platform,
        );
    });

    // Constants for spacing around native window controls
    const MACOS_CONTROL_WIDTH = 80;
    const WINDOWS_CONTROL_WIDTH = 140;

    // Determine padding based on OS
    $: controlsPadding = isMac ? MACOS_CONTROL_WIDTH : WINDOWS_CONTROL_WIDTH;
    $: paddingStyle = isMac
        ? `padding-left: ${controlsPadding}px`
        : `padding-right: ${controlsPadding}px`;
</script>

<div class="title-bar" style={paddingStyle}>
    <div class="window-grip-section">
        <Grip />
    </div>
    <!-- Left section - Menu items -->
    <div class="left-section">
        <Button variant="ghost" size="sm" class="title-button">
            <Icon name="menu" />
        </Button>
        <Button variant="ghost" size="sm" class="title-button">
            <Icon name="source-control" />
        </Button>
        <Button variant="ghost" size="sm" class="title-button">
            <Icon name="extensions" />
        </Button>
    </div>

    <!-- Center section - Search/Command palette -->
    <div class="center-section">
        <div class="search-container">
            <Icon name="search" class_name="search-icon" />
            <input
                type="text"
                placeholder="Search or Command (Ctrl+Shift+P)"
                class="search-input"
            />
        </div>
    </div>

    <!-- Right section - Panel controls -->
    <div class="right-section">
        <Button variant="ghost" size="sm" class="title-button">
            <Icon name="layout-panel" />
        </Button>
        <Button variant="ghost" size="sm" class="title-button">
            <Icon name="layout-sidebar-right" />
        </Button>
        <Button variant="ghost" size="sm" class="title-button">
            <Icon name="layout-statusbar" />
        </Button>
        {#if import.meta.env.DEV}
            <Devtools />
        {/if}
    </div>
</div>

<style>
    .title-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 35px;
        background-color: var(--background);
        border-bottom: 1px solid var(--border);
        padding: 0 8px;
        font-size: 13px;
        user-select: none;
    }
    .window-grip-section {
        -webkit-app-region: drag;
        padding-right: 8px;
    }

    .left-section,
    .right-section {
        display: flex;
        align-items: center;
        gap: 4px;
        -webkit-app-region: no-drag;
    }

    .center-section {
        flex: 1;
        display: flex;
        justify-content: center;
        -webkit-app-region: no-drag;
        padding: 0 32px;
    }

    .search-container {
        position: relative;
        width: 100%;
        max-width: 600px;
        display: flex;
        align-items: center;
    }

    .search-input {
        width: 100%;
        height: 24px;
        background-color: var(--background-secondary);
        border: 1px solid transparent;
        border-radius: 4px;
        padding: 0 8px 0 32px;
        font-size: 12px;
        color: var(--foreground);
        transition: border-color 0.2s;
    }

    .search-input:focus {
        outline: none;
        border-color: var(--border);
    }

    :global(.title-button) {
        height: 28px;
        padding: 0 6px;
        color: var(--foreground);
    }

    :global(.title-button:hover) {
        background-color: var(--accent);
    }
</style>
