<script lang="ts">
    import "../app.css";
    import TitleBar from "$lib/components/TitleBar.svelte";
    import * as Resizable from "$lib/components/ui/resizable/index.js";
    import { handleLayoutChange } from "$lib/utils/paneLayoutManager";

    let { children } = $props();

    // Create a custom storage interface that uses localStorage
    const paneStorage = {
        getItem: (key: string) => {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        },
        setItem: (key: string, value: any) => {
            localStorage.setItem(key, JSON.stringify(value));
        },
    };

    // Handle layout changes by passing to our pane layout manager
    function onLayoutChange(layoutId: string, handle?: string) {
        return (layout: number[]) => {
            handleLayoutChange(layoutId, layout, handle);
        };
    }

    $effect(() => {
        // if (preferredTheme.theme === "dark")
        // 	window.setTitleBarColors("#374151", "#f8fafc");
        // else window.setTitleBarColors("#e5e7eb", "#020617");
    });
</script>

<div
    id="mainLayout"
    class="overflow-hidden bg-gray-700 text-slate-950 dark:from-zinc-800 dark:to-zinc-900 dark:text-slate-50"
>
    <TitleBar />
    <!-- {@render children()} -->
    <Resizable.PaneGroup
        id="mainPaneGroup"
        direction="vertical"
        autoSaveId="top-bottom-footer-layout"
        storage={paneStorage}
        class="paneContainer"
        onLayoutChange={onLayoutChange(
            "top-bottom-footer-layout",
            "topBottomHandle",
        )}
    >
        <Resizable.Pane id="top" defaultSize={65}>
            <Resizable.PaneGroup
                id="topPaneGroup"
                direction="horizontal"
                autoSaveId="topLeft-topRight-layout"
                storage={paneStorage}
                class="paneContainer"
                onLayoutChange={onLayoutChange(
                    "topLeft-topRight-layout",
                    "topLeftRightHandle",
                )}
            >
                <Resizable.Pane
                    id="topLeft"
                    class="contentPane"
                    defaultSize={50}
                >
                    <div class="paneContent">
                        {@render children()}
                    </div>
                </Resizable.Pane>
                <!-- <Resizable.Handle id="topLeftRightHandle" withHandle onDraggingChange={updatePaneLayout("topLeft", "topRight")} /> -->

                <!-- onDraggingChange?: (isDragging: boolean) => void; -->

                <Resizable.Handle
                    id="topLeftRightHandle"
                    withHandle
                    onDraggingChange={(isDragging) =>
                        console.log(
                            "Line 74 - +layout.svelte - onDraggingChange",
                            isDragging,
                        )}
                />
                <Resizable.Pane id="topRight" defaultSize={50}>
                    <div class="flex h-full items-center justify-center p-6">
                        <span class="font-semibold">Two</span>
                    </div>
                </Resizable.Pane>
            </Resizable.PaneGroup>
        </Resizable.Pane>
        <Resizable.Handle id="topBottomHandle" withHandle />
        <Resizable.Pane id="bottom" defaultSize={30}>
            <Resizable.PaneGroup
                id="bottomPaneGroup"
                direction="horizontal"
                autoSaveId="bottomLeft-bottomCenter-bottomRight-layout"
                storage={paneStorage}
                class="paneContainer"
                onLayoutChange={(percentages) => {
                    // Get the currently active handle from the event target
                    const activeHandle = document.activeElement?.id;
                    onLayoutChange(
                        "bottomLeft-bottomCenter-bottomRight-layout",
                        activeHandle,
                    )(percentages);
                }}
            >
                <Resizable.Pane id="bottomLeft" defaultSize={30}>
                    <div class="flex h-full items-center justify-center p-6">
                        <span class="font-semibold">Three</span>
                    </div>
                </Resizable.Pane>
                <Resizable.Handle id="bottomLeftCenterHandle" withHandle />
                <Resizable.Pane id="bottomCenter" defaultSize={40}>
                    <div class="flex h-full items-center justify-center p-6">
                        <span class="font-semibold">Four</span>
                    </div>
                </Resizable.Pane>
                <Resizable.Handle id="bottomCenterRightHandle" withHandle />
                <Resizable.Pane id="bottomRight" defaultSize={30}>
                    <div class="flex h-full items-center justify-center p-6">
                        <span class="font-semibold">Five</span>
                    </div>
                </Resizable.Pane>
            </Resizable.PaneGroup>
        </Resizable.Pane>
        <Resizable.Handle id="bottomFooterHandle" withHandle />
        <Resizable.Pane id="footer" defaultSize={5}>
            <div class="flex h-full items-center justify-center p-6">
                <span class="font-semibold">Six</span>
            </div>
        </Resizable.Pane>
    </Resizable.PaneGroup>
</div>

<style>
    #mainLayout {
        position: absolute;
        top: 1px;
        left: 1px;
        right: 1px;
        bottom: 1px;
    }
    :global(.contentPane) {
        background-color: #4d4b4b;
        border-radius: 2px;
        height: calc(100% - 4px);
        min-height: 0;
        position: relative;
        margin: 2px;
    }
    :global(.paneContent) {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: auto;
    }
    :global(.contentPane > *) {
        height: 100%;
        min-height: min-content;
    }
</style>
