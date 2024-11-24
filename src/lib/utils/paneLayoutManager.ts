import type { Display } from 'electron';

interface PaneBounds {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface AffectedPane {
    id: string;
    bounds: PaneBounds;
}

interface LayoutConfig {
    id: string;
    bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    display: {
        id: number;
        bounds: Display['bounds'];
    };
}

interface LayoutChangeMessage {
    layoutId: string;
    percentages: number[];
    handle?: string;
    affectedPanes: AffectedPane[];
}

// Track which panes are affected by each handle
const handleToPanes: Record<string, string[]> = {
    'topBottomHandle': ['topLeft', 'topRight', 'bottomLeft', 'bottomCenter', 'bottomRight'],
    'topLeftRightHandle': ['topLeft', 'topRight'],
    'bottomLeftCenterHandle': ['bottomLeft', 'bottomCenter'],
    'bottomCenterRightHandle': ['bottomCenter', 'bottomRight'],
    'bottomFooterHandle': ['bottomLeft', 'bottomCenter', 'bottomRight', 'footer']
};

// Track which handles belong to which pane groups
const paneGroupHandles: Record<string, string[]> = {
    'top-bottom-footer-layout': ['topBottomHandle', 'bottomFooterHandle'],
    'topLeft-topRight-layout': ['topLeftRightHandle'],
    'bottomLeft-bottomCenter-bottomRight-layout': ['bottomLeftCenterHandle', 'bottomCenterRightHandle']
};

// Track which panes are in the same row/column
const paneGroups = {
    topRow: ['topLeft', 'topRight'],
    bottomRow: ['bottomLeft', 'bottomCenter', 'bottomRight'],
    leftColumn: ['topLeft', 'bottomLeft'],
    rightColumn: ['topRight', 'bottomRight']
};

function getPaneBounds(id: string): PaneBounds | null {
    const element = document.getElementById(id);
    if (!element) return null;

    // Get the container element
    const container = element.closest('.paneContainer');
    if (!container) return null;

    // Get container bounds once
    const containerRect = container.getBoundingClientRect();
    const containerX = Math.round(containerRect.x);
    const containerY = Math.round(containerRect.y);

    // Use offsetWidth/Height for dimensions
    return {
        x: containerX + element.offsetLeft,
        y: containerY + element.offsetTop,
        width: element.offsetWidth,
        height: element.offsetHeight
    };
}

function normalizeCoordinates(panes: AffectedPane[]): AffectedPane[] {
    // Group panes by their row/column
    const rowGroups = new Map<string, AffectedPane[]>();

    panes.forEach(pane => {
        // Find which row this pane belongs to
        for (const [groupName, groupPanes] of Object.entries(paneGroups)) {
            if (groupPanes.includes(pane.id) && groupName.includes('Row')) {
                const group = rowGroups.get(groupName) || [];
                group.push(pane);
                rowGroups.set(groupName, group);
                break;
            }
        }
    });

    // Normalize y-coordinates within each row
    rowGroups.forEach(groupPanes => {
        if (groupPanes.length > 1) {
            // Find the most common y-coordinate
            const yValues = groupPanes.map(p => p.bounds.y);
            const yMode = yValues.sort((a, b) =>
                yValues.filter(v => v === a).length - yValues.filter(v => v === b).length
            ).pop()!;

            // Apply the most common y-coordinate to all panes in the row
            groupPanes.forEach(pane => {
                pane.bounds.y = yMode;
                // Adjust height to maintain bottom alignment
                const bottom = pane.bounds.y + pane.bounds.height;
                pane.bounds.height = bottom - yMode;
            });
        }
    });

    return panes;
}

// This will be called from the renderer process
export function handleLayoutChange(layoutId: string, percentages: number[], handle?: string) {
    // Get all handles for this pane group
    const groupHandles = paneGroupHandles[layoutId] || [];

    // If no specific handle is provided, use all handles for this group
    const handlesToUse = handle ? [handle] : groupHandles;

    // Get all affected panes from all relevant handles
    const affectedPaneIds = new Set<string>();
    handlesToUse.forEach(h => {
        handleToPanes[h]?.forEach(paneId => affectedPaneIds.add(paneId));
    });

    // Collect bounds for all affected panes
    const affectedPanes: AffectedPane[] = [];
    affectedPaneIds.forEach(paneId => {
        const bounds = getPaneBounds(paneId);
        if (bounds) {
            affectedPanes.push({ id: paneId, bounds });
        }
    });

    // Normalize coordinates for panes in the same row/column
    const normalizedPanes = normalizeCoordinates(affectedPanes);

    const message: LayoutChangeMessage = {
        layoutId,
        percentages,
        handle,
        affectedPanes: normalizedPanes
    };

    // Send to main process
    window.api.send('layout:change', message);
}

// This will be implemented in the main process (electron)
export function convertToDisplayBounds(
    layoutId: string,
    percentages: number[],
    containerBounds: { x: number; y: number; width: number; height: number },
    display: Display
): LayoutConfig {
    // Convert percentages to actual pixel values based on container bounds
    const pixelValues = percentages.map(percentage => {
        return Math.round((percentage / 100) * (containerBounds.width || containerBounds.height));
    });

    return {
        id: layoutId,
        bounds: {
            x: Math.round(containerBounds.x),
            y: Math.round(containerBounds.y),
            width: Math.round(pixelValues[0] || containerBounds.width),
            height: Math.round(pixelValues[1] || containerBounds.height)
        },
        display: {
            id: display.id,
            bounds: display.bounds
        }
    };
}
