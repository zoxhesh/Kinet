# Component Specifications

Generated from `replica/recon.md` screen inventory. Each component includes all states observed in the original app plus required accessibility states.

---

## 1. Button

**Variants**: `primary`, `secondary`, `ghost`, `danger`
**Sizes**: `sm` (32px), `md` (40px), `lg` (48px)

| State | Tokens | Notes |
|-------|--------|-------|
| `default` | `bg: accent`, `text: on-accent`, `radius: button`, `font: sm/600` | Primary action |
| `hover` | `bg: accent-hover` | Web only |
| `active` | `bg: accent-hover`, `transform: scale(0.98)` | Press feedback |
| `focus-visible` | `ring: 2px accent`, `ring-offset: 2px bg` | Keyboard focus |
| `disabled` | `opacity: 0.5`, `cursor: not-allowed` | All variants |
| `loading` | `spinner: currentColor`, `text: same as default` | Keep label for SR |

**Accessibility**:
- Real `<button>` element
- `aria-disabled` when disabled
- `aria-busy="true"` when loading
- Visible focus ring (not outline: none)
- Loading state keeps visible label for screen readers

**Used on**: S02 (auth), S04 (filter), S05 (log set), S06 (complete workout), S07 (filter), S09 (save settings), S10 (follow)

---

## 2. ExerciseCard

**Variants**: `compact` (list), `detailed` (grid)
**Sizes**: `compact`: 72px height, `detailed`: 160px height

| State | Tokens | Notes |
|-------|--------|-------|
| `default` | `bg: surface`, `border: border`, `radius: card`, `p: card-padding` | |
| `selected` | `border: accent`, `bg: accent-muted` | Multi-select mode |
| `loading` | `skeleton: surface-elevated` | Shimmer animation |
| `disabled` | `opacity: 0.5` | When exercise unavailable |

**Structure**:
```
compact: [muscle-icon] Exercise Name • Equipment
detailed: [gif/video thumb] Exercise Name
          Muscle Group • Equipment • Difficulty badge
          [Start] [Replace] buttons
```

**Accessibility**:
- `article` or `button` role
- `aria-selected` for multi-select
- Alt text for gif/video thumbnail
- Focus ring on interactive card

**Used on**: S04 (library), S05 (detail), S06 (exercise picker)

---

## 3. ProgressRing

**Variants**: `small` (48px), `large` (120px)
**Types**: `stroke` (outline), `fill` (solid)

| State | Tokens | Notes |
|-------|--------|-------|
| `animating` | `stroke: accent`, `duration: 500ms easeOut` | On load |
| `static` | `stroke: accent` | Final value |
| `incomplete` | `stroke: border`, `dasharray: gap` | Background track |
| `warning` | `stroke: warning` | Streak risk |

**Accessibility**:
- `role="img"` with `aria-label="Progress: 75%"`
- Text alternative inside: `<span class="sr-only">75% complete</span>`
- Respects `prefers-reduced-motion`

**Used on**: S03 (daily rings), S07 (weekly volume), S08 (level progress)

---

## 4. SetLogger

**Variants**: `standard`, `superset`, `timed`
**Layout**: Horizontal row per set

| State | Tokens | Notes |
|-------|--------|-------|
| `editing` | `input: border-input focused: accent`, `bg: surface` | Active input |
| `saved` | `text: text`, `checkmark: success` | Confirmed |
| `validation-error` | `border: danger`, `helper: danger` | Invalid reps/weight |
| `warmup` | `badge: xp-gold-muted`, `text: xp-gold` | Visual distinction |
| `previous` | `text: text-muted`, `icon: history` | Ghosted previous values |

**Fields**: Set # | Reps (number) | Weight (number) | RPE (1-10 selector) | ☐ Warmup | ✓ Done

**Accessibility**:
- `<fieldset>` with `<legend>` = "Set 3"
- `<label>` for each input (visible or sr-only)
- `aria-invalid` on error
- `aria-describedby` for helper text
- Enter key moves to next field

**Used on**: S06 (active workout)

---

## 5. Timer

**Variants**: `circular` (main), `linear` (rest)
**Sizes**: `circular`: 120px, `linear`: full-width bar

