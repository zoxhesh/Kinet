# Test Plan: Kinet (Free, Offline-First Fitness RPG)

**Generated from**: `replica/recon.md` user flows
**Target**: Local Expo dev server with seeded WatermelonDB

---

## Test Environment

| Item | Value |
|------|-------|
| App | `arise-clone` (Expo + React Native) |
| Test Runner | Playwright + `@playwright/test` |
| Device | Emulated Android (Pixel 7, API 34) + iOS Simulator (iPhone 15) |
| Data | Seeded: 60+ exercises, 50+ achievements, 1 test user |
| Network | Offline-first — all data local |

---

## Test Case Numbering

Format: `F{flow}-{type}{number}`
- `H` = Happy path
- `E` = Edge case
- `N` = Negative case

---

## F01: New User Onboarding (S01 → S02 → S03)

### Happy Path
| ID | Steps | Expected |
|----|-------|----------|
| F01-H1 | Launch app → See 4 onboarding screens → Tap "Get Started" → Enter username/email/password → Tap "Create Account" → Land on Home (S03) | User created, redirected to Home, progress rings visible, streak = 0, level = 1 |

### Edge Cases
| ID | Scenario | Expected |
|----|----------|----------|
| F01-E1 | Skip onboarding (tap "Skip" on any step) | Goes directly to Auth screen (S02) |
| F01-E2 | Username < 3 chars | Inline error "Username must be at least 3 characters" |
| F01-E3 | Username with emoji/accents (e.g., "josé💪") | Accepted, stored correctly |
| F01-E4 | Email invalid format ("notanemail") | Inline error "Please enter a valid email" |
| F01-E5 | Password < 6 chars | Inline error "Password must be at least 6 characters" |
| F01-E6 | Passwords don't match (signup) | Inline error "Passwords do not match" |
| F01-E7 | Duplicate email (already registered) | Error "Email already registered" |
| F01-E8 | Back button mid-flow (onboarding step 2) | Returns to previous step |
| F01-E9 | Refresh/reload mid-flow (onboarding step 3) | Returns to step 1 (no persistence) |
| F01-E10 | App backgrounded during onboarding | On relaunch, returns to current step |
| F01-E11 | Very long username (50 chars) | Truncated or validation error at reasonable limit |
| F01-E12 | Offline mode during account creation | Works — local DB, no network needed |
| F01-E13 | Keyboard only navigation (onboarding) | Tab reaches all buttons/inputs, Enter submits |
| F01-E14 | Screen reader labels (onboarding) | All buttons/inputs have accessible names |
| F01-E15 | Mobile width (390px) | No horizontal overflow, touch targets ≥ 44px |

### Negative Cases
| ID | Scenario | Expected |
|----|----------|----------|
| F01-N1 | Login with wrong password | Error "Invalid credentials" |
| F01-N2 | Login with unregistered email | Error "No account found" |
| F01-N3 | Signup with existing email | Error "Email already registered" |

---

## F02: Log a Workout (S03 → S04 → S05 → S06 → S07)

### Happy Path
| ID | Steps | Expected |
|----|-------|----------|
| F02-H1 | Home → Tap "Log Workout" → Library → Filter "Chest" → Select "Bench Press" → Tap "Start Workout" → Active Workout → Enter 3 sets (10×60kg, 8×65kg, 8×65kg) → Tap "Next Exercise" → Finish → History shows workout | Workout saved, volume = 1930kg, sets = 3, duration tracked |
| F02-H2 | Home → Quick Action "Exercise Library" → Search "deadlift" → Select → "Add to Workout" → Start → Log sets → Complete | Workout with deadlift saved |
| F02-H3 | Home → Active Workout (resume) → Continue logging → Complete | Resumes in-progress workout |

