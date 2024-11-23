import { app, BrowserWindow, protocol, net } from 'electron';
import path from 'path';
import url from 'url';
import { stat } from 'node:fs/promises';
import { initDisplayData } from './utils/displayData';
import { sendFromMain, setupIPC_ReceiverHandlers } from './ipc/handlers';
import { getAppPath } from './utils/pathData';
import { get } from 'svelte/store';
import { WindowManager, type WindowConfig } from './utils/windowManager';
import { StorageManager } from './utils/storageManager';
import { createMenu } from './menu';
import { initializeConfig, updatePanelState } from './utils/initConfig';
import { type StoredDisplayConfig } from './utils/storageManager';

enum OSType {
	Windows = 'win32',
	MacOS = 'darwin',
	Linux = 'linux'
}

const CURRENT_OS = process.platform as OSType;
process.noDeprecation = true;
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
	titleBarStyle: 'hiddenInset' as const,
	titleBarOverlay: {
		color: '#374151',
		symbolColor: '#ffffff',
		height: 35
	},
	webPreferences: {
		sandbox: true,
		contextIsolation: true,
		nodeIntegration: false,
		preload: path.join(import.meta.dirname, '../preload/preload.js'),
	},
};

let displayData: StoredDisplayConfig[] | Record<string, StoredDisplayConfig> = {};

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

async function createMainWindow() {
	const windowManager = WindowManager.getInstance();
	const mainWindow = windowManager.createWindow({
		id: 'main',
		options: windowOptionsCommon,
		userOptions: {}
	} satisfies WindowConfig);

	// Disable autofill
	mainWindow.webContents.session.setSpellCheckerEnabled(false);
	mainWindow.webContents.session.setPreloads([]);

	// Restore window state or position on rightmost display
	windowManager.restoreWindowState('main');

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
	return mainWindow;
}

export async function createSettingsWindow() {
	// console.log('Line 97 - main.ts - Creating settings window...');
	const windowManager = WindowManager.getInstance();

	// Check if window already exists
	const existingWindow = windowManager.getWindow('settings');
	if (existingWindow) {
		console.log('Settings window already exists, showing it');
		windowManager.setWindowVisibility('settings', true);
		return existingWindow;
	}

	const settingsOptions = {
		...windowOptionsCommon,
		width: 800,
		height: 600,
	};
	// console.log('Creating settings window with options:', settingsOptions);
	const settingsWindow = windowManager.createWindow({
		id: 'settings',
		options: settingsOptions
	} satisfies WindowConfig);
	try {
		if (displayData) {
			// console.log("Line 123 - main.ts - displayData: ", displayData);
			const firstDisplay = Array.isArray(displayData)
				? displayData[0]
				: Object.values(displayData)[0];

			if (firstDisplay) {
				// console.log('Line 126 - main.ts - Setting bounds for settings window:', firstDisplay.workArea);
				settingsWindow.setBounds(firstDisplay.workArea);
			}
		}
	} catch (error) {
		console.log("Line 130 - main.ts - Display Error:", error);
		windowManager.sendToWindow('main', 'fromMain', {
			action: 'log-data',
			error
		});
	}

	// settingsWindow.once('ready-to-show', () => {
	// 	console.log('Settings window ready to show');
	// 	settingsWindow.show();
	// 	if (import.meta.env.DEV) {
	// 		console.log('Opening DevTools for settings window');
	// 		settingsWindow.webContents.openDevTools();
	// 	}
	// });

	// Add URL loading
	if (import.meta.env.DEV) {
		console.log('Line 148 - main.ts - Loading settings window URL in DEV mode');
		settingsWindow.loadURL(`${VITE_DEV_SERVER_URLS['main_window']}/settings`);
	} else {
		console.log('Line 153 - main.ts - Loading settings window URL in PROD mode');
		settingsWindow.loadURL('app://-/settings');
	}
	return settingsWindow;
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
		createMainWindow();
	}
});

// Save window states before quitting
app.on('before-quit', () => {
	const windowManager = WindowManager.getInstance();
	const windows = windowManager.getAllWindowsInfo();
	windows.forEach(({ id }) => {
		windowManager.saveWindowState(id);
	});
});

app.on('second-instance', (event, args, workingDirectory, additionalData) => {
	createMainWindow();
});

app.whenReady().then(async () => {
	try {
		// Initialize configuration and display data
		const config = await initializeConfig();
		displayData = config.displays;

		// Create windows with initialized config
		const mainWindow = await createMainWindow();
		const settingsWindow = await createSettingsWindow();

		// Set up IPC handlers
		setupIPC_ReceiverHandlers(mainWindow);
		setupIPC_ReceiverHandlers(settingsWindow);

		// Create application menu
		createMenu();

		protocol.handle('app', async (request) => {
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
	} catch (error) {
		console.error('Failed to initialize app:', error);
		app.quit();
	}
});
