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
			var(--clr-primary) 15%,
			var(--clr-secondary) 50%,
			var(--clr-accent) 85%
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
	}

	/* --- */

	:global(:where(h1, h2, h3, h4, h5)) {
		font-family: 'Roboto Mono';
		font-weight: 700;
	}

	:global(h1) {
		font-size: 4.21rem; /* 67.36px */
	}

	:global(h2) {
		font-size: 3.158rem; /* 50.56px */
	}

	:global(h3) {
		font-size: 2.369rem; /* 37.92px */
	}

	:global(h4) {
		font-size: 1.777rem; /* 28.48px */
	}

	:global(h5) {
		font-size: 1.333rem; /* 21.28px */
	}

	:global(small) {
		font-size: 0.75rem; /* 12px */
	}

	/* --- */

	:global(canvas) {
		max-width: calc(100vw - 1rem);
		max-height: 70vh;
		background: black;
	}
</style>
