<!--
@component
A component that presents a restartable timer for freeplay puzzles with a message once the time limit is reached.

@example
```svelte
<RestartableTimer interval={600} message={"A lot!"}/>
```
-->

<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import dayjs from 'dayjs';
	import duration from 'dayjs/plugin/duration';
	import {
		freeplayGameTime,
		hasWonFreeplay,
		shouldResetFreeplayTimer,
	} from '$src/stores/stores';
	import { currentScreen } from '$src/stores/stores';
	import { timerFormat } from '$lib/time';

	/** The time limit for the timer. */
	export let interval: number;
	/** A message to display once the time limit is reached. */
	export let message: string;

	/** The interval ID. */
	let timerInterval: number;
	/** Whether or not the interval is complete. */
	let isMaxed = false;

	/**
	 * Set the interval for the timer element.
	 */
	function startTimer() {
		timerInterval = setInterval(() => {
			if (!$hasWonFreeplay && !isMaxed && $currentScreen === null) {
				// Advance time by a second
				freeplayGameTime.update((gameTime) => gameTime + 1000);

				if ($freeplayGameTime >= interval * 1000) {
					clearInterval(timerInterval);
					isMaxed = true;
				}
			}
		}, 1000);
	}

	onMount(() => {
		startTimer();
	});

	dayjs.extend(duration);
	/** The game time represented as a duration. */
	$: remaining = dayjs.duration($freeplayGameTime);

	$: if ($hasWonFreeplay) {
		if ($freeplayGameTime >= interval * 1000) {
			isMaxed = true;
		}
		clearInterval(timerInterval);
	}

	$: if ($shouldResetFreeplayTimer) {
		// Clear flag
		shouldResetFreeplayTimer.set(false);

		clearInterval(timerInterval);

		freeplayGameTime.set(0);

		startTimer();
	}

	onDestroy(() => {
		clearInterval(timerInterval);
	});
</script>

{#if isMaxed && message}
	{message}
{:else}
	{remaining.format(timerFormat)}
{/if}
