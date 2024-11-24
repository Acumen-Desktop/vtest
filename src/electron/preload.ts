import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    'api', {
    platform: process.platform,
    send: (channel: string, data?: any) => {
        // whitelist channels
        const validChannels = [
            'layout:change'
        ];
        if (validChannels.includes(channel)) {
            // TODO: This is crazy fast, may need to throttle
            console.log("Line 14 - preload.ts - data: ", data);
            ipcRenderer.send(channel, data);
        }
    },
    invoke: (channel: string, data?: any) => {
        // whitelist channels
        const validChannels = [
            'toggleWindow',
            'toggleDevTools',
            'getWindowVisibility',
            'setPanelState',
            'getPanelStates',
            'layout:change'
        ];
        if (validChannels.includes(channel)) {
            return ipcRenderer.invoke(channel, data);
        }
        throw new Error(`Line 13 - preload.ts - Invalid channel: ${channel}`);
    },
    on: (channel: string, callback: Function) => {
        const validChannels = [
            'windowVisibility',
            'panelStateChanged',
            'layout:change'
        ];
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (_event, data) => callback(data));
        }
    },
    // Keep the on method for event-based updates that don't need responses
    removeListener: (channel: string, callback: Function) => {
        const validChannels = [
            'windowVisibility',
            'panelStateChanged',
            'layout:change'
        ];
        if (validChannels.includes(channel)) {
            ipcRenderer.removeListener(channel, callback as any);
        }
    }
});
