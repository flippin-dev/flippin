/**
 * @file Contains game state information for Flippin.
 * @author Brendan Sherman
 */

import { freeplayExample, puzzles } from '$lib/puzzles';
import type { SerializedPuzzle } from '$lib/puzzles';
import { gameNumber } from '$src/stores/stores';
import { get } from 'svelte/store';

/** The size of the game board. */
export const boardSize = 5;
/** The number of different labels (colors) for a tile. */
const numLabels = 3;
/** RegEx to check for valid board state. */
export const stateRegEx = new RegExp(
	`^[0-${numLabels - 1}]{${boardSize * boardSize}}$`,
	'i',
);

/** Class representing a game of Flippin. */
export class Game {
	/** The title of the puzzle. */
	title: string;
	/** The current state of the puzzle. */
	current: number[][];
	/** The end state of the puzzle. */
	end: number[][];

	/**
	 * Create a game object from a current game state or initialize a new game.
	 *
	 * @param {string}           currentState The current game state.
	 * @param {SerializedPuzzle} puzzle       The puzzle to initialize with.
	 *
	 * @example
	 * ```ts
	 * new Game('', puzzles[(get(gameNumber) - 1) % puzzles.length]);
	 * ```
	 */
	constructor(
		currentState: string = '',
		puzzle: SerializedPuzzle = get(gameNumber) > 0 &&
		get(gameNumber) < puzzles.length + 1
			? puzzles[get(gameNumber) - 1]
			: freeplayExample,
	) {
		const { title, start, end } = puzzle;
		const startNumberArray = start.split('').map((e) => +e);
		const endNumberArray = end.split('').map((e) => +e);

		this.end = [...Array(boardSize)].map(() =>
			endNumberArray.splice(0, boardSize),
		);

		// Use the passed state if valid, otherwise use the starting state
		if (stateRegEx.test(currentState)) {
			const currentNumberArray = currentState.split('').map((e) => +e);
			this.current = [...Array(boardSize)].map(() =>
				currentNumberArray.splice(0, boardSize),
			);
		} else {
			this.current = [...Array(boardSize)].map(() =>
				startNumberArray.splice(0, boardSize),
			);
		}

		this.title = title;
	}

	/**
	 * Update game state after interacting with a tile.
	 *
	 * @param {number} row    The tile row.
	 * @param {number} column The tile column.
	 *
	 * @example
	 * ```ts
	 * // returns true
	 * update(3, 3);
	 * ```
	 *
	 * @returns {boolean} True if the action was valid, false otherwise.
	 */
	update(row: number, column: number): boolean {
		const valid =
			row >= 0 &&
			row <= boardSize - 1 &&
			column >= 0 &&
			column <= boardSize - 1;

		if (!valid) {
			return false;
		}

		const updatePositions = [
			[0, 0],
			[1, 0],
			[0, 1],
			[-1, 0],
			[0, -1],
		];
		const updateIndices = updatePositions
			.map((e) => [e[0] + row, e[1] + column])
			.filter(
				(e) =>
					e[0] >= 0 &&
					e[0] <= boardSize - 1 &&
					e[1] >= 0 &&
					e[1] <= boardSize - 1,
			);

		updateIndices.forEach((e) => {
			this.current[e[0]][e[1]] = (this.current[e[0]][e[1]] + 1) % numLabels;
		});

		return true;
	}

	/**
	 * Serialize the current game state to a string.
	 *
	 * @returns {string} The game state as a string.
	 */
	serializeCurrent(): string {
		return this.current.toString().replaceAll(',', '');
	}

	/**
	 * Serialize the end game state to a string.
	 *
	 * @returns {string} The game state as a string.
	 */
	serializeEnd(): string {
		return this.end.toString().replaceAll(',', '');
	}
}
