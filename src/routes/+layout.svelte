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
                    <div id="topLeftContent" class="paneContent">
                        {@render children()}
                    </div>
                </Resizable.Pane>
                <Resizable.Handle id="topLeftRightHandle" withHandle />
                <Resizable.Pane
                    id="topRight"
                    class="contentPane"
                    defaultSize={50}
                >
                    <div id="topRightContent" class="paneContent">
                        {@render children()}
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
                <Resizable.Pane
                    id="bottomLeft"
                    class="contentPane"
                    defaultSize={30}
                >
                    <div id="bottomLeftContent" class="paneContent">
                        {@render children()}
                    </div>
                </Resizable.Pane>
                <Resizable.Handle id="bottomLeftCenterHandle" withHandle />
                <Resizable.Pane
                    id="bottomCenter"
                    class="contentPane"
                    defaultSize={40}
                >
                    <div id="bottomCenterContent" class="paneContent">
                        {@render children()}
                    </div>
                </Resizable.Pane>
                <Resizable.Handle id="bottomCenterRightHandle" withHandle />
                <Resizable.Pane
                    id="bottomRight"
                    class="contentPane"
                    defaultSize={30}
                >
                    <div id="bottomRightContent" class="paneContent">
                        {@render children()}
                    </div>
                </Resizable.Pane>
            </Resizable.PaneGroup>
        </Resizable.Pane>
        <Resizable.Handle id="bottomFooterHandle" withHandle />
        <Resizable.Pane id="footer" class="contentPane" defaultSize={5}>
            <div id="footerContent" class="paneContent">
                {@render children()}
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
