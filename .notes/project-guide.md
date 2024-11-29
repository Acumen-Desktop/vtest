# Project Structure

## Project Metadata

- **Framework**: SvelteKit + Electron
- **Package Manager**: npm
- **TypeScript**: Strict mode enabled
- **UI Framework**: Tailwind CSS + shadcn-svelte
- **Key Dependencies**:
  - Electron v33
  - Svelte v5
  - Vite v6
  - TypeScript v5.7+

## Conventions

- File naming: kebab-case (e.g., `file-name.ts`)
- Component naming: PascalCase (e.g., `MyComponent.svelte`)
- Route files: SvelteKit conventions (`+page.svelte`, `+layout.svelte`)
- Imports: Use aliases (`$lib`, `$root`, `$panes`)
- Styles: Tailwind classes with shadcn-svelte components



### Console Logging
All console.log statements should follow this format:
```typescript
console.log("Line XX - filename - message:", data);
```

Example:
```typescript
console.log("Line 17 - +page.svelte - Window visibility update:", data);
```



### Console Logging
All console.log statements should follow this format:
```typescript
console.log("Line XX - filename - message:", data);
```

Example:
```typescript
console.log("Line 17 - +page.svelte - Window visibility update:", data);
```

## Svelte 5 Patterns

### Component Creation Guidelines

- Use `$state()` for reactive state management
- Use `$props()` for component properties
- Use `onclick` instead of `on:click` for event handling
- Implement modern Svelte 5 reactive patterns
- Avoid Svelte 4 syntax completely

### Example Component Structure

```svelte
<script lang="ts">
  // Props using $props()
  const { title = "Default" } = $props<{ title?: string }>();

  // State using $state()
  const count = $state(0);
  const items = $state<string[]>([]);

  // Derived state
  const doubled = count * 2;

  // Event handlers (use 'onclick', not 'on:click')
  function handleClick() {
    count++;
    items = [...items, `Item ${count}`];
  }
</script>

<div class="container">
  <h1>{title}</h1>
  <button onclick={handleClick}>
    Count: {count}
  </button>
  <p>Doubled: {doubled}</p>

  {#each items as item}
    <div>{item}</div>
  {/each}
</div>
```

### Key Differences from Svelte 4

- No more `export let` for props
- No more `$:` for reactivity
- Event handlers use `onclick` syntax
- State management with `$state()`
- Props management with `$props()`
- TypeScript integration is more straightforward

## Directory Tree

