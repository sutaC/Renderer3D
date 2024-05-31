<script lang="ts">
	export let id: string = '';
	export let loading: boolean = true;
</script>

<div class="container">
	<canvas {id}></canvas>
	<div class="loading" class:disabled={!loading}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="32"
			height="32"
			fill="currentColor"
			class="bi bi-slash-circle"
			viewBox="0 0 16 16"
		>
			<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
			<path d="M11.354 4.646a.5.5 0 0 0-.708 0l-6 6a.5.5 0 0 0 .708.708l6-6a.5.5 0 0 0 0-.708" />
		</svg>
	</div>
</div>

<style>
	.container {
		position: relative;
	}

	canvas {
		max-width: calc(100vw - 1rem);
		max-height: 70vh;
		border: 2px solid var(--clr-shade-300);
		border-radius: 0.5rem;
		background-color: var(--clr-text);
		box-shadow:
			inset 0 0 4px hsla(0, 0%, 100%, 0.2),
			0 4px 4px hsla(0, 0%, 0%, 0.2);
	}

	@keyframes spin {
		to {
			rotate: 360deg;
		}
	}

	.loading {
		position: absolute;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
		display: flex;
		justify-content: center;
		align-items: center;
		color: var(--clr-background);
		animation: spin 1s ease 0s infinite;
	}

	.disabled {
		display: none;
	}
</style>
