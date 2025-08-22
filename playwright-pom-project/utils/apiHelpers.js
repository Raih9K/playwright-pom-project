/**
 * API Helper utilities for making API requests and validating responses
 */

/**
 * Make API request with proper headers and error handling
 * @param {Object} request - Playwright request object
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {string} url - API endpoint URL
 * @param {Object} options - Request options (headers, data, etc.)
 * @returns {Promise<Object>} API response object
 */
async function makeApiRequest(request, method, url, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers
  };

  const requestOptions = {
    method: method.toUpperCase(),
    headers: defaultHeaders,
    ...options
  };

  if (options.data && (method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT')) {
    requestOptions.data = JSON.stringify(options.data);
  }

  try {
    const response = await request.fetch(url, requestOptions);
    const responseBody = await response.json();
    
    return {
      status: response.status(),
      statusText: response.statusText(),
      headers: response.headers(),
      body: responseBody,
      ok: response.ok()
    };
  } catch (error) {
    throw new Error(`API request failed: ${error.message}`);
  }
}

/**
 * Login API request
 * @param {Object} request - Playwright request object
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} baseUrl - Base API URL
 * @returns {Promise<Object>} Login API response
 */
async function loginApi(request, email, password, baseUrl) {
  const loginUrl = `${baseUrl}/auth/login`;
  
  return await makeApiRequest(request, 'POST', loginUrl, {
    data: {
      email: email,
      password: password
    }
  });
}

/**
 * Validate login API response structure and content
 * @param {Object} response - API response object
 * @param {Object} expectedUser - Expected user data (optional)
 * @returns {Object} Validation results
 */
function validateLoginResponse(response, expectedUser = null) {
  const validation = {
    isValid: true,
    errors: [],
    warnings: []
  };

  // Check response status
  if (response.status !== 200) {
    validation.isValid = false;
    validation.errors.push(`Expected status 200, got ${response.status}`);
  }

  // Check response structure
  const body = response.body;
  
  // Validate required fields
  const requiredFields = ['success', 'message', 'data'];
  requiredFields.forEach(field => {
    if (!(field in body)) {
      validation.isValid = false;
      validation.errors.push(`Missing required field: ${field}`);
    }
  });

  // Validate success field
  if (body.success !== true) {
    validation.isValid = false;
    validation.errors.push(`Expected success to be true, got ${body.success}`);
  }

  // Validate message field
  if (typeof body.message !== 'string' || body.message.trim() === '') {
    validation.isValid = false;
    validation.errors.push('Message field should be a non-empty string');
  }

  // Validate data structure
  if (body.data) {
    const dataRequiredFields = ['user', 'access_token', 'access_token_expire_at'];
    dataRequiredFields.forEach(field => {
      if (!(field in body.data)) {
        validation.isValid = false;
        validation.errors.push(`Missing required data field: ${field}`);
      }
    });

    // Validate user object
    if (body.data.user) {
      const userRequiredFields = ['id', 'name', 'email', 'is_active', 'created_at', 'updated_at'];
      userRequiredFields.forEach(field => {
        if (!(field in body.data.user)) {
          validation.isValid = false;
          validation.errors.push(`Missing required user field: ${field}`);
        }
      });

      // Validate user data types
      if (body.data.user.id && typeof body.data.user.id !== 'number') {
        validation.errors.push('User ID should be a number');
      }

      if (body.data.user.email && typeof body.data.user.email !== 'string') {
        validation.errors.push('User email should be a string');
      }

      if (body.data.user.is_active && ![0, 1, true, false].includes(body.data.user.is_active)) {
        validation.warnings.push('User is_active should be 0, 1, true, or false');
      }

      // Validate expected user data if provided
      if (expectedUser) {
        if (expectedUser.email && body.data.user.email !== expectedUser.email) {
          validation.errors.push(`Expected email ${expectedUser.email}, got ${body.data.user.email}`);
        }
        
        if (expectedUser.name && body.data.user.name !== expectedUser.name) {
          validation.warnings.push(`Expected name ${expectedUser.name}, got ${body.data.user.name}`);
        }
      }
    }

    // Validate access token
    if (body.data.access_token !== undefined && typeof body.data.access_token !== 'string') {
      validation.warnings.push('Access token should be a string');
    }

    // Validate token expiration
    if (body.data.access_token_expire_at) {
      const expireDate = new Date(body.data.access_token_expire_at);
      if (isNaN(expireDate.getTime())) {
        validation.errors.push('Invalid access_token_expire_at date format');
      } else if (expireDate <= new Date()) {
        validation.warnings.push('Access token appears to be expired');
      }
    }
  }

  return validation;
}

/**
 * Create comprehensive assertions for login API response
 * @param {Object} expect - Playwright expect object
 * @param {Object} response - API response object
 * @param {Object} expectedUser - Expected user data (optional)
 */
