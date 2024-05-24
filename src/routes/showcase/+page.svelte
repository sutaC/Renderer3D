<script lang="ts">
	import { EngineState } from '$lib/Engine/Engine';
	import type { ShapeNames } from '$lib/Engine/Shape';
	import { Showcase } from '$lib/Showcase';
	import { onMount, onDestroy } from 'svelte';

	let selected: string = 'cube';
	let size: number = 100;
	let color: string = '#ffffff';
	let rotateAll: boolean = true;
	let rotate = {
		x: true,
		y: true,
		z: true
	};

	let customObj = false;
	let rotation: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
	let position: { x: number; y: number; z: number } = { x: 0, y: 0, z: 10 };

	let engine: Showcase | undefined = undefined;

	let fps = 0;

	onMount(() => {
		const canvas = document.querySelector('canvas') as HTMLCanvasElement;

		// Sets canvas size
		const resolution: { width: number; height: number } = JSON.parse(
			localStorage.getItem('resolution') || '{"width":1280,"height":720}'
		);
		canvas.width = resolution.width;
		canvas.height = resolution.height;

		engine = new Showcase(canvas);

		let fpsIntervalId: number = 0;

		engine.onready = (eng) => {
			eng.run();
			// FPS page update
			fpsIntervalId = setInterval(() => (fps = eng.getFPS()), 1000);
		};
		engine.onfail = (error) => {
			console.error('Error ocurred in engine workflow: ', error);
			// Turn off FPS page update
			clearInterval(fpsIntervalId);
		};

		engine.addUpdateListener(() => {
			if (engine) {
				rotation = engine.shapeController.getRotation();
				rotation.x = Math.round(rotation.x);
				rotation.y = Math.round(rotation.y);
				rotation.z = Math.round(rotation.z);
			}
		});
	});

	onDestroy(() => {
		if (engine) {
			// Engine running
			if (engine.getState() === EngineState.running) {
				engine.stop();
			}
		}
	});

	$: rotate.x = rotate.y = rotate.z = rotateAll;
	$: if (engine && !customObj) {
		if (selected === 'custom') {
			engine.shapeController.unsetShape();
		} else {
			engine.shapeController.loadType(selected as ShapeNames);
		}
	}
	$: if (engine) engine.shapeController.setSize(size);
	$: if (engine) engine.shapeController.setColor(color);
	$: if (engine) engine.shapeController.setRotation(rotation);
	$: if (engine) engine.shapeController.setOrigin(position);
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
	<title>Showcase 3D</title>
</svelte:head>

<header>
	<a href="/">Return</a>
	<h1>Showcase 3D</h1>
	<small>FPS: {fps}</small>
</header>

<main>
	<section class="canvasContainer">
		<canvas></canvas>
	</section>

	<section class="controller">
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
				<option value="piramid">Piramid</option>
				<option value="cup">Cup</option>
				<option value="diamond">Diamond</option>
				<option value="teapot">Teapot</option>
				<option value="custom">Custom</option>
			</select>

			{#if selected === 'custom'}
				<p class="highlight">Custom object</p>

				<label for="inputObjFile">Obj file: </label>
				<input
					type="file"
					name="objFile"
					id="inputObjFile"
					accept=".obj"
					on:input={(e) => handleAddFile(e)}
				/>
			{/if}
		</div>

		<div class="field">
			<label for="inputSize">Size: </label>
			<input type="number" name="size" id="inputSize" bind:value={size} min="0" />
		</div>

		<div class="field">
			<label for="inputColor">Color: </label>
			<input type="color" name="color" id="inputColor" bind:value={color} />
		</div>

		<div class="wrap">
			<div class="field">
				<p class="highlight">Position</p>
				<ul>
					<li>
						<label for="inputPositionX">X: </label>
						<input type="number" id="inputPositionX" name="positionX" bind:value={position.x} />
					</li>
					<li>
						<label for="inputPositionY">Y: </label>
						<input type="number" id="inputPositionY" name="positionY" bind:value={position.y} />
					</li>
					<li>
						<label for="inputPositionZ">Z: </label>
						<input type="number" id="inputPositionZ" name="positionZ" bind:value={position.z} />
					</li>
				</ul>
			</div>

			<div class="field">
				<p class="highlight">Rotation</p>

				<div>
					<label for="inputRotate">Rotate: </label>
					<input type="checkbox" name="rotate" id="inputRotate" bind:checked={rotateAll} />
				</div>

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
							disabled={rotate.x}
						/>
						<input
							type="checkbox"
							name="rotateX"
							id="inputRotateX"
							bind:checked={rotate.x}
							disabled={rotateAll}
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
							disabled={rotate.y}
						/>
						<input
							type="checkbox"
							name="rotateY"
							id="inputRotateY"
							bind:checked={rotate.y}
							disabled={rotateAll}
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
							disabled={rotate.z}
						/>
						<input
							type="checkbox"
							name="rotateZ"
							id="inputRotateZ"
							bind:checked={rotate.z}
							disabled={rotateAll}
						/>
					</li>
				</ul>
			</div>
		</div>
	</section>
</main>

<style>
	header {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
	}

	header > * {
		width: 20ch;
		font-size: 0.9rem;
		color: black;
	}

	header > *:nth-child(1) {
		text-align: left;
	}
	header > *:nth-child(2) {
		text-align: center;
	}
	header > *:nth-child(3) {
		text-align: right;
	}

	h1 {
		margin: 0;
	}

	.highlight {
		font-weight: bold;
		font-size: 1.1em;
	}

	main {
		display: flex;
		justify-content: center;
		align-items: start;
		gap: 1rem;
		width: 80%;
		flex-wrap: wrap;
		margin: auto;
	}

	main > * {
		flex: 1;
		min-width: fit-content;
	}

	.canvasContainer {
		text-align: center;
	}

	.wrap {
		display: flex;
		justify-content: space-between;
		align-items: stretch;
		gap: 1rem;
	}

	.wrap > * {
		flex: 1;
	}

	.field {
		text-align: center;
		margin: 0.25rem 0;
		padding: 0.25rem;
		border: 1px solid #000;
	}

	.field ul {
		padding: 0;
	}

	.field li {
		list-style: none;
	}
</style>
