const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/login.page');
const { getUserCredentials, getTestData } = require('../utils/userCredentials');
const { loginApi, assertLoginResponse } = require('../utils/apiHelpers');
const testData = require('../data.json');

test.describe('PippAsync Customer Admin - Login Tests', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
  });

  test('should display login page correctly', async () => {
    // Verify login page is loaded
    expect(await loginPage.isLoginPageLoaded()).toBe(true);
    
    // Verify page title contains expected text
    const pageTitle = await loginPage.getPageTitle();
    expect(pageTitle).toContain('Sign In');
    
    // Verify form elements are visible
    expect(await loginPage.isElementVisible(loginPage.selectors.emailInput)).toBe(true);
    expect(await loginPage.isElementVisible(loginPage.selectors.passwordInput)).toBe(true);
    expect(await loginPage.isElementVisible(loginPage.selectors.loginButton)).toBe(true);
    expect(await loginPage.isElementVisible(loginPage.selectors.forgotPasswordLink)).toBe(true);
    expect(await loginPage.isElementVisible(loginPage.selectors.signUpLink)).toBe(true);
  });

  test('should login with valid credentials', async () => {
    const validUser = testData.users.validUser;
    
    // Fill login form
    await loginPage.fillEmail(validUser.email);
    await loginPage.fillPassword(validUser.password);
    
    // Submit login
    await loginPage.clickLoginButton();
    
    // Wait for login result
    await loginPage.waitForLoginResult();
    
    // Verify successful login (check for redirect or success indicators)
    const isSuccessful = await loginPage.isLoginSuccessful();
    expect(isSuccessful).toBe(true);
  });

  test('should show error for invalid credentials', async () => {
    const invalidUser = testData.users.invalidUser;
    
    // Attempt login with invalid credentials
    await loginPage.login(invalidUser.email, invalidUser.password);
    
    // Verify error message is displayed
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.toLowerCase()).toContain('invalid');
  });

  test('should show validation errors for empty fields', async () => {
    // Try to submit empty form
    await loginPage.clickLoginButton();
    
    // Wait a moment for validation to trigger
    await loginPage.wait(1000);
    
    // Check for validation errors (either field-specific or general)
    const emailError = await loginPage.getFieldError('email');
    const passwordError = await loginPage.getFieldError('password');
    const generalError = await loginPage.getErrorMessage();
    
    // At least one error should be present
    expect(emailError || passwordError || generalError).toBeTruthy();
  });

  test('should show error for invalid email format', async () => {
    const invalidEmailUser = testData.users.invalidEmailFormat;
    
    // Fill form with invalid email format
    await loginPage.fillEmail(invalidEmailUser.email);
    await loginPage.fillPassword(invalidEmailUser.password);
    await loginPage.clickLoginButton();
    
    // Wait for validation
    await loginPage.wait(1000);
    
    // Check for email validation error
    const emailError = await loginPage.getFieldError('email');
    const generalError = await loginPage.getErrorMessage();
    
    expect(emailError || generalError).toBeTruthy();
  });

  test('should navigate to forgot password page', async () => {
    // Click forgot password link
    await loginPage.clickForgotPassword();
    
    // Verify navigation (URL should change or new page should load)
    const currentUrl = loginPage.getCurrentUrl();
    expect(currentUrl).toContain('forgot');
  });

  test('should navigate to sign up page', async () => {
    // Click sign up link
    await loginPage.clickSignUpLink();
    
    // Verify navigation (URL should change or new page should load)
    const currentUrl = loginPage.getCurrentUrl();
    expect(currentUrl).toContain('signup') || expect(currentUrl).toContain('register');
  });

  test('should clear form fields', async () => {
    const testUser = testData.users.testUser;
    
    // Fill form
    await loginPage.fillEmail(testUser.email);
    await loginPage.fillPassword(testUser.password);
    
    // Clear form
    await loginPage.clearForm();
    
    // Verify fields are empty
    const emailValue = await loginPage.page.locator(loginPage.selectors.emailInput).inputValue();
    const passwordValue = await loginPage.page.locator(loginPage.selectors.passwordInput).inputValue();
    
    expect(emailValue).toBe('');
    expect(passwordValue).toBe('');
  });

  test('should handle login with test user credentials', async () => {
    const testUser = testData.users.testUser;
    
    // Perform complete login
    await loginPage.login(testUser.email, testUser.password);
    
    // Wait for result
    await loginPage.waitForLoginResult();
    
    // Check if login was successful or if there's an error
    const isSuccessful = await loginPage.isLoginSuccessful();
    const errorMessage = await loginPage.getErrorMessage();
    
    // Log result for debugging
    console.log(`Login attempt result: Success=${isSuccessful}, Error=${errorMessage}`);
    
    // Either should be successful or show a specific error
    expect(isSuccessful || errorMessage).toBeTruthy();
  });

  test('should verify page elements and content', async () => {
    // Check for page subtitle/description
    const hasSubtitle = await loginPage.isElementVisible(loginPage.selectors.pageSubtitle);
    if (hasSubtitle) {
      const subtitleText = await loginPage.page.locator(loginPage.selectors.pageSubtitle).textContent();
      expect(subtitleText).toContain('credential');
    }
    
    // Check for "or" divider
    const hasOrDivider = await loginPage.isElementVisible(loginPage.selectors.orDivider);
    expect(hasOrDivider).toBe(true);
    
    // Verify form container is present
    const hasFormContainer = await loginPage.isElementVisible(loginPage.selectors.loginForm);
    expect(hasFormContainer).toBe(true);
  });

  test('should handle loading states', async () => {
    const validUser = testData.users.validUser;
    
    // Fill and submit form
    await loginPage.fillEmail(validUser.email);
    await loginPage.fillPassword(validUser.password);
    await loginPage.clickLoginButton();
    
    // Check if loading state appears (might be very brief)
    const isLoading = await loginPage.isLoading();
    
    // Wait for login to complete
    await loginPage.waitForLoginResult();
    
    // Loading should be finished
    const isStillLoading = await loginPage.isLoading();
    expect(isStillLoading).toBe(false);
  });
});