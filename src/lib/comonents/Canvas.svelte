<script lang="ts">
	export let id: string = '';
	export let loading: boolean = true;
</script>

<div class="container">
	<canvas {id}></canvas>
	<div class="loading" class:disabled={!loading}>
		<svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M40 20C40 16.0444 38.827 12.1776 36.6294 8.8886C34.4318 5.59961 31.3082 3.03616 27.6537 1.52241C23.9991 0.00865667 19.9778 -0.38741 16.0982 0.384294C12.2186 1.156 8.65491 3.06081 5.85786 5.85786C3.06081 8.65491 1.156 12.2186 0.384294 16.0982C-0.38741 19.9778 0.00865672 23.9991 1.52241 27.6537C3.03616 31.3082 5.59961 34.4318 8.8886 36.6294C12.1776 38.827 16.0444 40 20 40L20 38C16.4399 38 12.9598 36.9443 9.99974 34.9665C7.03965 32.9886 4.73255 30.1774 3.37017 26.8883C2.00779 23.5992 1.65133 19.98 2.34586 16.4884C3.0404 12.9967 4.75473 9.78942 7.27208 7.27208C9.78942 4.75473 12.9967 3.0404 16.4884 2.34586C19.98 1.65133 23.5992 2.00779 26.8883 3.37017C30.1774 4.73255 32.9886 7.03965 34.9665 9.99974C36.9443 12.9598 38 16.4399 38 20H40Z"
				fill="#FDEFF4"
			/>
		</svg>
	</div>
</div>

<style>
	.container {
		position: relative;
	}

	canvas {
		max-width: 100%;
		max-height: 65vh;
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
