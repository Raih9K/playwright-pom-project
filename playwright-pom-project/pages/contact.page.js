const BasePage = require('./base.page');
const HeaderComponent = require('./components/header.component');
const FooterComponent = require('./components/footer.component');

/**
 * ContactPage class represents the contact/contact us page
 * Contains selectors and methods for contact form interactions
 */
class ContactPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Initialize components
    this.header = new HeaderComponent(page);
    this.footer = new FooterComponent(page);
    
    // Page-specific selectors
    this.selectors = {
      // Contact form elements
      contactForm: '[data-testid="contact-form"]',
      firstNameInput: '[data-testid="first-name-input"]',
      lastNameInput: '[data-testid="last-name-input"]',
      emailInput: '[data-testid="email-input"]',
      phoneInput: '[data-testid="phone-input"]',
      subjectInput: '[data-testid="subject-input"]',
      messageTextarea: '[data-testid="message-textarea"]',
      submitButton: '[data-testid="submit-button"]',
      
      // Form validation and error messages
      errorMessage: '[data-testid="error-message"]',
      successMessage: '[data-testid="success-message"]',
      fieldError: '[data-testid="field-error"]',
      firstNameError: '[data-testid="first-name-error"]',
      lastNameError: '[data-testid="last-name-error"]',
      emailError: '[data-testid="email-error"]',
      phoneError: '[data-testid="phone-error"]',
      subjectError: '[data-testid="subject-error"]',
      messageError: '[data-testid="message-error"]',
      
      // Additional form elements
      inquiryTypeSelect: '[data-testid="inquiry-type-select"]',
      attachmentInput: '[data-testid="attachment-input"]',
      privacyCheckbox: '[data-testid="privacy-checkbox"]',
      newsletterCheckbox: '[data-testid="newsletter-checkbox"]',
      
      // Page content
      pageTitle: '[data-testid="contact-title"]',
      pageDescription: '[data-testid="contact-description"]',
      contactInfo: '[data-testid="contact-info"]',
      
      // Contact information sections
      addressSection: '[data-testid="address-section"]',
      phoneSection: '[data-testid="phone-section"]',
      emailSection: '[data-testid="email-section"]',
      hoursSection: '[data-testid="hours-section"]',
      
      // Loading and status indicators
      loadingSpinner: '[data-testid="loading-spinner"]',
      formStatus: '[data-testid="form-status"]',
      
      // Reset and clear buttons
      resetButton: '[data-testid="reset-button"]',
      clearButton: '[data-testid="clear-button"]'
    };
  }

  /**
   * Navigate to the contact page
   */
  async navigateToContact() {
    await this.navigateTo('/contact');
    await this.waitForPageLoad();
  }

  /**
   * Verify that the contact page is loaded correctly
   * @returns {Promise<boolean>} True if contact page is loaded
   */
  async isContactPageLoaded() {
    try {
      await this.waitForElement(this.selectors.contactForm);
      return await this.isElementVisible(this.selectors.submitButton);
    } catch (error) {
      console.error('Contact page failed to load:', error.message);
      return false;
    }
  }

  /**
   * Fill first name field
   * @param {string} firstName - First name to enter
   */
  async fillFirstName(firstName) {
    await this.waitForElement(this.selectors.firstNameInput);
    await this.page.locator(this.selectors.firstNameInput).clear();
    await this.page.locator(this.selectors.firstNameInput).fill(firstName);
  }

  /**
   * Fill last name field
   * @param {string} lastName - Last name to enter
   */
  async fillLastName(lastName) {
    await this.waitForElement(this.selectors.lastNameInput);
    await this.page.locator(this.selectors.lastNameInput).clear();
    await this.page.locator(this.selectors.lastNameInput).fill(lastName);
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
   * Fill phone field
   * @param {string} phone - Phone number to enter
   */
  async fillPhone(phone) {
    if (await this.isElementVisible(this.selectors.phoneInput)) {
      await this.page.locator(this.selectors.phoneInput).clear();
      await this.page.locator(this.selectors.phoneInput).fill(phone);
    }
  }

  /**
   * Fill subject field
   * @param {string} subject - Subject to enter
   */
  async fillSubject(subject) {
    await this.waitForElement(this.selectors.subjectInput);
    await this.page.locator(this.selectors.subjectInput).clear();
    await this.page.locator(this.selectors.subjectInput).fill(subject);
  }

  /**
   * Fill message textarea
   * @param {string} message - Message to enter
   */
  async fillMessage(message) {
    await this.waitForElement(this.selectors.messageTextarea);
    await this.page.locator(this.selectors.messageTextarea).clear();
    await this.page.locator(this.selectors.messageTextarea).fill(message);
  }

  /**
   * Select inquiry type from dropdown
   * @param {string} inquiryType - Type of inquiry to select
   */
  async selectInquiryType(inquiryType) {
    if (await this.isElementVisible(this.selectors.inquiryTypeSelect)) {
      await this.page.locator(this.selectors.inquiryTypeSelect).selectOption(inquiryType);
    }
  }

  /**
   * Check or uncheck privacy policy checkbox
   * @param {boolean} check - True to check, false to uncheck
   */
  async checkPrivacyPolicy(check = true) {
    if (await this.isElementVisible(this.selectors.privacyCheckbox)) {
      const checkbox = this.page.locator(this.selectors.privacyCheckbox);
      const isChecked = await checkbox.isChecked();
      
      if (check && !isChecked) {
        await checkbox.check();
      } else if (!check && isChecked) {
        await checkbox.uncheck();
      }
    }
  }

  /**
   * Check or uncheck newsletter subscription checkbox
   * @param {boolean} check - True to check, false to uncheck
   */
  async checkNewsletter(check = true) {
    if (await this.isElementVisible(this.selectors.newsletterCheckbox)) {
      const checkbox = this.page.locator(this.selectors.newsletterCheckbox);
      const isChecked = await checkbox.isChecked();
      
      if (check && !isChecked) {
        await checkbox.check();
      } else if (!check && isChecked) {
        await checkbox.uncheck();
      }
    }
  }

  /**
   * Upload attachment file
   * @param {string} filePath - Path to file to upload
   */
  async uploadAttachment(filePath) {
    if (await this.isElementVisible(this.selectors.attachmentInput)) {
      await this.page.locator(this.selectors.attachmentInput).setInputFiles(filePath);
    }
  }

  /**
   * Click submit button
   */
  async clickSubmit() {
    await this.waitForElement(this.selectors.submitButton);
    await this.page.locator(this.selectors.submitButton).click();
  }

  /**
   * Fill complete contact form with provided data
   * @param {Object} contactData - Contact form data object
   */
  async fillContactForm(contactData) {
    if (contactData.firstName) await this.fillFirstName(contactData.firstName);
    if (contactData.lastName) await this.fillLastName(contactData.lastName);
    if (contactData.email) await this.fillEmail(contactData.email);
    if (contactData.phone) await this.fillPhone(contactData.phone);
    if (contactData.subject) await this.fillSubject(contactData.subject);
    if (contactData.message) await this.fillMessage(contactData.message);
    
    if (contactData.inquiryType) await this.selectInquiryType(contactData.inquiryType);
    if (contactData.attachment) await this.uploadAttachment(contactData.attachment);
    
    // Handle checkboxes
    if (contactData.acceptPrivacy !== undefined) {
      await this.checkPrivacyPolicy(contactData.acceptPrivacy);
    }
    if (contactData.subscribeNewsletter !== undefined) {
      await this.checkNewsletter(contactData.subscribeNewsletter);
    }
  }

  /**
   * Submit contact form with provided data
   * @param {Object} contactData - Contact form data object
   */
  async submitContactForm(contactData) {
    await this.fillContactForm(contactData);
    await this.clickSubmit();
    
    // Wait for form submission result
    try {
      await Promise.race([
        this.page.waitForSelector(this.selectors.successMessage, { timeout: 10000 }),
        this.page.waitForSelector(this.selectors.errorMessage, { timeout: 10000 })
      ]);
    } catch {
      // Continue regardless of result
    }
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
   * Get error message text
   * @returns {Promise<string|null>} Error message text or null
   */
  async getErrorMessage() {
    if (await this.isElementVisible(this.selectors.errorMessage)) {
      return await this.page.locator(this.selectors.errorMessage).textContent();
    }
    return null;
  }

  /**
   * Get field-specific error message
   * @param {string} field - Field name (firstName, lastName, email, etc.)
   * @returns {Promise<string|null>} Field error message or null
   */
  async getFieldError(field) {
    const errorSelectors = {
      firstName: this.selectors.firstNameError,
      lastName: this.selectors.lastNameError,
      email: this.selectors.emailError,
      phone: this.selectors.phoneError,
      subject: this.selectors.subjectError,
      message: this.selectors.messageError
    };
    
    const errorSelector = errorSelectors[field];
    if (errorSelector && await this.isElementVisible(errorSelector)) {
      return await this.page.locator(errorSelector).textContent();
    }
    return null;
  }

  /**
   * Check if form is in loading state
   * @returns {Promise<boolean>} True if loading
   */
  async isLoading() {
    return await this.isElementVisible(this.selectors.loadingSpinner);
  }

  /**
   * Clear all form fields
   */
  async clearForm() {
    await this.page.locator(this.selectors.firstNameInput).clear();
    await this.page.locator(this.selectors.lastNameInput).clear();
    await this.page.locator(this.selectors.emailInput).clear();
    
    if (await this.isElementVisible(this.selectors.phoneInput)) {
      await this.page.locator(this.selectors.phoneInput).clear();
    }
    
    await this.page.locator(this.selectors.subjectInput).clear();
    await this.page.locator(this.selectors.messageTextarea).clear();
    
    // Uncheck checkboxes
    await this.checkPrivacyPolicy(false);
    await this.checkNewsletter(false);
  }

  /**
   * Click reset button if available
   */
  async clickReset() {
    if (await this.isElementVisible(this.selectors.resetButton)) {
      await this.page.locator(this.selectors.resetButton).click();
    }
  }

  /**
   * Get contact information from the page
   * @returns {Promise<Object>} Contact information object
   */
  async getContactInfo() {
    const contactInfo = {};
    
    if (await this.isElementVisible(this.selectors.addressSection)) {
      contactInfo.address = await this.page.locator(this.selectors.addressSection).textContent();
    }
    
    if (await this.isElementVisible(this.selectors.phoneSection)) {
      contactInfo.phone = await this.page.locator(this.selectors.phoneSection).textContent();
    }
    
    if (await this.isElementVisible(this.selectors.emailSection)) {
      contactInfo.email = await this.page.locator(this.selectors.emailSection).textContent();
    }
    
    if (await this.isElementVisible(this.selectors.hoursSection)) {
      contactInfo.hours = await this.page.locator(this.selectors.hoursSection).textContent();
    }
    
    return contactInfo;
  }

  /**
   * Verify form validation by checking required fields
   * @returns {Promise<Object>} Validation results object
   */
  async verifyFormValidation() {
    // Try to submit empty form to trigger validation
    await this.clickSubmit();
    await this.wait(1000); // Wait for validation messages
    
    return {
      firstName: await this.getFieldError('firstName'),
      lastName: await this.getFieldError('lastName'),
      email: await this.getFieldError('email'),
      subject: await this.getFieldError('subject'),
      message: await this.getFieldError('message'),
      general: await this.getErrorMessage()
    };
  }

  /**
   * Check if form submission was successful
   * @returns {Promise<boolean>} True if submission appears successful
   */
  async isSubmissionSuccessful() {
    return await this.isElementVisible(this.selectors.successMessage);
  }
}

module.exports = ContactPage;