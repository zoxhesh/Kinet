# Fixes & Positioning for Kinet

**Source**: 20 App Store reviews (1 source), 13 unique after dedup
**Generated**: `python3 reviews.py replica/reviews.csv --out replica/feedback.md`

---

## 1. What They Hate (Complaints)

| Rank | Problem | Reviews | Sources | Evidence |
|------|---------|---------|---------|----------|
| 1 | **Confusing UX: Pre-created workouts vs Daily Quests** | 3 | 1 | "A selected pre-created workout seems to replace the Daily Quests" — [App Store, 2*](https://apps.apple.com/us/app/arise-level-up-in-real-life/id6743036247)<br>"What's also was never clear to me was whether pre-created workouts replaced Daily Quests or are done after" — [App Store, 2*](https://apps.apple.com/us/app/arise-level-up-in-real-life/id6743036247) |
| 2 | **Confusing UX: Workout duration vs difficulty** | 1 | 1 | "What's not clear to me is whether the duration of a workout increases or decreases with difficulty" — [App Store, 2*](https://apps.apple.com/us/app/arise-level-up-in-real-life/id6743036247) |
| 3 | **Paywall: Hard gate at launch** | 3 (1*) | 1 | "can't even use app with out paying and subscribing the moment you open it" — [App Store, 1*](https://apps.apple.com/us/app/arise-level-up-in-real-life/id6743036247)<br>"payment is required before the app is even accessible" — [App Store, 1*](https://apps.apple.com/us/app/arise-level-up-in-real-life/id6743036247)<br>"Free trial requires inviting 3 friends but no one is going to recommend an app that they haven't even used" — [App Store, 1*](https://apps.apple.com/us/app/arise-level-up-in-real-life/id6743036247) |
| 4 | **Bug: Weight slider/quirk** | 1 | 1 | "app sometimes has its funny little quirks with adjusting some weights or not letting you move a slide" — [App Store, 2*](https://apps.apple.com/us/app/arise-level-up-in-real-life/id6743036247) |
| 5 | **Bug: Can't pause/stop workout** | 1 | 1 | "if you happen to be sick or injure yourself you can't stop the workout and you end up potentially losing progress" — [App Store, 2*](https://apps.apple.com/us/app/arise-level-up-in-real-life/id6743036247) |

---

## 2. What's Missing (Feature Requests)

| Rank | Feature | Reviews | Sources | Evidence |
|------|---------|---------|---------|----------|
| 1 | **Nutrition: Calorie & macro tracking** | 4 | 1 | "Calorie counting and macro tracking" — [App Store, 3*](https://apps.apple.com/us/app/arise-level-up-in-real-life/id6743036247)<br>"count calories and keep track of your macros alongside all your workouts" — [App Store, 3*](https://apps.apple.com/us/app/arise-level-up-workout-game/id6743036247) |
| 2 | **AI-powered analysis & coaching** | 4 | 1 | "AI read your workouts/macros and give you an in-depth analysis" — [App Store, 3*](https://apps.apple.com/us/app/arise-level-up-in-real-life/id6743036247)<br>"AI read your workouts/macros and give you an in-depth analysis of your health" — [App Store, 3*](https://apps.apple.com/us/app/arise-level-up-workout-game/id6743036247) |
| 3 | **Character/AI customization** | 2 | 1 | "More profile and character customization using AI" — [App Store, 3*](https://apps.apple.com/us/app/arise-level-up-in-real-life/id6743036247)<br>"more unique missions, different fun rewards, more profile and character customization using AI" — [App Store, 3*](https://apps.apple.com/us/app/arise-level-up-workout-game/id6743036247) |
| 4 | **Pre-created workout tracking (separate from Daily Quests)** | 2 | 1 | "Track pre-created workouts separately from Daily Quests" — [App Store, 3*](https://apps.apple.com/us/app/arise-level-up-in-real-life/id6743036247)<br>"Pre-created workouts should yield Level Up bonuses" — [App Store, 3*](https://apps.apple.com/us/app/arise-level-up-in-real-life/id6743036247) |
| 5 | **More missions, rewards, AI customization** | 2 | 1 | "More unique missions, different fun rewards, more profile and character customization using AI" — [App Store, 3*](https://apps.apple.com/us/app/arise-level-up-workout-game/id6743036247) |

---

## 3. What's Unsolved (Positioning Opportunities)

| Problem | Why It's Unsolved | Evidence |
|---------|-------------------|----------|
| **No true free tier** — Hard paywall at launch | Users can't try before paying; viral loop (invite 3 friends) fails because no one recommends an untested app | 3 one-star reviews citing paywall; "invite 3 friends" viral loop fails |
| **No nutrition tracking in a fitness RPG** | Core loop (workout → level up) ignores the other half of fitness (nutrition) | 4 reviews asking for calorie/macro tracking |
| **No AI coaching/analysis** | RPG theme promises "level up in real life" but no intelligent guidance | 4 reviews asking for AI analysis/coaching |
| **Pre-created workouts second-class to Daily Quests** | Core content (custom workouts) doesn't integrate with progression | 2 reviews asking for separate tracking + bonuses |
| **No pause/stop during active workout** | Safety issue — injury/sickness forces progress loss | 1 review about injury/sickness |

---

## Fix Plan (Top 5 by Evidence × Feasibility)

| # | Fix | Size | Skill | Evidence |
|---|-----|------|-------|----------|
| 1 | **Remove hard paywall; add true free tier with generous limits** | M | `/replica-build` → `/replica-launch` | 3 one-star reviews; paywall is #1 blocker |
| 2 | **Add calorie/macro tracking (nutrition tab)** | M | `/replica-build` + `/replica-backend` | 4 reviews; nutrition is half of fitness |
| 3 | **Add pause/stop/resume to active workout** | S | `/replica-build` | Safety issue; 1 review about injury |
| 4 | **Clarify Daily Quests vs Pre-created workouts; allow both to give XP** | S | `/replica-build` | 3 reviews confused; core content not rewarded |
| 5 | **Add AI workout analysis (post-workout summary)** | L | `/replica-backend` + `/replica-build` | 4 reviews; differentiates from clones |

---

## Positioning Angle (Recommended)

> **For solo lifters who hate paywalls and want nutrition + AI coaching built into their workout tracker,**
> **Kinet gives you a completely free, offline-first fitness RPG with built-in macro tracking and AI post-workout analysis — no subscription, no invite loops, no progress loss.**
>
> **Evidence:** Paywall (3× 1-star), Nutrition (4 reviews), AI coaching (4 reviews), UX confusion (7 reviews).
>
> **Why this wins:** Every competitor (Arise, Strong, Hevy, etc.) either gates core features behind subscription or lacks nutrition/AI. A free, offline-first app with both is a genuine differentiator for solo lifters.

---

## Next Steps

1. **Run `/replica-brand`** — Pick name, palette, logo brief, voice guide based on this angle
2. **Run `/replica-build`** — Implement Fixes #1-4 (paywall removal, nutrition, pause workout, Daily Quest clarity)
3. **Run `/replica-backend`** — Supabase for AI analysis (Fix #5) and cloud sync (optional)
4. **Run `/replica-diff`** — Verify parity after fixes
5. **Run `/replica-launch`** — Landing page, pricing (free), store listings