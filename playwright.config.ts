import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:5173',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for Android Chrome testing */
  projects: [
    {
      name: 'android-chrome-samsung-a26',
      use: {
        ...devices['Galaxy S9+'], // Close to Samsung A26 specs
        viewport: { width: 360, height: 640 }, // Samsung A26 specific viewport
        userAgent: 'Mozilla/5.0 (Linux; Android 12; SM-A265F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        hasTouch: true,
        isMobile: true,
        deviceScaleFactor: 2.5, // Typical for mid-range Android phones
      },
    },
    {
      name: 'android-chrome-pixel',
      use: { 
        ...devices['Pixel 5'],
        hasTouch: true,
        isMobile: true,
        // Keep default Pixel 5 settings as baseline Android Chrome
      },
    },
    {
      name: 'android-chrome-galaxy-s21',
      use: { 
        ...devices['Galaxy S21'],
        hasTouch: true,
        isMobile: true,
        // Higher-end Android device for comparison
      },
    },
    {
      name: 'desktop-chrome-dev', 
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 360, height: 640 }, // Mobile viewport on desktop for development
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});

