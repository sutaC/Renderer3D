<script lang="ts">
	import { EngineState } from '$lib/Engine/Engine';
	import type { ShapeNames } from '$lib/Engine/Shape';
	import { Showcase } from '$lib/Showcase';
	import { browser } from '$app/environment';
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
	let debug = {
		wireframe: false,
		points: false,
		logging: false,
		clipping: false
	};

	let customObj = false;
	let rotation: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
	let position: { x: number; y: number; z: number } = { x: 0, y: 0, z: 300 };

	let engine: Showcase | undefined = undefined;

	enum StorageKeys {
		'debug' = 'dbg'
	}
	const loadStorage = () => {
		if (!browser) return;
		const debugData = localStorage.getItem(StorageKeys.debug);
		if (!debugData) return;
		debug = JSON.parse(debugData);
	};
	const saveStorage = () => {
		if (!browser) return;
		const debugData = JSON.stringify(debug);
		localStorage.setItem(StorageKeys.debug, debugData);
	};

	onMount(() => {
		const canvas = document.querySelector('canvas') as HTMLCanvasElement;

		// Load debug options
		loadStorage();
		saveStorage();

		engine = new Showcase(canvas);
		engine.onready = (shcs) => {
			shcs.run();
		};
		engine.onfail = (error) => {
			console.error('Error ocurred while starting engine: ', error);
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
	$: if (engine) engine.debugOptions.logging = debug.logging;
	$: if (engine?.debugOptions.renderer) engine.debugOptions.renderer.clipping = debug.clipping;
	$: if (engine?.debugOptions.renderer) engine.debugOptions.renderer.points = debug.points;
	$: if (engine?.debugOptions.renderer) engine.debugOptions.renderer.wireframe = debug.wireframe;

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
	<title>Renderer 3D engine</title>
</svelte:head>

<a href="/" class="return">Return</a>

<h1>Renderer 3D engine</h1>

<main>
	<section class="canvasContainer">
		<canvas width="500" height="500"></canvas>
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

		<div class="field">
			<p class="highlight">Debug</p>
			<ul class="wrap">
				<li>
					<label for="inputLogging">Logging: </label>
					<input
						type="checkbox"
						name="logging"
						id="inputLogging"
						bind:checked={debug.logging}
						on:change={saveStorage}
					/>
				</li>
				<li>
					<label for="inputPoints">Points: </label>

					<input
						type="checkbox"
						name="points"
						id="inputPoints"
						bind:checked={debug.points}
						on:change={saveStorage}
					/>
				</li>
				<li>
					<label for="inputClipping">Cipping: </label>
					<input
						type="checkbox"
						name="cipping"
						id="inputClipping"
						bind:checked={debug.clipping}
						on:change={saveStorage}
					/>
				</li>
				<li>
					<label for="inputWirefarme">Wireframe: </label>
					<input
						type="checkbox"
						name="wireframe"
						id="inputWirefarme"
						bind:checked={debug.wireframe}
						on:change={saveStorage}
					/>
				</li>
			</ul>
		</div>
	</section>
</main>

<style>
	.return {
		position: absolute;
		right: 1rem;
		top: 1rem;
		color: black;
	}

	h1 {
		margin: 0 0 1rem;
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
