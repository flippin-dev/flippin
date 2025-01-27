<!--
@component
A component that holds control buttons to change the selected freeplay puzzle.
-->

<script lang="ts">
	import {
		freeplayPuzzle,
		freeplayPuzzles,
		freeplayPuzzlesArray,
		freeplayPuzzlesIndex,
		hasChangedFreeplayPuzzle,
		shouldReset,
	} from '$src/stores/stores';
	import { navigateToolbar } from '$lib/page-utilities';
	import { get } from 'svelte/store';
	import { freeplayExample } from '$lib/puzzles';

	/** A binding for the toolbar element. */
	let toolbar: HTMLElement;

	// Prevent double touch from triggering an additional click event
	let touchRandomActive = false;
	let touchPreviousActive = false;
	let touchNextActive = false;

	let randomPuzzleHandler = () => {
		// Select a random puzzle
		freeplayPuzzlesIndex.set(
			Math.floor(Math.random() * $freeplayPuzzlesArray.length),
		);

		// Similar process to puzzle selection in settings
		const title = $freeplayPuzzlesArray[$freeplayPuzzlesIndex];
		const puzzle = $freeplayPuzzles.get(title);
		const serializedPuzzle = puzzle
			? { title: title, start: puzzle.start, end: puzzle.end }
			: freeplayExample;

		freeplayPuzzle.set(serializedPuzzle);

		// Fallback index in case the puzzle can't be found for some reason
		if (puzzle === undefined) {
			freeplayPuzzlesIndex.set(
				get(freeplayPuzzlesArray).findIndex(
					(title) => title === freeplayExample.title,
				),
			);
		}

		hasChangedFreeplayPuzzle.set(true);
		shouldReset.set(true);
	};
	let previousPuzzleHandler = () => {
		// Update puzzle index
		if (!isPreviousDisabled) {
			freeplayPuzzlesIndex.update((index) => index - 1);

			// Similar process to puzzle selection in settings
			const title = $freeplayPuzzlesArray[$freeplayPuzzlesIndex];
			const puzzle = $freeplayPuzzles.get(title);
			const serializedPuzzle = puzzle
				? { title: title, start: puzzle.start, end: puzzle.end }
				: freeplayExample;

			freeplayPuzzle.set(serializedPuzzle);

			// Fallback index in case the puzzle can't be found for some reason
			if (puzzle === undefined) {
				freeplayPuzzlesIndex.set(
					get(freeplayPuzzlesArray).findIndex(
						(title) => title === freeplayExample.title,
					),
				);
			}

			hasChangedFreeplayPuzzle.set(true);
			shouldReset.set(true);
		}
	};
	/** Click handler for next puzzle button. */
	let nextPuzzleHandler = () => {
		// Update puzzle index
		if (!isNextDisabled) {
			freeplayPuzzlesIndex.update((index) => index + 1);

			// Similar process to puzzle selection in settings
			const title = $freeplayPuzzlesArray[$freeplayPuzzlesIndex];
			const puzzle = $freeplayPuzzles.get(title);
			const serializedPuzzle = puzzle
				? { title: title, start: puzzle.start, end: puzzle.end }
				: freeplayExample;

			freeplayPuzzle.set(serializedPuzzle);

			// Fallback index in case the puzzle can't be found for some reason
			if (puzzle === undefined) {
				freeplayPuzzlesIndex.set(
					get(freeplayPuzzlesArray).findIndex(
						(title) => title === freeplayExample.title,
					),
				);
			}

			hasChangedFreeplayPuzzle.set(true);
			shouldReset.set(true);
		}
	};

	// Update toolbar values based on disabled elements
	$: isPreviousDisabled =
		$freeplayPuzzlesIndex <= 0 ||
		$freeplayPuzzlesIndex > $freeplayPuzzlesArray.length;
	$: isNextDisabled =
		$freeplayPuzzlesIndex < -1 ||
		$freeplayPuzzlesIndex >= $freeplayPuzzlesArray.length - 1;
	$: toolbarSize =
		isPreviousDisabled && isNextDisabled
			? 1
			: isPreviousDisabled || isNextDisabled
				? 2
				: 3;
</script>

<div
	bind:this={toolbar}
	data-toolbar-size={toolbarSize}
	data-toolbar-direction="vertical"
	role="toolbar"
	aria-controls="game-board"
	aria-label="freeplay game controls"
	class="controls"
