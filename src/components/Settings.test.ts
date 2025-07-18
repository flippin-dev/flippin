import { render, screen } from '@testing-library/svelte';
import { expect, it } from 'vitest';
import {
	colorTheme,
	darkMode,
	freeplayPuzzle,
	gameMode,
	reducedMotion,
	shouldReset,
	storageConsent,
	storageNoticeVisible,
} from '$src/stores/stores';
import Settings from '$com/Settings.svelte';
import userEvent from '@testing-library/user-event';
import { get } from 'svelte/store';
import * as pageUtils from '$lib/page-utilities';

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
	render(Settings);

	const title = screen.getByRole('heading', { hidden: true, name: 'Settings' });
	expect(title).toBeInTheDocument();
});

it('Dark mode toggle', async () => {
	const user = userEvent.setup();
	darkMode.set(false);

	render(Settings);

	await user.click(
		screen.getByRole('switch', { hidden: true, name: 'dark mode' }),
	);

	expect(get(darkMode)).toBe(true);
});

it('Update color theme', async () => {
	const user = userEvent.setup();
	colorTheme.set('Flippin');

	render(Settings);

	expect(get(colorTheme)).toBe('Flippin');

	const textbox = screen.getByRole('textbox', {
		hidden: true,
		name: 'color theme',
	});

	await user.click(textbox);
	await user.click(screen.getByText('Umi'));

	expect(get(colorTheme)).toBe('Umi');
});

