<!--
@component
A component that presents a congratulatory message, the time until the next daily puzzle, and a button to share game results.
-->

<script lang="ts">
	import Countdown from '$com/Countdown.svelte';
	import {
		dailyTitle,
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
	import { puzzles } from '$lib/puzzles';

	dayjs.extend(duration);

	const { curBoard, moveCount, resetCount, hintCount, hasSurrendered } =
		$gameDetails;

	let isPerfect = false;

	/**
	 * Calculate the game time in seconds.
	 *
	 * @returns {number} The game time in seconds or -1 if greater than or equal to the max time.
	 */
	function getTime(): number {
		const time = get(gameTime);

		if (time / 1000 >= maxTime) {
			return -1;
		}

		return time;
	}

	/**
	 * Copies a sharable summary of the game to the clipboard.
	 *
	 * @returns {void}
	 */
	function share(): void {
		const title = `Flippin #${get(gameNumber)}: ${get(dailyTitle)}`;
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
	 * @returns {string} An end of game message.
	 */
	function getMessage(): string {
		const time = getTime();
		const puzzleNumber = get(gameNumber);
		let minimalMoves = 0;
		if (puzzleNumber > 0 && puzzleNumber < puzzles.length + 1) {
			const puzzle = puzzles[puzzleNumber - 1];
			minimalMoves = findMinimalSolution(puzzle.start, puzzle.end).reduce(
				(sum, current) => sum + current,
				0,
			);
		}

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
</script>

<div
	role="region"
	aria-label="post-game info"
	class="game-over-block"
	class:reduced-motion={$reducedMotion}
>
	<div role="presentation" class="game-recap">
		{#if $gameMode === 'daily'}
			<p>
				<strong>{getMessage()}</strong>
			</p>

			<p>Moves: {moveCount}</p>
			<p>Resets: {resetCount}</p>
			<p>Hints: {hintCount}</p>
		{:else}
			<p>
				<strong>CONGRATULATIONS!</strong>
			</p>
		{/if}

		<p>NEW PUZZLE IN:</p>
	</div>

	<div
		role="timer"
		aria-label="countdown to next daily puzzle"
		class="countdown-container"
	>
		<Countdown message={countdownMessage} />
	</div>

	{#if $gameMode === 'daily'}
		<button
			title="Copy results to clipboard"
			on:click={share}
			aria-label="copy game results to clipboard"
		>
			Share
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

	.game-recap p:last-child {
		font-size: 1.25rem;
		margin-top: 10px;
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
		margin-top: 10px;
		padding: 0;
		width: 250px;
		height: 30px;
		border-radius: 5px;
		border: 3px solid var(--color-border);
		font-size: 1.5rem;
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
