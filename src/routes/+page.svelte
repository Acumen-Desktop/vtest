<script lang="ts">
	import electronLogo from "$lib/assets/electron.svg";
	import svelteLogo from "$lib/assets/svelteKit.svg";
	import typescriptLogo from "$lib/assets/typescript.svg";
	import viteLogo from "$lib/assets/vite.svg";
	import tailwindcssLogo from "$lib/assets/tailwindcss.svg";
	import Counter from "$lib/components/Counter.svelte";
	import { onMount } from "svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import Mail from "lucide-svelte/icons/mail";

	let isSettingsVisible = false;

	onMount(() => {
		// Listen for window visibility updates
		window.api.on(
			"windowVisibility",
			(data: { windowId: string; isVisible: boolean }) => {
				if (data.windowId === "settings") {
					isSettingsVisible = data.isVisible;
					console.log(
						"Settings visibility updated:",
						isSettingsVisible,
					);
				}
			},
		);

		window.api.on("test-console-log", (message: any) => {
			console.log(
				"Line 26 - +page.svelte - Received test-console-log:",
				message.displayData,
			);
		});

		window.api.on("fromMain", (data: any) => {
			if (data.action === "log-data") {
				console.error(
					"Line 31 - +page.svelte - Display Error:",
					data.error,
				);
			}
		});
	});

	async function toggleSettings() {
		try {
			const result = await window.api.invoke("toggleWindow", {
				windowId: "settings",
			});

			if (result.success) {
				isSettingsVisible = result.isVisible;
			} else {
				console.error(
					"Line 41 - +page.svelte - Failed to toggle settings window:",
					result.error,
				);
			}
		} catch (error) {
			console.error("Line 46 - +page.svelte - toggling settings:", error);
		}
	}
</script>

<div class="max-w-7xl mx-auto px-16 py-20">
	<div class="flex justify-center mb-8">
		<Button onclick={toggleSettings}>
			{isSettingsVisible ? "Hide" : "Show"} Settings
		</Button>
		<Button
			onclick={() => console.log("Line 67 - +page.svelte - clicked: ")}
		>
			<Mail class="mr-2 size-4" />
			Login with Email
		</Button>
	</div>
	<div
		class="flex gap-16 flex-wrap justify-center *:shrink-0 *:transition *:duration-500 [&>*:hover]:duration-100"
	>
		<a
			id="vite"
			href="https://vitejs.dev"
			target="_blank"
			rel="noreferrer"
			class="hover:drop-shadow-[0_0_2em_#646cffaa]"
		>
			<img src={viteLogo} class="w-24 h-24" alt="Vite Logo" />
		</a>
		<a
			id="typescript"
			href="https://www.typescriptlang.org"
			target="_blank"
			rel="noreferrer"
			class="hover:drop-shadow-[0_0_2em_#3178c6aa]"
		>
			<img src={typescriptLogo} class="w-24 h-24" alt="Typescript Logo" />
		</a>
		<a
			id="electronForge"
			href="https://www.electronforge.io/"
			target="_blank"
			rel="noreferrer"
			class="hover:drop-shadow-[0_0_2em_#2f3242aa]"
		>
			<img
				src={electronLogo}
				class="w-24 h-24"
				alt="Electron Forge Logo"
			/>
		</a>
		<a
			id="svelteKit"
			href="https://kit.svelte.dev/"
			target="_blank"
			rel="noreferrer"
			class="hover:drop-shadow-[0_0_2em_#ff3e00aa]"
		>
			<img src={svelteLogo} class="w-24 h-24" alt="Svelte Kit Logo" />
		</a>
		<a
			id="tailwind"
			href="https://tailwindcss.com/"
			target="_blank"
			rel="noreferrer"
			class="hover:drop-shadow-[0_0_2em_#19b5baaa]"
		>
			<img
				src={tailwindcssLogo}
				class="w-24 h-24"
				alt="Tailwind CSS Logo"
			/>
		</a>
	</div>
	<p class="mt-16 text-gray-600 dark:text-gray-400 text-center">
		Click on the logos to learn more
	</p>
	<h1 class="text-center text-5xl leading-tight *:transition *:duration-500">
		<span
			class="[*:has(#vite:hover)~*>&]:duration-100 [*:has(#vite:hover)~*>&]:text-indigo-500"
			>Vite</span
		>
		+
		<span
			class="[*:has(#typescript:hover)~*>&]:duration-100 [*:has(#typescript:hover)~*>&]:text-blue-500"
			>Typescript</span
		>
		+
		<span
			class="[*:has(#electronForge:hover)~*>&]:duration-100 [*:has(#electronForge:hover)~*>&]:text-slate-500"
			>Electron Forge</span
		>
		+
		<span
			class="[*:has(#svelteKit:hover)~*>&]:duration-100 [*:has(#svelteKit:hover)~*>&]:text-orange-500"
			>SvelteKit</span
		>
		+
		<span
			class="[*:has(#tailwind:hover)~*>&]:duration-100 [*:has(#tailwind:hover)~*>&]:text-sky-500"
			>Tailwind CSS</span
		>
	</h1>
	<div class="m-auto w-fit mt-16">
		<Counter />
	</div>
	<div class="m-auto w-fit mt-16">
		<a href="/test">Test Page</a>
	</div>
</div>
