'use strict';

const { BasePage } = require('./BasePage');

class HomePage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.signUpLink      = page.getByRole('link', { name: /sign up/i }).first();
    this.loginLink       = page.getByRole('link', { name: 'Login' });
    this.viewDetailsLinks = page.getByRole('link', { name: /view details/i });
    this.cueText         = page.getByText(/cue sport/i).first();
    this.bodyEl          = page.locator('body');
  }

  async open() {
    await this.goto('/');
  }

  async clickSignUp()      { await this.clickElement(this.signUpLink); }
  async clickLogin()       { await this.clickElement(this.loginLink); }
  async clickViewDetails(index = 0) {
    await this.clickElement(this.viewDetailsLinks.nth(index));
  }
}

module.exports = { HomePage };
