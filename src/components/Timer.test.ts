import { render, screen } from '@testing-library/svelte';
import { expect, it } from 'vitest';
import { currentScreen, gameTime, hasWon } from '$src/stores/stores';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import * as time from '$src/lib/time';
import { tick } from 'svelte';
import Timer from './Timer.svelte';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(time.countdownTimeZone);

beforeEach(() => {
	vi.useFakeTimers();
});

afterEach(() => {
	vi.runOnlyPendingTimers();
	vi.useRealTimers();
});

it('Normal time', async () => {
	currentScreen.set(null);
	gameTime.set(5000);
	hasWon.set(false);

	render(Timer, { interval: 600, message: 'A lot!' });

	const timer = screen.getByText(/[0-9]{2}:[0-9]{2}/);

	expect(timer).toBeInTheDocument();
	expect(timer.innerHTML).toBe('00:05');

	vi.advanceTimersByTime(5000);

	await tick();

	expect(timer.innerHTML).toBe('00:10');
});

it('Out of time', async () => {
	currentScreen.set(null);
	gameTime.set(1000000);
	hasWon.set(false);

	render(Timer, { interval: 600, message: 'A lot!' });

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
	gameTime.set(5000);
	hasWon.set(true);

	render(Timer, { interval: 600, message: 'A lot!' });

	const timer = screen.getByText(/[0-9]{2}:[0-9]{2}/);

	expect(timer).toBeInTheDocument();
	expect(timer.innerHTML).toBe('00:05');

	vi.advanceTimersByTime(5000);

	await tick();

	expect(timer.innerHTML).toBe('00:05');
});

it('Dialog behavior', async () => {
	currentScreen.set('tutorial');
	gameTime.set(5000);
	hasWon.set(false);

	render(Timer, { interval: 600, message: 'A lot!' });

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
