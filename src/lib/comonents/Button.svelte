<script lang="ts">
	export let style: 'primary' | 'secondary' | 'accent' = 'primary';
	export let icon: boolean = false;
</script>

<button class={style} class:icon on:click><slot /></button>

<style>
	button {
		--_bg: black;
		--_highlight: black;
		--_text-shadow: var(--_highlight);

		padding: 0.5rem 2rem;
		border-radius: 2rem;
		border: none;
		background: var(--_bg);
		box-shadow: 0 4px 4px hsla(0, 0%, 0%, 0.2);
		text-shadow: 0 0 2px var(--_text-shadow);
		font-size: 1em;
		font-style: italic;
		font-weight: bold;
		-webkit-text-stroke: 1px var(--_highlight);
		color: var(--clr-background);
		cursor: pointer;

		transition: all 200ms ease;
	}

	button:hover {
		--_text-shadow: var(--clr-background);
		translate: 0 -1px;
	}

	button:active {
		--_inner-shadow: var(--_highlight);
		box-shadow:
			inset 0 0 6px var(--_inner-shadow),
			0 0 4px hsla(0, 0%, 0%, 0.2);
		translate: 0 3px;
	}

	.primary {
		--_bg: var(--grd-tint-primary);
		--_highlight: var(--clr-primary);
	}

	.secondary {
		--_bg: var(--grd-tint-secondary);
		--_highlight: var(--clr-secondary);
	}

	.accent {
		--_bg: var(--grd-tint-accent);
		--_highlight: var(--clr-accent);
	}

	.icon {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0.5rem;
		aspect-ratio: 1;
		border-radius: 100%;
	}
</style>
