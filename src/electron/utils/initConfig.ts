import { StorageManager, type StoredWindowConfig } from './storageManager';
import { initDisplayData } from './displayData';
import type { DisplayConfig } from './displayData';

interface DefaultConfig {
    windows: StoredWindowConfig[];
    displays: Record<string, StoredDisplayConfig>;
}

/**
 * Default configuration for new installations
 */
const defaultConfig: DefaultConfig = {
    windows: [
        {
            id: 'main',
            isVisible: true,
            panels: {
                devTools: false,
                settings: false,
                inspector: false
            },
            bounds: {
                x: 100,
                y: 100,
                width: 1200,
                height: 800
            }
        },
        {
            id: 'settings',
            isVisible: false,
            panels: {
                devTools: false,
                settings: true,
                inspector: false
            },
            bounds: {
                x: 150,
                y: 150,
                width: 800,
                height: 600
            }
        }
    ],
    displays: {}
};

/**
 * Initialize the application configuration
 * Creates default config if none exists
 * Updates display data
 * @returns The initialized configuration
 */
export async function initializeConfig(): Promise<DefaultConfig> {
    const storageManager = StorageManager.getInstance();
    let config = storageManager.loadData();

    // If no config exists, create default
    if (!config || !config.windows || config.windows.length === 0) {
        config = defaultConfig;
    }

    // Ensure all windows have panel states
    config.windows = config.windows.map(window => ({
        ...window,
        panels: window.panels || {
            devTools: false,
            settings: false,
            inspector: false
        }
    }));

    // Initialize display data
    const displaysArray = await initDisplayData();
    
    // Handle both array and record formats for displays
    if (Array.isArray(displaysArray)) {
        config.displays = displaysArray.reduce((acc, display) => {
            acc[display.id] = display;
            return acc;
        }, {} as Record<string, StoredDisplayConfig>);
    } else {
        config.displays = displaysArray;
    }

    // Save the initialized config
    storageManager.saveData(config);

    return config;
}

/**
 * Update a panel state in the configuration
 * @param windowId Window identifier
 * @param panelId Panel identifier
 * @param isOpen New panel state
 */
export async function updatePanelState(windowId: string, panelId: string, isOpen: boolean): Promise<void> {
    const storageManager = StorageManager.getInstance();
    const config = storageManager.loadData();
    
    const windowConfig = config.windows.find(w => w.id === windowId);
    if (!windowConfig) {
        throw new Error(`Window ${windowId} not found in configuration`);
    }

    if (!windowConfig.panels) {
        windowConfig.panels = {
            devTools: false,
            settings: false,
            inspector: false
        };
    }

    windowConfig.panels[panelId] = isOpen;
    storageManager.saveData(config);
}
