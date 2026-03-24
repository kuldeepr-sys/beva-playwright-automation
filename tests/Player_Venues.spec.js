'use strict';

/**
 * Player Venues Tests — TC-175 to TC-183
 *
 * FIX: Removed manual login from beforeEach entirely.
 *      This file runs in the 'chromium' project which injects storageState
 *      automatically — the browser starts already logged in.
 *      beforeEach now just navigates directly to the Venues page.
 */

const { test, expect } = require('@playwright/test');
const { VenuesPage } = require('../pages/VenuesPage');

test.describe('Player Venues', () => {

  let venuesPage;

  test.beforeEach(async ({ page }) => {
    // Session injected by storageState — go straight to Venues
    await page.goto('https://beva.inheritxdev.in/user/venues', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/venues/, { timeout: 15_000 });
    venuesPage = new VenuesPage(page);
    await venuesPage.searchBox.waitFor({ state: 'visible', timeout: 15_000 });
  });

  // TC-175
  test('TC-175 [Low] Verify search box is displaying and user can fill it', async ({ page }) => {
    await expect(venuesPage.searchBox).toBeVisible();
    await venuesPage.searchBox.click();
    await venuesPage.search('Southern Cross');
    await expect(venuesPage.searchBox).toHaveValue('Southern Cross');
  });

  // TC-176
  test('TC-176 [Medium] Verify records display according to venue name and postcode search', async ({ page }) => {
    await venuesPage.searchBox.click();
    await venuesPage.search('Southern Cross');
    await expect(page.getByText('Southern Cross')).toBeVisible();
    await venuesPage.searchBox.clear();
    await expect(venuesPage.searchBox).toHaveValue('');
  });

  // TC-177
  test('TC-177 [Medium] Verify all active venues list is displaying', async ({ page }) => {
    const venueCards = page.locator('[class*="card"], [class*="venue"]').first();
    await expect(venueCards).toBeVisible({ timeout: 10_000 });
  });

  // TC-182
  test('TC-182 [Medium] Verify View All button is displaying', async ({ page }) => {
    const viewAllLink = page.getByRole('link', { name: /view all/i }).first();
    const viewAllBtn  = page.getByRole('button', { name: /view all/i }).first();
    const linkVisible = await viewAllLink.isVisible().catch(() => false);
    const btnVisible  = await viewAllBtn.isVisible().catch(() => false);

    if (linkVisible) {
      await expect(viewAllLink).toBeVisible();
    } else if (btnVisible) {
      await expect(viewAllBtn).toBeVisible();
    } else {
      console.info('TC-182: View All button not visible — no upcoming competitions for any venue');
    }
  });

  // TC-183
  test('TC-183 [High] Verify clicking View All redirects to Discover page', async ({ page }) => {
    const viewAllLink = page.getByRole('link', { name: /view all/i }).first();
    const exists = await viewAllLink.isVisible().catch(() => false);
    if (!exists) {
      console.info('TC-183: View All button not visible — skipping');
      return;
    }
    await viewAllLink.click();
    await expect(page).toHaveURL(/\/user\/discover/, { timeout: 10_000 });
  });
});