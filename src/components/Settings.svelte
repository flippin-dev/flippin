<!--
@component
A component that presents users with various game settings.
-->

<script lang="ts" context="module">
	import Dialog from '$com/Dialog.svelte';
	import StorageConsent from '$com/StorageConsent.svelte';
	import {
		colorTheme,
		customPrefix,
		customPuzzles,
		customThemes,
		darkMode,
		freeplayPuzzle,
		freeplayPuzzles,
		gameMode,
		reducedMotion,
		shouldReset,
		storageNoticeVisible,
		themes,
	} from '$src/stores/stores';
	import { get } from 'svelte/store';
	import Toggle from 'svelte-toggle';
	import Select from 'svelte-select';
	import { offset, size } from 'svelte-floating-ui/dom';
	import { colorRegEx } from '$lib/themes';
	import type { SerializedTheme, Theme } from '$lib/themes';
	import { freeplayExample } from '$lib/puzzles';
	import { isPuzzleSolvable } from '$lib/math';
	import type { Puzzle, SerializedPuzzle } from '$lib/puzzles';
	import { stateRegEx } from '$lib/game';
	import { toastAndAlert } from '$lib/page-utilities';

	/**  A scheme for the objects passed to the Select component. */
	type SelectItem = {
		value: string;
		label: string;
		group: string;
	};

	/** A JSON string for a set of sample themes ready to be imported. */
	const importThemesSample = JSON.stringify([
		{
			name: 'Sunrise',
			theme1: '#FFDE4D',
			theme2: '#FFB22C',
			theme3: '#ff4c4c',
		},
		{
			name: 'Watermelon',
			theme1: '#399918',
			theme2: '#ffAAaa',
			theme3: '#ff7777',
		},
	]);

	/**
	 * Validate the themes the user is trying to import.
	 *
	 * @param {string} importText The custom themes JSON string to validate.
	 *
	 * @example
	 * ```ts
	 * // returns [true, '']
	 * validateImportThemesText('[{"name":"Sunrise","theme1":"#FFDE4D","theme2":"#FFB22C","theme3":"#ff4c4c"}]');
	 * ```
	 *
	 * @returns {[boolean, string]} An array containing the boolean result and an error message if applicable.
	 */
	function validateImportThemesText(importText: string): [boolean, string] {
		if (!importText) {
			return [false, "You can't import nothing!"];
		}

		try {
			const themesArray: SerializedTheme[] = JSON.parse(importText);

			// Validate each potential theme
			for (const {
				name: name,
				theme1: theme1,
				theme2: theme2,
				theme3: theme3,
			} of themesArray) {
				// Validate that name is populated
				if (!name) {
					return [false, 'One of your themes is missing a name!'];
				}
				// Validate that theme colors are in hex code format
				if (theme1 === undefined) {
					return [false, `theme1 value for "${name}" must be populated!`];
				}
				if (!colorRegEx.test(theme1)) {
					return [
						false,
						`theme1 value for "${name}" should be a valid color hex code (e.g. #FFFFFF)!`,
					];
				}
				if (theme2 === undefined) {
					return [false, `theme2 value for "${name}" must be populated!`];
				}
				if (!colorRegEx.test(theme2)) {
					return [
						false,
						`theme2 value for "${name}" should be a valid color hex code (e.g. #FFFFFF)!`,
					];
				}
				if (theme3 === undefined) {
					return [false, `theme3 value for "${name}" must be populated!`];
				}
				if (!colorRegEx.test(theme3)) {
					return [
						false,
						`theme3 value for "${name}" should be a valid color hex code (e.g. #FFFFFF)!`,
					];
				}
			}
		} catch (e) {
			// Ignore the JSON parse stuff cause it unhelpfully floods the console
			if (!(e instanceof SyntaxError)) {
				console.warn(e);
			}
			return [false, 'Check the sample for formatting help!'];
		}
		return [true, ''];
	}

	/**
	 * Import custom themes.
	 *
	 * @param {string} importText The custom themes JSON string to import.
	 *
	 * @example
	 * ```ts
	 * importThemes('[{"name":"Sunrise","theme1":"#FFDE4D","theme2":"#FFB22C","theme3":"#ff4c4c"}]');
	 * ```
	 */
	function importThemes(importText: string) {
		const newThemes = new Map<string, Theme>();
		const themesArray = JSON.parse(importText);

		// Go through each theme and add it to the set of themes
		themesArray.forEach(
			({
				name: name,
				theme1: theme1,
				theme2: theme2,
				theme3: theme3,
			}: SerializedTheme) => {
				const theme = { theme1, theme2, theme3 } as Theme;

				if (!newThemes.has(name)) {
					newThemes.set(name, theme);
				}
			},
		);

		customThemes.set(Array.from(newThemes));

		toastAndAlert('Custom themes imported');
	}

	/**
	 * Generate a JSON string for custom themes.
	 *
	 * @param {[string, Theme][]} customThemes An array of arrays containing theme names and theme color pairs.
	 *
	 * @example
	 * ```ts
	 * // returns '[{"name":"Sunrise","theme1":"#FFDE4D","theme2":"#FFB22C","theme3":"#ff4c4c"}]'
	 * let themeMap = Array.from(new Map([["Sunrise",{"theme1":"#FFDE4D","theme2":"#FFB22C","theme3":"#ff4c4c"}]]));
	 * generateExportThemesText(themeMap);
	 * ```
	 *
	 * @returns {string} A JSON string for the custom themes.
	 */
	function generateExportThemesText(customThemes: [string, Theme][]): string {
		const exportThemesArray = new Array(customThemes.length);

		customThemes.forEach((element, index) => {
			const [name, { theme1, theme2, theme3 }] = element;
			exportThemesArray[index] = { name, theme1, theme2, theme3 };
		});

		return JSON.stringify(exportThemesArray);
	}

	/** A JSON string for a sample puzzle ready to be imported. */
	const importPuzzlesSample = JSON.stringify([freeplayExample]);

	/**
	 * Validate the puzzles the user is trying to import.
	 *
	 * @param {string} importText The custom puzzles JSON string to validate.
	 *
	 * @example
	 * ```ts
	 * // returns [true, '']
	 * validateImportPuzzlesText('[{"title":"Hello, Flippin!","start":"1011110111112101211101210","end":"0202002020000001000101110"}]');
	 * ```
	 *
	 * @returns {[boolean, string]} An array containing the boolean result and an error message if applicable.
	 */
	function validateImportPuzzlesText(importText: string): [boolean, string] {
		if (!importText) {
			return [false, "You can't import nothing!"];
		}

		try {
			const puzzlesArray: SerializedPuzzle[] = JSON.parse(importText);

			// Validate each potential puzzle
			for (const { title: title, start: start, end: end } of puzzlesArray) {
				// Validate that title is populated
				if (!title) {
					return [false, 'One of your puzzles is missing a title!'];
				}

				// Validate start and end length and composition
				if (start === undefined) {
					return [false, `start value for "${title}" must be populated!`];
				}
				if (!stateRegEx.test(start)) {
					return [
						false,
						`start value for "${title}" does not match expected pattern!`,
					];
				}
				if (end === undefined) {
					return [false, `end value for "${title}" must be populated!`];
				}
				if (!stateRegEx.test(end)) {
					return [
						false,
						`end value for "${title}" does not match expected pattern!`,
					];
				}

				// Validate that puzzle is solvable
				if (!isPuzzleSolvable(start, end)) {
					return [false, `"${title}" is not solvable!`];
				}
			}
		} catch (e) {
			// Ignore the JSON parse stuff cause it unhelpfully floods the console
			if (!(e instanceof SyntaxError)) {
				console.warn(e);
			}
			return [false, 'Check the sample for formatting help!'];
		}
		return [true, ''];
	}

	/**
	 * Import custom puzzles.
	 *
	 * @param {string} importText The custom puzzles JSON string to import.
	 *
	 * @example
	 * ```ts
	 * importPuzzles('[{"title":"Hello, Flippin!","start":"1011110111112101211101210","end":"0202002020000001000101110"}]');
	 * ```
	 */
	function importPuzzles(importText: string) {
		const newPuzzles = new Map<string, Puzzle>();
		const puzzlesArray = JSON.parse(importText);

		// Go through each puzzle and add it to the set of puzzles
		puzzlesArray.forEach(
			({ title: title, start: start, end: end }: SerializedPuzzle) => {
				const puzzle = { start, end } as Puzzle;

				if (title !== freeplayExample.title && !newPuzzles.has(title)) {
					newPuzzles.set(title, puzzle);
				}
			},
		);

		customPuzzles.set(Array.from(newPuzzles));

		toastAndAlert('Custom puzzles imported');
	}

	/**
	 * Generate a JSON string for custom puzzles.
	 *
	 * @param {[string, Puzzle][]} customPuzzles An array of arrays containing puzzle names and puzzle states.
	 *
	 * @example
	 * ```ts
	 * // returns '[{"title":"Hello, Flippin!","start":"1011110111112101211101210","end":"0202002020000001000101110"}]'
	 * let puzzleMap = Array.from(new Map([["Hello, Flippin!",{"start":"1011110111112101211101210","end":"0202002020000001000101110"}]]));
	 * generateExportPuzzlesText(puzzleMap);
	 * ```
	 *
	 * @returns {string} A JSON string for the custom puzzles.
	 */
	function generateExportPuzzlesText(
		customPuzzles: [string, Puzzle][],
	): string {
		const exportPuzzlesArray = new Array(customPuzzles.length);

		customPuzzles.forEach((element, index) => {
			const [title, { start, end }] = element;
			exportPuzzlesArray[index] = { title, start, end };
		});

		return JSON.stringify(exportPuzzlesArray);
	}

	/**
	 * A grouping function for the Select component.
	 *
	 * @param {SelectItem} item The item passed into the Select component.
	 */
	const groupBy = (item: SelectItem) => item.group;
