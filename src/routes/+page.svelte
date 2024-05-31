<script lang="ts">
	import Button from '$lib/Comonents/Button.svelte';
	import Footer from '$lib/Comonents/Footer.svelte';
</script>

<svelte:head>
	<title>Renderer 3D</title>
</svelte:head>

<div class="app">
	<header>
		<h1>Renderer 3D</h1>
		<small class="subtitle"
			>This is a project that explores 3D rendering. It allows you to draw 3D objects loaded from
			.obj files and provides a simple engine for creating interactive experiences.</small
		>
	</header>

	<main>
		<a href="/objects"><Button style="primary">Objects Showcase</Button></a>
		<a href="/camera"><Button style="secondary">Camera Showcase</Button></a>
		<a href="/options"><Button style="accent">Options</Button></a>
	</main>

	<Footer />
</div>

<style>
	.app {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		min-height: 100vh;
		padding: 0 2rem;
	}

	header {
		text-align: center;
		text-shadow: 0 4px 4px hsla(0, 0%, 0%, 0.2);
	}

	@keyframes gradient {
		0% {
			background-position: 0% 0%;
		}
		50% {
			background-position: 100% 100%;
		}
		100% {
			background-position: 0% 0%;
		}
	}

	h1 {
		--_text-color: text-align: center;
		margin: 0.5rem 0;
		color: transparent;
		background: var(--grd-lin-triad);
		background-size: 400% 400%;
		animation: gradient 10s ease 0ms infinite;
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-stroke: 1px var(--clr-background);
	}

	.subtitle {
		display: block;
		margin: auto;
		max-width: 50ch;
		color: var(--clr-shade-300);
		text-wrap: balance;
	}

	main a {
		display: block;
		text-align: center;
		color: black;
		margin: 1rem;
	}
</style>
