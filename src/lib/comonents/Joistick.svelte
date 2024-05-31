<script lang="ts">
	export let style: 'primary' | 'secondary' | 'accent' = 'primary';
	export let ids = {
		up: '',
		right: '',
		down: '',
		left: ''
	};
</script>

<div class="joistick {style}">
	<button class="up" id={ids.up} on:click>
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
	</button>
	<button class="right" id={ids.right} on:click>
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
	</button>
	<button class="down" id={ids.down} on:click>
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
	</button>
	<button class="left" id={ids.left} on:click>
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
	</button>
	<div class="center"></div>
</div>

<style>
	.joistick {
		--_background: var(--clr-shade-300);

		display: grid;
		text-align: center;
		justify-content: center;
		grid-template-areas: '. up .' 'left center right' '. down .';
	}

	.joistick > * {
		width: 2.5rem;
		aspect-ratio: 1;
		background-color: var(--_background);
		border: none;
		display: flex;
		justify-content: center;
		align-items: center;
		color: var(--clr-background);
	}

	.joistick > button {
		position: relative;
		border-radius: 0.5rem 0 0 0.5rem;
		transition: all 200ms ease;
	}

	.joistick > button:hover {
		--_background: color-mix(in srgb, var(--clr-shade-300), black 10%);
	}

	.joistick > button:active {
		box-shadow: inset 4px 0 4px hsla(0, 0%, 0%, 0.2);
	}

	.up {
		grid-area: up;
		rotate: 90deg;
		box-shadow: 0 0 4px hsla(0, 0%, 0%, 0.2);
	}
	.right {
		grid-area: right;
		rotate: 180deg;
		box-shadow:
			0 -4px 4px hsla(0, 0%, 0%, 0.2),
			0 0 4px hsla(0, 0%, 0%, 0.2);
	}
	.down {
		grid-area: down;
		rotate: 270deg;
		box-shadow:
			-4px 0 4px hsla(0, 0%, 0%, 0.2),
			0 0 4px hsla(0, 0%, 0%, 0.2);
	}
	.left {
		grid-area: left;
		box-shadow:
			0 4px 4px hsla(0, 0%, 0%, 0.2),
			0 0 4px hsla(0, 0%, 0%, 0.2);
	}
	.center {
		grid-area: center;
		z-index: 100;
		scale: 1.01;

		display: flex;
		justify-content: center;
		align-items: center;
	}

	.center::after {
		content: '';
		display: block;
		width: 85%;
		aspect-ratio: 1;
		border-radius: 100%;
		box-shadow: inset 0 0 4px 2px hsla(0, 0%, 0%, 0.2);
	}
</style>
