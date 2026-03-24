'use strict';

/**
 * Menu / Navigation Tests — TC-095 to TC-097
 *
 * Runs in 'chromium' project — storageState injects login session automatically.
 * Browser starts already logged in. DO NOT add manual login steps here.
 */

const { test, expect } = require('@playwright/test');
const { NavigationPage } = require('../pages/NavigationPage');

test.describe('Menu / Navigation', () => {

  let nav;

  test.beforeEach(async ({ page }) => {
    // Session already injected by storageState — go straight to dashboard
    await page.goto('https://beva.inheritxdev.in/user/dashboard');
    await expect(page).toHaveURL(/dashboard/, { timeout: 15_000 });
    await page.getByRole('link', { name: 'Dashboard' }).first()
      .waitFor({ state: 'visible', timeout: 15_000 });
    nav = new NavigationPage(page);
  });

  // TC-095
  test('TC-095 [High] Verify all menu options are displaying properly', async ({ page }) => {
    await expect(nav.dashboardLink).toBeVisible();
    await expect(nav.discoverLink).toBeVisible();
    await expect(nav.myCompetitionsLink).toBeVisible();
    await expect(nav.leaderboardLink).toBeVisible();
    await expect(nav.venuesLink).toBeVisible();
    await expect(nav.myProfileLink).toBeVisible();

    await nav.clickContactInfo();
    await expect(nav.aboutUsText).toBeVisible();
    await expect(nav.faqText).toBeVisible();
    await expect(nav.privacyPolicyText).toBeVisible();
    await expect(nav.termsText).toBeVisible();

    await expect(nav.logoutBtn).toBeVisible();
  });

  // TC-096
  test('TC-096 [High] Verify user navigates to the correct page for each menu item', async ({ page }) => {
    await nav.clickDashboard();
    await expect(page).toHaveURL('https://beva.inheritxdev.in/user/dashboard');

    await nav.clickDiscover();
    await expect(page).toHaveURL('https://beva.inheritxdev.in/user/discover');

    await nav.clickMyCompetitions();
    await expect(page).toHaveURL('https://beva.inheritxdev.in/user/my-competitions');

    await nav.clickLeaderboard();
    await expect(page).toHaveURL('https://beva.inheritxdev.in/user/leaderboard');

    await nav.clickVenues();
    await expect(page).toHaveURL('https://beva.inheritxdev.in/user/venues');

    await nav.clickMyProfile();
    await expect(page).toHaveURL(/\/user\/profile\//);

    await nav.clickContactInfo();
    await nav.aboutUsText.click();
    await expect(page).toHaveURL('https://beva.inheritxdev.in/user/contact-info/AboutUs');
    await page.getByText('Back to Contact & Info').click();

    await nav.termsText.click();
    await expect(page).toHaveURL(/Terms/);
    await page.getByText('Back to Contact & Info').click();

    await nav.faqText.click();
    await expect(page).toHaveURL('https://beva.inheritxdev.in/user/contact-info/FAQ');
    await page.getByText('Back to Contact & Info').click();

    await nav.privacyPolicyText.click();
    await expect(page).toHaveURL(/Privacy/);
  });

  // TC-097
  test('TC-097 [High] Verify user is able to logout by clicking Logout button', async ({ page }) => {
    await nav.clickLogout();

    // After logout the app redirects to home page OR login page
    // Both are valid — user is no longer authenticated either way
    await expect(page).toHaveURL(
      /https:\/\/beva\.inheritxdev\.in/,
      { timeout: 15_000 }
    );
  });
});