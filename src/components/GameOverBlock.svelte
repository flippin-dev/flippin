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

	dayjs.extend(duration);

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
		const title = `I beat Flippin #${get(gameNumber)}: ${get(dailyTitle)}`;
		const storedTime = getTime();
		const time =
			storedTime > 0
				? dayjs.duration(storedTime).format(timerFormat)
				: maxTimeMessage;
		const board = get(gameDetails).curBoard;

		if (board === null) {
			toastAndAlert('Could not find board image', {
				theme: { '--toastBackground': 'var(--error-color)' },
			});
			return;
		}

		let output = '';
		for (let i = 0; i < board.length; i++) {
			if (i % boardSize === 0 && i !== 0) {
				output += '\n';
			}
			output += board[i] === '0' ? '🟥' : board[i] === '1' ? '🟩' : '🟦';
		}

		let text = `${title}\nTime: ${time}\n${output}`;

		navigator.clipboard.writeText(text).then(
			() => toastAndAlert('Results copied to clipboard'),
			() =>
				toastAndAlert('Could not complete action', {
					theme: { '--toastBackground': 'var(--error-color)' },
				}),
		);
	}
</script>

<div
	role="region"
	aria-label="post-game info"
	class="game-over-block"
	class:reduced-motion={$reducedMotion}
>
	<div role="presentation" class="congratulations">
		<strong>Congratulations!</strong>
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

	.congratulations {
		font-size: 1.5rem;
		text-align: center;
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

	@keyframes flip-reveal {
		0% {
			transform: rotateX(180deg);
		}
		100% {
			transform: rotateX(360deg);
		}
	}
</style>
