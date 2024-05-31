<script lang="ts">
	import { onMount } from 'svelte';
	import { Engine, type Options } from '$lib/EngineUtils/Engine';
	import Header from '$lib/comonents/Header.svelte';
	import Footer from '$lib/comonents/Footer.svelte';
	import Button from '$lib/comonents/Button.svelte';
	import Card from '$lib/comonents/Card.svelte';

	let options: Options = Engine.defaultOptions();

	interface Resolution {
		width: number;
		height: number;
	}

	let resolutionSign: string = '1280x720';
	let joistick: boolean = false;
	let showFPS: boolean = false;

	const updateResolution = () => {
		if (resolutionSign.length === 0) return;
		const res = resolutionSign.split('x');
		const width = Number(res[0]);
		const height = Number(res[1]);
		const resolution: Resolution = { width, height };
		const json = JSON.stringify(resolution);
		localStorage.setItem('resolution', json);
	};

	const updateJoistick = () => {
		localStorage.setItem('joistick', JSON.stringify(joistick));
	};

	const updateShowFPS = () => {
		localStorage.setItem('showFPS', JSON.stringify(showFPS));
	};

	const reset = () => {
		// Values
		options = Engine.defaultOptions();
		resolutionSign = '1280x720';
		joistick = false;
		showFPS = false;
		// Update
		Engine.saveOptions(options);
		updateResolution();
		updateJoistick();
		updateShowFPS();
	};

	onMount(() => {
		// Load engine options
		const svd = Engine.loadOptions();
		if (svd) options = svd;
		Engine.saveOptions(options);

		// Load resolution
		const resolutionJson = localStorage.getItem('resolution');
		if (resolutionJson) {
			const sres: Resolution = JSON.parse(resolutionJson);
			resolutionSign = `${sres.width}x${sres.height}`;
		} else {
			updateResolution();
		}

		// Load joistick
		const joistickJson = localStorage.getItem('joistick');
		if (joistickJson) {
			joistick = JSON.parse(joistickJson);
		} else {
			updateJoistick();
		}

		// Load showFPS
		const showFPSJson = localStorage.getItem('showFPS');
		if (showFPSJson) {
			showFPS = JSON.parse(showFPSJson);
		} else {
			updateShowFPS();
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
				<label for="inputJoistick">Joistcik: </label>
				<input
					type="checkbox"
					name="joistick"
					id="inputJoistick"
					bind:checked={joistick}
					on:change={updateJoistick}
				/>
			</div>
		</Card>
	</section>

	<section>
		<h2>Engine</h2>
		<Card style="accent">
			<div>
				<label for="inputShowFps">Show FPS: </label>
				<input
					type="checkbox"
					name="showFps"
					id="inputShowFps"
					bind:checked={showFPS}
					on:change={updateShowFPS}
				/>
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
