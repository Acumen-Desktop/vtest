<script lang="ts">
    import "../app.css";
    import TitleBar from "$lib/components/TitleBar.svelte";
    import * as Resizable from "$lib/components/ui/resizable/index.js";

    let { children } = $props();

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
    <Resizable.PaneGroup id="mainLayout" direction="vertical">
        <Resizable.Pane id="top" defaultSize={65}>
            <Resizable.PaneGroup id="topPaneGroup" direction="horizontal">
                <Resizable.Pane id="topLeft" defaultSize={50}>
                    <div class="flex h-[200px] items-center justify-center p-6">
                        <span class="font-semibold">One</span>
                    </div>
                </Resizable.Pane>
                <Resizable.Handle id="topLeftRightHandle" withHandle />
                <Resizable.Pane id="topRight" defaultSize={50}>
                    <div class="flex h-[200px] items-center justify-center p-6">
                        <span class="font-semibold">Two</span>
                    </div>
                </Resizable.Pane>
            </Resizable.PaneGroup>
        </Resizable.Pane>
        <Resizable.Handle id="topBottomHandle" withHandle />
        <Resizable.Pane id="bottom" defaultSize={30}>
            <Resizable.PaneGroup id="bottomPaneGroup" direction="horizontal">
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
                <Resizable.Handle id="bottomRightHandle" withHandle />
                <Resizable.Pane id="bottomRight" defaultSize={30}>
                    <div class="flex h-full items-center justify-center p-6">
                        <span class="font-semibold">Five</span>
                    </div>
                </Resizable.Pane>
            </Resizable.PaneGroup>
        </Resizable.Pane>
        <Resizable.Handle />
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
</style>
