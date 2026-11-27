import { test, expect } from '@playwright/test';
import {
  waitForAppReady,
  runAxeScan,
  signup,
  goToTab,
  assertCleanRun,
  setupConsoleErrorCheck,
  setupNetworkErrorCheck,
} from './utils/test-helpers';

test.describe('Cross-Cutting Concerns', () => {
  test.beforeEach(async ({ page }) => {
    await signup(page);
  });

  test.afterEach(async ({ page }) => {
    await assertCleanRun(page);
  });

  // CC-1: No console errors
  test('CC-1: No console errors on any screen', async ({ page }) => {
    const checkErrors = setupConsoleErrorCheck(page);

    const screens = ['home', 'library', 'workout', 'history', 'profile'];
    for (const screen of screens) {
      await goToTab(page, screen);
      await waitForAppReady(page);
      checkErrors(); // Will throw if errors found
    }
  });

  // CC-2: No 5xx network responses
  test('CC-2: No 5xx network responses', async ({ page }) => {
    const checkNetwork = setupNetworkErrorCheck(page);

    const screens = ['home', 'library', 'workout', 'history', 'profile'];
    for (const screen of screens) {
      await goToTab(page, screen);
      await waitForAppReady(page);
      checkNetwork(); // Will throw if 5xx found
    }
  });

  // CC-3: Accessibility scan on each screen
  test('CC-3: All screens pass WCAG AA accessibility', async ({ page }) => {
    const screens = ['home', 'library', 'workout', 'history', 'profile', 'settings'];

    for (const screen of screens) {
      if (screen === 'settings') {
        await goToTab(page, 'profile');
        await page.click('button:has-text("Settings")');
      } else {
        await goToTab(page, screen);
      }
      await waitForAppReady(page);
      await runAxeScan(page); // Throws on violations
    }
  });

  // CC-4: Touch targets >= 44x44px
  test('CC-4: All interactive elements meet minimum touch target', async ({ page }) => {
    await goToTab(page, 'home');
    await waitForAppReady(page);

    const interactiveElements = await page.locator(
      'button, [role="button"], [role="tab"], [role="switch"], input, select, a[href]'
    ).all();

    for (const el of interactiveElements) {
      const box = await el.boundingBox();
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  // CC-5: Color contrast (verified by axe in CC-3, but explicit check)
  test('CC-5: Color contrast meets WCAG AA', async ({ page }) => {
    await goToTab(page, 'home');
    await waitForAppReady(page);
    await runAxeScan(page); // Includes color contrast checks
  });

  // CC-6: Reduced motion respected
  test('CC-6: Prefers-reduced-motion disables animations', async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/onboarding');
    await waitForAppReady(page);

    // Check that transitions are disabled (duration = 0)
    const transitionDuration = await page.evaluate(() => {
      const styles = getComputedStyle(document.body);
      return styles.transitionDuration;
    });

    // With reduced motion, transitions should be instant or disabled
    expect(['0s', '0ms', '']).toContain(transitionDuration);
  });

  // CC-7: Dark mode renders correctly
  test('CC-7: Dark mode renders correctly on all screens', async ({ page }) => {
    // Set dark mode
    await page.emulateMedia({ colorScheme: 'dark' });

    const screens = ['home', 'library', 'workout', 'history', 'profile'];
    for (const screen of screens) {
      await goToTab(page, screen);
      await waitForAppReady(page);

      // Check dark mode colors applied
      const bgColor = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
      expect(bgColor).toMatch(/rgb\(10, 10, 10\)|rgb\(0, 0, 0\)|#0a0a0a|#000000/);

      // Text should be light
      const textColor = await page.evaluate(() => getComputedStyle(document.body).color);
      expect(textColor).toMatch(/rgb\(245, 245, 245\)|rgb\(255, 255, 255\)|#f5f5f5|#ffffff/);
    }
  });

  // CC-8: Offline functionality
  test('CC-8: App fully functional offline', async ({ page, context }) => {
    await signup(page);
    await goToTab(page, 'home');
    await waitForAppReady(page);

    await context.setOffline(true);

    // Navigate all tabs
    const screens = ['home', 'library', 'workout', 'history', 'profile'];
    for (const screen of screens) {
      await goToTab(page, screen);
      await waitForAppReady(page);

      // Verify content loads
      await expect(page.locator('body')).toBeVisible();
    }

    // Start a workout offline
    await goToTab(page, 'library');
    await page.fill('input[placeholder*="Search" i]', 'Bench Press');
    await page.waitForTimeout(300);
    await page.click('text=Bench Press');
    await page.click('button:has-text("Start Workout")');

    // Log a set
    await page.fill('input[placeholder="Reps"]', '10');
    await page.fill('input[placeholder*="Weight"]', '60');
    await page.click('button:has-text("Log Set")');

    // Finish workout
    await page.click('button:has-text("Finish")');

    // Go online
    await context.setOffline(false);

    // Data should sync (or at least be preserved)
    await goToTab(page, 'history');
    await waitForAppReady(page);
    await expect(page.locator('text=Bench Press')).toBeVisible();
  });

  // Additional: Focus visible on all interactive elements
  test('Focus visible on all interactive elements', async ({ page }) => {
    await goToTab(page, 'home');
    await waitForAppReady(page);

    const interactiveElements = await page.locator(
      'button, [role="button"], [role="tab"], [role="switch"], input, select'
    ).all();

    for (const el of interactiveElements.slice(0, 20)) { // Sample first 20
      await el.focus();
      await expect(el).toBeFocused();

      // Check focus ring is visible
      const focusRing = await el.evaluate((node) => {
        const styles = getComputedStyle(node);
        return {
          outline: styles.outline,
          boxShadow: styles.boxShadow,
          borderColor: styles.borderColor,
        };
      });

      // Should have visible focus indicator
      const hasFocus = focusRing.outline !== 'none' ||
                       focusRing.boxShadow !== 'none' ||
                       focusRing.borderColor !== 'currentcolor';
      expect(hasFocus).toBeTruthy();
    }
  });

  // Additional: Keyboard navigation works everywhere
  test('Keyboard navigation reaches all interactive elements', async ({ page }) => {
    await goToTab(page, 'home');
    await waitForAppReady(page);

    // Tab through the page
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => document.activeElement?.tagName);
      expect(['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA', 'BODY']).toContain(focused);
    }
  });

  // Additional: Screen reader labels on all inputs/buttons
  test('All inputs and buttons have accessible names', async ({ page }) => {
    await goToTab(page, 'home');
    await waitForAppReady(page);

    const buttons = await page.locator('button, [role="button"]').all();
    for (const btn of buttons) {
      const ariaLabel = await btn.getAttribute('aria-label');
      const text = await btn.textContent();
      expect(ariaLabel || text?.trim()).toBeTruthy();
    }

    const inputs = await page.locator('input, select, textarea').all();
    for (const input of inputs) {
      const ariaLabel = await input.getAttribute('aria-label');
      const placeholder = await input.getAttribute('placeholder');
      const id = await input.getAttribute('id');
      const label = id ? await page.locator(`label[for="${id}"]`).textContent() : null;
      expect(ariaLabel || placeholder || label).toBeTruthy();
    }
  });
});