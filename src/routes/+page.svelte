<script lang="ts">
	import { quintOut } from 'svelte/easing';
	import {
		hasWon,
		gameTime,
		gameDetails,
		stats,
		shouldReset,
		gameNumber,
		gameMode,
		freeplayPuzzle,
		hasWonFreeplay,
		reducedMotion,
		shouldRefocus,
		needsHint,
		hintActive,
		shouldSurrender,
		freeplayGameTime,
		freeplayGameDetails,
		shouldResetFreeplayTimer,
		hasChangedFreeplayPuzzle,
	} from '$src/stores/stores';
	import Title from '$com/Title.svelte';
	import Controls from '$com/Controls.svelte';
	import { onMount, tick } from 'svelte';
	import { get } from 'svelte/store';
	import { newGameDetails, newStats } from '$lib/stats';
	import { Game, boardSize } from '$lib/game';
	import GameOverBlock from '$com/GameOverBlock.svelte';
	import { freeplayExample } from '$lib/puzzles';
	import { maxTime } from '$lib/time';
	import type { TransitionConfig } from 'svelte/transition';
	import { navigateTable } from '$lib/page-utilities';
	import ExtraControls from '$com/ExtraControls.svelte';
	import { findMinimalSolution } from '$lib/math';
	import FreeplayControls from '$com/FreeplayControls.svelte';

	/** The directions a tile can flip. */
	type FlipDirections = 'up' | 'right' | 'down' | 'left' | null;

	/**
	 * Get the direction to flip a tile.
	 *
	 * @param {number} row    The row number.
	 * @param {number} column The column number.
	 *
	 * @example
	 * ```ts
	 * // Given lastRow, lastColumn = 0, returns 'down'
	 * getDirection(1, 0);
	 * ```
	 *
	 * @returns {FlipDirections} The direction to flip if adjacent to last move, null otherwise.
	 */
	function getDirection(row: number, column: number): FlipDirections {
		if (lastRow >= 0 && lastColumn >= 0) {
			if (row === lastRow - 1 && column === lastColumn) {
				return 'up';
			} else if (row === lastRow && column === lastColumn + 1) {
				return 'right';
			} else if (row === lastRow + 1 && column === lastColumn) {
				return 'down';
			} else if (row === lastRow && column === lastColumn - 1) {
				return 'left';
			} else {
				return null;
			}
		}

		return null;
	}

	/** Parameters for the tile flip animation. */
	type SpinParams = {
		duration: number;
		direction: FlipDirections;
		label: number;
	};

	/**
	 * Create a transition animation for when a tile is flipped.
	 *
	 * @param {Element}    node   The node to act on.
	 * @param {SpinParams} params The parameters for the animation.
	 *
	 * @returns {TransitionConfig} The transition animation for the tile.
	 */
	function spin(node: Element, params: SpinParams): TransitionConfig {
		const { duration, direction, label } = params;
		if (get(reducedMotion) || !direction) {
			return {
				duration: 0,
				css: () => {
					return '';
				},
			};
		}

		const colorFrom = `var(--color-theme-${label === 0 ? 3 : label})`;
		const colorTo = `var(--color-theme-${label + 1})`;

		return {
			duration,
			css: (t: number) => {
				const eased = quintOut(t);
				let rotation = '';
				switch (direction) {
					case 'right':
						rotation = `rotateY(${360 * eased}deg)`;
						break;
					case 'left':
						rotation = `rotateY(${-360 * eased}deg)`;
						break;
					case 'up':
						rotation = `rotateX(${360 * eased}deg)`;
						break;
					case 'down':
						rotation = `rotateX(${-360 * eased}deg)`;
						break;
					default:
						break;
				}

				return `
					transform: ${rotation};
					background: ${eased < 0.75 ? colorFrom : colorTo}`;
			},
		};
	}

	/** How long the flipping animation should last. */
	const flipDuration = 1000;

	/** The game object representing the displayed puzzle. */
	let game: Game;
	/** The row of the tile last interacted with. */
	let lastRow = -1;
	/** The column of the tile last interacted with. */
	let lastColumn = -1;
	/** Whether or not the tiles need to be rerendered after an action. */
	let moveToggle = false;
	/** Whether or not this component has been mounted to the DOM. */
	let isMounted = false;
	/** Whether or not the displayed puzzle is the daily puzzle. */
	let isDaily = true;
	/** The number of moves used so far in the daily puzzle. */
	let moveCount = 0;
	/** The number of moves used so far in the freeplay puzzle. */
	let freeplayMoveCount = 0;
	/** The number of resets used so far in the daily puzzle. */
	let resetCount = 0;
	/** The number of resets used so far in the freeplay puzzle. */
	let freeplayResetCount = 0;
	/** The number of hints used so far in the daily puzzle. */
	let hintCount = 0;
	/** The number of hints used so far in the freeplay puzzle. */
	let freeplayHintCount = 0;
	/** A vector containing the moves needed to solve the puzzle. */
	let hintVector: number[] = [];
	/** The row of the hint tile. */
	let hintRow = -1;
	/** The column of the hint tile. */
	let hintColumn = -1;
	/** Flag for if hintVector can be reused. */
	let hintChain = false;
	/** Whether or not the player has surrendered in the daily puzzle. */
	let hasSurrendered = false;
	/** Whether or not the player has surrendered in the freeplay puzzle. */
	let hasSurrenderedFreeplay = false;

	/** Subscribe to gameDetails so that it's always available for caching. */
	$: curGameDetails = $gameDetails;
	/** Subscribe to stats so that it's always available for caching. */
	$: curStats = $stats;

	/**
	 * Load data from storage and initialize stores.
	 */
	function initializeDaily() {
		// Check if there are any store values from previous games
		if (!curGameDetails) {
			gameDetails.set(newGameDetails);
		}
		if (!curStats) {
			stats.set(newStats);
		}

		// Set game time and current board if the last played game matches the current day
		if (curGameDetails?.lastGame === get(gameNumber)) {
			gameTime.set(curGameDetails?.curTime ?? 0);
			moveCount = curGameDetails?.moveCount ?? 0;
			resetCount = curGameDetails?.resetCount ?? 0;
			hintCount = curGameDetails?.hintCount ?? 0;
			hasSurrendered = curGameDetails?.hasSurrendered ?? false;
			const currentBoard = curGameDetails?.curBoard ?? '';
			game = new Game(currentBoard);
		} else {
			game = new Game();
			gameTime.set(0);
			gameDetails.update(() => {
				return {
					curTime: 0,
					curBoard: game.serializeCurrent(),
					lastGame: get(gameNumber),
					moveCount: 0,
					resetCount: 0,
					hintCount: 0,
					hasSurrendered: false,
				};
			});
		}

		isDaily = true;

		// Check if the user has already won
		hasWon.set(isBoardEqual(game.current, game.end));
	}

	onMount(() => {
		initializeDaily();

		// Signal board to rerender
		isMounted = true;
	});

	/**
	 * Check if two board states are equal.
	 *
	 * @param {number[][]} a The first board state.
	 * @param {number[][]} b The second board state.
	 *
	 * @example
	 * ```ts
	 * // Let a be a board state, returns true
	 * isBoardEqual(a, a);
	 * ```
	 *
	 * @returns {boolean} True if all members are equal, false otherwise.
	 */
	const isBoardEqual = (a: number[][], b: number[][]): boolean => {
		return (
			a.length === b.length &&
			a.every(
				(vo, io) =>
					vo.length === b[io].length && vo.every((vi, ii) => vi === b[io][ii]),
			)
		);
	};

	/**
	 * Update game details store with current game information.
	 */
	function updateDetails() {
		if (isDaily && isMounted) {
			gameDetails.update(() => {
				return {
					curTime: get(gameTime),
					curBoard: game.serializeCurrent(),
					lastGame: get(gameNumber),
					moveCount: moveCount,
					resetCount: resetCount,
					hintCount: hintCount,
					hasSurrendered: hasSurrendered,
				};
			});
		} else if (!isDaily) {
			freeplayGameDetails.update((details) => {
				return {
					curTime: get(freeplayGameTime),
					curBoard: game.serializeCurrent(),
					lastGame: details.lastGame,
					moveCount: freeplayMoveCount,
					resetCount: freeplayResetCount,
					hintCount: freeplayHintCount,
					hasSurrendered: hasSurrenderedFreeplay,
				};
			});
		}
	}

	/**
	 * Update the board after flipping the selected tile.
	 *
	 * @param {number} row    The row number.
	 * @param {number} column The column number.
	 *
	 * @example
	 * ```ts
	 * updateBoard(1, 0);
	 * ```
	 */
	function updateBoard(row: number, column: number) {
		if ($hasWon && $gameMode === 'daily') {
			return;
		}

		if ($gameMode === 'daily') {
			moveCount++;
		} else {
			freeplayMoveCount++;
		}

		if ($hintActive) {
			hintActive.set(false);
			hintChain = true;
		} else if (hintChain) {
			hintChain = false;
		}

		game.update(row, column);

		// Update where the last move was
		lastRow = row;
		lastColumn = column;
		moveToggle = !moveToggle;

		updateDetails();

		// Check if move ends game
		if (isBoardEqual(game.current, game.end)) {
			// Only update stats during daily mode
			if (isDaily) {
				// Update store to signify a won game
				hasWon.set(true);

				// Run on game end to update wonGames, distribution, and fastestGame
				stats.update((stats) => {
					const time = get(gameTime) / 1000;
					const distribution = stats.distribution;
					// Clip time into minute buckets up to time cap
					const index = Math.min(Math.floor(time / 60), maxTime / 60);
					distribution[index] += 1;
					return {
						wonGames: stats.wonGames + 1,
						fastestGame:
							!stats.fastestGame || time < stats.fastestGame
								? time
								: stats.fastestGame,
						fewestMoves:
							!stats.fewestMoves || moveCount < stats.fewestMoves
								? moveCount
								: stats.fewestMoves,
						distribution: distribution,
					};
				});
			} else {
				hasWonFreeplay.set(true);
			}
		}
	}

	// Board reset
	$: if ($shouldReset) {
		// Clear flag
		shouldReset.set(false);

		// Clear any hint information
		hintActive.set(false);
		hintChain = false;

		// Reset game
		if (isDaily) {
			resetCount++;
			game = new Game();
		} else {
			game = new Game('', get(freeplayPuzzle) ?? freeplayExample);

			if (get(hasWonFreeplay) || get(hasChangedFreeplayPuzzle)) {
				hasWonFreeplay.set(false);
				hasChangedFreeplayPuzzle.set(false);

				freeplayMoveCount = 0;
				freeplayResetCount = 0;
				freeplayHintCount = 0;
				hasSurrenderedFreeplay = false;

				freeplayGameTime.set(0);
				shouldResetFreeplayTimer.set(true);
				freeplayGameDetails.update(() => {
					return {
						curTime: 0,
						curBoard: game.serializeCurrent(),
						lastGame: 0, // No need to track this
						moveCount: 0,
						resetCount: 0,
						hintCount: 0,
						hasSurrendered: false,
					};
				});
			} else {
				freeplayResetCount++;
			}
		}

		// Clear last move to trigger rerender without animation
		lastRow = -1;
		lastColumn = -1;

		updateDetails();
	}

	// Hint is needed
	$: if ($needsHint) {
		// Clear flag
		needsHint.set(false);
		// Set active hint flag
		hintActive.set(true);

		// No need to recalculate if back-to-back hints are used
		if (!hintChain) {
			// Find the minimal solution to use for hints
			hintVector = findMinimalSolution(
				game.serializeCurrent(),
				game.serializeEnd(),
			);
		}

		const initialValue: number[] = [];
		const hintIndices = hintVector.reduce(
			(accumulator, currentValue, currentIndex) => {
				if (currentValue > 0) {
					accumulator.push(currentIndex);
				}

				return accumulator;
			},
			initialValue,
		);
		const hintIndex =
			hintIndices[Math.floor(Math.random() * hintIndices.length)];
		hintRow = Math.floor(hintIndex / boardSize);
		hintColumn = hintIndex % boardSize;
		// Remove the hint tile from the hint vector
		hintVector[hintIndex]--;

		// Clear last move to trigger rerender without animation
		lastRow = -1;
		lastColumn = -1;

		if (isDaily) {
			hintCount++;
		} else {
			freeplayHintCount++;
		}
		updateDetails();
	}

	// Surrender puzzle
	$: if ($shouldSurrender) {
		// Clear flag
		shouldSurrender.set(false);

		// Set current board to end board
		game.current = game.end;

		// Flag the game as completed
		if (isDaily) {
			hasWon.set(true);
			// Set surrender flag
			hasSurrendered = true;
		} else {
			hasWonFreeplay.set(true);
			// Set surrender flag
			hasSurrenderedFreeplay = true;
		}

		// Clear last move to trigger rerender without animation
		lastRow = -1;
		lastColumn = -1;
		moveToggle = !moveToggle;

		updateDetails();
	}

	// Refocus after keyboard click
	$: if ($shouldRefocus) {
		(async () => {
			// Await any state changes first
			await tick();
			// Clear flag
			shouldRefocus.set(false);

			// Refocus on previous tile
			(
				gameBoard.querySelector(
					`[data-table-row="${lastRow}"][data-table-col="${lastColumn}"]`,
				) as HTMLElement
			)?.focus();
		})();
	}

	$: if (isDaily && isMounted) {
		gameDetails.update((details) => {
			const time = $gameTime;
			return {
				curTime: time,
				curBoard: details.curBoard,
				lastGame: get(gameNumber),
				moveCount: moveCount,
				resetCount: resetCount,
				hintCount: hintCount,
				hasSurrendered: hasSurrendered,
			};
		});
	}

	/**
	 * Update the puzzle based on the game mode.
	 *
	 * @param {string} mode The game mode.
	 *
	 * @example
	 * ```ts
	 * updatePuzzle('daily');
	 * ```
	 */
	function updatePuzzle(mode: string) {
		// Reinitialize daily details if game mode is switched
		if (mode === 'daily' && !isDaily) {
			// Clear any hint information
			hintActive.set(false);
			hintChain = false;

			// Reset last move to defaults
			lastRow = -1;
			lastColumn = -1;
			moveToggle = !moveToggle;

			initializeDaily();
		} else if (mode === 'freeplay' && isDaily) {
			// Clear any hint information
			hintActive.set(false);
			hintChain = false;

			// Clear surrender flag
			hasSurrendered = false;

			hasWonFreeplay.set(false);

			freeplayMoveCount = 0;
			freeplayResetCount = 0;
			freeplayHintCount = 0;
			hasSurrenderedFreeplay = false;

			freeplayGameTime.set(0);
			freeplayGameDetails.update(() => {
				return {
					curTime: 0,
					curBoard: game.serializeCurrent(), // This will not be updated
					lastGame: 0, // No need to track this
					moveCount: 0,
					resetCount: 0,
					hintCount: 0,
					hasSurrendered: false,
				};
			});

			game = new Game('', $freeplayPuzzle ?? freeplayExample);

			isDaily = false;
		}
	}

	$: updatePuzzle($gameMode);

	/** A binding for the game board element. */
	let gameBoard: HTMLElement;