>
	<button
		title="Random puzzle"
		data-toolbar-pos="0"
		on:click={() => (!touchRandomActive ? randomPuzzleHandler() : {})}
		on:keydown={(event) => navigateToolbar(event, toolbar)}
		on:touchstart|preventDefault={() => {
			touchRandomActive = true;
			randomPuzzleHandler();
		}}
		on:touchend={() => (touchRandomActive = false)}
	>
		<svg
			aria-hidden="true"
			viewBox="0 0 40.5014 46.562477"
			stroke="var(--color-text)"
			xmlns="http://www.w3.org/2000/svg"
			stroke-linecap="round"
			stroke-linejoin="round"
			width="75%"
			height="75%"
		>
			<g fill="none" stroke-width="2">
				<path
					d="m 0.661458,11.97135 19.588983,-11.3099 19.5895,11.3099 -19.5895,11.30991 z"
				/>
				<path
					d="m 20.250441,23.28126 19.5895,-11.30991 v 22.61981 l -19.5895,11.30991 z"
				/>
				<path
					d="M 0.661458,11.97135 20.250441,23.28126 V 45.90107 L 0.661458,34.59116 Z"
				/>
			</g>
			<g fill="var(--color-text)" stroke-width="0.75">
				<path
					d="m 22.380275,10.741835 c 1.176139,0.679046 1.176139,1.779994 0,2.459041 -1.176141,0.679047 -3.08303,0.679039 -4.259161,-8e-6 -1.176125,-0.679039 -1.176125,-1.779987 0,-2.459026 1.176131,-0.679047 3.08302,-0.679055 4.259161,-7e-6 z"
				/>
				<path
					d="m 32.174791,27.706694 c 0,1.358093 -0.953452,3.009515 -2.129608,3.688562 -1.176149,0.67904 -2.1296,0.128565 -2.1296,-1.22952 0,-1.358087 0.953451,-3.009516 2.1296,-3.688555 1.176156,-0.679048 2.129608,-0.128574 2.129608,1.229513 z"
				/>
				<path
					d="m 27.594774,35.524503 c 0,1.358087 -0.953452,3.009516 -2.12961,3.688555 -1.176148,0.679047 -2.1296,0.128574 -2.1296,-1.229513 0,-1.358094 0.953452,-3.009515 2.1296,-3.688562 1.176158,-0.67904 2.12961,-0.128566 2.12961,1.22952 z"
				/>
				<path
					d="m 36.754817,19.888884 c 0,1.358087 -0.953452,3.009508 -2.1296,3.688555 -1.176157,0.679046 -2.129608,0.128573 -2.129608,-1.229522 0,-1.358086 0.953451,-3.009508 2.129608,-3.688555 1.176148,-0.679048 2.1296,-0.128573 2.1296,1.229522 z"
				/>
				<path
					d="m 8.0055978,22.347929 c 0,1.358087 -0.9534319,1.908568 -2.1295515,1.229521 -1.1761185,-0.679046 -2.1295507,-2.330468 -2.1295507,-3.688554 0,-1.358095 0.9534322,-1.908569 2.1295507,-1.229522 1.1761196,0.679047 2.1295515,2.330468 2.1295515,3.688555 z"
				/>
				<path
					d="m 17.165403,37.983525 c 0,1.358095 -0.953436,1.908568 -2.129552,1.229521 -1.17612,-0.679048 -2.129552,-2.330468 -2.129552,-3.688555 0,-1.358095 0.953432,-1.908568 2.129552,-1.229521 1.176116,0.679048 2.129552,2.330469 2.129552,3.688555 z"
				/>
			</g>
		</svg>
	</button>

	<button
		title="Previous puzzle"
		data-toolbar-pos="1"
		on:click={() => (!touchPreviousActive ? previousPuzzleHandler() : {})}
		on:keydown={(event) => navigateToolbar(event, toolbar)}
		on:touchstart|preventDefault={() => {
			touchPreviousActive = true;
			previousPuzzleHandler();
		}}
		on:touchend={() => (touchPreviousActive = false)}
		disabled={isPreviousDisabled}
		aria-disabled={isPreviousDisabled}
	>
		<svg
			aria-hidden="true"
			viewBox="-2 -2 9.7777797 13.77778"
			fill="none"
			stroke="var(--color-text)"
			stroke-width="2.5"
			xmlns="http://www.w3.org/2000/svg"
			stroke-linecap="round"
			stroke-linejoin="round"
			width="75%"
			height="75%"
		>
			<path d="M 2.88889,10.38889 V -0.61110997" />
			<path
				d="M 6.3888901,2.8888897 2.8888902,-0.61110997 -0.61110997,2.8888902"
			/>
		</svg>
	</button>

	<button
		title="Next puzzle"
		data-toolbar-pos={isPreviousDisabled ? 1 : 2}
		on:click={() => (!touchNextActive ? nextPuzzleHandler() : {})}
		on:keydown={(event) => navigateToolbar(event, toolbar)}
		on:touchstart|preventDefault={() => {
			touchNextActive = true;
			nextPuzzleHandler();
		}}
		on:touchend={() => (touchNextActive = false)}
		disabled={isNextDisabled}
		aria-disabled={isNextDisabled}
	>
		<svg
			aria-hidden="true"
			viewBox="-2 -2 9.7777797 13.77778"
			fill="none"
			stroke="var(--color-text)"
			stroke-width="2.5"
			xmlns="http://www.w3.org/2000/svg"
			stroke-linecap="round"
			stroke-linejoin="round"
			width="75%"
			height="75%"
		>
			<path d="M 2.88889,10.38889 V -0.61110997" />
			<path
				d="M 6.3888901,6.8888903 2.8888902,10.38889 -0.61110997,6.8888898"
			/>
		</svg>
	</button>
</div>

<style>
	.controls {
		align-self: center;
		justify-self: center;
		width: 36px;
		height: 122px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin-bottom: 5px;
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
