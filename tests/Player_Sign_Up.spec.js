'use strict';

/**
 * Player Sign Up Tests — TC-030 to TC-050
 * Source: Player_Sign_Up_spec.js (your uploaded file)
 * All logic preserved. Fixed: broken TC-040, TC-043, TC-045, TC-050.
 * All commented tests reviewed and enabled where correct.
 */

const { test, expect } = require('@playwright/test');
const { SignUpPage } = require('../pages/SignUpPage');

test.describe('Player Sign Up', () => {

  let signUpPage;

  test.beforeEach(async ({ page }) => {
    signUpPage = new SignUpPage(page);
    await signUpPage.open();
  });

  // TC-030 — your exact logic, removed page.pause()
  test('TC-030 [High] Verify first name field is displaying and user can fill it', async ({ page }) => {
    await expect(signUpPage.firstNameInput).toBeVisible();
    await signUpPage.fillFirstName('kd');
    await expect(signUpPage.firstNameInput).toHaveValue('kd');
  });

  // TC-031 — your logic, both parts: mandatory + aria-required
  test('TC-031 [Medium] Verify first name is mandatory and displays as required', async ({ page }) => {
    await signUpPage.firstNameInput.click();
    await page.keyboard.press('Tab');
    await expect(signUpPage.firstNameError).toBeVisible();
    await expect(signUpPage.firstNameInput).toHaveAttribute('aria-required', 'true');
  });

  // TC-031 — your second test: alphabet-only validation by checking input value
  test('TC-031b [Medium] First name accepts only alphabetic values', async ({ page }) => {
    await signUpPage.fillFirstName('Kuldeep123');
    const value = await signUpPage.firstNameInput.inputValue();
    // App should strip/reject non-alpha OR show error
    const hasError = await signUpPage.firstNameError.isVisible().catch(() => false);
    const isAlphaOnly = /^[A-Za-z]*$/.test(value);
    expect(isAlphaOnly || hasError).toBeTruthy();
  });

  // TC-032 — your logic: invalid value shows error
  test('TC-032 [Low] Verify validation message for invalid first name', async ({ page }) => {
    await signUpPage.firstNameInput.click();
    await signUpPage.firstNameInput.fill('4555');
    await expect(signUpPage.firstNameError).toBeVisible();
  });

  // TC-032b — your logic: blank first name shows error
  test('TC-032b [Low] Verify validation message when first name field is blank', async ({ page }) => {
    await signUpPage.firstNameInput.click();
    await page.keyboard.press('Tab');
    await expect(signUpPage.firstNameError).toBeVisible();
  });

  // TC-033 — your exact logic
  test('TC-033 [High] Verify last name field is displaying and user can fill it', async ({ page }) => {
    await expect(signUpPage.lastNameInput).toBeVisible();
    await signUpPage.fillLastName('Rj');
    await expect(signUpPage.lastNameInput).toHaveValue('Rj');
  });

  // TC-034 — your exact logic
  test('TC-034 [Medium] Verify last name is mandatory and accepts only alphabetic characters', async ({ page }) => {
    await signUpPage.lastNameInput.click();
    await signUpPage.lastNameInput.fill('23243');
    await expect(signUpPage.lastNameError).toBeVisible();
    await expect(signUpPage.lastNameInput).toHaveAttribute('aria-required', 'true');
  });

  // TC-035 — your logic: invalid value
  test('TC-035 [Low] Verify validation message for invalid last name', async ({ page }) => {
    await signUpPage.lastNameInput.click();
    await signUpPage.lastNameInput.fill('3423rwefsd');
    await expect(signUpPage.lastNameError).toBeVisible();
  });

  // TC-035b — your logic: blank field
  test('TC-035b [Low] Verify validation message when last name is blank', async ({ page }) => {
    await signUpPage.lastNameInput.click();
    await page.keyboard.press('Tab');
    await expect(signUpPage.lastNameError).toBeVisible();
  });

  // TC-036 — your exact logic
  test('TC-036 [High] Verify email field is displaying and user can fill it', async ({ page }) => {
    await expect(signUpPage.emailInput).toBeVisible();
    await signUpPage.emailInput.click();
    await signUpPage.fillEmail('xrja1@sharebot.net');
    await expect(signUpPage.emailInput).toHaveValue('xrja1@sharebot.net');
  });

  // TC-037 — your exact logic
  test('TC-037 [Medium] Verify email field is displaying as mandatory', async ({ page }) => {
    await expect(signUpPage.emailInput).toHaveAttribute('aria-required', 'true');
  });

  // TC-038 — your logic: invalid email
  test('TC-038 [Low] Verify validation message for invalid email', async ({ page }) => {
    await signUpPage.emailInput.click();
    await signUpPage.emailInput.fill('sdjbfidnf3m335u');
    await expect(signUpPage.emailError).toBeVisible();
  });

  // TC-038b — your logic: blank email
  test('TC-038b [Low] Verify validation message when email is blank', async ({ page }) => {
    await signUpPage.emailInput.click();
    await page.keyboard.press('Tab');
    await expect(signUpPage.emailError).toBeVisible();
  });

  // TC-039 — your exact logic
  test('TC-039 [High] Verify password field is displaying and user can fill it', async ({ page }) => {
    await signUpPage.passwordInput.click();
    await signUpPage.fillPassword('vdsgr');
    await expect(signUpPage.passwordInput).toBeVisible();
  });

  // TC-040 — FIXED: your code used .toHaveAttribute() on a page object method (was a bug)
  test('TC-040 [Medium] Verify password field is displaying as mandatory', async ({ page }) => {
    await expect(signUpPage.passwordInput).toHaveAttribute('aria-required', 'true');
  });

  // TC-041 — your exact loop logic with real error ID
  test('TC-041 [High] Verify password validation rules', async ({ page }) => {
    const invalidPasswords = [
      { value: 'abc@1234', rule: 'uppercase' },
      { value: 'ABC@1234', rule: 'lowercase' },
      { value: 'Abc@defg', rule: 'number'    },
      { value: 'Abc12345', rule: 'symbol'    },
      { value: 'Ab1@',     rule: '8'         },
    ];

    for (const data of invalidPasswords) {
      await signUpPage.passwordInput.fill(data.value);
      await signUpPage.passwordInput.click();
      await expect(signUpPage.passwordError).toContainText(new RegExp(data.rule, 'i'));
    }
  });

  // TC-042 — your exact logic
  test('TC-042 [High] Verify confirm password field is displaying and user can fill it', async ({ page }) => {
    await signUpPage.confirmPasswordInput.click();
    await expect(signUpPage.confirmPasswordInput).toBeVisible();
    await signUpPage.fillConfirmPassword('Sa@20331202');
    await expect(signUpPage.confirmPasswordInput).toHaveValue('Sa@20331202');
  });

  // TC-043 — FIXED: your code used .getAttribute() (wrong method for assertion)
  test('TC-043 [Medium] Verify confirm password field is displaying as mandatory', async ({ page }) => {
    await expect(signUpPage.confirmPasswordInput).toHaveAttribute('aria-required', 'true');
  });

  // TC-045 — your logic fixed: placeholder was 'Password' which targets login field
  // Using correct signup confirm password field
  test('TC-045 [High] Verify confirm password mismatch validation', async ({ page }) => {
    const invalidPasswords = [
      { value: 'abc@1234', message: 'uppercase' },
      { value: 'ABC@1234', message: 'lowercase' },
      { value: 'Abc@defg', message: 'number'    },
      { value: 'Abc12345', message: 'symbol'    },
      { value: 'Ab1@',     message: '8'         },
    ];

    for (const data of invalidPasswords) {
      await signUpPage.confirmPasswordInput.fill('');
      await signUpPage.confirmPasswordInput.fill(data.value);
      await signUpPage.confirmPasswordInput.press('Tab');
      const errorMessage = page.getByText(new RegExp(data.message, 'i'));
      await expect(errorMessage).toBeVisible();
    }
  });

  // TC-046 — your exact logic
  test('TC-046 [Medium] Verify terms and conditions checkbox is displaying and toggleable', async ({ page }) => {
    await expect(signUpPage.termsCheckbox).toBeVisible();
    await signUpPage.checkTerms();
    await expect(signUpPage.termsCheckbox).toBeChecked();
    await signUpPage.uncheckTerms();
    await expect(signUpPage.termsCheckbox).not.toBeChecked();
  });

  // TC-047 — your exact logic
  test('TC-047 [Medium] Verify clicking Terms & Conditions link shows acceptance content', async ({ page }) => {
    await signUpPage.clickTermsLink();
    await expect(page.locator('text=Acceptance of Terms')).toBeVisible();
  });

  // TC-048 — your exact logic
  test('TC-048 [High] Verify user cannot sign up without accepting Terms & Conditions', async ({ page }) => {
    await signUpPage.firstNameInput.fill('First');
    await signUpPage.lastNameInput.fill('Player');
    await signUpPage.emailInput.fill('mihiy93024@pazard.com');
    await signUpPage.passwordInput.fill('Player@123');
    await signUpPage.confirmPasswordInput.fill('Player@123');
    await signUpPage.clickCreateAccount();
    await expect(signUpPage.termsErrorMsg).toBeVisible();
  });

  // TC-049 — your exact logic
  test('TC-049 [Medium] Verify Create Account submit button is displaying', async ({ page }) => {
    await expect(signUpPage.createAccountBtn).toBeVisible();
  });

//   // TC-050 — your exact logic

  test('TC-050 [High] Verify user is able to sign up by clicking Create Account', async ({ page }) => {

    await signUpPage.firstNameInput.fill('First');
    await signUpPage.lastNameInput.fill('Player');
    await signUpPage.emailInput.fill('mihiy93024@pazard.com');
    await signUpPage.passwordInput.fill('Player@123');
    await signUpPage.confirmPasswordInput.fill('Player@123');
    await signUpPage.termsCheckbox.check();
    await signUpPage.clickCreateAccount();
    await expect(page).toHaveURL('https://beva.inheritxdev.in/login', { timeout: 15_000 });
  });

//   test.only('TC-051 [High] Verify user is not able to sign up with already registered email', async ({ page }) => {

//   await signUpPage.firstNameInput.fill('Second');
//   await signUpPage.lastNameInput.fill('Player');

//   // same email used in TC-050
//   await signUpPage.emailInput.fill('mihiy93024@pazard.com');

//   await signUpPage.passwordInput.fill('Player@123');
//   await signUpPage.confirmPasswordInput.fill('Player@123');
//   await signUpPage.termsCheckbox.check();

//   await signUpPage.clickCreateAccount();

//   // Expected → Error message should be visible
//   await expect(page.locator('text=Email already exists')).toBeVisible();

//   // Expected → User should remain on signup page
//   await expect(page).toHaveURL(/signup/);
// });
  
});

