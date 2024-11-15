import { render, screen } from '@testing-library/svelte';
import { expect, it } from 'vitest';
import { gameNumber } from '$src/stores/stores';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import * as time from '$lib/time';
import Countdown from '$com/Countdown.svelte';
import { tick } from 'svelte';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(time.countdownTimeZone);

const daysFromStartSpy = vi.spyOn(time, 'getDaysFromStart');
daysFromStartSpy.mockImplementation(() => 1);

beforeEach(() => {
	vi.useFakeTimers();
});

afterEach(() => {
	vi.runOnlyPendingTimers();
	vi.useRealTimers();
	daysFromStartSpy.mockClear();
});

describe('Win update logic', () => {
	it('Countdown progression', async () => {
		const sampleDate = new Date(dayjs.tz('2024-10-28 00:00:00').valueOf());
		vi.setSystemTime(sampleDate);
		gameNumber.set(1);

		render(Countdown, { message: 'Countdown is over!' });

		const timer = screen.getByText(/[0-9]{2}:[0-9]{2}:[0-9]{2}/);

		expect(timer).toBeInTheDocument();
		expect(timer.innerHTML).toBe('23:59:59');

		vi.advanceTimersByTime(5000);

		await tick();

		expect(timer.innerHTML).toBe('23:59:54');
	});

	it('Countdown end', async () => {
		const sampleDate = new Date(dayjs.tz('2024-10-28 23:59:59').valueOf());
		vi.setSystemTime(sampleDate);
		gameNumber.set(1);

		render(Countdown, { message: 'Countdown is over!' });

		const timer = screen.getByText(/[0-9]{2}:[0-9]{2}:[0-9]{2}/);

		expect(timer).toBeInTheDocument();
		expect(timer.innerHTML).toBe('00:00:00');

		vi.advanceTimersByTime(1000);

		await tick();

		expect(timer).toHaveTextContent('Countdown is over!');
	});
});
