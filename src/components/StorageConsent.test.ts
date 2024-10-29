import { render, screen } from '@testing-library/svelte';
import { expect, it } from 'vitest';
import StorageConsent from './StorageConsent.svelte';

HTMLDialogElement.prototype.show = vi.fn();
HTMLDialogElement.prototype.close = vi.fn();

it('Title', () => {
	render(StorageConsent);

	const title = screen.getByRole('heading', {
		hidden: true,
		name: 'Local Storage Notice',
	});
	expect(title).toBeInTheDocument();
});
