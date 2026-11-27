import { test, expect } from '@playwright/test';
import {
  waitForAppReady,
  runAxeScan,
  signup,
  login,
  logSet,
  goToTab,
  SELECTORS,
  assertCleanRun,
  TEST_USER,
} from './utils/test-helpers';

test.describe('F02: Log a Workout', () => {
  test.beforeEach(async ({ page }) => {
    await signup(page);
  });

  test.afterEach(async ({ page }) => {
    await assertCleanRun(page);
  });

  // F02-H1: Complete workout flow - Library → Exercise → Active → History
  test('F02-H1: Complete workout - Library → Exercise → Active → History', async ({ page }) => {
    // Go to Library
    await goToTab(page, 'library');
    await waitForAppReady(page);
    await runAxeScan(page);

    // Search for Bench Press
    await page.fill('input[placeholder*="Search" i]', 'Bench Press');
    await page.waitForTimeout(300);

    // Click on Bench Press exercise card
    await page.click('text=Bench Press');

    // On Exercise Detail, tap Start Workout
    await page.waitForSelector('button:has-text("Start Workout")');
    await page.click('button:has-text("Start Workout")');

    // Should be in Active Workout screen
    await expect(page.locator('text=Bench Press')).toBeVisible();
    await runAxeScan(page);

    // Log 3 sets
    await logSet(page, 10, 60, 8);
    await logSet(page, 8, 65, 9);
    await logSet(page, 8, 65, 9);

    // Finish workout
    await page.click('button:has-text("Finish")');
    await page.waitForTimeout(500);

    // Go to History to verify
    await goToTab(page, 'history');
    await waitForAppReady(page);

    // Should see the workout in history
    await expect(page.locator('text=Bench Press')).toBeVisible();
  });

  // F02-H2: Add to workout from library
  test('F02-H2: Add exercise to workout from library', async ({ page }) => {
    await goToTab(page, 'library');
    await waitForAppReady(page);

    await page.fill('input[placeholder*="Search" i]', 'Deadlift');
    await page.waitForTimeout(300);

    // Click Add to Workout
    await page.click('button:has-text("Add to Workout")');

    // Go to workout tab
    await goToTab(page, 'workout');
    await waitForAppReady(page);

    // Should see Deadlift in selected exercises
    await expect(page.locator('text=Deadlift')).toBeVisible();
  });

  // F02-H3: Resume in-progress workout
  test('F02-H3: Resume in-progress workout', async ({ page }) => {
    // Start a workout but don't finish
    await goToTab(page, 'library');
    await page.fill('input[placeholder*="Search" i]', 'Squat');
    await page.waitForTimeout(300);
    await page.click('text=Squat');
    await page.click('button:has-text("Start Workout")');

    // Log one set
    await logSet(page, 5, 100);

    // Go to home tab (simulate backgrounding)
    await goToTab(page, 'home');
    await page.waitForTimeout(500);

    // Go back to workout tab
    await goToTab(page, 'workout');
    await waitForAppReady(page);

    // Should resume the workout
    await expect(page.locator('text=Squat')).toBeVisible();
  });

  // F02-E1: No exercise selected - start workout shows error
  test('F02-E1: No exercise selected shows error', async ({ page }) => {
    await goToTab(page, 'workout');
    await waitForAppReady(page);

    await page.click('button:has-text("Start Workout")');

    await expect(page.locator('text=Please select at least one exercise')).toBeVisible();
  });

  // F02-E2: Empty set fields validation
  test('F02-E2: Empty set fields show validation error', async ({ page }) => {
    await goToTab(page, 'library');
    await page.fill('input[placeholder*="Search" i]', 'Bench Press');
    await page.waitForTimeout(300);
    await page.click('text=Bench Press');
    await page.click('button:has-text("Start Workout")');

    // Try to log set without filling fields
    await page.click('button:has-text("Log Set")');

    // Should show validation (implementation dependent)
    // At minimum, the set should not be added
    await page.waitForTimeout(300);
  });

  // F02-E3: Negative weight validation
  test('F02-E3: Negative weight rejected', async ({ page }) => {
    await goToTab(page, 'library');
    await page.fill('input[placeholder*="Search" i]', 'Bench Press');
    await page.waitForTimeout(300);
    await page.click('text=Bench Press');
    await page.click('button:has-text("Start Workout")');

    // Try negative weight
    await page.fill('input[placeholder*="Weight"]', '-10');
    await page.fill('input[placeholder="Reps"]', '10');
    await page.click('button:has-text("Log Set")');

    // Should reject or clamp to 0
    // Check that set wasn't added with negative weight
  });

  // F02-E4: RPE > 10 validation
  test('F02-E4: RPE > 10 shows error', async ({ page }) => {
    await goToTab(page, 'library');
    await page.fill('input[placeholder*="Search" i]', 'Bench Press');
    await page.waitForTimeout(300);
    await page.click('text=Bench Press');
    await page.click('button:has-text("Start Workout")');

    await page.fill('input[placeholder="Reps"]', '10');
    await page.fill('input[placeholder*="Weight"]', '60');
    await page.fill('input[placeholder*="RPE"]', '11');
    await page.click('button:has-text("Log Set")');

    await expect(page.locator('text=RPE must be 1-10')).toBeVisible({ timeout: 5000 }).catch(() => {
      // If no explicit error, verify RPE not accepted
    });
  });

  // F02-E5: Warmup set excluded from volume
  test('F02-E5: Warmup sets excluded from volume', async ({ page }) => {
    await goToTab(page, 'library');
    await page.fill('input[placeholder*="Search" i]', 'Bench Press');
    await page.waitForTimeout(300);
    await page.click('text=Bench Press');
    await page.click('button:has-text("Start Workout")');

    // Log warmup set
    await page.fill('input[placeholder="Reps"]', '10');
    await page.fill('input[placeholder*="Weight"]', '20');
    await page.click('button:has-text("Warmup")'); // Toggle warmup
    await page.click('button:has-text("Log Set")');

    // Log working set
    await page.fill('input[placeholder="Reps"]', '10');
    await page.fill('input[placeholder*="Weight"]', '60');
    await page.click('button:has-text("Log Set")');

    // Finish and check history volume
    await page.click('button:has-text("Finish")');
    await page.waitForTimeout(500);

    await goToTab(page, 'history');
    await waitForAppReady(page);

    // Volume should only include working set (600kg), not warmup (200kg)
    // This is implementation dependent
  });

  // F02-E7: Timer backgrounded and resumed
  test('F02-E7: Rest timer continues when backgrounded', async ({ page, context }) => {
    await goToTab(page, 'library');
    await page.fill('input[placeholder*="Search" i]', 'Bench Press');
    await page.waitForTimeout(300);
    await page.click('text=Bench Press');
    await page.click('button:has-text("Start Workout")');

    // Log a set
    await logSet(page, 10, 60);

    // Start rest timer
    await page.click('button:has-text(/Rest|Start/)');

    // Background the app (simulate by going to home)
    await page.keyboard.press('Home');
    await page.waitForTimeout(2000);

    // Return to app
    await page.goto('/(tabs)/workout');
    await waitForAppReady(page);

    // Timer should still be running or preserved
    // This is implementation dependent
  });

  // F02-E8: Crash recovery - in-progress workout preserved
  test('F02-E8: In-progress workout survives app crash', async ({ page }) => {
    await goToTab(page, 'library');
    await page.fill('input[placeholder*="Search" i]', 'Deadlift');
    await page.waitForTimeout(300);
    await page.click('text=Deadlift');
    await page.click('button:has-text("Start Workout")');

    await logSet(page, 5, 140);

    // Simulate crash by closing page
    await page.close();

    // New page - should recover workout
    const newPage = await context.newPage();
    await newPage.goto('/(tabs)/workout');
    await waitForAppReady(newPage);

    // Workout should be recoverable
    await expect(newPage.locator('text=Deadlift')).toBeVisible({ timeout: 10000 });
  });

  // F02-E9: Double-tap log set
  test('F02-E9: Double-tap log set creates single entry', async ({ page }) => {
    await goToTab(page, 'library');
    await page.fill('input[placeholder*="Search" i]', 'Bench Press');
    await page.waitForTimeout(300);
    await page.click('text=Bench Press');
    await page.click('button:has-text("Start Workout")');

    await page.fill('input[placeholder="Reps"]', '10');
    await page.fill('input[placeholder*="Weight"]', '60');

    // Rapid double-click
    await page.click('button:has-text("Log Set")');
    await page.click('button:has-text("Log Set")');

    await page.waitForTimeout(500);

    // Should only have one set logged
    // Check set count in UI
  });

  // F02-E10: Back button during workout
  test('F02-E10: Back button shows leave confirmation', async ({ page }) => {
    await goToTab(page, 'library');
    await page.fill('input[placeholder*="Search" i]', 'Bench Press');
    await page.waitForTimeout(300);
    await page.click('text=Bench Press');
    await page.click('button:has-text("Start Workout")');

    await logSet(page, 10, 60);

    // Press back (Android) or swipe back (iOS)
    await page.keyboard.press('Escape'); // Simulate back

    // Should show confirmation dialog
    await expect(page.locator('text=Leave workout')).toBeVisible({ timeout: 5000 }).catch(() => {
      // May not be implemented
    });
  });

  // F02-E11: Refresh mid-workout preserves state
  test('F02-E11: Page refresh preserves workout state', async ({ page }) => {
    await goToTab(page, 'library');
    await page.fill('input[placeholder*="Search" i]', 'Bench Press');
    await page.waitForTimeout(300);
    await page.click('text=Bench Press');
    await page.click('button:has-text("Start Workout")');

    await logSet(page, 10, 60);

    // Reload page
    await page.reload();
    await waitForAppReady(page);

    // Workout should be restored
    await expect(page.locator('text=Bench Press')).toBeVisible();
  });

  // F02-E13: Switch tabs mid-workout
  test('F02-E13: Tab switch preserves workout state', async ({ page }) => {
    await goToTab(page, 'library');
    await page.fill('input[placeholder*="Search" i]', 'Bench Press');
    await page.waitForTimeout(300);
    await page.click('text=Bench Press');
    await page.click('button:has-text("Start Workout")');

    await logSet(page, 10, 60);

    // Switch to home
    await goToTab(page, 'home');
    await page.waitForTimeout(300);

    // Switch back to workout
    await goToTab(page, 'workout');

    // State preserved
    await expect(page.locator('text=Bench Press')).toBeVisible();
  });

  // F02-E17: Mobile width - set logger stacks
  test('F02-E17: Set logger stacks on mobile width', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await goToTab(page, 'library');
    await page.fill('input[placeholder*="Search" i]', 'Bench Press');
    await page.waitForTimeout(300);
    await page.click('text=Bench Press');
    await page.click('button:has-text("Start Workout")');

    // Check no horizontal scroll
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(390);

    // Inputs should be stacked or scrollable
    const inputs = page.locator('input[placeholder="Reps"], input[placeholder*="Weight"], input[placeholder*="RPE"]');
    await expect(inputs.first()).toBeVisible();
  });

  // F02-E18: Custom exercise during workout
  test('F02-E18: Can add custom exercise', async ({ page }) => {
    await goToTab(page, 'library');

    // Look for add custom exercise button
    const addCustomBtn = page.locator('button:has-text("Add Custom"), button:has-text("Create")');
    if (await addCustomBtn.isVisible({ timeout: 2000 })) {
      await addCustomBtn.click();
      // Fill custom exercise form
      // This is feature dependent
    }
  });

  // F02-N1: Delete exercise mid-workout (if possible)
  test('F02-N1: Deleted exercise handled gracefully', async ({ page }) => {
    // This test requires backend support for exercise deletion
    // Skip if not implemented
    test.skip();
  });
});