import { ipcMain, BrowserWindow } from 'electron';

export function setupIPCHandlers(mainWindow: BrowserWindow) {
    // Function to send messages from main to renderer
    const sendToRenderer = (channel: string, payload?: any) => {
        console.log('Line 6 - handlers.ts - Sending to channel:', channel, 'payload:', payload);
        mainWindow.webContents.send(channel, payload);
    };

    // Handle messages from renderer process
    ipcMain.on('toMain', (event, data) => {
        console.log('Received in main:', data);

        switch (data?.action) {
            case 'saveFile':
                console.log('Saving file:', data.content);
                sendToRenderer('saveFileResponse', {
                    success: true,
                    message: 'File saved successfully'
                });
                break;

            case 'getData':
                const result = { items: ['item1', 'item2'] };
                sendToRenderer('getDataResponse', result);
                break;

            case 'test-console-log':
                console.log('Line 29 - handlers.ts - Test console log event received');
                sendToRenderer('fromMain', {
                    success: true,
                    message: 'Test console log event handled'
                });
                break;

            case 'toggleDevTools':
                mainWindow.webContents.toggleDevTools();
                sendToRenderer('fromMain', {
                    success: true,
                    message: 'DevTools toggled'
                });
                break;

            default:
                console.log('Unknown action:', data?.action);
                sendToRenderer('error', {
                    success: false,
                    error: 'Unknown action'
                });
        }
    });

    // Return the sender function so it can be used elsewhere in main process
    return { sendToRenderer };
}
