import { expect, it } from 'vitest';
import { isPuzzleSolvable, mod } from '$lib/puzzles';

it('Mod of number in range does not change', () => {
	expect(mod(0, 3)).toBe(0);
});

it('Mod of number below range is in range', () => {
	expect(mod(-1, 3)).toBe(2);
});

it('Mod of number above range is in range', () => {
	expect(mod(5, 3)).toBe(2);
});

it('Modulus less than one throws error', () => {
	expect(() => mod(3, -1)).toThrowError(RangeError);
});

it('Solvable puzzle returns true', () => {
	expect(
		isPuzzleSolvable('1011110111112101211101210', '0202002020000001000101110'),
	).toBe(true);
});

it('Unsolvable puzzle returns false', () => {
	expect(
		isPuzzleSolvable('1011110111112101211101210', '0011110111112101211101210'),
	).toBe(false);
});