### Edge Cases
| ID | Scenario | Expected |
|----|----------|----------|
| F02-E1 | No exercise selected, tap "Start Workout" | Alert "Please select at least one exercise" |
| F02-E2 | Empty set fields (reps/weight), tap "Next Exercise" | Inline validation error on empty required fields |
| F02-E3 | Negative weight (-10kg) | Validation error or clamped to 0 |
| F02-E4 | Very high reps (999) | Accepted or capped at reasonable max |
| F02-E4 | RPE > 10 (e.g., 11) | Validation error "RPE must be 1-10" |
| F02-E5 | Warmup set toggled | Warmup sets excluded from volume calculation |
| F02-E6 | Superset group created (2 exercises same group) | Both shown together, rest timer shared |
| F02-E7 | Timer backgrounded (home button) → Return | Timer continues, state preserved |
| F02-E8 | App crash mid-workout (simulate) → Relaunch | In-progress workout recoverable from local DB |
| F02-E9 | Double-tap "Complete Set" | Single set logged, no duplicate |
| F02-E10 | Back button during active workout | Prompt "Leave workout? Progress will be saved" |
| F02-E11 | Refresh mid-workout | State preserved, no data loss |
| F02-E12 | Offline throughout entire flow | All data saved locally, no sync needed |
| F02-E13 | Switch tabs mid-workout (Home → Library → Workout) | Workout state preserved |
| F02-E14 | Very long exercise name in library | Truncated with ellipsis, full name on detail |
| F02-E15 | Keyboard only (active workout) | Tab navigates reps → weight → RPE → warmup → log |
| F02-E16 | Screen reader (active workout) | Set number, reps, weight announced correctly |
| F02-E17 | Mobile width (390px) — set logger | No horizontal scroll, inputs stacked |
| F02-E18 | Add custom exercise during workout | Custom exercise appears in library |

### Negative Cases
| ID | Scenario | Expected |
|----|----------|----------|
| F02-N1 | Delete exercise mid-workout (if possible) | Graceful handling, workout continues |
| F02-N2 | Corrupt local DB (simulate) → Launch | Recovery or clear error message |

---

## F03: View Progress (S03 → S07 / S08)

### Happy Path
| ID | Steps | Expected |
|----|-------|----------|
| F03-H1 | Home → Tap "History" tab → See calendar heatmap + list → Tap week filter → See filtered workouts | Correct workouts shown, heatmap matches |
| F03-H2 | Home → Tap Profile → See level/XP bar, streak, stats grid, achievements | All stats match workout data |
| F03-H3 | Profile → Scroll to body stats → See weight trend chart | Chart renders with data points |

### Edge Cases
| ID | Scenario | Expected |
|----|----------|----------|
| F03-E1 | No workouts yet (new user) → History | Empty state "No workouts found. Start your first workout!" |
| F03-E2 | No body stats → Profile body stats section | Empty state "No measurements yet. Tap Add to log first measurement" |
| F03-E3 | Filter "This Week" with no workouts | Empty state with filter-specific message |
| F03-E4 | Filter "All Time" with 100+ workouts | Virtualized list, smooth scroll |
| F03-E5 | Date range spans DST change | Dates displayed in local timezone correctly |
| F03-E6 | Timezone changed (device settings) | Workout times shown in current device TZ |
| F03-E7 | Very long workout notes (500 chars) | Truncated with "Show more" or scrollable |
| F03-E8 | Calendar heatmap year view | 52 weeks × 7 days grid, color intensity by count |
| F03-E9 | Tap workout in history → Detail view | Shows exercises, sets, volume, duration |
| F03-E10 | Keyboard only (history list) | Tab through filters, workouts, Enter opens detail |
| F03-E11 | Screen reader (heatmap) | Each day announced with count and date |
| F03-E12 | Mobile width (390px) — heatmap | Horizontal scroll or compact view |
| F03-E13 | Offline → Progress screens | All data from local DB |

### Negative Cases
| ID | Scenario | Expected |
|----|----------|----------|
| F03-N1 | Corrupt workout record in DB | Skipped with warning, rest of list loads |