</script>

<svelte:head>
	<title>Flippin</title>
	<meta
		name="description"
		content="A tile flipping game written in SvelteKit"
	/>
</svelte:head>

{#if !isMounted}
	<div class="loading">
		<p>Loading...</p>
	</div>
{:else}
	<Title />

	<div class="upper-region-container">
		<div role="presentation" class="controls-placeholder" />

		<div
			role="region"
			aria-label="end state of game board"
			class="region-container"
		>
			<div
				role="table"
				class="board reference-board"
				aria-label="reference game board"
			>
				{#each Array.from(Array(boardSize).keys()) as row (row)}
					<div role="row" class="row" style:--numColumns={boardSize}>
						{#each Array.from(Array(boardSize).keys()) as column (column)}
							{@const color1 = game.end[row]?.[column] === 0}
							{@const color2 = game.end[row]?.[column] === 1}
							{@const color3 = game.end[row]?.[column] === 2}
							<div
								class="tile"
								class:color1
								class:color2
								class:color3
								role="cell"
								aria-label={`${color1 === true ? 'color 1' : color2 === true ? 'color 2' : 'color 3'}`}
							/>
						{/each}
					</div>
				{/each}
			</div>
		</div>

		{#if $gameMode === 'daily'}
			<div role="presentation" class="controls-placeholder" />
		{:else}
			<FreeplayControls />
		{/if}
	</div>

	<Controls />

	<div
		role="region"
		aria-label="playing area"
		aria-live="off"
		class="region-container"
	>
		<div
			bind:this={gameBoard}
			data-table-rows={boardSize}
			data-table-cols={boardSize}
			class="board game-board"
			id="game-board"
			role="grid"
			aria-label="game board"
		>
			{#each Array.from(Array(boardSize).keys()) as row (row)}
				<div role="row" class="row" style:--numColumns={boardSize}>
					{#each Array.from(Array(boardSize).keys()) as column (column)}
						{@const label = game.current[row]?.[column]}
						{@const color1 = label === 0}
						{@const color2 = label === 1}
						{@const color3 = label === 2}
						{@const direction = getDirection(row, column)}
						{@const hint =
							$hintActive && row === hintRow && column === hintColumn}
						{#key moveToggle}
							<div class="tile">
								<button
									class:color1
									class:color2
									class:color3
									class:not-hint={$hintActive && !hint}
									class:reduced-motion={$reducedMotion}
									class:won={($hasWon && $gameMode === 'daily') ||
										($hasWonFreeplay && $gameMode === 'freeplay')}
									style:--animationDelay={`${(!direction ? flipDuration : 0) + 100 * (column + row * (boardSize - 1))}ms`}
									data-table-row={row}
									data-table-col={column}
									data-testid="row{row}-col{column}"
									in:spin={{
										duration: flipDuration,
										direction: direction,
										label: label,
									}}
									on:click={() => updateBoard(row, column)}
									on:touchstart|preventDefault={() => updateBoard(row, column)}
									on:keydown={(event) => navigateTable(event, gameBoard)}
									role="gridcell"
									aria-label={`${color1 === true ? 'color 1' : color2 === true ? 'color 2' : 'color 3'}`}
									disabled={($hasWon && $gameMode === 'daily') ||
										($hasWonFreeplay && $gameMode === 'freeplay') ||
										($hintActive && !hint)}
									aria-disabled={($hasWon && $gameMode === 'daily') ||
										($hasWonFreeplay && $gameMode === 'freeplay') ||
										($hintActive && !hint)}
								/>
							</div>
						{/key}
					{/each}
				</div>
			{/each}
		</div>
	</div>

	<ExtraControls />

	<div class="region-container" aria-live="polite">
		{#if ($hasWon && $gameMode === 'daily') || ($hasWonFreeplay && $gameMode === 'freeplay')}
			<GameOverBlock />
		{/if}
	</div>
{/if}

<style>
	/* Board and tile styling should be consistent throughout app */
	:global(.board) {
		--tile-size: 56px;
		align-self: center;
		justify-self: center;
		width: calc(5 * var(--tile-size));
		aspect-ratio: 1;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}

	:global(.board .row) {
		display: grid;
		grid-template-columns: repeat(var(--numColumns), 1fr);
	}

	:global(.tile) {
		aspect-ratio: 1;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		border: none;
		margin: 0;
	}

	:global(.tile button) {
		width: 100%;
		height: 100%;
		border: 5px solid var(--color-border);
	}

	:global(.tile button:hover, .tile button:focus) {
		border-color: var(--color-selected);
	}

	:global(.color1, .tile.color1, .tile button.color1) {
		background: var(--color-theme-1);
	}

	:global(.color2, .tile button.color2) {
		background: var(--color-theme-2);
	}

	:global(.color3, .tile button.color3) {
		background: var(--color-theme-3);
	}

	.reference-board {
		--tile-size: 30px;
		border: 5px solid var(--color-border);
		margin-bottom: 10px;
	}

	.tile button.won {
		cursor: default;
		animation: win-flip 1s var(--animationDelay);
	}

	.tile button.reduced-motion {
		animation: none;
	}

	.tile button.not-hint:disabled {
		filter: brightness(0.5);
	}

	.upper-region-container {
		align-self: center;
		display: flex;
		width: 280px;
		justify-content: space-between;
	}

	.region-container {
		align-self: center;
		display: flex;
	}

	.controls-placeholder {
		width: 36px;
	}

	@keyframes win-flip {
		0% {
			transform: rotateY(0deg);
		}
		100% {
			transform: rotateY(360deg);
		}
	}
</style>
