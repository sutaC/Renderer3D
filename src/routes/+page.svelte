<script lang="ts">
	import Engine from '$lib/Engine';
	import { onMount } from 'svelte';
	onMount(() => {
		const canvas = document.querySelector('canvas') as HTMLCanvasElement;
		const engine = new Engine(canvas);
		engine.run();
	});
</script>

<h1>3D renderer</h1>

<canvas width="500" height="500"></canvas>

<style>
	:global(body) {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	canvas {
		background: black;
	}
</style>
