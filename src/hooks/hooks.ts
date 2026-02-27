import { BeforeAll, AfterAll, Before, After, Status } from '@cucumber/cucumber';
import { Browser, BrowserContext, chromium } from '@playwright/test';
import { pageFixture } from './pageFixture';
import { env } from '../test/config';
import { CustomWorld } from './custom-world';

let browser: Browser;
let context: BrowserContext;

BeforeAll(async () => {
  console.log(
    'Launch Browser using Playwright and Chromium browser, performed once, before the start of all test scenarios.',
  );
  browser = await chromium.launch({ headless: env.HEADLESS });
});

AfterAll(async () => {
  console.log('Closes Browser before the start of each scenario');
  await browser.close();
});

Before(async function (this: CustomWorld) {
  console.log('Launch Browser, performed before each individual test scenario');
  context = await browser.newContext();
  const page = await context.newPage();
  
  // Set page on both pageFixture (for backward compatibility) and world
  pageFixture.page = page;
  this.page = page;
  
  // Initialize page objects in world
  this.initializePageObjects();
});

After(async function (this: CustomWorld, { pickle, result }) {
  console.log('Browser closed after each scenario, and result?.status');
  // screenshot
  if (result?.status == Status.FAILED) {
    await this.page.screenshot({
      path: `./test-results/screenshots/${pickle.name}.png`,
      type: 'png',
    });
  }

  await this.page.close();
  await context.close();
});
