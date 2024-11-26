import { ipcMain, BrowserWindow } from 'electron';
import { WindowManager } from '../utils/windowManager';
import { setupPaneLayoutHandlers } from './paneLayoutHandler';

// Track whether handlers have been set up
let handlersInitialized = false;

export function sendFromMain(window: BrowserWindow, channel: string, payload?: any) {
    if (!window || window.isDestroyed()) {
        console.warn('Attempted to send to an invalid or destroyed window');
        return;
    }
    window.webContents.send(channel, payload);
}

export async function setupIPC_ReceiverHandlers(window: BrowserWindow) {
    if (!window || window.isDestroyed()) {
        throw new Error('Cannot setup IPC handlers with an invalid window reference');
    }

    // Prevent duplicate handler registration
    if (handlersInitialized) {
        // console.log('IPC handlers already initialized, skipping setup');
        return;
    }

    handlersInitialized = true;

    // Set up pane layout handlers
    setupPaneLayoutHandlers();

    // Handle messages from renderer process    
    ipcMain.on('toMain', async (event, data) => {
        // console.log('Line 20 - handlers.ts - Received in main:', data);
        // Get the window that sent the message
        const senderWindow = BrowserWindow.fromWebContents(event.sender);
        if (!senderWindow) {
            console.warn('Could not determine sender window');
            return;
        }

        switch (data?.action) {
            case 'saveFile':
                // console.log('Saving file:', data.content);
                sendFromMain(senderWindow, 'saveFileResponse', {
                    success: true,
                    message: 'File saved successfully'
                });
                break;

            case 'getData':
                const result = { items: ['item1', 'item2'] };
                sendFromMain(senderWindow, 'getDataResponse', result);
                break;

            case 'test-console-log':
                // console.log('Line 29 - handlers.ts - Test console log event received');
                sendFromMain(senderWindow, 'fromMain', {
                    success: true,
                    message: 'Test console log event handled'
                });
                break;

            default:
                console.log('Unknown action:', data?.action);
                sendFromMain(senderWindow, 'error', {
                    success: false,
                    error: 'Unknown action'
                });
        }
    });

    // Register panel state handlers
    ipcMain.handle('getPanelStates', async (event) => {
        try {
            const senderWindow = BrowserWindow.fromWebContents(event.sender);
            if (!senderWindow) {
                throw new Error('Could not determine sender window');
            }

            // Get the window config ID (e.g., 'main', 'settings') instead of numeric ID
            const windowManager = WindowManager.getInstance();
            const configId = windowManager.getWindowConfigId(senderWindow);
            if (!configId) {
                throw new Error('Could not find window configuration');
            }

            const panelStates = await windowManager.getPanelStates(configId);
            return {
                success: true,
                panelStates
            };
        } catch (error) {
            console.error('Error getting panel states:', error);
            return {
                success: false,
                error: error
            };
        }
    });

    ipcMain.handle('setPanelState', async (event, data) => {
        try {
            const { panelId, isOpen } = data;
            const senderWindow = BrowserWindow.fromWebContents(event.sender);
            if (!senderWindow) {
                throw new Error('Could not determine sender window');
            }

            // Get the window config ID (e.g., 'main', 'settings') instead of numeric ID
            const windowManager = WindowManager.getInstance();
            const configId = windowManager.getWindowConfigId(senderWindow);
            if (!configId) {
                throw new Error('Could not find window configuration');
            }

            await windowManager.setPanelState(configId, panelId, isOpen);
            return {
                success: true,
                panelId,
                isOpen
            };
        } catch (error) {
            console.error('Error setting panel state:', error);
            return {
                success: false,
                error: error
            };
        }
    });

    // Handle window toggling
    ipcMain.handle('toggleWindow', async (_event, data) => {
        // console.log("Line 130 - handlers.ts - data: ", data);
        try {
            if (data.windowId) {
                const windowManager = WindowManager.getInstance();
                const windowsInfo = windowManager.getAllWindowsInfo();
                // console.log("Line 42 - handlers.ts - windowsInfo: ", windowsInfo);

                let targetWindow = windowManager.getWindow(data.windowId);
                if (targetWindow) {
                    if (targetWindow.isVisible()) {
                        targetWindow.hide();
                    } else {
                        // Use showInactive to show the window without stealing focus
                        targetWindow.showInactive();
                    }
                    return {
                        success: true,
                        isVisible: targetWindow.isVisible()
                    };
                }
            }
            return {
                success: false,
                error: 'Line 82 - handlers.ts - Invalid window ID'
            };
        } catch (error) {
            console.error('Line 85 - handlers.ts - Error in toggleWindow:', error);
            return {
                success: false,
                error: 'Line 88 - handlers.ts - ' + error
            };
        }
    });

    // Handle DevTools toggle
    ipcMain.handle('toggleDevTools', async (event) => {
        try {
            const webContents = event.sender;
            let isOpen;
            if (webContents.isDevToolsOpened()) {
                webContents.closeDevTools();
                isOpen = false;
            } else {
                webContents.openDevTools();
                isOpen = true;
            }
            return {
                success: true,
                isDevToolsOpen: isOpen
            };
        } catch (error) {
            console.error('Error in toggleDevTools:', error);
            return {
                success: false,
                error: error
            };
        }
    });

    // Get window visibility status
    ipcMain.handle('getWindowVisibility', async (_event, windowId) => {
        try {
            const windowManager = WindowManager.getInstance();
            const targetWindow = windowManager.getWindow(windowId);
            if (targetWindow) {
                return {
                    success: true,
                    isVisible: targetWindow.isVisible()
                };
            }
            return {
                success: false,
                error: 'Window not found'
            };
        } catch (error) {
            console.error('Error in getWindowVisibility:', error);
            return {
                success: false,
                error: error
            };
        }
    });

    // Return the sendFromMain function for convenience
    return { sendFromMain };
}
