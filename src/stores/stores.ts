import type { Stats, GameDetails } from '$lib/stats';
import { newGameDetails, newStats } from '$lib/stats';
import type { Theme } from '$lib/themes';
import { colorRegEx, defaultThemesMap } from '$lib/themes';
import { puzzles, freeplayExample, testPuzzle } from '$lib/puzzles';
import { isPuzzleSolvable } from '$lib/math';
import type { Puzzle, SerializedPuzzle } from '$lib/puzzles';
import { derived, get, writable } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';
import { stateRegEx } from '$lib/game';
import { getDaysFromStart } from '$lib/time';
import {
	locallyPersistable,
	locallyPersistableController,
} from '$lib/store-utilities';

/** The prefix for custom themes and puzzles. */
export const customPrefix = 'CSTM-';

/** Whether or not the daily puzzle has been won. */
export const hasWon: Writable<boolean> = writable(false);
/** Whether or not the freeplay puzzle has been won. */
export const hasWonFreeplay: Writable<boolean> = writable(false);
/** Whether or not the freeplay puzzle has been changed to another freeplay puzzle. */
export const hasChangedFreeplayPuzzle: Writable<boolean> = writable(false);
/** Whether or not the game has been surrendered. */
export const shouldSurrender: Writable<boolean> = writable(false);
/** Whether or not a hint is needed. */
export const needsHint: Writable<boolean> = writable(false);
/** Whether or not a hint is active. */
export const hintActive: Writable<boolean> = writable(false);
/** Whether or not a board reset is needed. */
export const shouldReset: Writable<boolean> = writable(false);
/** Whether or not the freeplay timer should be reset. */
export const shouldResetFreeplayTimer: Writable<boolean> = writable(false);
/** Whether or not the last tile pressed needs to be focused on again. */
export const shouldRefocus: Writable<boolean> = writable(false);
/** The game timer for daily mode. */
export const gameTime: Writable<number> = writable(0);
/** The game timer for freeplay mode. */
export const freeplayGameTime: Writable<number> = writable(0);
/** The screen being displayed. */
export const currentScreen: Writable<
	null | 'tutorial' | 'settings' | 'stats' | 'surrender'
> = writable('tutorial');
/** The storage consent notice is visible. */
export const storageNoticeVisible: Writable<boolean> = writable(false);
/** The daily game number. */
export const gameNumber: Writable<number> = writable(getDaysFromStart());
/** The daily puzzle title. */
export const dailyTitle: Readable<string> = derived(
	gameNumber,
	($gameNumber) => {
		return $gameNumber > 0 && $gameNumber < puzzles.length + 1
			? puzzles[$gameNumber - 1].title
			: freeplayExample.title;
	},
);

/** Storage consent decision. */
export const storageConsent: Writable<boolean | null> =
	locallyPersistableController('flp-storageConsent');
/** The current color theme. */
export const colorTheme: Writable<string> = locallyPersistable(
	storageConsent,
	'flp-colorTheme',
	'Flippin',
);
/** Saved custom color themes. */
export const customThemes: Writable<[string, Theme][]> = locallyPersistable(
	storageConsent,
	'flp-customThemes',
	[],
);
/** Selectable color themes. */
export const themes: Readable<Map<string, Theme>> = derived(
	customThemes,
	($customThemes) => {
		const themesMap = new Map(defaultThemesMap);

		for (const [name, { theme1, theme2, theme3 }] of $customThemes) {
			// Validate that name is populated
			if (!name) {
				continue;
			}
			// Validate that theme colors are in hex code format
			if (theme1 === undefined) {
				continue;
			}
			if (!colorRegEx.test(theme1)) {
				continue;
			}
			if (theme2 === undefined) {
				continue;
			}
			if (!colorRegEx.test(theme2)) {
				continue;
			}
			if (theme3 === undefined) {
				continue;
			}
			if (!colorRegEx.test(theme3)) {
				continue;
			}

			// A prefix is added to custom themes so that they can share a name with default ones
			const adjustedName = `${customPrefix}${name}`;
			if (!themesMap.has(adjustedName)) {
				const theme = { theme1, theme2, theme3 } as Theme;
				themesMap.set(adjustedName, theme);
			}
		}

		return themesMap;
	},
);

