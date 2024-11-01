<!--
@component
A component that presents users with game stats.
-->

<script lang="ts" context="module">
	import Dialog from '$com/Dialog.svelte';
	import { distributionLength, newStats } from '$lib/stats';
	import type { Stats } from '$lib/stats';
	import { stats } from '$src/stores/stores';
	import dayjs from 'dayjs';
	import duration from 'dayjs/plugin/duration';
	import { gameMode } from '$src/stores/stores';
	import { maxTime, maxTimeMessage, timerFormat } from '$lib/time';
	import { toastAndAlert } from '$lib/page-utilities';

	/** A JSON string for sample stats ready to be imported. */
	const importStatsSample = JSON.stringify(newStats);

	/**
	 * Checks that an array of numbers contains only nonnegative values.
	 *
	 * @param {number[]} arr An array of numbers.
	 *
	 * @example
	 * ```ts
	 * // returns false
	 * containsOnlyNonnegative([-1, 0, 1,]);
	 * ```
	 *
	 * @returns {boolean} True if the array contains only nonegative values, false otherwise.
	 */
	function containsOnlyNonnegative(arr: number[]): boolean {
		for (const element of arr) {
			if (element === undefined || element < 0) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Validate the stats the user is trying to import.
	 *
	 * @param {string} importText The stats JSON string to validate.
	 *
	 * @example
	 * ```ts
	 * // returns [true, '']
	 * validateImportStatsText('{"wonGames":1,"fastestGame":23,"fewestMoves":10,"distribution":[1,0,0,0,0,0,0,0,0,0,0]}');
	 * ```
	 *
	 * @returns {[boolean, string]} An array containing the boolean result and an error message if applicable.
	 */
	function validateImportStatsText(importText: string): [boolean, string] {
		if (!importText) {
			return [false, "You can't import nothing!"];
		}

		try {
			const { wonGames, fastestGame, fewestMoves, distribution }: Stats =
				JSON.parse(importText);

			// Validate all fields
			if (wonGames === undefined) {
				return [false, 'wonGames value must be populated!'];
			}
			if (wonGames === null || wonGames < 0) {
				return [false, 'wonGames value must be a nonnegative number!'];
			}
			if (fastestGame === undefined) {
				return [false, 'fastestGame value must be populated!'];
			}
			if (fastestGame !== null && fastestGame < 0) {
				return [
					false,
					'fastestGame must either be null or a nonnegative number!',
				];
			}
			if (fewestMoves && fewestMoves < 0) {
				return [
					false,
					'fewestMoves value must either be null or a nonnegative number!',
				];
			}
			if (distribution === undefined) {
				return [false, 'distribution value must be populated!'];
			}
			if (
				!distribution ||
				distribution.length != distributionLength ||
				!containsOnlyNonnegative(distribution)
			) {
				return [
					false,
					`distribution must be populated with ${distributionLength} nonnegative entries!`,
				];
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
	 * Import stats.
	 *
	 * @param {string} importText The stats JSON string to import.
	 *
	 * @example
	 * ```ts
	 * importStats('{"wonGames":1,"fastestGame":23,"fewestMoves":10,"distribution":[1,0,0,0,0,0,0,0,0,0,0]}');
	 * ```
	 */
	function importStats(importText: string) {
		const importedStats: Stats = JSON.parse(importText);

		stats.set(importedStats);

		toastAndAlert('Stats imported');
	}

	/**
	 * Generate a JSON string for stats.
	 *
	 * @param {Stats} stats An object containing stats info.
	 *
	 * @example
	 * ```ts
	 * // returns '{"wonGames":1,"fastestGame":23,"fewestMoves":10,"distribution":[1,0,0,0,0,0,0,0,0,0,0]}'
	 * let stats = {wonGames:1,fastestGame:23,fewestMoves:10,distribution:[1,0,0,0,0,0,0,0,0,0,0]};
	 * generateExportStatsText(stats);
	 * ```
	 *
	 * @returns {string} A JSON string for the stats.
	 */
	function generateExportStatsText(stats: Stats): string {
		return JSON.stringify(stats);
	}
</script>

<script lang="ts">
	dayjs.extend(duration);

	/**
	 * Format the fastest game time into a string.
	 *
	 * @param {number | null} fastestGame The fastest game time or null.
	 *
	 * @example
	 * ```ts
	 * // returns '02:00'
	 * formatFastestGame(120);
	 * ```
	 *
	 * @returns {string} The time formatted using the timer format or an empty string if null.
	 */
	function formatFastestGame(fastestGame: number | null): string {
		if (!fastestGame) {
			return '';
		} else {
			return dayjs.duration(fastestGame, 's').format(timerFormat);
		}
	}

	/**
	 * Get the row label for the time distribution graphic.
	 *
	 * @param {number} row The row number.
	 *
	 * @example
	 * ```ts
	 * // returns '< 5 m'
	 * getRowLabel(4);
	 * ```
	 *
	 * @returns {string} A label for the bucket in the distribution.
	 */
	function getRowLabel(row: number): string {
		if (row < maxTime / 60) {
			return `< ${row + 1} m`;
		} else {
			return maxTimeMessage;
		}
	}

	/** The most frequent value in the times distribution. */
	$: distributionMax = Math.max(...$stats.distribution);

	/** The import/export modes for stats. */
	let importStatsMode: 'import' | 'export' | null = null;
	/** User provided JSON string for stats. */
	let importStatsText: string;
	/** JSON string containing the saved stats. */
	let exportStatsText = '';

	$: [importStatsTextIsValid, importStatsErrorMessage] =
		validateImportStatsText(importStatsText);

	/**
	 * Copies a JSON string of stats data to the clipboard.
	 *
	 * @param {string} text A JSON string of stats data.
	 *
	 * @example
	 * ```ts
	 * onCopyClick('{"wonGames":1,"fastestGame":23,"fewestMoves":10,"distribution":[1,0,0,0,0,0,0,0,0,0,0]}');
	 * ```
	 */
	function onCopyClick(text: string) {
		navigator.clipboard.writeText(text).then(
			() => toastAndAlert('Stats copied to clipboard'),
			() =>
				toastAndAlert('Could not complete action', {
					theme: { '--toastBackground': 'var(--error-color)' },
				}),
		);
	}

	$: exportStatsText = generateExportStatsText($stats);
</script>

<Dialog>
	<svelte:fragment slot="title">Stats</svelte:fragment>

	<div class="stats-container">
		{#if $gameMode === 'freeplay'}
			<p><strong>Note:</strong> Stats are unaffected while in freeplay mode!</p>
			<hr />
		{/if}
		<div
			role="table"
			aria-label="user stats overview"
			class="text-stats-container"
		>
			<div role="row" data-testid="won-games" class="stats-item">
				<span role="rowheader"
					><strong role="presentation">Games Won</strong></span
				>
				<span role="cell">{$stats.wonGames}</span>
			</div>
			<div role="row" data-testid="fastest-game" class="stats-item">
				<span role="rowheader"
					><strong role="presentation">Fastest Game</strong></span
				>
				<span role="cell">{formatFastestGame($stats.fastestGame)}</span>
			</div>
			<div role="row" data-testid="fewest-moves" class="stats-item">
				<span role="rowheader"
					><strong role="presentation">Fewest Moves</strong></span
				>
				<span role="cell">{$stats.fewestMoves ?? ''}</span>
			</div>
		</div>

		<hr />

		<div class="graph-container">
			<table aria-label="win time history">
				<tr>
					<th scope="col">Time</th>
					<th scope="col">Games Won</th>
				</tr>
				{#each Array.from(Array(distributionLength).keys()) as row}
					{@const color1 = row % 3 === 0}
					{@const color2 = row % 3 === 1}
					{@const color3 = row % 3 === 2}
					<tr>
						<th scope="row">
							{getRowLabel(row)}
						</th>
						<td>
							<div
								data-testid="row{row}"
								class="graph-bar"
								class:color1
								class:color2
								class:color3
								style:width={`${($stats.distribution[row] / Math.max(distributionMax, 1)) * 100}%`}
							>
								{$stats.distribution[row]}
							</div>
						</td>
					</tr>
				{/each}
			</table>
		</div>

		<div class="stats-buttons" class:stats-compact={importStatsMode === null}>
			<button
				class:active={importStatsMode === 'import'}
				on:click={() =>
					(importStatsMode = importStatsMode === 'import' ? null : 'import')}
			>
				Import Stats
			</button>
			<button
				class:active={importStatsMode === 'export'}
				on:click={() =>
					(importStatsMode = importStatsMode === 'export' ? null : 'export')}
			>
				Export Stats
			</button>
		</div>
		<div aria-live="polite">
			{#if importStatsMode === 'import'}
				<div class="stats-info">
					<p>
						<strong>Warning:</strong> Importing will <strong>OVERWRITE</strong> your
						currently saved stats.
					</p>
					<p>
						If you have existing stats you want to keep, export them first and
						modify the output before importing.
					</p>
					<p>
						A sample import statement for empty stats is provided below by
						pressing the <em>Copy Sample</em> button.
					</p>
					<p>
						For easier editing, try formatting your input somewhere else and
						paste the completed text below.
					</p>
					<p>
						<strong>Note:</strong> Only stats are affected by importing, for other
						options check settings.
					</p>

					<div
						role="status"
						aria-label="stats import status message"
						id="import-stats-error-message"
					>
						{#if !importStatsText}
							Paste your stats here!
						{:else if importStatsTextIsValid}
							Ready to import!
						{:else}
							{importStatsErrorMessage}
						{/if}
					</div>
					<label class="visually-hidden" for="import-stats-text"
						>stats import</label
					>
					<textarea
						id="import-stats-text"
						name="import-stats-text"
						rows="4"
						bind:value={importStatsText}
						placeholder={importStatsSample}
						aria-errormessage="import-stats-error-message"
						aria-invalid={importStatsText?.length > 0 &&
							!importStatsTextIsValid}
					/>
					<div class="stats-buttons">
						<button
							class="import-button"
							style:align-self="flex-start"
							on:click={() => {
								if (importStatsTextIsValid) {
									importStats(importStatsText);
								}
							}}
							disabled={!importStatsTextIsValid}
							aria-disabled={!importStatsTextIsValid}
						>
							Import New Stats
						</button>
						<button on:click={() => onCopyClick(importStatsSample)}>
							Copy Sample Stats
						</button>
					</div>
				</div>
			{/if}
			{#if importStatsMode === 'export'}
				<div class="stats-info">
					<p>
						Copy the text below or press the <em>Copy</em> button to copy to your
						clipboard!
					</p>
					<label class="visually-hidden" for="export-stats-text"
						>stats export</label
					>
					<textarea
						id="export-stats-text"
						name="export-stats-text"
						rows="4"
						value={exportStatsText}
						aria-readonly="true"
						readonly
					/>
					<div class="stats-buttons">
						<button on:click={() => onCopyClick(exportStatsText)}>
							Copy Stats
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
</Dialog>

<style>
	.stats-container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.text-stats-container {
		display: flex;
		width: 100%;
		flex-wrap: wrap;
	}

	.stats-item {
		flex: 1 1 0;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		text-align: center;
		text-wrap: nowrap;
		padding: 0 0.5rem;
	}

	.graph-container {
		width: 100%;
	}

	hr {
		width: 100%;
	}

	table {
		width: 100%;
		border-spacing: 0;
	}

	th,
	td {
		padding: 3px 4px;
	}

	th {
		padding-bottom: 8px;
		font-size: 1.1em;
		text-align: left;
	}

	th:first-child,
	td:first-child {
		width: 60px;
	}

	.graph-bar {
		height: 20px;
		min-width: 20px;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: clip;
		font-weight: 700;
		border-radius: 8px;
		/* this will hopefully keep the data legible regardless of theme colors */
		-webkit-text-stroke: 0.5px var(--color-text-outline);
	}

	.stats-buttons {
		display: flex;
		width: 100%;
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

	.stats-compact {
		margin-bottom: 0;
	}

	.stats-info {
		display: flex;
		flex-direction: column;
	}

	.stats-info > p {
		margin: 0.5rem 0;
	}

	.stats-info :first-child {
		margin-top: 0;
	}

	.stats-info :last-child {
		margin-bottom: 0;
	}

	.stats-info label {
		margin: 0.5rem 0;
	}

	textarea {
		word-wrap: break-word;
		word-break: break-all;
	}
</style>
