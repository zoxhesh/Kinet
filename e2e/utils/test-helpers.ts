import { test, expect, Page, Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Test helper utilities for Kinet e2e tests
 */

export const TEST_USER = {
  email: 'test@kinet.app',
  password: 'password123',
  username: 'testuser',
};

export const SELECTORS = {
  // Onboarding
  onboardingSkip: 'button:has-text("Skip")',
  onboardingNext: 'button:has-text("Next")',
  onboardingGetStarted: 'button:has-text("Get Started")',

  // Auth
  emailInput: 'input[type="email"]',
  passwordInput: 'input[type="password"]',
  usernameInput: 'input[type="text"]',
  loginButton: 'button:has-text("Sign In")',
  signupButton: 'button:has-text("Create Account")',
  signupLink: 'button:has-text("Sign Up")',
  loginLink: 'button:has-text("Sign In")',
  forgotPassword: 'button:has-text("Forgot?")',

  // Home
  tabHome: 'button:has-text("Home")',
  tabLibrary: 'button:has-text("Library")',
  tabWorkout: 'button:has-text("Workout")',
  tabProfile: 'button:has-text("Profile")',
  tabHistory: 'button:has-text("History")',

  // Library
  searchInput: 'input[placeholder*="Search"]',
  filterMuscle: 'button:has-text("Chest")',
  filterEquipment: 'button:has-text("Barbell")',
  exerciseCard: '[data-testid="exercise-card"]',
  exerciseName: 'text=/Bench Press/i',

  // Exercise Detail
  startWorkoutBtn: 'button:has-text("Start Workout")',
  addToWorkoutBtn: 'button:has-text("Add to Workout")',

  // Active Workout
  setLoggerReps: 'input[placeholder="Reps"]',
  setLoggerWeight: 'input[placeholder*="Weight"]',
  setLoggerRPE: 'input[placeholder*="RPE"]',
  warmupToggle: 'button:has-text("Warmup")',
  logSetBtn: 'button:has-text("Log Set")',
  nextExerciseBtn: 'button:has-text("Next Exercise")',
  finishWorkoutBtn: 'button:has-text("Finish")',
  restTimer: 'button:has-text(/Rest|Start/)',

  // History
  historyTab: 'button:has-text("History")',
  filterWeek: 'button:has-text("Week")',
  filterMonth: 'button:has-text("Month")',
  filterYear: 'button:has-text("Year")',
  workoutCard: '[data-testid="workout-card"]',

  // Profile
  profileTab: 'button:has-text("Profile")',
  settingsBtn: 'button:has-text("Settings")',

  // Settings
  exportBtn: 'button:has-text("Export")',
  logoutBtn: 'button:has-text("Log Out")',
  deleteAccountBtn: 'button:has-text("Delete Account")',

  // Modals/Toasts
  toast: '[role="status"], [role="alert"]',
  modal: '[role="dialog"]',
  modalClose: 'button:has-text("Close"), button[aria-label="Close"]',
};

/**
 * Wait for app to be ready (hydration complete)
 */
export async function waitForAppReady(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000); // Allow React hydration
}

/**
 * Check for console errors
 */
export function setupConsoleErrorCheck(page: Page) {
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  page.on('pageerror', error => {
    errors.push(error.message);
  });
  return () => {
    if (errors.length > 0) {
      throw new Error(`Console errors detected:\n${errors.join('\n')}`);
    }
  };
}

/**
 * Check for failed network requests (5xx)
 */
export function setupNetworkErrorCheck(page: Page) {
  const failedRequests: string[] = [];
  page.on('response', response => {
    if (response.status() >= 500) {
      failedRequests.push(`${response.status()} ${response.url()}`);
    }
  });
  return () => {
    if (failedRequests.length > 0) {
      throw new Error(`Failed requests (5xx):\n${failedRequests.join('\n')}`);
    }
  };
}

/**
 * Run accessibility scan on current page
 */
export async function runAxeScan(page: Page) {
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  const violations = accessibilityScanResults.violations;
  if (violations.length > 0) {
    const details = violations.map(v =>
      `${v.id}: ${v.description} (${v.impact})\n  Nodes: ${v.nodes.length}\n  Help: ${v.helpUrl}`
    ).join('\n\n');
    throw new Error(`Accessibility violations (${violations.length}):\n${details}`);
  }
}

/**
 * Login as test user
 */
export async function login(page: Page) {
  await page.goto('/auth/login');
  await waitForAppReady(page);

  await page.fill(SELECTORS.emailInput, TEST_USER.email);
  await page.fill(SELECTORS.passwordInput, TEST_USER.password);
  await page.click(SELECTORS.loginButton);
  await page.waitForURL('/(tabs)');
  await waitForAppReady(page);
}

/**
 * Signup new user
 */
export async function signup(page: Page, user = TEST_USER) {
  await page.goto('/auth/signup');
  await waitForAppReady(page);

  await page.fill(SELECTORS.usernameInput, user.username);
  await page.fill(SELECTORS.emailInput, user.email);
  await page.fill(SELECTORS.passwordInput, user.password);
  // Confirm password - need to find second password field
  const passwordInputs = page.locator('input[type="password"]');
  await passwordInputs.nth(1).fill(user.password);

  await page.click(SELECTORS.signupButton);
  await page.waitForURL('/(tabs)');
  await waitForAppReady(page);
}

/**
 * Navigate to tab by name
 */
export async function goToTab(page: Page, tabName: string) {
  const tabMap: Record<string, string> = {
    home: SELECTORS.tabHome,
    library: SELECTORS.tabLibrary,
    workout: SELECTORS.tabWorkout,
    profile: SELECTORS.tabProfile,
    history: SELECTORS.tabHistory,
  };
  await page.click(tabMap[tabName.toLowerCase()]);
  await page.waitForTimeout(300);
}

/**
 * Fill set logger form
 */
export async function logSet(page: Page, reps: number, weight: number, rpe?: number, warmup = false) {
  await page.fill(SELECTORS.setLoggerReps, String(reps));
  await page.fill(SELECTORS.setLoggerWeight, String(weight));
  if (rpe) {
    await page.fill(SELECTORS.setLoggerRPE, String(rpe));
  }
  if (warmup) {
    await page.click(SELECTORS.warmupToggle);
  }
  await page.click(SELECTORS.logSetBtn);
  await page.waitForTimeout(300);
}

/**
 * Assert no console errors or network failures
 */
export async function assertCleanRun(page: Page) {
  const consoleCheck = setupConsoleErrorCheck(page);
  const networkCheck = setupNetworkErrorCheck(page);

  // These will throw if errors found
  consoleCheck();
  networkCheck();
}

/**
 * Take screenshot for visual regression
 */
export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({ path: `e2e/screenshots/${name}.png`, fullPage: true });
}

/**
 * Check element is visible and accessible
 */
export async function expectAccessible(locator: Locator, name?: string) {
  await expect(locator).toBeVisible();
  if (name) {
    await expect(locator).toHaveAttribute('aria-label', name);
  }
}

/**
 * Test keyboard navigation
 */
export async function testKeyboardNavigation(page: Page, containerSelector: string) {
  const container = page.locator(containerSelector);
  await container.focus();

  // Tab through all focusable elements
  const focusableElements = await container.locator(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ).all();

  for (const el of focusableElements) {
    await el.focus();
    await expect(el).toBeFocused();
  }
}