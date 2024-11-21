import { screen as electronScreen } from "electron";
import { StorageManager, type StoredDisplayConfig } from "./storageManager";

export function initDisplayData() {
    const storageManager = StorageManager.getInstance();
    const displays = electronScreen.getAllDisplays().map(({ id, label, workArea }, index) => ({
        id: `display${index + 1}`,  // Friendly ID (display1, display2, etc.)
        systemId: id.toString(),    // Keep original system ID for reference
        label,
        workArea,
        positionLabel: ''  // Will be set based on display arrangement
    }));

    let primaryDisplay = displays.find(display => display.workArea.x < 100 && display.workArea.y < 100);
    let sortedDisplays = displays.sort((a, b) => a.workArea.x - b.workArea.x);

    // Assign position labels based on arrangement
    if (sortedDisplays.length === 1) {
        sortedDisplays[0].positionLabel = 'Primary';
    } else {
        // test if all 'y' values close together, this means the displays are in a row, else stacked or grid.
        let isDisplayRow = true;
        let rowYvalue = sortedDisplays[0].workArea.y;
        for (let i = 0; i < sortedDisplays.length; i++) {
            const yDifference = Math.abs(sortedDisplays[i].workArea.y - rowYvalue);
            if (yDifference > 100) {
                isDisplayRow = false;
                break;
            }
        }

        if (isDisplayRow) {
            switch (sortedDisplays.length) {
                case 2:
                    sortedDisplays[0].positionLabel = 'Left';
                    sortedDisplays[1].positionLabel = 'Right';
                    break;
                case 3:
                    sortedDisplays[0].positionLabel = 'Left';
                    sortedDisplays[1].positionLabel = 'Center';
                    sortedDisplays[2].positionLabel = 'Right';
                    break;
                case 4:
                    sortedDisplays[0].positionLabel = 'FarLeft';
                    sortedDisplays[1].positionLabel = 'Left';
                    sortedDisplays[2].positionLabel = 'Right';
                    sortedDisplays[3].positionLabel = 'FarRight';
                    break;
                case 5:
                    sortedDisplays[0].positionLabel = 'FarLeft';
                    sortedDisplays[1].positionLabel = 'Left';
                    sortedDisplays[2].positionLabel = 'Center';
                    sortedDisplays[3].positionLabel = 'Right';
                    sortedDisplays[4].positionLabel = 'FarRight';
                    break;
                default:
                    // For more than 5 displays, use numeric position labels
                    sortedDisplays.forEach((display, index) => {
                        display.positionLabel = `Display${index + 1}`;
                    });
            }
        } else {
            // For non-row arrangements (stacked/grid), use numeric positions for now
            sortedDisplays.forEach((display, index) => {
                display.positionLabel = `Display${index + 1}`;
            });
        }
    }

    // Save current display configuration with position labels
    storageManager.saveDisplayConfig(sortedDisplays);

    // Return the display mapping for immediate use
    if (sortedDisplays.length === 1) {
        return { Primary: sortedDisplays[0] };
    } else {
        return sortedDisplays.reduce((acc, display) => {
            acc[display.positionLabel] = display;
            return acc;
        }, {} as Record<string, StoredDisplayConfig>);
    }
}