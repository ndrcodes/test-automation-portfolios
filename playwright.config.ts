import { defineConfig, devices } from '@playwright/test';
import * as dotenv from "dotenv";
dotenv.config({path: '.env'});

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.RETRY ? parseInt(`${process.env.RETRY}`, 10) : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.WORKER ? parseInt(`${process.env.WORKER}`, 10) : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [ 
    ['html', { open: 'never' }], 
    ['json', {  outputFile: './playwright-report/test-results.json' }], 
    ['list'],
    ['playwright-slack-report', { 
      webhookUrl: process.env.SLACK_URL,
      projectName: 'Personal Project',
      triggerBy: process.env.TRIGGERED_BY,
      buildUrl: process.env.BUILD_URL,
      buildNumber: process.env.BUILD_NUMBER,
    }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    headless: process.env.HEADLESS == 'true' ? true : false,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'api',
      use: { 
        ...devices['Desktop Chrome'], 
        channel: 'chrome',
        baseURL: process.env.API_BASE_URL
      },
      testDir: './tests/API'
    },
    {
      name: 'web',
      use: { 
        ...devices['Desktop Chrome'], 
        channel: 'chrome',
        baseURL: process.env.BASE_URL
      },
      testDir: './tests/WEB'
    },
  ],
});