describe('Custom themes', () => {
	describe('Import section', () => {
		it('Import initially hidden', async () => {
			const user = userEvent.setup();

			render(Settings);

			const importSectionButton = screen.getByRole('button', {
				hidden: true,
				name: 'Import Custom Themes',
			});
			expect(
				screen.queryByRole('textbox', {
					hidden: true,
					name: 'custom theme import',
				}),
			).not.toBeInTheDocument();

			await user.click(importSectionButton);

			const importTextbox = screen.getByRole('textbox', {
				hidden: true,
				name: 'custom theme import',
			});

			expect(importTextbox).toBeInTheDocument();
		});

		it('Copy sample themes', async () => {
			const user = userEvent.setup();
			const clipboardWriteSpy = vi.spyOn(navigator.clipboard, 'writeText');

			render(Settings);

			const importSectionButton = screen.getByRole('button', {
				hidden: true,
				name: 'Import Custom Themes',
			});

			await user.click(importSectionButton);

			const copySampleButton = screen.getByRole('button', {
				hidden: true,
				name: 'Copy Sample Themes',
			});
			await user.click(copySampleButton);

			expect(clipboardWriteSpy).toHaveBeenCalledOnce();
			expect(toastAndAlertSpy).toHaveBeenCalledOnce();
		});

		describe('Textbox input', () => {
			it('Invalid JSON', async () => {
				const user = userEvent.setup();

				render(Settings);

				const importSectionButton = screen.getByRole('button', {
					hidden: true,
					name: 'Import Custom Themes',
				});

				await user.click(importSectionButton);

				const importButton = screen.getByRole('button', {
					hidden: true,
					name: 'Import Themes',
				});
				expect(importButton).toBeDisabled();

				const status = screen.getByRole('status', {
					hidden: true,
					name: 'custom theme import status message',
				});
				expect(status).toHaveTextContent('Paste your custom themes here!');

				const textbox = screen.getByRole('textbox', {
					hidden: true,
					name: 'custom theme import',
				});

				await user.click(textbox);
				await user.paste('[');

				expect(status).toHaveTextContent(
					'Check the sample for formatting help!',
				);
				expect(importButton).toBeDisabled();
			});

			it('Missing name', async () => {
				const user = userEvent.setup();

				render(Settings);

				const importSectionButton = screen.getByRole('button', {
					hidden: true,
					name: 'Import Custom Themes',
				});

				await user.click(importSectionButton);

				const importButton = screen.getByRole('button', {
					hidden: true,
					name: 'Import Themes',
				});
				expect(importButton).toBeDisabled();

				const status = screen.getByRole('status', {
					hidden: true,
					name: 'custom theme import status message',
				});
				expect(status).toHaveTextContent('Paste your custom themes here!');

				const textbox = screen.getByRole('textbox', {
					hidden: true,
					name: 'custom theme import',
				});

				await user.click(textbox);
				await user.paste(
					'[{"theme1":"#FFDE4D","theme2":"#FFB22C","theme3":"#ff4c4c"}]',
				);

				expect(status).toHaveTextContent(
					'One of your themes is missing a name!',
				);
				expect(importButton).toBeDisabled();
			});

			it('Invalid theme1', async () => {
				const user = userEvent.setup();

				render(Settings);

				const importSectionButton = screen.getByRole('button', {
					hidden: true,
					name: 'Import Custom Themes',
				});

				await user.click(importSectionButton);

				const importButton = screen.getByRole('button', {
					hidden: true,
					name: 'Import Themes',
				});
				expect(importButton).toBeDisabled();

				const status = screen.getByRole('status', {
					hidden: true,
					name: 'custom theme import status message',
				});
				expect(status).toHaveTextContent('Paste your custom themes here!');

				const textbox = screen.getByRole('textbox', {
					hidden: true,
					name: 'custom theme import',
				});

				await user.click(textbox);
				await user.paste(
					'[{"name":"Sunrise","theme2":"#FFB22C","theme3":"#ff4c4c"}]',
				);

				expect(status).toHaveTextContent(
					'theme1 value for "Sunrise" must be populated!',
				);

				await user.clear(textbox);
				await user.paste(
					'[{"name":"Sunrise","theme1":"","theme2":"#FFB22C","theme3":"#ff4c4c"}]',
				);

				expect(status).toHaveTextContent(
					'theme1 value for "Sunrise" should be a valid color hex code (e.g. #FFFFFF)!',
				);
				expect(importButton).toBeDisabled();
			});

			it('Invalid theme2', async () => {
				const user = userEvent.setup();

				render(Settings);

				const importSectionButton = screen.getByRole('button', {
					hidden: true,
					name: 'Import Custom Themes',
				});

				await user.click(importSectionButton);

				const importButton = screen.getByRole('button', {
					hidden: true,
					name: 'Import Themes',
				});
				expect(importButton).toBeDisabled();

				const status = screen.getByRole('status', {
					hidden: true,
					name: 'custom theme import status message',
				});
				expect(status).toHaveTextContent('Paste your custom themes here!');

				const textbox = screen.getByRole('textbox', {
					hidden: true,
					name: 'custom theme import',
				});

				await user.click(textbox);
				await user.paste(
					'[{"name":"Sunrise","theme1":"#FFDE4D","theme3":"#ff4c4c"}]',
				);

				expect(status).toHaveTextContent(
					'theme2 value for "Sunrise" must be populated!',
				);

				await user.clear(textbox);
				await user.paste(
					'[{"name":"Sunrise","theme1":"#FFDE4D","theme2":"","theme3":"#ff4c4c"}]',
				);

				expect(status).toHaveTextContent(
					'theme2 value for "Sunrise" should be a valid color hex code (e.g. #FFFFFF)!',
				);
				expect(importButton).toBeDisabled();
			});

			it('Invalid theme3', async () => {
				const user = userEvent.setup();

				render(Settings);

				const importSectionButton = screen.getByRole('button', {
					hidden: true,
					name: 'Import Custom Themes',
				});

				await user.click(importSectionButton);

				const importButton = screen.getByRole('button', {
					hidden: true,
					name: 'Import Themes',
				});
				expect(importButton).toBeDisabled();

				const status = screen.getByRole('status', {
					hidden: true,
					name: 'custom theme import status message',
				});
				expect(status).toHaveTextContent('Paste your custom themes here!');

				const textbox = screen.getByRole('textbox', {
					hidden: true,
					name: 'custom theme import',
				});

				await user.click(textbox);
				await user.paste(
					'[{"name":"Sunrise","theme1":"#FFDE4D","theme2":"#FFB22C"}]',
				);

				expect(status).toHaveTextContent(
					'theme3 value for "Sunrise" must be populated!',
				);

				await user.clear(textbox);
				await user.paste(
					'[{"name":"Sunrise","theme1":"#FFDE4D","theme2":"#FFB22C","theme3":""}]',
				);

				expect(status).toHaveTextContent(
					'theme3 value for "Sunrise" should be a valid color hex code (e.g. #FFFFFF)!',
				);
				expect(importButton).toBeDisabled();
			});

			it('Valid input', async () => {
				const user = userEvent.setup();

				render(Settings);

				const importSectionButton = screen.getByRole('button', {
					hidden: true,
					name: 'Import Custom Themes',
				});

				await user.click(importSectionButton);

				const importButton = screen.getByRole('button', {
					hidden: true,
					name: 'Import Themes',
				});
				expect(importButton).toBeDisabled();

				const status = screen.getByRole('status', {
					hidden: true,
					name: 'custom theme import status message',
				});
				expect(status).toHaveTextContent('Paste your custom themes here!');

				const textbox = screen.getByRole('textbox', {
					hidden: true,
					name: 'custom theme import',
				});

				await user.click(textbox);
				await user.paste(
					'[{"name":"Sunrise","theme1":"#FFDE4D","theme2":"#FFB22C","theme3":"#ff4c4c"}]',
				);

				expect(status).toHaveTextContent('Ready to import!');
				expect(importButton).toBeEnabled();

				await user.click(importButton);

				expect(toastAndAlertSpy).toHaveBeenCalledOnce();

				const themeTextbox = screen.getByRole('textbox', {
					hidden: true,
					name: 'color theme',
				});

				await user.click(themeTextbox);

				expect(screen.getByText('Sunrise')).toBeInTheDocument();
			});
		});

		it('Import hides on second click', async () => {
			const user = userEvent.setup();

			render(Settings);

			const importSectionButton = screen.getByRole('button', {
				hidden: true,
				name: 'Import Custom Themes',
			});

			await user.click(importSectionButton);

			const importTextbox = screen.getByRole('textbox', {
				hidden: true,
				name: 'custom theme import',
			});

			expect(importTextbox).toBeInTheDocument();

			await user.click(importSectionButton);

			expect(importTextbox).not.toBeInTheDocument();
		});
	});

	describe('Export section', () => {
		it('Export initially hidden', async () => {
			const user = userEvent.setup();

			render(Settings);

			const exportSectionButton = screen.getByRole('button', {
				hidden: true,
				name: 'Export Custom Themes',
			});
			expect(
				screen.queryByRole('textbox', {
					hidden: true,
					name: 'custom theme export',
				}),
			).not.toBeInTheDocument();

			await user.click(exportSectionButton);

			const exportTextbox = screen.getByRole('textbox', {
				hidden: true,
				name: 'custom theme export',
			});

			expect(exportTextbox).toBeInTheDocument();
		});

		it('Export themes', async () => {
			const user = userEvent.setup();
			const clipboardWriteSpy = vi.spyOn(navigator.clipboard, 'writeText');

			render(Settings);

			const exportSectionButton = screen.getByRole('button', {
				hidden: true,
				name: 'Export Custom Themes',
			});

			await user.click(exportSectionButton);

			const copyButton = screen.getByRole('button', {
				hidden: true,
				name: 'Copy Themes',
			});
			await user.click(copyButton);

			expect(clipboardWriteSpy).toHaveBeenCalledOnce();
			expect(toastAndAlertSpy).toHaveBeenCalledOnce();
		});

		it('Export hides on second click', async () => {
			const user = userEvent.setup();

			render(Settings);

			const exportSectionButton = screen.getByRole('button', {
				hidden: true,
				name: 'Export Custom Themes',
			});

			await user.click(exportSectionButton);

			const exportTextbox = screen.getByRole('textbox', {
				hidden: true,
				name: 'custom theme export',
			});

			expect(exportTextbox).toBeInTheDocument();

			await user.click(exportSectionButton);

			expect(exportTextbox).not.toBeInTheDocument();
		});
	});
});

