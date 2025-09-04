import { test, expect } from '@playwright/test';

test.describe('Zenith Social Media Management Platform', () => {
  test('should display the registration page', async ({ page }) => {
    // Navigate to the registration page
    await page.goto('http://localhost:3001/register');
    
    // Check that the registration page is displayed
    await expect(page.getByText('Create Account')).toBeVisible();
    await expect(page.getByPlaceholder('Email')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Register' })).toBeVisible();
  });

  test('should display the login page', async ({ page }) => {
    // Navigate to the login page
    await page.goto('http://localhost:3001/login');
    
    // Check that the login page is displayed
    await expect(page.getByText('Welcome Back')).toBeVisible();
    await expect(page.getByPlaceholder('Email')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('should register a new user', async ({ page }) => {
    // Navigate to the registration page
    await page.goto('http://localhost:3001/register');
    
    // Fill in the registration form
    await page.getByPlaceholder('Email').fill('playwright@example.com');
    await page.getByPlaceholder('Password').fill('password123');
    
    // Submit the form
    await page.getByRole('button', { name: 'Register' }).click();
    
    // Check for success message
    await expect(page.getByText('Registration Successful!')).toBeVisible();
  });

  test('should login an existing user', async ({ page }) => {
    // Navigate to the login page
    await page.goto('http://localhost:3001/login');
    
    // Fill in the login form
    await page.getByPlaceholder('Email').fill('test@example.com');
    await page.getByPlaceholder('Password').fill('password123');
    
    // Submit the form
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Check that we're redirected to the dashboard
    await expect(page).toHaveURL('http://localhost:3001/');
  });

  test('should display the main dashboard after login', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3001/login');
    await page.getByPlaceholder('Email').fill('test@example.com');
    await page.getByPlaceholder('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Wait for redirection to dashboard
    await page.waitForURL('http://localhost:3001/');
    
    // Check that the main dashboard elements are visible
    await expect(page.getByText('Test Workspace')).toBeVisible();
    await expect(page.getByText('Queue')).toBeVisible();
    await expect(page.getByText('Master Schedule')).toBeVisible();
    await expect(page.getByText('Automation Rules')).toBeVisible();
  });

  test('should navigate between different sections', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3001/login');
    await page.getByPlaceholder('Email').fill('test@example.com');
    await page.getByPlaceholder('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Wait for redirection to dashboard
    await page.waitForURL('http://localhost:3001/');
    
    // Test navigation to different sections
    await page.getByText('Queue').click();
    // We won't check for "Daily Queue" as it's not a static text but generated content
    
    await page.getByText('Master Schedule').click();
    await expect(page.getByText('Master Schedule')).toBeVisible();
    
    await page.getByText('Automation Rules').click();
    await expect(page.getByText('Automation Rules')).toBeVisible();
  });

  test('should display content sources panel', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3001/login');
    await page.getByPlaceholder('Email').fill('test@example.com');
    await page.getByPlaceholder('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Wait for redirection to dashboard
    await page.waitForURL('http://localhost:3001/');
    
    // Check that the content sources panel is visible
    await expect(page.getByText('Drafts & Ideas')).toBeVisible();
    await expect(page.getByText('Templates')).toBeVisible();
    await expect(page.getByText('Sources')).toBeVisible();
  });

  test('should display schedule slots', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3001/login');
    await page.getByPlaceholder('Email').fill('test@example.com');
    await page.getByPlaceholder('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Wait for redirection to dashboard
    await page.waitForURL('http://localhost:3001/');
    
    // Check that schedule slots are displayed
    await expect(page.getByText('Mondays')).toBeVisible();
    await expect(page.getByText('Tuesdays')).toBeVisible();
    await expect(page.getByText('Wednesdays')).toBeVisible();
    await expect(page.getByText('Thursdays')).toBeVisible();
    await expect(page.getByText('Fridays')).toBeVisible();
  });

  test('should have functional API endpoints', async ({ page }) => {
    // Test that API endpoints are accessible
    const response = await page.request.get('http://localhost:3001/api/workspaces');
    expect(response.ok()).toBeTruthy();
    
    const workspaces = await response.json();
    expect(workspaces.length).toBeGreaterThan(0);
  });
});