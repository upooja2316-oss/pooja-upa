import { Page, Locator } from '@playwright/test';

/**
 * Base Page class for all page objects.
 * Provides common methods and Playwright page reference.
 */
export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a URL
   */
  async goto(url: string) {
    await this.page.goto(url);
  }

  /**
   * Common wait for load state
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState();
  }

  /**
   * Wait for a specific timeout
   */
  async wait(timeout: number) {
    await this.page.waitForTimeout(timeout);
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({
      path: `./test-results/screenshots/${name}.png`,
      type: 'png',
    });
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get page URL
   */
  getUrl(): string {
    return this.page.url();
  }

  /**
   * Pause for debugging
   */
  async pause() {
    await this.page.pause();
  }
}
