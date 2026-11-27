# Deploy Preflight Checklist: Kinet

**Generated**: 2024-11-27  
**App**: Kinet (Free fitness RPG with macro tracking & AI)  
**Status**: Preflight checks completed

---

## Step 1: Preflight Checks

### Automated Checks

| Check | Command | Result | Notes |
|-------|---------|--------|-------|
| **Playwright E2E Tests** | `npx playwright test` | ⚠️ **BLOCKED** | Expo dev server fails to start (expo-sqlite module resolution issue on Windows). Tests not runnable locally. CI will run on GitHub Actions. |
| **Feature Parity** | `python3 ../replica-diff/parity.py features.csv` | ✅ **PASS** | 77.8% parity, **11/11 must-haves done** |
| **Brand Sweep** | `python3 ../replica-brand/sweep.py . --config brand.json` | ✅ **PASS** | Clean sweep — only brand.json (avoid list) and brand.md (documentation) reference original |
| **Store Listing** | `python3 ../replica-launch/listing.py launch/listing.json` | ✅ **PASS** | 0 errors, 1 warning (wasted keyword chars in name/subtitle) |
| **Production Build** | `npm run build` | ⚠️ **NO SCRIPT** | Expo project — no `npm run build`; uses `expo export` for web, `eas build` for mobile |

### Manual Checks

| Check | Status | Notes |
|-------|--------|-------|
| **Open S1/S2 bugs** | ✅ **CLEAR** | `bugs.md` shows 0 open S1/S2; 3 fixed, 7 open (S3/S4) |
| **Privacy Policy** | ⚠️ **PENDING** | Not yet created; needs to list: WatermelonDB (local), Expo (analytics), Supabase (auth, optional) |
| **Terms of Service** | ⚠️ **PENDING** | Not yet created |
| **Cookie Banner (EU/UK)** | ✅ **NOT NEEDED** | No non-essential cookies; local-first, no analytics cookies |
| **Account Deletion** | ✅ **IMPLEMENTED** | Settings → Danger Zone → Delete Account (wipes local data) |
| **Favicon** | ⚠️ **PENDING** | Need to add `assets/favicon.png` and `assets/icon.png` |
| **Page Titles / OG Image** | ⚠️ **PENDING** | Need to verify in web build |
| **App Icons** | ⚠️ **PENDING** | Need 1024×1024 icon for iOS, 512×512 for Android |

---

## Preflight Summary

| Category | Status | Blocking? |
|----------|--------|-----------|
| **Must-haves complete** | ✅ 11/11 | No |
| **Parity ≥ 80%** | ⚠️ 77.8% | No (all must-haves done) |
| **Brand sweep clean** | ✅ | No |
| **Store listing valid** | ✅ | No |
| **No open S1/S2 bugs** | ✅ | No |
| **Privacy policy** | ❌ | **YES** |
| **Terms of service** | ❌ | **YES** |
| **Favicon/icon** | ❌ | **YES** (store requirement) |
| **Production build** | ⚠️ CI only | No (CI will build) |

**Deploy Blocked By**: Privacy policy, Terms of Service, App icons, Favicon

---

## Step 2: Production Services (Planned)

> **Note**: Kinet is 100% local-first, **no payment infrastructure** (no Stripe), **no subscription**, **no server-side sync**. This significantly simplifies deployment.

### Database
- **Type**: Local-only (WatermelonDB + Expo SQLite)
- **Production**: No separate production database — data lives on user's device
- **Backups**: Manual CSV/JSON export/import by user

### Authentication
- **Provider**: Supabase Auth (email/password + OAuth)
- **Production**: Separate Supabase project needed
- **Redirect URIs**: Add production domain to Supabase Auth settings

### Email
- **Provider**: Resend (or SendGrid)
- **Domain**: `kinet.app` (to be purchased)
- **DNS**: SPF, DKIM, DMARC records needed

### Analytics
- **Provider**: PostHog (self-hosted or cloud free tier)
- **Privacy**: No cookies, no tracking pixels, local-first analytics

---

## Step 3: Host & Domain (Planned)

