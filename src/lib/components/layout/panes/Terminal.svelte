<script lang="ts">
  import { onMount } from "svelte";
  import { Terminal as XTerm } from "xterm";
  import { FitAddon } from "xterm-addon-fit";
  import "xterm/css/xterm.css";

  let terminalElement: HTMLElement = $state();
  let terminal: XTerm;
  let fitAddon: FitAddon;

  interface Props {
    initialText?: string;
  }

  let { initialText = "$ Welcome to the terminal\n" }: Props = $props();

  onMount(() => {
    terminal = new XTerm({
      theme: {
        background: "#1e1e1e",
        foreground: "#d4d4d4",
        cursor: "#d4d4d4",
        cursorAccent: "#1e1e1e",
        selectionBackground: "rgba(255, 255, 255, 0.3)",
        black: "#1e1e1e",
        red: "#f44747",
        green: "#6a9955",
        yellow: "#d7ba7d",
        blue: "#569cd6",
        magenta: "#c586c0",
        cyan: "#4ec9b0",
        white: "#d4d4d4",
        brightBlack: "#808080",
        brightRed: "#f44747",
        brightGreen: "#6a9955",
        brightYellow: "#d7ba7d",
        brightBlue: "#569cd6",
        brightMagenta: "#c586c0",
        brightCyan: "#4ec9b0",
        brightWhite: "#d4d4d4",
      },
      fontFamily: "JetBrains Mono, monospace",
      fontSize: 14,
      lineHeight: 1.2,
      cursorBlink: true,
    });

    fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    terminal.open(terminalElement);
    fitAddon.fit();

    terminal.write(initialText);

    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit();
    });

    resizeObserver.observe(terminalElement);

    return () => {
      resizeObserver.disconnect();
      terminal.dispose();
    };
  });

  export function write(text: string) {
    if (terminal) {
      terminal.write(text);
    }
  }

  export function clear() {
    if (terminal) {
      terminal.clear();
    }
  }
</script>

<div class="terminal-container" bind:this={terminalElement}></div>

<style lang="postcss">
  .terminal-container {
    @apply h-full bg-[#1e1e1e] p-2;
  }

  :global(.terminal-container .xterm) {
    @apply h-full;
  }
</style>
