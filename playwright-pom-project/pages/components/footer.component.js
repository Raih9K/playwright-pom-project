const BaseComponent = require('./base.component');

/**
 * FooterComponent class represents the footer section
 * Contains selectors and methods for footer interactions across all pages
 */
class FooterComponent extends BaseComponent {
  constructor(page) {
    super(page, '[data-testid="footer"]');
    
    // Footer-specific selectors
    this.selectors = {
      // Main footer container
      footer: '[data-testid="footer"]',
      
      // Footer sections
      footerContent: '[data-testid="footer-content"]',
      footerTop: '[data-testid="footer-top"]',
      footerBottom: '[data-testid="footer-bottom"]',
      
      // Company information
      companySection: '[data-testid="company-section"]',
      companyName: '[data-testid="company-name"]',
      companyDescription: '[data-testid="company-description"]',
      companyLogo: '[data-testid="company-logo"]',
      
      // Contact information
      contactSection: '[data-testid="contact-section"]',
      contactTitle: '[data-testid="contact-title"]',
      addressInfo: '[data-testid="address-info"]',
      phoneInfo: '[data-testid="phone-info"]',
      emailInfo: '[data-testid="email-info"]',
      
      // Quick links navigation
      quickLinksSection: '[data-testid="quick-links-section"]',
      quickLinksTitle: '[data-testid="quick-links-title"]',
      quickLinksList: '[data-testid="quick-links-list"]',
      homeFooterLink: '[data-testid="footer-home-link"]',
      aboutFooterLink: '[data-testid="footer-about-link"]',
      servicesFooterLink: '[data-testid="footer-services-link"]',
      contactFooterLink: '[data-testid="footer-contact-link"]',
      privacyPolicyLink: '[data-testid="privacy-policy-link"]',
      termsOfServiceLink: '[data-testid="terms-of-service-link"]',
      
      // Social media links
      socialSection: '[data-testid="social-section"]',
      socialTitle: '[data-testid="social-title"]',
      socialLinks: '[data-testid="social-links"]',
      facebookLink: '[data-testid="facebook-link"]',
      twitterLink: '[data-testid="twitter-link"]',
      linkedinLink: '[data-testid="linkedin-link"]',
      instagramLink: '[data-testid="instagram-link"]',
      youtubeLink: '[data-testid="youtube-link"]',
      
      // Newsletter subscription
      newsletterSection: '[data-testid="newsletter-section"]',
      newsletterTitle: '[data-testid="newsletter-title"]',
      newsletterDescription: '[data-testid="newsletter-description"]',
      newsletterInput: '[data-testid="newsletter-input"]',
      newsletterButton: '[data-testid="newsletter-button"]',
      newsletterSuccess: '[data-testid="newsletter-success"]',
      newsletterError: '[data-testid="newsletter-error"]',
      
      // Copyright and legal
      copyrightSection: '[data-testid="copyright-section"]',
      copyrightText: '[data-testid="copyright-text"]',
      legalLinks: '[data-testid="legal-links"]',
      
      // Additional footer elements
      backToTopButton: '[data-testid="back-to-top"]',
      languageSelector: '[data-testid="footer-language-selector"]',
      currencySelector: '[data-testid="currency-selector"]'
    };
  }

  /**
   * Check if footer is visible
   * @returns {Promise<boolean>} True if footer is visible
   */
  async isFooterVisible() {
    return await this.isVisible();
  }

  /**
   * Get company name from footer
   * @returns {Promise<string|null>} Company name or null
   */
  async getCompanyName() {
    if (await this.isElementVisible(this.selectors.companyName)) {
      return await this.getText(this.selectors.companyName);
    }
    return null;
  }

  /**
   * Get company description from footer
   * @returns {Promise<string|null>} Company description or null
   */
  async getCompanyDescription() {
    if (await this.isElementVisible(this.selectors.companyDescription)) {
      return await this.getText(this.selectors.companyDescription);
    }
    return null;
  }

