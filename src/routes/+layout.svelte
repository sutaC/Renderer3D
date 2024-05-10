<slot />

<style>
	:global(*) {
		box-sizing: border-box;
	}

	:global(html) {
		font-family: 'Courier New', Courier, monospace;
	}

	:global(body) {
		margin: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		min-height: 100vh;
	}

	:global(canvas) {
		max-width: calc(100vw - 1rem);
		aspect-ratio: 1;
		background: black;
	}
</style>
