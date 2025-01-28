import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import {
	freeplayPuzzlesArray,
	freeplayPuzzlesIndex,
	gameMode,
	hasChangedFreeplayPuzzle,
} from '$src/stores/stores';
import FreeplayControls from '$com/FreeplayControls.svelte';
import { get } from 'svelte/store';

beforeEach(() => {
	gameMode.set('freeplay');
	hasChangedFreeplayPuzzle.set(false);
});

describe('Disable logic', () => {
	it('No previous puzzle available', () => {
		freeplayPuzzlesIndex.set(0);

		render(FreeplayControls);

		const toolbar = screen.getByRole('toolbar', {
			name: 'freeplay game controls',
		});
		const randomButton = screen.getByRole('button', { name: 'Random puzzle' });
		const previousButton = screen.getByRole('button', {
			name: 'Previous puzzle',
		});
		const nextButton = screen.getByRole('button', { name: 'Next puzzle' });

		expect(toolbar).toHaveAttribute('data-toolbar-size', '2');
		expect(randomButton).not.toBeDisabled();
		expect(previousButton).toBeDisabled();
		expect(nextButton).not.toBeDisabled();
	});

	it('No next puzzle available', () => {
		freeplayPuzzlesIndex.set(get(freeplayPuzzlesArray).length - 1);

		render(FreeplayControls);

		const toolbar = screen.getByRole('toolbar', {
			name: 'freeplay game controls',
		});
		const randomButton = screen.getByRole('button', { name: 'Random puzzle' });
		const previousButton = screen.getByRole('button', {
			name: 'Previous puzzle',
		});
		const nextButton = screen.getByRole('button', { name: 'Next puzzle' });

		expect(toolbar).toHaveAttribute('data-toolbar-size', '2');
		expect(randomButton).not.toBeDisabled();
		expect(previousButton).not.toBeDisabled();
		expect(nextButton).toBeDisabled();
	});
});

describe('Button logic', () => {
	it('Random', async () => {
		const user = userEvent.setup();

		expect(get(hasChangedFreeplayPuzzle)).toBe(false);

		render(FreeplayControls);

		await user.click(screen.getByRole('button', { name: 'Random puzzle' }));

		expect(get(hasChangedFreeplayPuzzle)).toBe(true);
	});

	it('Previous', async () => {
		const user = userEvent.setup();
		freeplayPuzzlesIndex.set(1);

		expect(get(freeplayPuzzlesIndex)).toBe(1);
		expect(get(hasChangedFreeplayPuzzle)).toBe(false);

		render(FreeplayControls);

		await user.click(screen.getByRole('button', { name: 'Previous puzzle' }));

		expect(get(freeplayPuzzlesIndex)).toBe(0);
		expect(get(hasChangedFreeplayPuzzle)).toBe(true);
	});

	it('Next', async () => {
		const user = userEvent.setup();
		freeplayPuzzlesIndex.set(0);

		expect(get(freeplayPuzzlesIndex)).toBe(0);
		expect(get(hasChangedFreeplayPuzzle)).toBe(false);

		render(FreeplayControls);

		await user.click(screen.getByRole('button', { name: 'Next puzzle' }));

		expect(get(freeplayPuzzlesIndex)).toBe(1);
		expect(get(hasChangedFreeplayPuzzle)).toBe(true);
	});
});
