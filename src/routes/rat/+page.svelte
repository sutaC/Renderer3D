<script lang="ts">
	import Canvas from '$lib/comonents/Canvas.svelte';
	import { EngineState } from '$lib/EngineUtils/Engine';
	import { ObjectsShowcase } from '$lib/Showcases/ObjectsShowcase';
	import { onMount, onDestroy } from 'svelte';

	let engine: ObjectsShowcase | undefined = undefined;
	let loading: boolean = true;
	let accIntervalId: NodeJS.Timeout | undefined;
	let rpfVisible: boolean = false;
	let accOn: boolean = false;

	onMount(() => {
		const canvas = document.getElementById('cvs') as HTMLCanvasElement;
		// Canvas size
		const resolution: { width: number; height: number } = JSON.parse(
			localStorage.getItem('resolution') || '{"width":1280,"height":720}'
		);
		canvas.width = resolution.width;
		canvas.height = resolution.height;

		engine = new ObjectsShowcase(canvas);
		engine.rotate = { x: false, y: true, z: false };
		engine.speed = 240;

		engine.onready = async (eng) => {
			await eng.shapeController.loadType('rat');
			eng.shapeController.setSize(resolution.width / 4);
			eng.shapeController.setColor('#664445');
			eng.shapeController.setOrigin({ x: 0, y: -0.5, z: 10 });
			eng.run();
			loading = false;
		};
		engine.onfail = (error) => {
			console.error('Error ocurred in engine workflow: ', error);
		};

		window.setSpeed = (s: number) => {
			if (engine) engine.speed = s;
		};
		window.getSpeed = () => engine?.speed;
	});

	onDestroy(() => {
		if (engine) {
			// Engine running
			if (engine.getState() === EngineState.running) {
				engine.stop();
			}
		}
		clearInterval(accIntervalId);
		accIntervalId = undefined;
	});
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 's') rpfVisible = !rpfVisible;
		else if (e.key === 'a') {
			accOn = !accOn;
			if (accOn)
				accIntervalId = setInterval(() => {
					if (engine) {
						if (engine.speed < 0) {
							engine.speed--;
						} else {
							engine.speed++;
						}
					}
				}, 1000);
			else {
				clearInterval(accIntervalId);
				accIntervalId = undefined;
			}
		}
	}}
/>

<svelte:head>
	<title>Renderer3D | Rat</title>
</svelte:head>

<h1 id="rath">Horizontally spinning rat</h1>

<span class={`rps ${rpfVisible ? '' : 'hidden'} ${accOn ? 'acc' : ''}`}
	>{((engine?.speed ?? 240) / 360).toFixed(2)} rps</span
>

<Canvas id="cvs" {loading} />

<style>
	:global(body) {
		background-color: #191519;
		min-height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	:global(#cvs) {
		background-color: #191519;
		border: none;
		box-shadow: none;
	}
	#rath {
		position: absolute;
		color: black;
		background-color: white;
		width: 100%;
		padding: 1rem;
		height: fit-content;
		inset: 0;
		text-align: center;
		font-family: sans-serif;
		font-weight: normal;
		margin: 0;
	}
	.hidden {
		display: none;
	}
	.rps {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: fit-content;
		text-align: center;
		padding: 0.5rem;
		color: white;
	}
	.acc {
		color: red;
	}
</style>