### Domain
- **Domain**: `kinet.app` (to be purchased at registrar)
- **Registrar**: Namecheap, Cloudflare, or Porkbun

### DNS Records (after purchase)

| Record | Name | Value |
|--------|------|-------|
| A | @ | Vercel apex IP (from Vercel dashboard) |
| CNAME | www | `cname.vercel-dns.com` |
| TXT | @ | Vercel verification token |
| TXT | @ | `v=spf1 include:_spf.resend.com ~all` (SPF) |
| CNAME | dkim._domainkey | Resend DKIM CNAME |
| TXT | _dmarc | `v=DMARC1; p=none; rua=mailto:privacy@kinet.app` |

### Hosting
- **Platform**: Vercel (Expo web export)
- **Repo**: Connected to GitHub, `main` branch deploys to production
- **Preview**: PRs get preview URLs

### Canonical Host
- **Primary**: `https://kinet.app`
- **Redirect**: `https://www.kinet.app` → `https://kinet.app` (301)

---

## Step 4: Monitoring (Planned)

| Tool | Purpose | Plan |
|------|---------|------|
| **Sentry** | Error tracking | Free tier (5k events/mo) |
| **PostHog** | Product analytics | Self-hosted or Cloud free tier |
| **Uptime** | Uptime monitoring | UptimeRobot (free) or Vercel built-in |
| **Alerts** | Email/phone | Sentry alerts → email; UptimeRobot → email |

### Key Metrics to Watch (First Week)
- Crash-free sessions > 99.5%
- App Store / Play Store review status
- Downloads / installs
- DAU / MAU ratio
- Crash reports in Sentry
- API errors (if any backend)

---

## Step 5: Mobile App Deployment (Expo)

### Prerequisites
- Apple Developer Account ($99/yr) — **user owns**
- Google Play Console ($25 one-time) — **user owns**
- EAS CLI: `npm install -g eas-cli`

### Build Commands
```bash
# iOS
eas build --platform ios --profile production
eas submit --platform ios

# Android
eas build --platform android --profile production
eas submit --platform android
```

### Build Profiles (eas.json)
```json
{
  "build": {
    "production": {
      "ios": {
        "bundleIdentifier": "com.user.kinet",
        "buildNumber": "1"
      },
      "android": {
        "package": "com.user.kinet",
        "versionCode": 1
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### Review Process
1. **Beta**: TestFlight (iOS) / Play Internal Testing (Android) → 20 testers
2. **App Store**: Submit with `launch/listing.json` metadata
3. **Play Store**: Submit with same metadata
4. **Review Notes**: Include differentiators (free, offline-first, nutrition+AI, safety pause)

---

## Go/No-Go Decision

### ✅ Ready for Deploy (after blockers resolved)
- [ ] Privacy policy published at `https://kinet.app/privacy`
- [ ] Terms of Service published at `https://kinet.app/terms`
- [ ] App icons generated (iOS 1024×1024, Android 512×512)
- [ ] Favicon generated (`assets/favicon.png`)
- [ ] Domain `kinet.app` purchased
- [ ] Supabase production project created
- [ ] Resend/email domain verified
- [ ] Sentry project created
- [ ] PostHog project created
- [ ] Domain DNS configured
- [ ] Vercel project connected to repo

### ❌ Not Ready (Blocking)
- [ ] Privacy policy
- [ ] Terms of service
- [ ] App icons (iOS + Android)
- [ ] Favicon

---

## Next Steps

1. **User creates**: Privacy policy, Terms of Service
2. **User generates**: App icons (iOS 1024×1024, Android 512×512)
3. **User purchases**: `kinet.app` domain
4. **User creates**: Supabase prod project, Resend account, Sentry project
4. **User runs**: `eas build --platform all --profile production`
5. **User submits**: App Store Connect + Play Console with `launch/listing.json`

---

**Deploy Status**: ⏳ **BLOCKED** — awaiting privacy policy, terms, icons, domain

Once blockers are resolved, run `eas build` and `eas submit` for mobile, `vercel --prod` for web landing page.