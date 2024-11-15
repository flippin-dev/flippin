import { render, screen, within } from '@testing-library/svelte';
import { expect, it } from 'vitest';
import Dialog from '$com/Dialog.svelte';
import HeadingWithTitle from '$com/Dialog.title.test.svelte';
import HeadingWithoutTitle from '$com/Dialog.notitle.test.svelte';
import userEvent from '@testing-library/user-event';
import { get, writable } from 'svelte/store';

const confirmationStore = writable(false);

const showCallback = vi.fn();
const closeCallback = vi.fn();

HTMLDialogElement.prototype.show = showCallback;
HTMLDialogElement.prototype.close = closeCallback;

afterEach(() => {
	showCallback.mockClear();
	closeCallback.mockClear();
	confirmationStore.set(false);
});

describe('Normal dialog', () => {
	it('Render with title', () => {
		render(HeadingWithTitle);

		expect(showCallback).toHaveBeenCalledOnce();

		const dialog = screen.getByRole('dialog', { hidden: true });
		expect(dialog).toBeInTheDocument();

		const heading = within(dialog).getByRole('heading', { hidden: true });
		expect(heading).toBeInTheDocument();

		const content = within(dialog).getByTestId('content');
		expect(content).toBeInTheDocument();
	});

	it('Render without title', () => {
		render(HeadingWithoutTitle);

		expect(showCallback).toHaveBeenCalledOnce();

		const dialog = screen.getByRole('dialog', { hidden: true });
		expect(dialog).toBeInTheDocument();

		const heading = within(dialog).queryByRole('heading', { hidden: true });
		expect(heading).not.toBeInTheDocument();

		const content = within(dialog).getByTestId('content');
		expect(content).toBeInTheDocument();
	});

	it('Button close', async () => {
		const user = userEvent.setup();

		render(HeadingWithTitle);

		expect(showCallback).toHaveBeenCalledOnce();

		await user.click(
			screen.getByRole('button', { hidden: true, name: 'close dialog' }),
		);

		expect(closeCallback).toHaveBeenCalledOnce();
	});

	it('Outside click close', async () => {
		const user = userEvent.setup();

		render(HeadingWithTitle);

		expect(showCallback).toHaveBeenCalledOnce();

		await user.click(screen.getByRole('dialog', { hidden: true }));

		expect(closeCallback).toHaveBeenCalledOnce();
	});

	it('ESC close', async () => {
		render(HeadingWithTitle);

		expect(showCallback).toHaveBeenCalledOnce();

		const dialog = screen.getByRole('dialog', { hidden: true });
		// User event was not working (possibly due to element inaccessibility) but dispatch works
		dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

		expect(closeCallback).toHaveBeenCalledOnce();
	});
});

