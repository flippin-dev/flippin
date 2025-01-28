<!--
@component
A component that presents a countdown until the next daily puzzle.

@example
```svelte
<Countdown message={"Countdown is over!"}/>
```
-->

<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import dayjs from 'dayjs';
	import utc from 'dayjs/plugin/utc';
	import duration from 'dayjs/plugin/duration';
	import timezone from 'dayjs/plugin/timezone';
	import {
		countdownFormat,
		countdownTimeZone,
		getDaysFromStart,
	} from '$lib/time';
	import { gameNumber } from '$src/stores/stores';
	import { get } from 'svelte/store';

	/** The message to display when the timer elapses. */
	export let message: string;

	dayjs.extend(utc);
	dayjs.extend(timezone);
	dayjs.tz.setDefault(countdownTimeZone);

	/** The interval ID. */
	let timerInterval: number;
	/** Whether or not the interval is complete. */
	let isDone = false;

	/** The end of today. */
	const endDate = dayjs.tz().endOf('d');
	/** The difference between the end of today and now. */
	let time = endDate.diff(dayjs.tz());

	dayjs.extend(duration);
	/** The time difference represented as a duration. */
	$: remaining = dayjs.duration(time);

	onMount(() => {
		// Don't start the timer if the end of day was already reached during this session
		if (time <= 0 || get(gameNumber) < getDaysFromStart()) {
			isDone = true;
			return;
		}

		timerInterval = setInterval(() => {
			time = endDate.diff(dayjs.tz());

			if (time <= 0) {
				isDone = true;
			}
		}, 1000);
	});

	onDestroy(() => {
		clearInterval(timerInterval);
	});
</script>

{#if isDone && message}
	<!-- Force a hard refresh so that the stores reinitialize -->
	<a class="redirect-link" data-sveltekit-reload href="/flippin/">{message}</a>
{:else}
	{remaining.format(countdownFormat)}
{/if}

<style>
	.redirect-link {
		font-size: 1.1rem;
	}
</style>
