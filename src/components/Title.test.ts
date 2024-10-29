import { render, screen } from '@testing-library/svelte';
import { expect, it } from 'vitest';
import { gameMode, gameNumber } from '$src/stores/stores';
import Title from './Title.svelte';

const ResizeObserverMock = vi.fn(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn(),
}));

vi.stubGlobal('ResizeObserver', ResizeObserverMock);

it('Game mode is "daily"', () => {
	gameNumber.set(1);
	gameMode.set('daily');

	render(Title);

	const subtitle = screen.getByRole('heading', {
		hidden: true,
		name: '#1: Autumn',
	});
	expect(subtitle).toBeInTheDocument();
});

it('Game mode is "freeplay"', () => {
	gameMode.set('freeplay');

	render(Title);

	const subtitle = screen.getByRole('heading', {
		hidden: true,
		name: 'Hello, Flippin!',
	});
	expect(subtitle).toBeInTheDocument();
});
