<script lang="ts">
	import Engine from '$lib/Engine';
	import type { ShapeNames } from '$lib/Shape';
	import { onMount } from 'svelte';

	let selected: string = 'cube';
	let size: number = 100;
	let originZ: number = 300;
	let color: string = '#ffffff';
	let rotate: boolean = true;

	let customObj = false;
	let rotation: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };

	let engine: Engine | undefined = undefined;

	onMount(() => {
		const canvas = document.querySelector('canvas') as HTMLCanvasElement;
		engine = new Engine(canvas);
		engine.run();
		engine.addListener(() => {
			if (engine) rotation = engine.shapeController.getRotation();
		});
	});

	$: if (engine && !customObj) engine.shapeController.loadType(selected as ShapeNames);
	$: if (engine) engine.shapeController.setSize(size);
	$: if (engine) engine.shapeController.setOriginZ(originZ);
	$: if (engine) engine.shapeController.setColor(color);
	$: if (engine && !rotate) engine.shapeController.setRotation(rotation);
	$: if (engine) engine.rotate = rotate;

	const handleAddFile = async (event: Event) => {
		const target = event.target as HTMLInputElement;
		const [file] = target.files as FileList;
		if (!file) {
			console.error('No files was provided', file);
			return;
		}
		engine?.shapeController.loadFile(file);
		target.value = '';
		customObj = true;
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
		<select
			name="shape"
			id="selectShape"
			bind:value={selected}
			on:input={() => (customObj = false)}
		>
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
		<p>Rotation</p>
		<ul>
			<li>
				<label for="inputRotationX">X: </label>
				<input
					type="number"
					id="inputRotationX"
					name="rotationX"
					min="-360"
					max="360"
					bind:value={rotation.x}
					disabled={rotate}
				/>
			</li>
			<li>
				<label for="inputRotationY">Y: </label>
				<input
					type="number"
					id="inputRotationY"
					name="rotationY"
					min="-360"
					max="360"
					bind:value={rotation.y}
					disabled={rotate}
				/>
			</li>
			<li>
				<label for="inputRotationZ">Z: </label>
				<input
					type="number"
					id="inputRotationZ"
					name="rotationZ"
					min="-360"
					max="360"
					bind:value={rotation.z}
					disabled={rotate}
				/>
			</li>
		</ul>
		<label for="inputRotate">Rotate: </label>
		<input type="checkbox" name="rotate" id="inputRotate" bind:checked={rotate} />
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

	<div class="field">
		<p><b>Sample objects</b></p>
		<ul>
			<li>
				<a href="/sample-objects/cube.obj">Cube</a>
			</li>
			<li>
				<a href="/sample-objects/diamind.obj">Diamond</a>
			</li>
			<li>
				<a href="/sample-objects/cup.obj">Cup</a>
			</li>
			<li>
				<a href="/sample-objects/teapot.obj">Teapot</a>
			</li>
		</ul>
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
		padding: 0.25rem;
		border: 1px solid #000;
	}
</style>
