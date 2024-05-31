<script lang="ts">
	import { onMount } from 'svelte';
	import { Engine, type Options } from '$lib/EngineUtils/Engine';
	import Header from '$lib/Comonents/Header.svelte';
	import Footer from '$lib/Comonents/Footer.svelte';
	import Button from '$lib/Comonents/Button.svelte';
	import Card from '$lib/Comonents/Card.svelte';

	let options: Options = Engine.defaultOptions();

	interface Resolution {
		width: number;
		height: number;
	}

	let resolutionSign = '1280x720';

	const updateResolution = () => {
		if (resolutionSign.length === 0) return;
		const res = resolutionSign.split('x');
		const width = Number(res[0]);
		const height = Number(res[1]);
		const resolution: Resolution = { width, height };
		const json = JSON.stringify(resolution);
		localStorage.setItem('resolution', json);
	};

	const reset = () => {
		// Values
		options = Engine.defaultOptions();
		resolutionSign = '1280x720';
		// Update
		Engine.saveOptions(options);
		updateResolution();
	};

	onMount(() => {
		// Load engine options
		const svd = Engine.loadOptions();
		if (svd) options = svd;
		Engine.saveOptions(options);

		// Load resolution
		const json = localStorage.getItem('resolution');
		if (json) {
			const sres: Resolution = JSON.parse(json);
			resolutionSign = `${sres.width}x${sres.height}`;
		} else {
			updateResolution();
		}
	});
</script>

<svelte:head>
	<title>Renderer3D | Options</title>
</svelte:head>

<Header style="accent">Options</Header>

<main>
	<section>
		<h2>Input</h2>
		<Card style="accent">
			<div>
				<!-- TODO: add functionality -->
				<label for="inputJoistick">Show FPS: </label>
				<input type="checkbox" name="joistick" id="inputJoistick" />
			</div>
		</Card>
	</section>

	<section>
		<h2>Engine</h2>
		<Card style="accent">
			<div>
				<!-- TODO: add functionality -->
				<label for="inputShowFps">Show FPS: </label>
				<input type="checkbox" name="showFps" id="inputShowFps" />
			</div>
			<div>
				<label for="inputFpsLimit">FPS limit: </label>
				<select
					name="fpsLimit"
					id="inputFpsLimit"
					bind:value={options.engine.fpsLimit}
					on:change={() => Engine.saveOptions(options)}
				>
					<option value={30}>30</option>
					<option value={60}>60</option>
					<option value={120}>120</option>
					<option value={0}>None</option>
				</select>
			</div>
		</Card>
	</section>

	<section>
		<h2>Graphics</h2>
		<Card style="accent">
			<div>
				<label for="inputFov">FoV: </label>
				<input
					type="number"
					min="0"
					max="360"
					name="fov"
					id="inputFov"
					bind:value={options.graphics.fov}
					on:change={() => Engine.saveOptions(options)}
				/>
			</div>
			<div>
				<label for="inputResolution">Resolution: </label>
				<select
					name="resolution"
					id="inputResolution"
					bind:value={resolutionSign}
					on:change={updateResolution}
				>
					<option value="640x480">640x480</option>
					<option value="800x600">800x600</option>
					<option value="1024x768">1024x768</option>
					<option value="1280x720">1280x720</option>
					<option value="1366x768">1366x768</option>
					<option value="1920x1080">1920x1080</option>
					<option value="2560x1440">2560x1440</option>
				</select>
			</div>
		</Card>
	</section>

	<section>
		<h2>Debug</h2>
		<Card style="accent">
			<div>
				<label for="inputLogging">Logging: </label>
				<input
					type="checkbox"
					name="logging"
					id="inputLogging"
					bind:value={resolutionSign}
					on:change={updateResolution}
				/>
			</div>
			<div>
				<label for="inputPoints">Points: </label>
				<input
					type="checkbox"
					name="points"
					id="inputPoints"
					bind:checked={options.renderer.points}
					on:change={() => Engine.saveOptions(options)}
				/>
			</div>
			<div>
				<label for="inputClipping">Clipping: </label>
				<input
					type="checkbox"
					name="clipping"
					id="inputClipping"
					bind:checked={options.renderer.clipping}
					on:change={() => Engine.saveOptions(options)}
				/>
			</div>
			<div>
				<label for="inputWirefarme">Wireframe: </label>
				<input
					type="checkbox"
					name="wireframe"
					id="inputWirefarme"
					bind:checked={options.renderer.wireframe}
					on:change={() => Engine.saveOptions(options)}
				/>
			</div>
		</Card>
	</section>

	<section>
		<Button style="accent" on:click={reset}>Reset</Button>
	</section>
</main>

<Footer />

<style>
	main {
		width: 80%;
		margin: auto;
	}

	section {
		text-align: center;
		margin: 2rem auto;
		max-width: 30rem;
	}

	h2 {
		font-size: 1.728rem;
		margin: 0 0 1rem;
		text-shadow: 0 4px 4px hsla(0, 0%, 0%, 0.2);
	}
</style>
