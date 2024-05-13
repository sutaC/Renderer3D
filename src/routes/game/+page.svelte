<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { Game } from '$lib/Game';
	import { EngineState } from '$lib/Engine/Engine';

	let game: Game | undefined = undefined;

	onMount(() => {
		const canvas = document.querySelector('canvas') as HTMLCanvasElement;
		game = new Game(canvas);
		game.onready = (gm) => {
			gm.run();
			console.log('Game is running!');
		};
		game.onfail = (error) => {
			console.error('Error ocurred while starting game: ', error);
		};
	});

	onDestroy(() => {
		if (game) {
			// Engine running
			if (game.getState() === EngineState.running) {
				game.stop();
			}
		}
	});
</script>

<svelte:head>
	<title>Game 3D</title>
</svelte:head>

<a href="/" class="return">Return</a>

<h1>Game 3D</h1>

<canvas width="500" height="500"></canvas>

<p class="controlls">
	W-S : moving forward-backward <br /> A-D : looking left-right <br /> Shift-Ctrl : moving up-down
</p>

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

	.controlls {
		text-align: center;
	}
</style>
