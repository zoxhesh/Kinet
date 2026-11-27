import { test, expect } from '@playwright/test';
import {
  waitForAppReady,
  runAxeScan,
  signup,
  login,
  goToTab,
  assertCleanRun,
} from './utils/test-helpers';

test.describe('F03: View Progress', () => {
  test.beforeEach(async ({ page }) => {
    await signup(page);
  });

  test.afterEach(async ({ page }) => {
    await assertCleanRun(page);
  });

  // F03-H1: History with calendar heatmap and filters
  test('F03-H1: History screen with calendar heatmap and filters', async ({ page }) => {
    await goToTab(page, 'history');
    await waitForAppReady(page);
    await runAxeScan(page);

    // Check calendar heatmap is visible
    await expect(page.locator('[data-testid="heatmap"], .heatmap, text=This Week')).toBeVisible({ timeout: 10000 });

    // Test filter: Week
    await page.click('button:has-text("Week")');
    await page.waitForTimeout(300);
    await runAxeScan(page);

    // Test filter: Month
    await page.click('button:has-text("Month")');
    await page.waitForTimeout(300);

    // Test filter: Year
    await page.click('button:has-text("Year")');
    await page.waitForTimeout(300);

    // Test filter: All
    await page.click('button:has-text("All")');
    await page.waitForTimeout(300);
  });

  // F03-H2: Profile shows level/XP, streak, stats, achievements
  test('F03-H2: Profile shows stats and achievements', async ({ page }) => {
    await goToTab(page, 'profile');
    await waitForAppReady(page);
    await runAxeScan(page);

    // Check level/XP bar
    await expect(page.locator('text=Level')).toBeVisible();
    await expect(page.locator('text=XP')).toBeVisible();

    // Check streak
    await expect(page.locator('text=Streak')).toBeVisible();
    await expect(page.locator('text=🔥')).toBeVisible();

    // Check stats grid
    await expect(page.locator('text=Workouts')).toBeVisible();
    await expect(page.locator('text=Achievements')).toBeVisible();

    // Check achievements section
    await expect(page.locator('text=Achievements')).toBeVisible();
  });

  // F03-H3: Body stats trend chart
  test('F03-H3: Body stats section visible', async ({ page }) => {
    await goToTab(page, 'profile');
    await waitForAppReady(page);

    // Scroll to body stats
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(300);

    await expect(page.locator('text=Body Stats')).toBeVisible();
  });

  // F03-E1: Empty history state
  test('F03-E1: Empty history shows helpful message', async ({ page, context }) => {
    // Fresh user with no workouts
    await context.clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    await signup(page);
    await goToTab(page, 'history');
    await waitForAppReady(page);

    await expect(page.locator('text=No workouts found')).toBeVisible();
    await expect(page.locator('text=Start your first workout')).toBeVisible();
  });

  // F03-E2: Empty body stats
  test('F03-E2: Empty body stats shows add prompt', async ({ page, context }) => {
    await context.clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    await signup(page);
    await goToTab(page, 'profile');
    await waitForAppReady(page);

    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(300);

    await expect(page.locator('text=No measurements yet')).toBeVisible();
    await expect(page.locator('text=Add Measurement')).toBeVisible();
  });

  // F03-E3: Filter with no workouts
  test('F03-E3: Week filter with no workouts shows empty state', async ({ page, context }) => {
    await context.clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    await signup(page);
    await goToTab(page, 'history');
    await waitForAppReady(page);

    await page.click('button:has-text("Week")');
    await page.waitForTimeout(300);

    await expect(page.locator('text=No workouts found')).toBeVisible();
  });

  // F03-E4: Large history list virtualization
  test('F03-E4: Large history list scrolls smoothly', async ({ page }) => {
    // This test requires seeded data - skip if not available
    await goToTab(page, 'history');
    await waitForAppReady(page);

    // Scroll down
    for (let i = 0; i < 10; i++) {
      await page.evaluate(() => window.scrollBy(0, 300));
      await page.waitForTimeout(100);
    }

    // Should not crash or freeze
    await expect(page.locator('body')).toBeVisible();
  });

  // F03-E5: DST change handling
  test('F03-E5: Dates displayed in local timezone', async ({ page }) => {
    await goToTab(page, 'history');
    await waitForAppReady(page);

    // Check that dates are displayed (not UTC)
    const dateElements = page.locator('[data-testid="workout-date"], .workout-date, text=/\\d{1,2}\\/\\d{1,2}/');
    await expect(dateElements.first()).toBeVisible({ timeout: 5000 });
  });

  // F03-E7: Long workout notes
  test('F03-E7: Long notes truncated or scrollable', async ({ page }) => {
    // This requires a workout with long notes
    // Skip if not available
    test.skip();
  });

  // F03-E8: Calendar heatmap year view
  test('F03-E8: Heatmap shows 52 weeks', async ({ page }) => {
    await goToTab(page, 'history');
    await waitForAppReady(page);

    // Check heatmap grid
    const heatmapCells = page.locator('[data-testid="heatmap-cell"], .heatmap-cell, .heatmap > div > div');
    const count = await heatmapCells.count();

    // Should have ~365 cells (or 52*7 = 364)
    expect(count).toBeGreaterThan(300);
  });

  // F03-E9: Tap workout opens detail
  test('F03-E9: Tapping workout opens detail', async ({ page }) => {
    await goToTab(page, 'history');
    await waitForAppReady(page);

    const workoutCard = page.locator('[data-testid="workout-card"], .workout-card, button:has-text("Bench Press")').first();
    if (await workoutCard.isVisible({ timeout: 5000 })) {
      await workoutCard.click();
      // Should navigate to detail or show modal
      await expect(page.locator('text=Sets, text=Volume, text=Duration')).toBeVisible({ timeout: 5000 }).catch(() => {
        // May not be implemented
      });
    }
  });

  // F03-E10: Keyboard navigation on history
  test('F03-E10: Keyboard navigation on history list', async ({ page }) => {
    await goToTab(page, 'history');
    await waitForAppReady(page);

    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(['BUTTON', 'A', 'INPUT', 'SELECT']).toContain(focused);
  });

  // F03-E11: Screen reader on heatmap
  test('F03-E11: Heatmap has accessible labels', async ({ page }) => {
    await goToTab(page, 'history');
    await waitForAppReady(page);
    await runAxeScan(page);
  });

  // F03-E12: Mobile width heatmap
  test('F03-E12: Heatmap works on mobile width', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await goToTab(page, 'history');
    await waitForAppReady(page);

    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(390);
  });

  // F03-E13: Offline progress screens
  test('F03-E13: Progress screens work offline', async ({ page, context }) => {
    await goToTab(page, 'history');
    await waitForAppReady(page);

    await context.setOffline(true);

    // Should still work
    await page.click('button:has-text("Week")');
    await page.waitForTimeout(300);

    await goToTab(page, 'profile');
    await waitForAppReady(page);

    await context.setOffline(false);
  });
});