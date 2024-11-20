import { ipcMain, BrowserWindow } from 'electron';
import { WindowManager } from '../utils/windowManager';

export function sendFromMain(window: BrowserWindow, channel: string, payload?: any) {
    if (!window || window.isDestroyed()) {
        console.warn('Attempted to send to an invalid or destroyed window');
        return;
    }
    // console.log('Line 6 - handlers.ts - Sending to channel:', channel, 'payload:', payload);
    window.webContents.send(channel, payload);
};

export async function setupIPC_ReceiverHandlers(window: BrowserWindow) {
    if (!window || window.isDestroyed()) {
        throw new Error('Cannot setup IPC handlers with an invalid window reference');
    }

    // Function to send messages from main to renderer



    // Handle messages from renderer process    
    ipcMain.on('toMain', async (event, data) => {
        console.log('Line 20 - handlers.ts - Received in main:', data);
        // Get the window that sent the message
        const senderWindow = BrowserWindow.fromWebContents(event.sender);
        if (!senderWindow) {
            console.warn('Could not determine sender window');
            return;
        }

        switch (data?.action) {
            case 'saveFile':
                console.log('Saving file:', data.content);
                sendFromMain(senderWindow, 'saveFileResponse', {
                    success: true,
                    message: 'File saved successfully'
                });
                break;

            case 'getData':
                const result = { items: ['item1', 'item2'] };
                sendFromMain(senderWindow, 'getDataResponse', result);
                break;

            case 'toggleWindow':
                if (data.windowId) {
                    const windowManager = WindowManager.getInstance();
                    const windowsInfo = windowManager.getAllWindowsInfo();
                    console.log("Line 50 - handlers.ts - windowsInfo: ", windowsInfo);
                    let targetWindow = windowManager.getWindow(data.windowId);
                    console.log("Line 56 - handlers.ts - targetWindow: ", targetWindow);

                    if (!targetWindow && data.windowId === 'settings') {
                        // Create settings window if it doesn't exist
                        const createSettingsWindow = require('../main').createSettingsWindow;
                        await createSettingsWindow();
                        targetWindow = windowManager.getWindow(data.windowId);
                    }

                    if (targetWindow) {
                        const isVisible = targetWindow.isVisible();
                        console.log("Line 60 - handlers.ts - isVisible: ", isVisible);
                        windowManager.setWindowVisibility(data.windowId, !isVisible);
                        // Notify the renderer of the new visibility state
                        windowManager.broadcastToAll('windowVisibility', {
                            windowId: data.windowId,
                            isVisible: !isVisible
                        });
                    }
                }
                break;

            case 'test-console-log':
                console.log('Line 29 - handlers.ts - Test console log event received');
                sendFromMain(senderWindow, 'fromMain', {
                    success: true,
                    message: 'Test console log event handled'
                });
                break;

            case 'toggleDevTools':
                senderWindow.webContents.toggleDevTools();
                sendFromMain(senderWindow, 'fromMain', {
                    success: true,
                    message: 'DevTools toggled'
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

    // Return the sendFromMain function for convenience
    return { sendFromMain };
}
