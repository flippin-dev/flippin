import { render, screen, within } from '@testing-library/svelte';
import { expect, it } from 'vitest';
import { gameMode, stats } from '$src/stores/stores';
import userEvent from '@testing-library/user-event';
import { get } from 'svelte/store';
import * as pageUtils from '$src/lib/page-utilities';
import Stats from '$com/Stats.svelte';
import { newStats } from '$src/lib/stats';
import { tick } from 'svelte';

HTMLDialogElement.prototype.show = vi.fn();
HTMLDialogElement.prototype.close = vi.fn();
HTMLElement.prototype.scrollIntoView = vi.fn();

const toastAndAlertSpy = vi
	.spyOn(pageUtils, 'toastAndAlert')
	.mockImplementation(vi.fn());

afterEach(() => {
	toastAndAlertSpy.mockClear();
});

it('Title', () => {
	render(Stats);

	const title = screen.getByRole('heading', { hidden: true, name: 'Stats' });
	expect(title).toBeInTheDocument();
});

it('Freeplay note not visible', async () => {
	gameMode.set('daily');

	render(Stats);

	expect(
		screen.queryByText('Stats are unaffected while in freeplay mode!'),
	).not.toBeInTheDocument();
});

it('Freeplay note is visible', async () => {
	gameMode.set('freeplay');

	render(Stats);

	expect(
		screen.getByText('Stats are unaffected while in freeplay mode!'),
	).toBeInTheDocument();
});

it('Stats update', async () => {
	stats.set(newStats);

	render(Stats);

	const wonGamesRow = screen.getByTestId('won-games');
	const fastestGameRow = screen.getByTestId('fastest-game');

	expect(
		within(wonGamesRow).getByRole('cell', { hidden: true }),
	).toHaveTextContent('0');
	expect(
		within(fastestGameRow).getByRole('cell', { hidden: true }),
	).toHaveTextContent('');
	expect(screen.getByTestId('row0')).toHaveTextContent('0');

	stats.set({
		wonGames: 1,
		fastestGame: 30,
		distribution: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	});

	await tick();

	expect(
		within(wonGamesRow).getByRole('cell', { hidden: true }),
	).toHaveTextContent('1');
	expect(
		within(fastestGameRow).getByRole('cell', { hidden: true }),
	).toHaveTextContent('30');
	expect(screen.getByTestId('row0')).toHaveTextContent('1');
});

