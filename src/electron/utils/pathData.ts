import { app, BrowserWindow } from "electron";
import { sendFromMain } from "../ipc/handlers";

export function getAppPath(window: BrowserWindow) {
    try {
        sendFromMain(window, 'fromMain', {
            action: 'log-data',
            appPath: app.getAppPath()
        });
        return app.getAppPath();
    }
    catch (e) {
        console.error(e);
    }
}