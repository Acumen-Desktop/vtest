# VTest Project Instructions and Standards

## Project Overview
VTest is an Electron application built with SvelteKit and TypeScript. The project serves as a testing/demo environment for codec-xyz functionality.

## Project Structure
```
vtest/
├── src/
│   ├── routes/                 # SvelteKit routes
│   │   └── +page.svelte       # Main page component
│   ├── electron/              # Electron-specific code
│   │   ├── main.ts           # Main process
│   │   ├── preload.ts        # Preload script
│   │   └── ipc/             # IPC-related code
│   │       └── handlers.ts   # IPC message handlers
│   └── lib/                  # Shared libraries and components
└── static/                   # Static assets
```

## Coding Standards

### Console Logging
All console.log statements should follow this format:
```typescript
console.log("Line XX - filename - message:", data);
```
Example:
```typescript
console.log("Line 17 - +page.svelte - Window visibility update:", data);
```

### IPC Communication
- All IPC channels must be whitelisted in preload.ts
- Main process handlers are centralized in handlers.ts
- Use WindowManager for window-related operations
- Always include error handling for IPC communications

Current valid IPC channels:
- 'toMain' (renderer → main)
- 'fromMain' (main → renderer)
- 'windowVisibility' (main → renderer)
- 'test-console-log' (main → renderer)
- 'toggleDevToolsResponse' (main → renderer)

### Window Management
- Use WindowManager singleton for all window operations
- Window IDs must be unique and descriptive (e.g., 'settings', 'main')
- Always check window existence before operations
- Broadcast visibility changes to all windows

### TypeScript
- Use strict type checking
- Define interfaces for all IPC message payloads
- Avoid 'any' type where possible
- Use type inference when types are obvious

### State Management
- Use Svelte stores for shared state
- Keep IPC state synchronized between main and renderer
- Document all state dependencies
- Use reactive statements for derived state

## UI Components and Design
All UI components should follow the shadcn-svelte component library standards. The complete documentation for shadcn-svelte components can be found at:
`.notes/shadcn-svelte-docs.md`

Key points for UI development:
- Use shadcn-svelte components whenever possible
- Follow the component usage examples from the documentation
- Maintain consistent styling using Tailwind CSS
- Ensure accessibility compliance
- Support both light and dark themes

## Icons
The project uses VS Code Codicons for icons. You can browse the complete list of available icons at:
https://microsoft.github.io/vscode-codicons/dist/codicon.html

Also lucide-svelte has a great collection of icons for Svelte:
https://lucide.dev/icons/

### Adding New Icons
1. Find the icon you want to use in the Codicons gallery
2. Copy the icon name (without the 'codicon-' prefix)
3. Run the copy script:
```bash
npm run copy-icon <icon-name>
```
Example:
```bash
npm run copy-icon bug    # Copies the bug icon
npm run copy-icon folder # Copies the folder icon
```

### Using Icons in Components
Once copied, use the Icon component to display the icon:
```svelte
<Icon name="bug" />
```

## Documentation
- [Pane Components Documentation](.notes/paneForge.md) - Reference for Svelte Pane components (PaneGroup, Pane, PaneResizer)

## Development Workflow

### Running the Application
1. Start in development mode:
```bash
npm run dev
```
2. Build for production:
```bash
npm run build
```

### Debugging
- Use Chrome DevTools for renderer process (Cmd+Option+I)
- Enable logging in both main and renderer processes
- Check console for formatted log messages
- Monitor IPC communication through console logs

### Adding New Features
1. Update IPC channels in preload.ts if needed
2. Implement handlers in handlers.ts
3. Add UI components in Svelte
4. Update window management if required
5. Add appropriate logging
6. Test in both development and production modes

## Common Issues and Solutions
1. Button/UI not responding:
   - Check IPC channel whitelist in preload.ts
   - Verify event listeners are properly set up
   - Check console for errors

2. Windows not showing/hiding properly:
   - Verify WindowManager state
   - Check IPC communication flow
   - Ensure proper visibility broadcasting

3. State synchronization issues:
   - Review IPC message flow
   - Check state update handlers
   - Verify reactive statements

## Future Considerations
- Document new patterns as they emerge
- Update IPC channel list when modified
- Keep logging standards consistent
- Maintain window management patterns
