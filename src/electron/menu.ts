import { app, Menu, BrowserWindow, type MenuItemConstructorOptions, MenuItem } from 'electron';

export function createMenu(): void {
    // console.log("Line 4 - menu.ts - Creating application menu");

    const isMac: boolean = process.platform === 'darwin';
    const template: MenuItemConstructorOptions[] = [
        // App Menu (macOS only)
        ...(isMac ? [{
            label: app.name,
            submenu: [
                { role: 'about' as const },
                { type: 'separator' as const },
                { role: 'services' as const },
                { type: 'separator' as const },
                { role: 'hide' as const },
                { role: 'hideOthers' as const },
                { role: 'unhide' as const },
                { type: 'separator' as const },
                { role: 'quit' as const }
            ]
        }] : []),
        // File Menu
        {
            label: 'File',
            submenu: [
                isMac ? { role: 'close' as const } : { role: 'quit' as const }
            ]
        },
        // Edit Menu
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' as const },
                { role: 'redo' as const },
                { type: 'separator' as const },
                { role: 'cut' as const },
                { role: 'copy' as const },
                { role: 'paste' as const },
                ...(isMac ? [
                    { role: 'pasteAndMatchStyle' as const },
                    { role: 'delete' as const },
                    { role: 'selectAll' as const },
                ] : [
                    { role: 'delete' as const },
                    { type: 'separator' as const },
                    { role: 'selectAll' as const }
                ])
            ]
        },
        // View Menu
        {
            label: 'View',
            submenu: [
                { role: 'reload' as const },
                { role: 'forceReload' as const },
                { role: 'toggleDevTools' as const },
                { type: 'separator' as const },
                { role: 'resetZoom' as const },
                { role: 'zoomIn' as const },
                { role: 'zoomOut' as const },
                { type: 'separator' as const },
                { role: 'togglefullscreen' as const }
            ]
        },
        // Window Menu
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' as const },
                { role: 'zoom' as const },
                ...(isMac ? [
                    { type: 'separator' as const },
                    { role: 'front' as const },
                    { type: 'separator' as const },
                    { role: 'window' as const }
                ] : [
                    { role: 'close' as const }
                ])
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    // console.log("Line 89 - menu.ts - Application menu created successfully");
}