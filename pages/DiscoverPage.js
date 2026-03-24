'use strict';

const { BasePage } = require('./BasePage');
const { ROUTES } = require('../constants');

class DiscoverPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    // ── Search & Filters ──────────────────────────────────────
    this.searchBox          = page.getByPlaceholder('Search by venue or title...');
    this.disciplineFilter   = page.getByRole('button', { name: 'All Disciplines' });
    this.typeFilter         = page.getByRole('button', { name: 'All Types' });
    // ── Competition cards ─────────────────────────────────────
    this.viewDetailsBtn     = page.getByRole('button', { name: 'View Details ' });
    this.joinCompetitionBtn = page.getByRole('button', { name: 'Join Competition' });
    // ── Join modal fields (team/doubles) ──────────────────────
    this.teamNameInput      = page.getByPlaceholder('Enter team name...');
    this.teamNameError      = page.getByText('Team name is required.');
    this.addMemberInput     = page.getByPlaceholder('Search player to join your team... (4 more needed)');
    this.confirmBtn         = page.getByRole('button', { name: 'Confirm' });
  }

  async open() {
    await this.goto(ROUTES.DISCOVER);
  }

  async search(text) {
    await this.fillField(this.searchBox, text);
  }

  async clickFirstViewDetails() {
    await this.clickElement(this.viewDetailsBtn.first());
  }

  async clickJoinCompetition() {
    await this.clickElement(this.joinCompetitionBtn);
  }

  async fillTeamName(name) {
    await this.fillField(this.teamNameInput, name);
  }

  async searchAndSelectPlayer(playerName) {
    await this.fillField(this.addMemberInput, playerName);
    const playerBtn = this.page.getByRole('button', { name: playerName });
    await this.clickElement(playerBtn);
  }

  async tabOutOfTeamName() {
    await this.teamNameInput.click();
    await this.page.keyboard.press('Tab');
  }
}

module.exports = { DiscoverPage };
