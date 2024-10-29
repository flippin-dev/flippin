import { render, screen } from '@testing-library/svelte';
import { expect, it } from 'vitest';
import { gameMode } from '$src/stores/stores';
import GameOverBlock from '$com/GameOverBlock.svelte';

it('Game mode is "daily"', () => {
	gameMode.set('daily');

	render(GameOverBlock);

	expect(screen.getByText('Congratulations!')).toBeInTheDocument();

	const shareButton = screen.getByRole('button', {
		hidden: true,
		name: 'copy game results to clipboard',
	});
	expect(shareButton).toBeInTheDocument();
});

it('Game mode is "freeplay"', () => {
	gameMode.set('freeplay');

	render(GameOverBlock);

	expect(screen.getByText('Congratulations!')).toBeInTheDocument();

	const shareButton = screen.queryByRole('button', {
		hidden: true,
		name: 'copy game results to clipboard',
	});
	expect(shareButton).not.toBeInTheDocument();
});
