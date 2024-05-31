<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { CameraShowcase } from '$lib/Showcases/CameraShowcase';
	import { EngineState } from '$lib/EngineUtils/Engine';
	import Header from '$lib/Comonents/Header.svelte';
	import Footer from '$lib/Comonents/Footer.svelte';
	import Card from '$lib/Comonents/Card.svelte';
	import Canvas from '$lib/Comonents/Canvas.svelte';
	import Gamepad from '$lib/Comonents/Gamepad.svelte';
	import Joistick from '$lib/Comonents/Joistick.svelte';

	let engine: CameraShowcase | undefined = undefined;

	// To read
	let joistick: boolean = true;

	let loading: boolean = false;

	let fps: number = 0;

	onMount(() => {
		const canvas = document.querySelector('#cnv') as HTMLCanvasElement;

		// Loads saved settings
		joistick = JSON.parse(localStorage.getItem('joistick') || 'false');

		// Canvas size
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
		subtext={joistick
			? 'If you want to disable joistik, go to options'
			: 'If you want to use joistik, go to options'}
	/>
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
