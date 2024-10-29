import { reducedMotion, storageConsent } from '$src/stores/stores';
import { test, expect } from '@playwright/test';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import { countdownTimeZone } from '$src/lib/time';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(countdownTimeZone);

test.beforeEach(() => {
	reducedMotion.set(true);
});

test('Error page', async ({ page }) => {
	await page.goto('/flippin/lost');

	await page.getByRole('link', { name: 'return to homepage' }).click();

	await expect(page).toHaveURL('/flippin/');
});

test('Consent screen', async ({ page }) => {
	storageConsent.set(null);
	await page.goto('/');

	await page.getByRole('checkbox').check();
	await page.getByRole('button', { name: 'Decline' }).click();

	await expect(
		page.getByRole('heading', { name: 'How to Play' }),
	).toBeVisible();
});

test('Navigate to tutorial screen', async ({ page }) => {
	storageConsent.set(false);
	await page.goto('/');

	await page.getByRole('checkbox').check();
	await page.getByRole('button', { name: 'Decline' }).click();

	await expect(
		page.getByRole('heading', { name: 'How to Play' }),
	).toBeVisible();
	await page.getByRole('button', { name: 'close dialog' }).click();

	await page.getByRole('button', { name: 'How to play' }).click();

	await expect(
		page.getByRole('heading', { name: 'How to Play' }),
	).toBeVisible();
});

test('Navigate to settings screen', async ({ page }) => {
	storageConsent.set(false);
	await page.goto('/');

	await page.getByRole('checkbox').check();
	await page.getByRole('button', { name: 'Decline' }).click();

	await expect(
		page.getByRole('heading', { name: 'How to Play' }),
	).toBeVisible();
	await page.getByRole('button', { name: 'close dialog' }).click();

	await page.getByRole('button', { name: 'Settings' }).click();

	await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
});

test('Navigate to stats screen', async ({ page }) => {
	storageConsent.set(false);
	await page.goto('/');

	await page.getByRole('checkbox').check();
	await page.getByRole('button', { name: 'Decline' }).click();

	await expect(
		page.getByRole('heading', { name: 'How to Play' }),
	).toBeVisible();
	await page.getByRole('button', { name: 'close dialog' }).click();

	await page.getByRole('button', { name: 'Stats' }).click();

	await expect(page.getByRole('heading', { name: 'Stats' })).toBeVisible();
});

test('Board reset', async ({ page }) => {
	storageConsent.set(false);
	await page.clock.setFixedTime(
		new Date(dayjs.tz('2024-10-28 00:00:00').valueOf()),
	);
	await page.goto('/');

	await page.getByRole('checkbox').check();
	await page.getByRole('button', { name: 'Decline' }).click();

	await expect(
		page.getByRole('heading', { name: 'How to Play' }),
	).toBeVisible();
	await page.getByRole('button', { name: 'close dialog' }).click();

	const upperLeftTile = page.getByTestId('row0-col0');
	const rightTile = page.getByTestId('row0-col1');
	const bottomTile = page.getByTestId('row1-col0');

	await expect(upperLeftTile).toHaveClass(/color1/);
	await expect(rightTile).toHaveClass(/color2/);
	await expect(bottomTile).toHaveClass(/color1/);

	await upperLeftTile.click();

	await expect(upperLeftTile).toHaveClass(/color2/);
	await expect(rightTile).toHaveClass(/color3/);
	await expect(bottomTile).toHaveClass(/color2/);

	await page.getByRole('button', { name: 'Reset the board' }).click();

	await expect(upperLeftTile).toHaveClass(/color1/);
	await expect(rightTile).toHaveClass(/color2/);
	await expect(bottomTile).toHaveClass(/color1/);
});

test('Game win', async ({ page, context }) => {
	storageConsent.set(false);
	await context.grantPermissions(['clipboard-read', 'clipboard-write']);
	await page.clock.setFixedTime(
		new Date(dayjs.tz('2024-10-28 00:00:00').valueOf()),
	);
	await page.goto('/');

	await page.getByRole('checkbox').check();
	await page.getByRole('button', { name: 'Decline' }).click();

	await expect(
		page.getByRole('heading', { name: 'How to Play' }),
	).toBeVisible();
	await page.getByRole('button', { name: 'close dialog' }).click();

	await page.getByTestId('row0-col2').dblclick();
	await page.getByTestId('row0-col3').dblclick();
	await page.getByTestId('row1-col0').dblclick();
	await page.getByTestId('row1-col3').dblclick();
	await page.getByTestId('row3-col0').dblclick();

	await page
		.getByRole('button', { name: 'copy game results to clipboard' })
		.click();

	const shareText = await page.evaluate('navigator.clipboard.readText()');
	expect(shareText).toContain('I beat Flippin');
});