</script>

<script lang="ts">
	import { storageConsent } from '$src/stores/stores';

	/** The distance between the list results and Select box. */
	let listOffset = 5;
	/** Configurations for the Select component. */
	let floatingConfig = {
		strategy: 'fixed',
		middleware: [
			offset(listOffset),
			size({
				apply({ availableWidth, availableHeight, elements }) {
					Object.assign(elements.floating.style, {
						maxWidth: `${availableWidth}px`,
						// Limit max list height to 5 elements
						maxHeight: `${Math.min(availableHeight, 210)}px`,
					});
				},
			}),
		],
	};

	/** The import/export modes for themes. */
	let importThemesMode: 'import' | 'export' | null = null;
	/** User provided JSON string for themes. */
	let importThemesText: string;
	/** JSON string containing the saved custom themes. */
	let exportThemesText = '';

	$: [importThemesTextIsValid, importThemesErrorMessage] =
		validateImportThemesText(importThemesText);
	$: exportThemesText = generateExportThemesText($customThemes);

	/**
	 * Copies a JSON string of theme data to the clipboard.
	 *
	 * @param {string} text A JSON string of theme data.
	 *
	 * @example
	 * ```ts
	 * onCopyThemesClick('[{"name":"Sunrise","theme1":"#FFDE4D","theme2":"#FFB22C","theme3":"#ff4c4c"}]');
	 * ```
	 */
	function onCopyThemesClick(text: string): void {
		navigator.clipboard.writeText(text).then(
			() => toastAndAlert('Custom themes copied to clipboard'),
			() =>
				toastAndAlert('Could not complete action', {
					theme: { '--toastBackground': 'var(--error-color)' },
				}),
		);
	}

	/** The import/export modes for puzzles. */
	let importPuzzlesMode: 'import' | 'export' | null = null;
	/** User provided JSON string for puzzles. */
	let importPuzzlesText: string;
	/** JSON string containing the saved custom puzzles. */
	let exportPuzzlesText = '';

	$: [importPuzzlesTextIsValid, importPuzzlesErrorMessage] =
		validateImportPuzzlesText(importPuzzlesText);
	$: exportPuzzlesText = generateExportPuzzlesText($customPuzzles);

	/**
	 * Copies a JSON string of puzzle data to the clipboard.
	 *
	 * @param {string} text A JSON string of puzzle data.
	 *
	 * @example
	 * ```ts
	 * onCopyPuzzlesClick('[{"title":"Hello, Flippin!","start":"1011110111112101211101210","end":"0202002020000001000101110"}]');
	 * ```
	 */
	function onCopyPuzzlesClick(text: string): void {
		navigator.clipboard.writeText(text).then(
			() => toastAndAlert('Custom puzzles copied to clipboard'),
			() =>
				toastAndAlert('Could not complete action', {
					theme: { '--toastBackground': 'var(--error-color)' },
				}),
		);
	}
