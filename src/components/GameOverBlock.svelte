<!--
@component
A component that presents a congratulatory message, the time until the next daily puzzle, and a button to share game results.
-->

<script lang="ts">
	import Countdown from '$com/Countdown.svelte';
	import {
		customPrefix,
		dailyTitle,
		freeplayGameDetails,
		freeplayGameTime,
		freeplayPuzzle,
		freeplayPuzzles,
		freeplayPuzzlesArray,
		freeplayPuzzlesIndex,
		gameDetails,
		gameMode,
		gameNumber,
		gameTime,
		reducedMotion,
	} from '$src/stores/stores';
	import { boardSize } from '$lib/game';
	import dayjs from 'dayjs';
	import duration from 'dayjs/plugin/duration';
	import { get } from 'svelte/store';
	import {
		countdownMessage,
		maxTime,
		maxTimeMessage,
		timerFormat,
	} from '$lib/time';
	import { toastAndAlert } from '$lib/page-utilities';
	import { findMinimalSolution } from '$lib/math';
	import { freeplayExample, puzzles } from '$lib/puzzles';

	dayjs.extend(duration);

	let { curBoard, moveCount, resetCount, hintCount, hasSurrendered } =
		get(gameDetails);

	$: if ($gameMode === 'daily') {
		({ curBoard, moveCount, resetCount, hintCount, hasSurrendered } =
			$gameDetails);
	}

	$: if ($gameMode === 'freeplay') {
		({ curBoard, moveCount, resetCount, hintCount, hasSurrendered } =
			$freeplayGameDetails);
	}

	let isPerfect = false;
	// Update values going from freeplay back to daily
	$: gameMessage = getMessage($gameMode);

	/**
	 * Calculate the game time in seconds.
	 *
	 * @returns {number} The game time in seconds or -1 if greater than or equal to the max time.
	 */
	function getTime(): number {
		const time =
			get(gameMode) === 'daily' ? get(gameTime) : get(freeplayGameTime);

		if (time / 1000 >= maxTime) {
			return -1;
		}

		return time;
	}

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

	/**
	 * Copies a sharable summary of the game to the clipboard.
	 *
	 * @returns {void}
	 */
	function share(): void {
		const subtitle =
			get(gameMode) === 'daily'
				? `#${get(gameNumber)}: ${get(dailyTitle)}`
				: removeCustomPrefix(get(freeplayPuzzle).title);
		const title = `Flippin ${subtitle}`;
		const url = 'https://flippin-dev.github.io/flippin/';
		const storedTime = getTime();
		const time =
			storedTime > 0
				? dayjs.duration(storedTime).format(timerFormat)
				: maxTimeMessage;

		if (curBoard === null) {
			toastAndAlert('Could not find board image', {
				theme: { '--toastBackground': 'var(--error-color)' },
			});
			return;
		}

		let output = '';
		for (let i = 0; i < curBoard.length; i++) {
			if (i % boardSize === 0 && i !== 0) {
				output += '\n';
			}
			output += curBoard[i] === '0' ? '🟥' : curBoard[i] === '1' ? '🟩' : '🟦';
		}

		let text = `${title}\n${output}\nTime: ${time}${hasSurrendered ? ' 🏳' : ''}\nMoves: ${moveCount ?? ''}${!hasSurrendered && isPerfect ? ' ⭐' : ''}\nResets: ${resetCount ?? ''}\nHints: ${hintCount ?? ''}\n\n${url}`;

		navigator.clipboard.writeText(text).then(
			() => toastAndAlert('Results copied to clipboard'),
			() =>
				toastAndAlert('Could not complete action', {
					theme: { '--toastBackground': 'var(--error-color)' },
				}),
		);
	}

	/**
	 * Pick an appropriate end of game message based on stats for daily game.
	 *
	 * @param {string} mode The game mode.
	 *
	 * @returns {string} An end of game message.
	 */
	function getMessage(mode: string): string {
		const time = getTime();

		let minimalMoves = 0;
		if (mode === 'daily') {
			const puzzleNumber = get(gameNumber);

			if (puzzleNumber > 0 && puzzleNumber < puzzles.length + 1) {
				const puzzle = puzzles[puzzleNumber - 1];
				minimalMoves = findMinimalSolution(puzzle.start, puzzle.end).reduce(
					(sum, current) => sum + current,
					0,
				);
			}
		} else {
			const puzzle = get(freeplayPuzzle);
			minimalMoves = findMinimalSolution(puzzle.start, puzzle.end).reduce(
				(sum, current) => sum + current,
				0,
			);
		}

		isPerfect = false;

		if (hasSurrendered) {
			return 'NEXT TIME!';
		}

		if (moveCount === minimalMoves && hintCount === 0) {
			isPerfect = true;
			return 'PERFECT!';
		}

		if (time < 0) {
			return 'SLOW AND STEADY!';
		}

		if (time / 1000 <= 60) {
			return 'SPEEDY!';
		}

		if (hintCount === 0) {
			return 'NO HELP NEEDED!';
		}

		return 'CONGRATULATIONS!';
	}

	let randomFreeplayHandler = () => {
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

		gameMode.set('freeplay');
	};
</script>

<div
	role="region"
	aria-label="post-game info"
	class="game-over-block"
	class:reduced-motion={$reducedMotion}
>
	<div role="presentation" class="game-recap">
		<p>
			<strong>{gameMessage}</strong>
		</p>

		<p>Moves: {moveCount}</p>
		<p>Resets: {resetCount}</p>
		<p>Hints: {hintCount}</p>
	</div>

	<button
		class="share-button"
		title="Copy results to clipboard"
		on:click={share}
		aria-label="copy game results to clipboard"
	>
		Share
	</button>

	<p class="label-text">NEW PUZZLE IN:</p>

	<div
		role="timer"
		aria-label="countdown to next daily puzzle"
		class="countdown-container"
	>
		<Countdown message={countdownMessage} />
	</div>

	{#if $gameMode === 'daily'}
		<p class="label-text">OR TRY FREEPLAY!</p>

		<button
			title="Start random freeplay puzzle"
			on:click={randomFreeplayHandler}
			aria-label="start random freeplay puzzle"
		>
			Play
		</button>
	{/if}
</div>

<style>
	.game-over-block {
		align-self: center;
		width: 250px;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 10px 0;
		backface-visibility: hidden;
		animation-fill-mode: both;
		animation: flip-reveal 2s;
	}

	.reduced-motion {
		animation: none;
	}

	.game-recap {
		text-align: center;
	}

	.game-recap p:first-child {
		font-size: 1.5rem;
	}

	.label-text {
		font-size: 1.25rem;
		margin-top: 10px;
		margin-bottom: 0;
	}

	.game-recap p {
		margin: 0;
	}

	.countdown-container {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0;
		height: 30px;
		font-size: 1.5rem;
	}

	button {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0;
		width: 250px;
		height: 30px;
		border-radius: 5px;
		border: 3px solid var(--color-border);
		font-size: 1.5rem;
	}

	.share-button {
		margin-top: 10px;
		margin-bottom: 5px;
	}

	@keyframes flip-reveal {
		0% {
			transform: rotateX(180deg);
		}
		100% {
			transform: rotateX(360deg);
		}
	}
</style>
