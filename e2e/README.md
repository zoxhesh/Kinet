# E2E Test Suite: Kinet

## Running Tests

### Prerequisites

```bash
# Start Expo web server (in separate terminal)
npm run web

# Run Playwright tests
npx playwright test

# Run with UI
npx playwright test --ui

# Run specific test file
npx playwright test e2e/f01-onboarding.spec.ts

# Run on specific browser
npx playwright test --project="Mobile Chrome"

# Generate report
npx playwright show-report
```

## Test Structure

| File | Flow | Description |
|------|------|-------------|
| `f01-onboarding.spec.ts` | F01 | Onboarding + Auth |
| `f02-log-workout.spec.ts` | F02 | Log a Workout |
| `f03-progress.spec.ts` | F03 | View Progress |
| `f05-settings.spec.ts` | F05 | Settings Management |
| `cross-cutting.spec.ts` | CC | Cross-cutting concerns |

## Running Order

1. **F01** - Onboarding & Auth (prerequisite for all)
2. **F02** - Log Workout (core loop)
3. **F03** - Progress (depends on F02 data)
4. **F05** - Settings (independent)
5. **Cross-cutting** - Accessibility, offline, etc.

## Test Data

Tests use `signup()` helper which creates a fresh user via local WatermelonDB.
Each test runs in isolated browser context.

## Debugging

```bash
# Run with headed browser
npx playwright test --headed

# Debug specific test
npx playwright test e2e/f01-onboarding.spec.ts --debug

# Trace viewer
npx playwright test --trace on
npx playwright show-trace trace.zip
```

## CI/CD

```yaml
# Example GitHub Actions
- name: Run E2E Tests
  run: |
    npm run web &
    sleep 10
    npx playwright test
```

## Writing New Tests

1. Add test file in `e2e/` following naming: `fXX-flow-name.spec.ts`
2. Import helpers from `./utils/test-helpers`
3. Use `SELECTORS` for consistent element selection
4. Always call `assertCleanRun(page)` in `afterEach`
5. Run `runAxeScan(page)` on each new screen

## Selectors

Use semantic selectors (role, label, text) over CSS classes:

```typescript
// Good
await page.click('button:has-text("Start Workout")')
await page.fill('input[placeholder="Reps"]', '10')

// Avoid
await page.click('.btn-primary')
await page.fill('#reps-input', '10')
```