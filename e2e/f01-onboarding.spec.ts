import { test, expect } from '@playwright/test';
import {
  waitForAppReady,
  setupConsoleErrorCheck,
  setupNetworkErrorCheck,
  runAxeScan,
  signup,
  SELECTORS,
  TEST_USER,
  assertCleanRun,
} from './utils/test-helpers';

test.describe('F01: New User Onboarding', () => {
  test.beforeEach(async ({ page }) => {
    // Clear storage to simulate fresh install
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test.afterEach(async ({ page }) => {
    await assertCleanRun(page);
  });

  // F01-H1: Complete onboarding and account creation
  test('F01-H1: Complete onboarding flow and create account', async ({ page }) => {
    await page.goto('/onboarding');
    await waitForAppReady(page);

    // Step through 4 onboarding screens
    for (let i = 0; i < 3; i++) {
      await runAxeScan(page);
      await expect(page.locator('text=Next')).toBeVisible();
      await page.click('button:has-text("Next")');
      await page.waitForTimeout(300);
    }

    // Final screen - "Get Started"
    await runAxeScan(page);
    await expect(page.locator('button:has-text("Get Started")')).toBeVisible();
    await page.click('button:has-text("Get Started")');

    // Should redirect to signup
    await expect(page).toHaveURL(/\/auth\/signup/);

    // Create account
    const testUser = {
      ...TEST_USER,
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@kinet.app`,
    };

    await page.fill('input[placeholder*="username" i]', testUser.username);
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', TEST_USER.password);

    const passwordInputs = page.locator('input[type="password"]');
    await passwordInputs.nth(1).fill(TEST_USER.password);

    await page.click('button:has-text("Create Account")');

    // Should land on home screen
    await expect(page).toHaveURL(/\/\(tabs\)\//);
    await expect(page.locator('text=Good morning')).toBeVisible({ timeout: 10000 });
  });

  // F01-E1: Skip onboarding
  test('F01-E1: Skip onboarding goes to auth', async ({ page }) => {
    await page.goto('/onboarding');
    await waitForAppReady(page);

    await page.click('button:has-text("Skip")');
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  // F01-E2: Username validation - too short
  test('F01-E2: Username < 3 chars shows error', async ({ page }) => {
    await page.goto('/auth/signup');
    await waitForAppReady(page);

    await page.fill('input[placeholder*="username" i]', 'ab');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');

    const passwordInputs = page.locator('input[type="password"]');
    await passwordInputs.nth(1).fill('password123');

    await page.click('button:has-text("Create Account")');

    await expect(page.locator('text=Username must be at least 3 characters')).toBeVisible();
  });

  // F01-E3: Username with emoji/accents
  test('F01-E3: Username with emoji and accents accepted', async ({ page }) => {
    await page.goto('/auth/signup');
    await waitForAppReady(page);

    const uniqueName = `josé💪_${Date.now()}`;
    await page.fill('input[placeholder*="username" i]', uniqueName);
    await page.fill('input[type="email"]', `test_${Date.now()}@example.com`);
    await page.fill('input[type="password"]', 'password123');

    const passwordInputs = page.locator('input[type="password"]');
    await passwordInputs.nth(1).fill('password123');

    await page.click('button:has-text("Create Account")');
    await expect(page).toHaveURL(/\/\(tabs\)\//);
  });

  // F01-E4: Invalid email format
  test('F01-E4: Invalid email shows error', async ({ page }) => {
    await page.goto('/auth/signup');
    await waitForAppReady(page);

    await page.fill('input[placeholder*="username" i]', 'testuser');
    await page.fill('input[type="email"]', 'notanemail');
    await page.fill('input[type="password"]', 'password123');

    const passwordInputs = page.locator('input[type="password"]');
    await passwordInputs.nth(1).fill('password123');

    await page.click('button:has-text("Create Account")');

    await expect(page.locator('text=Please enter a valid email')).toBeVisible();
  });

  // F01-E5: Password too short
  test('F01-E5: Password < 6 chars shows error', async ({ page }) => {
    await page.goto('/auth/signup');
    await waitForAppReady(page);

    await page.fill('input[placeholder*="username" i]', 'testuser');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', '123');
    await page.fill('input[type="password"]:nth-child(2)', '123');

    await page.click('button:has-text("Create Account")');

    await expect(page.locator('text=Password must be at least 6 characters')).toBeVisible();
  });

  // F01-E6: Passwords don't match
  test('F01-E6: Mismatched passwords show error', async ({ page }) => {
    await page.goto('/auth/signup');
    await waitForAppReady(page);

    await page.fill('input[placeholder*="username" i]', 'testuser');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.fill('input[type="password"]:nth-child(2)', 'different123');

    await page.click('button:has-text("Create Account")');

    await expect(page.locator('text=Passwords do not match')).toBeVisible();
  });

  // F01-E12: Offline mode - account creation works offline
  test('F01-E12: Account creation works offline', async ({ page, context }) => {
    await page.goto('/auth/signup');
    await waitForAppReady(page);

    // Go offline
    await context.setOffline(true);

    const uniqueName = `offline_${Date.now()}`;
    await page.fill('input[placeholder*="username" i]', uniqueName);
    await page.fill('input[type="email"]', `offline_${Date.now()}@example.com`);
    await page.fill('input[type="password"]', 'password123');

    const passwordInputs = page.locator('input[type="password"]');
    await passwordInputs.nth(1).fill('password123');

    await page.click('button:has-text("Create Account")');

    // Should still work - local DB
    await expect(page).toHaveURL(/\/\(tabs\)\//, { timeout: 10000 });

    await context.setOffline(false);
  });

  // F01-E13: Keyboard navigation on onboarding
  test('F01-E13: Keyboard navigation works on onboarding', async ({ page }) => {
    await page.goto('/onboarding');
    await waitForAppReady(page);

    // Tab to first focusable element
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(['BUTTON', 'A', 'INPUT']).toContain(focused);
  });

  // F01-E14: Screen reader labels on onboarding
  test('F01-E14: Onboarding has accessible labels', async ({ page }) => {
    await page.goto('/onboarding');
    await waitForAppReady(page);
    await runAxeScan(page);
  });

  // F01-E15: Mobile width - no horizontal overflow
  test('F01-E15: Onboarding fits mobile width', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/onboarding');
    await waitForAppReady(page);

    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(390);
  });

  // F01-N1: Login with wrong password
  test('F01-N1: Wrong password shows error', async ({ page }) => {
    // First create a user
    await signup(page);

    // Logout
    await page.click('button:has-text("Profile")');
    await page.click('button:has-text("Settings")');
    await page.click('button:has-text("Log Out")');

    // Try login with wrong password
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button:has-text("Sign In")');

    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });

  // F01-N3: Duplicate email
  test('F01-N3: Duplicate email shows error', async ({ page }) => {
    await signup(page);

    // Try to signup again with same email
    await page.goto('/auth/signup');
    await waitForAppReady(page);

    await page.fill('input[placeholder*="username" i]', 'anotheruser');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', 'password123');
    const passwordInputs = page.locator('input[type="password"]');
    await passwordInputs.nth(1).fill('password123');

    await page.click('button:has-text("Create Account")');

    await expect(page.locator('text=Email already registered')).toBeVisible();
  });
});