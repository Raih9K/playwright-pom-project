const BasePage = require('./base.page');
const HeaderComponent = require('./components/header.component');
const FooterComponent = require('./components/footer.component');

/**
 * LoginPage class represents the PippAsync Customer Admin login page
 * Contains selectors and methods for user authentication flows
 */
class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Initialize components (may not be present on login page)
    this.header = new HeaderComponent(page);
    this.footer = new FooterComponent(page);
    
    // Page-specific selectors for PippAsync Customer Admin login page
    this.selectors = {
      // Main page elements
      pageTitle: 'h1, .login-title, [data-testid="login-title"]',
      pageSubtitle: '.login-subtitle, .subtitle, p:has-text("Enter your credential")',
      
      // Login form elements
      loginForm: 'form, .login-form, .auth-form, [data-testid="login-form"]',
      emailInput: 'input[type="email"], input[name="email"], input[placeholder*="Email"], #email, input:first-of-type',
      passwordInput: 'input[type="password"], input[name="password"], input[placeholder*="Password"], #password',
      loginButton: 'button[type="submit"], .login-button, button:has-text("Sign In"), .btn-primary',
      
      // Form validation and error messages
      errorMessage: '.error-message, .alert-danger, .text-danger, [role="alert"]',
      fieldError: '.field-error, .invalid-feedback, .error-text',
      emailError: '.email-error, input[type="email"] + .error',
      passwordError: '.password-error, input[type="password"] + .error',
      
      // Additional form elements based on PippAsync page content
      forgotPasswordLink: 'a:has-text("Forgot Password"), .forgot-password, a[href*="forgot"]',
      signUpLink: 'a:has-text("Sign Up"), .signup-link, a[href*="signup"], a[href*="register"]',
      
      // Divider and alternative login options
      orDivider: '.divider, .or-divider, :has-text("or")',
      
      // Success/redirect elements
      successMessage: '.success-message, .alert-success, .text-success',
      welcomeMessage: '.welcome-message, .greeting',
      
      // Loading states
      loadingSpinner: '.spinner, .loading, .loader, [data-loading="true"]',
      
      // Page structure elements
      loginContainer: '.login-container, .auth-container, .signin-container',
      formContainer: '.form-container, .login-form-container'
    };
  }

  /**
   * Navigate to the login page
   */
  async navigateToLogin() {
    await this.navigateTo('/login');
    await this.waitForPageLoad();
  }

  /**
   * Verify that the login page is loaded correctly
   * @returns {Promise<boolean>} True if login page is loaded
   */
  async isLoginPageLoaded() {
    try {
      await this.waitForElement(this.selectors.loginForm);
      return await this.isElementVisible(this.selectors.loginButton);
    } catch (error) {
      console.error('Login page failed to load:', error.message);
      return false;
    }
  }

  /**
   * Fill email field
   * @param {string} email - Email to enter
   */
  async fillEmail(email) {
    await this.waitForElement(this.selectors.emailInput);
    await this.page.locator(this.selectors.emailInput).clear();
    await this.page.locator(this.selectors.emailInput).fill(email);
  }

  /**
   * Fill username field (alias for fillEmail for backward compatibility)
   * @param {string} username - Username/Email to enter
   */
  async fillUsername(username) {
    await this.fillEmail(username);
  }

  /**
   * Fill password field
   * @param {string} password - Password to enter
   */
  async fillPassword(password) {
    await this.waitForElement(this.selectors.passwordInput);
    await this.page.locator(this.selectors.passwordInput).clear();
    await this.page.locator(this.selectors.passwordInput).fill(password);
  }

  /**
   * Click the login button
   */
  async clickLoginButton() {
    await this.waitForElement(this.selectors.loginButton);
    await this.page.locator(this.selectors.loginButton).click();
  }

  /**
   * Perform complete login with credentials
   * @param {string} username - Username
   * @param {string} password - Password
   * @param {boolean} rememberMe - Whether to check remember me option
   */
  async login(username, password, rememberMe = false) {
    await this.fillUsername(username);
    await this.fillPassword(password);
    
    if (rememberMe) {
      await this.checkRememberMe();
    }
    
    await this.clickLoginButton();
    
    // Wait for either success or error
    try {
      await Promise.race([
        this.page.waitForSelector(this.selectors.successMessage, { timeout: 5000 }),
        this.page.waitForSelector(this.selectors.errorMessage, { timeout: 5000 }),
        this.page.waitForURL('**/dashboard', { timeout: 5000 }), // Common redirect after login
        this.page.waitForURL('**/home', { timeout: 5000 })
      ]);
    } catch {
      // Continue regardless of what happens after login attempt
    }
  }

  /**
   * Check or uncheck the remember me checkbox
   * @param {boolean} check - True to check, false to uncheck
   */
  async checkRememberMe(check = true) {
    if (await this.isElementVisible(this.selectors.rememberMeCheckbox)) {
      const checkbox = this.page.locator(this.selectors.rememberMeCheckbox);
      const isChecked = await checkbox.isChecked();
      
      if (check && !isChecked) {
        await checkbox.check();
      } else if (!check && isChecked) {
        await checkbox.uncheck();
      }
    }
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword() {
    await this.waitForElement(this.selectors.forgotPasswordLink);
    await this.page.locator(this.selectors.forgotPasswordLink).click();
  }

  /**
   * Click sign up link
   */
  async clickSignUpLink() {
    if (await this.isElementVisible(this.selectors.signUpLink)) {
      await this.page.locator(this.selectors.signUpLink).click();
    }
  }

  /**
   * Get error message text
   * @returns {Promise<string|null>} Error message text or null if no error
   */
  async getErrorMessage() {
    if (await this.isElementVisible(this.selectors.errorMessage)) {
      return await this.page.locator(this.selectors.errorMessage).textContent();
    }
    return null;
  }

  /**
   * Get field-specific error message
   * @param {string} field - Field name (email, username, password)
   * @returns {Promise<string|null>} Field error message or null
   */
  async getFieldError(field) {
    const errorSelector = (field === 'username' || field === 'email') ? 
      this.selectors.emailError : 
      this.selectors.passwordError;
    
    if (await this.isElementVisible(errorSelector)) {
      return await this.page.locator(errorSelector).textContent();
    }
    return null;
  }

  /**
   * Get success message text
   * @returns {Promise<string|null>} Success message text or null
   */
  async getSuccessMessage() {
    if (await this.isElementVisible(this.selectors.successMessage)) {
      return await this.page.locator(this.selectors.successMessage).textContent();
    }
    return null;
  }

  /**
   * Check if login form is in loading state
   * @returns {Promise<boolean>} True if loading
   */
  async isLoading() {
    return await this.isElementVisible(this.selectors.loadingSpinner);
  }

  /**
   * Wait for login to complete (success or error)
   * @param {number} timeout - Timeout in milliseconds
   */
  async waitForLoginResult(timeout = 10000) {
    try {
      await Promise.race([
        this.page.waitForSelector(this.selectors.successMessage, { timeout }),
        this.page.waitForSelector(this.selectors.errorMessage, { timeout }),
        this.page.waitForURL('**/dashboard', { timeout }),
        this.page.waitForURL('**/home', { timeout })
      ]);
    } catch (error) {
      throw new Error(`Login result not received within ${timeout}ms: ${error.message}`);
    }
  }

  /**
   * Verify login was successful by checking for redirect or success indicators
   * @returns {Promise<boolean>} True if login appears successful
   */
  async isLoginSuccessful() {
    // Check for common success indicators
    const currentUrl = this.getCurrentUrl();
    
    // Check if redirected to dashboard or home
    if (currentUrl.includes('/dashboard') || currentUrl.includes('/home')) {
      return true;
    }
    
    // Check for success message
    if (await this.isElementVisible(this.selectors.successMessage)) {
      return true;
    }
    
    // Check if login form is no longer visible (successful redirect)
    if (!(await this.isElementVisible(this.selectors.loginForm))) {
      return true;
    }
    
    return false;
  }

  /**
   * Clear all form fields
   */
  async clearForm() {
    await this.page.locator(this.selectors.emailInput).clear();
    await this.page.locator(this.selectors.passwordInput).clear();
    
    // Uncheck remember me if checked
    if (await this.isElementVisible(this.selectors.rememberMeCheckbox)) {
      const checkbox = this.page.locator(this.selectors.rememberMeCheckbox);
      if (await checkbox.isChecked()) {
        await checkbox.uncheck();
      }
    }
  }

  /**
   * Get login page title
   * @returns {Promise<string>} Page title text
   */
  async getLoginTitle() {
    if (await this.isElementVisible(this.selectors.pageTitle)) {
      return await this.page.locator(this.selectors.pageTitle).textContent();
    }
    return await this.getPageTitle();
  }

  /**
   * Perform social login (Google)
   */
  async loginWithGoogle() {
    if (await this.isElementVisible(this.selectors.googleLoginButton)) {
      await this.page.locator(this.selectors.googleLoginButton).click();
    } else {
      throw new Error('Google login button not available');
    }
  }

  /**
   * Perform social login (Facebook)
   */
  async loginWithFacebook() {
    if (await this.isElementVisible(this.selectors.facebookLoginButton)) {
      await this.page.locator(this.selectors.facebookLoginButton).click();
    } else {
      throw new Error('Facebook login button not available');
    }
  }
}

module.exports = LoginPage;