describe('Confirmation dialog', () => {
	it('No close button', async () => {
		render(Dialog, {
			confirmation: true,
			confirmationMessage: 'Confirm?',
			confirmationStore: confirmationStore,
		});

		expect(showCallback).toHaveBeenCalledOnce();

		const closeButton = screen.queryByRole('button', {
			hidden: true,
			name: 'close dialog',
		});

		expect(closeButton).not.toBeInTheDocument();
	});

	it('No outside click close', async () => {
		const user = userEvent.setup();

		render(Dialog, {
			confirmation: true,
			confirmationMessage: 'Confirm?',
			confirmationStore: confirmationStore,
		});

		expect(showCallback).toHaveBeenCalledOnce();

		await user.click(screen.getByRole('dialog', { hidden: true }));

		expect(closeCallback).not.toHaveBeenCalled();
	});

	it('No ESC close', async () => {
		render(Dialog, {
			confirmation: true,
			confirmationMessage: 'Confirm?',
			confirmationStore: confirmationStore,
		});

		expect(showCallback).toHaveBeenCalledOnce();

		const dialog = screen.getByRole('dialog', { hidden: true });
		// User event was not working (possibly due to element inaccessibility) but dispatch works
		dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

		expect(closeCallback).not.toHaveBeenCalled();
	});

	it('Confirm', async () => {
		const user = userEvent.setup();

		render(Dialog, {
			confirmation: true,
			confirmationMessage: 'Confirm?',
			confirmationStore: confirmationStore,
		});

		expect(showCallback).toHaveBeenCalledOnce();

		const confirmButton = screen.getByRole('button', {
			hidden: true,
			name: 'Confirm',
		});
		const declineButton = screen.getByRole('button', {
			hidden: true,
			name: 'Decline',
		});

		expect(confirmButton).toBeDisabled();
		expect(declineButton).toBeDisabled();

		const checkbox = screen.getByRole('checkbox', { hidden: true });

		await user.click(checkbox);

		expect(confirmButton).toBeEnabled();
		expect(declineButton).toBeEnabled();

		await user.click(confirmButton);

		expect(get(confirmationStore)).toBe(true);
		expect(closeCallback).toHaveBeenCalledOnce();
	});

	it('Decline', async () => {
		const user = userEvent.setup();

		render(Dialog, {
			confirmation: true,
			confirmationMessage: 'Confirm?',
			confirmationStore: confirmationStore,
		});

		expect(showCallback).toHaveBeenCalledOnce();

		const confirmButton = screen.getByRole('button', {
			hidden: true,
			name: 'Confirm',
		});
		const declineButton = screen.getByRole('button', {
			hidden: true,
			name: 'Decline',
		});

		expect(confirmButton).toBeDisabled();
		expect(declineButton).toBeDisabled();

		const checkbox = screen.getByRole('checkbox', { hidden: true });

		await user.click(checkbox);

		expect(confirmButton).toBeEnabled();
		expect(declineButton).toBeEnabled();

		await user.click(declineButton);

		expect(get(confirmationStore)).toBe(false);
		expect(closeCallback).toHaveBeenCalledOnce();
	});

	it('Standalone confirm', async () => {
		const user = userEvent.setup();

		render(Dialog, {
			confirmation: true,
			confirmationMessage: 'Confirm?',
			confirmationStore: confirmationStore,
			isStandalone: true,
		});

		expect(showCallback).toHaveBeenCalledOnce();

		const confirmButton = screen.getByRole('button', {
			hidden: true,
			name: 'Confirm',
		});
		const declineButton = screen.getByRole('button', {
			hidden: true,
			name: 'Decline',
		});

		expect(confirmButton).toBeDisabled();
		expect(declineButton).toBeDisabled();

		const checkbox = screen.getByRole('checkbox', { hidden: true });

		await user.click(checkbox);

		expect(confirmButton).toBeEnabled();
		expect(declineButton).toBeEnabled();

		await user.click(confirmButton);

		expect(closeCallback).toHaveBeenCalled();

		expect(get(confirmationStore)).toBe(true);
		expect(closeCallback).toHaveBeenCalledOnce();
	});

	it('Standalone decline', async () => {
		const user = userEvent.setup();

		render(Dialog, {
			confirmation: true,
			confirmationMessage: 'Confirm?',
			confirmationStore: confirmationStore,
			isStandalone: true,
		});

		expect(showCallback).toHaveBeenCalledOnce();

		const confirmButton = screen.getByRole('button', {
			hidden: true,
			name: 'Confirm',
		});
		const declineButton = screen.getByRole('button', {
			hidden: true,
			name: 'Decline',
		});

		expect(confirmButton).toBeDisabled();
		expect(declineButton).toBeDisabled();

		const checkbox = screen.getByRole('checkbox', { hidden: true });

		await user.click(checkbox);

		expect(confirmButton).toBeEnabled();
		expect(declineButton).toBeEnabled();

		await user.click(declineButton);

		expect(get(confirmationStore)).toBe(false);
		expect(closeCallback).toHaveBeenCalledOnce();
	});
});
