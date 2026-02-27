import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { Page } from '@playwright/test';
import { LoginPage, DashboardPage } from '../test/page-objects';

/**
 * Custom World class that provides shared context across all step definitions.
 * Automatically instantiates page objects based on the current page instance.
 */
export class CustomWorld extends World {
  public page!: Page;
  public loginPage!: LoginPage;
  public dashboardPage!: DashboardPage;

  constructor(options: IWorldOptions) {
    super(options);
  }

  /**
   * Initialize page objects after page is set
   */
  initializePageObjects() {
    if (this.page) {
      
      this.loginPage = new LoginPage(this.page);
      this.dashboardPage = new DashboardPage(this.page);
    }
  }
}

// Set the world parameter type for Cucumber
setWorldConstructor(CustomWorld);
