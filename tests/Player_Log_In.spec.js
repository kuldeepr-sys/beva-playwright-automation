'use strict';

/**
 * Player Login Tests — TC-054 to TC-065
 *
 * FIX: LoginPage.js now uses correct placeholder "Email Address" (not "name@example.com")
 *      and correct button locator. This spec uses LoginPage so it works automatically.
 */

const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { USERS } = require('../constants');

test.describe('Player Log In', () => {

  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.open();
  });

  // TC-054
  test('TC-054 [High] Verify Email address field is displaying properly and user can fill it', async ({ page }) => {
    await expect(loginPage.emailInput).toBeVisible();
    await loginPage.fillEmail('test@example.com');
    await expect(loginPage.emailInput).toHaveValue('test@example.com');
  });

  // TC-055
  test('TC-055 [Medium] Verify email field is displaying as mandatory', async ({ page }) => {
    await loginPage.clickSignIn();
    await expect(loginPage.emailRequiredMsg).toBeVisible();
  });

  // TC-057
  test('TC-057 [High] Verify password field is displaying and user can fill it', async () => {
    await expect(loginPage.passwordInput).toBeVisible();
    await loginPage.fillPassword('Player@123456');
    await expect(loginPage.passwordInput).toBeVisible();
  });

  // TC-058
  test('TC-058 [Medium] Verify password field is displaying as mandatory', async ({ page }) => {
    await loginPage.fillEmail(USERS.PLAYER.email);
    await loginPage.clickSignIn();
    await expect(loginPage.passwordRequiredMsg).toBeVisible();
  });

  // TC-059
  test('TC-059 [Low] Verify password is hidden when user enters it', async ({ page }) => {
    await loginPage.passwordInput.fill('SDFDSGF');
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  // TC-060
  test('TC-060 [Low] Verify eye icon is visible and clicking it reveals password', async ({ page }) => {
    await expect(loginPage.eyeIcon).toBeVisible();
    await loginPage.passwordInput.fill('sdfdsgs');
    await loginPage.togglePasswordVisibility();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'text');
  });

  // TC-061
  test('TC-061 [High] Verify Sign In button is displaying', async () => {
    await expect(loginPage.signInBtn).toBeVisible();
  });

  // TC-062
  test('TC-062 [High] Verify user is able to sign in with valid credentials', async ({ page }) => {
    await loginPage.login(USERS.PLAYER.email, USERS.PLAYER.password);
    await expect(page).toHaveURL(/dashboard/, { timeout: 20_000 });
  });

  // TC-063
  test('TC-063 [Medium] Verify validation message appears for invalid login credentials', async ({ page }) => {
    await loginPage.fillEmail(USERS.PLAYER.email);
    await loginPage.fillPassword('WrongPass@999');
    await loginPage.clickSignIn();
    await expect(loginPage.invalidLoginMsg).toBeVisible();
  });

  // TC-064
  test('TC-064 [Medium] Verify Sign Up link is displaying on login page', async () => {
    await expect(loginPage.signUpLink).toBeVisible();
  });

  // TC-065
  test('TC-065 [High] Verify user navigates to dashboard after successful login', async ({ page }) => {
    await loginPage.login(USERS.PLAYER.email, USERS.PLAYER.password);
    await expect(page).toHaveURL(/dashboard/, { timeout: 20_000 });
  });
});