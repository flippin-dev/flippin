<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="error-container">
	{#if $page.status >= 400 && $page.status < 500}
		<svg
			version="1.1"
			viewBox="0 0 6.6692 9.8674"
			xml:space="preserve"
			xmlns="http://www.w3.org/2000/svg"
			role="img"
			aria-label="confused Flippin tile looking at a map"
		>
			<rect
				x="1.1866"
				y="3.5132"
				width="4.3049"
				height="4.3049"
				fill="var(--color-theme-1)"
				stroke="#000000"
				stroke-linecap="square"
				stroke-width=".79375"
				style="paint-order:normal"
			/>
			<g
				transform="matrix(.16446 0 0 .16446 2.6425 .040753)"
				fill="none"
				stroke="var(--color-text)"
			>
				<path
					d="m0.5 4.5a3.5 3.5 0 1 1 3.5 3.5v1"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2.5"
				/>
				<circle cx="4" cy="12" r=".75" stroke-width="1.5" />
			</g>
			<g
				transform="matrix(1.299 0 0 .99851 -6.3278 -4.0855)"
				stroke="#000000"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width=".12205"
			>
				<path
					d="m4.9322 12.172v1.4722l1.2879 0.26853v-1.4258z"
					fill="var(--color-theme-2)"
				/>
				<path
					d="m4.9322 10.723v1.4722l1.2879 0.26853v-1.4258z"
					fill="var(--color-theme-3)"
				/>
				<path
					d="m4.9322 9.2738v1.4722l1.2879 0.26853v-1.4258z"
					fill="var(--color-theme-2)"
				/>
				<path
					d="m7.4381 12.172v1.4722l-1.2879 0.26853v-1.4258z"
					fill="var(--color-theme-3)"
				/>
				<path
					d="m7.4381 10.723v1.4722l-1.2879 0.26853v-1.4258z"
					fill="var(--color-theme-2)"
				/>
				<path
					d="m7.4381 9.2738v1.4722l-1.2879 0.26853v-1.4258z"
					fill="var(--color-theme-3)"
				/>
				<path
					d="m7.4381 12.172v1.4722l1.2879 0.26853v-1.4258z"
					fill="var(--color-theme-2)"
				/>
				<path
					d="m7.4381 10.723v1.4722l1.2879 0.26853v-1.4258z"
					fill="var(--color-theme-3)"
				/>
				<path
					d="m7.4381 9.2738v1.4722l1.2879 0.26853v-1.4258z"
					fill="var(--color-theme-2)"
				/>
				<path
					d="m9.9441 12.172v1.4722l-1.2879 0.26853v-1.4258z"
					fill="var(--color-theme-3)"
				/>
				<path
					d="m9.9441 10.723v1.4722l-1.2879 0.26853v-1.4258z"
					fill="var(--color-theme-2)"
				/>
				<path
					d="m9.9441 9.2738v1.4722l-1.2879 0.26853v-1.4258z"
					fill="var(--color-theme-3)"
				/>
			</g>
		</svg>

		<p><strong role="presentation">You seem to be lost!</strong></p>
		<p>Click the link below to return to the game!</p>
	{:else}
		<!-- Created with Inkscape (http://www.inkscape.org/) -->
		<svg
			version="1.1"
			viewBox="0 0 21.356 18.689"
			xmlns="http://www.w3.org/2000/svg"
			role="img"
			aria-label="Flippin tile wearing a nightcap sleeping in a bed"
		>
			<g transform="translate(-105.62 -139.41)" stroke="#000000">
				<rect
					x="106.02"
					y="144.76"
					width="20.562"
					height="6.4834"
					fill="var(--color-theme-2)"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width=".79428"
					style="paint-order:normal"
				/>
				<path
					d="m106.02 154.45v3.2484h2.1177c8.1632-3.248 16.326 0 16.326 0h2.1177v-3.2484h-18.444z"
					fill="var(--color-theme-2)"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width=".79375"
				/>
				<rect
					x="114.15"
					y="146.35"
					width="4.3049"
					height="4.3049"
					fill="var(--color-theme-1)"
					stroke-linecap="square"
					stroke-width=".79375"
					style="paint-order:normal"
				/>
				<g stroke-linecap="round" stroke-linejoin="round">
					<path
						d="m106.02 151.24c10.281-4.8951 20.562 0 20.562 0v3.2055h-20.562z"
						fill="var(--color-theme-3)"
						stroke-width=".79375"
						style="paint-order:normal"
					/>
					<path
						d="m117.52 143.98c-0.61933-3e-3 -1.302 0.22294-2.0211 0.83148l-2e-3 2e-3c-0.43318 0.17639-0.88618 0.52697-1.3395 1.1338h4.3046s-0.33752-0.29673-0.53434-0.55346c-0.25142-0.32795-0.27325-0.59073 0.93121-0.0868l1.8076 0.75602s-1.2891-2.073-3.1471-2.0826z"
						fill="var(--color-theme-3)"
						stroke-width=".332"
					/>
					<circle
						cx="120.66"
						cy="146.47"
						r=".41366"
						fill="var(--color-theme-1)"
						stroke-width=".332"
						style="paint-order:normal"
					/>
				</g>
			</g>
			<g
				transform="translate(-105.62 -139.41)"
				stroke="var(--color-text)"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<text
					x="118.346"
					y="143.7834"
					font-size="1.4111px"
					stroke-width=".188"
					style="paint-order:normal"
					xml:space="preserve"
					><tspan
						x="118.346"
						y="143.7834"
						fill="var(--color-text)"
						font-family="sans-serif"
						font-size="1.4111px"
						stroke="var(--color-text)"
						stroke-width=".188">z</tspan
					></text
				>
				<text
					x="119.27285"
					y="142.57402"
					font-size="1.7916px"
					stroke-width=".23869"
					style="paint-order:normal"
					xml:space="preserve"
					><tspan
						x="119.27285"
						y="142.57402"
						fill="var(--color-text)"
						font-family="sans-serif"
						font-size="1.7916px"
						stroke="var(--color-text)"
						stroke-width=".23869">z</tspan
					></text
				>
				<text
					x="118.1671"
					y="140.71504"
					font-size="2.1724px"
					stroke-width=".28942"
					style="paint-order:normal"
					xml:space="preserve"
					><tspan
						x="118.1671"
						y="140.71504"
						fill="var(--color-text)"
						font-family="sans-serif"
						font-size="2.1724px"
						stroke="var(--color-text)"
						stroke-width=".28942">z</tspan
					></text
				>
			</g>
		</svg>

		<p><strong role="presentation">The tiles are sleeping!</strong></p>
		<p>Try coming back later for more tile flipping fun!</p>
	{/if}

	<div class="return-container">
		<!-- Force a hard refresh so that the stores reinitialize -->
		<a data-sveltekit-reload href="/flippin/" aria-label="return to homepage"
			><strong role="presentation">Take me home!</strong></a
		>
	</div>
</div>

<style>
	.error-container {
		align-self: center;
		width: 280px;
		height: 400px;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		text-align: center;
		margin: auto 0;
		align-items: center;
		justify-items: center;
		margin-top: calc((100vh - 400px) / 2);
	}

	.return-container {
		margin-top: 0.5rem;
	}

	svg {
		width: 280px;
		margin-bottom: 0.5rem;
	}

	p {
		margin: 0.5rem 0;
	}
</style>
