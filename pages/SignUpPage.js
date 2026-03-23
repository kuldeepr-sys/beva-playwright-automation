'use strict';

const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');
const { ROUTES } = require('../constants');

class SignUpPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    // ── Fields ────────────────────────────────────────────────
    this.firstNameInput      = page.getByPlaceholder('First Name');
    this.lastNameInput       = page.getByPlaceholder('Last Name');
    this.emailInput          = page.getByPlaceholder('Email');
    this.passwordInput       = page.getByPlaceholder('Min 8 chars, A-Z, 0-9, symbol');
    this.confirmPasswordInput = page.getByPlaceholder('Confirm Password');
    this.termsCheckbox       = page.locator('#terms');
    this.termsLink           = page.getByText('Terms & Conditions');
    this.createAccountBtn    = page.getByRole('button', { name: 'Create Account' });
    // ── Error IDs (real IDs from app) ─────────────────────────
    this.firstNameError  = page.locator('#firstName-error');
    this.lastNameError   = page.locator('#lastName-error');
    this.emailError      = page.locator('#email-error');
    this.passwordError   = page.locator('#password-error');
    this.termsErrorMsg   = page.getByText('You must accept the Terms &');
  }

  async open() {
    await this.goto(ROUTES.SIGNUP);
  }

  async fillFirstName(value) { await this.fillField(this.firstNameInput, value); }
  async fillLastName(value)  { await this.fillField(this.lastNameInput, value); }
  async fillEmail(value)     { await this.fillField(this.emailInput, value); }
  async fillPassword(value)  { await this.fillField(this.passwordInput, value); }
  async fillConfirmPassword(value) { await this.fillField(this.confirmPasswordInput, value); }

  async checkTerms()   { await this.termsCheckbox.check(); }
  async uncheckTerms() { await this.termsCheckbox.uncheck(); }
  async clickTermsLink() { await this.clickElement(this.termsLink); }
  async clickCreateAccount() { await this.clickElement(this.createAccountBtn); }

  async fillFullForm({ firstName, lastName, email, password, confirmPassword }) {
    await this.fillFirstName(firstName);
    await this.fillLastName(lastName);
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.fillConfirmPassword(confirmPassword || password);
  }
}

module.exports = { SignUpPage };
