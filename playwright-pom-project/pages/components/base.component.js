/**
 * BaseComponent class provides common functionality for all component objects
 * This class should be extended by all component classes
 */
class BaseComponent {
  constructor(page, rootSelector = null) {
    this.page = page;
    this.rootSelector = rootSelector;
  }

  /**
   * Get the root element of the component
   * @returns {Locator} Root element locator
   */
  get root() {
    return this.rootSelector ? this.page.locator(this.rootSelector) : this.page;
  }

  /**
   * Find an element within the component
   * @param {string} selector - Element selector relative to component root
   * @returns {Locator} Element locator
   */
  locator(selector) {
    return this.root.locator(selector);
  }

  /**
   * Check if the component is visible
   * @returns {Promise<boolean>} True if component is visible
   */
  async isVisible() {
    if (!this.rootSelector) return true;
    try {
      await this.root.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait for the component to be visible
   * @param {number} timeout - Optional timeout in milliseconds
   */
  async waitForVisible(timeout = 10000) {
    if (this.rootSelector) {
      await this.root.waitFor({ state: 'visible', timeout });
    }
  }

  /**
   * Click an element within the component
   * @param {string} selector - Element selector relative to component root
   */
  async click(selector) {
    await this.locator(selector).click();
  }

  /**
   * Fill text in an input within the component
   * @param {string} selector - Input selector relative to component root
   * @param {string} text - Text to fill
   */
  async fill(selector, text) {
    await this.locator(selector).fill(text);
  }

  /**
   * Get text content of an element within the component
   * @param {string} selector - Element selector relative to component root
   * @returns {Promise<string>} Text content
   */
  async getText(selector) {
    return await this.locator(selector).textContent();
  }

  /**
   * Check if an element within the component is visible
   * @param {string} selector - Element selector relative to component root
   * @returns {Promise<boolean>} True if element is visible
   */
  async isElementVisible(selector) {
    try {
      await this.locator(selector).waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = BaseComponent;