<script lang="ts">
	import { onMount } from 'svelte';
	import { Engine, type Options } from '$lib/Engine/Engine';

	let options: Options = Engine.defaultOptions();

	const reset = () => {
		options = Engine.defaultOptions();
		Engine.saveOptions(options);
	};

	onMount(() => {
		// Load engine options
		const svd = Engine.loadOptions();
		if (svd) options = svd;
		Engine.saveOptions(options);
	});
</script>

<a href="/" class="return">Return</a>

<h1>Options</h1>

<main>
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
					bind:checked={options.engine.logging}
					on:change={() => Engine.saveOptions(options)}
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
				<label for="inputClipping">Cipping: </label>
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
		<button type="reset" on:click={reset}>Reset to default</button>
	</div>
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