| State | Tokens | Notes |
|-------|--------|-------|
| `running` | `stroke: accent`, `animation: progressRing` | Countdown |
| `paused` | `stroke: warning`, `pulse: 1s infinite` | Visual pause |
| `rest` | `stroke: success`, `label: "Rest"` | Green theme |
| `overtime` | `stroke: danger`, `flash: 0.5s` | Past target |
| `completed` | `stroke: success`, `checkmark` | Done |

**Accessibility**:
- `role="timer"` with `aria-live="polite"`
- Announces at 10s, 5s, 1s intervals
- Screen reader reads current time on focus
- Vibration/haptic on completion

**Used on**: S06 (workout, rest)

---

## 6. StatCard

**Variants**: `icon-value`, `trend`, `comparison`
**Sizes**: `compact` (80px), `default` (120px)

| State | Tokens | Notes |
|-------|--------|-------|
| `default` | `bg: surface`, `radius: card`, `p: card-padding` | |
| `loading` | `skeleton: surface-elevated` | |
| `positive-trend` | `trend-icon: success`, `trend-text: success` | ↑ 12% |
| `negative-trend` | `trend-icon: danger`, `trend-text: danger` | ↓ 5% |

**Structure**:
```
icon-value: [Icon] 145 kg    ← large value, small label
trend:      Volume    1,240 kg  ↑ 12% vs last week
comparison: PR Bench  100 kg  → 105 kg
```

**Accessibility**:
- `dl` / `dt` / `dd` for label/value pairs
- Trend announced as "increased by 12 percent"
- Color not sole indicator of trend

**Used on**: S03 (daily stats), S07 (history), S08 (profile)

---

## 7. AchievementBadge

**Variants**: `locked`, `unlocked`, `progress`
**Sizes**: `sm` (48px), `md` (72px), `lg` (100px)

| State | Tokens | Notes |
|-------|--------|-------|
| `locked` | `bg: surface`, `border: border`, `icon: text-muted`, `grayscale: 100%` | Silhouette |
| `unlocked` | `bg: xp-gold-muted`, `border: xp-gold`, `icon: xp-gold`, `animation: achievementUnlock` | Celebrate |
| `progress` | `locked` + `progress-ring: xp-gold` | 65% ring |

**Accessibility**:
- `role="img"` with `aria-label="First Steps, unlocked, 100 XP"`
- `aria-disabled` for locked
- Progress announced: "65 percent complete"
- Animation respects `prefers-reduced-motion`

**Used on**: S08 (achievements grid), S03 (unlock toast)

---

## 8. Modal / BottomSheet

**Variants**: `full` (center), `half` (bottom), `confirmation` (alert)
**Sizes**: `full`: 90vw, `half`: 50vh, `confirmation`: 320px

| State | Tokens | Notes |
|-------|--------|-------|
| `open` | `bg: surface`, `radius: modal`, `shadow: modal`, `animation: modalEnter` | |
| `closing` | `animation: modalExit` | |
| `dismissed` | `unmounted` | |

**Structure**:
```
[Handle] (half sheet)
Title
[Close ✕]
Content
[Primary] [Secondary] actions
```

**Accessibility**:
- `role="dialog"` + `aria-modal="true"`
- `aria-labelledby="modal-title"`
- Focus trap (Tab cycles within)
- Focus on first focusable on open
- Return focus to trigger on close
- ESC to dismiss (except confirmation)
- Backdrop click dismisses (except confirmation)

**Used on**: S02 (auth), S05 (exercise info), S06 (superset picker), S09 (danger zone)

---

## 9. Toast / Snackbar

**Variants**: `success`, `error`, `info`, `warning`, `achievement`
**Position**: Bottom (mobile), Top-right (web)

| State | Tokens | Notes |
|-------|--------|-------|
| `visible` | `bg: surface-elevated`, `border-left: accent/danger/success/warning/xp-gold`, `shadow: dropdown`, `animation: sheetEnter` | |
| `dismissing` | `animation: sheetExit` | Swipe or timeout |
| `action` | `button: ghost`, `text: accent` | Undo, Retry |

**Accessibility**:
- `role="status"` (polite) or `role="alert"` (assertive for errors)
- `aria-live="polite"` / `assertive`
- Auto-dismiss ≥ 5s (configurable)
- Pause on hover/focus
- Action button focusable

