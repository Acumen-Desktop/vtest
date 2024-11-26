<!-- Settings Page -->
<script lang="ts">
	import { onMount } from "svelte";

	onMount(() => {
		// console.log("Settings page mounted");
		// TODO: send notification back to main process, then to renderer of success
	});
</script>

<div class="settings-container">
	<h1>Settings</h1>
	<div class="settings-content">
		<!-- Add your settings content here -->
		<p>Settings page content will go here</p>
	</div>
</div>

<style>
	.settings-container {
		padding: 2rem;
		color: white;
	}

	.settings-content {
		margin-top: 1rem;
	}

	h1 {
		margin: 0;
		font-size: 2rem;
		font-weight: 600;
	}
</style>