```
src//
├─ electron/
│   ├─ ipc/
│   │   ├─ handlers.ts
│   │   └─ paneLayoutHandler.ts
│   ├─ utils/
│   │   ├─ displayData.ts
│   │   ├─ initConfig.ts
│   │   ├─ pathData.ts
│   │   ├─ storageManager.ts
│   │   └─ windowManager.ts
│   ├─ ipcMain-Mac.ts
│   ├─ ipcMain-Win.ts
│   ├─ ipcMain.ts
│   ├─ main.ts
│   ├─ menu.ts
│   ├─ preload.ts
│   └─ preloadOLD.ts
├─ hooks/
│   └─ is-mobile.svelte.ts
├─ lib/
│   ├─ assets/
│   │   ├─ icons-svg/
│   │   │   ├─ bug.svg
│   │   │   ├─ debug-alt.svg
│   │   │   ├─ debug.svg
│   │   │   ├─ extensions.svg
│   │   │   ├─ grip.svg
│   │   │   ├─ layout-panel.svg
│   │   │   ├─ layout-sidebar-right.svg
│   │   │   ├─ layout-statusbar.svg
│   │   │   ├─ menu.svg
│   │   │   ├─ search.svg
│   │   │   └─ source-control.svg
│   │   └─ svg/
│   │       ├─ electron.svg
│   │       ├─ svelteKit.svg
│   │       ├─ tailwindcss.svg
│   │       ├─ typescript.svg
│   │       └─ vite.svg
│   ├─ components/
│   │   ├─ buttons/
│   │   │   └─ Devtools.svelte
│   │   ├─ common/
│   │   │   ├─ Counter.svelte
│   │   │   ├─ Icon.svelte
│   │   │   ├─ Modal.svelte
│   │   │   └─ Tooltip.svelte
│   │   ├─ layout/
│   │   │   ├─ panes/
│   │   │   │   ├─ markdownEditor/
│   │   │   │   │   ├─ MarkdownEditor.svelte
│   │   │   │   │   └─ MarkdownToolbar.svelte
│   │   │   │   ├─ CodeEditor.svelte
│   │   │   │   ├─ FileExplorer.svelte
│   │   │   │   ├─ FileNode.svelte
│   │   │   │   ├─ PaneContent.svelte
│   │   │   │   ├─ Terminal.svelte
│   │   │   │   └─ Welcome.svelte
│   │   │   ├─ Sidebar.svelte
│   │   │   ├─ TitleBar.svelte
│   │   │   ├─ app-sidebar.svelte
│   │   │   ├─ nav-user.svelte
│   │   │   └─ sidebar-page.svelte
│   │   └─ ui/
│   │       ├─ alert/
│   │       │   ├─ alert-description.svelte
│   │       │   ├─ alert-title.svelte
│   │       │   ├─ alert.svelte
│   │       │   └─ index.ts
│   │       ├─ avatar/
│   │       │   ├─ avatar-fallback.svelte
│   │       │   ├─ avatar-image.svelte
│   │       │   ├─ avatar.svelte
│   │       │   └─ index.ts
│   │       ├─ breadcrumb/
│   │       │   ├─ breadcrumb-ellipsis.svelte
│   │       │   ├─ breadcrumb-item.svelte
│   │       │   ├─ breadcrumb-link.svelte
│   │       │   ├─ breadcrumb-list.svelte
│   │       │   ├─ breadcrumb-page.svelte
│   │       │   ├─ breadcrumb-separator.svelte
│   │       │   ├─ breadcrumb.svelte
│   │       │   └─ index.ts
│   │       ├─ button/
│   │       │   ├─ button.svelte
│   │       │   └─ index.ts
│   │       ├─ card/
│   │       │   ├─ card-content.svelte
│   │       │   ├─ card-description.svelte
│   │       │   ├─ card-footer.svelte
│   │       │   ├─ card-header.svelte
│   │       │   ├─ card-title.svelte
│   │       │   ├─ card.svelte
│   │       │   └─ index.ts
│   │       ├─ dialog/
│   │       │   ├─ dialog-content.svelte
│   │       │   ├─ dialog-description.svelte
│   │       │   ├─ dialog-footer.svelte
│   │       │   ├─ dialog-header.svelte
│   │       │   ├─ dialog-overlay.svelte
│   │       │   ├─ dialog-title.svelte
│   │       │   └─ index.ts
│   │       ├─ dropdown-menu/
│   │       │   ├─ dropdown-menu-checkbox-item.svelte
│   │       │   ├─ dropdown-menu-content.svelte
│   │       │   ├─ dropdown-menu-group-heading.svelte
│   │       │   ├─ dropdown-menu-item.svelte
│   │       │   ├─ dropdown-menu-label.svelte
│   │       │   ├─ dropdown-menu-radio-item.svelte
│   │       │   ├─ dropdown-menu-separator.svelte
│   │       │   ├─ dropdown-menu-shortcut.svelte
│   │       │   ├─ dropdown-menu-sub-content.svelte
│   │       │   ├─ dropdown-menu-sub-trigger.svelte
│   │       │   └─ index.ts
│   │       ├─ input/
│   │       │   ├─ index.ts
│   │       │   └─ input.svelte
│   │       ├─ label/
│   │       │   ├─ index.ts
│   │       │   └─ label.svelte
│   │       ├─ resizable/
│   │       │   ├─ index.ts
│   │       │   ├─ resizable-handle.svelte
│   │       │   └─ resizable-pane-group.svelte
│   │       ├─ separator/
│   │       │   ├─ index.ts
│   │       │   └─ separator.svelte
│   │       ├─ sheet/
│   │       │   ├─ index.ts
│   │       │   ├─ sheet-content.svelte
│   │       │   ├─ sheet-description.svelte
│   │       │   ├─ sheet-footer.svelte
│   │       │   ├─ sheet-header.svelte
│   │       │   ├─ sheet-overlay.svelte
│   │       │   └─ sheet-title.svelte
│   │       ├─ sidebar/
│   │       │   ├─ constants.ts
│   │       │   ├─ context.svelte.ts
│   │       │   ├─ index.ts
│   │       │   ├─ sidebar-content.svelte
│   │       │   ├─ sidebar-footer.svelte
│   │       │   ├─ sidebar-group-action.svelte
│   │       │   ├─ sidebar-group-content.svelte
│   │       │   ├─ sidebar-group-label.svelte
│   │       │   ├─ sidebar-group.svelte
│   │       │   ├─ sidebar-header.svelte
│   │       │   ├─ sidebar-input.svelte
│   │       │   ├─ sidebar-inset.svelte
│   │       │   ├─ sidebar-menu-action.svelte
│   │       │   ├─ sidebar-menu-badge.svelte
│   │       │   ├─ sidebar-menu-button.svelte
│   │       │   ├─ sidebar-menu-item.svelte
│   │       │   ├─ sidebar-menu-skeleton.svelte
│   │       │   ├─ sidebar-menu-sub-button.svelte
│   │       │   ├─ sidebar-menu-sub-item.svelte
│   │       │   ├─ sidebar-menu-sub.svelte
│   │       │   ├─ sidebar-menu.svelte
│   │       │   ├─ sidebar-provider.svelte
│   │       │   ├─ sidebar-rail.svelte
│   │       │   ├─ sidebar-separator.svelte
│   │       │   ├─ sidebar-trigger.svelte
│   │       │   └─ sidebar.svelte
│   │       ├─ skeleton/
│   │       │   ├─ index.ts
│   │       │   └─ skeleton.svelte
│   │       ├─ switch/
│   │       │   ├─ index.ts
│   │       │   └─ switch.svelte
│   │       ├─ toggle/
│   │       │   ├─ index.ts
│   │       │   └─ toggle.svelte
│   │       ├─ toggle-group/
│   │       │   ├─ index.ts
│   │       │   ├─ toggle-group-item.svelte
│   │       │   └─ toggle-group.svelte
│   │       └─ tooltip/
│   │           ├─ index.ts
│   │           └─ tooltip-content.svelte
│   ├─ config/
│   │   ├─ api.config.ts
│   │   └─ paneConfig.ts
│   ├─ constants/
│   ├─ services/
│   ├─ stores/
│   │   └─ paneStore.ts
│   ├─ types/
│   │   ├─ app.d.ts
│   │   ├─ electron.d.ts
│   │   ├─ fileExplorer.ts
│   │   ├─ global.d.ts
│   │   └─ pane.ts
│   └─ utils/
│       ├─ copy-icons.ts
│       ├─ initializeLayout.ts
│       ├─ paneLayoutManager.ts
│       └─ utils.ts
├─ routes/
│   ├─ editor/
│   │   ├─ components/
│   │   └─ +page.svelte
│   ├─ five-up/
│   │   ├─ components/
│   │   ├─ +layout.svelte
│   │   └─ +page.svelte
│   ├─ settings/
│   │   ├─ components/
│   │   └─ +page.svelte
│   ├─ test/
│   │   ├─ components/
│   │   ├─ +page.svelte
│   │   └─ layout-mail-09.svelte
│   ├─ +layout.svelte
│   ├─ +layout.ts
│   └─ +page.svelte
├─ styles/
│   ├─ app.css
│   └─ codicons.css
├─ 200.html
├─ app.html
└─ tsconfig.json
50 directories, 171 files
```

