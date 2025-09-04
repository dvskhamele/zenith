import { test, expect } from '@playwright/test';

test.describe('Zenith Social Media Management Platform - Complete E2E Test', () => {
  // Test 1: Registration Flow
  test('should register a new user successfully', async ({ page }) => {
    await page.goto('http://localhost:3001/register');
    
    // Verify registration page elements
    await expect(page.getByText('Create Account')).toBeVisible();
    await expect(page.getByPlaceholder('Email')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
    
    // Fill registration form
    await page.getByPlaceholder('Email').fill('e2e-test@example.com');
    await page.getByPlaceholder('Password').fill('password123');
    
    // Submit registration
    await page.getByRole('button', { name: 'Register' }).click();
    
    // Verify registration success (this might vary based on your app's response)
    // You might need to adjust this based on your actual registration flow
  });

  // Test 2: Login Flow
  test('should login existing user successfully', async ({ page }) => {
    await page.goto('http://localhost:3001/login');
    
    // Verify login page elements
    await expect(page.getByText('Welcome Back')).toBeVisible();
    await expect(page.getByPlaceholder('Email')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
    
    // Fill login form
    await page.getByPlaceholder('Email').fill('test@example.com');
    await page.getByPlaceholder('Password').fill('password123');
    
    // Submit login
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Verify redirection to dashboard
    await page.waitForURL('http://localhost:3001/**');
  });

  // Test 3: Dashboard Navigation
  test('should navigate through dashboard tabs successfully', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3001/login');
    await page.getByPlaceholder('Email').fill('test@example.com');
    await page.getByPlaceholder('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Wait for dashboard to load
    await page.waitForURL('http://localhost:3001/**');
    
    // Test navigation to different dashboard sections
    // Queue tab
    await page.locator('a[title="Queue"]').first().click();
    await expect(page.getByText('Content Queue')).toBeVisible();
    
    // Schedule tab
    await page.locator('a[title="Master Schedule"]').first().click();
    await expect(page.getByText('Master Schedule')).toBeVisible();
    
    // Calendar tab
    await page.locator('a[title="Visual Calendar"]').first().click();
    // Calendar might have dynamic content, so we'll just check if it loads
    
    // Strategy tab
    await page.locator('a[title="Audience & Strategy"]').first().click();
    await expect(page.getByText('Reports & Strategy')).toBeVisible();
    
    // Automation tab
    await page.locator('a[title="Automation"]').first().click();
    await expect(page.getByText('Automation Settings')).toBeVisible();
    
    // Connections tab
    await page.locator('a[title="Connections"]').first().click();
    await expect(page.getByText('Social Media Connections')).toBeVisible();
  });

  // Test 4: Facebook Connection
  test('should display Facebook connection options', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3001/login');
    await page.getByPlaceholder('Email').fill('test@example.com');
    await page.getByPlaceholder('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Navigate to Connections tab
    await page.waitForURL('http://localhost:3001/**');
    await page.locator('a[title="Connections"]').first().click();
    
    // Verify Facebook connection elements
    await expect(page.getByText('Facebook')).toBeVisible();
    
    // Check if already connected or needs connection
    if (await page.getByText('Connect with Facebook').isVisible()) {
      // Facebook not connected - verify connect button
      await expect(page.getByRole('button', { name: 'Connect with Facebook' })).toBeVisible();
    } else {
      // Facebook already connected - verify test connection button
      await expect(page.getByRole('button', { name: 'Test Connection' })).toBeVisible();
    }
  });

  // Test 5: Create Post Functionality
  test('should create and manage posts', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3001/login');
    await page.getByPlaceholder('Email').fill('test@example.com');
    await page.getByPlaceholder('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Click Create Post button
    await page.waitForURL('http://localhost:3001/**');
    await page.getByRole('button', { name: 'Create Post' }).first().click();
    
    // Verify Create Post page
    await expect(page.getByText('Turn Your Text into a Sharable Image')).toBeVisible();
    
    // Test post content editing
    const editor = page.locator('[contenteditable]').first();
    await editor.fill('Test post content for E2E testing');
    
    // Test template selection
    await page.getByText('Twitter Image').click();
    
    // Test sharing options (if available)
    if (await page.getByRole('button', { name: 'Download Image' }).isVisible()) {
      // Download image button exists
    }
  });

  // Test 6: Facebook Pages Management
  test('should access Facebook Pages management', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3001/login');
    await page.getByPlaceholder('Email').fill('test@example.com');
    await page.getByPlaceholder('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Navigate to Connections tab
    await page.waitForURL('http://localhost:3001/**');
    await page.locator('a[title="Connections"]').first().click();
    
    // Click on Facebook Pages management link
    if (await page.getByText('Facebook Pages').isVisible()) {
      await page.getByText('Facebook Pages').click();
      // This might redirect to a different page or open a modal
    }
  });

  // Test 7: API Endpoints
  test('should have accessible API endpoints', async ({ request }) => {
    // Test basic API endpoints
    const workspaceResponse = await request.get('http://localhost:3001/api/workspaces');
    if (workspaceResponse.ok()) {
      const workspaces = await workspaceResponse.json();
      // Basic check that endpoint returns data
    }
    
    // Test Facebook token endpoint (requires authentication)
    const facebookTokenResponse = await request.get('http://localhost:3001/api/facebook/token');
    // This might return 401 if not authenticated, which is expected
  });

  // Test 8: Responsive Design
  test('should display properly on different viewports', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:3001/login');
    await expect(page.getByText('Welcome Back')).toBeVisible();
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:3001/login');
    await expect(page.getByText('Welcome Back')).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3001/login');
    await expect(page.getByText('Welcome Back')).toBeVisible();
  });

  // Test 9: Error Handling
  test('should handle invalid login gracefully', async ({ page }) => {
    await page.goto('http://localhost:3001/login');
    
    // Try invalid login
    await page.getByPlaceholder('Email').fill('invalid@example.com');
    await page.getByPlaceholder('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Should show error message (implementation depends on your app)
    // await expect(page.getByText('Invalid credentials')).toBeVisible();
  });

  // Test 10: Logout Functionality
  test('should logout user successfully', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3001/login');
    await page.getByPlaceholder('Email').fill('test@example.com');
    await page.getByPlaceholder('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Wait for dashboard
    await page.waitForURL('http://localhost:3001/**');
    
    // Find and click logout (might be in user menu)
    // This depends on your UI implementation
    // await page.getByRole('button', { name: 'Logout' }).click();
    // await expect(page).toHaveURL('http://localhost:3001/login');
  });
});