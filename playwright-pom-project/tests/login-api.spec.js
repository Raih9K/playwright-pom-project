const { test, expect } = require('@playwright/test');
const { 
  loginApi, 
  assertLoginResponse, 
  validateLoginResponse,
  extractUserData,
  extractAccessToken,
  isTokenValid,
  addCustomMatchers
} = require('../utils/apiHelpers');
const testData = require('../data.json');

// Add custom matchers
test.beforeAll(() => {
  addCustomMatchers(expect);
});

test.describe('PippAsync Customer Admin - Login API Tests', () => {
  const baseUrl = process.env.API_BASE_URL || 'https://dev.pippasync.customeradmin.boostonamazon.com/api';
  
  test('should successfully login with valid credentials and return proper response structure', async ({ request }) => {
    const validUser = testData.users.validUser;
    
    // Make login API request
    const response = await loginApi(request, validUser.email, validUser.password, baseUrl);
    
    // Use comprehensive assertion helper
    assertLoginResponse(expect, response, validUser);
    
    // Additional specific assertions for the exact response format
    expect(response.body.message).toBe('Successfully logged in.');
    
    // Validate user data structure matches expected format
    const user = response.body.data.user;
    expect(user).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      email: validUser.email,
      phone: expect.anything(), // Can be null or string
      google_id: expect.anything(), // Can be null or string
      ebay_user_id: expect.anything(), // Can be null or string
      is_active: expect.toBeOneOf([0, 1, true, false]),
      reset_token: expect.anything(), // Can be null or string
      reset_token_expire_at: expect.anything(), // Can be null or string
      created_at: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}Z$/),
      updated_at: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}Z$/)
    });
    
    // Validate access token data
    expect(response.body.data.access_token).toBeDefined();
    expect(response.body.data.access_token_expire_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}Z$/);
    
    // Validate token is not expired
    expect(isTokenValid(response)).toBe(true);
  });

  test('should return error for invalid credentials', async ({ request }) => {
    const invalidUser = testData.users.invalidUser;
    
    // Make login API request with invalid credentials
    const response = await loginApi(request, invalidUser.email, invalidUser.password, baseUrl);
    
    // Should return error response
    expect(response.status).toBeOneOf([400, 401, 422]); // Common error status codes
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBeDefined();
    expect(typeof response.body.message).toBe('string');
    
    // Should not contain user data or token
    expect(response.body.data).toBeUndefined();
  });

  test('should return validation error for empty credentials', async ({ request }) => {
    const emptyUser = testData.users.emptyCredentials;
    
    // Make login API request with empty credentials
    const response = await loginApi(request, emptyUser.email, emptyUser.password, baseUrl);
    
    // Should return validation error
    expect(response.status).toBeOneOf([400, 422]); // Validation error status codes
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBeDefined();
    
    // May contain validation errors
    if (response.body.errors) {
      expect(response.body.errors).toBeDefined();
      expect(typeof response.body.errors).toBe('object');
    }
  });

  test('should return error for invalid email format', async ({ request }) => {
    const invalidEmailUser = testData.users.invalidEmailFormat;
    
    // Make login API request with invalid email format
    const response = await loginApi(request, invalidEmailUser.email, invalidEmailUser.password, baseUrl);
    
    // Should return validation error
    expect(response.status).toBeOneOf([400, 422]);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBeDefined();
  });

  test('should validate response structure using validation helper', async ({ request }) => {
    const validUser = testData.users.validUser;
    
    // Make login API request
    const response = await loginApi(request, validUser.email, validUser.password, baseUrl);
    
    // Use validation helper
    const validation = validateLoginResponse(response, validUser);
    
    // Check validation results
    expect(validation.isValid).toBe(true);
    expect(validation.errors).toHaveLength(0);
    
    // Log warnings if any
    if (validation.warnings.length > 0) {
      console.log('Validation warnings:', validation.warnings);
    }
  });

  test('should extract user data correctly', async ({ request }) => {
    const validUser = testData.users.validUser;
    
    // Make login API request
    const response = await loginApi(request, validUser.email, validUser.password, baseUrl);
    
    // Extract user data
    const userData = extractUserData(response);
    
    expect(userData).toBeDefined();
    expect(userData.id).toBeDefined();
    expect(userData.email).toBe(validUser.email);
    expect(userData.name).toBeDefined();
    expect(userData.is_active).toBeOneOf([0, 1, true, false]);
  });

  test('should extract access token correctly', async ({ request }) => {
    const validUser = testData.users.validUser;
    
    // Make login API request
    const response = await loginApi(request, validUser.email, validUser.password, baseUrl);
    
    // Extract access token
    const accessToken = extractAccessToken(response);
    
    expect(accessToken).toBeDefined();
    expect(typeof accessToken).toBe('string');
  });

  test('should validate date formats in response', async ({ request }) => {
    const validUser = testData.users.validUser;
    
    // Make login API request
    const response = await loginApi(request, validUser.email, validUser.password, baseUrl);
    
    const user = response.body.data.user;
    
    // Validate created_at date
    const createdAt = new Date(user.created_at);
    expect(createdAt.getTime()).not.toBeNaN();
    expect(user.created_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}Z$/);
    
    // Validate updated_at date
    const updatedAt = new Date(user.updated_at);
    expect(updatedAt.getTime()).not.toBeNaN();
    expect(user.updated_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}Z$/);
    
    // Validate access_token_expire_at date
    const expireAt = new Date(response.body.data.access_token_expire_at);
    expect(expireAt.getTime()).not.toBeNaN();
    expect(response.body.data.access_token_expire_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}Z$/);
    
    // Token should expire in the future
    expect(expireAt).toBeAfter(new Date());
  });

  test('should validate user permissions and status', async ({ request }) => {
    const validUser = testData.users.validUser;
    
    // Make login API request
    const response = await loginApi(request, validUser.email, validUser.password, baseUrl);
    
    const user = response.body.data.user;
    
    // User should be active
    expect([1, true].includes(user.is_active)).toBe(true);
    
    // User should have valid ID
    expect(user.id).toBeGreaterThan(0);
    
    // User should have valid email format
    expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    
    // Name should not be empty
    expect(user.name.trim()).not.toBe('');
  });

  test('should handle response with specific expected values', async ({ request }) => {
    // Test with the exact response structure you provided
    const response = await loginApi(request, 'admin@admin.com', '123456', baseUrl);
    
    // Assuming this returns the exact response you showed
    if (response.status === 200 && response.body.success) {
      // Validate exact structure
      expect(response.body).toEqual({
        success: true,
        message: "Successfully logged in.",
        data: {
          user: {
            id: expect.any(Number),
            name: expect.any(String),
            email: "admin@admin.com",
            phone: null,
            google_id: null,
            ebay_user_id: null,
            is_active: 1,
            reset_token: null,
            reset_token_expire_at: null,
            created_at: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}Z$/),
            updated_at: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}Z$/)
          },
          access_token: expect.any(String),
          access_token_expire_at: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}Z$/)
        }
      });
      
      // Additional specific validations
      expect(response.body.data.user.id).toBe(1);
      expect(response.body.data.user.name).toBe("Admin");
      expect(response.body.data.user.is_active).toBe(1);
    }
  });

  test('should validate response headers', async ({ request }) => {
    const validUser = testData.users.validUser;
    
    // Make login API request
    const response = await loginApi(request, validUser.email, validUser.password, baseUrl);
    
    // Validate response headers
    expect(response.headers['content-type']).toContain('application/json');
    
    // Check for security headers (if implemented)
    if (response.headers['x-ratelimit-limit']) {
      expect(response.headers['x-ratelimit-limit']).toBeDefined();
    }
  });
});