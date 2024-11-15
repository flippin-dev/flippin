import { render, screen } from '@testing-library/svelte';
import { expect, it } from 'vitest';
import SurrenderConsent from '$com/SurrenderConsent.svelte';

HTMLDialogElement.prototype.show = vi.fn();
HTMLDialogElement.prototype.close = vi.fn();

it('Title', () => {
	render(SurrenderConsent);

	const title = screen.getByRole('heading', {
		hidden: true,
		name: 'Surrender Notice',
	});
	expect(title).toBeInTheDocument();
});
