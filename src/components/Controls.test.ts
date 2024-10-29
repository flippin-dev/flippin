import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import {
	currentScreen,
	gameMode,
	hasWon,
	shouldReset,
} from '$src/stores/stores';
import Controls from '$com/Controls.svelte';
import { get } from 'svelte/store';

describe('Win update logic', () => {
	it('Has not won when game mode is "daily"', () => {
		hasWon.set(false);
		gameMode.set('daily');

		render(Controls);

		const toolbar = screen.getByRole('toolbar', { name: 'game controls' });
		const resetButton = screen.getByRole('button', { name: 'Reset the board' });

		expect(toolbar).toHaveAttribute('data-toolbar-size', '4');
		expect(resetButton).not.toBeDisabled();
	});

	it('Has won when game mode is "daily"', () => {
		hasWon.set(true);
		gameMode.set('daily');

		render(Controls);

		const toolbar = screen.getByRole('toolbar', { name: 'game controls' });
		const resetButton = screen.getByRole('button', { name: 'Reset the board' });

		expect(toolbar).toHaveAttribute('data-toolbar-size', '3');
		expect(resetButton).toBeDisabled();
	});

	it('Has not won when game mode is "freeplay"', () => {
		hasWon.set(false);
		gameMode.set('freeplay');

		render(Controls);

		const toolbar = screen.getByRole('toolbar', { name: 'game controls' });
		const resetButton = screen.getByRole('button', { name: 'Reset the board' });

		expect(toolbar).toHaveAttribute('data-toolbar-size', '4');
		expect(resetButton).not.toBeDisabled();
	});

	it('Has won when game mode is "freeplay"', () => {
		hasWon.set(true);
		gameMode.set('freeplay');

		render(Controls);

		const toolbar = screen.getByRole('toolbar', { name: 'game controls' });
		const resetButton = screen.getByRole('button', { name: 'Reset the board' });

		expect(toolbar).toHaveAttribute('data-toolbar-size', '4');
		expect(resetButton).not.toBeDisabled();
	});
});

describe('Button logic', () => {
	it('Tutorial', async () => {
		const user = userEvent.setup();
		currentScreen.set(null);

		expect(get(currentScreen)).toBeNull();

		render(Controls);

		await user.click(screen.getByRole('button', { name: 'How to play' }));

		expect(get(currentScreen)).toBe('tutorial');
	});

	it('Settings', async () => {
		const user = userEvent.setup();
		currentScreen.set(null);

		expect(get(currentScreen)).toBeNull();

		render(Controls);

		await user.click(screen.getByRole('button', { name: 'Settings' }));

		expect(get(currentScreen)).toBe('settings');
	});

	it('Stats', async () => {
		const user = userEvent.setup();
		currentScreen.set(null);

		expect(get(currentScreen)).toBeNull();

		render(Controls);

		await user.click(screen.getByRole('button', { name: 'Stats' }));

		expect(get(currentScreen)).toBe('stats');
	});

	it('Reset', async () => {
		const user = userEvent.setup();
		currentScreen.set(null);
		shouldReset.set(false);
		hasWon.set(false);

		expect(get(currentScreen)).toBeNull();
		expect(get(shouldReset)).toBe(false);

		render(Controls);

		await user.click(screen.getByRole('button', { name: 'Reset the board' }));

		expect(get(shouldReset)).toBe(true);
	});
});
