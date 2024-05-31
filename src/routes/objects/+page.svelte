<script lang="ts">
	import Header from '$lib/Comonents/Header.svelte';
	import Footer from '$lib/Comonents/Footer.svelte';
	import Card from '$lib/Comonents/Card.svelte';
	import Canvas from '$lib/Comonents/Canvas.svelte';
	import Gamepad from '$lib/Comonents/Gamepad.svelte';
	import { EngineState } from '$lib/EngineUtils/Engine';
	import type { ShapeNames } from '$lib/EngineUtils/Shape';
	import { ObjectsShowcase } from '$lib/Showcases/ObjectsShowcase';
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

	let engine: ObjectsShowcase | undefined = undefined;
	let loading: boolean = true;
	let fps: number | null = 0;

	onMount(() => {
		const canvas = document.getElementById('cvs') as HTMLCanvasElement;

		// Sets canvas size
		const resolution: { width: number; height: number } = JSON.parse(
			localStorage.getItem('resolution') || '{"width":1280,"height":720}'
		);
		canvas.width = resolution.width;
		canvas.height = resolution.height;

		engine = new ObjectsShowcase(canvas);

		let fpsIntervalId: number = 0;

		engine.onready = (eng) => {
			eng.run();
			loading = false;
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
	<title>Renderer3D | Objects Showcase</title>
</svelte:head>

<Header style="primary" {fps}>Objects Showcase</Header>

<Gamepad style="primary">
	<main>
		<Canvas id="cvs" {loading} />
	</main>

	<section class="info">
		<Card style="primary">
			<span>Object:</span>
			<div>
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
			</div>
			{#if selected === 'custom'}
				<div>
					<label for="inputObjFile">Custom obj:</label>
					<input
						type="file"
						name="objFile"
						id="inputObjFile"
						accept=".obj"
						on:input={(e) => handleAddFile(e)}
					/>
				</div>
			{/if}
			<div>
				<label for="inputSize">Size: </label>
				<input type="number" name="size" id="inputSize" bind:value={size} min="0" />
			</div>
			<div>
				<label for="inputColor">Color: </label>
				<input type="color" name="color" id="inputColor" bind:value={color} />
			</div>
		</Card>

		<Card style="primary">
			<span>Position:</span>
			<div>
				<label for="inputPositionX">X: </label>
				<input type="number" id="inputPositionX" name="positionX" bind:value={position.x} />
			</div>
			<div>
				<label for="inputPositionY">Y: </label>
				<input type="number" id="inputPositionY" name="positionY" bind:value={position.y} />
			</div>
			<div>
				<label for="inputPositionZ">Z: </label>
				<input type="number" id="inputPositionZ" name="positionZ" bind:value={position.z} />
			</div>
		</Card>

		<Card style="primary">
			<span>Rotation:</span>

			<div>
				<label for="inputRotate">Auto all: </label>
				<input type="checkbox" name="rotate" id="inputRotate" bind:checked={rotateAll} />
			</div>

			<div>
				<div class="subfield">
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
				</div>
				<div class="subfield">
					<label for="inputRotateX">Auto X:</label>
					<input
						type="checkbox"
						name="rotateX"
						id="inputRotateX"
						bind:checked={rotate.x}
						disabled={rotateAll}
					/>
				</div>
			</div>
			<div>
				<div class="subfield">
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
				</div>
				<div class="subfield">
					<label for="inputRotateY">Auto Y: </label>
					<input
						type="checkbox"
						name="rotateY"
						id="inputRotateY"
						bind:checked={rotate.y}
						disabled={rotateAll}
					/>
				</div>
			</div>
			<div>
				<div class="subfield">
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
				</div>
				<div class="subfield">
					<label for="inputRotateZ">Auto Z:</label>
					<input
						type="checkbox"
						name="rotateZ"
						id="inputRotateZ"
						bind:checked={rotate.z}
						disabled={rotateAll}
					/>
				</div>
			</div>
		</Card>
	</section>

	<Footer />
</Gamepad>

<style>
	main {
		text-align: center;
	}

	.info {
		max-width: 40rem;
		margin: 1rem auto 2rem;
	}

	.info :global(> *) {
		margin-bottom: 1rem;
	}

	.subfield {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex: 1;
		padding-right: 0.5rem;
		border-right: 1px solid transparent;
		border-image: var(--grd-shade-primary) 1;
	}

	.subfield:last-child {
		padding-right: 0;
		padding-left: 0.5rem;
		border: none;
	}

	input[type='file'] {
		max-width: 33%;
	}
</style>
