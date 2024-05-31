<script lang="ts">
	import Button from './Button.svelte';

	export let style: 'primary' | 'secondary' | 'accent' = 'primary';
	export let fps: number | null = null;
</script>

<header class={style}>
	<h1><slot /></h1>
	<nav>
		<a href="/" aria-label="return">
			<Button {style} icon={true}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="currentColor"
					class="bi bi-chevron-left"
					viewBox="0 0 16 16"
				>
					<path
						fill-rule="evenodd"
						d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
					/>
				</svg>
			</Button>
		</a>
		<p class:disabled={fps === null}>FPS: {fps || 0}</p>
	</nav>
</header>

<style>
	header {
		--_caption: black;
		--_border: black;
		--_outline: black;

		margin: 0 1rem 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid transparent;
		border-image: var(--_border) 1;
	}

	.primary {
		--_caption: var(--grd-tint-primary);
		--_border: var(--grd-shade-primary);
		--_outline: color-mix(in srgb, var(--clr-primary), var(--clr-text));
	}

	.secondary {
		--_caption: var(--grd-tint-secondary);
		--_border: var(--grd-shade-secondary);
		--_outline: color-mix(in srgb, var(--clr-secondary), var(--clr-text));
	}

	.accent {
		--_caption: var(--grd-tint-accent);
		--_border: var(--grd-shade-accent);
		--_outline: color-mix(in srgb, var(--clr-accent), var(--clr-text));
	}

	h1 {
		margin: 0 0 0.5rem;
		text-align: center;
		background: var(--_caption);
		font-size: 2.2rem;
		color: transparent;
		-webkit-background-clip: text;
		background-clip: text;
		text-shadow: 0 4px 4px hsla(0, 0%, 0%, 0.2);
		-webkit-text-stroke: 1px var(--_outline);
	}

	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	p {
		margin: 0;
	}

	.disabled {
		display: none;
	}
</style>
