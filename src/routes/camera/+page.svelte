<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { CameraShowcase } from '$lib/Showcases/CameraShowcase';
	import { EngineState } from '$lib/EngineUtils/Engine';
	import Header from '$lib/comonents/Header.svelte';
	import Footer from '$lib/comonents/Footer.svelte';
	import Card from '$lib/comonents/Card.svelte';
	import Canvas from '$lib/comonents/Canvas.svelte';
	import Gamepad from '$lib/comonents/Gamepad.svelte';
	import Joistick from '$lib/comonents/Joistick.svelte';

	let engine: CameraShowcase | undefined = undefined;
	let joistick: boolean = true;
	let loading: boolean = false;
	let showFPS: boolean = false;
	let fps: number = 0;

	onMount(() => {
		const canvas = document.getElementById('cnv') as HTMLCanvasElement;

		// Loads saved settings
		joistick = JSON.parse(localStorage.getItem('joistick') || 'false');
		showFPS = JSON.parse(localStorage.getItem('showFPS') || 'false');

		// Canvas size
		const resolution: { width: number; height: number } = JSON.parse(
			localStorage.getItem('resolution') || '{"width":1280,"height":720}'
		);
		canvas.width = resolution.width;
		canvas.height = resolution.height;

		engine = new CameraShowcase(canvas);

		engine.addAlternativeButton(document.getElementById('lookleft') as HTMLButtonElement, 'a');
		engine.addAlternativeButton(document.getElementById('forward') as HTMLButtonElement, 'w');
		engine.addAlternativeButton(document.getElementById('lookright') as HTMLButtonElement, 'd');
		engine.addAlternativeButton(document.getElementById('backward') as HTMLButtonElement, 's');
		engine.addAlternativeButton(document.getElementById('up') as HTMLButtonElement, 'ArrowUp');
		engine.addAlternativeButton(document.getElementById('down') as HTMLButtonElement, 'ArrowDown');
		engine.addAlternativeButton(document.getElementById('left') as HTMLButtonElement, 'ArrowLeft');
		engine.addAlternativeButton(
			document.getElementById('right') as HTMLButtonElement,
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

<Header style="secondary" fps={showFPS ? fps : null}>Camera Showcase</Header>

<Gamepad style="secondary">
	<main>
		<Canvas id="cnv" {loading} />

		<section class="controll">
			<div class:invisible={joistick}>
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

			<div class="joisticks" class:invisible={!joistick}>
				<Joistick
					style="secondary"
					ids={{ up: 'forward', right: 'lookright', down: 'backward', left: 'lookleft' }}
				/>
				<Joistick
					style="secondary"
					ids={{ up: 'up', right: 'right', down: 'down', left: 'left' }}
				/>
			</div>
		</section>
	</main>

	<Footer
		>{joistick
			? 'If you want to disable joistik, go to options'
			: 'If you want to use joistik, go to options'}</Footer
	>
</Gamepad>

<style>
	main {
		margin-bottom: 2rem;
	}

	.controll {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		gap: 0.5rem;
		margin: 1rem 0.5rem;
	}

	.controll > * {
		width: 100%;
		max-width: 30rem;
	}

	.joisticks {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 1rem;
	}

	.invisible {
		display: none;
	}
</style>