describe('Freeplay', () => {
	it('Freeplay section initially hidden', async () => {
		const user = userEvent.setup();
		gameMode.set('daily');

		render(Settings);

		await user.click(
			screen.getByRole('switch', { hidden: true, name: 'freeplay' }),
		);

		const freeplayTextbox = screen.getByRole('textbox', {
			hidden: true,
			name: 'freeplay puzzle',
		});

		expect(freeplayTextbox).toBeInTheDocument();
		expect(get(gameMode)).toBe('freeplay');
	});

	it('Update freeplay puzzle', async () => {
		const user = userEvent.setup();
		const freeplayPuzzleSpy = vi.spyOn(freeplayPuzzle, 'set');
		// Set a dummy puzzle to clear out the default to make finding the list item below easier
		freeplayPuzzle.set({ title: '', start: '', end: '' });
		gameMode.set('daily');
		shouldReset.set(false);

		render(Settings);

		await user.click(
			screen.getByRole('switch', { hidden: true, name: 'freeplay' }),
		);

		const textbox = screen.getByRole('textbox', {
			hidden: true,
			name: 'freeplay puzzle',
		});

		await user.click(textbox);
		await user.click(screen.getByText('Hello, Flippin!'));

		expect(freeplayPuzzleSpy).toHaveBeenCalledTimes(2);
		expect(get(shouldReset)).toBe(true);
	});
});

