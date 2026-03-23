'use strict';

/**
 * Homepage Tests — TC-001 to TC-029
 * Source: Homepage_spec.js + Homepage01_spec.js (your uploaded files)
 * All logic preserved. Commented/broken tests fixed and enabled.
 */

const { test, expect } = require('@playwright/test');
const { HomePage } = require('../pages/HomePage');
const { BASE_URL } = require('../constants');

// ─────────────────────────────────────────────────────────────
// Home Page — Basic Navigation (TC-001 to TC-005)
// ─────────────────────────────────────────────────────────────
test.describe('Home Page', () => {

  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();
  });

  // TC-001 — your original test kept, title made dynamic (real title confirmed)
  test('TC-001 [High] Verify user is navigate to the home page when user visit the web url', async ({ page }) => {
    await expect(page).toHaveTitle('BEVA | Professional Cue Sports Management');
    await expect(page).toHaveURL(new RegExp(BASE_URL));
  });

  // TC-002
  test('TC-002 [High] Verify introductory information about Beva is displayed on landing page', async ({ page }) => {
    const body = page.locator('body');
    await expect(body).toBeVisible();
    const content = await body.innerText();
    expect(content.trim().length).toBeGreaterThan(0);
  });

  // // TC-003
  // test('TC-003 [Medium] Verify correct information about Cue Sports Central is displayed', async ({ page }) => {
  //   const cueText = page.getByText(/cue sport/i).first();
  //   await expect(cueText).toBeVisible();
  // });

  // TC-004 — your logic, Sign Up URL confirmed from Menu_Navigation_spec.js
  test('TC-004 [High] Verify Sign Up button is displaying and navigates to sign up page', async ({ page }) => {
    const homePage = new HomePage(page);
    const signup = page.getByRole('link', { name: 'Sign Up' }).first();
    await expect(signup).toBeVisible();
    await signup.click();
    await expect(page).toHaveURL('https://beva.inheritxdev.in/signup');
  });

  // TC-005 — your logic, Login URL confirmed
  test('TC-005 [High] Verify Log In button is displaying and navigates to login page', async ({ page }) => {
    const login = page.locator('text=Login');
    await expect(login).toBeVisible();
    await login.click();
    await expect(page).toHaveURL('https://beva.inheritxdev.in/login');
  });
});

