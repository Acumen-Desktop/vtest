import { ipcMain, BrowserWindow, screen } from 'electron';
import { StorageManager } from '../utils/storageManager';
import { WindowManager } from '../utils/windowManager';

interface LayoutChangeMessage {
    layoutId: string;
    percentages: number[];
    handle?: string;
    affectedPanes: {
        id: string;
        bounds: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
    }[];
}

export function setupPaneLayoutHandlers() {
    // console.log('Setting up pane layout handlers...');
    const storageManager = StorageManager.getInstance();
    const windowManager = WindowManager.getInstance();

    ipcMain.on('layout:change', (event, message: LayoutChangeMessage) => {
        // console.log('Received layout change:', message);
        const { layoutId, affectedPanes } = message;
        
        const sourceWindow = BrowserWindow.fromWebContents(event.sender);
        if (!sourceWindow) {
            console.warn('No source window found for layout change');
            return;
        }

        // Get the window config ID from the WindowManager
        const windowId = windowManager.getWindowConfigId(sourceWindow);
        if (!windowId) {
            console.warn('Could not find window configuration ID');
            return;
        }

        // console.log('Window ID:', windowId);

        // Save each affected pane's layout
        for (const pane of affectedPanes) {
            try {
                // Round all values to integers
                const bounds = {
                    x: Math.round(pane.bounds.x),
                    y: Math.round(pane.bounds.y),
                    width: Math.round(pane.bounds.width),
                    height: Math.round(pane.bounds.height)
                };
                
                storageManager.savePaneLayout(windowId, pane.id, bounds);
                // console.log(`Saved layout for pane ${pane.id}:`, bounds);
            } catch (error) {
                console.error(`Error saving layout for pane ${pane.id}:`, error);
            }
        }

        // Verify storage
        const savedLayouts = storageManager.getWindowPaneLayouts(windowId);
        // console.log('Retrieved layouts from storage:', savedLayouts);
    });
    
    // console.log('Pane layout handlers setup complete');
}
