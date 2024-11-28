<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import Devtools from "../buttons/Devtools.svelte";
  import Icon from "$lib/components/common/Icon.svelte";
  import { Moon, Sun, ChevronLeft, ChevronRight } from "lucide-svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";

  let paddingStyle = $state("");
  let isDarkMode = $state(true);
  let canGoBack = $state(false);
  let canGoForward = $state(false);

  let navigationHistory = $state<string[]>([]);

  $effect(() => {
    const MACOS_CONTROL_WIDTH = 80;
    const WINDOWS_CONTROL_WIDTH = 140;
    paddingStyle =
      window.api?.platform === "darwin"
        ? `padding-left: ${MACOS_CONTROL_WIDTH}px`
        : `padding-right: ${WINDOWS_CONTROL_WIDTH}px`;

    document.documentElement.classList.add("dark");

    navigationHistory = [window.location.pathname];
  });

  $effect(() => {
    const currentPath = $page.url.pathname;

    if (navigationHistory[navigationHistory.length - 1] !== currentPath) {
      navigationHistory = [...navigationHistory, currentPath];
    }

    updateNavigationState();
  });

  function updateNavigationState() {
    const currentIndex = navigationHistory.findIndex(
      (path) => path === $page.url.pathname
    );

    canGoBack = currentIndex > 0;
    canGoForward = currentIndex < navigationHistory.length - 1;
  }

  function navigateBack() {
    if (canGoBack) {
      const currentIndex = navigationHistory.findIndex(
        (path) => path === $page.url.pathname
      );

      if (currentIndex > 0) {
        const previousPath = navigationHistory[currentIndex - 1];
        goto(previousPath);
      }
    }
  }

  function navigateForward() {
    if (canGoForward) {
      const currentIndex = navigationHistory.findIndex(
        (path) => path === $page.url.pathname
      );

      if (currentIndex < navigationHistory.length - 1) {
        const nextPath = navigationHistory[currentIndex + 1];
        goto(nextPath);
      }
    }
  }

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
    <div class="window-drag-region">
      <Icon name="grip" />
    </div>
    <Button variant="ghost" size="icon">
      <Icon name="menu" />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      onclick={navigateBack}
      disabled={!canGoBack}
      class="navigation-button"
    >
      <ChevronLeft size={20} />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      onclick={navigateForward}
      disabled={!canGoForward}
      class="navigation-button"
    >
      <ChevronRight size={20} />
    </Button>
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
        <Moon size={24} />
      {:else}
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
    width: 130px;
    @apply flex items-center justify-between h-full bg-[hsl(var(--background))];
  }

  .window-drag-region {
    -webkit-app-region: drag;
    display: flex;
    align-items: center;
    margin-right: 6px;
  }

  /* .window-grip-section {
    cursor: move;
  } */

  #dynamicCenter-section {
    @apply flex-1 flex items-center bg-[hsl(var(--accent))] rounded-t-lg mx-2 overflow-hidden h-9 mt-1;
  }

  .left-section {
    @apply flex items-center gap-1 p-1 flex-grow-0;
  }

  .center-section {
    @apply flex items-center gap-1 p-1 flex-grow justify-center;
  }

  .right-section {
    @apply flex items-center gap-1 p-1 flex-grow-0;
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

  :global(.title-button) {
    @apply hover:bg-neutral-700/50;
  }

  :global(.theme-toggle) {
    @apply text-[hsl(var(--secondary-foreground))] hover:bg-neutral-700/50;
  }

  :global(.navigation-button:disabled) {
    @apply cursor-not-allowed opacity-50;
  }
</style>