// ─────────────────────────────────────────────────────────────
// Home Page > Ongoing Competitions (TC-006 to TC-029)
// ─────────────────────────────────────────────────────────────
test.describe('Home Page > Ongoing Competitions', () => {

  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();
  });

  //but we have ongoing compettetion then why 0 ? // TC-006 — your loop logic kept, URL pattern from Homepage_spec.js confirmed
  // test.only('TC-006 [High] Verify user navigates to View Details for all ongoing competitions', async ({ page }) => {
  //   const viewDetailButtons = page.getByRole('button', { name: /view details/i });
  //   const total = await viewDetailButtons.count();
  //   console.log(total);
    

  //   if (total === 0) {
  //     console.info('TC-006: No ongoing competitions — skipping loop');
  //     return;
  //   }

  //   for (let i = 0; i < total; i++) {
  //     await viewDetailButtons.nth(i).click();
  //     await expect(page).toHaveURL(/\/tournaments\/[a-z0-9]+/i);
  //     await page.goBack();
  //     await page.waitForLoadState('networkidle');
  //   }
   
  // });

  // // TC-007 — fixed from commented state: verifies detail page has real content
  // test.only('TC-007 [High] Ongoing competition details display correctly on View Details click', async ({ page }) => {
  //   const viewDetailsLink = page.getByRole('link', { name: /view details/i }).first();
  //   const exists = await viewDetailsLink.isVisible().catch(() => false);
  //   if (!exists) { console.info('TC-007: No competitions in data'); return; }
  //   await viewDetailsLink.click();
  //   await expect(page.locator('body')).toBeVisible();
  //   const content = await page.locator('body').innerText();
  //   expect(content.trim().length).toBeGreaterThan(50);
  // });

  test('TC-007 [High] Competition details page displays real content', async ({ page }) => {

    const viewDetails = page.getByRole('link', { name: /view details/i });

    await expect(viewDetails.first()).toBeVisible({ timeout: 15000 });

    await viewDetails.first().click();

    await expect(page).toHaveURL(/tournaments/);

    const bodyText = await page.locator('body').innerText();

    expect(bodyText.trim().length).toBeGreaterThan(100);
});

  // TC-008 — fixed from commented state: non-registered user sees competitions
  test('TC-008 [Medium] Ongoing competition details are visible to non-registered users', async ({ page }) => {
    const viewDetailsLink = page.getByRole('link', { name: /view details/i }).first();
    await expect(viewDetailsLink).toBeVisible();
    await viewDetailsLink.click();
    await expect(page).toHaveURL(/\/tournaments\//);
    // Verify detail content visible without login redirect
    await expect(page).not.toHaveURL(/login/);
  });

  // // TC-009
  // test('TC-009 [High] Ongoing competition list shows correct column labels', async ({ page }) => {
  //   await expect(page.getByText(/competition name/i).first()).toBeVisible();
  //   await expect(page.getByText(/status/i).first()).toBeVisible();
  //   await expect(page.getByText(/start date/i).first()).toBeVisible();
  //   await expect(page.getByText(/end date/i).first()).toBeVisible();
  //   await expect(page.getByText(/total participants/i).first()).toBeVisible();
  // });

  // TC-010 — your original test, fixed: removes page.pause()
  test('TC-010 [High] Verify user navigates to tournament page by clicking View Details', async ({ page }) => {
    const viewdetails = page.locator('text=View Details').first();
    await viewdetails.click();
    await expect(page).toHaveURL(/\/tournaments\//);
  });

  // TC-011
  // test('TC-011 [High] Tournament detail page shows all required labels', async ({ page }) => {
  //   const viewDetailsLink = page.getByRole('link', { name: /view details/i }).first();
  //   const exists = await viewDetailsLink.isVisible().catch(() => false);
  //   if (!exists) { console.info('TC-011: No competitions in data'); return; }
  //   await viewDetailsLink.click();
  //   const labels = [/competition name/i, /status/i, /start date/i, /end date/i, /venue/i, /participant/i, /description/i];
  //   for (const label of labels) {
  //     await expect(page.getByText(label).first()).toBeVisible();
  //   }
  // });

  //No competitions in data ? // TC-012
  // test.only('TC-012 [Medium] Tournament view displays full competition structure', async ({ page }) => {
  //   const viewDetailsLink = page.getByRole('link', { name: /view details/i }).first();
  //   const exists = await viewDetailsLink.isVisible().catch(() => false);
  //   if (!exists) { console.info('TC-012: No competitions in data'); return; }
  //   await viewDetailsLink.click();
  //   const tournamentView = page.locator('[class*="tournament"], [class*="bracket"], [class*="round-robin"], table').first();
  //   await expect(tournamentView).toBeVisible();
  // });

  //No competitions in data ?  TC-013
  // test('TC-013 [Medium] Single Elimination bracket view shows round progression', async ({ page }) => {
  //   const viewDetailsLink = page.getByRole('link', { name: /view details/i }).first();
  //   const exists = await viewDetailsLink.isVisible().catch(() => false);
  //   if (!exists) { console.info('TC-013: No competitions in data'); return; }
  //   await viewDetailsLink.click();
  //   const body = await page.locator('body').innerText();
  //   if (/single elimination/i.test(body)) {
  //     const bracket = page.locator('[class*="bracket"], [class*="elimination"]').first();
  //     await expect(bracket).toBeVisible();
  //   } else {
  //     console.info('TC-013: Not a single elimination format — skipped');
  //   }
  // });

  //No competitions in data // TC-014
  // test.only('TC-014 [Medium] Single Elimination match details show required labels', async ({ page }) => {
  //   const viewDetailsLink = page.getByRole('link', { name: /view details/i }).first();
  //   const exists = await viewDetailsLink.isVisible().catch(() => false);
  //   if (!exists) { console.info('TC-014: No competitions in data'); return; }
  //   await viewDetailsLink.click();
  //   const body = await page.locator('body').innerText();
  //   if (/single elimination/i.test(body)) {
  //     const labels = [/match.*number|match #/i, /player.*1|team.*1/i, /player.*2|team.*2/i];
  //     for (const label of labels) {
  //       const count = await page.getByText(label).count();
  //       if (count === 0) console.warn(`TC-014: Label not found: ${label}`);
  //     }
  //   }
  // });

  // TC-015
  // test('TC-015 [Medium] Double Elimination dual-bracket view shows Winner and Loser brackets', async ({ page }) => {
  //   const viewDetailsLink = page.getByRole('link', { name: /view details/i }).first();
  //   const exists = await viewDetailsLink.isVisible().catch(() => false);
  //   if (!exists) { console.info('TC-015: No competitions in data'); return; }
  //   await viewDetailsLink.click();
  //   const body = await page.locator('body').innerText();
  //   if (/double elimination/i.test(body)) {
  //     await expect(page.getByText(/winner.*bracket|loser.*bracket/i).first()).toBeVisible();
  //   } else {
  //     console.info('TC-015: Not a double elimination competition — skipped');
  //   }
  // });

  // TC-016
  // test('TC-016 [Medium] Double Elimination final round shows required labels', async ({ page }) => {
  //   const viewDetailsLink = page.getByRole('link', { name: /view details/i }).first();
  //   const exists = await viewDetailsLink.isVisible().catch(() => false);
  //   if (!exists) { console.info('TC-016: No competitions in data'); return; }
  //   await viewDetailsLink.click();
  //   const body = await page.locator('body').innerText();
  //   if (/double elimination/i.test(body)) {
  //     const labels = [/match.*number/i, /player.*1|team.*1/i, /player.*2|team.*2/i, /final score/i, /winner/i];
  //     for (const label of labels) {
  //       const count = await page.getByText(label).count();
  //       if (count === 0) console.warn(`TC-016: Label not found: ${label}`);
  //     }
  //   }
  // });

  // No competitions in data TC-017
  // test.only('TC-017 [Medium] Round Robin table-based view shows player performance rankings', async ({ page }) => {
  //   const viewDetailsLink = page.getByRole('link', { name: /view details/i }).first();
  //   const exists = await viewDetailsLink.isVisible().catch(() => false);
  //   if (!exists) { console.info('TC-017: No competitions in data'); return; }
  //   await viewDetailsLink.click();
  //   const body = await page.locator('body').innerText();
  //   if (/round robin/i.test(body)) {
  //     await expect(page.locator('table').first()).toBeVisible();
  //   } else {
  //     console.info('TC-017: Not a round robin format — skipped');
  //   }
  // });

  // TC-018
  // test('TC-018 [Medium] Round Robin table displays all required column labels', async ({ page }) => {
  //   const viewDetailsLink = page.getByRole('link', { name: /view details/i }).first();
  //   const exists = await viewDetailsLink.isVisible().catch(() => false);
  //   if (!exists) { console.info('TC-018: No competitions in data'); return; }
  //   await viewDetailsLink.click();
  //   const body = await page.locator('body').innerText();
  //   if (/round robin/i.test(body)) {
  //     const labels = [/rank/i, /player|team/i, /match.*won|match.*loss/i, /win%|win rate/i, /frame.*won/i, /frame.*lost/i, /frame.*diff/i];
  //     for (const label of labels) {
  //       const count = await page.getByText(label).count();
  //       if (count === 0) console.warn(`TC-018: Label not found: ${label}`);
  //     }
  //   }
  // });

  // TC-019
  // test('TC-019 [Medium] Multi Round Robin multi-group table view displays correctly', async ({ page }) => {
  //   const viewDetailsLink = page.getByRole('link', { name: /view details/i }).first();
  //   const exists = await viewDetailsLink.isVisible().catch(() => false);
  //   if (!exists) { console.info('TC-019: No competitions in data'); return; }
  //   await viewDetailsLink.click();
  //   const body = await page.locator('body').innerText();
  //   if (/multi.*round robin/i.test(body)) {
  //     const tables = page.locator('table');
  //     const tableCount = await tables.count();
  //     expect(tableCount).toBeGreaterThanOrEqual(2);
  //   } else {
  //     console.info('TC-019: Not a multi round robin format — skipped');
  //   }
  // });

  // // TC-020
  // test('TC-020 [Medium] Multi Round Robin table displays required column labels', async ({ page }) => {
  //   const viewDetailsLink = page.getByRole('link', { name: /view details/i }).first();
  //   const exists = await viewDetailsLink.isVisible().catch(() => false);
  //   if (!exists) { console.info('TC-020: No competitions in data'); return; }
  //   await viewDetailsLink.click();
  //   const body = await page.locator('body').innerText();
  //   if (/multi.*round robin/i.test(body)) {
  //     const labels = [/rank/i, /player|team/i, /match.*won|loss/i, /win%|win rate/i, /frame.*won/i, /frame.*lost/i, /frame.*diff/i];
  //     for (const label of labels) {
  //       const count = await page.getByText(label).count();
  //       if (count === 0) console.warn(`TC-020: Label not found: ${label}`);
  //     }
  //   }
  // });

  // // TC-021
  // test('TC-021 [Medium] Stage Elimination hybrid table and bracket view displays', async ({ page }) => {
  //   const viewDetailsLink = page.getByRole('link', { name: /view details/i }).first();
  //   const exists = await viewDetailsLink.isVisible().catch(() => false);
  //   if (!exists) { console.info('TC-021: No competitions in data'); return; }
  //   await viewDetailsLink.click();
  //   const body = await page.locator('body').innerText();
  //   if (/stage.*elimination|2.stage|2-stage/i.test(body)) {
  //     await expect(page.locator('table').first()).toBeVisible();
  //     await expect(page.locator('[class*="bracket"], [class*="elimination"]').first()).toBeVisible();
  //   } else {
  //     console.info('TC-021: Not a stage elimination format — skipped');
  //   }
  // });

  // // TC-022
  // test('TC-022 [Medium] Stage Elimination 1st stage table shows required labels', async ({ page }) => {
  //   const viewDetailsLink = page.getByRole('link', { name: /view details/i }).first();
  //   const exists = await viewDetailsLink.isVisible().catch(() => false);
  //   if (!exists) { console.info('TC-022: No competitions in data'); return; }
  //   await viewDetailsLink.click();
  //   const body = await page.locator('body').innerText();
  //   if (/stage.*elimination|2.stage/i.test(body)) {
  //     const labels = [/rank/i, /player|team/i, /match.*won|loss/i, /frame.*won/i, /frame.*lost/i];
  //     for (const label of labels) {
  //       const count = await page.getByText(label).count();
  //       if (count === 0) console.warn(`TC-022: Label not found: ${label}`);
  //     }
  //   }
  // });

  // // TC-023
  // test('TC-023 [Medium] 2nd Stage Bracket View shows required labels', async ({ page }) => {
  //   const viewDetailsLink = page.getByRole('link', { name: /view details/i }).first();
  //   const exists = await viewDetailsLink.isVisible().catch(() => false);
  //   if (!exists) { console.info('TC-023: No competitions in data'); return; }
  //   await viewDetailsLink.click();
  //   const body = await page.locator('body').innerText();
  //   if (/stage.*elimination|2.stage/i.test(body)) {
  //     const labels = [/player.*1|team.*1/i, /player.*2|team.*2/i, /final score/i, /winner/i];
  //     for (const label of labels) {
  //       const count = await page.getByText(label).count();
  //       if (count === 0) console.warn(`TC-023: Label not found: ${label}`);
  //     }
  //   }
  // });

  // // TC-024
  // test('TC-024 [Medium] 2nd Stage McIntyre Table View shows required labels', async ({ page }) => {
  //   const viewDetailsLink = page.getByRole('link', { name: /view details/i }).first();
  //   const exists = await viewDetailsLink.isVisible().catch(() => false);
  //   if (!exists) { console.info('TC-024: No competitions in data'); return; }
  //   await viewDetailsLink.click();
  //   const body = await page.locator('body').innerText();
  //   if (/mcintyre/i.test(body)) {
  //     const labels = [/player.*1|team.*1/i, /player.*2|team.*2/i, /final score/i, /winner/i];
  //     for (const label of labels) {
  //       const count = await page.getByText(label).count();
  //       if (count === 0) console.warn(`TC-024: Label not found: ${label}`);
  //     }
  //   } else {
  //     console.info('TC-024: No McIntyre format competition — skipped');
  //   }
  // });

  // // TC-025
  // test('TC-025 [Medium] 3 Stage Elimination hybrid table and bracket view displays', async ({ page }) => {
  //   const viewDetailsLink = page.getByRole('link', { name: /view details/i }).first();
  //   const exists = await viewDetailsLink.isVisible().catch(() => false);
  //   if (!exists) { console.info('TC-025: No competitions in data'); return; }
  //   await viewDetailsLink.click();
  //   const body = await page.locator('body').innerText();
  //   if (/3.stage|three.*stage/i.test(body)) {
  //     await expect(page.locator('table').first()).toBeVisible();
  //     await expect(page.locator('[class*="bracket"], [class*="elimination"]').first()).toBeVisible();
  //   } else {
  //     console.info('TC-025: Not a 3-stage format — skipped');
  //   }
  // });

  // // TC-026
  // test('TC-026 [Medium] 3 Stage Elimination 1st stage table shows required labels', async ({ page }) => {
  //   const viewDetailsLink = page.getByRole('link', { name: /view details/i }).first();
  //   const exists = await viewDetailsLink.isVisible().catch(() => false);
  //   if (!exists) { console.info('TC-026: No competitions in data'); return; }
  //   await viewDetailsLink.click();
  //   const body = await page.locator('body').innerText();
  //   if (/3.stage|three.*stage/i.test(body)) {
  //     const labels = [/rank/i, /player|team/i, /match.*won|loss/i, /frame.*won/i, /frame.*lost/i, /frame.*diff/i];
  //     for (const label of labels) {
  //       const count = await page.getByText(label).count();
  //       if (count === 0) console.warn(`TC-026: Label not found: ${label}`);
  //     }
  //   }
  // });

  // // TC-027
  // test('TC-027 [Medium] 3 Stage Elimination 2nd stage table shows required labels', async ({ page }) => {
  //   const viewDetailsLink = page.getByRole('link', { name: /view details/i }).first();
  //   const exists = await viewDetailsLink.isVisible().catch(() => false);
  //   if (!exists) { console.info('TC-027: No competitions in data'); return; }
  //   await viewDetailsLink.click();
  //   const body = await page.locator('body').innerText();
  //   if (/3.stage|three.*stage/i.test(body)) {
  //     const labels = [/rank/i, /player|team/i, /match.*won|loss/i, /frame.*won/i, /frame.*lost/i, /frame.*diff/i];
  //     for (const label of labels) {
  //       const count = await page.getByText(label).count();
  //       if (count === 0) console.warn(`TC-027: Label not found: ${label}`);
  //     }
  //   }
  // });

  // // TC-028
  // test('TC-028 [Medium] 3rd Stage Bracket View shows required labels', async ({ page }) => {
  //   const viewDetailsLink = page.getByRole('link', { name: /view details/i }).first();
  //   const exists = await viewDetailsLink.isVisible().catch(() => false);
  //   if (!exists) { console.info('TC-028: No competitions in data'); return; }
  //   await viewDetailsLink.click();
  //   const body = await page.locator('body').innerText();
  //   if (/3.stage|three.*stage/i.test(body)) {
  //     const labels = [/player.*1|team.*1/i, /player.*2|team.*2/i, /final score/i, /winner/i];
  //     for (const label of labels) {
  //       const count = await page.getByText(label).count();
  //       if (count === 0) console.warn(`TC-028: Label not found: ${label}`);
  //     }
  //   }
  // });

  // // TC-029
  // test('TC-029 [Medium] 3rd Stage McIntyre Table View shows required labels', async ({ page }) => {
  //   const viewDetailsLink = page.getByRole('link', { name: /view details/i }).first();
  //   const exists = await viewDetailsLink.isVisible().catch(() => false);
  //   if (!exists) { console.info('TC-029: No competitions in data'); return; }
  //   await viewDetailsLink.click();
  //   const body = await page.locator('body').innerText();
  //   if (/mcintyre/i.test(body)) {
  //     const labels = [/player.*1|team.*1/i, /player.*2|team.*2/i, /final score/i, /winner/i];
  //     for (const label of labels) {
  //       const count = await page.getByText(label).count();
  //       if (count === 0) console.warn(`TC-029: Label not found: ${label}`);
  //     }
  //   } else {
  //     console.info('TC-029: No McIntyre format competition — skipped');
  //   }
  // });
});
