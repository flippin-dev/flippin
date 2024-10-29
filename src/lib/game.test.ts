import { describe, expect, it } from 'vitest';
import { Game } from '$lib/game';
import { freeplayExample, puzzles } from '$lib/puzzles';
import { gameNumber } from '$src/stores/stores';

describe('Game constructors', () => {
	describe('Create game with current state and puzzle', () => {
		const game = new Game('2111120111112101211101210', freeplayExample);

		it('Game title is correct', () => {
			expect(game.title).toBe(freeplayExample.title);
		});

		it('Game current board is correct', () => {
			expect(game.current).toEqual([
				[2, 1, 1, 1, 1],
				[2, 0, 1, 1, 1],
				[1, 1, 2, 1, 0],
				[1, 2, 1, 1, 1],
				[0, 1, 2, 1, 0],
			]);
		});

		it('Game end board is correct', () => {
			expect(game.end).toEqual([
				[0, 2, 0, 2, 0],
				[0, 2, 0, 2, 0],
				[0, 0, 0, 0, 0],
				[1, 0, 0, 0, 1],
				[0, 1, 1, 1, 0],
			]);
		});
	});

	describe('Create game with bad current state', () => {
		// Set gameNumber to -1 so the default puzzle is used
		gameNumber.set(-1);

		const game = new Game('12345');
		it('Game title is correct', () => {
			expect(game.title).toBe(freeplayExample.title);
		});

		it('Game current board is correct', () => {
			expect(game.current).toEqual([
				[1, 0, 1, 1, 1],
				[1, 0, 1, 1, 1],
				[1, 1, 2, 1, 0],
				[1, 2, 1, 1, 1],
				[0, 1, 2, 1, 0],
			]);
		});

		it('Game end board is correct', () => {
			expect(game.end).toEqual([
				[0, 2, 0, 2, 0],
				[0, 2, 0, 2, 0],
				[0, 0, 0, 0, 0],
				[1, 0, 0, 0, 1],
				[0, 1, 1, 1, 0],
			]);
		});
	});

	describe('Create game with no current state and no puzzle with a daily puzzle available', () => {
		// Set gameNumber to 1 so that the first daily puzzle is used
		gameNumber.set(1);
		const game = new Game();
		describe('Game properties are set correctly', () => {
			it('Game title is correct', () => {
				expect(game.title).toBe(puzzles[0].title);
			});

			it('Game current board is correct', () => {
				expect(game.current).toEqual([
					[0, 1, 2, 2, 0],
					[0, 1, 2, 2, 0],
					[2, 0, 0, 1, 0],
					[0, 0, 1, 2, 2],
					[2, 1, 1, 1, 1],
				]);
			});

			it('Game end board is correct', () => {
				expect(game.end).toEqual([
					[2, 0, 0, 2, 2],
					[2, 0, 0, 0, 2],
					[0, 0, 0, 0, 0],
					[2, 2, 1, 2, 2],
					[1, 1, 1, 1, 1],
				]);
			});
		});
	});

	describe('Create game with no current state and no puzzle with no daily puzzle available', () => {
		// Set gameNumber to -1 so the default puzzle is used
		gameNumber.set(-1);

		const game = new Game();
		describe('Game properties are set correctly', () => {
			it('Game title is correct', () => {
				expect(game.title).toBe(freeplayExample.title);
			});

			it('Game current board is correct', () => {
				expect(game.current).toEqual([
					[1, 0, 1, 1, 1],
					[1, 0, 1, 1, 1],
					[1, 1, 2, 1, 0],
					[1, 2, 1, 1, 1],
					[0, 1, 2, 1, 0],
				]);
			});

			it('Game end board is correct', () => {
				expect(game.end).toEqual([
					[0, 2, 0, 2, 0],
					[0, 2, 0, 2, 0],
					[0, 0, 0, 0, 0],
					[1, 0, 0, 0, 1],
					[0, 1, 1, 1, 0],
				]);
			});
		});
	});
});

describe('Update outside lower board range', () => {
	const game = new Game();
	const lessThanRangeUpdateResult = game.update(-1, -1);

	it('Update is invalid', () => {
		expect(lessThanRangeUpdateResult).toBe(false);
	});

	it('Game current board is correct', () => {
		expect(game.current).toEqual([
			[1, 0, 1, 1, 1],
			[1, 0, 1, 1, 1],
			[1, 1, 2, 1, 0],
			[1, 2, 1, 1, 1],
			[0, 1, 2, 1, 0],
		]);
	});
});

describe('Update outside upper board range', () => {
	// Set gameNumber to -1 so the default puzzle is used
	gameNumber.set(-1);

	const game = new Game();
	const greaterThanRangeUpdateResult = game.update(5, 5);

	it('Update is invalid', () => {
		expect(greaterThanRangeUpdateResult).toBe(false);
	});

	it('Game current board is correct', () => {
		expect(game.current).toEqual([
			[1, 0, 1, 1, 1],
			[1, 0, 1, 1, 1],
			[1, 1, 2, 1, 0],
			[1, 2, 1, 1, 1],
			[0, 1, 2, 1, 0],
		]);
	});
});

describe('Update upper left tile', () => {
	// Set gameNumber to -1 so the default puzzle is used
	gameNumber.set(-1);

	const game = new Game();
	const upperLeftUpdateResult = game.update(0, 0);

	it('Update is valid', () => {
		expect(upperLeftUpdateResult).toBe(true);
	});

	it('Game current board is correct', () => {
		expect(game.current).toEqual([
			[2, 1, 1, 1, 1],
			[2, 0, 1, 1, 1],
			[1, 1, 2, 1, 0],
			[1, 2, 1, 1, 1],
			[0, 1, 2, 1, 0],
		]);
	});
});

describe('Update middle tile', () => {
	// Set gameNumber to -1 so the default puzzle is used
	gameNumber.set(-1);

	const game = new Game();
	const middleUpdateResult = game.update(2, 2);

	it('Game title is correct', () => {
		expect(middleUpdateResult).toBe(true);
	});

	it('Game current board is correct', () => {
		expect(game.current).toEqual([
			[1, 0, 1, 1, 1],
			[1, 0, 2, 1, 1],
			[1, 2, 0, 2, 0],
			[1, 2, 2, 1, 1],
			[0, 1, 2, 1, 0],
		]);
	});
});

describe('Update lower right tile', () => {
	// Set gameNumber to -1 so the default puzzle is used
	gameNumber.set(-1);

	const game = new Game();
	const lowerRightUpdateResult = game.update(4, 4);

	it('Game title is correct', () => {
		expect(lowerRightUpdateResult).toBe(true);
	});

	it('Game current board is correct', () => {
		expect(game.current).toEqual([
			[1, 0, 1, 1, 1],
			[1, 0, 1, 1, 1],
			[1, 1, 2, 1, 0],
			[1, 2, 1, 1, 2],
			[0, 1, 2, 2, 1],
		]);
	});
});

it('Game current board is serialized correctly', () => {
	// Set gameNumber to -1 so the default puzzle is used
	gameNumber.set(-1);

	const game = new Game();
	const serializedBoard = game.serializeCurrent();

	expect(serializedBoard).toBe('1011110111112101211101210');
});
