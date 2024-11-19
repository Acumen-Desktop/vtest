import { app, BrowserWindow, protocol, net } from 'electron';
import path from 'path';
import url from 'url';
import { stat } from 'node:fs/promises';
import { initDisplayData } from './utils/displayData';
import { sendFromMain, setupIPC_ReceiverHandlers } from './ipc/handlers';
import { getAppPath } from './utils/pathData';
import { get } from 'svelte/store';
import { WindowManager } from './utils/windowManager';

enum OSType {
	Windows = 'win32',
	MacOS = 'darwin',
	Linux = 'linux'
}

const CURRENT_OS = process.platform as OSType;
const scheme = 'app';
const srcFolder = path.join(app.getAppPath(), `.vite/renderer/main_window/`);
const staticAssetsFolder = import.meta.env.DEV ? path.join(import.meta.dirname, '../../static/') : srcFolder;
const devDisplayPosition = { x: 2048, y: 0, width: 1860, height: 1100 };
const windowOptionsCommon = {
	x: 0,
	y: 0,
	width: 1200,
	height: 800,
	minWidth: 400,
	minHeight: 200,
	backgroundColor: '#374151',
	autoHideMenuBar: true,
	show: false,
	webPreferences: {
		sandbox: true,
		contextIsolation: true,
		nodeIntegration: false,
		preload: path.join(import.meta.dirname, '../preload/preload.js'),
	},
};

// TODO: Research this
protocol.registerSchemesAsPrivileged([{
	scheme: scheme,
	privileges: {
		standard: true,
		secure: true,
		allowServiceWorkers: true,
		supportFetchAPI: true,
		corsEnabled: false,
	},
},
]);

// TODO: Research this
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// import electronSquirrelStartup from 'electron-squirrel-startup';
// import { dev } from '$app/environment';
// if (electronSquirrelStartup) app.quit();

async function createWindow() {
	const windowManager = WindowManager.getInstance();
	const mainWindow = windowManager.createWindow({
		id: 'main',
		options: windowOptionsCommon
	});

	try {
		const displayData = initDisplayData();
		// TODO: Set the windowOptions to the right most display, unless there is a user preference.
		if (displayData) {
			const lastDisplay = Object.values(displayData).at(-1);
			if (lastDisplay) mainWindow.setBounds(lastDisplay.workArea);
		}
	} catch (error) {
		console.log("Line 90 - main.ts - Display Error:", error);
		windowManager.sendToWindow('main', 'fromMain', {
			action: 'log-data',
			error
		});
	}

	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
		if (import.meta.env.DEV) mainWindow.webContents.openDevTools();
	});

	if (import.meta.env.DEV) {
		mainWindow.loadURL(VITE_DEV_SERVER_URLS['main_window']);
	}
	else {
		mainWindow.loadURL('app://-/');
	}

	getAppPath(mainWindow);
}

if (!app.requestSingleInstanceLock()) {
	app.quit();
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});


app.on('second-instance', (event, args, workingDirectory, additionalData) => {
	createWindow();
});

app.on('ready', () => {

	protocol.handle(scheme, async (request) => {
		const requestPath = path.normalize(decodeURIComponent(new URL(request.url).pathname));

		async function isFile(filePath: string) {
			try {
				if ((await stat(filePath)).isFile()) return filePath;
			}
			catch (e) { }
		}

		const responseFilePath = await isFile(path.join(srcFolder, requestPath))
			?? await isFile(path.join(srcFolder, path.dirname(requestPath), `${path.basename(requestPath) || 'index'}.html`))
			?? path.join(srcFolder, '200.html');

		return await net.fetch(url.pathToFileURL(responseFilePath).toString());
	});

	createWindow();
});
