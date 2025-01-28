<script lang="ts">
	import './styles.css';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import {
		colorTheme,
		currentScreen,
		darkMode,
		freeplayPuzzle,
		freeplayPuzzles,
		freeplayPuzzlesArray,
		freeplayPuzzlesIndex,
		gameMode,
		hasChangedFreeplayPuzzle,
		reducedMotion,
		shouldReset,
		storageConsent,
		themes,
	} from '$src/stores/stores';
	import { flippinTheme, updateTheme } from '$lib/themes';
	import { freeplayExample } from '$lib/puzzles';
	import { get } from 'svelte/store';
	import { browser } from '$app/environment';
	import Tutorial from '$com/Tutorial.svelte';
	import Settings from '$com/Settings.svelte';
	import Stats from '$com/Stats.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import StorageConsent from '$com/StorageConsent.svelte';
	import SurrenderConsent from '$com/SurrenderConsent.svelte';

	/** The dark mode theme color. */
	const darkThemeColor = '#121212';
	/** The light mode theme color. */
	const lightThemeColor = '#ffffff';
	/** The dark mode color scheme. */
	const darkColorScheme = 'dark';
	/** The light mode color scheme. */
	const lightColorScheme = 'light';

	/**
	 * Update the meta tags in head based on whether or not dark mode is set.
	 *
	 * @param {boolean} isDarkMode Whether or not dark mode is set.
	 *
	 * @example
	 * ```ts
	 * updateMetaColors(true);
	 * ```
	 */
	function updateMetaColors(isDarkMode: boolean) {
		if (browser) {
			const themeColor = document.querySelector('meta[name="theme-color"]');
			const colorScheme = document.querySelector('meta[name="color-scheme"]');

			if (themeColor) {
				if (isDarkMode) {
					themeColor.setAttribute('content', darkThemeColor);
				} else {
					themeColor.setAttribute('content', lightThemeColor);
				}
			}
			if (colorScheme) {
				if (isDarkMode) {
					colorScheme.setAttribute('content', darkColorScheme);
				} else {
					colorScheme.setAttribute('content', lightColorScheme);
				}
			}
		}
	}

	// Initial actions when the page loads
	if (browser) {
		// Check if reducedMotion has been set already
		const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion)');
		if (get(reducedMotion) === null) {
			reducedMotion.set(reducedMotionQuery.matches ? true : false);
		}

		// Update color values in meta tags
		updateMetaColors(get(darkMode));
	}

	// Automatically update if dark mode is changed
	$: updateMetaColors($darkMode);

	// Automatically update if the theme in use is removed
	$: if (!$themes.has($colorTheme)) {
		colorTheme.set(flippinTheme.name);
	}
	$: updateTheme($colorTheme);

	// Automatically update if the freeplay puzzle in use is removed
	$: if (
		$gameMode === 'freeplay' &&
		!$freeplayPuzzles.has($freeplayPuzzle.title)
	) {
		freeplayPuzzle.set(freeplayExample);
		freeplayPuzzlesIndex.set(
			get(freeplayPuzzlesArray).findIndex(
				(title) => title === freeplayExample.title,
			),
		);
		hasChangedFreeplayPuzzle.set(true);
		shouldReset.set(true);
	}

	/** Whether or not the layout has been applied already. */
	let isMounted = false;

	onMount(() => {
		isMounted = true;
	});
</script>

<svelte:head>
	{#if $darkMode}
		<style>
			:root,
			body {
				--color-bg-0: #121212;
				--color-bg-1: #1c1c1c;
				--color-bg-2: #202020;
				--color-border: #606060;
				--color-hover: #363636;
				--color-selected: #909090;
				--color-text: #e0e0e0;
				--color-text-outline: #000000;
				--color-list-placeholder: #d0d0d0;
				--color-list-border: #474747;
				--color-list-border-hover: #303030;
				--color-list-bg: #636363;
				--color-list-hover: #505050;
				--color-list-selected: #303030;
				--color-disabled-text: #909090;
				--color-disabled-bg: #252525;
				--link-color: #1d81d3;
				color: var(--color-text);
			}
		</style>
	{/if}
</svelte:head>

<div class="app">
	<div id="hidden-alert-container" role="alert" class="visually-hidden"></div>

	{#if !isMounted}
		<div class="loading">
			<p>Loading...</p>
			<p>
				This might take a minute if the server is unreachable or your connection
				is slow.
			</p>
		</div>
	{:else if $page.status >= 200 && $page.status < 300}
		<div aria-hidden="true">
			<SvelteToast options={{ intro: { y: 0 }, duration: 5000 }} />
		</div>
		<!-- Main page -->
		{#if $storageConsent == null}
			<StorageConsent />
		{:else}
			{#if $currentScreen === 'tutorial'}
				<Tutorial />
			{/if}

			{#if $currentScreen === 'settings'}
				<Settings />
			{/if}

			{#if $currentScreen === 'stats'}
				<Stats />
			{/if}

			{#if $currentScreen === 'surrender'}
				<SurrenderConsent />
			{/if}

			<main inert={$currentScreen !== null}>
				<slot />
			</main>
		{/if}
	{:else}
		<!-- Error pages -->
		<main>
			<slot />
		</main>
	{/if}
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
	}

	:root {
		--toastContainerLeft: auto;
		--toastWidth: 16rem;
	}

	@media (max-width: 600px) {
		:root {
			--toastContainerLeft: calc(50vw - calc(var(--toastWidth) / 2));
		}
	}
</style>
