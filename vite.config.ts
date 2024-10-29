import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		globals: true,
		environment: 'jsdom',
		include: ['src/**/*.{test,spec}.{js,ts}'],
		setupFiles: ['./setupTest.js'],
		onConsoleLog(log: string, type: 'stdout' | 'stderr'): false | void {
			console.log('log in test: ', log);
			if (log === 'message from third party library' && type === 'stdout') {
				return false;
			}
		},
		alias: [
			// This seems like a bad approach but couldn't get the other workarounds for lifecycle event testing to work
			{ find: /^svelte$/, replacement: 'svelte/internal' },
		],
	},
});
