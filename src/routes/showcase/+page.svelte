<script lang="ts">
	import type { ShapeNames } from '$lib/Engine/Shape';
	import Showcase from '$lib/Showcase';
	import { onMount, onDestroy } from 'svelte';

	let selected: string = 'cube';
	let size: number = 100;
	let color: string = '#ffffff';
	let rotate: boolean = true;

	let customObj = false;
	let rotation: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
	let position: { x: number; y: number; z: number } = { x: 0, y: 0, z: 300 };

	let showcase: Showcase | undefined = undefined;

	onMount(() => {
		const canvas = document.querySelector('canvas') as HTMLCanvasElement;
		showcase = new Showcase(canvas);
		showcase.onready = (shcs) => {
			shcs.run();
			console.log('Showcase is running!');
		};
		showcase.onfail = (error) => {
			console.error('Error ocurred while starting showcase: ', error);
		};
		showcase.addUpdateListener(() => {
			if (showcase) {
				rotation = showcase.shapeController.getRotation();
				rotation.x = Math.round(rotation.x);
				rotation.y = Math.round(rotation.y);
				rotation.z = Math.round(rotation.z);
			}
		});
	});

	onDestroy(() => {
		if (showcase) {
			// Engine running
			if (showcase.getState() === 3) {
				showcase.stop();
			}
		}
	});

	$: if (showcase && !customObj) {
		if (selected !== 'custom') {
			showcase.shapeController.loadType(selected as ShapeNames);
		}
	}
	$: if (showcase) showcase.shapeController.setSize(size);
	$: if (showcase) showcase.shapeController.setColor(color);
	$: if (showcase && !rotate) showcase.shapeController.setRotation(rotation);
	$: if (showcase) showcase.shapeController.setOrigin(position);
	$: if (showcase) showcase.rotate = rotate;

	const handleAddFile = async (event: Event) => {
		const target = event.target as HTMLInputElement;
		const [file] = target.files as FileList;
		if (!file) {
			console.error('No files was provided', file);
			return;
		}
		showcase?.shapeController.loadFile(file);
		target.value = '';
		customObj = true;
	};
</script>

<svelte:head>
	<title>Renderer 3D Showcase</title>
</svelte:head>

<a href="/" class="return">Return</a>

<h1>Renderer 3D Showcase</h1>

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
				<option value="prismSqB">Prism / square base</option>
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

				<p class="highlight">Sample objects</p>
				<ul class="sampleObjects">
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
					<input type="checkbox" name="rotate" id="inputRotate" bind:checked={rotate} />
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
			</div>
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

	.field .sampleObjects {
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		gap: 1rem;
	}
</style>