/** Saved daily game details. */
export const gameDetails: Writable<GameDetails> = locallyPersistable(
	storageConsent,
	'flp-gameDetails',
	newGameDetails,
);
/** Saved lifetime stats. */
export const stats: Writable<Stats> = locallyPersistable(
	storageConsent,
	'flp-stats',
	newStats,
);

/** Freeplay game details. */
export const freeplayGameDetails: Writable<GameDetails> =
	writable(newGameDetails);

/** Saved dark mode selection. */
export const darkMode: Writable<boolean> = locallyPersistable(
	storageConsent,
	'flp-darkMode',
	true,
);
/** Saved reduced motion selection. */
export const reducedMotion: Writable<boolean | null> = locallyPersistable(
	storageConsent,
	'flp-reducedMotion',
	null,
);

/** The current game mode. */
export const gameMode: Writable<'daily' | 'freeplay'> = writable('daily');

/** The current freeplay puzzle. */
export const freeplayPuzzle: Writable<SerializedPuzzle> = writable({
	title: `${customPrefix}${freeplayExample.title}`,
	start: freeplayExample.start,
	end: freeplayExample.end,
});
/** Saved custom puzzles. */
export const customPuzzles: Writable<[string, Puzzle][]> = locallyPersistable(
	storageConsent,
	'flp-customPuzzles',
	[],
);
/** Selectable freeplay puzzles. */
export const freeplayPuzzles: Readable<Map<string, Puzzle>> = derived(
	[gameNumber, customPuzzles],
	([$gameNumber, $customPuzzles]) => {
		const puzzlesMap = new Map<string, Puzzle>();

		// Allow old daily puzzles to be replayed
		for (const [
			index,
			{ title: title, start: start, end: end },
		] of puzzles.entries()) {
			// Only allow freeplay on puzzles before the current day
			if (index + 1 === $gameNumber) {
				break;
			}

			if (!puzzlesMap.has(title)) {
				const puzzle = { start, end } as Puzzle;
				puzzlesMap.set(title, puzzle);
			}
		}

		// Ensure there is always a freeplay puzzle
		const { title: exTitle, start: exStart, end: exEnd } = freeplayExample;
		puzzlesMap.set(`${customPrefix}${exTitle}`, { start: exStart, end: exEnd });

		// Add a blank puzzle to easily test move combinations
		const { title: testTitle, start: testStart, end: testEnd } = testPuzzle;
		puzzlesMap.set(`${customPrefix}${testTitle}`, {
			start: testStart,
			end: testEnd,
		});

		for (const [title, { start, end }] of $customPuzzles) {
			// Validate that title is populated
			if (!title) {
				continue;
			}

			// Validate start and end length and composition
			if (start === undefined) {
				continue;
			}
			if (!stateRegEx.test(start)) {
				continue;
			}
			if (end === undefined) {
				continue;
			}
			if (!stateRegEx.test(end)) {
				continue;
			}

			// Validate that puzzle start and end are different
			if (start === end) {
				console.warn(`"${title}" is too easy`);
				continue;
			}

			// Validate that puzzle is solvable
			if (!isPuzzleSolvable(start, end)) {
				console.warn(`${title} is not solvable`);
				continue;
			}

			// A prefix is added to custom puzzles so that they can share a name with default ones
			const adjustedName = `${customPrefix}${title}`;
			if (!puzzlesMap.has(adjustedName)) {
				const puzzle = { start, end } as Puzzle;
				puzzlesMap.set(adjustedName, puzzle);
			}
		}

		return puzzlesMap;
	},
);

/** Easily indexable freeplay puzzles. */
export const freeplayPuzzlesArray: Readable<string[]> = derived(
	freeplayPuzzles,
	($freeplayPuzzles) => {
		return Array.from($freeplayPuzzles.keys());
	},
);

/** The current position in the freeplay puzzles array. */
export const freeplayPuzzlesIndex: Writable<number> = writable(
	get(gameNumber) > 0 && get(gameNumber) < puzzles.length + 1
		? get(gameNumber) - 1
		: puzzles.length,
);
