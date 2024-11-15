import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import {
	currentScreen,
	gameMode,
	hasWon,
	hasWonFreeplay,
	hintActive,
	needsHint,
} from '$src/stores/stores';
import ExtraControls from '$com/ExtraControls.svelte';
import { get } from 'svelte/store';

beforeEach(() => {
	hasWon.set(false);
	hasWonFreeplay.set(false);
	hintActive.set(false);
	needsHint.set(false);
});

describe('Disable logic', () => {
	it('Has not won when game mode is "daily"', () => {
		hasWon.set(false);
		gameMode.set('daily');

		render(ExtraControls);

		const toolbar = screen.getByRole('toolbar', {
			name: 'extra game controls',
		});
		const hintButton = screen.getByRole('button', { name: 'Hint' });
		const surrenderButton = screen.getByRole('button', { name: 'Surrender' });

		expect(toolbar).toHaveAttribute('data-toolbar-size', '2');
		expect(hintButton).not.toBeDisabled();
		expect(surrenderButton).not.toBeDisabled();
	});

	it('Has won when game mode is "daily"', () => {
		hasWon.set(true);
		gameMode.set('daily');

		render(ExtraControls);

		const toolbar = screen.getByRole('toolbar', {
			name: 'extra game controls',
		});
		const hintButton = screen.getByRole('button', { name: 'Hint' });
		const surrenderButton = screen.getByRole('button', { name: 'Surrender' });

		expect(toolbar).toHaveAttribute('data-toolbar-size', '0');
		expect(hintButton).toBeDisabled();
		expect(surrenderButton).toBeDisabled();
	});

	it('Has not won when game mode is "freeplay"', () => {
		hasWonFreeplay.set(false);
		gameMode.set('freeplay');

		render(ExtraControls);

		const toolbar = screen.getByRole('toolbar', {
			name: 'extra game controls',
		});
		const hintButton = screen.getByRole('button', { name: 'Hint' });
		const surrenderButton = screen.getByRole('button', { name: 'Surrender' });

		expect(toolbar).toHaveAttribute('data-toolbar-size', '2');
		expect(hintButton).not.toBeDisabled();
		expect(surrenderButton).not.toBeDisabled();
	});

	it('Has won when game mode is "freeplay"', () => {
		hasWonFreeplay.set(true);
		gameMode.set('freeplay');

		render(ExtraControls);

		const toolbar = screen.getByRole('toolbar', {
			name: 'extra game controls',
		});
		const hintButton = screen.getByRole('button', { name: 'Hint' });
		const surrenderButton = screen.getByRole('button', { name: 'Surrender' });

		expect(toolbar).toHaveAttribute('data-toolbar-size', '0');
		expect(hintButton).toBeDisabled();
		expect(surrenderButton).toBeDisabled();
	});

	it('Hint active when game mode is "daily"', () => {
		hintActive.set(true);
		gameMode.set('daily');

		render(ExtraControls);

		const toolbar = screen.getByRole('toolbar', {
			name: 'extra game controls',
		});
		const hintButton = screen.getByRole('button', { name: 'Hint' });
		const surrenderButton = screen.getByRole('button', { name: 'Surrender' });

		expect(toolbar).toHaveAttribute('data-toolbar-size', '0');
		expect(hintButton).toBeDisabled();
		expect(surrenderButton).toBeDisabled();
	});

	it('Hint active when game mode is "freeplay"', () => {
		hintActive.set(true);
		gameMode.set('freeplay');

		render(ExtraControls);

		const toolbar = screen.getByRole('toolbar', {
			name: 'extra game controls',
		});
		const hintButton = screen.getByRole('button', { name: 'Hint' });
		const surrenderButton = screen.getByRole('button', { name: 'Surrender' });

		expect(toolbar).toHaveAttribute('data-toolbar-size', '0');
		expect(hintButton).toBeDisabled();
		expect(surrenderButton).toBeDisabled();
	});
});

describe('Button logic', () => {
	it('Hint', async () => {
		const user = userEvent.setup();

		expect(get(needsHint)).toBe(false);

		render(ExtraControls);

		await user.click(screen.getByRole('button', { name: 'Hint' }));

		expect(get(needsHint)).toBe(true);
	});

	it('Surrender', async () => {
		const user = userEvent.setup();
		currentScreen.set(null);

		expect(get(hintActive)).toBe(false);

		render(ExtraControls);

		await user.click(screen.getByRole('button', { name: 'Surrender' }));

		expect(get(currentScreen)).toBe('surrender');
	});
});
