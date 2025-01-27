<!--
@component
A component that holds various control buttons as well as the game timer.
-->

<script lang="ts">
	import Timer from '$com/Timer.svelte';
	import {
		currentScreen,
		gameMode,
		hasWon,
		shouldReset,
	} from '$src/stores/stores';
	import { maxTime, maxTimeMessage } from '$lib/time';
	import { navigateToolbar } from '$lib/page-utilities';
	import RestartableTimer from './RestartableTimer.svelte';

	/** A binding for the toolbar element. */
	let toolbar: HTMLElement;

	// Prevent double touch from triggering an additional click event
	let touchResetActive = false;

	$: isWonAndDaily = $hasWon && $gameMode === 'daily';
</script>

<div
	bind:this={toolbar}
	data-toolbar-size={isWonAndDaily ? 3 : 4}
	data-toolbar-direction="horizontal"
	role="toolbar"
	aria-controls="game-board"
	aria-label="game controls"
	class="controls"
>
	<button
		title="How to play"
		data-toolbar-pos="0"
		on:click={() => currentScreen.set('tutorial')}
		on:keydown={(event) => navigateToolbar(event, toolbar)}
	>
		<svg
			aria-hidden="true"
			viewBox="-2 -2 12 17"
			fill="none"
			stroke="var(--color-text)"
			xmlns="http://www.w3.org/2000/svg"
			width="90%"
			height="90%"
		>
			<path
				d="M0.5 4.5 A3.5 3.5 0 1 1 4 8 V9"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<circle cx="4" cy="12" r="0.75" stroke-width="1.5" />
		</svg>
	</button>

	<button
		title="Settings"
		data-toolbar-pos="1"
		on:click={() => currentScreen.set('settings')}
		on:keydown={(event) => navigateToolbar(event, toolbar)}
	>
		<svg
			aria-hidden="true"
			viewBox="-3 -3 6 6"
			fill="none"
			stroke="var(--color-text)"
			stroke-linecap="round"
			xmlns="http://www.w3.org/2000/svg"
			width="90%"
			height="90%"
		>
			<circle cx="0" cy="0" r="1" />
			<path
				d="
                M1.4979407787322998 -0.07850953936576843 L1.9972550868988037 -0.10466885566711426
                M0.38822856545448303 -1.4488887786865234 L0.517638087272644 -1.9318516254425049 
                M-1.2580000162124634 -0.8169616460800171 L-1.6773391962051392 -1.089273452758789
                M-1.165722131729126 0.94398432970047 L-1.5542904138565063 1.2586369514465332
                M0.5375528335571289 1.400375485420227 L0.7167364358901978 1.867156744003296
            "
			/>
		</svg>
	</button>

	<div role="timer" aria-label="game timer" class="timer-container">
		{#if $gameMode === 'daily'}
			<Timer interval={maxTime} message={maxTimeMessage} />
		{:else}
			<RestartableTimer interval={maxTime} message={maxTimeMessage} />
		{/if}
	</div>

	<button
		title="Stats"
		data-toolbar-pos="2"
		on:click={() => currentScreen.set('stats')}
		on:keydown={(event) => navigateToolbar(event, toolbar)}
	>
		<svg
			aria-hidden="true"
			viewBox="-0.6 -0.5 6 6"
			fill="none"
			stroke="var(--color-text)"
			stroke-linecap="round"
			xmlns="http://www.w3.org/2000/svg"
			width="90%"
			height="90%"
		>
			<path d="M1 2 V4 M2.5 1 V4 M4 3 V4" />
		</svg>
	</button>

	<button
		title="Reset the board"
		data-toolbar-pos="3"
		on:click={() => {
			if (!touchResetActive) {
				if (!isWonAndDaily) {
					shouldReset.set(true);
				}
			}
		}}
		on:keydown={(event) => navigateToolbar(event, toolbar)}
		on:touchstart|preventDefault={() => {
			touchResetActive = true;
			if (!isWonAndDaily) {
				shouldReset.set(true);
			}
		}}
		on:touchend={() => (touchResetActive = false)}
		disabled={isWonAndDaily}
		aria-disabled={isWonAndDaily}
	>
		<svg
			aria-hidden="true"
			viewBox="-3.75 -3.5 8 6.25"
			fill="none"
			stroke="var(--color-text)"
			stroke-linecap="round"
			xmlns="http://www.w3.org/2000/svg"
			height="100%"
			width="100%"
		>
			<path
				d="
                M-1.4142135381698608 -1.4142135381698608 
                A1.999999965771458 1.999999965771458 0 1 1 -1.4999996423721313 0.4999951720237732
                M-1.4142135381698608 -1.4142135381698608 L-0.4142089784145355 -1.4142135381698608
                M-1.4142135381698608 -1.4142135381698608 L-1.4142135381698608 -2.414217948913574
            "
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
		margin-bottom: 10px;
	}

	.timer-container {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0;
		width: 108px;
		height: 36px;
		font-size: 1.75rem;
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
