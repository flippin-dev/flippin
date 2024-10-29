<!--
@component
A component that presents a timer for the daily puzzle with a message once the time limit is reached.

@example
```svelte
<Timer interval={600} message={"A lot!"}/>
```
-->

<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import dayjs from 'dayjs';
	import duration from 'dayjs/plugin/duration';
	import { gameTime, hasWon } from '$src/stores/stores';
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

	onMount(() => {
		timerInterval = setInterval(() => {
			if ($currentScreen === null) {
				// Advance time by a second
				gameTime.update((gameTime) => gameTime + 1000);

				if ($gameTime >= interval * 1000) {
					clearInterval(timerInterval);
					isMaxed = true;
				}
			}
		}, 1000);
	});

	dayjs.extend(duration);
	/** The game time represented as a duration. */
	$: remaining = dayjs.duration($gameTime);

	$: if ($hasWon) {
		clearInterval(timerInterval);
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
