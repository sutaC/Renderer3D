<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { CameraShowcase } from '$lib/Showcases/CameraShowcase';
	import { EngineState } from '$lib/EngineUtils/Engine';

	let engine: CameraShowcase | undefined = undefined;

	let keyboard: boolean = true;
	let fps: number = 0;

	onMount(() => {
		const canvas = document.querySelector('canvas') as HTMLCanvasElement;

		// Sets canvas size
		const resolution: { width: number; height: number } = JSON.parse(
			localStorage.getItem('resolution') || '{"width":1280,"height":720}'
		);
		canvas.width = resolution.width;
		canvas.height = resolution.height;

		engine = new CameraShowcase(canvas);

		engine.addAlternativeButton(document.querySelector('#lookleft') as HTMLButtonElement, 'a');
		engine.addAlternativeButton(document.querySelector('#forward') as HTMLButtonElement, 'w');
		engine.addAlternativeButton(document.querySelector('#lookright') as HTMLButtonElement, 'd');
		engine.addAlternativeButton(document.querySelector('#backward') as HTMLButtonElement, 's');
		engine.addAlternativeButton(document.querySelector('#up') as HTMLButtonElement, 'ArrowUp');
		engine.addAlternativeButton(document.querySelector('#down') as HTMLButtonElement, 'ArrowDown');
		engine.addAlternativeButton(document.querySelector('#left') as HTMLButtonElement, 'ArrowLeft');
		engine.addAlternativeButton(
			document.querySelector('#right') as HTMLButtonElement,
			'ArrowRight'
		);

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
	});

	onDestroy(() => {
		if (engine) {
			// Engine running
			if (engine.getState() === EngineState.running) {
				engine.stop();
			}
		}
	});
</script>

<svelte:head>
	<title>Game 3D</title>
</svelte:head>

<header>
	<a href="/">Return</a>
	<h1>Game 3D</h1>
	<small>FPS: {fps}</small>
</header>

<main>
	<canvas></canvas>
</main>

<section class="controll">
	<div class="keyboardSwitch">
		<label for="inputKeyboardSwitch">Keyboard: </label>
		<input type="checkbox" name="keyboardSwitch" id="inputKeyboardSwitch" bind:checked={keyboard} />
	</div>

	<p class="controlls" class:invisible={!keyboard}>
		<span>W-S : moving forward-backward</span>
		<span>A-D : looking left-right</span>
		<span>ArrowUp-ArrowDown : moving up-down</span>
		<span>ArrowLeft-ArrowRight : moving left-right</span>
	</p>

	<div class="controller" class:invisible={keyboard}>
		<button id="lookleft" aria-label="Look left">&lArr;</button>
		<button id="forward" aria-label="Move forward">&uArr;</button>
		<button id="lookright" aria-label="Look right">&rArr;</button>
		<button id="backward" aria-label="Move backward">&dArr;</button>
		<button id="left" aria-label="Move left">&larr;</button>
		<button id="up" aria-label="Move up">&uarr;</button>
		<button id="right" aria-label="Move right">&rarr;</button>
		<button id="down" aria-label="Move down">&darr;</button>
	</div>
</section>

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

	main {
		text-align: center;
		margin: auto;
	}

	.controll {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		gap: 0.5rem;
		margin: 0.5rem;
	}

	.controller {
		display: grid;
		text-align: center;
		justify-content: center;
		gap: 0.125rem;
		grid-template-areas: '. forward . . up .' 'lookleft backward lookright left down right';
	}

	.controller button {
		aspect-ratio: 1;
		width: 2.5rem;
		user-select: none;
	}

	#left {
		grid-area: left;
	}
	#forward {
		grid-area: forward;
	}
	#right {
		grid-area: right;
	}
	#backward {
		grid-area: backward;
	}
	#up {
		grid-area: up;
	}
	#down {
		grid-area: down;
	}
	#lookleft {
		grid-area: lookleft;
	}
	#lookright {
		grid-area: lookright;
	}

	.controlls {
		text-align: center;
		margin: 0;
	}

	.controlls > * {
		display: block;
	}

	.invisible {
		display: none;
	}
</style>
