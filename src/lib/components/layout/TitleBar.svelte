<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import Devtools from "../buttons/Devtools.svelte";
  import Icon from "$lib/components/common/Icon.svelte";
  import { Moon, Sun, ChevronLeft, ChevronRight, Home } from "lucide-svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";

  let paddingStyle = $state("");
  let isDarkMode = $state(true);
  let navigationHistory = $state<string[]>([]);
  let currentIndex = $state(-1);

  $effect(() => {
    const MACOS_CONTROL_WIDTH = 80;
    const WINDOWS_CONTROL_WIDTH = 140;
    paddingStyle =
      window.api?.platform === "darwin"
        ? `padding-left: ${MACOS_CONTROL_WIDTH}px`
        : `padding-right: ${WINDOWS_CONTROL_WIDTH}px`;

    document.documentElement.classList.add("dark");

    if (navigationHistory.length === 0) {
      navigationHistory = [$page.url.pathname];
      currentIndex = 0;
    }
  });

  $effect(() => {
    const currentPath = $page.url.pathname;

    if (currentPath !== navigationHistory[currentIndex]) {
      navigationHistory = [
        ...navigationHistory.slice(0, currentIndex + 1),
        currentPath,
      ];
      currentIndex = navigationHistory.length - 1;
    }
  });

  async function handleNavigation(path: string) {
    try {
      console.log("Line 12 - TitleBar.svelte - Navigating to:", path);
      await goto(path, { replaceState: true });
    } catch (err: unknown) {
      // Suppress the error as it will be handled by the error page
      if (err instanceof Error && !err.message.includes("Not found")) {
        console.log("Line 17 - TitleBar.svelte - Navigation error:", err);
      }
    }
  }

  function navigateBack() {
    if (currentIndex > 0) {
      currentIndex--;
      handleNavigation(navigationHistory[currentIndex]);
    }
  }

  function navigateForward() {
    if (currentIndex < navigationHistory.length - 1) {
      currentIndex++;
      handleNavigation(navigationHistory[currentIndex]);
    }
  }

  function navigateHome() {
    if ($page.url.pathname !== "/") {
      handleNavigation("/");
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
      onclick={navigateHome}
      disabled={$page.url.pathname === "/"}
      class="navigation-button"
      data-testid="home-button"
    >
      <Home size={20} />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      onclick={navigateBack}
      disabled={currentIndex <= 0}
      class="navigation-button"
      data-testid="back-button"
    >
      <ChevronLeft size={20} />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      onclick={navigateForward}
      disabled={currentIndex >= navigationHistory.length - 1}
      class="navigation-button"
      data-testid="forward-button"
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
      <Button
        variant="ghost"
        size="sm"
        class="title-button"
        onclick={() => handleNavigation("/this-page-does-not-exist")}
      >
        Bad Link
      </Button>
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
    width: 170px;
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

  :global(.navigation-button) {
    @apply transition-opacity duration-200;
  }

  :global(.navigation-button:disabled) {
    @apply opacity-50 cursor-not-allowed pointer-events-none;
    /* Remove any hover effects when disabled */
    &:hover {
      @apply bg-transparent;
    }
  }
</style>
