<!--
@component
A component that presents the Flippin logo and title of the puzzle.
-->

<script lang="ts">
	import {
		customPrefix,
		dailyTitle,
		freeplayPuzzle,
		gameMode,
		gameNumber,
	} from '$src/stores/stores';
	import { fit } from '@leveluptuts/svelte-fit';

	/**
	 * Removes the custom puzzle prefix from a puzzle title if applicable.
	 *
	 * @param {string} title The title of the puzzle.
	 *
	 * @example
	 * ```ts
	 * // returns 'Hello, Flippin!'
	 * removeCustomPrefix("CSTM-Hello, Flippin!");
	 * ```
	 *
	 * @returns {string} The title of the puzzle without the custom prefix.
	 */
	function removeCustomPrefix(title: string): string {
		if (title.startsWith(customPrefix)) {
			return title.substring(customPrefix.length);
		}
		return title;
	}

	/** The title of the puzzle along with the game number if in daily mode. */
	$: subtitle =
		$gameMode === 'daily'
			? `#${$gameNumber}: ${$dailyTitle}`
			: removeCustomPrefix($freeplayPuzzle.title);
</script>

<!--
svelte-ignore a11y-no-redundant-roles
-->
<!-- Required because this is an element inside main. -->
<header role="banner" class="title">
	<div class="title-container">
		<svg
			viewBox="0 0 41 5"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			role="img"
			aria-label="Flippin logo"
		>
			<path
				d="M0 0.5 H5 M0.5 0 V5 M1.5 0 V5 M0 2.5 H5"
				stroke="var(--color-theme-1)"
			/>
			<path d="M6.5 0 V5 M7.5 0 V5 M6 4.5 H11" stroke="var(--color-theme-2)" />
			<path
				d="M12 0.5 H17 M13.5 0 V5 M14.5 0 V5 M12 4.5 H17"
				stroke="var(--color-theme-3)"
			/>
			<path
				d="M18 0.5 H23 M18.5 0 V5 M19.5 0 V5 M22.5 0 V3 M18 2.5 H23"
				stroke="var(--color-theme-1)"
			/>
			<path
				d="M24 0.5 H29 M24.5 0 V5 M27.5 0 V3 M28.5 0 V3 M24 2.5 H29"
				stroke="var(--color-theme-2)"
			/>
			<path
				d="M30 0.5 H35 M32.5 0 V5 M33.5 0 V5 M30 4.5 H35"
				stroke="var(--color-theme-3)"
			/>
			<path
				d="M36.5 0 V5 M39.5 0 V5 M40.5 0 V5 M37 1.5 H38 M38 2.5 H39"
				stroke="var(--color-theme-1)"
			/>
		</svg>
		{#key subtitle}
			<div class="subtitle-parent">
				<h1 use:fit={{ min_size: 18, max_size: 34 }}>
					{subtitle}
				</h1>
			</div>
		{/key}
	</div>
</header>

<style>
	.title-container {
		margin: 10px auto 0 auto;
		width: 280px;
		height: 95px;
		text-align: center;
		overflow: hidden;
	}

	.subtitle-parent {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 40px;
		margin: 5px 0 10px 0;
	}

	svg {
		width: 280px;
	}

	h1 {
		margin: 0;
		text-align: center;
	}
</style>
