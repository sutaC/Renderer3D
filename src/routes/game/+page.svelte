<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import Game from '$lib/Game';

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
			if (game.getState() === 3) {
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
</style>
