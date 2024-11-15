import { expect, it } from 'vitest';
import { findMinimalSolution, isPuzzleSolvable, mod, modV } from '$lib/math';

describe('Mod', () => {
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
});

describe('Vector mod', () => {
	it('Mod of vector elements in range does not change', () => {
		expect(modV([0, 1, 2], 3)).toEqual([0, 1, 2]);
	});

	it('Mod of vector elements below range is in range', () => {
		expect(modV([-1, -2, -3], 3)).toEqual([2, 1, 0]);
	});

	it('Mod of vector elements above range is in range', () => {
		expect(modV([4, 5, 6], 3)).toEqual([1, 2, 0]);
	});

	it('Modulus less than one throws error', () => {
		expect(() => modV([1, 1, 1], -1)).toThrowError(RangeError);
	});
});

describe('Solvability', () => {
	it('Solvable puzzle returns true', () => {
		expect(
			isPuzzleSolvable(
				'1011110111112101211101210',
				'0202002020000001000101110',
			),
		).toBe(true);
	});

	it('Unsolvable puzzle returns false', () => {
		expect(
			isPuzzleSolvable(
				'1011110111112101211101210',
				'0011110111112101211101210',
			),
		).toBe(false);
	});
});

describe('Minimal solution', () => {
	it('Solvable puzzle returns solution', () => {
		expect(
			findMinimalSolution(
				'1011110111112101211101210',
				'0202002020000001000101110',
			),
		).toEqual([
			2, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0,
		]);
	});

	it('Unsolvable puzzle returns empty array', () => {
		expect(
			findMinimalSolution(
				'1011110111112101211101210',
				'0011110111112101211101210',
			),
		).toEqual([]);
	});
});
