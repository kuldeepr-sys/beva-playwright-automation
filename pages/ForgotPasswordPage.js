'use strict';

const { BasePage } = require('./BasePage');
const { ROUTES } = require('../constants');

class ForgotPasswordPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.emailInput       = page.getByPlaceholder('name@example.com');
    this.sendLinkBtn      = page.getByRole('button', { name: 'Send Link ' });
    this.forgotLink       = page.getByRole('link', { name: 'Forgot Password' });
    // ── Real validation and success messages from app ─────────
    this.emailRequiredMsg = page.getByText('Email address is required.');
    this.invalidEmailMsg  = page.getByText('Please enter a valid email address.');
    this.successHeading   = page.getByText('Check your inbox!');
    this.successBody      = page.getByText("We've sent a password reset link to ");
  }

  async open() {
    await this.goto(ROUTES.FORGOT_PASSWORD);
    // Wait for email field — page is React SPA and needs time to render
    await this.emailInput.waitFor({ state: 'visible', timeout: 15_000 });
  }

  async fillEmail(email)   { await this.fillField(this.emailInput, email); }
  async clickSendLink()    { await this.clickElement(this.sendLinkBtn); }

  async submitForgotPassword(email) {
    await this.fillEmail(email);
    await this.clickSendLink();
  }
}

module.exports = { ForgotPasswordPage };