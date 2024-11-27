<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { onMount } from "svelte";
    import Devtools from "./Devtools.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import { Moon, Sun } from "lucide-svelte";

    let paddingStyle = "";
    let isDarkMode = true;

    onMount(() => {
        const MACOS_CONTROL_WIDTH = 80;
        const WINDOWS_CONTROL_WIDTH = 140;
        paddingStyle =
            window.api?.platform === "darwin"
                ? `padding-left: ${MACOS_CONTROL_WIDTH}px`
                : `padding-right: ${WINDOWS_CONTROL_WIDTH}px`;

        // Set initial dark mode
        document.documentElement.classList.add("dark");
    });

    function toggleTheme() {
        isDarkMode = !isDarkMode;
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }
</script>

<div id="titleBar" style={paddingStyle}>
    <div id="commonLeft-section">
        <Icon name="grip" class="align-middle window-grip-section" />
        <Icon name="menu" />
    </div>
    <div id="dynamicCenter-section">
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
                <Icon name="search" />
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
        </div>
    </div>

    <div id="commonRight-section">
        <Button
            variant="ghost"
            size="icon"
            onclick={toggleTheme}
            class="theme-toggle"
        >
            {#if isDarkMode}
                <!-- <Icon name="Moon" /> -->
                <Moon size={24} />
            {:else}
                <!-- <Icon name="Sun" /> -->
                <Sun size={24} />
            {/if}
        </Button>
        {#if import.meta.env.DEV}
            <Devtools />
        {/if}
    </div>
</div>

<style lang="postcss">
    #titleBar {
        @apply flex items-center w-full h-10 bg-[hsl(var(--background))] text-[hsl(var(--secondary-foreground))];
    }

    #commonLeft-section {
        @apply flex items-center justify-between w-14 h-full bg-[hsl(var(--background))];
    }

    #dynamicCenter-section {
        @apply flex-1 flex items-center bg-[hsl(var(--accent))] rounded-t-lg mx-2 overflow-hidden h-9 mt-1;
    }

    .left-section,
    .center-section,
    .right-section {
        @apply flex items-center space-x-1 p-1;
    }

    .left-section {
        @apply flex-grow-0;
    }

    .center-section {
        @apply flex-grow justify-center;
    }

    .right-section {
        @apply flex-grow-0;
    }

    #commonRight-section {
        @apply flex items-center justify-center w-24 h-full bg-[hsl(var(--background))];
    }

    .search-container {
        @apply flex items-center w-full max-w-md;
    }

    .search-input {
        @apply w-full bg-transparent border-none outline-none text-[hsl(var(--secondary-foreground))] placeholder-neutral-500 pl-2;
    }

    .title-button {
        @apply hover:bg-neutral-700;
    }

    .theme-toggle {
        @apply text-[hsl(var(--secondary-foreground))] hover:bg-neutral-700;
    }
</style>