**Used on**: All screens (form errors, sync, achievement unlock, streak saved)

---

## 10. TabBar / NavBar

**Variants**: `4-tabs`, `5-tabs`
**Height**: 80px (includes safe area)

| State | Tokens | Notes |
|-------|--------|-------|
| `active` | `icon: accent`, `label: accent`, `font: 600` | Current tab |
| `inactive` | `icon: text-muted`, `label: text-muted` | |
| `badge` | `bg: danger`, `text: on-accent`, `radius: badge` | Notification count |
| `loading` | `skeleton` on tab switch | |

**Tabs**: Home | Library | Workout | Profile | (Social)

**Accessibility**:
- `role="tablist"` with `role="tab"` + `aria-selected`
- `aria-controls` linking to tabpanel
- Keyboard: ←/→ to navigate, Enter/Space to activate
- Swipe between tabs (mobile)
- Hidden panels have `hidden` attribute

**Used on**: S03, S07, S08, S10

---

## 11. Input / Picker

**Variants**: `text`, `number`, `date`, `select`, `textarea`
**Sizes**: `sm` (36px), `md` (44px), `lg` (52px)

| State | Tokens | Notes |
|-------|--------|-------|
| `default` | `bg: surface`, `border: border-input`, `radius: input`, `p: 12px 16px` | |
| `focused` | `border: accent`, `ring: accent` | |
| `error` | `border: danger`, `ring: danger`, `helper: danger` | |
| `disabled` | `bg: border`, `text: text-muted`, `cursor: not-allowed` | |
| `filled` | `label: float up`, `text: text` | Float label pattern |

**Accessibility**:
- `<label>` with `for=` matching input `id`
- `aria-describedby` for helper/error
- `aria-invalid="true"` on error
- `autocomplete` attributes where appropriate
- Number input: `inputmode="numeric"`
- Date: native picker or accessible custom
- Select: native `<select>` or combobox pattern

**Used on**: S02 (auth), S05 (set logging), S06 (RPE), S09 (settings)

---

## 12. Card (Base)

**Base component** used by ExerciseCard, StatCard, AchievementBadge

| State | Tokens | Notes |
|-------|--------|-------|
| `default` | `bg: surface`, `border: border`, `radius: card`, `shadow: card` | |
| `elevated` | `bg: surface-elevated`, `shadow: dropdown` | Dropdowns, sheets |
| `interactive` | `cursor: pointer`, `hover: shadow: md`, `active: scale(0.99)` | Clickable cards |
| `loading` | `skeleton` | |

**Accessibility**:
- No implicit role (div)
- Interactive cards use `button` role or wrap in `<a>`
- Focus ring on interactive

**Used on**: S03, S04, S05, S07, S08, S10

---

## Primitive Components (Build First)

Before screens, build these in isolation at `/design` route:

1. **Box** - Layout primitive (flex, grid, spacing tokens)
2. **Text** - Typography primitive (scale, weight, color roles)
3. **Button** - All variants, states, a11y
4. **Input** - Text, Number, Select, Date
5. **Card** - Base + Elevated + Interactive
6. **Modal** - Portal, focus trap, animations
7. **Toast** - Queue, auto-dismiss, actions
8. **TabBar** - Router integration, swipe
9. **ProgressRing** - SVG, animation, a11y
9. **Badge** - Status, count, variant
10. **Icon** - Lucide wrapper, size/color tokens
11. **Avatar** - Image + fallback, sizes
12. **Divider** - Horizontal/vertical, spacing

---

## Design System Checklist

- [ ] All primitives built at `/design` with Storybook/preview
- [ ] Screenshots captured for each component state
- [ ] Contrast report: 0 AA failures ✅
- [ ] Dark mode verified for all components
- [ ] `prefers-reduced-motion` respected
- [ ] Focus visible on all interactive elements
- [ ] Screen reader tested (VoiceOver / TalkBack)
- [ ] Touch targets ≥ 44×44px
- [ ] Dynamic type supported (text scale tokens)

---

## Next: `/replica-build`

Build vertical slice using these primitives and the architecture from `replica/architecture.md`.