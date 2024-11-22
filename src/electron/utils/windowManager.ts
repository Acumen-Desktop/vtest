/**
 * WindowManager is a singleton class that manages all Electron BrowserWindow instances in the application.
 * It provides functionality for creating, tracking, and controlling windows, as well as managing their state
 * and handling inter-process communication (IPC).
 */

import { BrowserWindow, screen } from 'electron';
import type { Rectangle } from 'electron';
import { sendFromMain } from '../ipc/handlers';
import { StorageManager, type StoredWindowConfig } from './storageManager';

/**
 * Configuration options for creating and managing windows
 * @property {string} id - Unique identifier for the window
 * @property {Partial<Rectangle>} bounds - Window position and size
 * @property {boolean} isVisible - Window visibility state
 * @property {Electron.BrowserWindowConstructorOptions} options - Default window options
 * @property {Partial<Electron.BrowserWindowConstructorOptions>} userOptions - User-defined window creation options
 */
export type WindowConfig = StoredWindowConfig & {
    options: Electron.BrowserWindowConstructorOptions;  // Default window options
    userOptions?: Partial<Electron.BrowserWindowConstructorOptions>;  // User-defined overrides
};

export class WindowManager {
    private static instance: WindowManager;
    /** Map of window IDs to BrowserWindow instances */
    private windows: Map<string, BrowserWindow>;
    /** Map of window IDs to their configurations */
    private windowConfigs: Map<string, StoredWindowConfig>;
    private storageManager: StorageManager;

    /** Private constructor ensures singleton pattern */
    private constructor() {
        this.windows = new Map();
        this.windowConfigs = new Map();
        this.storageManager = StorageManager.getInstance();

        // Load saved window configurations
        const data = this.storageManager.loadData();
        data.windows.forEach(config => {
            this.windowConfigs.set(config.id, config);
        });
    }

    /**
     * Gets the singleton instance of WindowManager
     * Implements the singleton pattern to ensure only one instance exists
     */
    public static getInstance(): WindowManager {
        if (!WindowManager.instance) {
            WindowManager.instance = new WindowManager();
            // console.log('Created new WindowManager instance');
        }
        return WindowManager.instance;
    }

