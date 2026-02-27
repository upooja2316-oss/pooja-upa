# Copilot Instructions for Playwright Cucumber BDD TypeScript

## Project Overview
This is a Playwright + Cucumber BDD testing framework for the BookCart web application. Tests are written in Gherkin language (`.feature` files) and executed via TypeScript step definitions. The framework uses a Page Fixture pattern for Playwright page object management and Cucumber hooks for browser lifecycle control.

## Architecture

### Core Components
- **Features** (`src/test/features/*.feature`): Gherkin scenario definitions using BDD syntax
- **Step Definitions** (`src/test/steps/*Steps.ts`): TypeScript implementations of Gherkin steps
- **Hooks** (`src/hooks/hooks.ts`, `pageFixture.ts`): Browser lifecycle management (BeforeAll/AfterAll/Before/After)
- **Helpers** (`src/helper/init.ts`, `report.ts`): Pre-test setup and HTML report generation

### Test Execution Flow
1. Pre-test: `pretest` script clears `test-results/` directory
2. Main: `test` script runs `cucumber-js test` which executes `.feature` files
3. Post-test: `posttest` script generates HTML report via `multiple-cucumber-html-reporter`
4. Failed tests: `test:failed` reruns scenarios from `@rerun.txt`

## Critical Patterns & Conventions

### Page Fixture Pattern (Shared Context)
All steps access Playwright page via global `pageFixture.page`:
```typescript
import { pageFixture } from '../../hooks/pageFixture';
await pageFixture.page.goto('https://bookcart.azurewebsites.net/');
await pageFixture.page.locator('input[formcontrolname="username"]').type(username);
```
**Do not create new page objects in step files** - always use `pageFixture.page`.

### Locator Strategies
Project uses mixed locators. Prefer:
1. Form control names: `input[formcontrolname="password"]`
2. XPath for text-based: `//span[text()="Login"]` or `//button[@color="primary"]`
3. ID selectors: `#mat-badge-content-0`

Avoid brittle class-based selectors due to Angular Material dynamic classes.

### Step Definition Structure
- **Given**: Navigation, login, setup (e.g., `Given User navigates to the application`)
- **When**: User actions (e.g., `When User click on the login button`)
- **Then**: Assertions using `expect()` from `@playwright/test` (e.g., `expect(Number(countInCart?.length)).toBeGreaterThan(0)`)
- **Parameterization**: Use `{string}` for single values, `Examples:` tables for data-driven tests

### Timeout Configuration
All step files set `setDefaultTimeout(60 * 1000 * 2)` (120 seconds) globally. Add explicit waits for dynamic content:
```typescript
await pageFixture.page.waitForLoadState();
await pageFixture.page.waitForTimeout(5000);
```

### Screenshot on Failure
Hooks automatically capture screenshots for failed tests in `test-results/screenshots/` based on `pickle.name` (scenario name).

## Adding New Tests

1. **Create feature file** (`src/test/features/myFeature.feature`):
   ```gherkin
   Feature: Description
     @smoke
     Scenario: Name
       Given User navigates to the application
       When user performs action "<param>"
       Then user should see result
       
       Examples:
         | param |
         | value |
   ```

2. **Implement steps** (`src/test/steps/mySteps.ts`):
   ```typescript
   import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
   import { expect } from '@playwright/test';
   import { pageFixture } from '../../hooks/pageFixture';
   
   setDefaultTimeout(60 * 1000 * 2);
   
   When('user performs action {string}', async function (action) {
     await pageFixture.page.locator('selector').fill(action);
   });
   ```

3. **Run tests**: `npm test` — rerun failed: `npm run test:failed`

## Developer Workflows

### Build & Test
```bash
npm run lint:check          # ESLint validation (no warnings allowed)
npm run lint:fix           # Fix ESLint issues
npm run prettier           # Format code
npm test                   # Full test suite with report
npm run test:failed        # Rerun failures from @rerun.txt
```

### Debugging
- Enable headless mode in [hooks.ts](src/hooks/hooks.ts#L10) (currently `headless: false`)
- Add `await pageFixture.page.pause()` in steps for browser debugging
- Check [test-results/cucumber-report.html](test-results/cucumber-report.html) after test run
- Verify selectors via browser DevTools

## Project-Specific Conventions

- **Tags**: Use `@smoke` for critical tests, `@test` for others
- **File naming**: Feature files camelCase (`addBookToCart.feature`), step files match feature names
- **Assertions**: Always use `@playwright/test` `expect()` for consistency
- **No async/await issues**: All Cucumber steps are async; always `await` page operations
- **Report generation**: Runs automatically; metadata configured in [report.ts](src/helper/report.ts)

## Key Dependencies
- `@playwright/test`: Browser automation & assertions
- `@cucumber/cucumber`: Gherkin parser & test runner
- `multiple-cucumber-html-reporter`: HTML report generation
- `ts-node`: TypeScript execution
- `eslint + typescript-eslint`: Linting

## Config Files
- [tsconfig.json](tsconfig.json): ES2020 target, strict mode enabled
- [eslint.config.mjs](eslint.config.mjs): ESLint flat config with TypeScript + React
- `.prettierrc.json`: Single quotes enabled

## External Dependency
- **Test Target**: BookCart app at `https://bookcart.azurewebsites.net/`
- **Authentication**: Test credentials in `.feature` files (adjust as needed)
