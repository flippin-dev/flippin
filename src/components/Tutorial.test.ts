import { render, screen } from '@testing-library/svelte';
import { expect, it } from 'vitest';
import Tutorial from '$com/Tutorial.svelte';

HTMLDialogElement.prototype.show = vi.fn();
HTMLDialogElement.prototype.close = vi.fn();

it('Title', () => {
	render(Tutorial);

	const title = screen.getByRole('heading', {
		hidden: true,
		name: 'How to Play',
	});
	expect(title).toBeInTheDocument();
});