  /**
   * Get contact information from footer
   * @returns {Promise<Object>} Contact information object
   */
  async getContactInfo() {
    const contactInfo = {};
    
    if (await this.isElementVisible(this.selectors.addressInfo)) {
      contactInfo.address = await this.getText(this.selectors.addressInfo);
    }
    
    if (await this.isElementVisible(this.selectors.phoneInfo)) {
      contactInfo.phone = await this.getText(this.selectors.phoneInfo);
    }
    
    if (await this.isElementVisible(this.selectors.emailInfo)) {
      contactInfo.email = await this.getText(this.selectors.emailInfo);
    }
    
    return contactInfo;
  }

  /**
   * Navigate to Home page via footer link
   */
  async navigateToHome() {
    await this.scrollToElement(this.selectors.footer);
    if (await this.isElementVisible(this.selectors.homeFooterLink)) {
      await this.click(this.selectors.homeFooterLink);
    }
  }

  /**
   * Navigate to About page via footer link
   */
  async navigateToAbout() {
    await this.scrollToElement(this.selectors.footer);
    if (await this.isElementVisible(this.selectors.aboutFooterLink)) {
      await this.click(this.selectors.aboutFooterLink);
    }
  }

  /**
   * Navigate to Services page via footer link
   */
  async navigateToServices() {
    await this.scrollToElement(this.selectors.footer);
    if (await this.isElementVisible(this.selectors.servicesFooterLink)) {
      await this.click(this.selectors.servicesFooterLink);
    }
  }

  /**
   * Navigate to Contact page via footer link
   */
  async navigateToContact() {
    await this.scrollToElement(this.selectors.footer);
    if (await this.isElementVisible(this.selectors.contactFooterLink)) {
      await this.click(this.selectors.contactFooterLink);
    }
  }

  /**
   * Click Privacy Policy link
   */
  async clickPrivacyPolicy() {
    await this.scrollToElement(this.selectors.footer);
    if (await this.isElementVisible(this.selectors.privacyPolicyLink)) {
      await this.click(this.selectors.privacyPolicyLink);
    }
  }

  /**
   * Click Terms of Service link
   */
  async clickTermsOfService() {
    await this.scrollToElement(this.selectors.footer);
    if (await this.isElementVisible(this.selectors.termsOfServiceLink)) {
      await this.click(this.selectors.termsOfServiceLink);
    }
  }

  /**
   * Click social media link
   * @param {string} platform - Social media platform (facebook, twitter, linkedin, instagram, youtube)
   */
  async clickSocialLink(platform) {
    await this.scrollToElement(this.selectors.footer);
    
    const socialSelectors = {
      facebook: this.selectors.facebookLink,
      twitter: this.selectors.twitterLink,
      linkedin: this.selectors.linkedinLink,
      instagram: this.selectors.instagramLink,
      youtube: this.selectors.youtubeLink
    };
    
    const selector = socialSelectors[platform.toLowerCase()];
    if (selector && await this.isElementVisible(selector)) {
      await this.click(selector);
    }
  }

  /**
   * Get all available social media links
   * @returns {Promise<Array>} Array of available social platforms
   */
  async getAvailableSocialLinks() {
    const socialPlatforms = [];
    const socialSelectors = {
      facebook: this.selectors.facebookLink,
      twitter: this.selectors.twitterLink,
      linkedin: this.selectors.linkedinLink,
      instagram: this.selectors.instagramLink,
      youtube: this.selectors.youtubeLink
    };
    
    for (const [platform, selector] of Object.entries(socialSelectors)) {
      if (await this.isElementVisible(selector)) {
        socialPlatforms.push(platform);
      }
    }
    
    return socialPlatforms;
  }

  /**
   * Subscribe to newsletter
   * @param {string} email - Email address for newsletter subscription
   */
  async subscribeToNewsletter(email) {
    await this.scrollToElement(this.selectors.footer);
    
    if (await this.isElementVisible(this.selectors.newsletterInput)) {
      await this.fill(this.selectors.newsletterInput, email);
      
      if (await this.isElementVisible(this.selectors.newsletterButton)) {
        await this.click(this.selectors.newsletterButton);
      } else {
        // Press Enter if no button
        await this.locator(this.selectors.newsletterInput).press('Enter');
      }
      
      // Wait for success or error message
      try {
        await Promise.race([
          this.page.waitForSelector(this.selectors.newsletterSuccess, { timeout: 5000 }),
          this.page.waitForSelector(this.selectors.newsletterError, { timeout: 5000 })
        ]);
      } catch {
        // Continue regardless of result
      }
    }
  }

