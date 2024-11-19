import { screen as electronScreen } from "electron";

export function initDisplayData() {

    let displays: { label: string; workArea: Electron.Rectangle; }[] = electronScreen.getAllDisplays().map(({ label, workArea }) => ({ label, workArea }));
    let primaryDisplay = displays.find(display => display.workArea.x < 100 && display.workArea.y < 100); // Top corner is (0, 0) less menus etc.
    let sortedDisplays: { label: string; workArea: Electron.Rectangle; }[] = displays.sort((a, b) => a.workArea.x - b.workArea.x);

    if (sortedDisplays.length === 1) {
        return { Primary: primaryDisplay };
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
        // isDisplayRow = false; for testing
        if (isDisplayRow) {
            switch (sortedDisplays.length) {
                case 2:
                    return { Left: sortedDisplays[0], Right: sortedDisplays[1] };
                case 3:
                    return { Left: sortedDisplays[0], Center: sortedDisplays[1], Right: sortedDisplays[2] };
                case 4:
                    return { FarLeft: sortedDisplays[0], Left: sortedDisplays[1], Right: sortedDisplays[2], FarRight: sortedDisplays[3] };
                case 5:
                    return { FarLeft: sortedDisplays[0], Left: sortedDisplays[1], Center: sortedDisplays[2], Right: sortedDisplays[3], FarRight: sortedDisplays[4] };

                default:
                    // For more than 4 displays, use numeric naming
                    return sortedDisplays.reduce((acc, display, index) => {
                        acc[`Display${index + 1}`] = display;
                        return acc;
                    }, {} as Record<string, typeof sortedDisplays[0]>);
            }
        } else {
            // TODO: Add support for stacked and grid displays
            // I don't have a stacked or grid display to test with, so this is untested.
            throw new Error(`Stacked and grid displays are not supported yet. Displays are: ${JSON.stringify(sortedDisplays)}`);
        }
    }
}