---

## F04: Social Interaction (S10) — DEFERRED

> **Skipped** — Requires backend + other users. Out of scope for personal clone.

---

## F05: Settings Management (S09)

### Happy Path
| ID | Steps | Expected |
|----|-------|----------|
| F05-H1 | Profile → Settings → Change Units to "Imperial" → Back to Profile → Weight shows in lbs | Unit conversion applied globally |
| F05-H2 | Settings → Theme → "Dark" → App restarts (or live) → Dark mode applied | Dark mode persisted |
| F05-H3 | Settings → Notifications → Toggle off → Streak reminder off | No local notifications scheduled |
| F05-H4 | Settings → Export Data → Choose JSON → Share → File contains all workouts/stats | Valid JSON with correct schema |
| F05-H5 | Settings → Export Data → Choose CSV → Share → File opens in spreadsheet | Valid CSV with headers |
| F05-H6 | Settings → Default Rest Time → 120s → Active workout → Rest timer defaults to 120s | Preference respected |

### Edge Cases
| ID | Scenario | Expected |
|----|----------|----------|
| F05-E1 | Units changed mid-workout (metric→imperial) | Live conversion or on next screen |
| F05-E2 | Theme "System" with device dark mode | Follows device setting |
| F05-E3 | Export with 500+ workouts | File generated without timeout |
| F05-E4 | CSV export opened in Excel/Google Sheets | Columns aligned, UTF-8 encoded |
| F05-E5 | Settings screen at mobile width | No horizontal overflow, toggles stacked |
| F05-E6 | Keyboard only (settings) | Tab through all toggles, inputs, buttons |
| F05-E7 | Screen reader (settings) | All toggles announced with state |
| F05-E8 | Offline → Settings changes | Persisted locally |

### Negative Cases
| ID | Scenario | Expected |
|----|----------|----------|
| F05-N1 | Import malformed JSON | Error "Invalid file format" |
| F05-N2 | Import CSV with missing columns | Error "Invalid CSV format" |
| F05-N3 | Delete account → Confirm → Data wiped → Back to onboarding | All local data cleared |

---

## Cross-Cutting Concerns (Apply to All Flows)

| ID | Concern | Test |
|----|---------|------|
| CC-1 | Console errors | `page.on('console', msg => msg.type() === 'error' && fail())` |
| CC-2 | Network 5xx | `page.on('response', r => r.status() >= 500 && fail())` |
| CC-3 | Accessibility | `@axe-core/playwright` scan on each screen |
| CC-4 | Touch targets | All interactive ≥ 44×44px |
| CC-5 | Color contrast | WCAG AA (4.5:1 text, 3:1 non-text) |
| CC-6 | Reduced motion | `prefers-reduced-motion` respected |
| CC-7 | Dark mode | All screens render correctly in dark |
| CC-8 | Offline | App fully functional without network |

---

## Test Execution Order

1. **F01** — Onboarding & Auth (prerequisite for all)
2. **F02** — Log Workout (core loop)
3. **F03** — Progress (depends on F02)
4. **F05** — Settings (independent)
5. **Cross-cutting** — Run throughout

---

## Seed Data Requirements

| Entity | Count | Notes |
|--------|-------|-------|
| Exercises | 60+ | All muscle groups, equipment, difficulties |
| Achievements | 50+ | All criteria types |
| Test User | 1 | `test@arise.clone` / `password123` / username: `testuser` |
| Pre-seeded Workouts | 5 | For progress/history tests |

---

## Exit Criteria

| Metric | Target |
|--------|--------|
| Happy paths passing | 100% |
| Edge cases passing | ≥ 90% |
| Negative cases passing | 100% |
| S1/S2 bugs | 0 open |
| Accessibility violations | 0 (AA) |
| Console errors | 0 |
| 5xx responses | 0 |