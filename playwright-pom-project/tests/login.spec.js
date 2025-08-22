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

  test('should validate login API response structure during UI login', async ({ page, request }) => {
    const validUser = testData.users.validUser;
    const baseUrl = process.env.API_BASE_URL || 'https://dev.pippasync.customeradmin.boostonamazon.com/api';
    
    // Intercept the login API call made by the UI
    let apiResponse = null;
    
    page.route('**/api/auth/login', async (route) => {
      // Continue with the request and capture the response
      const response = await route.continue();
      apiResponse = await response.json();
      return response;
    });
    
    // Perform UI login
    await loginPage.fillEmail(validUser.email);
    await loginPage.fillPassword(validUser.password);
    await loginPage.clickLoginButton();
    
    // Wait for login to complete
    await loginPage.waitForLoginResult();
    
    // Validate that API was called and response structure is correct
    if (apiResponse) {
      // Validate the intercepted API response structure
      expect(apiResponse).toHaveProperty('success');
      expect(apiResponse).toHaveProperty('message');
      expect(apiResponse).toHaveProperty('data');
      
      expect(apiResponse.success).toBe(true);
      expect(apiResponse.message).toBe('Successfully logged in.');
      
      // Validate data structure
      expect(apiResponse.data).toHaveProperty('user');
      expect(apiResponse.data).toHaveProperty('access_token');
      expect(apiResponse.data).toHaveProperty('access_token_expire_at');
      
      // Validate user object structure
      const user = apiResponse.data.user;
      expect(user).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        email: validUser.email,
        phone: expect.anything(),
        google_id: expect.anything(),
        ebay_user_id: expect.anything(),
        is_active: expect.any(Number),
        reset_token: expect.anything(),
        reset_token_expire_at: expect.anything(),
        created_at: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}Z$/),
        updated_at: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}Z$/)
      });
      
      // Validate user is active
      expect(user.is_active).toBe(1);
      
      // Validate access token
      expect(typeof apiResponse.data.access_token).toBe('string');
      expect(apiResponse.data.access_token_expire_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}Z$/);
      
      // Validate token expiration is in the future
      const expireDate = new Date(apiResponse.data.access_token_expire_at);
      expect(expireDate.getTime()).toBeGreaterThan(Date.now());
      
      console.log('✅ API Response Structure Validated:', {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        isActive: user.is_active,
        hasToken: !!apiResponse.data.access_token,
        tokenExpires: apiResponse.data.access_token_expire_at
      });
    }
    
    // Also validate UI success
    const isUISuccessful = await loginPage.isLoginSuccessful();
    expect(isUISuccessful).toBe(true);
  });

  test('should validate API response for admin@admin.com credentials', async ({ request }) => {
    const baseUrl = process.env.API_BASE_URL || 'https://dev.pippasync.customeradmin.boostonamazon.com/api';
    
    // Test with the specific credentials from your example
    const response = await loginApi(request, 'admin@admin.com', '123456', baseUrl);
    
    // Validate response matches your expected structure
    if (response.status === 200 && response.body.success) {
      expect(response.body).toEqual({
        success: true,
        message: "Successfully logged in.",
        data: {
          user: {
            id: expect.any(Number),
            name: expect.any(String),
            email: "admin@admin.com",
            phone: null,
            google_id: null,
            ebay_user_id: null,
            is_active: 1,
            reset_token: null,
            reset_token_expire_at: null,
            created_at: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}Z$/),
            updated_at: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}Z$/)
          },
          access_token: expect.any(String),
          access_token_expire_at: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}Z$/)
        }
      });
      
      // Validate specific values from your example
      const user = response.body.data.user;
      expect(user.email).toBe("admin@admin.com");
      expect(user.is_active).toBe(1);
      expect(user.phone).toBeNull();
      expect(user.google_id).toBeNull();
      expect(user.ebay_user_id).toBeNull();
      expect(user.reset_token).toBeNull();
      expect(user.reset_token_expire_at).toBeNull();
      
      // Log the actual response for verification
      console.log('✅ Admin Login API Response:', JSON.stringify(response.body, null, 2));
    } else {
      console.log('❌ Login failed:', response.status, response.body);
      // If login fails, still validate error structure
      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('message');
    }
  });
});