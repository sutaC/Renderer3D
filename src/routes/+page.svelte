<script lang="ts">
	import Engine from '$lib/Engine';
	import type { ShapeNames } from '$lib/Shape';
	import { onMount } from 'svelte';

	let selected: string = 'cube';
	let size: number = 100;

	let engine: Engine | undefined = undefined;

	onMount(() => {
		const canvas = document.querySelector('canvas') as HTMLCanvasElement;
		engine = new Engine(canvas);
		engine.run();
	});

	$: engine?.changeShape(selected as ShapeNames);
	$: engine?.changeSize(size);
</script>

<h1>3D renderer</h1>

<canvas width="500" height="500"></canvas>

<div class="field">
	<label for="selectShape">Shape: </label>
	<select name="shape" id="selecTshape" bind:value={selected}>
		<option value="cube">Cube</option>
		<option value="prism">Prism</option>
		<option value="prismSqB">Prism / square base</option>
	</select>
</div>

<div class="field">
	<label for="inputSize">Size: </label>
	<input type="number" name="size" id="inputSize" bind:value={size} min="0" />
</div>

<style>
	:global(html) {
		font-family: 'Courier New', Courier, monospace;
	}

	:global(body) {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	h1 {
		margin: 0.25rem;
	}

	canvas {
		max-width: calc(100vw - 1rem);
		aspect-ratio: 1;
		background: black;
	}

	.field {
		margin: 0.25rem 0;
	}
</style>
