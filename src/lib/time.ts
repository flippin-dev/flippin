/**
 * @file Contains time information for Flippin.
 * @author Brendan Sherman
 */

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

/** The format for the game timer. */
export const timerFormat = 'mm:ss';
/** The format for the daily countdown. */
export const countdownFormat = 'HH:mm:ss';
/** The time zone to base the countdown on. */
export const countdownTimeZone = 'America/New_York';
/** The time limit for daily games before counting stops. */
export const maxTime = 600;
/** The message to display once the max game time is reached. */
export const maxTimeMessage = 'A lot!';
/** The message to display once the daily countdown expires. */
export const countdownMessage = "Refresh to play today's game!";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(countdownTimeZone);

/** The day daily puzzles start from. */
const startDate = dayjs.tz('2024-10-28').startOf('d');

/**
 * Return the number of days from the starting date.
 *
 * @returns {number} The number of days from the starting date plus one.
 */
export function getDaysFromStart(): number {
	const now = dayjs.tz().startOf('d');
	const numDays = now.diff(startDate, 'd') + 1;

	return numDays;
}
