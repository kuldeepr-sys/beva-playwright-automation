'use strict';

const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');
const { ROUTES } = require('../constants');

class LoginPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    // ── Fields ────────────────────────────────────────────────
    // Real placeholder on live site is "Email Address" (not "name@example.com")
    this.emailInput    = page.getByPlaceholder('Email Address');
    this.passwordInput = page.getByPlaceholder('Password');
    // Submit button is type="submit", text "Sign In" — no trailing space, no Google conflict
    this.signInBtn     = page.getByRole('button', { name: 'Sign In', exact: true });
    // The eye icon is the only other button on the page (type="button", no text)
    this.eyeIcon       = page.locator('button[type="button"]');
    this.forgotLink    = page.getByRole('link', { name: 'Forgot Password' });
    this.signUpLink    = page.getByRole('link', { name: 'Sign Up' });
    // ── Error messages ─────────────────────────────────────────
    this.emailRequiredMsg    = page.getByText('Email address is required.');
    this.passwordRequiredMsg = page.getByText('Password is required');
    this.invalidEmailMsg     = page.getByText('Please enter a valid email address.');
    this.invalidLoginMsg     = page.getByText('Invalid email or password');
  }

  async open() {
    await this.goto(ROUTES.LOGIN);
    await this.emailInput.waitFor({ state: 'visible', timeout: 30_000 });
  }

  async fillEmail(email)       { await this.fillField(this.emailInput, email); }
  async fillPassword(password) { await this.fillField(this.passwordInput, password); }
  async clickSignIn()          { await this.clickElement(this.signInBtn); }
  async clickForgotPassword()  { await this.clickElement(this.forgotLink); }

  async togglePasswordVisibility() {
    await this.clickElement(this.eyeIcon);
  }

  async login(email, password) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSignIn();
  }
}

module.exports = { LoginPage };