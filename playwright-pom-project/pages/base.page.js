/**
 * BasePage class provides common functionality for all page objects
 * This class should be extended by all page object classes
 */
class BasePage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Wait for page to load completely
   * @param {number} timeout - Optional timeout in milliseconds
   */
  async waitForPageLoad(timeout = 30000) {
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Take a screenshot of the current page
   * @param {string} name - Name for the screenshot file
   */
  async takeScreenshot(name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}-${timestamp}.png`,
      fullPage: true 
    });
  }

  /**
   * Navigate to a specific URL
   * @param {string} url - URL to navigate to
   */
  async navigateTo(url) {
    await this.page.goto(url);
    await this.waitForPageLoad();
  }

  /**
   * Get the current page title
   * @returns {Promise<string>} Page title
   */
  async getPageTitle() {
    return await this.page.title();
  }

  /**
   * Get the current page URL
   * @returns {string} Current URL
   */
  getCurrentUrl() {
    return this.page.url();
  }

  /**
   * Wait for an element to be visible
   * @param {string} selector - Element selector
   * @param {number} timeout - Optional timeout in milliseconds
   */
  async waitForElement(selector, timeout = 10000) {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  /**
   * Check if an element is visible
   * @param {string} selector - Element selector
   * @returns {Promise<boolean>} True if element is visible
   */
  async isElementVisible(selector) {
    try {
      await this.page.waitForSelector(selector, { state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Scroll to an element
   * @param {string} selector - Element selector
   */
  async scrollToElement(selector) {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  /**
   * Wait for a specific amount of time
   * @param {number} milliseconds - Time to wait in milliseconds
   */
  async wait(milliseconds) {
    await this.page.waitForTimeout(milliseconds);
  }
}

module.exports = BasePage;