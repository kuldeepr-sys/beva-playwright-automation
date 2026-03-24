'use strict';

const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

module.exports = defineConfig({
  testDir: './tests',

  timeout:          60_000,
  expect:           { timeout: 10_000 },
  fullyParallel:    false,
  forbidOnly:       !!process.env.CI,
  retries:          process.env.CI ? 2 : 1,
  workers:          process.env.CI ? 1 : 2,

  reporter: [
    ['list'],
    ['html',  { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright'],
    ['junit', { outputFile: 'test-results/results.xml' }],
  ],

  use: {
    baseURL:           process.env.BASE_URL || 'https://beva.inheritxdev.in',
    trace:             'on-first-retry',
    screenshot:        'only-on-failure',
    video:             'on-first-retry',
    viewport:          { width: 1440, height: 900 },
    navigationTimeout: 30_000,
    actionTimeout:     15_000,
    ignoreHTTPSErrors: true,
  },

  projects: [
    // ── Auth setup (runs first, saves session to disk) ─────────
    {
      name:      'setup',
      testMatch: /auth\.setup\.js/,
    },

    // ── Guest tests: Home, SignUp, Login, ForgotPassword ───────
    {
      name:      'guest',
      testMatch: [
        /Homepage\.spec\.js/,
        /Player_Sign_Up\.spec\.js/,
        /Player_Log_In\.spec\.js/,
        /Player_Forgot_password\.spec\.js/,
      ],
      use: { ...devices['Desktop Chrome'] },
    },

    // ── Authenticated tests (all others) ────────────────────────
    {
      name: 'chromium',
      testIgnore: [
        /Homepage\.spec\.js/,
        /Player_Sign_Up\.spec\.js/,
        /Player_Log_In\.spec\.js/,
        /Player_Forgot_password\.spec\.js/,
        /auth\.setup\.js/,
      ],
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'fixtures/auth/player.json',
      },
      dependencies: ['setup'],
    },
  ],

  outputDir: 'test-results/',
});
