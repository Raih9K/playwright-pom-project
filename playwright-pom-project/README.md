# Playwright POM Project - PippAsync Customer Admin

This is a Playwright test automation project using the Page Object Model (POM) pattern, specifically configured for testing the PippAsync Customer Admin application.

## 🚀 Project Structure

```
playwright-pom-project/
├── pages/                     # Page Object classes
│   ├── components/            # Reusable UI components
│   │   ├── base.component.js  # Base component class
│   │   ├── header.component.js # Header navigation component
│   │   └── footer.component.js # Footer component
│   ├── base.page.js          # Base page class with common functionality
│   ├── home.page.js          # Home page object
│   ├── login.page.js         # Login page object (configured for PippAsync)
│   └── contact.page.js       # Contact page object
├── tests/                    # Test specifications
│   └── login.spec.js         # Login tests for PippAsync Customer Admin
├── utils/                    # Utility functions and test data
│   └── userCredentials.js    # Test data management utilities
├── .env                      # Environment configuration
├── data.json                 # Test data and configurations
├── playwright.config.js      # Playwright configuration
└── package.json             # Dependencies and scripts
```

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
cd playwright-pom-project
npm install
```

### 2. Install Playwright Browsers
```bash
npx playwright install
```

### 3. Configure Environment
The `.env` file is already configured for PippAsync Customer Admin:
- **Base URL**: `https://dev.pippasync.customeradmin.boostonamazon.com`
- **Test Credentials**: Update the credentials in `.env` file with valid PippAsync accounts

### 4. Update Test Credentials
Edit the `.env` file and update the test credentials:
```properties
TEST_USER_EMAIL=your-test-email@domain.com
TEST_USER_PASSWORD=your-test-password
ADMIN_USER_EMAIL=your-admin-email@domain.com
ADMIN_USER_PASSWORD=your-admin-password
```

## 🧪 Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Headed Mode (Browser Visible)
```bash
npm run test:headed
```

### Run Tests in Debug Mode
```bash
npm run test:debug
```

### Run Tests in UI Mode (Interactive)
```bash
npm run test:ui
```

### Run Tests in Specific Browser
```bash
npm run test:chrome    # Chrome only
npm run test:firefox   # Firefox only
npm run test:safari    # Safari/WebKit only
```

### View Test Reports
```bash
npm run test:report
```

## 📋 Available Tests

### Login Tests (`tests/login.spec.js`)
- ✅ Display login page correctly
- ✅ Login with valid credentials
- ✅ Show error for invalid credentials
- ✅ Show validation errors for empty fields
- ✅ Show error for invalid email format
- ✅ Navigate to forgot password page
- ✅ Navigate to sign up page
- ✅ Clear form fields
- ✅ Handle loading states
- ✅ Verify page elements and content

## 🎯 PippAsync Login Page Features

The login page object (`pages/login.page.js`) is specifically configured for the PippAsync Customer Admin login page with:

### Page Elements
- **Email Input**: Supports various selector strategies for email field
- **Password Input**: Password field with proper handling
- **Sign In Button**: Login submission button
- **Forgot Password Link**: Navigation to password recovery
- **Sign Up Link**: Navigation to registration
- **Error Messages**: Comprehensive error handling

### Key Methods
```javascript
// Navigate to login page
await loginPage.navigateToLogin();

// Fill credentials and login
await loginPage.login(email, password);

// Individual field operations
await loginPage.fillEmail(email);
await loginPage.fillPassword(password);
await loginPage.clickLoginButton();

// Validation and error handling
const errorMessage = await loginPage.getErrorMessage();
const isSuccessful = await loginPage.isLoginSuccessful();

// Navigation
await loginPage.clickForgotPassword();
await loginPage.clickSignUpLink();
```

## 📊 Test Data Management

### Environment Variables (`.env`)
- Base URL and API endpoints
- Test user credentials
- Browser and timeout configurations
- Feature flags and debug settings

### Test Data (`data.json`)
- User accounts (valid, invalid, test users)
- Environment configurations
- Browser settings for different devices
- Test scenarios and expected results

### Utility Functions (`utils/userCredentials.js`)
- User credential management
- Environment configuration helpers
- Test data generation utilities
- Random data generators

## 🔧 Configuration

### Playwright Configuration (`playwright.config.js`)
- **Multi-browser support**: Chrome, Firefox, Safari, Edge, Mobile
- **Parallel execution**: Configurable worker threads
- **Reporting**: HTML, JSON, and JUnit reports
- **Screenshots & Videos**: Captured on test failures
- **Timeouts**: Configurable action and navigation timeouts

### Browser Projects
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (Chrome Mobile, Safari Mobile)
- Different viewport sizes and user agents

## 🚨 Troubleshooting

### Common Issues

1. **Login Credentials**
   - Ensure valid credentials are set in `.env` file
   - Check if the test account has proper permissions

2. **Network Issues**
   - Verify the base URL is accessible
   - Check if VPN or proxy is required

3. **Element Not Found**
   - The page object uses multiple selector strategies
   - Elements might have different selectors in different environments

4. **Test Timeouts**
   - Adjust timeouts in `playwright.config.js` if needed
   - Network latency might require longer timeouts

### Debug Mode
Run tests in debug mode to step through test execution:
```bash
npm run test:debug
```

### Verbose Logging
Enable verbose logging in `.env`:
```properties
DEBUG_MODE=true
VERBOSE_LOGGING=true
```

## 📈 Extending the Framework

### Adding New Page Objects
1. Create new page class extending `BasePage`
2. Define selectors and methods
3. Add corresponding test file

### Adding New Tests
1. Create test file in `tests/` directory
2. Import required page objects
3. Use test data from `data.json` or `utils/userCredentials.js`

### Adding New Test Data
1. Update `data.json` for static test data
2. Use utility functions for dynamic data generation
3. Add environment-specific configurations

## 🤝 Best Practices

1. **Page Object Model**: Keep test logic separate from page interactions
2. **Reusable Components**: Use component classes for common UI elements
3. **Test Data Management**: Centralize test data and credentials
4. **Error Handling**: Implement proper wait strategies and error handling
5. **Maintainability**: Use descriptive selectors and method names

## 📝 Notes for PippAsync Customer Admin

- The login page expects email and password credentials
- The application uses "Sign In" button text
- Forgot Password and Sign Up links are available
- The page includes credential entry instructions
- Error handling is implemented for various failure scenarios

## 🔗 Useful Links

- [Playwright Documentation](https://playwright.dev/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Playwright Test Runner](https://playwright.dev/docs/intro)
- [Selectors Guide](https://playwright.dev/docs/selectors)

---

**Ready to test PippAsync Customer Admin!** 🎉

Update the credentials in `.env` file and run `npm test` to start testing.