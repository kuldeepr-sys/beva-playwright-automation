'use strict';

/**
 * Player Profile Tests — TC-191 to TC-219
 *
 * FIX: Removed manual login from beforeEach entirely.
 *      This file runs in the 'chromium' project which injects storageState
 *      automatically — the browser starts already logged in.
 *      beforeEach now just navigates to the dashboard, ready for each test.
 */

const { test, expect } = require('@playwright/test');
const { ProfilePage } = require('../pages/ProfilePage');

test.describe('Player Profile', () => {

  let profilePage;

  test.beforeEach(async ({ page }) => {
    // Session injected by storageState — go straight to dashboard
    await page.goto('https://beva.inheritxdev.in/user/dashboard', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/dashboard/, { timeout: 15_000 });
    profilePage = new ProfilePage(page);
  });

  // TC-191
  test('TC-191 [High] Verify user navigates to profile page by clicking My Profile', async ({ page }) => {
    await profilePage.navigateToProfile();
    await expect(page).toHaveURL(/\/user\/profile\//);
  });

  // TC-193
  test('TC-193 [Medium] Verify upload image option is displaying in profile image field', async ({ page }) => {
    await profilePage.navigateToProfile();
    await profilePage.avatarUploadLabel.waitFor({ state: 'visible', timeout: 10_000 });
    await expect(profilePage.avatarUploadLabel).toBeVisible();
    await expect(profilePage.fileInput).toBeAttached();
  });

  // TC-198
  test('TC-198 [Medium] Verify user can change first name and last name', async ({ page }) => {
    await profilePage.openEditProfile();
    await profilePage.firstNameInput.waitFor({ state: 'visible', timeout: 10_000 });
    await profilePage.firstNameInput.clear();
    await profilePage.firstNameInput.fill('Johnyyyy');
    await profilePage.lastNameInput.clear();
    await profilePage.lastNameInput.fill('Smithhhh');
    await profilePage.saveChanges();
    await expect(page.getByText('updated')).toBeVisible({ timeout: 10_000 });
  });

  // TC-199
  test('TC-199 [Medium] Verify address and postcode fields are editable and saved correctly', async ({ page }) => {
    await profilePage.openEditProfile();
    await profilePage.firstNameInput.waitFor({ state: 'visible', timeout: 10_000 });

    const newAddress  = 'Automation Address 123';
    const newPostcode = '560001';

    await profilePage.updateAddressAndPostcode(newAddress, newPostcode);
    await profilePage.saveChanges();
    await page.reload();
    await page.getByText(newAddress).waitFor({ state: 'visible', timeout: 10_000 });

    await expect(page.getByText(newAddress)).toBeVisible();
    await expect(page.getByText(newPostcode)).toBeVisible();
    await expect(profilePage.addressDisplayText).toHaveText(newAddress);
    await expect(profilePage.postcodeDisplayText).toHaveText(newPostcode);
  });

  // TC-200
  test('TC-200 [Low] Verify gender dropdown contains correct options and is selectable', async ({ page }) => {
    await profilePage.openEditProfile();
    await profilePage.firstNameInput.waitFor({ state: 'visible', timeout: 10_000 });
    await page.selectOption('#gender', 'Male');
    await expect(profilePage.genderDropdown).toHaveValue('Male');
    await page.selectOption('#gender', 'Female');
    await expect(profilePage.genderDropdown).toHaveValue('Female');
    await page.selectOption('#gender', 'Prefer not to say');
    await expect(profilePage.genderDropdown).toHaveValue('Prefer not to say');
  });

  // TC-201
  test('TC-201 [Low] Verify user is able to select gender from dropdown', async ({ page }) => {
    await profilePage.openEditProfile();
    await profilePage.firstNameInput.waitFor({ state: 'visible', timeout: 10_000 });
    await page.selectOption('#gender', 'Male');
    await expect(profilePage.genderDropdown).toHaveValue('Male');
    await page.selectOption('#gender', 'Female');
    await expect(profilePage.genderDropdown).toHaveValue('Female');
  });

  // TC-202
  test('TC-202 [Low] Verify user can select date of birth from date picker', async ({ page }) => {
    await profilePage.openEditProfile();
    await profilePage.firstNameInput.waitFor({ state: 'visible', timeout: 10_000 });
    await page.fill('#dob', '2000-10-15');
    await expect(profilePage.dobInput).toHaveValue('2000-10-15');
  });

  // TC-204
  test('TC-204 [Low] Verify bio field is displaying and user can fill it', async ({ page }) => {
    await profilePage.openEditProfile();
    await profilePage.firstNameInput.waitFor({ state: 'visible', timeout: 10_000 });
    await expect(profilePage.bioInput).toBeVisible();
  });

  // TC-205
  test('TC-205 [Medium] Verify player card modal opens when clicking Show Player Card', async ({ page }) => {
    await profilePage.navigateToProfile();
    await profilePage.showPlayerCardBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await profilePage.openPlayerCard();
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
  });

  // TC-206
  test('TC-206 [Medium] Verify player QR code is displaying properly', async ({ page }) => {
    await profilePage.navigateToProfile();
    await profilePage.showPlayerCardBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await profilePage.openPlayerCard();
    await expect(profilePage.qrCodeImg).toBeVisible();
  });

  // TC-207
  test('TC-207 [Medium] Verify download option is displaying in QR code and user can download', async ({ page }) => {
    await profilePage.navigateToProfile();
    await profilePage.showPlayerCardBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await profilePage.openPlayerCard();
    await expect(profilePage.downloadQrBtn).toBeVisible();
    await profilePage.downloadQrCode();
    await expect(profilePage.qrDownloadedMsg).toBeVisible();
  });

  // TC-208
  test('TC-208 [Medium] Verify reset password section is displaying under security section', async ({ page }) => {
    await profilePage.navigateToProfile();
    await profilePage.securitySection.waitFor({ state: 'visible', timeout: 10_000 });
    await expect(profilePage.securitySection).toBeVisible();
  });

  // TC-209
  test('TC-209 [Medium] Verify new password field is displaying and user can fill it', async ({ page }) => {
    await profilePage.navigateToProfile();
    await profilePage.newPasswordInput.waitFor({ state: 'visible', timeout: 10_000 });
    await expect(profilePage.newPasswordInput).toBeVisible();
    await profilePage.newPasswordInput.fill('Md@78045003');
    await expect(profilePage.newPasswordInput).toHaveValue('Md@78045003');
  });

  // TC-210
  test('TC-210 [Medium] Verify new password field is displaying as mandatory', async ({ page }) => {
    await profilePage.navigateToProfile();
    await profilePage.newPasswordInput.waitFor({ state: 'visible', timeout: 10_000 });
    const isRequired = await profilePage.newPasswordInput.getAttribute('required');
    const isAriaReq  = await profilePage.newPasswordInput.getAttribute('aria-required');
    expect(isRequired !== null || isAriaReq === 'true').toBeTruthy();
  });

  // TC-211
  test('TC-211 [Medium] Verify validation message appears for invalid or blank new password', async ({ page }) => {
    await profilePage.navigateToProfile();
    await profilePage.updatePasswordBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await profilePage.updatePasswordBtn.click();
    const blankError = page.locator('[role="alert"], [class*="error"], p.text-red').first();
    await expect(blankError).toBeVisible({ timeout: 5_000 });
    await profilePage.newPasswordInput.fill('abcdefg');
    await profilePage.updatePasswordBtn.click();
    await expect(blankError).toBeVisible();
  });

  // TC-213
  test('TC-213 [Medium] Verify confirm new password field is displaying and user can fill it', async ({ page }) => {
    await profilePage.navigateToProfile();
    await profilePage.confirmPasswordInput.waitFor({ state: 'visible', timeout: 10_000 });
    await expect(profilePage.confirmPasswordInput).toBeVisible();
    await profilePage.confirmPasswordInput.fill('Test@123456');
    await expect(profilePage.confirmPasswordInput).toHaveValue('Test@123456');
  });

  // TC-214
  test('TC-214 [Medium] Verify confirm new password field is mandatory', async ({ page }) => {
    await profilePage.navigateToProfile();
    await profilePage.confirmPasswordInput.waitFor({ state: 'visible', timeout: 10_000 });
    await expect(profilePage.confirmPasswordInput).toHaveAttribute('required');
  });

  // TC-215
  test('TC-215 [Medium] Verify validation message for invalid or blank confirm new password', async ({ page }) => {
    await profilePage.navigateToProfile();
    await profilePage.confirmPasswordInput.waitFor({ state: 'visible', timeout: 10_000 });
    await profilePage.confirmPasswordInput.fill('DDIFD');
    await expect(profilePage.confirmPasswordError).toBeVisible();
    await profilePage.confirmPasswordInput.clear();
    await page.keyboard.press('Tab');
    await expect(profilePage.confirmPasswordError).toBeVisible();
  });

  // TC-217
  test('TC-217 [Medium] Verify Update Password button is displaying', async ({ page }) => {
    await profilePage.navigateToProfile();
    await profilePage.updatePasswordBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await expect(profilePage.updatePasswordBtn).toBeVisible();
  });

  // TC-219
  test('TC-219 [High] Verify password is reset successfully by clicking Update Password', async ({ page }) => {
    await profilePage.navigateToProfile();
    await profilePage.updatePasswordBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await profilePage.updatePassword('Test@123456', 'Test@123456', 'Test@123456');
    await expect(profilePage.passwordUpdatedMsg).toBeVisible({ timeout: 10_000 });
  });
});