## Directory Purposes

### Routes (`/routes`)

File-based routing structure for the application:

- `five-up/`: Five-pane layout implementation
- `editor/`: Code editor interface
- `settings/`: Application configuration interface
- `test/`: Testing environment

### Library (`/lib`)

Shared codebase organized by functionality:

#### Components (`/lib/components`)

- `layout/panes/`: Core pane components for the editor interface
- `ui/`: shadcn-svelte component library
- `buttons/`: Custom button implementations
- `common/`: Shared generic components

#### Core Functionality

- `stores/`: Global state management
- `utils/`: Utility functions and helpers
- `services/`: API and service implementations
- `constants/`: Application-wide constants
- `config/`: Configuration management
- `types/`: TypeScript definitions
- `assets/`: Static resources

### Application Core

- `styles/`: Global styling
- `hooks/`: Svelte hooks and middleware
- `electron/`: Electron-specific implementations
- `app.html`: Root HTML template
- `tsconfig.json`: TypeScript configuration

## Recent Changes

- Reorganized pane components under layout/
- Added services/ and constants/ directories
- Implemented five-up layout structure
- Added electron-specific directory
- Separated UI components by function

## Development Notes

- All new components should follow shadcn-svelte patterns
- Electron-specific code goes in `src/electron/`
- Shared utilities should be placed in `src/lib/utils/`
- New routes should include appropriate layouts
- Component-specific types should be co-located with components
- Global types go in `src/lib/types/`
