'use strict';

const { test: setup, expect } = require('@playwright/test');
const path = require('path');
const fs   = require('fs');
const { USERS, ROUTES } = require('../constants');

const AUTH_FILE = path.join(__dirname, '../fixtures/auth/player.json');

setup('authenticate as player', async ({ page }) => {
  // Ensure the fixtures/auth directory exists before we try to write into it
  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });

  await page.goto(ROUTES.LOGIN, { waitUntil: 'domcontentloaded' });

  // Real placeholder on the live page is "Email Address" (not "name@example.com")
  const emailInput = page.getByPlaceholder('Email Address');
  await emailInput.waitFor({ state: 'visible', timeout: 30_000 });
  await emailInput.fill(USERS.PLAYER.email);

  // Password placeholder is "Password" — unchanged
  const passwordInput = page.getByPlaceholder('Password');
  await passwordInput.waitFor({ state: 'visible', timeout: 10_000 });
  await passwordInput.fill(USERS.PLAYER.password);

  // Button is type="submit" with text "Sign In" (no trailing space, no Google conflict)
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();

  await expect(page).toHaveURL(/dashboard/, { timeout: 30_000 });

  // Save the authenticated session so all chromium-project tests can reuse it
  await page.context().storageState({ path: AUTH_FILE });
  console.log('✅ Auth state saved to', AUTH_FILE);
});