function assertLoginResponse(expect, response, expectedUser = null) {
  // Basic response assertions
  expect(response.status).toBe(200);
  expect(response.ok).toBe(true);
  
  const body = response.body;
  
  // Structure assertions
  expect(body).toHaveProperty('success');
  expect(body).toHaveProperty('message');
  expect(body).toHaveProperty('data');
  
  // Content assertions
  expect(body.success).toBe(true);
  expect(body.message).toBe('Successfully logged in.');
  expect(typeof body.message).toBe('string');
  
  // Data object assertions
  expect(body.data).toHaveProperty('user');
  expect(body.data).toHaveProperty('access_token');
  expect(body.data).toHaveProperty('access_token_expire_at');
  
  // User object assertions
  const user = body.data.user;
  expect(user).toHaveProperty('id');
  expect(user).toHaveProperty('name');
  expect(user).toHaveProperty('email');
  expect(user).toHaveProperty('phone');
  expect(user).toHaveProperty('google_id');
  expect(user).toHaveProperty('ebay_user_id');
  expect(user).toHaveProperty('is_active');
  expect(user).toHaveProperty('reset_token');
  expect(user).toHaveProperty('reset_token_expire_at');
  expect(user).toHaveProperty('created_at');
  expect(user).toHaveProperty('updated_at');
  
  // User data type assertions
  expect(typeof user.id).toBe('number');
  expect(typeof user.name).toBe('string');
  expect(typeof user.email).toBe('string');
  expect(user.is_active).toBeOneOf([0, 1, true, false]);
  
  // User data validation
  expect(user.id).toBeGreaterThan(0);
  expect(user.name.trim()).not.toBe('');
  expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/); // Email format validation
  
  // Active user assertion
  expect([1, true].includes(user.is_active)).toBe(true);
  
  // Date format assertions
  expect(() => new Date(user.created_at)).not.toThrow();
  expect(() => new Date(user.updated_at)).not.toThrow();
  expect(new Date(user.created_at).getTime()).not.toBeNaN();
  expect(new Date(user.updated_at).getTime()).not.toBeNaN();
  
  // Access token assertions
  expect(typeof body.data.access_token).toBe('string');
  
  // Token expiration assertions
  expect(() => new Date(body.data.access_token_expire_at)).not.toThrow();
  expect(new Date(body.data.access_token_expire_at).getTime()).not.toBeNaN();
  expect(new Date(body.data.access_token_expire_at)).toBeAfter(new Date());
  
  // Expected user data assertions (if provided)
  if (expectedUser) {
    if (expectedUser.email) {
      expect(user.email).toBe(expectedUser.email);
    }
    if (expectedUser.name) {
      expect(user.name).toBe(expectedUser.name);
    }
    if (expectedUser.id) {
      expect(user.id).toBe(expectedUser.id);
    }
  }
}

/**
 * Extract user data from login response
 * @param {Object} response - API response object
 * @returns {Object} User data object
 */
function extractUserData(response) {
  if (response.body && response.body.data && response.body.data.user) {
    return response.body.data.user;
  }
  return null;
}

/**
 * Extract access token from login response
 * @param {Object} response - API response object
 * @returns {string} Access token
 */
function extractAccessToken(response) {
  if (response.body && response.body.data && response.body.data.access_token) {
    return response.body.data.access_token;
  }
  return null;
}

/**
 * Check if access token is valid (not expired)
 * @param {Object} response - API response object
 * @returns {boolean} True if token is valid
 */
function isTokenValid(response) {
  if (response.body && response.body.data && response.body.data.access_token_expire_at) {
    const expireDate = new Date(response.body.data.access_token_expire_at);
    return expireDate > new Date();
  }
  return false;
}

// Custom Playwright matchers
function addCustomMatchers(expect) {
  expect.extend({
    toBeOneOf(received, validOptions) {
      const pass = validOptions.includes(received);
      if (pass) {
        return {
          message: () => `expected ${received} not to be one of ${validOptions}`,
          pass: true,
        };
      } else {
        return {
          message: () => `expected ${received} to be one of ${validOptions}`,
          pass: false,
        };
      }
    },
    
    toBeAfter(received, date) {
      const pass = new Date(received) > new Date(date);
      if (pass) {
        return {
          message: () => `expected ${received} not to be after ${date}`,
          pass: true,
        };
      } else {
        return {
          message: () => `expected ${received} to be after ${date}`,
          pass: false,
        };
      }
    }
  });
}

module.exports = {
  makeApiRequest,
  loginApi,
  validateLoginResponse,
  assertLoginResponse,
  extractUserData,
  extractAccessToken,
  isTokenValid,
  addCustomMatchers
};