const BaseComponent = require('./base.component');

/**
 * HeaderComponent class represents the header/navigation section
 * Contains selectors and methods for header interactions across all pages
 */
class HeaderComponent extends BaseComponent {
  constructor(page) {
    super(page, '[data-testid="header"]');
    
    // Header-specific selectors
    this.selectors = {
      // Main header container
      header: '[data-testid="header"]',
      
      // Logo and branding
      logo: '[data-testid="logo"]',
      logoImage: '[data-testid="logo-image"]',
      logoText: '[data-testid="logo-text"]',
      
      // Main navigation menu
      mainNav: '[data-testid="main-navigation"]',
      navMenu: '[data-testid="nav-menu"]',
      homeLink: '[data-testid="nav-home"]',
      aboutLink: '[data-testid="nav-about"]',
      servicesLink: '[data-testid="nav-services"]',
      contactLink: '[data-testid="nav-contact"]',
      
      // User authentication section
      authSection: '[data-testid="auth-section"]',
      loginButton: '[data-testid="login-button"]',
      signupButton: '[data-testid="signup-button"]',
      logoutButton: '[data-testid="logout-button"]',
      userMenu: '[data-testid="user-menu"]',
      userAvatar: '[data-testid="user-avatar"]',
      userName: '[data-testid="user-name"]',
      
      // User dropdown menu
      userDropdown: '[data-testid="user-dropdown"]',
      profileLink: '[data-testid="profile-link"]',
      settingsLink: '[data-testid="settings-link"]',
      dashboardLink: '[data-testid="dashboard-link"]',
      
      // Search functionality
      searchSection: '[data-testid="search-section"]',
      searchInput: '[data-testid="search-input"]',
      searchButton: '[data-testid="search-button"]',
      searchResults: '[data-testid="search-results"]',
      
      // Mobile navigation
      mobileMenuToggle: '[data-testid="mobile-menu-toggle"]',
      mobileMenu: '[data-testid="mobile-menu"]',
      mobileNavLinks: '[data-testid="mobile-nav-links"]',
      
      // Additional header elements
      languageSelector: '[data-testid="language-selector"]',
      themeToggle: '[data-testid="theme-toggle"]',
      notificationBell: '[data-testid="notification-bell"]',
      cartIcon: '[data-testid="cart-icon"]',
      cartCount: '[data-testid="cart-count"]'
    };
  }

  /**
   * Check if header is visible
   * @returns {Promise<boolean>} True if header is visible
   */
  async isHeaderVisible() {
    return await this.isVisible();
  }

  /**
   * Click on the logo to navigate to home
   */
  async clickLogo() {
    await this.waitForVisible();
    await this.click(this.selectors.logo);
  }

  /**
   * Get logo text content
   * @returns {Promise<string>} Logo text
   */
  async getLogoText() {
    if (await this.isElementVisible(this.selectors.logoText)) {
      return await this.getText(this.selectors.logoText);
    }
    return null;
  }

  /**
   * Navigate to Home page via header link
   */
  async navigateToHome() {
    await this.waitForVisible();
    await this.click(this.selectors.homeLink);
  }

  /**
   * Navigate to About page via header link
   */
  async navigateToAbout() {
    await this.waitForVisible();
    if (await this.isElementVisible(this.selectors.aboutLink)) {
      await this.click(this.selectors.aboutLink);
    }
  }

  /**
   * Navigate to Services page via header link
   */
  async navigateToServices() {
    await this.waitForVisible();
    if (await this.isElementVisible(this.selectors.servicesLink)) {
      await this.click(this.selectors.servicesLink);
    }
  }

  /**
   * Navigate to Contact page via header link
   */
  async navigateToContact() {
    await this.waitForVisible();
    await this.click(this.selectors.contactLink);
  }

  /**
   * Click login button
   */
  async clickLogin() {
    await this.waitForVisible();
    if (await this.isElementVisible(this.selectors.loginButton)) {
      await this.click(this.selectors.loginButton);
    }
  }

  /**
   * Click signup button
   */
  async clickSignup() {
    await this.waitForVisible();
    if (await this.isElementVisible(this.selectors.signupButton)) {
      await this.click(this.selectors.signupButton);
    }
  }

  /**
   * Click logout button
   */
  async clickLogout() {
    await this.waitForVisible();
    if (await this.isElementVisible(this.selectors.logoutButton)) {
      await this.click(this.selectors.logoutButton);
    }
  }

  /**
   * Check if user is logged in by looking for user menu or logout button
   * @returns {Promise<boolean>} True if user appears to be logged in
   */
  async isUserLoggedIn() {
    return (await this.isElementVisible(this.selectors.userMenu)) || 
           (await this.isElementVisible(this.selectors.logoutButton)) ||
           (await this.isElementVisible(this.selectors.userName));
  }

  /**
   * Get logged in user name
   * @returns {Promise<string|null>} User name or null if not visible
   */
  async getUserName() {
    if (await this.isElementVisible(this.selectors.userName)) {
      return await this.getText(this.selectors.userName);
    }
    return null;
  }

