import { app, BrowserWindow, protocol, net } from 'electron';
import path from 'path';
import url from 'url';
import { stat } from 'node:fs/promises';
import { initDisplayData } from './utils/displayData';
import { setupIPCHandlers } from './ipc/handlers';

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
	width: 900,
	height: 700,
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

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
import electronSquirrelStartup from 'electron-squirrel-startup';
if (electronSquirrelStartup) app.quit();

if (!app.requestSingleInstanceLock()) {
	app.quit();
}

app.on('second-instance', (event, args, workingDirectory, additionalData) => {
	createWindow();
});


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
});

async function createWindow() {
	console.log("Line 81 - main.ts - Starting window creation");

	const displayData = initDisplayData();
	console.log("Line 84 - main.ts - Display data initialized:", displayData);

	const mainWindow = new BrowserWindow({
		...windowOptionsCommon,
		...devDisplayPosition,
	});

	// Set up IPC handlers
	const { sendToRenderer } = setupIPCHandlers(mainWindow);
	console.log("Line 93 - main.ts - IPC handlers set up");

	// Wait for window to be ready before sending messages
	mainWindow.once('ready-to-show', () => {
		console.log("Line 97 - main.ts - Window ready to show");
		mainWindow.show();
		if (import.meta.env.DEV) mainWindow.webContents.openDevTools();
	});

	if (import.meta.env.DEV) {
		mainWindow.loadURL(VITE_DEV_SERVER_URLS['main_window']);
	}
	else {
		mainWindow.loadURL('app://-/');
	}

	// Wait for the page to finish loading before sending messages
	mainWindow.webContents.on('did-finish-load', () => {
		console.log("Line 111 - main.ts - Page finished loading");
		
		// Send display error after page is loaded
		if (displayData === undefined || displayData.Error) {
			console.log("Line 115 - main.ts - Sending display error:", displayData?.Error);
			sendToRenderer('fromMain', {
				action: 'displayError',
				error: displayData?.Error || 'Failed to initialize display data'
			});
		} else {
			console.log("Line 121 - main.ts - displayData: ", displayData);
			// TODO: Set the windowOptions to the selected display
		}
	});

	// Send initial display data
	sendToRenderer('test-console-log', { displayData });
}

app.on('ready', createWindow);

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