describe('Import section', () => {
	it('Import initially hidden', async () => {
		const user = userEvent.setup();

		render(Stats);

		const importSectionButton = screen.getByRole('button', {
			hidden: true,
			name: 'Import Stats',
		});
		expect(
			screen.queryByRole('textbox', { hidden: true, name: 'stats import' }),
		).not.toBeInTheDocument();

		await user.click(importSectionButton);

		const importTextbox = screen.getByRole('textbox', {
			hidden: true,
			name: 'stats import',
		});

		expect(importTextbox).toBeInTheDocument();
	});

	it('Copy sample stats', async () => {
		const user = userEvent.setup();
		const clipboardWriteSpy = vi.spyOn(navigator.clipboard, 'writeText');

		render(Stats);

		const importSectionButton = screen.getByRole('button', {
			hidden: true,
			name: 'Import Stats',
		});

		await user.click(importSectionButton);

		const copySampleButton = screen.getByRole('button', {
			hidden: true,
			name: 'Copy Sample Stats',
		});
		await user.click(copySampleButton);

		expect(clipboardWriteSpy).toHaveBeenCalledOnce();
		expect(toastAndAlertSpy).toHaveBeenCalledOnce();
	});

	describe('Textbox input', () => {
		it('Invalid JSON', async () => {
			const user = userEvent.setup();

			render(Stats);

			const importSectionButton = screen.getByRole('button', {
				hidden: true,
				name: 'Import Stats',
			});

			await user.click(importSectionButton);

			const importButton = screen.getByRole('button', {
				hidden: true,
				name: 'Import New Stats',
			});
			expect(importButton).toBeDisabled();

			const status = screen.getByRole('status', {
				hidden: true,
				name: 'stats import status message',
			});
			expect(status).toHaveTextContent('Paste your stats here!');

			const textbox = screen.getByRole('textbox', {
				hidden: true,
				name: 'stats import',
			});

			await user.click(textbox);
			await user.paste('{');

			expect(status).toHaveTextContent('Check the sample for formatting help!');
			expect(importButton).toBeDisabled();
		});

		it('Invalid wonGames', async () => {
			const user = userEvent.setup();

			render(Stats);

			const importSectionButton = screen.getByRole('button', {
				hidden: true,
				name: 'Import Stats',
			});

			await user.click(importSectionButton);

			const importButton = screen.getByRole('button', {
				hidden: true,
				name: 'Import New Stats',
			});
			expect(importButton).toBeDisabled();

			const status = screen.getByRole('status', {
				hidden: true,
				name: 'stats import status message',
			});
			expect(status).toHaveTextContent('Paste your stats here!');

			const textbox = screen.getByRole('textbox', {
				hidden: true,
				name: 'stats import',
			});

			await user.click(textbox);
			await user.paste(
				'{"fastestGame":23,"distribution":[1,0,0,0,0,0,0,0,0,0,0]}',
			);

			expect(status).toHaveTextContent('wonGames value must be populated!');

			await user.clear(textbox);
			await user.paste(
				'{"wonGames":-1,"fastestGame":23,"distribution":[1,0,0,0,0,0,0,0,0,0,0]}',
			);

			expect(status).toHaveTextContent(
				'wonGames value must be a nonnegative number!',
			);
			expect(importButton).toBeDisabled();
		});

		it('Invalid fastestGame', async () => {
			const user = userEvent.setup();

			render(Stats);

			const importSectionButton = screen.getByRole('button', {
				hidden: true,
				name: 'Import Stats',
			});

			await user.click(importSectionButton);

			const importButton = screen.getByRole('button', {
				hidden: true,
				name: 'Import New Stats',
			});
			expect(importButton).toBeDisabled();

			const status = screen.getByRole('status', {
				hidden: true,
				name: 'stats import status message',
			});
			expect(status).toHaveTextContent('Paste your stats here!');

			const textbox = screen.getByRole('textbox', {
				hidden: true,
				name: 'stats import',
			});

			await user.click(textbox);
			await user.paste('{"wonGames":1,"distribution":[1,0,0,0,0,0,0,0,0,0,0]}');

			expect(status).toHaveTextContent('fastestGame value must be populated!');

			await user.clear(textbox);
			await user.paste(
				'{"wonGames":1,"fastestGame":-1,"distribution":[1,0,0,0,0,0,0,0,0,0,0]}',
			);

			expect(status).toHaveTextContent(
				'fastestGame must either be null or a nonnegative number!',
			);
			expect(importButton).toBeDisabled();
		});

		it('Invalid distribution', async () => {
			const user = userEvent.setup();

			render(Stats);

			const importSectionButton = screen.getByRole('button', {
				hidden: true,
				name: 'Import Stats',
			});

			await user.click(importSectionButton);

			const importButton = screen.getByRole('button', {
				hidden: true,
				name: 'Import New Stats',
			});
			expect(importButton).toBeDisabled();

			const status = screen.getByRole('status', {
				hidden: true,
				name: 'stats import status message',
			});
			expect(status).toHaveTextContent('Paste your stats here!');

			const textbox = screen.getByRole('textbox', {
				hidden: true,
				name: 'stats import',
			});

			await user.click(textbox);
			await user.paste('{"wonGames":1,"fastestGame":23}');

			expect(status).toHaveTextContent('distribution value must be populated!');

			await user.clear(textbox);
			await user.paste('{"wonGames":1,"fastestGame":23,"distribution":[]}');

			expect(status).toHaveTextContent(
				'distribution must be populated with 11 nonnegative entries!',
			);
			expect(importButton).toBeDisabled();
		});

		it('Valid import', async () => {
			const user = userEvent.setup();

			render(Stats);

			const importSectionButton = screen.getByRole('button', {
				hidden: true,
				name: 'Import Stats',
			});

			await user.click(importSectionButton);

			const importButton = screen.getByRole('button', {
				hidden: true,
				name: 'Import New Stats',
			});
			expect(importButton).toBeDisabled();

			const status = screen.getByRole('status', {
				hidden: true,
				name: 'stats import status message',
			});
			expect(status).toHaveTextContent('Paste your stats here!');

			const textbox = screen.getByRole('textbox', {
				hidden: true,
				name: 'stats import',
			});

			await user.click(textbox);
			await user.paste(
				'{"wonGames":1,"fastestGame":23,"distribution":[1,0,0,0,0,0,0,0,0,0,0]}',
			);

			expect(status).toHaveTextContent('Ready to import!');
			expect(importButton).toBeEnabled();

			await user.click(importButton);

			expect(toastAndAlertSpy).toHaveBeenCalledOnce();

			const expectedStats = {
				wonGames: 1,
				fastestGame: 23,
				distribution: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			};
			expect(get(stats)).toEqual(expectedStats);
		});
	});

	it('Import hides on second click', async () => {
		const user = userEvent.setup();

		render(Stats);

		const importSectionButton = screen.getByRole('button', {
			hidden: true,
			name: 'Import Stats',
		});
		expect(
			screen.queryByRole('textbox', { hidden: true, name: 'stats import' }),
		).not.toBeInTheDocument();

		await user.click(importSectionButton);

		const importTextbox = screen.getByRole('textbox', {
			hidden: true,
			name: 'stats import',
		});

		expect(importTextbox).toBeInTheDocument();

		await user.click(importSectionButton);

		expect(importTextbox).not.toBeInTheDocument();
	});
});

describe('Export section', () => {
	it('Export initially hidden', async () => {
		const user = userEvent.setup();

		render(Stats);

		const exportSectionButton = screen.getByRole('button', {
			hidden: true,
			name: 'Export Stats',
		});
		expect(
			screen.queryByRole('textbox', { hidden: true, name: 'stats export' }),
		).not.toBeInTheDocument();

		await user.click(exportSectionButton);

		const exportTextbox = screen.getByRole('textbox', {
			hidden: true,
			name: 'stats export',
		});

		expect(exportTextbox).toBeInTheDocument();
	});

	it('Export puzzles', async () => {
		const user = userEvent.setup();
		const clipboardWriteSpy = vi.spyOn(navigator.clipboard, 'writeText');

		render(Stats);

		const exportSectionButton = screen.getByRole('button', {
			hidden: true,
			name: 'Export Stats',
		});

		await user.click(exportSectionButton);

		const copyButton = screen.getByRole('button', {
			hidden: true,
			name: 'Copy Stats',
		});
		await user.click(copyButton);

		expect(clipboardWriteSpy).toHaveBeenCalledOnce();
		expect(toastAndAlertSpy).toHaveBeenCalledOnce();
	});

	it('Export hides on second click', async () => {
		const user = userEvent.setup();

		render(Stats);

		const exportSectionButton = screen.getByRole('button', {
			hidden: true,
			name: 'Export Stats',
		});

		await user.click(exportSectionButton);

		const exportTextbox = screen.getByRole('textbox', {
			hidden: true,
			name: 'stats export',
		});

		expect(exportTextbox).toBeInTheDocument();

		await user.click(exportSectionButton);

		expect(exportTextbox).not.toBeInTheDocument();
	});
});