    /**
     * Creates a new BrowserWindow with the specified configuration
     * If a window with the same ID already exists, returns the existing window
     * Sets up event handlers for window state changes (move, resize, close)
     */
    public createWindow(config: WindowConfig): BrowserWindow {
        console.log('Line 57 - windowManager.ts - Creating window with config:', config);
        const existingWindow = this.windows.get(config.id);
        if (existingWindow) {
            return existingWindow;
        }

        // Load saved config if it exists
        const savedConfig = this.windowConfigs.get(config.id);
        if (savedConfig) {
            // Merge saved config, but keep original options as base
            config = {
                ...config,
                ...savedConfig,
                userOptions: { ...savedConfig.userOptions }  // Only preserve user options from saved config
            };
        }

        // Create window with default options first, then override with user options
        const window = new BrowserWindow({
            ...config.options,  // Default options
            ...config.userOptions,  // User-defined options override defaults
            ...config.bounds,  // Position and size
        });

        this.windows.set(config.id, window);
        
        // Only save user-defined options and bounds
        const configToSave: StoredWindowConfig = {
            id: config.id,
            bounds: config.bounds,
            isVisible: config.isVisible,
            displayId: config.displayId,
            userOptions: config.userOptions
        };
        this.windowConfigs.set(config.id, configToSave);
        this.storageManager.saveWindowConfig(configToSave);

        // Setup window event handlers
        window.on('closed', () => {
            // console.log(`Window ${config.id} closed`);
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

    /** Retrieves a window instance by its ID */
    public getWindow(id: string): BrowserWindow | undefined {
        const window = this.windows.get(id);
        // console.log(`Getting window ${id}:`, window ? 'found' : 'not found');
        return window;
    }

    /** Returns an array of all active BrowserWindow instances */
    public getAllWindows(): BrowserWindow[] {
        return Array.from(this.windows.values());
    }

    /** Returns detailed information about all windows, including their IDs */
    public getAllWindowsInfo(): { id: string; window: BrowserWindow }[] {
        // console.log('Getting all windows info. Current windows:', Array.from(this.windows.keys()));
        return Array.from(this.windows.entries()).map(([id, window]) => ({
            id,
            window
        }));
    }

    /** Returns an array of all window IDs */
    public getWindowIds(): string[] {
        return Array.from(this.windows.keys());
    }

    /**
     * Updates the stored configuration for a window
     * Used to track window state changes like position, size, and visibility
     */
    public updateWindowConfig(id: string, config: Partial<StoredWindowConfig>): void {
        const existingConfig = this.windowConfigs.get(id);
        if (existingConfig) {
            const updatedConfig = { ...existingConfig, ...config };
            this.windowConfigs.set(id, updatedConfig);
            this.storageManager.saveWindowConfig(updatedConfig);
        }
    }

    /**
     * Sends an IPC message to all windows
     * @param channel - The IPC channel name
     * @param payload - The data to send
     */
    public async broadcastToAll(channel: string, payload: any): Promise<void> {
        for (const window of this.windows.values()) {
            if (!window.isDestroyed()) {
                sendFromMain(window, channel, payload);
            }
        }
    }

    /**
     * Sends an IPC message to a specific window
     * @param windowId - Target window ID
     * @param channel - The IPC channel name
     * @param payload - The data to send
     */
    public async sendToWindow(windowId: string, channel: string, payload: any): Promise<void> {
        const window = this.windows.get(windowId);
        if (window && !window.isDestroyed()) {
            sendFromMain(window, channel, payload);
        }
    }

    /**
     * Shows or hides a window and updates its configuration
     * @param id - Window ID
     * @param isVisible - Desired visibility state
     */
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

    /**
     * Saves the current state (bounds, visibility) of a window
     * Called when window state changes need to be persisted
     */
    public saveWindowState(id: string): void {
        const window = this.windows.get(id);
        if (window && !window.isDestroyed()) {
            const bounds = window.getBounds();
            const isVisible = window.isVisible();
            
            // Get the display containing the window
            const displayPoint = {
                x: bounds.x + bounds.width / 2,
                y: bounds.y + bounds.height / 2
            };
            const display = screen.getDisplayNearestPoint(displayPoint);
            const displayIndex = screen.getAllDisplays().findIndex(d => d.id === display.id);

            const config = {
                id,
                bounds,
                isVisible,
                displayId: `display${displayIndex + 1}`  // Use friendly display ID format
            };
            this.updateWindowConfig(id, config);
        }
    }

    /**
     * Validates and adjusts window bounds to ensure they are within valid display areas
     * @param bounds - The window bounds to validate
     * @returns Adjusted bounds that are guaranteed to be visible on a display
     */
    private validateWindowBounds(bounds: Electron.Rectangle): Electron.Rectangle {
        const displays = screen.getAllDisplays();
        
        // Find the display that contains the window
        const containingDisplay = screen.getDisplayNearestPoint({
            x: bounds.x + bounds.width / 2,
            y: bounds.y + bounds.height / 2
        });

        // If the window is mostly outside the display, adjust it
        const adjustedBounds = { ...bounds };
        const display = containingDisplay.workArea;

        // Ensure minimum visibility (at least 100px width and height visible)
        const minVisibleWidth = Math.min(100, bounds.width);
        const minVisibleHeight = Math.min(100, bounds.height);

        // Adjust position if necessary
        if (bounds.x + minVisibleWidth > display.x + display.width) {
            adjustedBounds.x = display.x + display.width - bounds.width;
        }
        if (bounds.y + minVisibleHeight > display.y + display.height) {
            adjustedBounds.y = display.y + display.height - bounds.height;
        }
        if (bounds.x + bounds.width < display.x + minVisibleWidth) {
            adjustedBounds.x = display.x;
        }
        if (bounds.y + bounds.height < display.y + minVisibleHeight) {
            adjustedBounds.y = display.y;
        }

        return adjustedBounds;
    }

    /**
     * Gets the rightmost display from the available displays
     * @returns The rightmost display's work area
     */
    private getRightmostDisplay(): Electron.Rectangle {
        const displays = screen.getAllDisplays();
        const rightmostDisplay = displays.reduce((rightmost, current) => {
            return (current.workArea.x + current.workArea.width > rightmost.workArea.x + rightmost.workArea.width)
                ? current
                : rightmost;
        }, displays[0]);
        
        return rightmostDisplay.workArea;
    }

    /**
     * Restores a window's saved state (bounds, visibility)
     * Used when recreating windows or restoring from minimized state
     */
    public restoreWindowState(id: string): void {
        const window = this.windows.get(id);
        const config = this.windowConfigs.get(id);
        
        if (!window || window.isDestroyed()) return;

        if (config?.bounds) {
            // Validate saved bounds against current display configuration
            const validatedBounds = this.validateWindowBounds(config.bounds);
            window.setBounds(validatedBounds);
        } else {
            // If no saved bounds, place on rightmost display
            const rightmostBounds = this.getRightmostDisplay();
            window.setBounds(rightmostBounds);
        }

        if (config?.isVisible !== undefined) {
            window.show();
        }
    }

    /** Closes a specific window by ID */
    public closeWindow(id: string): void {
        const window = this.windows.get(id);
        if (window && !window.isDestroyed()) {
            window.close();
        }
    }

    /** Closes all active windows */
    public closeAllWindows(): void {
        for (const window of this.windows.values()) {
            if (!window.isDestroyed()) {
                window.close();
            }
        }
    }

    /**
     * Set the state of a panel for a specific window
     * @param windowId The ID of the window
     * @param panelId The ID of the panel (e.g., 'devTools', 'settings')
     * @param isOpen Whether the panel should be open or closed
     */
    public async setPanelState(windowId: string, panelId: string, isOpen: boolean): Promise<void> {
        const config = this.windowConfigs.get(windowId);
        if (!config) {
            throw new Error(`Window ${windowId} not found`);
        }

        // Initialize panels object if it doesn't exist
        if (!config.panels) {
            config.panels = {
                devTools: false,
                settings: false,
                inspector: false
            };
        }

        // Update panel state
        config.panels[panelId] = isOpen;

        // Update in-memory and persistent storage
        this.windowConfigs.set(windowId, config);
        await this.storageManager.saveWindowConfig(config);

        // Notify the renderer process of the state change
        const window = this.windows.get(windowId);
        if (window) {
            sendFromMain(window, 'panelStateChanged', {
                panelId,
                isOpen
            });
        }
    }

    /**
     * Get all panel states for a specific window
     * @param windowId The ID of the window
     * @returns Object containing panel states
     */
    public async getPanelStates(windowId: string): Promise<Record<string, boolean>> {
        const config = this.windowConfigs.get(windowId);
        if (!config) {
            throw new Error(`Window ${windowId} not found`);
        }

        return config.panels || {};
    }

    /**
     * Get the configuration ID for a window instance
     * @param window BrowserWindow instance
     * @returns The configuration ID (e.g., 'main', 'settings') or undefined if not found
     */
    public getWindowConfigId(window: BrowserWindow): string | undefined {
        for (const [id, win] of this.windows.entries()) {
            if (win === window) {
                return id;
            }
        }
        return undefined;
    }
}
