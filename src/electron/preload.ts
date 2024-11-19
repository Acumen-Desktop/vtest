import { contextBridge, ipcRenderer } from 'electron';

// Add direct IPC listener for debugging
ipcRenderer.on('fromMain', (event, data) => {
    console.log('Line 4 - preload.ts - Direct IPC listener received:', data);
});

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    'api', {
    send: (channel: string, data: any) => {
        // whitelist channels
        const validChannels = ['toMain'];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    on: (channel: string, callback: Function) => {
        console.log('Line 19 - preload.ts - Setting up listener for channel:', channel);
        const validChannels = ['test-console-log', 'fromMain', 'toggleDevToolsResponse'];
        if (validChannels.includes(channel)) {
            console.log('Line 22 - preload.ts - Channel is valid:', channel);
            ipcRenderer.on(channel, (_event, data) => {
                console.log('Line 24 - preload.ts - Received on channel:', channel, 'data:', data);
                callback(data);
            });
        }
    },
    toggleDevTools: () => {
        ipcRenderer.send('toMain', { action: 'toggleDevTools' });
    }
}
);
