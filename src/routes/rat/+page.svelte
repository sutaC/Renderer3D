<script lang="ts">
	import Canvas from '$lib/comonents/Canvas.svelte';
	import { EngineState } from '$lib/EngineUtils/Engine';
	import { ObjectsShowcase } from '$lib/Showcases/ObjectsShowcase';
	import { onMount, onDestroy } from 'svelte';

	let engine: ObjectsShowcase | undefined = undefined;
	let loading: boolean = true;

	onMount(() => {
		const canvas = document.getElementById('cvs') as HTMLCanvasElement;
		// Canvas size
		const resolution: { width: number; height: number } = JSON.parse(
			localStorage.getItem('resolution') || '{"width":1280,"height":720}'
		);
		canvas.width = resolution.width;
		canvas.height = resolution.height;

		engine = new ObjectsShowcase(canvas);

		engine.onready = (eng) => {
			eng.shapeController.setSize(resolution.width / 4);
			eng.rotate = { x: false, y: true, z: false };
			eng.shapeController.loadType('rat');
			eng.shapeController.setColor('#664445');
			eng.shapeController.setOrigin({ x: 0, y: -0.5, z: 10 });
			eng.speed = 240;
			eng.run();
			loading = false;
		};
		engine.onfail = (error) => {
			console.error('Error ocurred in engine workflow: ', error);
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
	<title>Renderer3D | Rat</title>
</svelte:head>

<h1 id="rath">Horizontally spinning rat</h1>

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
</style>
