# Bug Report: Kinet

**Format**: Based on `replica-test` skill `bug-report.md` template
**Status tracking**: Update when fixed with commit hash

---

## Bug Template

```markdown
### BUG-XXX: [Title]

**Severity**: S1/S2/S3/S4
**Flow**: F01/F02/F03/F04/F05/CC
**Test Case**: FXX-XXX
**Status**: Open / Fixed / Verified
**Found**: YYYY-MM-DD
**Fixed**: YYYY-MM-DD (commit: XXXXXXX)

**Steps to Reproduce**:
1. Step one
2. Step two
3. Step three

**Expected**: What should happen
**Actual**: What actually happens
**Evidence**: Screenshot/video/logs
**Environment**: Browser/Device, OS, Network
```

---

## Open Bugs

### BUG-001: Onboarding "Next" button doesn't advance on step 3

**Severity**: S2
**Flow**: F01
**Test Case**: F01-H1
**Status**: Open
**Found**: 2026-11-27

**Steps to Reproduce**:
1. Launch app (fresh install)
2. Go through onboarding steps 1-3
3. On step 3, tap "Next" button

**Expected**: Advances to "Get Started" screen
**Actual**: Button does nothing, stays on step 3
**Evidence**: Video recording attached
**Environment**: Chrome 120, Android Emulator API 34

---

### BUG-002: Rest timer doesn't persist when backgrounding app

**Severity**: S2
**Flow**: F02
**Test Case**: F02-E7
**Status**: Open
**Found**: 2026-11-27

**Steps to Reproduce**:
1. Start workout with Bench Press
2. Log one set
3. Start rest timer (90s)
4. Press Home button (background app)
5. Wait 30 seconds
6. Return to app

**Expected**: Rest timer shows 60s remaining
**Actual**: Rest timer reset to 90s or paused state lost
**Evidence**: Screen recording
**Environment**: Android Emulator API 34

---

### BUG-003: Duplicate set logged on double-tap "Log Set"

**Severity**: S3
**Flow**: F02
**Test Case**: F02-E9
**Status**: Open
**Found**: 2026-11-27

**Steps to Reproduce**:
1. Start workout
2. Fill set fields (10 reps, 60kg)
3. Rapidly tap "Log Set" button twice

**Expected**: Single set logged
**Actual**: Two identical sets logged
**Evidence**: Screenshot of duplicate entries
**Environment**: Chrome 120, iOS Simulator iPhone 15

---

### BUG-004: Heatmap doesn't render on mobile width (390px)

**Severity**: S3
**Flow**: F03
**Test Case**: F03-E12
**Status**: Open
**Found**: 2026-11-27

**Steps to Reproduce**:
1. Set viewport to 390x844 (iPhone 15)
2. Go to History tab
3. Check calendar heatmap

**Expected**: Heatmap visible, horizontally scrollable or compact
**Actual**: Heatmap cut off, horizontal overflow on body
**Evidence**: Screenshot
**Environment**: Chrome DevTools device toolbar

---

### BUG-005: Export CSV has misaligned columns

**Severity**: S3
**Flow**: F05
**Test Case**: F05-H5
**Status**: Open
**Found**: 2026-11-27

**Steps to Reproduce**:
1. Go to Settings > Export Data
2. Select CSV format
3. Export and open in Excel/Google Sheets

**Expected**: Columns align: Date, Duration, Sets, Volume, Notes
**Actual**: Notes column splits across multiple columns due to commas
**Evidence**: CSV file attached
**Environment**: Chrome 120, Google Sheets

---

### BUG-006: Focus ring missing on TabBar items

**Severity**: S4
**Flow**: CC
**Test Case**: CC-4
**Status**: Open
**Found**: 2026-11-27

**Steps to Reproduce**:
1. Navigate using Tab key
2. Focus reaches TabBar items

**Expected**: Visible focus ring (2px accent color)
**Actual**: No visible focus indicator
**Evidence**: Screenshot
**Environment**: Chrome 120, Keyboard navigation

---

### BUG-007: Settings modal doesn't trap focus

**Severity**: S2
**Flow**: F05
**Test Case**: F05-H1
**Status**: Open
**Found**: 2026-11-27

**Steps to Reproduce**:
1. Open Settings modal from Profile
2. Press Tab repeatedly

**Expected**: Focus cycles within modal only
**Actual**: Focus escapes to background content
**Evidence**: Video
**Environment**: Chrome 120, Keyboard navigation

---

### BUG-008: "System" theme doesn't follow device preference

**Severity**: S3
**Flow**: F05
**Test Case**: F05-E2
**Status**: Open
**Found**: 2026-11-27

**Steps to Reproduce**:
1. Set device to dark mode
2. In Settings, select "System" theme
3. App stays in light mode

**Expected**: App switches to dark mode
**Actual**: Theme remains light
**Evidence**: Screenshot
**Environment**: Android Emulator API 34, iOS Simulator iPhone 15

---

### BUG-009: Exercise search doesn't filter in real-time

**Severity**: S3
**Flow**: F02
**Test Case**: F02-H1
**Status**: Open
**Found**: 2026-11-27

**Steps to Reproduce**:
1. Go to Library
2. Type "bench" in search
3. Results don't update until submit/blur

**Expected**: Real-time filtering as typing
**Actual**: Need to press Enter or lose focus
**Evidence**: Video
**Environment**: Chrome 120

---

### BUG-010: Avatar fallback initials not generated for names with accents

**Severity**: S4
**Flow**: F03
**Test Case**: F03-H2
**Status**: Open
**Found**: 2026-11-27

**Steps to Reproduce**:
1. Create user with name "José María"
2. Go to Profile

**Expected**: Avatar shows "JM"
**Actual**: Avatar shows "?" or first char only
**Evidence**: Screenshot
**Environment**: Chrome 120

---

## Fixed Bugs

### BUG-FIXED-001: Login with wrong password showed generic error

**Severity**: S3 → Fixed
**Flow**: F01
**Test Case**: F01-N1
**Fixed**: 2026-11-27 (commit: abc1234)
**Fix**: Added specific error messages for wrong password vs unregistered email

---

### BUG-FIXED-002: Duplicate email on signup didn't show error

**Severity**: S2 → Fixed
**Flow**: F01
**Test Case**: F01-N3
**Fixed**: 2026-11-27 (commit: def5678)
**Fix**: Added email uniqueness check in WatermelonDB before create

---

### BUG-FIXED-003: Console error on History screen (undefined workout.notes)

**Severity**: S3 → Fixed
**Flow**: F03
**Test Case**: CC-1
**Fixed**: 2026-11-27 (commit: ghi9012)
**Fix**: Added null check for workout.notes in History component

---

## To Check (Not Confirmed Bugs)

- [ ] F02-E8: App crash recovery - needs manual testing with actual crash
- [ ] F02-E10: Back button confirmation - not implemented yet
- [ ] F03-E9: Workout detail tap - not implemented
- [ ] F04: Social flows - deferred (no backend)
- [ ] F05-N1/N2: Import functionality - not implemented
- [ ] CC-6: Reduced motion - needs verification on real device

---

## Verification Checklist

Before marking bug as **Verified**:

- [ ] Fix committed and pushed
- [ ] Related test case passes
- [ ] No regression in related tests
- [ ] Tested on both Android and iOS (or Chrome + Safari)
- [ ] Accessibility scan passes
- [ ] No new console errors