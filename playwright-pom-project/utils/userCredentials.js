/**
 * User credentials and test data management
 * This module provides test user data for different environments and scenarios
 */

// Test user credentials for different scenarios
const testUsers = {
  validUser: {
    username: 'testuser@example.com',
    password: 'TestPass123!',
    firstName: 'Test',
    lastName: 'User',
    fullName: 'Test User'
  },
  
  invalidUser: {
    username: 'invalid@example.com',
    password: 'wrongpassword',
    firstName: 'Invalid',
    lastName: 'User'
  },
  
  adminUser: {
    username: 'admin@example.com',
    password: 'AdminPass123!',
    firstName: 'Admin',
    lastName: 'User',
    role: 'administrator'
  },
  
  emptyCredentials: {
    username: '',
    password: ''
  }
};

// Environment-specific configurations
const environments = {
  dev: {
    baseUrl: 'http://localhost:3000',
    apiUrl: 'http://localhost:3001/api'
  },
  
  staging: {
    baseUrl: 'https://staging.example.com',
    apiUrl: 'https://staging-api.example.com'
  },
  
  production: {
    baseUrl: 'https://example.com',
    apiUrl: 'https://api.example.com'
  }
};

// Test data for forms
const testData = {
  contactForm: {
    validData: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      subject: 'Test Inquiry',
      message: 'This is a test message for automated testing purposes.'
    },
    
    invalidData: {
      firstName: '',
      lastName: '',
      email: 'invalid-email',
      phone: '123',
      subject: '',
      message: ''
    }
  },
  
  searchData: {
    validQueries: ['playwright', 'testing', 'automation'],
    invalidQueries: ['', '   ', '!@#$%^&*()'],
    specialCharacters: ['<script>', 'SELECT * FROM users', '../../etc/passwd']
  }
};

/**
 * Get user credentials by type
 * @param {string} userType - Type of user (validUser, invalidUser, adminUser, etc.)
 * @returns {Object} User credentials object
 */
function getUserCredentials(userType = 'validUser') {
  return testUsers[userType] || testUsers.validUser;
}

/**
 * Get environment configuration
 * @param {string} env - Environment name (dev, staging, production)
 * @returns {Object} Environment configuration object
 */
function getEnvironmentConfig(env = 'dev') {
  return environments[env] || environments.dev;
}

/**
 * Get test data by category
 * @param {string} category - Data category (contactForm, searchData, etc.)
 * @returns {Object} Test data object
 */
function getTestData(category) {
  return testData[category];
}

/**
 * Generate random user data
 * @returns {Object} Random user data
 */
function generateRandomUser() {
  const timestamp = Date.now();
  return {
    username: `testuser${timestamp}@example.com`,
    password: `TestPass${timestamp}!`,
    firstName: `FirstName${timestamp}`,
    lastName: `LastName${timestamp}`,
    fullName: `FirstName${timestamp} LastName${timestamp}`
  };
}

/**
 * Generate random string
 * @param {number} length - Length of the string
 * @returns {string} Random string
 */
function generateRandomString(length = 10) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Generate random email
 * @param {string} domain - Email domain (optional)
 * @returns {string} Random email address
 */
function generateRandomEmail(domain = 'example.com') {
  const username = generateRandomString(8).toLowerCase();
  return `${username}@${domain}`;
}

module.exports = {
  testUsers,
  environments,
  testData,
  getUserCredentials,
  getEnvironmentConfig,
  getTestData,
  generateRandomUser,
  generateRandomString,
  generateRandomEmail
};