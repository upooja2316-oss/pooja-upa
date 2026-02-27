import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { env } from '../config';
import { CustomWorld } from '../../hooks/custom-world';

setDefaultTimeout(60 * 1000 * 2);

Given(
  'User navigates to the application',
  async function (this: CustomWorld) {
    await this.page.goto(env.BASE_URL);
    await this.page.waitForLoadState();
  },
);

Given(
  'User click on the login link',
  async function (this: CustomWorld) {
    await this.loginPage.clickLoginLink();  
  },
);

Given(
  'User enter the username as {string}',
  async function (this: CustomWorld, username: string) {
    await this.loginPage.enterUsername(username);
  },
);

Given(
  'User enter the phone no. {string}',
  async function (this: CustomWorld, phoneNo: string) {
    await this.loginPage.enterUsername(phoneNo);
  },
);

//<input type="email" id="ap_email_login" autocomplete="username" name="email" class="a-input-text" data-tab-layout-weblab-treatment="" aria-label="Enter mobile number or email">

Given(
  'User enter the password as {string}',
  async function (this: CustomWorld, password: string) {
    await this.loginPage.enterPassword(password);
  },
);

Given(
  'User click on the login button',
  async function (this: CustomWorld) {
    await this.loginPage.clickLoginButton();
  },
);

Given(
  'Login should be success',
  async function (this: CustomWorld) {
    const username = await this.loginPage.getLoggedInUserName();
    console.log('Logged in as: ' + username);
    await this.loginPage.waitForPageLoad();
    expect(username).toBeTruthy();
  },
);

Given(
  'Login should fail',
  async function (this: CustomWorld) {
    const isErrorVisible = await this.loginPage.isErrorMessageVisible();
    expect(isErrorVisible).toBe(true);
  },
);

Given('User enter the phone no. {string}', (s: string) => {
  // Write code here that turns the phrase above into concrete actions
})