  /**
   * Get newsletter subscription result message
   * @returns {Promise<Object>} Object with success/error message
   */
  async getNewsletterResult() {
    const result = { success: null, error: null };
    
    if (await this.isElementVisible(this.selectors.newsletterSuccess)) {
      result.success = await this.getText(this.selectors.newsletterSuccess);
    }
    
    if (await this.isElementVisible(this.selectors.newsletterError)) {
      result.error = await this.getText(this.selectors.newsletterError);
    }
    
    return result;
  }

  /**
   * Get copyright text
   * @returns {Promise<string|null>} Copyright text or null
   */
  async getCopyrightText() {
    if (await this.isElementVisible(this.selectors.copyrightText)) {
      return await this.getText(this.selectors.copyrightText);
    }
    return null;
  }

  /**
   * Click back to top button
   */
  async clickBackToTop() {
    if (await this.isElementVisible(this.selectors.backToTopButton)) {
      await this.click(this.selectors.backToTopButton);
      // Wait for scroll animation
      await this.page.waitForTimeout(1000);
    }
  }

  /**
   * Get all quick links
   * @returns {Promise<Array>} Array of quick link texts
   */
  async getQuickLinks() {
    const links = [];
    const linkSelectors = [
      this.selectors.homeFooterLink,
      this.selectors.aboutFooterLink,
      this.selectors.servicesFooterLink,
      this.selectors.contactFooterLink,
      this.selectors.privacyPolicyLink,
      this.selectors.termsOfServiceLink
    ];
    
    for (const selector of linkSelectors) {
      if (await this.isElementVisible(selector)) {
        const text = await this.getText(selector);
        if (text) links.push(text.trim());
      }
    }
    
    return links;
  }

  /**
   * Verify footer sections are present
   * @returns {Promise<Object>} Object with visibility status of each section
   */
  async verifyFooterSections() {
    return {
      company: await this.isElementVisible(this.selectors.companySection),
      contact: await this.isElementVisible(this.selectors.contactSection),
      quickLinks: await this.isElementVisible(this.selectors.quickLinksSection),
      social: await this.isElementVisible(this.selectors.socialSection),
      newsletter: await this.isElementVisible(this.selectors.newsletterSection),
      copyright: await this.isElementVisible(this.selectors.copyrightSection)
    };
  }

  /**
   * Change language using footer language selector
   * @param {string} language - Language code or name
   */
  async changeLanguage(language) {
    if (await this.isElementVisible(this.selectors.languageSelector)) {
      await this.click(this.selectors.languageSelector);
      // This would need to be customized based on the actual language selector implementation
      await this.page.selectOption(this.selectors.languageSelector, language);
    }
  }

  /**
   * Change currency using footer currency selector
   * @param {string} currency - Currency code
   */
  async changeCurrency(currency) {
    if (await this.isElementVisible(this.selectors.currencySelector)) {
      await this.click(this.selectors.currencySelector);
      await this.page.selectOption(this.selectors.currencySelector, currency);
    }
  }

  /**
   * Scroll to footer
   */
  async scrollToFooter() {
    await this.scrollToElement(this.selectors.footer);
    await this.page.waitForTimeout(500); // Wait for scroll animation
  }

  /**
   * Get footer height (useful for responsive testing)
   * @returns {Promise<number>} Footer height in pixels
   */
  async getFooterHeight() {
    if (await this.isVisible()) {
      const footerElement = this.locator(this.selectors.footer);
      const boundingBox = await footerElement.boundingBox();
      return boundingBox ? boundingBox.height : 0;
    }
    return 0;
  }

  /**
   * Check if footer is sticky (remains at bottom of viewport)
   * @returns {Promise<boolean>} True if footer appears to be sticky
   */
  async isFooterSticky() {
    const footerElement = this.locator(this.selectors.footer);
    const position = await footerElement.evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.position;
    });
    
    return position === 'fixed' || position === 'sticky';
  }
}

module.exports = FooterComponent;