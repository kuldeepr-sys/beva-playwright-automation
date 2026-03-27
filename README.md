# Beva E2E — Playwright Automation Framework

End-to-end test automation for the Beva Cue Sports Management platform.

Built with Playwright + JavaScript (CommonJS) using the Page Object Model pattern.

---

## Quick Links

| What you need         | Where to look       |
| --------------------- | ------------------- |
| Setup instructions    | Getting Started     |
| How to run tests      | Running Tests       |
| What each file does   | Project Structure   |
| How to add a new test | Adding Tests        |
| CI/CD pipeline        | CI/CD Integration   |
| Deep explanation      | FRAMEWORK\_GUIDE.md |

---

## Getting Started

### Prerequisites

| Tool    | Minimum Version | Check with     |
| ------- | --------------- | -------------- |
| Node.js | 18+             | node --version |
| npm     | 8+              | npm --version  |

### 1 — Install

```bash
# Install all packages (Playwright, dotenv, etc.)
npm install

# Install the Chromium browser Playwright needs
npx playwright install --with-deps chromium
```

### 2 — Configure Environment

```bash
# Copy the template to create your local config
cp .env.example .env
```

### 3 — Create Auth Directory

```bash
# This folder stores the saved login session
mkdir -p fixtures/auth
```

### 4 — Run

```bash
npm test
```

That's it. The first run logs in automatically and saves the session, then runs all  tests.

---

## Running Tests

### Run Everything

```bash
npm test
```

### Run With Browser Visible (Watch Mode)

```bash
npm run test:headed
```

### Run a Specific Module

```bash
npm run test:home      # Homepage tests     (TC-001 to TC-029)
npm run test:login     # Login tests        (TC-054 to TC-065)
npm run test:signup    # Sign Up tests      (TC-030 to TC-050)
npm run test:forgot    # Forgot Password    (TC-067 to TC-073)
npm run test:nav       # Navigation         (TC-095 to TC-097)
npm run test:dashboard # Dashboard          (TC-104)
npm run test:discover  # Discover           (TC-107 to TC-133)
npm run test:venues    # Venues             (TC-175 to TC-183)
npm run test:profile   # Profile            (TC-191 to TC-219)
```

### Debug a Failing Test (Step by Step)

```bash
npm run test:debug
```

### Open the HTML Test Report

```bash
npm run report
```

---

## Project Structure

```
beva-e2e/
├── constants/
│   └── index.js                          ← All URLs, credentials, timeouts in one place
├── fixtures/
│   └── auth/
│       └── player.json                   ← Saved login session (auto-created on first run)
├── pages/                                ← Page Object Model layer
│   ├── BasePage.js                       ← Shared helpers all pages inherit
│   ├── HomePage.js                       ← Home page locators + actions
│   ├── LoginPage.js                      ← Login page locators + actions
│   ├── SignUpPage.js                     ← Sign Up page locators + actions
│   ├── ForgotPasswordPage.js             ← Forgot Password locators + actions
│   ├── NavigationPage.js                 ← Sidebar menu locators + actions
│   ├── DiscoverPage.js                   ← Discover page locators + actions
│   ├── VenuesPage.js                     ← Venues page locators + actions
│   └── ProfilePage.js                    ← Profile page locators + actions
├── tests/                                ← Test files (one per module)
│   ├── auth.setup.js                     ← Logs in once, saves session before all tests
│   ├── Homepage.spec.js                  ← TC-001 to TC-029
│   ├── Player_Log_In.spec.js             ← TC-054 to TC-065
│   ├── Player_Sign_Up.spec.js            ← TC-030 to TC-050
│   ├── Player_Forgot_password.spec.js    ← TC-067 to TC-073
│   ├── Menu_Navigation.spec.js           ← TC-095 to TC-097
│   ├── Player_Dashboard.spec.js          ← TC-104
│   ├── Player_Discover.spec.js           ← TC-107 to TC-133
│   ├── Player_Venues.spec.js             ← TC-175 to TC-183
│   └── Player_profile.spec.js            ← TC-191 to TC-219
├── .env                                  ← Your local secrets (NOT committed to Git)
├── .env.example                          ← Template for .env
├── .gitignore                            ← Excludes node_modules, reports, secrets
├── package.json                          ← Scripts + dependencies
├── playwright.config.js                  ← All Playwright settings
├── README.md                             ← This file
└── FRAMEWORK_GUIDE.md                    ← Full deep-dive documentation
```

---

## Test Coverage

