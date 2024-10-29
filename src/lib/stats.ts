/**
 * @file Contains stats information for Flippin.
 * @author Brendan Sherman
 */

/** The details of a game of Flippin. */
export type GameDetails = {
	curTime: number;
	curBoard: string | null;
	lastGame: number;
};

/** Unpopulated game details. */
export const newGameDetails: GameDetails = {
	curTime: 0,
	curBoard: null,
	lastGame: 0,
};

/** The number of minute buckets game times should be distributed into. */
export const distributionLength = 11;

/** The stats for a user. */
export type Stats = {
	wonGames: number;
	fastestGame: number | null;
	distribution: number[];
};

/** Unpopulated user stats. */
export const newStats: Stats = {
	wonGames: 0,
	fastestGame: null,
	distribution: new Array(distributionLength).fill(0),
};
