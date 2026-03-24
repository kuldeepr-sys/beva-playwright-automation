'use strict';

const { BasePage } = require('./BasePage');
const { ROUTES }   = require('../constants');

class NavigationPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    // ── Nav links ─────────────────────────────────────────────
    this.dashboardLink      = page.getByRole('link', { name: 'Dashboard' }).first();
    this.discoverLink       = page.getByRole('link', { name: 'Discover' });
    this.myCompetitionsLink = page.getByRole('link', { name: 'My Competitions' });
    this.leaderboardLink    = page.getByRole('link', { name: 'Leaderboard' });
    this.venuesLink         = page.getByRole('link', { name: 'Venues' });
    this.myProfileLink      = page.getByRole('link', { name: 'My Profile' });
    this.contactInfoLink    = page.getByRole('link', { name: 'Contact & Info' });

    // Logout — try button first, fallback to link
    // Also covers 'Log Out', 'Sign Out' variants
    this.logoutBtn = page.getByRole('button', { name: /logout|log out|sign out/i }).first();

    // ── Contact & Info sub-items ──────────────────────────────
    this.aboutUsText       = page.getByText('About Us');
    this.faqText           = page.getByText('Frequently Asked Questions');
    this.privacyPolicyText = page.getByText('Privacy Policy');
    this.termsText         = page.getByText('Terms & Conditions');
  }

  async clickDashboard()      { await this.clickElement(this.dashboardLink); }
  async clickDiscover()       { await this.clickElement(this.discoverLink); }
  async clickMyCompetitions() { await this.clickElement(this.myCompetitionsLink); }
  async clickLeaderboard()    { await this.clickElement(this.leaderboardLink); }
  async clickVenues()         { await this.clickElement(this.venuesLink); }
  async clickMyProfile()      { await this.clickElement(this.myProfileLink); }
  async clickContactInfo()    { await this.clickElement(this.contactInfoLink); }

  /**
   * Click Logout and handle any confirmation dialog that may appear.
   * After logout the app redirects to home (/) or login (/login).
   */
  async clickLogout() {
    await this.clickElement(this.logoutBtn);

    // Handle confirmation dialog if app shows one (e.g. "Are you sure?")
    const confirmBtn = this.page.getByRole('button', { name: /yes|confirm|logout|log out/i }).first();
    const hasConfirm = await confirmBtn.isVisible({ timeout: 2_000 }).catch(() => false);
    if (hasConfirm) {
      await confirmBtn.click();
    }
  }

  async clickAboutUs() {
    await this.clickElement(this.contactInfoLink);
    await this.clickElement(this.aboutUsText);
  }

  async clickFAQ() {
    await this.clickElement(this.contactInfoLink);
    await this.clickElement(this.faqText);
  }

  async clickPrivacyPolicy() {
    await this.clickElement(this.contactInfoLink);
    await this.clickElement(this.privacyPolicyText);
  }

  async clickTerms() {
    await this.clickElement(this.contactInfoLink);
    await this.clickElement(this.termsText);
  }
}

module.exports = { NavigationPage };