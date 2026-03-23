# Beva E2E — Complete Framework Guide

> **Who this is for:** Anyone who needs to understand, run, maintain, or extend this automation framework — from a first-time reader to a senior QA engineer.  
> **App under test:** Beva Cue Sports Management — `https://beva.inheritxdev.in`  
> **Framework:** Playwright + JavaScript (Node.js)

---

## Table of Contents

1. [What is This Framework?](#1-what-is-this-framework)
2. [What is Playwright?](#2-what-is-playwright)
3. [What is Page Object Model (POM)?](#3-what-is-page-object-model-pom)
4. [Folder Structure — Every File Explained](#4-folder-structure--every-file-explained)
5. [How the Framework Boots Up](#5-how-the-framework-boots-up)
6. [playwright.config.js — Every Setting Explained](#6-playwrightconfigjs--every-setting-explained)
7. [constants/index.js — Why It Exists](#7-constantsindexjs--why-it-exists)
8. [BasePage.js — The Foundation](#8-basepagejs--the-foundation)
9. [Page Objects — Each File Explained](#9-page-objects--each-file-explained)
10. [Test Files — Each File Explained](#10-test-files--each-file-explained)
11. [auth.setup.js — How Login Works Once](#11-authsetupjs--how-login-works-once)
12. [Locators — How Elements Are Found](#12-locators--how-elements-are-found)
13. [Assertions — How Results Are Verified](#13-assertions--how-results-are-verified)
14. [Error Patterns — What Can Go Wrong](#14-error-patterns--what-can-go-wrong)
15. [How to Add a New Page Object](#15-how-to-add-a-new-page-object)
16. [How to Add a New Test](#16-how-to-add-a-new-test)
17. [CI/CD — How the Pipeline Works](#17-cicd--how-the-pipeline-works)
18. [Glossary](#18-glossary)

---

## 1. What is This Framework?

This framework automatically tests the Beva web application by controlling a real Chrome browser, clicking buttons, filling forms, and verifying results — exactly like a human tester would, but faster and repeatable.

**Without automation:** A tester manually opens the browser, logs in, clicks every button, checks every message, and writes results. This takes hours and is error-prone.

**With this framework:** Run one command (`npm test`). The computer does all of it in minutes, then produces a report showing exactly what passed and what failed.

---

## 2. What is Playwright?

Playwright is the tool this framework is built on. It is made by Microsoft and is free and open source.

**What Playwright does:**
- Opens a real Chrome browser window (or runs it invisibly in the background)
- Navigates to URLs
- Finds elements on the page (buttons, inputs, text)
- Clicks, types, selects — all the same actions a human would do
- Checks if things are visible, have the right text, or point to the right URL
- Takes screenshots and videos when tests fail
- Produces an HTML report showing what passed and what failed

**How Playwright is used in this project:**

```js
// This is Playwright code — it opens a page and clicks a button
const { test, expect } = require('@playwright/test');

test('click the login button', async ({ page }) => {
  await page.goto('https://beva.inheritxdev.in/');
  await page.getByRole('link', { name: 'Login' }).click();
  await expect(page).toHaveURL(/login/);
});
```

Every test in this framework uses Playwright's `test` and `expect` functions.

---

## 3. What is Page Object Model (POM)?

**The problem POM solves:** Imagine you have 50 tests that all click the Login button. The Login button locator is written 50 times. One day the developer changes the button from `name="Login"` to `name="Sign In"`. Now you have to find and fix 50 tests.

**The POM solution:** Write the locator ONCE in a Page Object class. All 50 tests use that class. When the button changes, you fix it in one place.

### Without POM (Bad — your original code)

```js
// In login test:
await page.getByRole('button', { name: 'Sign In ' }).click();

// In navigation test:
await page.getByRole('button', { name: 'Sign In ' }).click();

// In dashboard test:
await page.getByRole('button', { name: 'Sign In ' }).click();

// → Button name changes? Fix 3+ files.
```

### With POM (Good — this framework)

```js
// In LoginPage.js — defined ONCE:
this.signInBtn = page.getByRole('button', { name: 'Sign In ' });

// In login test:
await loginPage.clickSignIn();

// In navigation test:
await loginPage.clickSignIn();

// → Button name changes? Fix 1 file (LoginPage.js).
```

### The Three Layers of POM in This Framework

```
Layer 1: constants/index.js   → Stores URLs, credentials, timeout numbers
Layer 2: pages/*.js           → Stores locators and actions for each page  
Layer 3: tests/*.spec.js      → Writes the actual test steps using Layer 2
```

Each layer only knows about the layer above it. Tests never contain raw locators. Page objects never contain test assertions (mostly). Constants never contain logic.

---

## 4. Folder Structure — Every File Explained

```
beva-e2e/
├── .env                          ← Your secrets: email, password, URL
├── .env.example                  ← Template showing what goes in .env
├── .gitignore                    ← Tells Git what NOT to save (node_modules, secrets)
├── package.json                  ← Project config: name, scripts, dependencies
├── playwright.config.js          ← All Playwright settings (timeout, browsers, reporters)
├── README.md                     ← Quick start guide
├── FRAMEWORK_GUIDE.md            ← This file — complete deep explanation
│
├── constants/
│   └── index.js                  ← Central registry: all URLs, user data, numbers
│
├── fixtures/
│   └── auth/
│       └── player.json           ← Saved login session (cookies + localStorage)
│                                    Created automatically when you first run npm test
│
├── pages/                        ← Page Object Model classes
│   ├── BasePage.js               ← Parent class: shared methods all pages inherit
│   ├── HomePage.js               ← Locators for the home/landing page
│   ├── LoginPage.js              ← Locators for the login form
│   ├── SignUpPage.js             ← Locators for the registration form
│   ├── ForgotPasswordPage.js     ← Locators for forgot password flow
│   ├── NavigationPage.js         ← Locators for the sidebar menu
│   ├── DiscoverPage.js           ← Locators for the Discover competitions page
│   ├── VenuesPage.js             ← Locators for the Venues page
│   └── ProfilePage.js           ← Locators for the user Profile page
│
└── tests/                        ← Actual test files
    ├── auth.setup.js             ← Special: runs first, logs in, saves session
    ├── Homepage.spec.js          ← TC-001 to TC-029
    ├── Player_Log_In.spec.js     ← TC-054 to TC-065
    ├── Player_Sign_Up.spec.js    ← TC-030 to TC-050
    ├── Player_Forgot_password.spec.js ← TC-067 to TC-073
    ├── Menu_Navigation.spec.js   ← TC-095 to TC-097
    ├── Player_Dashboard.spec.js  ← TC-104
    ├── Player_Discover.spec.js   ← TC-107 to TC-133
    ├── Player_Venues.spec.js     ← TC-175 to TC-183
    └── Player_profile.spec.js   ← TC-191 to TC-219
```

---

## 5. How the Framework Boots Up

When you run `npm test`, this is exactly what happens step by step:

```
Step 1: npm reads package.json
        → finds "test": "playwright test"
        → runs Playwright

Step 2: Playwright reads playwright.config.js
        → learns testDir is ./tests
        → learns about 3 projects: setup, guest, chromium
        → loads environment variables from .env

Step 3: Project "setup" runs FIRST
        → runs tests/auth.setup.js
        → opens Chrome, goes to login page
        → fills email + password, clicks Sign In
        → waits for redirect to /user/dashboard
        → saves ALL cookies and localStorage to fixtures/auth/player.json
        → closes

Step 4: Project "guest" runs
        → no stored session (fresh browser)
        → runs Homepage.spec.js, Player_Log_In.spec.js,
          Player_Sign_Up.spec.js, Player_Forgot_password.spec.js
        → these pages don't need login

Step 5: Project "chromium" runs
        → LOADS fixtures/auth/player.json into browser automatically
        → browser is already logged in — no login step needed
        → runs Menu_Navigation.spec.js, Player_Dashboard.spec.js,
          Player_Discover.spec.js, Player_Venues.spec.js, Player_profile.spec.js

Step 6: Reports are generated
        → playwright-report/index.html (open in browser)
        → test-results/results.xml (for CI tools like Jenkins)
        → console output (you see it in terminal)
```

---

## 6. playwright.config.js — Every Setting Explained

```js
module.exports = defineConfig({

  testDir: './tests',
  // WHERE: Playwright looks for test files in the tests/ folder

  timeout: 60_000,
  // HOW LONG: Each individual test can run for maximum 60 seconds
  // If a test takes longer, it is automatically marked as failed
  // 60_000 = 60,000 milliseconds = 60 seconds

  expect: { timeout: 10_000 },
  // HOW LONG: Each expect() assertion waits up to 10 seconds for the condition
  // Example: await expect(button).toBeVisible() waits up to 10s for button to appear

  fullyParallel: false,
  // PARALLEL: Tests run one at a time (sequentially), not side by side
  // WHY false: This framework uses ONE login account.
  // If tests ran in parallel, they would interfere with each other
  // (e.g., one test changes profile name while another reads it)

  forbidOnly: !!process.env.CI,
  // SAFETY: On CI (GitHub Actions), forbids test.only() from being committed
  // test.only() means "run only this test" — if someone commits that by mistake,
  // all other tests would be skipped. This setting prevents that.

  retries: process.env.CI ? 2 : 1,
  // RETRY: If a test fails, try again automatically
  // On CI: retry 2 times before marking as failed
  // Locally: retry 1 time
  // WHY: Network hiccups or slow page loads can cause occasional failures
  // that are not real bugs. Retry catches these.

  workers: process.env.CI ? 1 : 2,
  // WORKERS: How many tests run at the same time
  // On CI: 1 worker (sequential, most stable)
  // Locally: 2 workers (slightly faster)

  reporter: [
    ['list'],          // Shows each test result in terminal as it runs
    ['html', { ... }], // Creates playwright-report/index.html (rich visual report)
    ['junit', { ... }],// Creates results.xml (for Jenkins/GitHub Actions to parse)
  ],

  use: {
    baseURL: 'https://beva.inheritxdev.in',
    // BASE: Prefix for all page.goto() calls that start with /
    // await page.goto('/login') becomes https://beva.inheritxdev.in/login

    trace: 'on-first-retry',
    // TRACE: Records a full trace file (timeline of actions) when a test is retried
    // Open with: npx playwright show-trace trace.zip

    screenshot: 'only-on-failure',
    // SCREENSHOT: Takes a screenshot automatically when a test fails
    // Saved in: test-results/ folder

    video: 'on-first-retry',
    // VIDEO: Records a video of the browser session when retrying a failed test
    // Saved in: test-results/ folder

    viewport: { width: 1440, height: 900 },
    // SCREEN SIZE: Sets the browser window size to 1440×900 pixels
    // Matches a standard laptop/desktop screen

    navigationTimeout: 30_000,
    // PAGE LOAD: Maximum time for a page to load after a click or goto
    // If page doesn't load in 30 seconds → test fails

    actionTimeout: 15_000,
    // ACTION: Maximum time for a single action (click, fill, etc.)
    // If the element doesn't respond in 15 seconds → test fails

    ignoreHTTPSErrors: true,
    // SSL: Ignores SSL certificate warnings on staging/test environments
  },

  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.js/,
      // Matches ONLY tests/auth.setup.js
      // Runs before all other projects
    },
    {
      name: 'guest',
      testMatch: [...],
      // Matches home, signup, login, forgot password tests
      // No storageState = fresh browser = no login
    },
    {
      name: 'chromium',
      testIgnore: [...],
      // Ignores guest test files (they have their own project)
      use: {
        storageState: 'fixtures/auth/player.json',
        // LOADS the saved session = browser starts already logged in
      },
      dependencies: ['setup'],
      // WAITS for 'setup' project to finish before running
    },
  ],
});
```

---

## 7. constants/index.js — Why It Exists

**Problem:** If `https://beva.inheritxdev.in` appears in 20 test files and the URL changes, you edit 20 files.

**Solution:** Write it once in `constants/index.js`. Every file imports it.

```js
// constants/index.js
const BASE_URL = 'https://beva.inheritxdev.in';

const ROUTES = {
  HOME:            '/',
  LOGIN:           '/login',
  SIGNUP:          '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD:       '/user/dashboard',
  DISCOVER:        '/user/discover',
  MY_COMPETITIONS: '/user/my-competitions',
  LEADERBOARD:     '/user/leaderboard',
  VENUES:          '/user/venues',
};

const USERS = {
  PLAYER: {
    email:    process.env.PLAYER_EMAIL    || 'player1@beva.com',
    password: process.env.PLAYER_PASSWORD || 'Test@123456',
  },
};

const TIMEOUTS = {
  SHORT:  5_000,   // 5 seconds
  MEDIUM: 10_000,  // 10 seconds
  LONG:   30_000,  // 30 seconds
};
```

**How it is used:**

```js
// In a page object:
const { ROUTES, TIMEOUTS } = require('../constants');

async open() {
  await this.goto(ROUTES.LOGIN);  // Uses the constant, not a hardcoded string
}

// In a test:
const { USERS } = require('../constants');

await loginPage.login(USERS.PLAYER.email, USERS.PLAYER.password);
```

**The `process.env` pattern:**

```js
email: process.env.PLAYER_EMAIL || 'player1@beva.com'
```

This means: "Use the value from the `.env` file if it exists. Otherwise use the default value after `||`." This allows different environments (staging, production) to use different credentials without changing code.

---

## 8. BasePage.js — The Foundation

Every Page Object extends `BasePage`. This means every page automatically gets these methods for free:

```js
class BasePage {
  constructor(page) {
    this.page = page;  // Stores the Playwright page object
  }

  // Navigate to a URL path
  async goto(path = '/') {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }
  // Usage: await this.goto('/login')
  // waitUntil: 'domcontentloaded' means "wait until the page HTML is loaded"
  // (faster than waiting for all images/fonts to load)

  // Click an element (waits for it to be visible first)
  async clickElement(locator) {
    await locator.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    await locator.click();
  }
  // WHY waitFor first: If you click before the element appears, the test fails
  // This method waits up to 10 seconds for the element to appear, THEN clicks

  // Clear a field then type text
  async fillField(locator, text) {
    await locator.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
    await locator.clear();  // Clear any existing text first
    await locator.fill(text);
  }
  // WHY clear first: If a field already has text, filling it adds to it
  // This method always starts fresh

  // Assert element is visible
  async assertVisible(locator) {
    await expect(locator).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
  }

  // Assert element is NOT visible
  async assertHidden(locator) {
    await expect(locator).toBeHidden({ timeout: TIMEOUTS.MEDIUM });
  }

  // Assert the current page URL matches a pattern
  async assertUrl(pattern) {
    await expect(this.page).toHaveURL(pattern, { timeout: TIMEOUTS.MEDIUM });
  }
}
```

**How inheritance works:**

```js
class LoginPage extends BasePage {
  // LoginPage now HAS all BasePage methods
  // PLUS its own methods defined below
}

// In a test:
const loginPage = new LoginPage(page);
await loginPage.goto('/login');          // ← from BasePage
await loginPage.fillEmail('a@b.com');   // ← from LoginPage
await loginPage.clickSignIn();          // ← from LoginPage
await loginPage.assertVisible(loginPage.signInBtn); // ← from BasePage
```

---

## 9. Page Objects — Each File Explained

### LoginPage.js

**Purpose:** All locators and actions for the Login page at `/login`

```js
class LoginPage extends BasePage {
  constructor(page) {
    super(page);  // Call BasePage constructor — gives us this.page

    // ── LOCATORS (how to find each element) ─────────────────
    this.emailInput    = page.getByPlaceholder('name@example.com');
    // Finds the input that has placeholder text "name@example.com"

    this.passwordInput = page.getByPlaceholder('Password');
    // Finds the input with placeholder "Password"

    this.signInBtn     = page.getByRole('button', { name: 'Sign In ' });
    // Finds a button element that says "Sign In " (note trailing space — matches app exactly)

    this.eyeIcon       = page.getByRole('button', { name: 'Show password' });
    // Finds the show/hide password toggle button

    this.forgotLink    = page.getByRole('link', { name: 'Forgot Password' });
    // Finds a link element that says "Forgot Password"

    // ── REAL ERROR MESSAGES from the app ─────────────────────
    this.emailRequiredMsg   = page.getByText('Email address is required.');
    this.passwordRequiredMsg = page.getByText('Password is required');
    this.invalidEmailMsg    = page.getByText('Please enter a valid email address.');
    this.invalidLoginMsg    = page.getByText('Invalid email or password');
    // These exact strings were found by running the app and seeing what it shows
  }

  // ── ACTION METHODS ────────────────────────────────────────
  async open()                    { await this.goto(ROUTES.LOGIN); }
  async fillEmail(email)          { await this.fillField(this.emailInput, email); }
  async fillPassword(password)    { await this.fillField(this.passwordInput, password); }
  async clickSignIn()             { await this.clickElement(this.signInBtn); }
  async clickForgotPassword()     { await this.clickElement(this.forgotLink); }
  async togglePasswordVisibility(){ await this.clickElement(this.eyeIcon); }

  // Combines fillEmail + fillPassword + clickSignIn into one call
  async login(email, password) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSignIn();
  }
}
```

### SignUpPage.js

**Purpose:** Registration form at `/signup`

Key locators (all discovered by inspecting the real app):
- `page.getByPlaceholder('First Name')` — first name input
- `page.getByPlaceholder('Min 8 chars, A-Z, 0-9, symbol')` — password field
- `page.locator('#terms')` — terms checkbox (using CSS ID selector)
- `page.locator('#firstName-error')` — the error message element for first name
- `page.getByRole('button', { name: 'Create Account' })` — submit button

### ForgotPasswordPage.js

**Purpose:** Forgot Password form at `/forgot-password`

Key locators:
- `page.getByRole('button', { name: 'Send Link ' })` — send button
- `page.getByText('Check your inbox!')` — success confirmation heading
- `page.getByText("We've sent a password reset link to ")` — success body text

### NavigationPage.js

**Purpose:** The sidebar menu visible after login

Key locators:
- `page.getByRole('link', { name: 'Dashboard' }).first()` — Dashboard link
- `page.getByRole('link', { name: 'Contact & Info' })` — expander for sub-menu
- `page.getByText('About Us')` — sub-menu item (text locator, not link, because it's a div)
- `page.getByRole('button', { name: 'Logout' })` — logout button

**Why `.first()` on Dashboard?**
The word "Dashboard" might appear twice on the page (in the header AND sidebar). `.first()` ensures we always click the sidebar one.

### DiscoverPage.js

**Purpose:** The competitions discovery page at `/user/discover`

Key locators:
- `page.getByPlaceholder('Search by venue or title...')` — search input
- `page.getByRole('button', { name: 'View Details ' })` — competition card button (trailing space matters)
- `page.getByPlaceholder('Search player to join your team... (4 more needed)')` — team member search
- `page.getByRole('button', { name: 'Confirm' })` — join confirmation

**Important:** The `addMemberInput` placeholder text includes "(4 more needed)" — this text changes as members are added. This locator only works when the modal first opens. For a more robust solution you would use `page.locator('input[placeholder*="Search player"]')`.

### ProfilePage.js

**Purpose:** User profile page at `/user/profile/{id}`

Key locators:
- `page.locator('label[for="profile-photo-upload"]')` — upload avatar label (clickable)
- `page.locator('#profile-photo-upload')` — actual hidden file input
- `page.locator('#firstName')`, `#lastName`, `#address`, `#postcode`, `#gender`, `#dob`, `#bio` — form fields (using real HTML IDs from the app)
- `page.locator('.mt-2.space-y-5')` — security section (CSS class selector)
- `page.locator('.text-xs.text-red-600.font-medium.pl-2')` — confirm password error (CSS classes from Tailwind)

---

## 10. Test Files — Each File Explained

### auth.setup.js

This is not a regular test. It is a **setup** that runs before all other tests. It logs in and saves the session.

```js
const AUTH_FILE = path.join(__dirname, '../fixtures/auth/player.json');

setup('authenticate as player', async ({ page }) => {
  // 1. Go to home page
  await page.goto(ROUTES.HOME);

  // 2. Click Login link
  await page.getByRole('link', { name: 'Login' }).click();

  // 3. Fill credentials
  await page.getByPlaceholder('name@example.com').fill(USERS.PLAYER.email);
  await page.getByPlaceholder('Password').fill(USERS.PLAYER.password);

  // 4. Sign in
  await page.getByRole('button', { name: 'Sign In ' }).click();

  // 5. Wait for dashboard
  await expect(page).toHaveURL(/dashboard/, { timeout: 20_000 });

  // 6. Save the entire session (cookies + localStorage) to a file
  await page.context().storageState({ path: AUTH_FILE });
});
```

The saved `player.json` file contains things like:
```json
{
  "cookies": [{ "name": "session", "value": "abc123..." }],
  "origins": [{
    "origin": "https://beva.inheritxdev.in",
    "localStorage": [{ "name": "beva_token", "value": "eyJ..." }]
  }]
}
```

When the `chromium` project runs, Playwright loads this file and injects it into the browser before each test. The browser is then already authenticated — no login needed.

### Homepage.spec.js (TC-001 to TC-029)

Structure:
```
test.describe('Home Page')                     → TC-001 to TC-005
  test.beforeEach → homePage.open()             → goes to / before each test

test.describe('Home Page > Ongoing Competitions') → TC-006 to TC-029
  test.beforeEach → homePage.open()
```

TC-006 pattern (loop through all View Details links):
```js
const total = await viewDetailButtons.count();
for (let i = 0; i < total; i++) {
  await viewDetailButtons.nth(i).click();
  await expect(page).toHaveURL(/\/tournaments\/[a-z0-9]+/i);
  await page.goBack();
  await page.waitForLoadState('networkidle');
}
```
This clicks every competition card, verifies the URL, and goes back.

TC-013 to TC-029 pattern (format-specific checks):
```js
const body = await page.locator('body').innerText();
if (/round robin/i.test(body)) {
  // Only assert if this competition IS round robin
  await expect(table).toBeVisible();
} else {
  console.info('Not round robin — skipped');
}
```
These tests read the full page text first. They only assert format-specific elements if that format is present. This prevents false failures when a different format competition is shown.

### Player_Sign_Up.spec.js (TC-030 to TC-050)

Notable patterns:

**Data-driven password validation (TC-041):**
```js
const invalidPasswords = [
  { value: 'abc@1234', rule: 'uppercase' },  // missing uppercase
  { value: 'ABC@1234', rule: 'lowercase' },  // missing lowercase
  { value: 'Abc@defg', rule: 'number'    },  // missing number
  { value: 'Abc12345', rule: 'symbol'    },  // missing symbol
  { value: 'Ab1@',     rule: '8'         },  // too short
];

for (const data of invalidPasswords) {
  await signUpPage.passwordInput.fill(data.value);
  await signUpPage.passwordInput.click();
  await expect(signUpPage.passwordError).toContainText(new RegExp(data.rule, 'i'));
}
```
One test covers 5 scenarios by looping through an array. Much cleaner than 5 separate tests.

### Player_Discover.spec.js (TC-107 to TC-133)

The most complex test file due to the team join flow.

**TC-129/130 — Remove player after adding:**
```js
// Add a player by typing and selecting from dropdown
await discoverPage.addMemberInput.fill('e');
const firstPlayer = page.locator('div[role="option"]').first();
await expect(firstPlayer).toBeVisible({ timeout: 5_000 });
await firstPlayer.click();

// Remove button now visible
const removeBtn = page.locator('button', { hasText: /remove/i }).first();
await expect(removeBtn).toBeVisible();
await removeBtn.click();
await expect(removeBtn).not.toBeVisible();
```

**TC-133 — Full team join flow:**
```js
// Loop to add 4 players
for (let i = 0; i < 4; i++) {
  await discoverPage.addMemberInput.click();
  await discoverPage.addMemberInput.fill('e');
  const firstOption = page.locator('div[role="option"]').first();
  await expect(firstOption).toBeVisible({ timeout: 5_000 });
  await firstOption.click();
}
```
Fills 'e' to trigger the player search dropdown, then picks the first result each time.

---

## 11. auth.setup.js — How Login Works Once

**The problem with logging in every test:** If there are 128 tests and each one logs in, that is 128 × (goto + click + fill + fill + click + wait) = 768 browser actions just for login. This is slow and unnecessary.

**The solution — storageState:**

```
First run:
  auth.setup.js → logs in → saves session to fixtures/auth/player.json

Every authenticated test:
  Playwright injects player.json into browser before the test starts
  Browser opens already logged in
  Test goes directly to the page it needs to test
```

This reduces authenticated test setup from ~5 seconds per test to ~0.5 seconds.

**What player.json contains:**

When you log in to a web app, the server sends a "session token" stored in cookies or localStorage. `storageState` captures all of these and saves them. When loaded, the browser presents these tokens to the server — the server thinks you are already logged in.

**When to regenerate player.json:**

- When the login credentials change
- When the session expires (usually after days/weeks)
- When the server changes its authentication mechanism

To regenerate: delete `fixtures/auth/player.json` and run `npm test`. The setup step will run first and create a new one.

---

## 12. Locators — How Elements Are Found

A locator is how Playwright finds an element on the page. This framework uses these locator types:

### By Role (Preferred — Most Stable)

```js
page.getByRole('button', { name: 'Sign In ' })
// Finds: <button>Sign In </button>
// Why preferred: Roles are semantic — they match what the element IS, not how it looks

page.getByRole('link', { name: 'Login' })
// Finds: <a>Login</a>

page.getByRole('link', { name: /view details/i })
// /view details/i is a regex — matches "View Details", "view details", "VIEW DETAILS"
// The i flag means case-insensitive
```

### By Placeholder (Forms)

```js
page.getByPlaceholder('name@example.com')
// Finds: <input placeholder="name@example.com">
// Good for form inputs
```

### By Text

```js
page.getByText('Forgot Password')
// Finds any element containing exactly "Forgot Password"

page.getByText(/cue sport/i)
// Finds any element containing text matching the regex
```

### By CSS Selector (When No Better Option)

```js
page.locator('#firstName-error')
// Finds element with id="firstName-error"
// # means ID selector

page.locator('.text-xs.text-red-600')
// Finds element with BOTH classes text-xs AND text-red-600
// . means class selector, multiple dots = multiple classes

page.locator('label[for="profile-photo-upload"]')
// Finds a label element whose "for" attribute equals "profile-photo-upload"
```

### Chaining Locators

```js
page.locator('div[role="option"]').first()
// Finds all div elements with role="option", then takes the first one

page.getByRole('button', { name: 'View Details ' }).first()
// Finds all "View Details" buttons, takes the first one (the first competition card)
```

### Why Locators Sometimes Break

| What Changed | Example Broken Locator | Fix |
|---|---|---|
| Placeholder text changed | `getByPlaceholder('Email')` → input now says 'Email address' | Update placeholder string |
| Button label changed | `getByRole('button', { name: 'Sign In ' })` → now 'Log In' | Update name |
| HTML ID removed | `locator('#firstName-error')` → ID no longer in DOM | Use text or role locator instead |
| Radix/dynamic ID | `locator('#radix-_r_3_')` → changes every render | Use `[role="dialog"]` instead |
| App content changed | `getByText('Check your inbox!')` → text changed | Update text string |

---

## 13. Assertions — How Results Are Verified

Assertions use `expect()` from Playwright. They automatically retry until the condition is true (up to 10 seconds by default).

### Visibility

```js
await expect(loginPage.signInBtn).toBeVisible();
// PASSES if: element exists in DOM and is visible (not hidden by CSS)
// FAILS if: element does not exist OR is hidden

await expect(loginPage.signInBtn).toBeHidden();
// PASSES if: element is hidden or does not exist
```

### URL

```js
await expect(page).toHaveURL('https://beva.inheritxdev.in/login');
// PASSES if: current URL matches exactly

await expect(page).toHaveURL(/\/user\/profile\//);
// PASSES if: current URL contains /user/profile/ (regex match)
// WHY regex: The profile URL has a dynamic user ID like /user/profile/69a853...
// We cannot hardcode the ID, so we match just the pattern
```

### Input Values

```js
await expect(searchBox).toHaveValue('Southern Cross');
// PASSES if: the input field currently contains "Southern Cross"

await expect(passwordInput).toHaveAttribute('type', 'password');
// PASSES if: the input has attribute type="password" (password is masked)

await expect(passwordInput).toHaveAttribute('type', 'text');
// PASSES if: input type is "text" (password is revealed after eye icon click)
```

### Text Content

```js
await expect(passwordError).toContainText(/uppercase/i);
// PASSES if: the element's text contains "uppercase" (case insensitive)
// Used for: checking password error messages match the right rule
```

### Checked State

```js
await expect(termsCheckbox).toBeChecked();
// PASSES if: checkbox is checked

await expect(termsCheckbox).not.toBeChecked();
// PASSES if: checkbox is NOT checked
// .not reverses any assertion
```

### Attached (Not Visible)

```js
await expect(fileInput).toBeAttached();
// PASSES if: element exists in DOM (even if hidden by CSS)
// Used for: file inputs which are always hidden but must exist
```

### The Retry Mechanism

All assertions retry automatically. For example:

```js
await expect(successMessage).toBeVisible();
```

Playwright checks every 100ms for up to 10 seconds:
- 0ms: element not visible → retry
- 500ms: element not visible → retry
- 2000ms: element appears → PASSES

This handles normal page delays without needing `page.waitForTimeout()`.

---

## 14. Error Patterns — What Can Go Wrong

### "Timeout exceeded" errors

**Cause:** Element never appeared within the timeout.

```
Error: locator.click: Timeout 15000ms exceeded
```

**How to diagnose:**
1. Run `npm run test:headed` — watch the browser
2. Does the element appear at all? If not → locator is wrong
3. Does it appear but take too long? → Increase timeout in `playwright.config.js`

### "Element not found" errors

**Cause:** Locator does not match anything on the page.

```
Error: getByPlaceholder('name@example.com') not found
```

**How to diagnose:**
1. Open the app in your real browser
2. Right-click the element → Inspect
3. Check the actual placeholder/role/text
4. Update the locator in the Page Object

### "URL mismatch" errors

**Cause:** Page navigated somewhere unexpected.

```
Error: expect(page).toHaveURL: /user\/dashboard/ did not match 
received: https://beva.inheritxdev.in/login
```

**Common cause:** Login failed — session expired or credentials are wrong. Check `.env` file.

### "Strict mode violation" errors

**Cause:** A locator matched more than one element and you did not specify which one.

```
Error: strict mode violation: getByRole('link', { name: 'Dashboard' }) 
  resolved to 2 elements
```

**Fix:** Add `.first()` or `.nth(index)`:
```js
page.getByRole('link', { name: 'Dashboard' }).first()
```

---

## 15. How to Add a New Page Object

**Scenario:** The app adds a new "Leaderboard" page and you need to test it.

**Step 1:** Create `pages/LeaderboardPage.js`

```js
'use strict';

const { BasePage } = require('./BasePage');
const { ROUTES } = require('../constants');

class LeaderboardPage extends BasePage {
  constructor(page) {
    super(page);

    // Add every element you need to interact with or assert
    this.searchBox        = page.getByPlaceholder('Search player...');
    this.disciplineFilter = page.getByRole('button', { name: 'All Disciplines' });
    this.rankColumn       = page.getByText('Rank').first();
    this.playerColumn     = page.getByText('Player').first();
    this.tableRows        = page.locator('table tbody tr');
  }

  async open() {
    await this.goto(ROUTES.LEADERBOARD);
  }

  async searchByPlayer(name) {
    await this.fillField(this.searchBox, name);
  }

  async filterByDiscipline(value) {
    await this.clickElement(this.disciplineFilter);
    await this.page.getByRole('option', { name: value }).click();
  }
}

module.exports = { LeaderboardPage };
```

**Step 2:** Add the route to `constants/index.js` if it is not there:

```js
const ROUTES = {
  // ... existing routes
  LEADERBOARD: '/user/leaderboard',  // ← add this
};
```

**Step 3:** Create the test file (see next section).

---

## 16. How to Add a New Test

**Scenario:** Write TC-185 — "Verify all player rankings are displayed"

**Step 1:** Create `tests/Player_Leaderboard.spec.js`

```js
'use strict';

const { test, expect } = require('@playwright/test');
const { LeaderboardPage } = require('../pages/LeaderboardPage');

test.describe('Player Leaderboard', () => {

  let leaderboard;

  test.beforeEach(async ({ page }) => {
    leaderboard = new LeaderboardPage(page);
    await leaderboard.open();
  });

  test('TC-185 [High] Verify all player rankings are displayed in the list', async ({ page }) => {
    // Verify the table headers are visible
    await expect(leaderboard.rankColumn).toBeVisible();
    await expect(leaderboard.playerColumn).toBeVisible();

    // Verify at least one row exists
    const rowCount = await leaderboard.tableRows.count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('TC-187 [Medium] Verify records display when searching by player name', async ({ page }) => {
    await leaderboard.searchByPlayer('player');
    const rowCount = await leaderboard.tableRows.count();
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });
});
```

**Step 2:** Add the script to `package.json`:

```json
"test:leaderboard": "playwright test tests/Player_Leaderboard.spec.js"
```

**Step 3:** Decide if this file needs login:
- If YES (it does) → add to `testIgnore` in the `guest` project in `playwright.config.js`
- If NO → add to `testMatch` in the `guest` project

For Leaderboard (needs login), no config change needed — the `chromium` project picks up all files not already matched.

**Step 4:** Run it:
```bash
npm run test:leaderboard
```

---

## 17. CI/CD — How the Pipeline Works

CI/CD means "Continuous Integration / Continuous Delivery". It automatically runs your tests every time someone pushes code to GitHub.

**Why it matters:** Without CI, tests only run when someone remembers to run them. With CI, every code push is automatically tested and the team is alerted if something breaks.

**Flow:**

```
Developer pushes code to GitHub
         ↓
GitHub Actions reads .github/workflows/e2e.yml
         ↓
Spins up a Ubuntu server in the cloud
         ↓
Installs Node.js + npm packages + Playwright browsers
         ↓
Sets environment variables from GitHub Secrets
         ↓
Runs npm test
         ↓
├── setup project: logs in, saves session
├── guest project: tests home, login, signup, forgot password
└── chromium project: tests all authenticated pages
         ↓
Uploads playwright-report/ as an artifact
(team can download and open the HTML report)
         ↓
If any test FAILS → GitHub marks the PR as failed
                  → team is notified
                  → code cannot be merged until fixed
```

**GitHub Secrets (why they exist):**

You should never put passwords in code files committed to GitHub. Anyone who can see the repository can see them. GitHub Secrets are encrypted and only injected into the pipeline at runtime.

Go to: Repository → Settings → Secrets and Variables → Actions → New repository secret

Add:
- `BASE_URL` = `https://beva.inheritxdev.in`
- `PLAYER_EMAIL` = `player1@beva.com`
- `PLAYER_PASSWORD` = `Test@123456`

These replace the values in `.env` during CI runs.

---

## 18. Glossary

| Term | Plain English Meaning |
|---|---|
| **Playwright** | The tool that controls the browser |
| **Test** | One automated check with a pass/fail result |
| **Spec file** | A JavaScript file containing tests (ends in `.spec.js`) |
| **Locator** | Code that finds a specific element on a webpage |
| **Assertion** | A check — "I expect this to be true" |
| **Page Object** | A class that holds all locators for one page |
| **POM** | Page Object Model — the design pattern used |
| **BasePage** | Parent class all page objects inherit shared methods from |
| **storageState** | Saved browser session (cookies + localStorage) |
| **fixtures** | Pre-prepared data or state (like a saved login session) |
| **beforeEach** | Code that runs before every test in a describe block |
| **describe** | A group of related tests |
| **constants** | Fixed values stored centrally (URLs, credentials) |
| **environment variables** | Values read from `.env` file at runtime |
| **headless** | Browser running invisibly (no window shown) — default |
| **headed** | Browser running with visible window (`npm run test:headed`) |
| **trace** | A recording of every browser action, viewable for debugging |
| **retries** | How many times to re-run a failed test before giving up |
| **workers** | How many tests run simultaneously |
| **CI/CD** | Automated testing in the cloud on every code push |
| **GitHub Actions** | The CI/CD platform that runs tests automatically |
| **artifact** | Files saved after a CI run (like the HTML report) |
| **regex** | Pattern for matching text (`/view details/i` matches any case) |
| **async/await** | JavaScript syntax for handling operations that take time |
| **require()** | JavaScript's way of importing code from another file |
| **module.exports** | JavaScript's way of making code available to be imported |
| **CommonJS** | The module system this project uses (as opposed to ES Modules) |
| **timeout** | Maximum time before a waiting action gives up and fails |
| **TC** | Test Case — a numbered item from the test case document |
