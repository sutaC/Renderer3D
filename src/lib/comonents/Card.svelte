<script lang="ts">
	export let style: 'primary' | 'secondary' | 'accent' = 'primary';
</script>

<div class="card {style}">
	<slot />
</div>

<style>
	.card {
		--_background: black;
		--_border: black;

		border-radius: 0.5rem;
		background: var(--_background);
		box-shadow: 0 4px 4px hsla(0, 0%, 0%, 0.2);
	}

	.primary {
		--_background: var(--grd-tint-primary);
		--_border: var(--grd-shade-primary);
	}

	.secondary {
		--_background: var(--grd-tint-secondary);
		--_border: var(--grd-shade-secondary);
	}

	.accent {
		--_background: var(--grd-tint-accent);
		--_border: var(--grd-shade-accent);
	}

	.card :global(> *) {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.25rem 0.5rem;
		margin: 0;
		width: 100%;
		background-color: transparent;
		border-bottom: 1px solid transparent;
		border-image: var(--_border) 1;
	}

	.card :global(> :last-child) {
		border-bottom: none;
	}
</style>
