const BasePage = require('./base.page');
const HeaderComponent = require('./components/header.component');
const FooterComponent = require('./components/footer.component');

/**
 * HomePage class represents the home/landing page of the application
 * Contains selectors and methods for interacting with home page elements
 */
class HomePage extends BasePage {
  constructor(page) {
    super(page);
    
    // Initialize components
    this.header = new HeaderComponent(page);
    this.footer = new FooterComponent(page);
    
    // Page-specific selectors
    this.selectors = {
      // Hero section
      heroSection: '[data-testid="hero-section"]',
      heroTitle: '[data-testid="hero-title"]',
      heroSubtitle: '[data-testid="hero-subtitle"]',
      heroCtaButton: '[data-testid="hero-cta-button"]',
      
      // Features section
      featuresSection: '[data-testid="features-section"]',
      featureCards: '[data-testid="feature-card"]',
      featureTitle: '[data-testid="feature-title"]',
      featureDescription: '[data-testid="feature-description"]',
      
      // Welcome message
      welcomeMessage: '[data-testid="welcome-message"]',
      
      // Navigation elements
      mainNavigation: '[data-testid="main-navigation"]',
      
      // Content sections
      aboutSection: '[data-testid="about-section"]',
      servicesSection: '[data-testid="services-section"]',
      
      // Call-to-action elements
      ctaSection: '[data-testid="cta-section"]',
      primaryCtaButton: '[data-testid="primary-cta"]',
      secondaryCtaButton: '[data-testid="secondary-cta"]'
    };
  }

  /**
   * Navigate to the home page
   */
  async navigateToHome() {
    await this.navigateTo('/');
    await this.waitForPageLoad();
  }

  /**
   * Verify that the home page is loaded correctly
   * @returns {Promise<boolean>} True if home page is loaded
   */
  async isHomePageLoaded() {
    try {
      await this.waitForElement(this.selectors.heroSection);
      return await this.isElementVisible(this.selectors.heroTitle);
    } catch (error) {
      console.error('Home page failed to load:', error.message);
      return false;
    }
  }

  /**
   * Get the hero section title text
   * @returns {Promise<string>} Hero title text
   */
  async getHeroTitle() {
    await this.waitForElement(this.selectors.heroTitle);
    return await this.page.locator(this.selectors.heroTitle).textContent();
  }

  /**
   * Get the hero section subtitle text
   * @returns {Promise<string>} Hero subtitle text
   */
  async getHeroSubtitle() {
    await this.waitForElement(this.selectors.heroSubtitle);
    return await this.page.locator(this.selectors.heroSubtitle).textContent();
  }

  /**
   * Click the hero CTA button
   */
  async clickHeroCta() {
    await this.waitForElement(this.selectors.heroCtaButton);
    await this.page.locator(this.selectors.heroCtaButton).click();
  }

  /**
   * Get all feature cards information
   * @returns {Promise<Array>} Array of feature card objects
   */
  async getFeatureCards() {
    await this.waitForElement(this.selectors.featuresSection);
    const cards = await this.page.locator(this.selectors.featureCards).all();
    
    const features = [];
    for (const card of cards) {
      const title = await card.locator(this.selectors.featureTitle).textContent();
      const description = await card.locator(this.selectors.featureDescription).textContent();
      features.push({ title: title?.trim(), description: description?.trim() });
    }
    
    return features;
  }

  /**
   * Check if features section is visible
   * @returns {Promise<boolean>} True if features section is visible
   */
  async isFeaturesVisible() {
    return await this.isElementVisible(this.selectors.featuresSection);
  }

  /**
   * Click primary CTA button
   */
  async clickPrimaryCta() {
    await this.scrollToElement(this.selectors.primaryCtaButton);
    await this.waitForElement(this.selectors.primaryCtaButton);
    await this.page.locator(this.selectors.primaryCtaButton).click();
  }

  /**
   * Click secondary CTA button
   */
  async clickSecondaryCta() {
    await this.scrollToElement(this.selectors.secondaryCtaButton);
    await this.waitForElement(this.selectors.secondaryCtaButton);
    await this.page.locator(this.selectors.secondaryCtaButton).click();
  }

  /**
   * Get welcome message text
   * @returns {Promise<string>} Welcome message text
   */
  async getWelcomeMessage() {
    if (await this.isElementVisible(this.selectors.welcomeMessage)) {
      return await this.page.locator(this.selectors.welcomeMessage).textContent();
    }
    return null;
  }

  /**
   * Verify all main sections are present
   * @returns {Promise<Object>} Object with visibility status of each section
   */
  async verifyMainSections() {
    return {
      hero: await this.isElementVisible(this.selectors.heroSection),
      features: await this.isElementVisible(this.selectors.featuresSection),
      about: await this.isElementVisible(this.selectors.aboutSection),
      services: await this.isElementVisible(this.selectors.servicesSection),
      cta: await this.isElementVisible(this.selectors.ctaSection)
    };
  }

  /**
   * Scroll to a specific section
   * @param {string} section - Section name (hero, features, about, services, cta)
   */
  async scrollToSection(section) {
    const sectionMap = {
      hero: this.selectors.heroSection,
      features: this.selectors.featuresSection,
      about: this.selectors.aboutSection,
      services: this.selectors.servicesSection,
      cta: this.selectors.ctaSection
    };

    const selector = sectionMap[section];
    if (selector) {
      await this.scrollToElement(selector);
      await this.wait(500); // Small wait for smooth scrolling
    } else {
      throw new Error(`Unknown section: ${section}`);
    }
  }

  /**
   * Get page metadata for SEO verification
   * @returns {Promise<Object>} Page metadata object
   */
  async getPageMetadata() {
    const title = await this.getPageTitle();
    const url = this.getCurrentUrl();
    
    // Get meta description if available
    let description = null;
    try {
      description = await this.page.locator('meta[name="description"]').getAttribute('content');
    } catch {
      // Meta description not found
    }

    return { title, url, description };
  }
}

module.exports = HomePage;