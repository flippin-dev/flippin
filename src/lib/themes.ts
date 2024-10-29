/**
 * @file Contains theme information for Flippin.
 * @author Brendan Sherman
 */

import { BROWSER } from 'esm-env';
import { themes } from '$src/stores/stores';
import { get } from 'svelte/store';

/** A regular expresion for color codes that look like a # followed by 6 hexadecimal values. */
export const colorRegEx = /^#[0-9A-F]{6}$/i;

/** A group of 3 hex color codes representing a color theme. */
export type Theme = {
	theme1: string;
	theme2: string;
	theme3: string;
};

/** A name and 3 hex color codes representing a serialized color theme. */
export type SerializedTheme = {
	name: string;
	theme1: string;
	theme2: string;
	theme3: string;
};

/** The original Flippin theme. */
export const flippinTheme: SerializedTheme = {
	name: 'Flippin',
	theme1: '#e92f3f',
	theme2: '#32cb2a',
	theme3: '#1e87db',
};

/** The list of default color themes. */
export const colorThemes: SerializedTheme[] = [
	flippinTheme,
	{
		name: 'Unicorn',
		theme1: '#cdb4db',
		theme2: '#ffafcc',
		theme3: '#a2d2ff',
	},
	{
		name: 'Gelato',
		theme1: '#ccd5ae',
		theme2: '#faedcd',
		theme3: '#d4a373',
	},
	{
		name: 'Retro',
		theme1: '#a3b18a',
		theme2: '#588157',
		theme3: '#3a5a40',
	},
	{
		name: 'Umi',
		theme1: '#0077b6',
		theme2: '#00b4d8',
		theme3: '#90e0ef',
	},
	{
		name: 'Noir',
		theme1: '#adb5bd',
		theme2: '#6c757d',
		theme3: '#495057',
	},
	{
		name: 'Vapor',
		theme1: '#f72585',
		theme2: '#7209b7',
		theme3: '#3a0ca3',
	},
	{
		name: 'Peach',
		theme1: '#f08080',
		theme2: '#f8ad9d',
		theme3: '#ffdab9',
	},
	{
		name: 'Robin',
		theme1: '#d27f11',
		theme2: '#6d665d',
		theme3: '#bbb3b2',
	},
	{
		name: 'Ceramic',
		theme1: '#bb4430',
		theme2: '#7ebdc2',
		theme3: '#f3dfa2',
	},
	{
		name: 'Lullaby',
		theme1: '#dec0f1',
		theme2: '#b79ced',
		theme3: '#957fef',
	},
	{
		name: 'Mesa',
		theme1: '#ffcb69',
		theme2: '#d08c60',
		theme3: '#997b66',
	},
];

/** The default color themes represented as a map of names to theme colors. */
export const defaultThemesMap: Map<string, Theme> = (() => {
	const themes = new Map<string, Theme>();
	colorThemes.forEach(
		({ name: name, theme1: theme1, theme2: theme2, theme3: theme3 }) => {
			if (!themes.has(name)) {
				const theme = { theme1, theme2, theme3 } as Theme;
				themes.set(name, theme);
			}
		},
	);
	return themes;
})();

/**
 * Updates the current theme to the one passed in the argument.
 *
 * @param {string} theme The name of the theme to update to.
 *
 * @example
 * ```ts
 * updateTheme('Flippin');
 * ```
 */
export function updateTheme(theme: string) {
	if (BROWSER) {
		const root = document.documentElement;
		const newTheme = get(themes).get(theme);

		root.style.setProperty(
			'--color-theme-1',
			newTheme ? newTheme.theme1 : flippinTheme.theme1,
		);
		root.style.setProperty(
			'--color-theme-2',
			newTheme ? newTheme.theme2 : flippinTheme.theme2,
		);
		root.style.setProperty(
			'--color-theme-3',
			newTheme ? newTheme.theme3 : flippinTheme.theme3,
		);
	}
}
