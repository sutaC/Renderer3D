<svelte:head>
	<title>Renderer 3D</title>
</svelte:head>

<div class="app">
	<header>
		<h1>Renderer 3D</h1>
	</header>

	<main>
		<a href="/showcase">Showcase 3D</a>
		<a href="/game">Game 3D</a>
		<a href="/options">Options</a>
	</main>
</div>

<style>
	.app {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		min-height: 100vh;
	}

	h1 {
		text-align: center;
	}

	main a {
		display: block;
		text-align: center;
		color: black;
		margin: 1rem;
	}
</style>
