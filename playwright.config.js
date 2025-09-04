// playwright.config.js
const { devices } = require('@playwright/test');

const config = {
  testDir: './tests',
  timeout: 30 * 1000,
  use: {
    browserName: 'chromium',
    launchOptions: {
      executablePath: '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser', // Adjust if needed
      args: [
        '--user-data-dir=/Users/test/Library/Application Support/BraveSoftware/Brave-Browser/Default', // Reuse your Brave profile
      ],
    },
    headless: false, // Show browser window
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: 'on-first-retry',
  },
  projects: [
    {
      name: 'brave',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
};

module.exports = config;