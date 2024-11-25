/**
 * @file Contains stats information for Flippin.
 * @author Brendan Sherman
 */

/** The details of a game of Flippin. */
export type GameDetails = {
	curTime: number;
	curBoard: string | null;
	lastGame: number;
	moveCount?: number;
	resetCount?: number;
	hintCount?: number;
	hasSurrendered?: boolean;
};

/** Unpopulated game details. */
export const newGameDetails: GameDetails = {
	curTime: 0,
	curBoard: null,
	lastGame: 0,
	moveCount: 0,
	resetCount: 0,
	hintCount: 0,
	hasSurrendered: false,
};

/** The number of minute buckets game times should be distributed into. */
export const distributionLength = 11;

/** The stats for a user. */
export type Stats = {
	wonGames: number;
	fastestGame: number | null;
	fewestMoves?: number | null;
	distribution: number[];
};

/** Unpopulated user stats. */
export const newStats: Stats = {
	wonGames: 0,
	fastestGame: null,
	fewestMoves: null,
	distribution: new Array(distributionLength).fill(0),
};
