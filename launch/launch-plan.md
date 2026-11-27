# Launch Plan: Kinet

**Target Launch**: 4 weeks from today
**Budget**: $0 marketing (organic only)
**Team**: Solo founder

---

## Phase 1: Pre-Launch (Week 1-2)

### Waitlist & Beta
- [ ] Create waitlist landing page (Carrd/Notion + Formspree)
- [ ] Recruit 50 beta testers from Reddit r/fitness, r/bodyweightfitness, r/weightroom
- [ ] TestFlight / Play Console internal testing with 20 users
- [ ] Collect bugs, fix S1/S2 issues from `bugs.md`

### Content Prep
- [ ] 5 screenshot sets for App Store (6.7", 5.5", iPad)
- [ ] 8 screenshot sets for Play Store (phone, 7", 10")
- [ ] App preview video (30 sec) — screen record core flow
- [ ] Privacy policy URL (hosted on kinet.app/privacy)
- [ ] Support URL (GitHub Discussions or email)
- [ ] Demo account for App Review (test@kinet.app / test123)

### Analytics & Error Tracking
- [ ] Sentry (free tier) for crash reporting
- [ ] PostHog (self-hosted or cloud free tier) for product analytics
- [ ] Custom events: workout_started, workout_completed, set_logged, nutrition_logged, ai_analysis_viewed, export_used

---

## Phase 2: Launch Week (Week 3)

### Launch Channels
| Channel | Action | Timing |
|---------|--------|--------|
| **Reddit** | r/fitness, r/bodyweightfitness, r/weightroom, r/homegym — "I built a free fitness RPG with macros & AI" | Launch day |
| **Hacker News** | Show HN: "Kinet — free fitness RPG with macros & AI, no subscription" | Launch day |
| **Product Hunt** | Submit 2 weeks prior, launch day | Launch day |
| **Twitter/X** | Thread: "Why I built a free fitness RPG" + screenshots | Launch day |
| **Indie Hackers** | "How I built a free fitness RPG" | Launch day + 1 |
| **Discord** | Fitness/bodybuilding servers — share in #apps or #self-promo | Launch week |

### Press Kit
- [ ] One-pager PDF: logo, screenshots, key stats, founder bio
- [ ] Press release (not for PR distribution — for journalists who ask)

### App Store Optimization
- [ ] Submit App Store build (TestFlight → App Store Connect)
- [ ] Submit Play Store build (Internal → Closed → Open testing)
- [ ] Monitor review status daily
- [ ] Prepare appeal text for 4.1 rejection (emphasize: free tier, offline-first, nutrition+AI differentiators)

---

## Phase 3: Post-Launch (Week 4+)

### Week 1: Stabilize
- [ ] Monitor crash rate (target < 0.5%)
- [ ] Respond to all reviews within 24h
- [ ] Fix S1/S2 bugs from `bugs.md`
- [ ] Ship hotfix for any launch-day crashes

### Week 2-4: Iterate
- [ ] Ship Fix #3: Pause/stop/resume workout (S)
- [ ] Ship Fix #4: Daily Quests vs Custom clarity (S)
- [ ] Ship Fix #2: Nutrition tab (M) — start backend
- [ ] Collect 50+ reviews (target 4.5+ rating)

### Month 2-3: Growth
- [ ] Ship Fix #2: Nutrition tracking + AI analysis (M/L)
- [ ] SEO: "free fitness tracker", "free macro tracker", "offline workout app"
- [ ] YouTube demo (3 min) → embed on landing page

---

## Communities to Engage (from Research)

| Community | Platform | Why |
|-----------|----------|-----|
| r/fitness | Reddit | 10M+ members, daily discussion |
| r/bodyweightfitness | Reddit | 2M+, no-equipment focus |
| r/weightroom | Reddit | 1M+, serious lifters |
| r/homegym | Reddit | 500k+, equipment talk |
| r/fitnessapps | Reddit | Niche, app reviews |
| Show HN | Hacker News | Tech audience, builder respect |
| r/SideProject | Reddit | Fellow builders |
| Indie Hackers | indiehackers.com | Founder community |
| Product Hunt | producthunt.com | Launch visibility |

---

## First 10 Users to Talk To (by hand)

| # | Profile | Where to Find | Ask |
|---|---------|---------------|-----|
| 1 | Powerlifter, 30s, uses Strong | r/powerlifting | "What's missing from Strong?" |
| 2 | Bodyweight athlete | r/bodyweightfitness | "How do you track progress?" |
| 3 | Casual gym-goer, 20s | r/fitness new posts | "Why did you quit your last app?" |
| 4 | Macro tracker | r/macros | "What's missing from MyFitnessPal?" |
| 5 | Injury recovery | r/injuryrecovery | "How do you track rehab?" |
| 6 | Busy professional | r/productivity | "15-min workout logging?" |
| 7 | Supplement user | r/supplements | "Stack tracking?" |
| 8 | Coach/trainer | r/personaltraining | "Client workout sharing?" |
| 9 | Data nerd | r/QuantifiedSelf | "Export format needs?" |
| 10 | Indie dev | Indie Hackers | "Pricing feedback?" |

---

## Success Metrics

| Metric | Launch | Month 1 | Month 3 |
|--------|--------|---------|---------|
| Downloads | 500 | 3,000 | 15,000 |
| DAU/MAU | 20% | 25% | 30% |
| Crash-free sessions | 99.5% | 99.8% | 99.9% |
| App Store rating | 4.3+ | 4.5+ | 4.7+ |
| Play Store rating | 4.3+ | 4.5+ | 4.7+ |

---

## Budget

| Item | Cost |
|------|------|
| Apple Developer | $99/yr |
| Google Play Console | $25 (one-time) |
| Domain (kinet.app) | $12/yr |
| Sentry (free tier) | $0 |
| PostHog Cloud (free tier) | $0 |
| Carrd (landing page) | $19/yr |
| **Total Year 1** | **~$155** |

*No Stripe fees, no payment processing, no server costs (local-first, optional manual backup only).*

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| App Store 4.1 rejection | Emphasize differentiators in review notes: free tier, offline-first, nutrition+AI |
| Play Store rejection | Same + emphasize safety feature (pause workout) |
| Low conversion | A/B test landing page hero; add social proof |
| High churn | Onboarding flow: first workout in < 3 min |
| No server costs (local-first) | Manual backup only; no cloud sync infrastructure needed |

---

## Next Steps

1. **Submit App Store build** → App Store Connect
2. **Submit Play Store build** → Play Console
3. **Run `/replica-deploy`** → Configure CI/CD, deploy Supabase, configure domains