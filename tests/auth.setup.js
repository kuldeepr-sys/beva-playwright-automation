'use strict';

const { test: setup, expect } = require('@playwright/test');
const path = require('path');
const { USERS, ROUTES } = require('../constants');

const AUTH_FILE = path.join(__dirname, '../fixtures/auth/player.json');

setup('authenticate as player', async ({ page }) => {
  await page.goto(ROUTES.HOME, { waitUntil: 'domcontentloaded' });

  // Wait for React SPA to finish loading
  await page.getByRole('link', { name: 'Login' }).waitFor({ state: 'visible', timeout: 15_000 });
  await page.getByRole('link', { name: 'Login' }).click();

  await page.getByPlaceholder('name@example.com').fill(USERS.PLAYER.email);
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill(USERS.PLAYER.password);

  // FIX: strict mode violation — 'Sign In ' matches both the submit button AND Google Sign In button
  // Use exact: true + first() to target only the form submit button
  await page.getByRole('button', { name: 'Sign In ', exact: true }).first().click();

  await expect(page).toHaveURL(/dashboard/, { timeout: 20_000 });
  await page.context().storageState({ path: AUTH_FILE });
  console.log('✅ Auth state saved');
});