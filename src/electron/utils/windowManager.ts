import { BrowserWindow, Rectangle } from 'electron';
import { sendFromMain } from '../ipc/handlers';

export type WindowConfig = {
    id: string;
    bounds?: Partial<Rectangle>;
    isVisible?: boolean;
    options?: Electron.BrowserWindowConstructorOptions;
};

export class WindowManager {
    private static instance: WindowManager;
    private windows: Map<string, BrowserWindow>;
    private windowConfigs: Map<string, WindowConfig>;

    private constructor() {
        this.windows = new Map();
        this.windowConfigs = new Map();
    }

    public static getInstance(): WindowManager {
        if (!WindowManager.instance) {
            WindowManager.instance = new WindowManager();
        }
        return WindowManager.instance;
    }

    public createWindow(config: WindowConfig): BrowserWindow {
        const existingWindow = this.windows.get(config.id);
        if (existingWindow) {
            console.warn(`Window with id ${config.id} already exists. Returning existing window.`);
            return existingWindow;
        }

        const window = new BrowserWindow({
            ...config.options,
            ...config.bounds,
        });

        this.windows.set(config.id, window);
        this.windowConfigs.set(config.id, config);

        // Setup window event handlers
        window.on('closed', () => {
            this.windows.delete(config.id);
            this.windowConfigs.delete(config.id);
        });

        window.on('move', () => {
            const bounds = window.getBounds();
            this.updateWindowConfig(config.id, { bounds });
        });

        window.on('resize', () => {
            const bounds = window.getBounds();
            this.updateWindowConfig(config.id, { bounds });
        });

        return window;
    }

    public getWindow(id: string): BrowserWindow | undefined {
        return this.windows.get(id);
    }

    public getAllWindows(): BrowserWindow[] {
        return Array.from(this.windows.values());
    }

    public getWindowIds(): string[] {
        return Array.from(this.windows.keys());
    }

    public updateWindowConfig(id: string, config: Partial<WindowConfig>): void {
        const existingConfig = this.windowConfigs.get(id);
        if (existingConfig) {
            this.windowConfigs.set(id, { ...existingConfig, ...config });
        }
    }

    public async broadcastToAll(channel: string, payload: any): Promise<void> {
        for (const window of this.windows.values()) {
            if (!window.isDestroyed()) {
                sendFromMain(window, channel, payload);
            }
        }
    }

    public async sendToWindow(windowId: string, channel: string, payload: any): Promise<void> {
        const window = this.windows.get(windowId);
        if (window && !window.isDestroyed()) {
            sendFromMain(window, channel, payload);
        }
    }

    public setWindowVisibility(id: string, isVisible: boolean): void {
        const window = this.windows.get(id);
        if (window && !window.isDestroyed()) {
            if (isVisible) {
                window.show();
            } else {
                window.hide();
            }
            this.updateWindowConfig(id, { isVisible });
        }
    }

    public saveWindowState(id: string): void {
        const window = this.windows.get(id);
        if (window && !window.isDestroyed()) {
            const bounds = window.getBounds();
            const isVisible = window.isVisible();
            this.updateWindowConfig(id, { bounds, isVisible });
        }
    }

    public restoreWindowState(id: string): void {
        const window = this.windows.get(id);
        const config = this.windowConfigs.get(id);
        if (window && !window.isDestroyed() && config) {
            if (config.bounds) {
                window.setBounds(config.bounds as Rectangle);
            }
            if (config.isVisible !== undefined) {
                this.setWindowVisibility(id, config.isVisible);
            }
        }
    }

    public closeWindow(id: string): void {
        const window = this.windows.get(id);
        if (window && !window.isDestroyed()) {
            window.close();
        }
    }

    public closeAllWindows(): void {
        for (const window of this.windows.values()) {
            if (!window.isDestroyed()) {
                window.close();
            }
        }
    }
}
