<slot />

<style>
	@import url('https://fonts.googleapis.com/css?family=Roboto%20Mono:700|Roboto%20Mono:400');

	:global(:root) {
		--clr-text: #17030c;
		--clr-background: #fdeff4;
		--clr-primary: #e72267;
		--clr-secondary: #7ff1bb;
		--clr-accent: #4ba5eb;

		--clr-shade-100: #513e46;
		--clr-shade-200: #645159;
		--clr-shade-300: #8a787f;
		--clr-shade-400: #b09fa5;
		--clr-shade-500: #c4b3b9;

		--grd-lin-triad: linear-gradient(
			to right bottom,
			var(--clr-primary),
			var(--clr-secondary),
			var(--clr-accent)
		);
		--grd-lin-prsc: linear-gradient(to right bottom, var(--clr-primary), var(--clr-secondary));
		--grd-lin-prac: linear-gradient(to right bottom, var(--clr-primary), var(--clr-accent));

		--grd-tint-primary: linear-gradient(to right bottom, var(--clr-primary), var(--clr-background));
		--grd-tint-secondary: linear-gradient(
			to right bottom,
			var(--clr-secondary),
			var(--clr-background)
		);
		--grd-tint-accent: linear-gradient(to right bottom, var(--clr-accent), var(--clr-background));

		--grd-shade-primary: linear-gradient(to right bottom, var(--clr-primary), var(--clr-text));
		--grd-shade-secondary: linear-gradient(to right bottom, var(--clr-secondary), var(--clr-text));
		--grd-shade-accent: linear-gradient(to right bottom, var(--clr-accent), var(--clr-text));
	}

	/* --- */

	:global(*) {
		box-sizing: border-box;
	}

	:global(html) {
		font-family: 'Courier New', Courier, monospace;
		color: var(--clr-text);
	}

	:global(body) {
		margin: 0;
		min-height: 100vh;
		font-family: 'Roboto Mono';
		font-weight: 400;
		background-color: var(--clr-background);
	}

	/* --- */

	:global(:where(h1, h2, h3, h4, h5)) {
		font-family: 'Roboto Mono';
		font-weight: 700;
	}

	:global(h1) {
		font-size: 2.489rem; /* 39.84px */
	}

	:global(h2) {
		font-size: 2.074rem; /* 33.12px */
	}

	:global(h3) {
		font-size: 1.728rem; /* 27.68px */
	}

	:global(h4) {
		font-size: 1.44rem; /* 23.04px */
	}

	:global(h5) {
		font-size: 1.2rem; /* 19.2px */
	}

	:global(small) {
		font-size: 0.833rem; /* 13.28px */
	}

	/* --- */

	:global(:where(input, select, option)) {
		accent-color: var(--clr-background);
		font-size: 0.9rem;
		border: 1px solid var(--clr-text);
		border-radius: 0.25rem;
		background-color: var(--clr-background);
	}
</style>
