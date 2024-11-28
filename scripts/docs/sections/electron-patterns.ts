export function getElectronPatternsContent(): string {
  return `## Electron Patterns

### IPC Communication
\`\`\`typescript
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
\`\`\`

### Window Management
\`\`\`typescript
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
\`\`\`

### Security Best Practices
- Always use \`contextIsolation: true\`
- Validate all IPC inputs
- Use typed IPC channels
- Sanitize file paths
- Implement proper error handling
- Use secure window options

### File System Access
\`\`\`typescript
// Safe file system operations
import { safeJoin } from '../utils/pathData';

export async function saveUserData(userId: string, data: unknown) {
  const userDir = safeJoin(app.getPath('userData'), 'users', userId);
  await ensureDir(userDir);
  await writeJson(safeJoin(userDir, 'data.json'), data);
}
\`\`\`

### State Persistence
\`\`\`typescript
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
\`\`\``;
}
