/**
 * @file Contains math functions for Flippin.
 * @author Brendan Sherman
 */

/** The matrix representing the ruleset of Flippin. */
const mA = [
	[1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1],
];

/** A matrix used in finding puzzle solutions. */
const mSolution = [
	[2, 2, 1, 2, 2, 0, 1, 1, 1, 2, 0, 2, 2, 0, 1, 1, 1, 1, 2, 0, 1, 1, 0, 0, 0],
	[2, 0, 0, 1, 2, 1, 2, 2, 0, 0, 1, 1, 2, 0, 1, 0, 0, 1, 0, 2, 2, 1, 0, 0, 0],
	[1, 0, 2, 1, 2, 2, 0, 1, 1, 0, 0, 0, 2, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0],
	[2, 1, 1, 1, 0, 0, 2, 0, 2, 2, 2, 0, 1, 1, 2, 1, 1, 1, 0, 1, 2, 0, 0, 0, 0],
	[2, 2, 2, 0, 1, 2, 0, 2, 0, 0, 2, 0, 2, 1, 2, 2, 2, 1, 1, 0, 0, 1, 0, 0, 0],
	[0, 1, 2, 0, 2, 2, 0, 0, 2, 1, 2, 0, 2, 0, 1, 2, 2, 1, 1, 1, 0, 1, 0, 0, 0],
	[1, 2, 0, 2, 0, 0, 0, 2, 1, 1, 2, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0],
	[1, 2, 1, 0, 2, 0, 2, 0, 0, 1, 0, 2, 1, 2, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0],
	[1, 0, 1, 2, 0, 2, 1, 0, 0, 1, 2, 0, 1, 1, 2, 2, 2, 1, 2, 2, 0, 1, 0, 0, 0],
	[2, 0, 0, 2, 0, 1, 1, 1, 1, 1, 2, 0, 0, 1, 2, 0, 0, 1, 2, 2, 1, 2, 0, 0, 0],
	[0, 1, 0, 2, 2, 2, 2, 0, 2, 2, 2, 1, 2, 0, 0, 2, 2, 0, 2, 1, 0, 1, 0, 0, 0],
	[2, 1, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 1, 1, 0, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
	[2, 2, 2, 1, 2, 2, 0, 1, 1, 0, 2, 1, 2, 0, 0, 1, 1, 0, 0, 0, 2, 0, 0, 0, 0],
	[0, 0, 0, 1, 1, 0, 0, 2, 1, 1, 0, 1, 0, 1, 0, 2, 2, 2, 2, 1, 2, 2, 0, 0, 0],
	[1, 1, 0, 2, 2, 1, 1, 0, 2, 2, 0, 0, 0, 0, 0, 2, 2, 0, 1, 2, 2, 2, 0, 0, 0],
	[1, 0, 1, 1, 2, 2, 1, 1, 2, 0, 2, 2, 1, 2, 2, 0, 0, 0, 2, 2, 2, 1, 0, 0, 0],
	[1, 0, 1, 1, 2, 2, 1, 1, 2, 0, 2, 2, 1, 2, 2, 0, 0, 0, 2, 2, 1, 2, 0, 0, 0],
	[1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 2, 0, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
	[2, 0, 0, 0, 1, 1, 1, 0, 2, 2, 2, 1, 0, 2, 1, 2, 2, 0, 1, 1, 0, 1, 0, 0, 0],
	[0, 2, 0, 1, 0, 1, 1, 0, 2, 2, 1, 2, 0, 1, 2, 2, 2, 0, 1, 1, 1, 0, 0, 0, 0],
	[1, 2, 1, 2, 0, 0, 2, 1, 0, 1, 0, 1, 2, 2, 2, 2, 1, 0, 0, 1, 0, 2, 0, 0, 0],
	[1, 1, 1, 0, 1, 1, 0, 1, 1, 2, 1, 0, 0, 2, 2, 1, 2, 0, 1, 0, 2, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

/** Vectors that permute a solution into another solution. */
const solutionVectors = [
	[0, 1, 0, 2, 0, 2, 2, 0, 1, 1, 2, 1, 0, 2, 1, 1, 1, 0, 2, 2, 2, 0, 0, 0, 1],
	[0, 2, 0, 1, 0, 1, 1, 0, 2, 2, 1, 2, 0, 1, 2, 2, 2, 0, 1, 1, 1, 0, 0, 0, 2],
	[1, 0, 0, 0, 2, 2, 2, 0, 1, 1, 1, 2, 0, 1, 2, 1, 1, 0, 2, 2, 0, 2, 0, 1, 0],
	[1, 1, 0, 2, 2, 1, 1, 0, 2, 2, 0, 0, 0, 0, 0, 2, 2, 0, 1, 1, 2, 2, 0, 1, 1],
	[1, 2, 0, 1, 2, 0, 0, 0, 0, 0, 2, 1, 0, 2, 1, 0, 0, 0, 0, 0, 1, 2, 0, 1, 2],
	[2, 0, 0, 0, 1, 1, 1, 0, 2, 2, 2, 1, 0, 2, 1, 2, 2, 0, 1, 1, 0, 1, 0, 2, 0],
	[2, 1, 0, 2, 1, 0, 0, 0, 0, 0, 1, 2, 0, 1, 2, 0, 0, 0, 0, 0, 2, 1, 0, 2, 1],
	[2, 2, 0, 1, 1, 2, 2, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 2, 2, 1, 1, 0, 2, 2],
	[1, 1, 2, 2, 1, 1, 2, 1, 1, 0, 2, 1, 0, 2, 1, 2, 1, 2, 2, 0, 1, 0, 1, 0, 0],
	[1, 2, 2, 1, 1, 0, 1, 1, 2, 1, 1, 2, 0, 1, 2, 0, 2, 2, 1, 2, 0, 0, 1, 0, 1],
	[1, 0, 2, 0, 1, 2, 0, 1, 0, 2, 0, 0, 0, 0, 0, 1, 0, 2, 0, 1, 2, 0, 1, 0, 2],
	[2, 1, 2, 2, 0, 0, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0, 2, 2, 1, 2, 1, 2, 1, 1, 0],
	[2, 2, 2, 1, 0, 2, 0, 1, 0, 2, 2, 1, 0, 2, 1, 1, 0, 2, 0, 1, 0, 2, 1, 1, 1],
	[2, 0, 2, 0, 0, 1, 2, 1, 1, 0, 1, 2, 0, 1, 2, 2, 1, 2, 2, 0, 2, 2, 1, 1, 2],
	[0, 1, 2, 2, 2, 2, 0, 1, 0, 2, 1, 2, 0, 1, 2, 1, 0, 2, 0, 1, 1, 1, 1, 2, 0],
	[0, 2, 2, 1, 2, 1, 2, 1, 1, 0, 0, 0, 0, 0, 0, 2, 1, 2, 2, 0, 0, 1, 1, 2, 1],
	[0, 0, 2, 0, 2, 0, 1, 1, 2, 1, 2, 1, 0, 2, 1, 0, 2, 2, 1, 2, 2, 1, 1, 2, 2],
	[2, 2, 1, 1, 2, 2, 1, 2, 2, 0, 1, 2, 0, 1, 2, 1, 2, 1, 1, 0, 2, 0, 2, 0, 0],
	[2, 0, 1, 0, 2, 1, 0, 2, 0, 1, 0, 0, 0, 0, 0, 2, 0, 1, 0, 2, 1, 0, 2, 0, 1],
	[2, 1, 1, 2, 2, 0, 2, 2, 1, 2, 2, 1, 0, 2, 1, 0, 1, 1, 2, 1, 0, 0, 2, 0, 2],
	[0, 2, 1, 1, 1, 1, 0, 2, 0, 1, 2, 1, 0, 2, 1, 2, 0, 1, 0, 2, 2, 2, 2, 1, 0],
	[0, 0, 1, 0, 1, 0, 2, 2, 1, 2, 1, 2, 0, 1, 2, 0, 1, 1, 2, 1, 1, 2, 2, 1, 1],
	[0, 1, 1, 2, 1, 2, 1, 2, 2, 0, 0, 0, 0, 0, 0, 1, 2, 1, 1, 0, 0, 2, 2, 1, 2],
	[1, 2, 1, 1, 0, 0, 2, 2, 1, 2, 0, 0, 0, 0, 0, 0, 1, 1, 2, 1, 2, 1, 2, 2, 0],
	[1, 0, 1, 0, 0, 2, 1, 2, 2, 0, 2, 1, 0, 2, 1, 1, 2, 1, 1, 0, 1, 1, 2, 2, 1],
	[1, 1, 1, 2, 0, 1, 0, 2, 0, 1, 1, 2, 0, 1, 2, 2, 0, 1, 0, 2, 0, 1, 2, 2, 2],
];

/**
 * Performs the signless modulo operation on a number.
 *
 * @param {number} x The number to mod.
 * @param {number} n The modulus.
 *
 * @example
 * ```ts
 * // returns 2
 * mod(5, 3);
 * ```
 *
 * @throws {RangeError} The modulus must be greater than zero.
 *
 * @returns {number} The result of x mod n.
 */
export function mod(x: number, n: number): number {
	// Throw error if modulus is out of range
	if (n < 1) {
		throw new RangeError('The modulus should be greater than 0.');
	}

	return ((x % n) + n) % n;
}

/**
 * Performs the signless modulo operation on a vector.
 *
 * @param {number} v The vector to mod.
 * @param {number} n The modulus.
 *
 * @example
 * ```ts
 * // returns [2, 1]
 * mod([5, -2], 3);
 * ```
 *
 * @throws {RangeError} The modulus must be greater than zero.
 *
 * @returns {number[]} The result of each value in v mod n.
 */
export function modV(v: number[], n: number): number[] {
	// Throw error if modulus is out of range
	if (n < 1) {
		throw new RangeError('The modulus should be greater than 0.');
	}

	return v.map((x) => ((x % n) + n) % n);
}

/**
 * Adds two vectors.
 *
 * @param {number[]} v1 The first vector.
 * @param {number[]} v2 The second vector.
 *
 * @example
 * ```ts
 * // returns [4,5,6]
 * vvSubtract([3,3,3],[1,2,3]);
 * ```
 *
 * @throws {RangeError} The vector lengths must be the same.
 *
 * @returns {number[]} The resulting vector.
 */
function vVAdd(v1: number[], v2: number[]): number[] {
	// Throw error if vector dimesions are different
	if (v1.length !== v2.length) {
		throw new RangeError('The vector lengths must be the same.');
	}

	return v1.map((x, i) => x + v2[i]);
}

/**
 * Subtracts two vectors.
 *
 * @param {number[]} v1 The first vector.
 * @param {number[]} v2 The second vector.
 *
 * @example
 * ```ts
 * // returns [2,1,0]
 * vvSubtract([3,3,3],[1,2,3]);
 * ```
 *
 * @throws {RangeError} The vector lengths must be the same.
 *
 * @returns {number[]} The resulting vector.
 */
function vVSubtract(v1: number[], v2: number[]): number[] {
	// Throw error if vector dimesions are different
	if (v1.length !== v2.length) {
		throw new RangeError('The vector lengths must be the same.');
	}

	return v1.map((x, i) => x - v2[i]);
}

/**
 * Left multiplies a matrix by a vector.
 *
 * @param {number[]}   v The vector.
 * @param {number[][]} m The matrix.
 *
 * @example
 * ```ts
 * // returns [3,3,3]
 * vMLeftMultiply([3,3,3],[[1,0,0],[0,1,0],[0,0,1]]);
 * ```
 *
 * @throws {RangeError} The vector and matrix row dimensions must be the same.
 *
 * @returns {number[]} The resulting vector.
 */
function vMLeftMultiply(v: number[], m: number[][]): number[] {
	// Throw error if vector and matrix row dimesions are different
	if (v.length !== m.length) {
		throw new RangeError(
			'The vector and matrix row dimensions must be the same.',
		);
	}

	const result: number[] = new Array(v.length).fill(0);

	for (let c = 0; c < v.length; c++) {
		for (let r = 0; r < v.length; r++) {
			result[c] += v[r] * m[r][c];
		}
	}

	return result;
}

/**
 * Check if two vectors are equivalent mod n.
 *
 * @param {number[]} v1 The first vector.
 * @param {number[]} v2 The second vector.
 * @param {number}   n  The modulus.
 *
 * @example
 * ```ts
 * // returns true
 * compareVectorsModN([1,1,1],[4,4,4],3);
 * ```
 *
 * @throws {RangeError} The vector lengths must be the same.
 * @throws {RangeError} The modulus must be greater than zero.
 *
 * @returns {boolean} True if the vectors are equivalent, false otherwise.
 */
function compareVectorsModN(v1: number[], v2: number[], n: number): boolean {
	// Throw error if vector dimesions are different
	if (v1.length !== v2.length) {
		throw new RangeError('The vector lengths must be the same.');
	}

	// Throw error if modulus is out of range
	if (n < 1) {
		throw new RangeError('The modulus should be greater than 0.');
	}

	return v1.every((x, i) => mod(x, n) === mod(v2[i], n));
}

/**
 * Checks if a puzzle end state is reachable from a starting state.
 *
 * @param {string} start The start state.
 * @param {string} end   The end state.
 *
 * @example
 * ```ts
 * // returns true
 * isPuzzleSolvable('1011110111112101211101210','0202002020000001000101110');
 * ```
 *
 * @returns {boolean} True if solvable, false otherwise.
 */
export function isPuzzleSolvable(start: string, end: string): boolean {
	try {
		const startVector = start.split('').map((e) => +e);
		const endVector = end.split('').map((e) => +e);
		const b = vVSubtract(endVector, startVector);
		const x = vMLeftMultiply(b, mSolution);
		return compareVectorsModN(vMLeftMultiply(x, mA), b, 3);
	} catch (e) {
		console.error(e);
		return false;
	}
}

/**
 * Finds the minimal solution for a puzzle if a solution exists.
 *
 * @param {string} start The start state.
 * @param {string} end   The end state.
 *
 * @example
 * ```ts
 * // returns [2, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0]
 * findMinimalSolution('1011110111112101211101210','0202002020000001000101110');
 * ```
 *
 * @returns {number[]} A vector containing the solution or an empty vector.
 */
export function findMinimalSolution(start: string, end: string): number[] {
	const startVector = start.split('').map((e) => +e);
	const endVector = end.split('').map((e) => +e);
	const b = vVSubtract(endVector, startVector);
	const x = vMLeftMultiply(b, mSolution);

	// Check if there even is a solution
	if (compareVectorsModN(vMLeftMultiply(x, mA), b, 3)) {
		const base = modV(x, 3);
		let solution = base;
		let minimum = base.reduce((sum, current) => sum + current, 0);
		for (const v of solutionVectors) {
			const altSolution = modV(vVAdd(base, v), 3);
			const altSolutionSum = altSolution.reduce(
				(sum, current) => sum + current,
				0,
			);

			if (altSolutionSum < minimum) {
				minimum = altSolutionSum;
				solution = altSolution;
			}
		}

		return solution;
	} else {
		console.warn(
			'Cannot find minimal solution for a puzzle without any solutions!',
		);
		return [];
	}
}
