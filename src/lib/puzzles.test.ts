import { expect, it } from 'vitest';
import { puzzles } from '$lib/puzzles';

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
