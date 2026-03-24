'use strict';

/**
 * Player Discover Tests — TC-107 to TC-133
 *
 * Runs in 'chromium' project — storageState injects login session automatically.
 * Browser starts already logged in. DO NOT add manual login steps here.
 */

const { test, expect } = require('@playwright/test');
const { DiscoverPage } = require('../pages/DiscoverPage');

test.describe('Player Discover', () => {

  let discoverPage;

  test.beforeEach(async ({ page }) => {
    // Session already injected by storageState — navigate directly to Discover page
    await page.goto('https://beva.inheritxdev.in/user/discover');
    await expect(page).toHaveURL(/discover/, { timeout: 15_000 });
    discoverPage = new DiscoverPage(page);
    // Wait for search box to confirm Discover page has fully rendered
    await discoverPage.searchBox.waitFor({ state: 'visible', timeout: 15_000 });
  });

  // TC-107
  test('TC-107 [Medium] Verify search box is displaying and user can fill it', async ({ page }) => {
    await expect(discoverPage.searchBox).toBeVisible();
    await discoverPage.searchBox.click();
    await discoverPage.search('Hobart Team Championship');
    await expect(discoverPage.searchBox).toHaveValue('Hobart Team Championship');
  });

  // TC-108a
  test('TC-108a [Medium] Verify record displays when searching by competition name', async ({ page }) => {
    await discoverPage.searchBox.click();
    await discoverPage.search('Hobart Team Championship');
    await expect(page.getByText('Hobart Team Championship')).toBeVisible();
  });

  // TC-108b
  test('TC-108b [Medium] Verify record displays when searching by venue name', async ({ page }) => {
    await discoverPage.searchBox.click();
    await discoverPage.search('Darwin Cue Sports');
    await expect(page.getByText('Darwin Cue Sports')).toBeVisible();
  });

  // TC-109
  test('TC-109 [Medium] Verify discipline and type filter options are displaying', async ({ page }) => {
    await expect(discoverPage.disciplineFilter).toBeVisible();
    await expect(discoverPage.typeFilter).toBeVisible();
  });

  // TC-113
  test('TC-113 [Medium] Verify View Details button is displaying', async ({ page }) => {
    await discoverPage.viewDetailsBtn.first().waitFor({ state: 'visible', timeout: 10_000 });
    await expect(discoverPage.viewDetailsBtn.first()).toBeVisible();
  });

  // TC-114
  test('TC-114 [High] Verify user navigates to competition details page by clicking View Details', async ({ page }) => {
    await discoverPage.viewDetailsBtn.first().waitFor({ state: 'visible', timeout: 10_000 });
    await discoverPage.viewDetailsBtn.first().click();
    await expect(page).toHaveURL(/\/user\/discover\/tournament\/[a-z0-9]+/i);
  });

  // TC-116
  test('TC-116 [Medium] Verify Join Competition button is displaying on detail page', async ({ page }) => {
    await discoverPage.viewDetailsBtn.first().waitFor({ state: 'visible', timeout: 10_000 });
    await discoverPage.viewDetailsBtn.first().click();
    await expect(discoverPage.joinCompetitionBtn).toBeVisible();
  });

  // TC-120
  test('TC-120 [Medium] Verify team name field is displaying and user can fill it', async ({ page }) => {
    await discoverPage.viewDetailsBtn.first().waitFor({ state: 'visible', timeout: 10_000 });
    await discoverPage.viewDetailsBtn.first().click();
    await discoverPage.joinCompetitionBtn.click();
    await expect(discoverPage.teamNameInput).toBeVisible();
    await discoverPage.fillTeamName('My team');
    await expect(discoverPage.teamNameInput).toHaveValue('My team');
  });

  // TC-121
  test('TC-121 [Low] Verify team name field is displaying as mandatory', async ({ page }) => {
    await discoverPage.viewDetailsBtn.first().waitFor({ state: 'visible', timeout: 10_000 });
    await discoverPage.viewDetailsBtn.first().click();
    await discoverPage.joinCompetitionBtn.click();
    await discoverPage.teamNameInput.click();
    await page.keyboard.press('Tab');
    await expect(discoverPage.teamNameError).toBeVisible();
  });

  // TC-122
  test('TC-122 [Low] Verify validation message appears when team name is not entered', async ({ page }) => {
    await discoverPage.viewDetailsBtn.first().waitFor({ state: 'visible', timeout: 10_000 });
    await discoverPage.viewDetailsBtn.first().click();
    await discoverPage.joinCompetitionBtn.click();
    await discoverPage.teamNameInput.click();
    await page.keyboard.press('Tab');
    await expect(discoverPage.teamNameError).toBeVisible();
  });

  // TC-123
  test('TC-123 [Medium] Verify Add Team Member field is displaying', async ({ page }) => {
    await discoverPage.viewDetailsBtn.first().waitFor({ state: 'visible', timeout: 10_000 });
    await discoverPage.viewDetailsBtn.first().click();
    await discoverPage.joinCompetitionBtn.click();
    await expect(discoverPage.addMemberInput).toBeVisible();
  });

  // TC-124
  test('TC-124 [Medium] Verify user can search for a player to add to team', async ({ page }) => {
    await discoverPage.viewDetailsBtn.first().waitFor({ state: 'visible', timeout: 10_000 });
    await discoverPage.viewDetailsBtn.first().click();
    await discoverPage.joinCompetitionBtn.click();
    await discoverPage.addMemberInput.click();
    await discoverPage.addMemberInput.fill('Emma Master');
    const playerBtn = page.getByRole('button', { name: 'Emma Master' });
    await expect(playerBtn).toBeVisible({ timeout: 8_000 });
  });

  // TC-125
  test('TC-125 [Low] Verify Confirm button is not visible without team members filled', async ({ page }) => {
    await discoverPage.viewDetailsBtn.first().waitFor({ state: 'visible', timeout: 10_000 });
    await discoverPage.viewDetailsBtn.first().click();
    await discoverPage.joinCompetitionBtn.click();
    await discoverPage.fillTeamName('My team');
    await expect(discoverPage.confirmBtn).not.toBeVisible();
  });

  // TC-126
  test('TC-126 [Low] Verify Confirm button stays hidden when no player selected', async ({ page }) => {
    await discoverPage.viewDetailsBtn.first().waitFor({ state: 'visible', timeout: 10_000 });
    await discoverPage.viewDetailsBtn.first().click();
    await discoverPage.joinCompetitionBtn.click();
    await discoverPage.fillTeamName('My team');
    await discoverPage.addMemberInput.click();
    await page.keyboard.press('Tab');
    await expect(discoverPage.confirmBtn).not.toBeVisible();
  });

  // TC-129 / TC-130
  test('TC-129/130 [Medium] Verify remove option appears after adding player and removes them', async ({ page }) => {
    await discoverPage.viewDetailsBtn.first().waitFor({ state: 'visible', timeout: 10_000 });
    await discoverPage.viewDetailsBtn.first().click();
    await discoverPage.joinCompetitionBtn.click();

    await discoverPage.addMemberInput.click();
    await discoverPage.addMemberInput.fill('e');
    const firstOption = page.locator('div[role="option"], button[role="option"]').first();
    await expect(firstOption).toBeVisible({ timeout: 8_000 });
    await firstOption.click();

    const removeBtn = page.locator('button', { hasText: /remove/i }).first();
    await expect(removeBtn).toBeVisible();
    await removeBtn.click();
    await expect(removeBtn).not.toBeVisible();
  });

  // TC-133
  test('TC-133 [High] Verify user can join a team competition after filling all required fields', async ({ page }) => {
    await discoverPage.viewDetailsBtn.first().waitFor({ state: 'visible', timeout: 10_000 });
    await discoverPage.viewDetailsBtn.first().click();
    await discoverPage.joinCompetitionBtn.click();
    await discoverPage.fillTeamName('Automation Team');

    for (let i = 0; i < 4; i++) {
      await discoverPage.addMemberInput.click();
      await discoverPage.addMemberInput.fill('e');
      const firstOption = page.locator('div[role="option"], button[role="option"]').first();
      await expect(firstOption).toBeVisible({ timeout: 8_000 });
      await firstOption.click();
    }

    const captainSelect = page.locator('select').first();
    if (await captainSelect.isVisible()) {
      await captainSelect.selectOption({ index: 1 });
    }

    await expect(discoverPage.confirmBtn).toBeVisible({ timeout: 8_000 });
    await discoverPage.confirmBtn.click();
    await expect(page.getByText(/success|joined|confirmed/i).first()).toBeVisible({ timeout: 10_000 });
  });
});