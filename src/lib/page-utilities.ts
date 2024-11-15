/**
 * @file Contains functions to augment navigation and accessibility.
 * @author Brendan Sherman
 */

import { browser } from '$app/environment';
import { toast } from '@zerodevx/svelte-toast';
import { mod } from '$lib/math';
import { shouldRefocus } from '$src/stores/stores';

/**
 * Pushes a toast notification as well as an alert message for accessibility.
 *
 * @param {string}          message      The text to display in the notification.
 * @param {any | undefined} toastOptions A SvelteToastOptions object.
 *
 * @example
 * ```ts
 * toastAndAlert('Results copied to clipboard');
 * ```
 */
/* eslint-disable  @typescript-eslint/no-explicit-any */
export function toastAndAlert(message: string, toastOptions?: any) {
	if (browser) {
		const alertBox = document.getElementById('hidden-alert-container');
		if (alertBox) {
			// clear the contents of the container
			alertBox.textContent = '';
			// inject the new alert message
			alertBox.textContent = message;
		}

		toast.push(message, toastOptions);
	}
}

/**
 * Allows users to horizontally navigate through a toolbar using the arrow keys.
 *
 * @param {KeyboardEvent} event   The triggering event on an element which has the `data-toolbar-pos` property set.
 * @param {HTMLElement}   toolbar The parent container which has the `data-toolbar-size` property set.
 */
export function navigateToolbar(event: KeyboardEvent, toolbar: HTMLElement) {
	if (browser) {
		if (event.key === 'Tab') {
			return;
		}

		if (
			event.target instanceof Element &&
			event.target === document.activeElement
		) {
			const target = event.target as HTMLElement;
			const currentPos = target.dataset.toolbarPos;

			if (currentPos === undefined) {
				return;
			}

			let nextPos = +currentPos;

			const size = toolbar.dataset.toolbarSize;

			if (size === undefined) {
				return;
			}

			switch (event.key) {
				case 'ArrowLeft':
					nextPos = mod(nextPos - 1, +size);
					break;
				case 'ArrowRight':
					nextPos = (nextPos + 1) % +size;
					break;
			}

			(
				toolbar.querySelector(`[data-toolbar-pos="${nextPos}"]`) as HTMLElement
			)?.focus();
		}
	}
}

/**
 * Allows users to horizontally and vertically navigate through a table using the arrow keys.
 *
 * @param {KeyboardEvent} event The triggering event on an element which has the `data-table-row` and `data-table-col` properties set.
 * @param {HTMLElement}   table The parent container which has the `data-table-rows` and `data-table-cols` property set.
 */
export function navigateTable(event: KeyboardEvent, table: HTMLElement) {
	if (browser) {
		if (
			event.key === 'ArrowLeft' ||
			event.key === 'ArrowRight' ||
			event.key === 'ArrowUp' ||
			event.key === 'ArrowDown' ||
			event.key === ' ' ||
			event.key === 'Enter'
		) {
			event.preventDefault();
		}
		if (event.key === 'Tab') {
			return;
		}

		if (
			event.target instanceof Element &&
			event.target === document.activeElement
		) {
			const target = event.target as HTMLElement;
			const currentRow = target.dataset.tableRow;
			const currentCol = target.dataset.tableCol;

			if (currentRow === undefined || currentCol === undefined) {
				return;
			}

			let nextRow = +currentRow;
			let nextCol = +currentCol;

			const rows = table.dataset.tableRows;
			const cols = table.dataset.tableCols;

			if (rows === undefined || cols === undefined) {
				return;
			}

			switch (event.key) {
				case 'ArrowLeft':
					nextCol = mod(nextCol - 1, +cols);
					break;
				case 'ArrowRight':
					nextCol = (nextCol + 1) % +cols;
					break;
				case 'ArrowUp':
					nextRow = mod(nextRow - 1, +rows);
					break;
				case 'ArrowDown':
					nextRow = (nextRow + 1) % +rows;
					break;
				case ' ':
				case 'Enter':
					target.click();
					shouldRefocus.set(true);
					return;
			}

			(
				table.querySelector(
					`[data-table-row="${nextRow}"][data-table-col="${nextCol}"]`,
				) as HTMLElement
			)?.focus();
		}
	}
}