  /**
   * Click on user menu to open dropdown
   */
  async clickUserMenu() {
    await this.waitForVisible();
    if (await this.isElementVisible(this.selectors.userMenu)) {
      await this.click(this.selectors.userMenu);
    } else if (await this.isElementVisible(this.selectors.userAvatar)) {
      await this.click(this.selectors.userAvatar);
    }
  }

  /**
   * Navigate to user profile from dropdown
   */
  async navigateToProfile() {
    await this.clickUserMenu();
    await this.page.waitForTimeout(500); // Wait for dropdown to appear
    if (await this.isElementVisible(this.selectors.profileLink)) {
      await this.click(this.selectors.profileLink);
    }
  }

  /**
   * Navigate to settings from dropdown
   */
  async navigateToSettings() {
    await this.clickUserMenu();
    await this.page.waitForTimeout(500); // Wait for dropdown to appear
    if (await this.isElementVisible(this.selectors.settingsLink)) {
      await this.click(this.selectors.settingsLink);
    }
  }

  /**
   * Navigate to dashboard from dropdown
   */
  async navigateToDashboard() {
    await this.clickUserMenu();
    await this.page.waitForTimeout(500); // Wait for dropdown to appear
    if (await this.isElementVisible(this.selectors.dashboardLink)) {
      await this.click(this.selectors.dashboardLink);
    }
  }

  /**
   * Perform search using header search functionality
   * @param {string} searchTerm - Term to search for
   */
  async search(searchTerm) {
    if (await this.isElementVisible(this.selectors.searchInput)) {
      await this.fill(this.selectors.searchInput, searchTerm);
      
      if (await this.isElementVisible(this.selectors.searchButton)) {
        await this.click(this.selectors.searchButton);
      } else {
        // Press Enter if no search button
        await this.locator(this.selectors.searchInput).press('Enter');
      }
    }
  }

  /**
   * Get search results (if search results appear in header)
   * @returns {Promise<Array>} Array of search result texts
   */
  async getSearchResults() {
    if (await this.isElementVisible(this.selectors.searchResults)) {
      const results = await this.locator(this.selectors.searchResults).locator('li, .search-result-item').all();
      const resultTexts = [];
      
      for (const result of results) {
        const text = await result.textContent();
        if (text) resultTexts.push(text.trim());
      }
      
      return resultTexts;
    }
    return [];
  }

  /**
   * Toggle mobile menu (for responsive design)
   */
  async toggleMobileMenu() {
    if (await this.isElementVisible(this.selectors.mobileMenuToggle)) {
      await this.click(this.selectors.mobileMenuToggle);
    }
  }

  /**
   * Check if mobile menu is open
   * @returns {Promise<boolean>} True if mobile menu is visible
   */
  async isMobileMenuOpen() {
    return await this.isElementVisible(this.selectors.mobileMenu);
  }

  /**
   * Navigate using mobile menu
   * @param {string} linkName - Name of the link to click (home, about, services, contact)
   */
  async navigateViaMobileMenu(linkName) {
    await this.toggleMobileMenu();
    await this.page.waitForTimeout(500); // Wait for menu animation
    
    const linkSelectors = {
      home: this.selectors.homeLink,
      about: this.selectors.aboutLink,
      services: this.selectors.servicesLink,
      contact: this.selectors.contactLink
    };
    
    const selector = linkSelectors[linkName.toLowerCase()];
    if (selector && await this.isElementVisible(selector)) {
      await this.click(selector);
    }
  }

  /**
   * Change language (if language selector is available)
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
   * Toggle theme (dark/light mode)
   */
  async toggleTheme() {
    if (await this.isElementVisible(this.selectors.themeToggle)) {
      await this.click(this.selectors.themeToggle);
    }
  }

  /**
   * Click notification bell
   */
  async clickNotifications() {
    if (await this.isElementVisible(this.selectors.notificationBell)) {
      await this.click(this.selectors.notificationBell);
    }
  }

  /**
   * Click shopping cart icon
   */
  async clickCart() {
    if (await this.isElementVisible(this.selectors.cartIcon)) {
      await this.click(this.selectors.cartIcon);
    }
  }

  /**
   * Get cart item count
   * @returns {Promise<number>} Number of items in cart
   */
  async getCartCount() {
    if (await this.isElementVisible(this.selectors.cartCount)) {
      const countText = await this.getText(this.selectors.cartCount);
      return parseInt(countText) || 0;
    }
    return 0;
  }

  /**
   * Get all visible navigation links
   * @returns {Promise<Array>} Array of navigation link texts
   */
  async getNavigationLinks() {
    const links = [];
    const linkSelectors = [
      this.selectors.homeLink,
      this.selectors.aboutLink,
      this.selectors.servicesLink,
      this.selectors.contactLink
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
   * Verify header authentication state
   * @returns {Promise<Object>} Object with authentication state information
   */
  async getAuthenticationState() {
    return {
      isLoggedIn: await this.isUserLoggedIn(),
      userName: await this.getUserName(),
      hasLoginButton: await this.isElementVisible(this.selectors.loginButton),
      hasSignupButton: await this.isElementVisible(this.selectors.signupButton),
      hasLogoutButton: await this.isElementVisible(this.selectors.logoutButton),
      hasUserMenu: await this.isElementVisible(this.selectors.userMenu)
    };
  }
}

module.exports = HeaderComponent;