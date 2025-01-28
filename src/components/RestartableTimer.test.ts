import { render, screen } from '@testing-library/svelte';
import { expect, it } from 'vitest';
import {
	currentScreen,
	freeplayGameTime,
	hasWonFreeplay,
	shouldResetFreeplayTimer,
} from '$src/stores/stores';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { countdownTimeZone } from '$lib/time';
import { tick } from 'svelte';
import RestartableTimer from '$com/RestartableTimer.svelte';
import { get } from 'svelte/store';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(countdownTimeZone);

beforeEach(() => {
	vi.useFakeTimers();
	shouldResetFreeplayTimer.set(false);
});

afterEach(() => {
	vi.runOnlyPendingTimers();
	vi.useRealTimers();
});

it('Normal time', async () => {
	currentScreen.set(null);
	freeplayGameTime.set(5000);
	hasWonFreeplay.set(false);

	render(RestartableTimer, { interval: 600, message: 'A lot!' });

	const timer = screen.getByText(/[0-9]{2}:[0-9]{2}/);

	expect(timer).toBeInTheDocument();
	expect(timer.innerHTML).toBe('00:05');

	vi.advanceTimersByTime(5000);

	await tick();

	expect(timer.innerHTML).toBe('00:10');
});

it('Out of time', async () => {
	currentScreen.set(null);
	freeplayGameTime.set(1000000);
	hasWonFreeplay.set(false);

	render(RestartableTimer, { interval: 600, message: 'A lot!' });

	vi.advanceTimersByTime(1000);

	await tick();

	const message = screen.getByText('A lot!');

	expect(message).toBeInTheDocument();

	vi.advanceTimersByTime(5000);

	await tick();

	expect(message).toBeInTheDocument();
});

it('Has won', async () => {
	currentScreen.set(null);
	freeplayGameTime.set(5000);
	hasWonFreeplay.set(true);

	render(RestartableTimer, { interval: 600, message: 'A lot!' });

	const timer = screen.getByText(/[0-9]{2}:[0-9]{2}/);

	expect(timer).toBeInTheDocument();
	expect(timer.innerHTML).toBe('00:05');

	vi.advanceTimersByTime(5000);

	await tick();

	expect(timer.innerHTML).toBe('00:05');
});

it('Has won after a long time', async () => {
	currentScreen.set(null);
	freeplayGameTime.set(1000000);
	hasWonFreeplay.set(true);

	render(RestartableTimer, { interval: 600, message: 'A lot!' });

	const message = screen.getByText('A lot!');

	expect(message).toBeInTheDocument();

	vi.advanceTimersByTime(5000);

	await tick();

	expect(message).toBeInTheDocument();
});

it('Dialog behavior', async () => {
	currentScreen.set('tutorial');
	freeplayGameTime.set(5000);
	hasWonFreeplay.set(false);

	render(RestartableTimer, { interval: 600, message: 'A lot!' });

	const timer = screen.getByText(/[0-9]{2}:[0-9]{2}/);

	expect(timer).toBeInTheDocument();
	expect(timer.innerHTML).toBe('00:05');

	vi.advanceTimersByTime(5000);

	await tick();

	expect(timer.innerHTML).toBe('00:05');

	currentScreen.set(null);
	vi.advanceTimersByTime(5000);

	await tick();

	expect(timer.innerHTML).toBe('00:10');
});

it('Restart behavior', async () => {
	currentScreen.set(null);
	freeplayGameTime.set(5000);
	hasWonFreeplay.set(false);

	render(RestartableTimer, { interval: 600, message: 'A lot!' });

	const timer = screen.getByText(/[0-9]{2}:[0-9]{2}/);

	expect(timer).toBeInTheDocument();
	expect(timer.innerHTML).toBe('00:05');

	vi.advanceTimersByTime(5000);

	await tick();

	expect(timer.innerHTML).toBe('00:10');

	shouldResetFreeplayTimer.set(true);

	await tick();

	expect(get(shouldResetFreeplayTimer)).toBe(false);
	expect(get(freeplayGameTime)).toBe(0);

	vi.advanceTimersByTime(5000);

	await tick();

	expect(get(freeplayGameTime)).toBe(5000);
	expect(timer.innerHTML).toBe('00:05');
});
