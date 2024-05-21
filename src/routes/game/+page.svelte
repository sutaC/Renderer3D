<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { Game } from '$lib/Game';
	import { EngineState } from '$lib/Engine/Engine';

	let engine: Game | undefined = undefined;

	onMount(() => {
		const canvas = document.querySelector('canvas') as HTMLCanvasElement;
		engine = new Game(canvas);

		engine.addAlternativeButton(document.querySelector('#left') as HTMLButtonElement, 'a');
		engine.addAlternativeButton(document.querySelector('#forward') as HTMLButtonElement, 'w');
		engine.addAlternativeButton(document.querySelector('#right') as HTMLButtonElement, 'd');
		engine.addAlternativeButton(document.querySelector('#backward') as HTMLButtonElement, 's');
		engine.addAlternativeButton(document.querySelector('#up') as HTMLButtonElement, 'ArrowUp');
		engine.addAlternativeButton(document.querySelector('#down') as HTMLButtonElement, 'ArrowDown');

		engine.onready = (eng) => {
			eng.run();
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
	<title>Game 3D</title>
</svelte:head>

<a href="/" class="return">Return</a>

<h1>Game 3D</h1>

<canvas width="500" height="500"></canvas>

<div class="wrap">
	<p class="controlls">
		W-S : moving forward-backward <br /> A-D : looking left-right <br /> ArrowUp-ArrowDown : moving up-down
	</p>

	<div class="controller">
		<button id="left" aria-label="Left">&lArr;</button>
		<button id="forward" aria-label="Forward">&uArr;</button>
		<button id="right" aria-label="Right">&rArr;</button>
		<button id="backward" aria-label="Backward">&dArr;</button>
		<button id="up" aria-label="Up">&uarr;</button>
		<button id="down" aria-label="Down">&darr;</button>
	</div>
</div>

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

	.wrap {
		margin: 0.5rem 0;
		display: flex;
		justify-content: center;
		align-items: start;
		gap: 1rem;
		padding-inline: 2rem;
	}

	.controller {
		display: grid;
		text-align: center;
		justify-content: center;
		gap: 0.125rem;
		grid-template-areas: '. forward . up' 'left backward right down';
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

	.controlls {
		text-align: center;
		margin: 0;
	}
</style>
