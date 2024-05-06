<script lang="ts">
	import Engine from '$lib/Engine';
	import type { ShapeNames } from '$lib/Shape';
	import { onMount } from 'svelte';

	let selected: string = 'cube';
	let size: number = 100;
	let originZ: number = 300;
	let color: string = '#ffffff';

	let engine: Engine | undefined = undefined;

	onMount(() => {
		const canvas = document.querySelector('canvas') as HTMLCanvasElement;
		engine = new Engine(canvas);
		engine.run();
	});

	$: engine?.shapeController.type(selected as ShapeNames);
	$: engine?.shapeController.size(size);
	$: engine?.shapeController.originZ(originZ);
	$: engine?.shapeController.color(color);

	const handleAddFile = async (event: Event) => {
		const target = event.target as HTMLInputElement;
		const [file] = target.files as FileList;
		if (!file) {
			console.error('No files was provided', file);
			return;
		}
		engine?.shapeController.file(file);
		target.value = '';
	};
</script>

<svelte:head>
	<title>Renderer 3D</title>
</svelte:head>

<h1>Renderer 3D</h1>

<canvas width="500" height="500"></canvas>

<div class="controller">
	<div class="field">
		<label for="selectShape">Shape: </label>
		<select name="shape" id="selectShape" bind:value={selected}>
			<option value="cube">Cube</option>
			<option value="prism">Prism</option>
			<option value="prismSqB">Prism / square base</option>
		</select>
	</div>

	<div class="field">
		<label for="inputSize">Size: </label>
		<input type="number" name="size" id="inputSize" bind:value={size} min="0" />
	</div>

	<div class="field">
		<label for="inputOriginZ">Distance: </label>
		<input type="number" name="originZ" id="inputOriginZ" bind:value={originZ} />
	</div>

	<div class="field">
		<label for="inputColor">Color: </label>
		<input type="color" name="color" id="inputColor" bind:value={color} />
	</div>

	<div class="field">
		<label for="inputObjFile">Obj file: </label>
		<input
			type="file"
			name="objFile"
			id="inputObjFile"
			accept=".obj"
			on:input={(e) => handleAddFile(e)}
		/>
	</div>
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

	.controller {
		margin: 1rem 0;
	}

	.field {
		margin: 0.25rem 0;
	}
</style>
