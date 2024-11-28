# Project Documentation
Last updated: 2024-11-28

This documentation provides comprehensive guidelines for development practices, patterns, and standards used in this project.


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
- Type definitions: Co-locate with components when specific, use `types/` for shared
- Testing: Component tests in `__tests__` directories alongside components

## Svelte 5 Patterns

### Component Creation Guidelines
- Use `$state()` for reactive state management
- Use `$props()` for component properties
- Use `onclick` instead of `on:click` for event handling
- Implement modern Svelte 5 reactive patterns
- Avoid Svelte 4 syntax completely

### State Management Patterns
```svelte
<script lang="ts">
  // Basic state
  const count = $state(0);
  
  // Complex state
  const form = $state({
    username: "",
    email: "",
    preferences: {
      theme: "dark",
      notifications: true
    }
  });
  
  // Derived values (replaces $: syntax)
  const isValid = form.email.includes("@");
  const fullName = `${form.firstName} ${form.lastName}`;
  
  // State updates
  function updateTheme(theme: string) {
    form.preferences.theme = theme;  // Direct mutation is fine
  }
</script>
```

### Props and Events
```svelte
<script lang="ts">
  // Props with TypeScript
  const { 
    title = "Default",
    onSave = () => {},
    items = []
  } = $props<{
    title?: string;
    onSave?: (data: unknown) => void;
    items?: string[];
  }>();

  // Event handling
  function handleClick(event: MouseEvent) {
    onSave(form);
  }
</script>

<button onclick={handleClick}>Save</button>
```

### Advanced Patterns
```svelte
<script lang="ts">
  // Reactive Collections
  const todos = $state<Todo[]>([]);
  
  // Methods that modify state
  function addTodo(text: string) {
    todos = [...todos, { id: Date.now(), text, done: false }];
  }
  
  // Computed values with functions
  function getCompletedCount() {
    return todos.filter(todo => todo.done).length;
  }
  
  // Event delegation
  function handleTodoClick(id: number) {
    todos = todos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    );
  }
</script>

<div class="todos">
  {#each todos as todo}
    <div onclick={() => handleTodoClick(todo.id)}>
      {todo.text} - {todo.done ? "✓" : ""}
    </div>
  {/each}
  
  <div>Completed: {getCompletedCount()}</div>
</div>
```

### Key Differences from Svelte 4
- No more `export let` for props
- No more `$:` for reactivity
- Event handlers use `onclick` syntax
- State management with `$state()`
- Props management with `$props()`
- TypeScript integration is more straightforward
- Direct mutation of state is allowed
- Computed values are just functions or expressions

### Best Practices
- Keep state close to where it's used
- Use TypeScript for better type safety
- Prefer function calls over computed properties for complex calculations
- Use event delegation for lists
- Maintain immutable patterns for arrays and objects
- Co-locate related state and functions

## Electron Patterns

### IPC Communication
```typescript
// In main process (src/electron/ipc/handlers.ts)
ipcMain.handle('data:save', async (event, data) => {
  try {
    await saveData(data);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// In renderer (Svelte component)
const result = await window.electron.invoke('data:save', formData);
```

### Window Management
```typescript
// Creating windows (src/electron/utils/windowManager.ts)
export function createWindow(options: WindowOptions) {
  const window = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    ...options
  });
  
  // Load the app
  window.loadURL(getAppUrl());
  return window;
}
```

### Security Best Practices
- Always use `contextIsolation: true`
- Validate all IPC inputs
- Use typed IPC channels
- Sanitize file paths
- Implement proper error handling
- Use secure window options

### File System Access
```typescript
// Safe file system operations
import { safeJoin } from '../utils/pathData';

export async function saveUserData(userId: string, data: unknown) {
  const userDir = safeJoin(app.getPath('userData'), 'users', userId);
  await ensureDir(userDir);
  await writeJson(safeJoin(userDir, 'data.json'), data);
}
```

### State Persistence
```typescript
// Store configuration
export class ConfigStore {
  private store: Store;
  
  constructor() {
    this.store = new Store({
      defaults: {
        theme: 'system',
        windowBounds: { width: 1200, height: 800 }
      }
    });
  }
  
  get<T>(key: string): T {
    return this.store.get(key);
  }
  
  set<T>(key: string, value: T): void {
    this.store.set(key, value);
  }
}
```

## Testing Patterns

### Component Testing
```typescript
// src/lib/components/common/__tests__/Button.test.ts
import { render, fireEvent } from '@testing-library/svelte';
import Button from '../Button.svelte';

describe('Button', () => {
  it('renders with default props', () => {
    const { getByRole } = render(Button, { props: { label: 'Click me' } });
    expect(getByRole('button')).toHaveTextContent('Click me');
  });

  it('handles click events', async () => {
    const onClick = vi.fn();
    const { getByRole } = render(Button, {
      props: { label: 'Click me', onclick: onClick }
    });
    
    await fireEvent.click(getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

### Integration Testing
```typescript
// src/routes/__tests__/editor.test.ts
import { render, fireEvent } from '@testing-library/svelte';
import { vi } from 'vitest';
import Editor from '../editor/+page.svelte';

vi.mock('$lib/services/fileSystem', () => ({
  saveFile: vi.fn(),
  loadFile: vi.fn()
}));

