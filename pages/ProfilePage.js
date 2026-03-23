'use strict';

const { BasePage } = require('./BasePage');
const { ROUTES } = require('../constants');

class ProfilePage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    // ── Nav to profile ────────────────────────────────────────
    this.profileNavLink      = page.getByRole('link', { name: 'My Profile' });
    this.editProfileBtn      = page.getByRole('button', { name: 'Edit Profile' });
    this.saveChangesBtn      = page.getByRole('button', { name: 'Save Changes' });
    // ── Profile image upload ──────────────────────────────────
    this.avatarUploadLabel   = page.locator('label[for="profile-photo-upload"]');
    this.fileInput           = page.locator('#profile-photo-upload');
    // ── Edit form fields (real IDs from app) ──────────────────
    this.firstNameInput      = page.locator('#firstName');
    this.lastNameInput       = page.locator('#lastName');
    this.addressInput        = page.locator('#address');
    this.postcodeInput       = page.locator('#postcode');
    this.genderDropdown      = page.locator('#gender');
    this.dobInput            = page.locator('#dob');
    this.bioInput            = page.locator('#bio');
    // ── Player Card / QR ──────────────────────────────────────
    this.showPlayerCardBtn   = page.getByRole('button', { name: 'Show Player Card' });
    this.qrCodeImg           = page.getByRole('img', { name: /QR Code/i });
    this.downloadQrBtn       = page.getByRole('button', { name: 'Download QR Code' });
    this.qrDownloadedMsg     = page.getByText('QR Code downloaded!');
    // ── Password section ──────────────────────────────────────
    this.securitySection     = page.locator('.mt-2.space-y-5');
    this.currentPasswordInput = page.getByPlaceholder('Enter Current password');
    this.newPasswordInput    = page.getByPlaceholder('Min 8 chars, A-Z, 0-9, symbol');
    this.confirmPasswordInput = page.getByPlaceholder('Confirm New Password');
    this.updatePasswordBtn   = page.getByRole('button', { name: 'Update Password' });
    this.passwordUpdatedMsg  = page.getByText('Password updated successfully');
    // ── Address display labels ────────────────────────────────
    this.addressDisplayText  = page.locator('p:has-text("Address") + p');
    this.postcodeDisplayText = page.locator('p:has-text("Postcode") + p');
    // ── Confirm password error ────────────────────────────────
    this.confirmPasswordError = page.locator('.text-xs.text-red-600.font-medium.pl-2');
  }

  async navigateToProfile() {
    await this.clickElement(this.profileNavLink);
  }

  async openEditProfile() {
    await this.navigateToProfile();
    await this.clickElement(this.editProfileBtn);
  }

  async saveChanges() {
    await this.clickElement(this.saveChangesBtn);
  }

  async updateName(firstName, lastName) {
    await this.fillField(this.firstNameInput, firstName);
    await this.fillField(this.lastNameInput, lastName);
  }

  async updateAddressAndPostcode(address, postcode) {
    await this.fillField(this.addressInput, address);
    await this.fillField(this.postcodeInput, postcode);
  }

  async openPlayerCard() {
    await this.clickElement(this.showPlayerCardBtn);
  }

  async downloadQrCode() {
    await this.clickElement(this.downloadQrBtn);
  }

  async updatePassword(currentPass, newPass, confirmPass) {
    await this.fillField(this.currentPasswordInput, currentPass);
    await this.fillField(this.newPasswordInput, newPass);
    await this.fillField(this.confirmPasswordInput, confirmPass || newPass);
    await this.clickElement(this.updatePasswordBtn);
  }
}

module.exports = { ProfilePage };
