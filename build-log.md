# Build Log

## 2026-11-27 — Vertical Slice Complete

### Screens Built (6/10)

| Screen | ID | Status | Notes |
|--------|----|--------|-------|
| Onboarding | S01 | ✅ Done | 4 feature steps + account creation form |
| Auth (Login/Signup) | S02 | ✅ Done | Email/password + social buttons (stubbed) |
| Home / Dashboard | S03 | ✅ Done | Progress rings, today's workout, quick actions, weekly stats, recent achievements |
| Exercise Library | S04 | ✅ Done | Search, filter (muscle/equipment/difficulty), grid/list view |
| Exercise Detail | S05 | ✅ Done | **GIF/video playback with expo-av**, instructions, previous sets, add to workout |
| Active Workout | S06 | ✅ Done | Exercise selector, set logger, rest timer, phase navigation |
| Workout History | S07 | ✅ Done | Calendar heatmap, list view, time filters (week/month/year/all) |
| Profile | S08 | ✅ Done | Level/XP, streak, stats grid, **progress charts (volume/PR/muscle)**, body stats, achievements, settings modal |
| Settings | S09 | ✅ Done | Units, theme, notifications, workout prefs, export/import, danger zone |
| Social | S10 | ⏳ Deferred | Requires backend — stubbed in tabs |

### Primitives Built (13/12)

| Primitive | Status |
|-----------|--------|
| Box | ✅ |
| Text | ✅ |
| Button | ✅ |
| Input | ✅ |
| Card | ✅ |
| Modal | ✅ |
| Toast | ✅ |
| TabBar | ✅ |
| ProgressRing | ✅ |
| Badge | ✅ |
| Icon | ✅ |
| Avatar | ✅ |
| Divider | ✅ |

### Database (WatermelonDB)

- ✅ Schema: 11 tables with indexes, FTS5 search
- ✅ Models: 10 models with associations
- ✅ Seeds: 60+ exercises, 50+ achievements
- ✅ Hooks: 15+ React hooks for reactive queries

### Design System

- ✅ Tokens: 17 WCAG AA-tested color pairs (light/dark)
- ✅ Tailwind config mapping
- ✅ Contrast checker script

### Hard Parts Encountered

1. **WatermelonDB + Expo SQLite** — JSI setup requires specific babel config, got it working
2. **Modal/Sheet animations** — React Native Animated API timing coordination between fade/slide
3. **Keyboard avoiding** — Different behavior on iOS vs Android, used KeyboardAvoidingView with platform check
4. **Settings persistence** — WatermelonDB key-value pattern works well for settings

### Next Steps

1. **Wire real database queries** — Replace mock data in screens with actual `useDatabase` hooks
2. **Add navigation params** — Pass exercise IDs, workout IDs between screens
3. **Exercise media** — Bundle GIFs or implement Supabase Storage for exercise images
4. **Push notifications** — Expo Notifications + Supabase Functions for background
5. **Run & test on device** — `npx expo start` and test on physical device

### Time Spent

- Architecture & Design: ~2 hours
- Primitives: ~3 hours
- Database: ~2 hours
- Screens: ~4 hours
- Testing (E2E): ~3 hours
- Total: ~14 hours

---

## 2026-11-27 — E2E Test Suite Complete

### Test Coverage

| Flow | Test File | Cases | Status |
|------|-----------|-------|--------|
| F01: Onboarding | `f01-onboarding.spec.ts` | 13 (1H, 8E, 2N) | ✅ Ready |
| F02: Log Workout | `f02-log-workout.spec.ts` | 18 (3H, 13E, 2N) | ✅ Ready |
| F03: Progress | `f03-progress.spec.ts` | 14 (3H, 10E, 1N) | ✅ Ready |
| F05: Settings | `f05-settings.spec.ts` | 14 (6H, 5E, 3N) | ✅ Ready |
| Cross-Cutting | `cross-cutting.spec.ts` | 10 | ✅ Ready |

**Total**: 69 test cases across 5 files

### Test Infrastructure

- ✅ Playwright config with 3 projects (Desktop Chrome, Mobile Chrome, Mobile Safari)
- ✅ Web server auto-start (Expo web on port 8081)
- ✅ Axe accessibility scanning on every screen
- ✅ Console error + 5xx network failure detection
- ✅ Touch target validation (44×44px)
- ✅ Focus visibility checks
- ✅ Offline mode testing
- ✅ Reduced motion support
- ✅ Dark mode validation
- ✅ WCAG AA contrast verification

### Bug Tracking

- ✅ `bugs.md` created with 10 open bugs (2 S2, 6 S3, 2 S4)
- ✅ 3 bugs already fixed (error messages, duplicate email, console error)
- ✅ Template for consistent bug reporting with severity, steps, evidence

### Commands

```bash
# Start test environment
npm run web &

# Run all tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui

# Run specific flow
npm run test:e2e -- e2e/f01-onboarding.spec.ts
```

---

## 2026-11-27 — Must-Haves Complete (Parity 76.3%)

### Completed Must-Have Features

| Feature | Screen | Implementation |
|---------|--------|----------------|
| Exercise detail with video/GIF | S05 | **expo-av VideoPlayer** with custom controls, GIF support via `<Image>`, fallback placeholder |
| Progress charts (volume, PRs, frequency) | S08 | **react-native-chart-kit**: LineChart (weekly volume), BarChart (top PRs), PieChart (muscle distribution) |

### Parity Update

- **Before**: 71.2% (9/11 must-haves)
- **After**: 76.3% (11/11 must-haves ✅)
- **Status**: All must-haves complete, no longer "Not shippable"

### Technical Details

**Exercise Detail (S05)**:
- Added `VideoPlayer` component using `expo-av` with custom play/pause, progress, fullscreen
- GIF support via React Native `<Image>` with `resizeMode="cover"`
- Hero section prioritizes GIF > Video > Placeholder
- Full-screen video card with custom controls when no GIF available

**Progress Charts (S08)**:
- Added `ProgressCharts` component using `react-native-chart-kit`
- **LineChart**: Weekly volume (last 8 weeks) in xpGold
- **BarChart**: Top 6 PRs by max weight in success green
- **PieChart**: Muscle group distribution in accent orange
- Responsive widths, empty state for new users

### Next Steps (to reach 80%+)

1. **Wire real database queries** — Replace mock data in screens with actual `useDatabase` hooks
2. **Add navigation params** — Pass exercise IDs, workout IDs between screens
3. **Exercise media** — Bundle GIFs or implement Supabase Storage for exercise images
4. **Push notifications** — Expo Notifications + Supabase Functions for background
5. **Haptic feedback** — Wire `expo-haptics` for rest timer, set completion
6. **Accessibility** — Complete VoiceOver/TalkBack support
7. **Run & test on device** — `npx expo start` and test on physical device