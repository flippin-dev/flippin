import { expect, it } from 'vitest';
import { updateTheme } from '$lib/themes';

beforeEach(() => {
	document.documentElement.style.setProperty('--color-theme-1', '#e92f3f');
	document.documentElement.style.setProperty('--color-theme-2', '#32cb2a');
	document.documentElement.style.setProperty('--color-theme-3', '#1e87db');
});

it('Default document theme is present', () => {
	expect(document.documentElement).toHaveStyle({
		'--color-theme-1': '#e92f3f',
		'--color-theme-2': '#32cb2a',
		'--color-theme-3': '#1e87db',
	});
});

it('Update theme values', async () => {
	vi.mock('esm-env', () => {
		return {
			BROWSER: true,
			DEV: false,
		};
	});

	updateTheme('Umi');

	expect(document.documentElement).toHaveStyle({
		'--color-theme-1': '#0077b6',
		'--color-theme-2': '#00b4d8',
		'--color-theme-3': '#90e0ef',
	});
});

it('Fallback theme values', async () => {
	vi.mock('esm-env', () => {
		return {
			BROWSER: true,
			DEV: false,
		};
	});

	updateTheme('Not a real theme');

	expect(document.documentElement).toHaveStyle({
		'--color-theme-1': '#e92f3f',
		'--color-theme-2': '#32cb2a',
		'--color-theme-3': '#1e87db',
	});
});
