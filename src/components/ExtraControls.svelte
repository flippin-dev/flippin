<!--
@component
A component that holds extra control buttons separate from the main controls.
-->

<script lang="ts">
	import {
		currentScreen,
		gameMode,
		hasWon,
		hasWonFreeplay,
		hintActive,
		needsHint,
	} from '$src/stores/stores';
	import { navigateToolbar } from '$lib/page-utilities';

	/** A binding for the toolbar element. */
	let toolbar: HTMLElement;

	$: isWon =
		($hasWon && $gameMode === 'daily') ||
		($hasWonFreeplay && $gameMode === 'freeplay');
</script>

<div
	bind:this={toolbar}
	data-toolbar-size={isWon || $hintActive ? 0 : 2}
	role="toolbar"
	aria-controls="game-board"
	aria-label="extra game controls"
	class="controls"
>
	<button
		title="Hint"
		data-toolbar-pos="0"
		on:click={() => {
			if (!(isWon || $hintActive)) {
				needsHint.set(true);
			}
		}}
		on:keydown={(event) => navigateToolbar(event, toolbar)}
		disabled={isWon || $hintActive}
		aria-disabled={isWon || $hintActive}
	>
		<svg
			aria-hidden="true"
			viewBox="0 0 9.0081396 13.122153"
			fill="var(--color-text)"
			stroke="var(--color-text)"
			stroke-linecap="round"
			stroke-linejoin="round"
			xmlns="http://www.w3.org/2000/svg"
			width="70%"
			height="70%"
		>
			<path
				d="m 7.0040696,7.6221535 -1,2
                h -3
                l -1,-2
                a 4,4 0 1 1 5,0
                z
                m -4,3.4999995
                h 3
                m -2,1.5
                h 1"
			/>
		</svg>
	</button>

	<button
		title="Surrender"
		data-toolbar-pos="1"
		on:click={() => {
			if (!(isWon || $hintActive)) {
				currentScreen.set('surrender');
			}
		}}
		on:keydown={(event) => navigateToolbar(event, toolbar)}
		disabled={isWon || $hintActive}
		aria-disabled={isWon || $hintActive}
	>
		<svg
			aria-hidden="true"
			viewBox="0 18 50 110"
			fill="var(--color-text)"
			stroke="var(--color-text)"
			xmlns="http://www.w3.org/2000/svg"
			width="100%"
			height="100%"
		>
			<path
				d="M 11.652055,80.048603
            Q 17.429027,62.971525 30.970571,74.872222 44.512115,86.772919 50.289088,69.695841
            L 43.818612,45.547695
            Q 38.041639,62.624773 24.500095,50.724076 10.958551,38.823379 5.1815788,55.900457
            L 18.122531,104.19675"
				stroke-width="8"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	</button>
</div>

<style>
	.controls {
		align-self: center;
		justify-self: center;
		width: 280px;
		height: 36px;
		display: flex;
		justify-content: space-between;
		margin-top: 10px;
	}

	button {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		border: 3px solid var(--color-border);
	}

	button:disabled {
		--color-text: var(--color-disabled-text);
		color: var(--color-disabled-text);
		background-color: var(--color-disabled-bg);
	}

	button:disabled:hover {
		background-color: var(--color-disabled-bg);
	}
</style>
