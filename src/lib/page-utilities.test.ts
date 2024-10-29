import { beforeEach, describe, it, expect } from 'vitest';
import {
	navigateTable,
	navigateToolbar,
	toastAndAlert,
} from '$lib/page-utilities';
import { toast } from '@zerodevx/svelte-toast';
import { shouldRefocus } from '$src/stores/stores';
import { get } from 'svelte/store';

const sampleHTML = `<div id="hidden-alert-container"></div>
<div id="toolbar" data-toolbar-size="2">
	<button id="toolbar0" data-toolbar-pos="0"></button>
	<button id="toolbar1" data-toolbar-pos="1"></button>
</div>
<div id="table" data-table-rows="2" data-table-cols="2">
	<div id="row0">
		<button id="table00" data-table-row="0" data-table-col="0"></button>
		<button id="table01" data-table-row="0" data-table-col="1"></button>
	</div>
	<div id="row1">
		<button id="table10" data-table-row="1" data-table-col="0"></button>
		<button id="table11" data-table-row="1" data-table-col="1"></button>
	</div>
</div>`;

document.body.insertAdjacentHTML('beforeend', sampleHTML);

vi.mock('esm-env', () => {
	return {
		BROWSER: true,
		DEV: false,
	};
});

describe('Toast and alert', () => {
	const alertBox = document.getElementById('hidden-alert-container');
	const toastSpy = vi.spyOn(toast, 'push');

	beforeEach(() => {
		if (alertBox) {
			alertBox.textContent = '';
		}
	});

	afterEach(() => {
		toastSpy.mockClear();
	});

	it('Info message', () => {
		toastAndAlert('Info');

		vi.waitFor(() => {
			expect(alertBox?.textContent).toBe('Info');
		});

		expect(toastSpy).toHaveBeenCalledOnce();
		expect(toastSpy).toHaveBeenCalledWith('Info', undefined);
	});

	it('Error message', () => {
		toastAndAlert('Error', {
			theme: { '--toastBackground': 'var(--error-color)' },
		});

		vi.waitFor(() => {
			expect(alertBox?.textContent).toBe('Error');
		});

		expect(toastSpy).toHaveBeenCalledOnce();
		expect(toastSpy).toHaveBeenCalledWith('Error', {
			theme: { '--toastBackground': 'var(--error-color)' },
		});
	});
});

describe('Navigate toolbar', () => {
	const toolbar = document.getElementById('toolbar') as HTMLElement;
	const toolbar0 = document.getElementById('toolbar0') as HTMLElement;
	const toolbar1 = document.getElementById('toolbar1') as HTMLElement;

	function handleToolbar(e: KeyboardEvent) {
		navigateToolbar(e, toolbar);
	}

	toolbar0.onkeydown = handleToolbar;
	toolbar1.onkeydown = handleToolbar;

	beforeEach(() => {
		(document.activeElement as HTMLElement).blur();
	});

	it('Move right', () => {
		toolbar0?.focus();

		expect(document.activeElement).toBe(toolbar0);

		toolbar0.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

		vi.waitFor(() => {
			expect(document.activeElement).toBe(toolbar1);
		});
	});

	it('Move left', () => {
		toolbar1?.focus();

		expect(document.activeElement).toBe(toolbar1);

		toolbar1.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));

		vi.waitFor(() => {
			expect(document.activeElement).toBe(toolbar0);
		});
	});

	it('Move right and wrap', () => {
		toolbar1?.focus();

		expect(document.activeElement).toBe(toolbar1);

		toolbar1.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

		vi.waitFor(() => {
			expect(document.activeElement).toBe(toolbar0);
		});
	});

	it('Move left and wrap', () => {
		toolbar0?.focus();

		expect(document.activeElement).toBe(toolbar0);

		toolbar0.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));

		vi.waitFor(() => {
			expect(document.activeElement).toBe(toolbar1);
		});
	});
});

describe('Navigate table', () => {
	const table = document.getElementById('table') as HTMLElement;
	const table00 = document.getElementById('table00') as HTMLElement;
	const table01 = document.getElementById('table01') as HTMLElement;
	const table10 = document.getElementById('table10') as HTMLElement;
	const table11 = document.getElementById('table11') as HTMLElement;

	function handleTable(e: KeyboardEvent) {
		navigateTable(e, table);
	}

	table00.onkeydown = handleTable;
	table01.onkeydown = handleTable;
	table10.onkeydown = handleTable;
	table11.onkeydown = handleTable;

	const callback = vi.fn();
	table00.onclick = callback;

	beforeEach(() => {
		(document.activeElement as HTMLElement).blur();
		shouldRefocus.set(false);
	});

	afterEach(() => {
		callback.mockClear();
	});

	it('Move right', () => {
		table00?.focus();

		expect(document.activeElement).toBe(table00);

		table00.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

		vi.waitFor(() => {
			expect(document.activeElement).toBe(table01);
		});
	});

	it('Move left', () => {
		table01?.focus();

		expect(document.activeElement).toBe(table01);

		table01.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));

		vi.waitFor(() => {
			expect(document.activeElement).toBe(table00);
		});
	});

	it('Move right and wrap', () => {
		table01?.focus();

		expect(document.activeElement).toBe(table01);

		table01.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

		vi.waitFor(() => {
			expect(document.activeElement).toBe(table00);
		});
	});

	it('Move left and wrap', () => {
		table00?.focus();

		expect(document.activeElement).toBe(table00);

		table00.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));

		vi.waitFor(() => {
			expect(document.activeElement).toBe(table01);
		});
	});

	it('Move down', () => {
		table00?.focus();

		expect(document.activeElement).toBe(table00);

		table00.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

		vi.waitFor(() => {
			expect(document.activeElement).toBe(table10);
		});
	});

	it('Move up', () => {
		table10?.focus();

		expect(document.activeElement).toBe(table10);

		table10.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));

		vi.waitFor(() => {
			expect(document.activeElement).toBe(table00);
		});
	});

	it('Move down and wrap', () => {
		table10?.focus();

		expect(document.activeElement).toBe(table10);

		table10.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

		vi.waitFor(() => {
			expect(document.activeElement).toBe(table00);
		});
	});

	it('Move up and wrap', () => {
		table00?.focus();

		expect(document.activeElement).toBe(table00);

		table00.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));

		vi.waitFor(() => {
			expect(document.activeElement).toBe(table10);
		});
	});

	it('Spacebar click', () => {
		table00?.focus();

		expect(document.activeElement).toBe(table00);

		table00.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

		expect(callback).toHaveBeenCalledOnce();
		expect(get(shouldRefocus)).toBe(true);
	});

	it('Enter click', () => {
		table00?.focus();

		expect(document.activeElement).toBe(table00);

		table00.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

		expect(callback).toHaveBeenCalledOnce();
		expect(get(shouldRefocus)).toBe(true);
	});
});
