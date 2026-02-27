# Page Object Model Implementation Guide

## Project Structure

```
src/
├── page-objects/          # [DEPRECATED - see src/test/page-objects/]
├── hooks/
│   ├── custom-world.ts    # Shared World context with page instances
│   ├── hooks.ts           # Browser lifecycle hooks (Before/After/BeforeAll/AfterAll)
│   └── pageFixture.ts     # Legacy (still supported for backward compatibility)
├── test/
│   ├── page-objects/      # Page object classes (LoginPage, DashboardPage, etc.)
│   │   ├── page.ts        # Base page class with common methods
│   │   ├── login-page.ts  # LoginPage object (all login interactions)
│   │   ├── dashboard-page.ts  # DashboardPage object (dashboard interactions)
│   │   └── index.ts       # Export all page objects
│   ├── config.ts          # Central env variables configuration
│   ├── features/          # Gherkin feature files
│   └── steps/             # Step definitions (now use CustomWorld context)
└── helper/
    └── init.ts            # Pre-test setup (loads .env)
```

## How It Works

### 1. Custom World Context
The `CustomWorld` class (in `src/hooks/custom-world.ts`) provides shared context across all steps:
- Holds the Playwright `page` instance
- Auto-instantiates `loginPage` and `dashboardPage` objects
- Available in all step definitions via `this` parameter

### 2. Page Object Classes
Each page (LoginPage, DashboardPage) extends `BasePage`:
- Encapsulates all locators for that page
- Provides methods for user interactions
- Handles waits and page-specific logic
- Reusable across multiple scenarios

### 3. Step Definitions
Steps now use the World context instead of direct page access:
```typescript
Given('User navigates to the application', async function (this: CustomWorld) {
  await this.page.goto(env.BASE_URL);
  await this.page.waitForLoadState();
});

Given('User click on the login link', async function (this: CustomWorld) {
  await this.loginPage.clickLoginLink();
});
```

## Adding a New Page Object

### Step 1: Create Page Class
```typescript
// src/test/page-objects/cart-page.ts
import { Page } from '@playwright/test';
import { BasePage } from './page';

export class CartPage extends BasePage {
  private readonly cartItem = '.cart-item';
  private readonly checkoutButton = 'button[id="checkout"]';
  private readonly totalPrice = '.total-price';

  constructor(page: Page) {
    super(page);
  }

  async getCartItems(): Promise<string[]> {
    return await this.page.locator(this.cartItem).allTextContents();
  }

  async getTotalPrice(): Promise<string | null> {
    return await this.page.locator(this.totalPrice).textContent();
  }

  async checkout() {
    await this.page.locator(this.checkoutButton).click();
    await this.waitForPageLoad();
  }
}
```

### Step 2: Update CustomWorld
```typescript
// src/hooks/custom-world.ts
import { CartPage } from '../test/page-objects';

export class CustomWorld extends World {
  public page!: Page;
  public loginPage!: LoginPage;
  public dashboardPage!: DashboardPage;
  public cartPage!: CartPage;  // Add new page

  initializePageObjects() {
    if (this.page) {
      this.loginPage = new LoginPage(this.page);
      this.dashboardPage = new DashboardPage(this.page);
      this.cartPage = new CartPage(this.page);  // Initialize here
    }
  }
}
```

### Step 3: Update index.ts Exports
```typescript
// src/test/page-objects/index.ts
export { BasePage } from './page';
export { LoginPage } from './login-page';
export { DashboardPage } from './dashboard-page';
export { CartPage } from './cart-page';  // Add export
```

### Step 4: Create Step Definitions
```typescript
// src/test/steps/cartSteps.ts
import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../hooks/custom-world';

setDefaultTimeout(60 * 1000 * 2);

When('user proceeds to checkout', async function (this: CustomWorld) {
  await this.cartPage.checkout();
});

Then('user should see total price', async function (this: CustomWorld) {
  const price = await this.cartPage.getTotalPrice();
  expect(price).toBeTruthy();
});
```

## Best Practices

1. **Keep Locators Private**: All locators should be private class properties
2. **One Page = One Class**: Create a page object for each distinct page/screen
3. **Descriptive Method Names**: `clickLoginButton()` is better than `click()`
4. **Centralize Locators**: Don't repeat selectors in multiple methods
5. **Use BasePage Utils**: Leverage `waitForPageLoad()`, `wait()`, `takeScreenshot()`, etc.
6. **Use World Context**: Always access page objects via `this.pageObjectName` in steps
7. **Add Wait States**: Always wait for elements/pages to be visible before interaction

## Environment Variables (.env)

```
BASE_URL=https://bookcart.azurewebsites.net/
DEFAULT_USERNAME=ortoni
DEFAULT_PASSWORD=Pass1234
REPORT_DIR=test-results
HEADLESS=false
```

Use via: `import { env } from '../config';` → `env.BASE_URL`

## Running Tests

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Rerun failed tests
npm run test:failed

# Run with custom env
HEADLESS=true npm test
BASE_URL=https://custom-url.com npm test
```

## Debugging

1. **Pause Browser**: Add `await this.page.pause()` in a step to pause and inspect
2. **Headless Mode**: Set `HEADLESS=false` in `.env` to see browser window
3. **Screenshots**: Auto-captured on failure in `test-results/screenshots/`
4. **Logs**: Check console output for step execution details

## Migration from Old Steps

Old (direct page access):
```typescript
Given('step', async function () {
  await pageFixture.page.locator('selector').click();
});
```

New (page object + world context):
```typescript
Given('step', async function (this: CustomWorld) {
  await this.myPage.clickElement();
});
```