| Spec File                        | Test Cases       | Count |
| -------------------------------- | ---------------- | ----- |
| Homepage.spec.js                 | TC-001 to TC-029 | 31    |
| Player\_Sign\_Up.spec.js        | TC-030 to TC-050 | 25    |
| Player\_Log\_In.spec.js         | TC-054 to TC-065 | 13    |
| Player\_Forgot\_password.spec.js| TC-067 to TC-073 | 9     |
| Menu\_Navigation.spec.js        | TC-095 to TC-097 | 4     |
| Player\_Dashboard.spec.js       | TC-104           | 2     |
| Player\_Discover.spec.js        | TC-107 to TC-133 | 17    |
| Player\_Venues.spec.js          | TC-175 to TC-183 | 6     |
| Player\_profile.spec.js         | TC-191 to TC-219 | 21    |
| **Total**                        |                  | **128** |

---

## Adding a New Test

### Step 1 — Add a locator to the right Page Object

Open the relevant file in `pages/`, e.g. `pages/LoginPage.js`, and add your locator in the constructor:

```js
this.myNewButton = page.getByRole('button', { name: 'My Button' });
```

### Step 2 — Add an action method if needed

```js
async clickMyNewButton() {
  await this.clickElement(this.myNewButton);
}
```

### Step 3 — Write the test in the spec file

```js
test('TC-999 Verify my new button works', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.clickMyNewButton();
  await expect(page).toHaveURL(/expected-url/);
});
```

---

## Troubleshooting

| Problem                                             | Solution                                                                  |
| --------------------------------------------------- | ------------------------------------------------------------------------- |
| Cannot find module '../constants'                   | You are running from wrong directory. `cd` into the `beva-e2e` folder first |
| fixtures/auth/player.json not found                 | Run `mkdir -p fixtures/auth` then `npm test` again                        |
| Error: browserType.launch: Executable doesn't exist | Run `npx playwright install --with-deps chromium`                         |
| Login fails                                         | Check `.env` has correct `PLAYER_EMAIL` and `PLAYER_PASSWORD`             |
| Tests time out                                      | Network is slow — increase timeout in `playwright.config.js`              |
| page.pause() blocks the run                         | Removed from all tests. Do not add it back in CI runs                     |

---

## Allure Report (Advanced Test Reporting)

This framework supports **Allure Report** for advanced test analytics similar to TestNG style reporting.

### What Allure Provides

- ✅ Detailed test execution steps
- ✅ Failure screenshots
- ✅ Retry videos
- ✅ Execution timeline
- ✅ Test history & trends
- ✅ Error stack traces
- ✅ Environment details

---

### 1 — Install Allure Dependencies

```bash
npm install -D allure-playwright
npm install -D allure-commandline
```

---

### 2 — Configure Playwright for Allure

Open `playwright.config.js` and update the `reporter` section:

```js
reporter: [
  ['list'],
  ['html'],
  ['allure-playwright']
],
```

---

### 3 — Run Tests

```bash
npm test
```

After execution, a new folder will be created:

```
allure-results/
```

This folder contains raw test execution data (JSON/XML files).

---

### 4 — Generate Allure Report

```bash
npx allure generate ./allure-results --clean
```

This creates a folder:

```
allure-report/
```

---

### 5 — Open Allure Report in Browser

```bash
npx allure open
```

This will launch a local server and open a **rich interactive report** in your browser showing:

- 📊 Passed / Failed test summary
- 📝 Detailed test steps
- 📸 Attached screenshots & videos
- 🔄 Retry information
- 📈 Execution graphs & timeline

---

### 6 — Clean Old Reports (Before Re-running)

```bash
npx rimraf allure-results
```

Install `rimraf` if not already available:

```bash
npm install -D rimraf
```

---

### Quick Reference — Allure Commands

| Action                  | Command                                       |
| ----------------------- | --------------------------------------------- |
| Run tests               | `npm test`                                    |
| Generate report         | `npx allure generate ./allure-results --clean`|
| Open report in browser  | `npx allure open`                             |
| Clean old results       | `npx rimraf allure-results`                   |

---

### Why Allure Over Default HTML Report?

| Feature                  | Playwright HTML Report | Allure Report     |
| ------------------------ | ---------------------- | ----------------- |
| Test steps breakdown     | ❌ Limited             | ✅ Detailed       |
| Screenshots on failure   | ✅ Yes                 | ✅ Yes            |
| Execution timeline       | ❌ No                  | ✅ Yes            |
| Test history & trends    | ❌ No                  | ✅ Yes            |
| CI/CD compatible         | ✅ Basic               | ✅ Enterprise     |
| Manager-friendly visuals | ❌ No                  | ✅ Yes            |
| Categories & tagging     | ❌ No                  | ✅ Yes            |

---

### Add to `.gitignore`

Make sure these folders are excluded from version control:

```
allure-results/
allure-report/
```

---
