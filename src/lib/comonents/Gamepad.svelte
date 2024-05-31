<script lang="ts">
	export let style: 'primary' | 'secondary' | 'accent' = 'primary';
</script>

<div class="gamepad {style}">
	<slot />

	<div class="vents">
		<div class="vent"></div>
		<div class="vent"></div>
		<div class="vent"></div>
	</div>
</div>

<style>
	.gamepad {
		--_backgorund: black;

		position: relative;
		width: fit-content;
		margin: auto;
		padding: 1rem 1rem 0;
		background-color: var(--_backgorund);
		border-radius: 1rem 1rem 0 0;
		isolation: isolate;
		box-shadow: 4px 0 4px hsla(0, 0%, 0%, 0.2);
	}

	.primary {
		--_backgorund: var(--clr-primary);
	}

	.secondary {
		--_backgorund: var(--clr-secondary);
	}

	.accent {
		--_backgorund: var(--clr-accent);
	}

	.vents {
		position: absolute;
		left: 50%;
		bottom: 4.5rem;
		translate: -50% 0;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		z-index: -100;
	}

	.vent {
		display: block;
		width: 0.75rem;
		aspect-ratio: 1;
		background: radial-gradient(var(--clr-shade-100), var(--clr-shade-300));
		border-radius: 100%;
		box-shadow: inset 0 4px 4px hsla(0, 0%, 0%, 0.2);
	}
</style>