describe('Custom puzzles', () => {
	describe('Import section', () => {
		it('Import initially hidden', async () => {
			const user = userEvent.setup();

			render(Settings);

			const importSectionButton = screen.getByRole('button', {
				hidden: true,
				name: 'Import Custom Puzzles',
			});
			expect(
				screen.queryByRole('textbox', {
					hidden: true,
					name: 'custom puzzle import',
				}),
			).not.toBeInTheDocument();

			await user.click(importSectionButton);

			const importTextbox = screen.getByRole('textbox', {
				hidden: true,
				name: 'custom puzzle import',
			});

			expect(importTextbox).toBeInTheDocument();
		});

		it('Copy sample puzzle', async () => {
			const user = userEvent.setup();
			const clipboardWriteSpy = vi.spyOn(navigator.clipboard, 'writeText');

			render(Settings);

			const importSectionButton = screen.getByRole('button', {
				hidden: true,
				name: 'Import Custom Puzzles',
			});

			await user.click(importSectionButton);

			const copySampleButton = screen.getByRole('button', {
				hidden: true,
				name: 'Copy Sample Puzzle',
			});
			await user.click(copySampleButton);

			expect(clipboardWriteSpy).toHaveBeenCalledOnce();
			expect(toastAndAlertSpy).toHaveBeenCalledOnce();
		});

		describe('Textbox input', () => {
			it('Invalid JSON', async () => {
				const user = userEvent.setup();

				render(Settings);

				const importSectionButton = screen.getByRole('button', {
					hidden: true,
					name: 'Import Custom Puzzles',
				});

				await user.click(importSectionButton);

				const importButton = screen.getByRole('button', {
					hidden: true,
					name: 'Import Puzzles',
				});
				expect(importButton).toBeDisabled();

				const status = screen.getByRole('status', {
					hidden: true,
					name: 'custom puzzle import status message',
				});
				expect(status).toHaveTextContent('Paste your custom puzzles here!');

				const textbox = screen.getByRole('textbox', {
					hidden: true,
					name: 'custom puzzle import',
				});

				await user.click(textbox);
				await user.paste('[');

				expect(status).toHaveTextContent(
					'Check the sample for formatting help!',
				);
				expect(importButton).toBeDisabled();
			});

			it('Missing title', async () => {
				const user = userEvent.setup();

				render(Settings);

				const importSectionButton = screen.getByRole('button', {
					hidden: true,
					name: 'Import Custom Puzzles',
				});

				await user.click(importSectionButton);

				const importButton = screen.getByRole('button', {
					hidden: true,
					name: 'Import Puzzles',
				});
				expect(importButton).toBeDisabled();

				const status = screen.getByRole('status', {
					hidden: true,
					name: 'custom puzzle import status message',
				});
				expect(status).toHaveTextContent('Paste your custom puzzles here!');

				const textbox = screen.getByRole('textbox', {
					hidden: true,
					name: 'custom puzzle import',
				});

				await user.click(textbox);
				await user.paste(
					'[{"start":"1011110111112101211101210","end":"0202002020000001000101110"}]',
				);

				expect(status).toHaveTextContent(
					'One of your puzzles is missing a title!',
				);
				expect(importButton).toBeDisabled();
			});

			it('Invalid start', async () => {
				const user = userEvent.setup();

				render(Settings);

				const importSectionButton = screen.getByRole('button', {
					hidden: true,
					name: 'Import Custom Puzzles',
				});

				await user.click(importSectionButton);

				const importButton = screen.getByRole('button', {
					hidden: true,
					name: 'Import Puzzles',
				});
				expect(importButton).toBeDisabled();

				const status = screen.getByRole('status', {
					hidden: true,
					name: 'custom puzzle import status message',
				});
				expect(status).toHaveTextContent('Paste your custom puzzles here!');

				const textbox = screen.getByRole('textbox', {
					hidden: true,
					name: 'custom puzzle import',
				});

				await user.click(textbox);
				await user.paste(
					'[{"title":"Sample","end":"0202002020000001000101110"}]',
				);

				expect(status).toHaveTextContent(
					'start value for "Sample" must be populated!',
				);

				await user.clear(textbox);
				await user.paste(
					'[{"title":"Sample","start":"","end":"0202002020000001000101110"}]',
				);

				expect(status).toHaveTextContent(
					'start value for "Sample" does not match expected pattern!',
				);
				expect(importButton).toBeDisabled();
			});

			it('Invalid end', async () => {
				const user = userEvent.setup();

				render(Settings);

				const importSectionButton = screen.getByRole('button', {
					hidden: true,
					name: 'Import Custom Puzzles',
				});

				await user.click(importSectionButton);

				const importButton = screen.getByRole('button', {
					hidden: true,
					name: 'Import Puzzles',
				});
				expect(importButton).toBeDisabled();

				const status = screen.getByRole('status', {
					hidden: true,
					name: 'custom puzzle import status message',
				});
				expect(status).toHaveTextContent('Paste your custom puzzles here!');

				const textbox = screen.getByRole('textbox', {
					hidden: true,
					name: 'custom puzzle import',
				});

				await user.click(textbox);
				await user.paste(
					'[{"title":"Sample","start":"1011110111112101211101210"}]',
				);

				expect(status).toHaveTextContent(
					'end value for "Sample" must be populated!',
				);

				await user.clear(textbox);
				await user.paste(
					'[{"title":"Sample","start":"1011110111112101211101210","end":""}]',
				);

				expect(status).toHaveTextContent(
					'end value for "Sample" does not match expected pattern!',
				);
				expect(importButton).toBeDisabled();
			});

			it('Too easy puzzle', async () => {
				const user = userEvent.setup();

				render(Settings);

				const importSectionButton = screen.getByRole('button', {
					hidden: true,
					name: 'Import Custom Puzzles',
				});

				await user.click(importSectionButton);

				const importButton = screen.getByRole('button', {
					hidden: true,
					name: 'Import Puzzles',
				});
				expect(importButton).toBeDisabled();

				const status = screen.getByRole('status', {
					hidden: true,
					name: 'custom puzzle import status message',
				});
				expect(status).toHaveTextContent('Paste your custom puzzles here!');

				const textbox = screen.getByRole('textbox', {
					hidden: true,
					name: 'custom puzzle import',
				});

				await user.click(textbox);
				await user.paste(
					'[{"title":"Sample","start":"0011110111112101211101210","end":"0011110111112101211101210"}]',
				);

				expect(status).toHaveTextContent('"Sample" is too easy!');
				expect(importButton).toBeDisabled();
			});

			it('Unsolvable puzzle', async () => {
				const user = userEvent.setup();

				render(Settings);

				const importSectionButton = screen.getByRole('button', {
					hidden: true,
					name: 'Import Custom Puzzles',
				});

				await user.click(importSectionButton);

				const importButton = screen.getByRole('button', {
					hidden: true,
					name: 'Import Puzzles',
				});
				expect(importButton).toBeDisabled();

				const status = screen.getByRole('status', {
					hidden: true,
					name: 'custom puzzle import status message',
				});
				expect(status).toHaveTextContent('Paste your custom puzzles here!');

				const textbox = screen.getByRole('textbox', {
					hidden: true,
					name: 'custom puzzle import',
				});

				await user.click(textbox);
				await user.paste(
					'[{"title":"Sample","start":"1011110111112101211101210","end":"0011110111112101211101210"}]',
				);

				expect(status).toHaveTextContent('"Sample" is not solvable!');
				expect(importButton).toBeDisabled();
			});

			it('Valid import', async () => {
				const user = userEvent.setup();
				gameMode.set('daily');

				render(Settings);

				const importSectionButton = screen.getByRole('button', {
					hidden: true,
					name: 'Import Custom Puzzles',
				});

				await user.click(importSectionButton);

				const importButton = screen.getByRole('button', {
					hidden: true,
					name: 'Import Puzzles',
				});
				expect(importButton).toBeDisabled();

				const status = screen.getByRole('status', {
					hidden: true,
					name: 'custom puzzle import status message',
				});
				expect(status).toHaveTextContent('Paste your custom puzzles here!');

				const textbox = screen.getByRole('textbox', {
					hidden: true,
					name: 'custom puzzle import',
				});

				await user.click(textbox);
				await user.paste(
					'[{"title":"Sample","start":"1011110111112101211101210","end":"0202002020000001000101110"}]',
				);

				expect(status).toHaveTextContent('Ready to import!');
				expect(importButton).toBeEnabled();

				await user.click(importButton);

				expect(toastAndAlertSpy).toHaveBeenCalledOnce();

				await user.click(
					screen.getByRole('switch', { hidden: true, name: 'freeplay' }),
				);

				const puzzleTextbox = screen.getByRole('textbox', {
					hidden: true,
					name: 'freeplay puzzle',
				});

				await user.click(puzzleTextbox);

				expect(screen.getByText('Sample')).toBeInTheDocument();
			});
		});

		it('Import hides on second click', async () => {
			const user = userEvent.setup();

			render(Settings);

			const importSectionButton = screen.getByRole('button', {
				hidden: true,
				name: 'Import Custom Puzzles',
			});

			await user.click(importSectionButton);

			const importTextbox = screen.getByRole('textbox', {
				hidden: true,
				name: 'custom puzzle import',
			});

			expect(importTextbox).toBeInTheDocument();

			await user.click(importSectionButton);

			expect(importTextbox).not.toBeInTheDocument();
		});
	});

	describe('Export section', () => {
		it('Export initially hidden', async () => {
			const user = userEvent.setup();

			render(Settings);

			const exportSectionButton = screen.getByRole('button', {
				hidden: true,
				name: 'Export Custom Puzzles',
			});
			expect(
				screen.queryByRole('textbox', {
					hidden: true,
					name: 'custom puzzle export',
				}),
			).not.toBeInTheDocument();

			await user.click(exportSectionButton);

			const exportTextbox = screen.getByRole('textbox', {
				hidden: true,
				name: 'custom puzzle export',
			});

			expect(exportTextbox).toBeInTheDocument();
		});

		it('Export puzzles', async () => {
			const user = userEvent.setup();
			const clipboardWriteSpy = vi.spyOn(navigator.clipboard, 'writeText');

			render(Settings);

			const exportSectionButton = screen.getByRole('button', {
				hidden: true,
				name: 'Export Custom Puzzles',
			});

			await user.click(exportSectionButton);

			const copyButton = screen.getByRole('button', {
				hidden: true,
				name: 'Copy Puzzles',
			});
			await user.click(copyButton);

			expect(clipboardWriteSpy).toHaveBeenCalledOnce();
			expect(toastAndAlertSpy).toHaveBeenCalledOnce();
		});

		it('Export hides on second click', async () => {
			const user = userEvent.setup();

			render(Settings);

			const exportSectionButton = screen.getByRole('button', {
				hidden: true,
				name: 'Export Custom Puzzles',
			});

			await user.click(exportSectionButton);

			const exportTextbox = screen.getByRole('textbox', {
				hidden: true,
				name: 'custom puzzle export',
			});

			expect(exportTextbox).toBeInTheDocument();

			await user.click(exportSectionButton);

			expect(exportTextbox).not.toBeInTheDocument();
		});
	});
});

