import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../hooks/custom-world';

setDefaultTimeout(60 * 1000 * 2);

Given(
  'user search for a {string}',
  async function (this: CustomWorld, book: string) {
    await this.dashboardPage.searchBook(book);
  },
);

When(
  'user add the book to the cart',
  async function (this: CustomWorld) {
    await this.dashboardPage.addBookToCart();
  },
);

Then(
  'the cart badge should get updated',
  async function (this: CustomWorld) {
    const cartCount = await this.dashboardPage.getCartBadgeCount();
    expect(cartCount).toBeTruthy();
    expect(Number(cartCount?.length)).toBeGreaterThan(0);
  },
);
