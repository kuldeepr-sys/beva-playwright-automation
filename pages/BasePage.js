'use strict';

const { expect } = require('@playwright/test');
const { TIMEOUTS } = require('../constants');

class BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
  }

  async goto(path = '/') {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  async clickElement(locator) {
    await locator.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    await locator.click();
  }

  async fillField(locator, text) {
    await locator.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    await locator.clear();
    await locator.fill(text);
  }

  async assertVisible(locator) {
    await expect(locator).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
  }

  async assertHidden(locator) {
    await expect(locator).toBeHidden({ timeout: TIMEOUTS.MEDIUM });
  }

  async assertUrl(pattern) {
    await expect(this.page).toHaveURL(pattern, { timeout: TIMEOUTS.MEDIUM });
  }

  async assertText(locator, text) {
    await expect(locator).toHaveValue(text);
  }
}

module.exports = { BasePage };
