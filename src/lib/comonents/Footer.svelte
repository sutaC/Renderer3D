<footer>
	<small class="subtext"><slot /></small>
	<small
		>Made by <a href="http://github.com/sutaC" target="_blank" rel="noopener noreferrer">sutaC</a
		></small
	>
</footer>

<style>
	footer {
		position: sticky;
		top: 100vh;
		text-shadow: 0 4px 4px hsla(0, 0%, 0%, 0.2);
		text-align: center;
		padding-bottom: 1rem;
	}

	small {
		display: block;
	}

	.subtext {
		margin-bottom: 1rem;
		color: var(--clr-shade-200);
		font-style: italic;
	}

	.subtext:empty {
		display: none;
	}

	a {
		color: var(--clr-shade-300);
		font-style: italic;
		transition: all 200ms ease;
	}

	a:hover {
		opacity: 0.8;
	}
</style>