describe('Editor Page', () => {
  it('loads and saves files', async () => {
    const { getByText, getByRole } = render(Editor);
    
    // Test file loading
    await fireEvent.click(getByText('Open File'));
    expect(loadFile).toHaveBeenCalled();
    
    // Test file saving
    await fireEvent.click(getByText('Save'));
    expect(saveFile).toHaveBeenCalled();
  });
});
```

### Electron Testing
```typescript
// electron/__tests__/ipc.test.ts
import { createWindow } from '../windowManager';
import { ipcMain } from 'electron';

describe('IPC Handlers', () => {
  let window;
  
  beforeEach(() => {
    window = createWindow();
  });
  
  afterEach(() => {
    window.close();
  });
  
  it('handles file save requests', async () => {
    const result = await ipcMain.emit('file:save', {
      path: '/test/file.txt',
      content: 'Hello, World!'
    });
    
    expect(result.success).toBe(true);
  });
});
```

### Testing Best Practices
- Write tests alongside components
- Use Testing Library's queries
- Test user interactions
- Mock external dependencies
- Test error states
- Use snapshot testing sparingly
- Focus on behavior, not implementation
- Use proper cleanup in tests

### Test Organization
- Unit tests in `__tests__` directories
- Integration tests in route directories
- E2E tests in `tests/e2e`
- Shared test utilities in `tests/utils`
- Test data in `tests/fixtures`

## Deployment Patterns

### Build Configuration
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    target: 'chrome110',
    outDir: 'dist',
    rollupOptions: {
      external: ['electron']
    }
  }
});
```

### Release Process
- Use electron-builder for packaging
- Implement auto-updates using electron-updater
- Sign applications for distribution
- Use GitHub Actions for CI/CD

### Distribution
```typescript
// electron-builder.config.js
module.exports = {
  appId: 'com.example.app',
  productName: 'App Name',
  directories: {
    output: 'release'
  },
  publish: {
    provider: 'github',
    releaseType: 'release'
  },
  mac: {
    category: 'public.app-category.developer-tools',
    target: ['dmg', 'zip']
  },
  win: {
    target: ['nsis', 'portable']
  },
  linux: {
    target: ['AppImage', 'deb']
  }
};
```

### Security Checklist
- Code signing certificates configured
- CSP headers implemented
- Dependencies audited
- Permissions properly scoped
- Update mechanism secured

### Environment Configuration
```typescript
// src/electron/config/env.ts
export const getEnvironmentConfig = () => ({
  isDevelopment: process.env.NODE_ENV === 'development',
  updateServer: process.env.UPDATE_SERVER_URL,
  apiEndpoint: process.env.API_ENDPOINT,
  logLevel: process.env.LOG_LEVEL || 'info'
});
```

### Deployment Best Practices
- Use semantic versioning
- Maintain changelog
- Implement staged rollouts
- Monitor error reporting
- Provide offline fallbacks
- Test auto-update flows

## Performance Patterns

### Optimization Guidelines
- Use dynamic imports for large components
- Implement proper memory management
- Optimize IPC communication
- Use efficient state management
- Implement proper garbage collection

### Memory Management
```typescript
// src/electron/utils/memoryManager.ts
export class MemoryManager {
  private static readonly MEMORY_THRESHOLD = 0.8; // 80% of available RAM
  
  static monitorMemory() {
    const used = process.memoryUsage();
    if (used.heapUsed / used.heapTotal > this.MEMORY_THRESHOLD) {
      this.cleanupResources();
    }
  }
  
  static cleanupResources() {
    // Clear caches
    global.gc?.();
    // Close unused windows
    // Clear temporary files
  }
}
```

### IPC Optimization
```typescript
// Batch operations
export async function batchDataTransfer(items: unknown[]) {
  const BATCH_SIZE = 1000;
  const batches = [];
  
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    batches.push(items.slice(i, i + BATCH_SIZE));
  }
  
  for (const batch of batches) {
    await window.electron.invoke('data:process', batch);
  }
}
```

### Resource Loading
```typescript
// Lazy load components
const HeavyComponent = lazy(() => import('./HeavyComponent.svelte'));

// Preload critical resources
export function preloadResources() {
  const criticalAssets = ['/icons/main.png', '/data/initial.json'];
  return Promise.all(
    criticalAssets.map(asset => fetch(asset).then(res => res.blob()))
  );
}
```

### Performance Monitoring
```typescript
// src/electron/utils/performance.ts
export class PerformanceMonitor {
  static startTracking(operation: string) {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.logMetric(operation, duration);
    };
  }
  
  static logMetric(operation: string, duration: number) {
    console.log(`Operation: ${operation}, Duration: ${duration}ms`);
    // Send to monitoring service
  }
}
```

### Best Practices
- Profile regularly with Chrome DevTools
- Monitor memory usage
- Use performance marks and measures
- Implement proper error boundaries
- Cache expensive computations
- Use web workers for heavy tasks
- Optimize asset loading
- Implement proper cleanup


## Contributing
- Follow the patterns and conventions outlined in this document
- Submit PRs with appropriate tests and documentation
- Keep this documentation up to date

## Questions and Support
For questions or support, please refer to:
- GitHub Issues
- Team chat channels
- Project wiki

---
Generated automatically using project documentation tools.
