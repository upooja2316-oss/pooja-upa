import { Page } from '@playwright/test';
import { BasePage } from './page';

export class DashboardPage extends BasePage {
  // Locators
  private readonly userMenuButton =
    '//button[contains(@class,"mat-focus-indicator mat-menu-trigger")]//span[1]';
  private readonly logoutButton = '//button[text()="Logout"]';
  private readonly bookTitle = '.book-title';
  private readonly addToCartButton =
    '.book-card:first-child button[class*="add-to-cart"]';
  private readonly cartIcon =
    'button[aria-label*="shopping"]'; // Update based on actual app
  private readonly cartCount = '#mat-badge-content-0';
  private readonly searchInput = 'input[type="search"]';
  private readonly searchResultOption = 'mat-option[role="option"] span';
  private readonly addBookButton = '//button[@color="primary"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Get logged-in username from dashboard
   */
  async getUserName(): Promise<string | null> {
    return await this.page.locator(this.userMenuButton).textContent();
  }

  /**
   * Click on user menu
   */
  async clickUserMenu() {
    await this.page.locator(this.userMenuButton).click();
  }

  /**
   * Logout from application
   */
  async logout() {
    await this.clickUserMenu();
    await this.page.locator(this.logoutButton).click();
    await this.waitForPageLoad();
  }

  /**
   * Get all book titles on dashboard
   */
  async getBookTitles(): Promise<string[]> {
    const elements = await this.page.locator(this.bookTitle).allTextContents();
    return elements;
  }

  /**
   * Add first book to cart
   */
  async addFirstBookToCart() {
    await this.page.locator(this.addToCartButton).click();
    await this.wait(1000);
  }

  /**
   * Get cart count
   */
  async getCartCount(): Promise<string | null> {
    return await this.page.locator(this.cartCount).textContent();
  }

  /**
   * Click on cart icon
   */
  async clickCartIcon() {
    await this.page.locator(this.cartIcon).click();
    await this.waitForPageLoad();
  }

  /**
   * Check if user is logged in (user menu visible)
   */
  async isUserLoggedIn(): Promise<boolean> {
    try {
      return await this.page.locator(this.userMenuButton).isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Search for a book by name
   */
  async searchBook(bookName: string) {
    await this.page.locator(this.searchInput).type(bookName);
    await this.wait(5000);
    await this.page.locator(this.searchResultOption).click();
  }

  /**
   * Add book to cart
   */
  async addBookToCart() {
    await this.page.locator(this.addBookButton).click();
    await this.wait(1000);
  }

  /**
   * Get cart badge count
   */
  async getCartBadgeCount(): Promise<string | null> {
    return await this.page.locator(this.cartCount).textContent();
  }
}
