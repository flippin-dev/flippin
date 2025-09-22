import { expect, it } from 'vitest';
import { puzzles } from '$lib/puzzles';
import { isPuzzleSolvable } from './math';

it('Unqiue puzzle titles', () => {
	const uniqueValues = new Set();
	const duplicates = [];

	for (const { title } of puzzles) {
		if (!uniqueValues.has(title)) {
			uniqueValues.add(title);
		} else {
			duplicates.push(title);
		}
	}

	expect(duplicates).toHaveLength(0);
});

it('Solvable puzzles', () => {
	const solvable = new Set();
	const unsolvable = [];

	for (const { title, start, end } of puzzles) {
		if (isPuzzleSolvable(start, end)) {
			solvable.add(title);
		} else {
			unsolvable.push(title);
		}
	}

	expect(unsolvable).toHaveLength(0);
});
