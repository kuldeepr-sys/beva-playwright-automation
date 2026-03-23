'use strict';

const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');
const { ROUTES } = require('../constants');

class LoginPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    // ── Fields ────────────────────────────────────────────────
    this.emailInput    = page.getByPlaceholder('name@example.com');
    this.passwordInput = page.getByPlaceholder('Password');
    this.signInBtn     = page.getByRole('button', { name: 'Sign In ', exact: true }).first();
    this.eyeIcon       = page.getByRole('button', { name: 'Show password' });
    this.forgotLink    = page.getByRole('link', { name: 'Forgot Password' });
    this.signUpLink    = page.getByRole('link', { name: 'Sign Up' });
    // ── Error messages (real text from app) ───────────────────
    this.emailRequiredMsg    = page.getByText('Email address is required.');
    this.passwordRequiredMsg = page.getByText('Password is required');
    this.invalidEmailMsg     = page.getByText('Please enter a valid email address.');
    this.invalidLoginMsg     = page.getByText('Invalid email or password');
  }

  async open() {
    await this.goto(ROUTES.LOGIN);
    // Wait for email field — login page is a React SPA and needs time to render
    await this.emailInput.waitFor({ state: 'visible', timeout: 15_000 });
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