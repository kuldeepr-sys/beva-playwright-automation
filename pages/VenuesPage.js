'use strict';

const { BasePage } = require('./BasePage');
const { ROUTES } = require('../constants');

class VenuesPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.searchBox  = page.getByPlaceholder('Search by name, address, or postcode...');
    this.viewAllBtn = page.getByRole('link', { name: /view all/i }).first();
  }

  async open() {
    await this.goto(ROUTES.VENUES);
  }

  async search(text) {
    await this.fillField(this.searchBox, text);
  }

  async clickViewAll() {
    await this.clickElement(this.viewAllBtn);
  }
}

module.exports = { VenuesPage };