it('Reduced motion toggle', async () => {
	const user = userEvent.setup();
	reducedMotion.set(false);

	render(Settings);

	await user.click(
		screen.getByRole('switch', { hidden: true, name: 'reduced motion' }),
	);

	expect(get(reducedMotion)).toBe(true);
});

describe('Storage consent', () => {
	it('Confirm', async () => {
		const user = userEvent.setup();
		storageConsent.set(false);
		storageNoticeVisible.set(false);

		render(Settings);

		expect(screen.getByText('DO NOT ALLOW'));

		const storageConsentButton = screen.getByRole('button', {
			hidden: true,
			name: 'Update Storage Consent',
		});

		await user.click(storageConsentButton);

		expect(
			screen.queryByRole('heading', {
				hidden: true,
				name: 'Local Storage Notice',
			}),
		).toBeInTheDocument();

		await user.click(screen.getByRole('checkbox', { hidden: true }));
		await user.click(
			screen.getByRole('button', { hidden: true, name: 'Confirm' }),
		);

		expect(
			screen.queryByRole('heading', { hidden: true, name: 'Settings' }),
		).toBeInTheDocument();
		expect(get(storageConsent)).toBe(true);
	});

	it('Decline', async () => {
		const user = userEvent.setup();
		storageConsent.set(true);
		storageNoticeVisible.set(false);

		render(Settings);

		expect(screen.getByText('ALLOW'));

		const storageConsentButton = screen.getByRole('button', {
			hidden: true,
			name: 'Update Storage Consent',
		});

		await user.click(storageConsentButton);

		expect(
			screen.queryByRole('heading', {
				hidden: true,
				name: 'Local Storage Notice',
			}),
		).toBeInTheDocument();

		await user.click(screen.getByRole('checkbox', { hidden: true }));
		await user.click(
			screen.getByRole('button', { hidden: true, name: 'Decline' }),
		);

		expect(
			screen.queryByRole('heading', { hidden: true, name: 'Settings' }),
		).toBeInTheDocument();
		expect(get(storageConsent)).toBe(false);
	});
});
