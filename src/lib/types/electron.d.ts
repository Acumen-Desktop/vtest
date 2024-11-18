export interface ElectronAPI {
    send: (channel: string, data: any) => void;
    receive: (channel: string, func: (...args: any[]) => void) => void;
    toggleDevTools: () => void;
}

declare global {
    interface Window {
        api: ElectronAPI;
    }
}