</script>

{#if $storageNoticeVisible}
	<StorageConsent />
{:else}
	<Dialog>
		<svelte:fragment slot="title">Settings</svelte:fragment>

		<div class="settings-container">
			<Toggle
				toggled={get(darkMode)}
				on:click={() => darkMode.update((mode) => !mode)}
				hideLabel
				label="dark mode"
				style="transform: translateX(-0.8rem) scale(1.6); touch-action: manipulation; flex-basis: 2.5rem;"
				switchColor="var(--color-bg-1)"
				toggledColor="var(--toastBackground)"
				untoggledColor="var(--color-selected)"
				><div aria-hidden="true" class="label">Dark mode</div></Toggle
			>

			<div class="select-container">
				<div aria-hidden="true" class="label">Theme</div>
				<label class="visually-hidden" for="themes-select">color theme</label>
				<Select
					items={[...$themes.keys()].map((name) =>
						name.startsWith(customPrefix)
							? {
									value: name,
									label: name.substring(customPrefix.length),
									group: 'Custom',
								}
							: { value: name, label: name, group: 'Default' },
					)}
					value={$colorTheme}
					{groupBy}
					{floatingConfig}
					on:select={({ detail: { value } }) => colorTheme.set(value)}
					clearable={false}
					searchable={true}
					containerStyles="flex: 1 1 auto;width:13rem;"
					inputStyles="box-sizing: border-box;"
					id="themes-select"
				>
					<div slot="empty" class="select-empty">No themes found</div>
				</Select>
			</div>

			<svg
				viewBox="0 0 41 5"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				role="img"
				aria-label="Flippin logo with color theme applied"
			>
				<path
					d="M0 0.5 H5 M0.5 0 V5 M1.5 0 V5 M0 2.5 H5"
					stroke="var(--color-theme-1)"
				/>
				<path
					d="M6.5 0 V5 M7.5 0 V5 M6 4.5 H11"
					stroke="var(--color-theme-2)"
				/>
				<path
					d="M12 0.5 H17 M13.5 0 V5 M14.5 0 V5 M12 4.5 H17"
					stroke="var(--color-theme-3)"
				/>
				<path
					d="M18 0.5 H23 M18.5 0 V5 M19.5 0 V5 M22.5 0 V3 M18 2.5 H23"
					stroke="var(--color-theme-1)"
				/>
				<path
					d="M24 0.5 H29 M24.5 0 V5 M27.5 0 V3 M28.5 0 V3 M24 2.5 H29"
					stroke="var(--color-theme-2)"
				/>
				<path
					d="M30 0.5 H35 M32.5 0 V5 M33.5 0 V5 M30 4.5 H35"
					stroke="var(--color-theme-3)"
				/>
				<path
					d="M36.5 0 V5 M39.5 0 V5 M40.5 0 V5 M37 1.5 H38 M38 2.5 H39"
					stroke="var(--color-theme-1)"
				/>
			</svg>

			<div class="settings-buttons">
				<button
					class:active={importThemesMode === 'import'}
					on:click={() =>
						(importThemesMode =
							importThemesMode === 'import' ? null : 'import')}
				>
					Import Custom Themes
				</button>
				<button
					class:active={importThemesMode === 'export'}
					on:click={() =>
						(importThemesMode =
							importThemesMode === 'export' ? null : 'export')}
				>
					Export Custom Themes
				</button>
			</div>
			<div aria-live="polite">
				{#if importThemesMode === 'import'}
					<div class="user-info">
						<p>
							<strong>Warning:</strong> Importing will
							<strong>OVERWRITE</strong> your currently saved custom themes.
						</p>
						<p>
							If you have existing custom themes you want to keep, export them
							first and modify the output before importing.
						</p>
						<p>
							A sample import statement for 2 custom themes is provided below by
							pressing the <em>Copy Sample</em> button.
						</p>
						<p>
							Custom themes must have unique names. If there are duplicates, the
							first theme listed with that name will be used.
						</p>
						<p>
							For easier editing, try formatting your input somewhere else and
							paste the completed text below.
						</p>
						<p>
							<strong>Note:</strong> Only user-added custom themes are affected by
							importing, not default themes.
						</p>

						<div
							role="status"
							aria-label="custom theme import status message"
							id="import-themes-error-message"
						>
							{#if !importThemesText}
								Paste your custom themes here!
							{:else if importThemesTextIsValid}
								Ready to import!
							{:else}
								{importThemesErrorMessage}
							{/if}
						</div>
						<label class="visually-hidden" for="import-themes-text"
							>custom theme import</label
						>
						<textarea
							id="import-themes-text"
							name="import-themes-text"
							rows="4"
							bind:value={importThemesText}
							placeholder={importThemesSample}
							aria-errormessage="import-themes-error-message"
							aria-invalid={importThemesText?.length > 0 &&
								!importThemesTextIsValid}
						/>
						<div class="settings-buttons">
							<button
								class="import-button"
								style:align-self="flex-start"
								on:click={() => {
									if (importThemesTextIsValid) {
										importThemes(importThemesText);
									}
								}}
								disabled={!importThemesTextIsValid}
								aria-disabled={!importThemesTextIsValid}
							>
								Import Themes
							</button>
							<button on:click={() => onCopyThemesClick(importThemesSample)}>
								Copy Sample Themes
							</button>
						</div>
					</div>
				{/if}
				{#if importThemesMode === 'export'}
					<div class="user-info">
						<p>
							Copy the text below or press the <em>Copy Themes</em> button to copy
							to your clipboard!
						</p>
						<label class="visually-hidden" for="export-themes-text"
							>custom theme export</label
						>
						<textarea
							id="export-themes-text"
							name="export-themes-text"
							rows="4"
							value={exportThemesText}
							aria-readonly="true"
							readonly
						/>
						<div class="settings-buttons">
							<button on:click={() => onCopyThemesClick(exportThemesText)}>
								Copy Themes
							</button>
						</div>
					</div>
				{/if}
			</div>

			<Toggle
				toggled={get(gameMode) === 'freeplay'}
				on:click={() =>
					gameMode.update((mode) => {
						if (mode === 'daily') {
							return 'freeplay';
						} else {
							return 'daily';
						}
					})}
				hideLabel
				label="freeplay"
				style="transform: translateX(-0.8rem) scale(1.6); touch-action: manipulation; flex-basis: 2.5rem;"
				switchColor="var(--color-bg-1)"
				toggledColor="var(--toastBackground)"
				untoggledColor="var(--color-selected)"
				><div aria-hidden="true" class="label">Freeplay</div></Toggle
			>
			<div aria-live="polite">
				{#if $gameMode === 'freeplay'}
					<p>
						<strong>Note:</strong> Stats are unaffected while in freeplay mode!
						To resume daily play from where you left off, either toggle
						<em>Freeplay</em> off or reload the page.
					</p>

					<div class="select-container">
						<div aria-hidden="true" class="label">Puzzle</div>
						<label class="visually-hidden" for="puzzles-select"
							>freeplay puzzle</label
						>
						<Select
							items={[...$freeplayPuzzles.keys()].map((title) =>
								title.startsWith(customPrefix)
									? {
											value: title,
											label: title.substring(customPrefix.length),
											group: 'Custom',
										}
									: { value: title, label: title, group: 'Daily' },
							)}
							value={$freeplayPuzzle.title}
							{groupBy}
							{floatingConfig}
							on:select={({ detail: { value } }) => {
								const puzzle = $freeplayPuzzles.get(value);
								const serializedPuzzle = puzzle
									? { title: value, start: puzzle.start, end: puzzle.end }
									: freeplayExample;
								freeplayPuzzle.set(serializedPuzzle);
								shouldReset.set(true);
							}}
							clearable={false}
							searchable={true}
							containerStyles="flex: 1 1 auto;width:13rem;"
							inputStyles="box-sizing: border-box;"
							id="puzzles-select"
						>
							<div slot="empty" class="select-empty">No puzzles found</div>
						</Select>
					</div>
				{/if}
			</div>

			<div class="settings-buttons">
				<button
					class:active={importPuzzlesMode === 'import'}
					on:click={() =>
						(importPuzzlesMode =
							importPuzzlesMode === 'import' ? null : 'import')}
				>
					Import Custom Puzzles
				</button>
				<button
					class:active={importPuzzlesMode === 'export'}
					on:click={() =>
						(importPuzzlesMode =
							importPuzzlesMode === 'export' ? null : 'export')}
				>
					Export Custom Puzzles
				</button>
			</div>
			<div aria-live="polite">
				{#if importPuzzlesMode === 'import'}
					<div class="user-info">
						<p>
							<strong>Warning:</strong> Importing will
							<strong>OVERWRITE</strong> your currently saved custom puzzles.
						</p>
						<p>
							If you have existing custom puzzles you want to keep, export them
							first and modify the output before importing.
						</p>
						<p>
							A sample import statement for a custom puzzle is provided below by
							pressing the <em>Copy Sample</em> button.
						</p>
						<p>
							Custom puzzles must have unique titles. If there are duplicates,
							the first puzzle listed with that title will be used.
						</p>
						<p>
							The numbers 0, 1, and 2 represent the theme colors associated with
							each tile.
						</p>
						<p>
							<em>start</em> and <em>end</em> represent the states of the board and
							can be read as the tile values left-to-right and row-by-row.
						</p>
						<p>
							For easier editing, try formatting your input somewhere else and
							paste the completed text below.
						</p>
						<p>
							<strong>Note:</strong> Only user-added custom puzzles are affected
							by importing, not previous daily puzzles or the example custom puzzle.
						</p>

						<div
							role="status"
							aria-label="custom puzzle import status message"
							id="import-puzzles-error-message"
						>
							{#if !importPuzzlesText}
								Paste your custom puzzles here!
							{:else if importPuzzlesTextIsValid}
								Ready to import!
							{:else}
								{importPuzzlesErrorMessage}
							{/if}
						</div>
						<label class="visually-hidden" for="import-puzzles-text"
							>custom puzzle import</label
						>
						<textarea
							id="import-puzzles-text"
							name="import-puzzles-text"
							rows="4"
							bind:value={importPuzzlesText}
							placeholder={importPuzzlesSample}
							aria-errormessage="import-puzzles-error-message"
							aria-invalid={importPuzzlesText?.length > 0 &&
								!importPuzzlesTextIsValid}
						/>
						<div class="settings-buttons">
							<button
								class="import-button"
								style:align-self="flex-start"
								on:click={() => {
									if (importPuzzlesTextIsValid) {
										importPuzzles(importPuzzlesText);
									}
								}}
								disabled={!importPuzzlesTextIsValid}
								aria-disabled={!importPuzzlesTextIsValid}
							>
								Import Puzzles
							</button>
							<button on:click={() => onCopyPuzzlesClick(importPuzzlesSample)}>
								Copy Sample Puzzle
							</button>
						</div>
					</div>
				{/if}
				{#if importPuzzlesMode === 'export'}
					<div class="user-info">
						<p>
							Copy the text below or press the <em>Copy Puzzles</em> button to copy
							to your clipboard!
						</p>
						<label class="visually-hidden" for="export-puzzles-text"
							>custom puzzle export</label
						>
						<textarea
							id="export-puzzles-text"
							name="export-puzzles-text"
							rows="4"
							value={exportPuzzlesText}
							aria-readonly="true"
							readonly
						/>
						<div class="settings-buttons">
							<button on:click={() => onCopyPuzzlesClick(exportPuzzlesText)}>
								Copy Puzzles
							</button>
						</div>
					</div>
				{/if}
			</div>

			<Toggle
				toggled={get(reducedMotion) === true}
				on:click={() => reducedMotion.update((mode) => !mode)}
				hideLabel
				label="reduced motion"
				style="transform: translateX(-0.8rem) scale(1.6); touch-action: manipulation; flex-basis: 2.5rem;"
				switchColor="var(--color-bg-1)"
				toggledColor="var(--toastBackground)"
				untoggledColor="var(--color-selected)"
				><div aria-hidden="true" class="label">Reduced motion</div></Toggle
			>

			<hr />

			<div class="storage-consent-container">
				<p>
					You currently <strong
						>{$storageConsent ? 'ALLOW' : 'DO NOT ALLOW'}</strong
					> local storage.
				</p>
				<button
					on:click={() => {
						storageNoticeVisible.set(true);
					}}
				>
					Update Storage Consent
				</button>
			</div>
		</div>
	</Dialog>
{/if}

<style>
	.settings-container :last-child {
		margin-bottom: 0;
	}

	.select-container {
		--background: var(--color-list-bg);
		--border: 2px solid var(--color-list-border);
		--border-hover: 2px solid var(--color-list-border-hover);
		--placeholder-color: var(--color-list-placeholder);
		--list-background: var(--background);
		--item-is-not-selectable-color: var(--color-text);
		--item-color: var(--color-text);
		--selected-item-color: var(--item-color);
		--item-hover-color: var(--item-color);
		--item-is-active-color: var(--item-color);
		--item-hover-bg: var(--color-list-hover);
		--item-is-active-bg: var(--color-list-selected);
		--list-max-height: 126px;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		margin-top: 0.5rem;
		margin-bottom: 0.8rem;
	}

	.select-container .label {
		margin: 0;
	}

	.select-empty {
		text-align: center;
		padding: 10px 0;
		color: var(--color-text);
	}

	.label {
		order: -1;
		flex-grow: 1.5;
		font-size: 1.2em;
		margin: 0.8rem 0;
		padding: 0.4rem 0.8rem 0.4rem 0;
	}

	@media (max-width: 480px) {
		.label {
			flex-grow: 1;
		}
	}

	@media (max-width: 400px) {
		.select-container {
			align-items: flex-start;
		}
	}

	.settings-buttons {
		display: flex;
		margin: 0.8rem 0;
		justify-content: space-evenly;
	}

	button {
		border-radius: 5px;
		border: 2px solid var(--color-border);
	}

	button:disabled {
		color: var(--color-disabled-text);
		background-color: var(--color-disabled-bg);
	}

	button:disabled:hover {
		background-color: var(--color-disabled-bg);
	}

	.user-info {
		display: flex;
		flex-direction: column;
	}

	.user-info > p {
		margin: 0.5rem 0;
	}

	.user-info :first-child {
		margin-top: 0;
	}

	.user-info label {
		margin: 0.5rem 0;
	}

	textarea {
		word-wrap: break-word;
		word-break: break-all;
	}

	.storage-consent-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
</style>
