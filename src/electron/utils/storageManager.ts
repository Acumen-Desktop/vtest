import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

export interface StoredWindowConfig {
    id: string;
    bounds?: Electron.Rectangle;
    isVisible?: boolean;
    displayId?: string;
    userOptions?: Partial<Electron.BrowserWindowConstructorOptions>;
    panels?: {
        devTools: boolean;
        settings: boolean;
        inspector: boolean;
        [key: string]: boolean;  // Allow for future panel additions
    };
    panes?: {
        [paneId: string]: {
            bounds: Electron.Rectangle;
        };
    };
}

export interface StoredDisplayConfig {
    id: string;          // Friendly ID (display1, display2, etc.)
    systemId: string;    // Original system-provided display ID
    label: string;
    workArea: Electron.Rectangle;
    positionLabel: string;  // e.g., 'Left', 'Center', 'Right', etc.
}

interface StorageData {
    windows: StoredWindowConfig[];
    displays: StoredDisplayConfig[];
    lastUpdate: string;
}

export class StorageManager {
    private static instance: StorageManager;
    private storagePath: string;

    private constructor() {
        // Store in userData directory which is platform-specific:
        // - macOS: ~/Library/Application Support/[app name]
        // - Windows: %APPDATA%/[app name]
        // - Linux: ~/.config/[app name]
        this.storagePath = path.join(app.getPath('userData'), 'window-config.json');
        // console.log('Line 35 - storageManager.ts - Storage path:', this.storagePath);
    }

    public static getInstance(): StorageManager {
        if (!StorageManager.instance) {
            StorageManager.instance = new StorageManager();
        }
        return StorageManager.instance;
    }

    private getDefaultData(): StorageData {
        return {
            windows: [],
            displays: [],
            lastUpdate: new Date().toISOString(),
        };
    }

    public loadData(): StorageData {
        try {
            if (fs.existsSync(this.storagePath)) {
                const data = fs.readFileSync(this.storagePath, 'utf8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.error('Error loading window config:', error);
        }
        return this.getDefaultData();
    }

    public saveData(data: StorageData): void {
        try {
            data.lastUpdate = new Date().toISOString();
            fs.writeFileSync(this.storagePath, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Error saving window config:', error);
        }
    }

    public saveWindowConfig(config: StoredWindowConfig): void {
        const data = this.loadData();
        const index = data.windows.findIndex(w => w.id === config.id);

        if (index !== -1) {
            data.windows[index] = config;
        } else {
            data.windows.push(config);
        }

        this.saveData(data);
    }

    public saveDisplayConfig(displays: StoredDisplayConfig[]): void {
        const data = this.loadData();
        data.displays = displays;
        this.saveData(data);
    }

    public getWindowConfig(id: string): StoredWindowConfig | undefined {
        const data = this.loadData();
        return data.windows.find(w => w.id === id);
    }

    public getAllDisplays(): StoredDisplayConfig[] {
        const data = this.loadData();
        return data.displays;
    }

    public savePaneLayout(windowId: string, paneId: string, bounds: Electron.Rectangle) {
        const data = this.loadData();
        const windowConfig = data.windows.find(w => w.id === windowId);
        
        if (!windowConfig) {
            console.error(`Window ${windowId} not found`);
            return;
        }

        if (!windowConfig.panes) {
            windowConfig.panes = {};
        }

        windowConfig.panes[paneId] = { bounds };
        this.saveData(data);
    }

    public getPaneLayout(windowId: string, paneId: string) {
        const data = this.loadData();
        const windowConfig = data.windows.find(w => w.id === windowId);
        return windowConfig?.panes?.[paneId];
    }

    public getWindowPaneLayouts(windowId: string) {
        const data = this.loadData();
        const windowConfig = data.windows.find(w => w.id === windowId);
        return windowConfig?.panes || {};
    }
}
