<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { CameraShowcase } from '$lib/Showcases/CameraShowcase';
	import { EngineState } from '$lib/EngineUtils/Engine';
	import Header from '$lib/Comonents/Header.svelte';
	import Footer from '$lib/Comonents/Footer.svelte';
	import Card from '$lib/Comonents/Card.svelte';
	import Canvas from '$lib/Comonents/Canvas.svelte';

	let engine: CameraShowcase | undefined = undefined;

	// To read
	let joistick: boolean = false;

	let loading: boolean = true;

	let fps: number = 0;

	onMount(() => {
		const canvas = document.querySelector('#cnv') as HTMLCanvasElement;

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
			loading = false;
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
	<title>Renderer3D | CameraShowcase</title>
</svelte:head>

<Header style="secondary" {fps}>Camera Showcase</Header>

<main>
	<Canvas id="cnv" {loading} />

	<section class="controll">
		<div class="keyboardCtrl" class:invisible={joistick}>
			<Card style="secondary">
				<div>
					<span>W/S: </span>
					<span>forward/backward</span>
				</div>
				<div>
					<span>A/D:</span>
					<span>looking left/right</span>
				</div>
				<div>
					<span>ArrUp/ArrDown:</span>
					<span>up/down</span>
				</div>
				<div>
					<span>ArrLeft/ArrRight:</span>
					<span>left/right</span>
				</div>
			</Card>
		</div>

		<div class="controller" class:invisible={!joistick}>
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
</main>

<Footer />

<style>
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

	.keyboardCtrl {
		width: 100%;
		max-width: 30rem;
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

	.invisible {
		display: none;
	}
</style>
