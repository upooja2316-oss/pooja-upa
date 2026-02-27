import { Page } from '@playwright/test';
import { BasePage } from './page';

export class LoginPage extends BasePage {
  // Locators
  // toolbar login link (header)
  private readonly loginLink = 'mat-toolbar-row >> button:has-text("Login")';
  private readonly usernameInput = 'input[formcontrolname="username"]';
  private readonly passwordInput = 'input[formcontrolname="password"]';
  // form submit button scoped to card actions
  private readonly loginButton = 'mat-card-actions >> button:has-text("Login")';
  private readonly userMenuButton =
    'span[_ngcontent-ng-c1652302024=""]:has-text("ortoni")';
  private readonly errorMessage = 'mat-error[role="alert"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Click on the Login link in header/navigation
   */
  async clickLoginLink() {
    await this.page.locator(this.loginLink).waitFor({ state: 'visible' });
    await this.page.locator(this.loginLink).click();
  }

 async clickSignIn() {
    await this.page.locator('//span[@id="nav-link-accountList-nav-line-1" and normalize-space(.)="Hello, sign in"]').waitFor({ state: 'visible' });
    await this.page.locator('//span[@id="nav-link-accountList-nav-line-1" and normalize-space(.)="Hello, sign in"]').click();
  }

  /**
   * Enter username in login form
   */
  async enterUsername(username: string) {
    await this.page.locator(this.usernameInput).type(username);
  }

  async enterPhoneNo(phoneNo: string) {
    await this.page.locator('input[aria-label="Enter mobile number or email"]').fill(phoneNo);
  }

  /**
   * Enter password in login form
   */
  async enterPassword(password: string) {
    await this.page.locator(this.passwordInput).type(password);
  }

  /**
   * Click login button
   */
  async clickLoginButton() {
    await this.page.locator(this.loginButton).waitFor({ state: 'visible' });
    await this.waitForPageLoad();
    await this.page.locator(this.loginButton).click();
  }

  /**
   * Get logged-in username from user menu
   */
  async getLoggedInUserName(): Promise<string | null> {
    return await this.page.locator(this.userMenuButton).textContent();
  }

  /**
   * Check if error message is visible
   */
  async isErrorMessageVisible(): Promise<boolean> {
    try {
      await this.page.locator(this.errorMessage).isVisible();
      return true;
    } catch {
      return false;
    }
  }


  

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string | null> {
    return await this.page.locator(this.errorMessage).textContent();
  }

  /**
   * Perform complete login flow
   */
  async login(username: string, password: string) {
    await this.clickLoginLink();
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }
}
