<script lang="ts">
	import { onMount } from 'svelte';
	import { Engine, type Options } from '$lib/EngineUtils/Engine';
	import Header from '$lib/Comonents/Header.svelte';

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
	<div class="field">
		<p class="highlight">Engine</p>

		<ul>
			<li>
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
			</li>
		</ul>
	</div>

	<div class="field">
		<p class="highlight">Graphics</p>

		<ul>
			<li>
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
			</li>

			<li>
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
			</li>
		</ul>
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
					bind:value={resolutionSign}
					on:change={updateResolution}
				/>
			</li>
			<li>
				<label for="inputPoints">Points: </label>

				<input
					type="checkbox"
					name="points"
					id="inputPoints"
					bind:checked={options.renderer.points}
					on:change={() => Engine.saveOptions(options)}
				/>
			</li>
			<li>
				<label for="inputClipping">Clipping: </label>
				<input
					type="checkbox"
					name="clipping"
					id="inputClipping"
					bind:checked={options.renderer.clipping}
					on:change={() => Engine.saveOptions(options)}
				/>
			</li>
			<li>
				<label for="inputWirefarme">Wireframe: </label>
				<input
					type="checkbox"
					name="wireframe"
					id="inputWirefarme"
					bind:checked={options.renderer.wireframe}
					on:change={() => Engine.saveOptions(options)}
				/>
			</li>
		</ul>
	</div>

	<div class="field">
		<button type="reset" on:click={reset}>Reset</button>
	</div>
</main>

<style>
	.highlight {
		font-weight: bold;
		font-size: 1.1em;
	}

	main {
		margin: auto;
		width: 80%;
	}

	main > * {
		flex: 1;
		min-width: fit-content;
	}

	.wrap {
		display: flex;
		justify-content: space-between;
		align-items: stretch;
		flex-wrap: wrap;
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
