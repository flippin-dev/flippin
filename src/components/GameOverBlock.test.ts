import { render, screen } from '@testing-library/svelte';
import { expect, it } from 'vitest';
import { gameMode, hasDailyPuzzle } from '$src/stores/stores';
import GameOverBlock from '$com/GameOverBlock.svelte';

it('Game mode is "daily"', () => {
	// Set gameNumber to 1 so that the first daily puzzle is used
	hasDailyPuzzle.set(true);
	gameMode.set('daily');

	render(GameOverBlock);

	expect(screen.getByText('NEW PUZZLE IN:')).toBeInTheDocument();

	const shareButton = screen.getByRole('button', {
		hidden: true,
		name: 'copy game results to clipboard',
	});
	expect(shareButton).toBeInTheDocument();

	const randomButton = screen.getByRole('button', {
		hidden: true,
		name: 'start random freeplay puzzle',
	});
	expect(randomButton).toBeInTheDocument();
});

it('Game mode is "freeplay"', () => {
	// Set gameNumber to 1 so that there is a next daily puzzle
	hasDailyPuzzle.set(true);
	gameMode.set('freeplay');

	render(GameOverBlock);

	expect(screen.getByText('NEW PUZZLE IN:')).toBeInTheDocument();

	const shareButton = screen.queryByRole('button', {
		hidden: true,
		name: 'copy game results to clipboard',
	});
	expect(shareButton).toBeInTheDocument();

	const randomButton = screen.queryByRole('button', {
		hidden: true,
		name: 'start random freeplay puzzle',
	});
	expect(randomButton).not.toBeInTheDocument();
});
