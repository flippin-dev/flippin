import { expect, it } from 'vitest';
import { getDaysFromStart } from '$lib/time';

beforeEach(() => {
	vi.useFakeTimers();
});

afterEach(() => {
	vi.useRealTimers();
});

it('Days from start is negative', () => {
	const mockDate = new Date(2024, 0, 1);
	vi.setSystemTime(mockDate);

	expect(getDaysFromStart()).toBeLessThan(0);
});

it('Days from start is positive', () => {
	const mockDate = new Date(2024, 11, 31);
	vi.setSystemTime(mockDate);

	expect(getDaysFromStart()).toBeGreaterThan(0);
});

it('Days from start on starting date', () => {
	const mockDate = new Date(2024, 9, 28);
	vi.setSystemTime(mockDate);

	expect(getDaysFromStart()).toBe(1);
});
