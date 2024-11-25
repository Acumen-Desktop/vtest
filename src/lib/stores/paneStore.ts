// src/lib/stores/paneStore.ts
import { writable } from 'svelte/store';

export type PaneContentDimensions = {
    width: number;
    height: number;
};

export type PaneContent = {
    id: string;
    element: HTMLElement | null;
    dimensions: PaneContentDimensions;
};

export type PaneStore = {
    [key: string]: PaneContent;
};

// Create initial store with our six panes
const initialPanes: PaneStore = {
    topLeft: { id: 'topLeftContent', element: null, dimensions: { width: 0, height: 0 } },
    topRight: { id: 'topRightContent', element: null, dimensions: { width: 0, height: 0 } },
    bottomLeft: { id: 'bottomLeftContent', element: null, dimensions: { width: 0, height: 0 } },
    bottomCenter: { id: 'bottomCenterContent', element: null, dimensions: { width: 0, height: 0 } },
    bottomRight: { id: 'bottomRightContent', element: null, dimensions: { width: 0, height: 0 } },
    footer: { id: 'footerContent', element: null, dimensions: { width: 0, height: 0 } }
};

export const paneStore = writable<PaneStore>(initialPanes);