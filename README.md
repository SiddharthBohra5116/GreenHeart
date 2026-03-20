# GreenHeart — Golf Charity Subscription Platform

A subscription-driven web platform combining golf performance tracking, charity fundraising, and a monthly draw-based reward engine. Built for the Digital Heroes Full-Stack Trainee Selection Process.

---

## Live Demo

- **Website:** [your-vercel-url.vercel.app]
- **Test User:** user@demo.com / demo123
- **Test Admin:** admin@demo.com / Admin@123

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 App Router (JavaScript) |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (SSR) |
| Deployment | Vercel |

---

## Features Built

### Subscription System
- Monthly (₹799) and yearly (₹7,999) plans
- Mock activation with expiry logic (30 days / 365 days)
- Cancel subscription — user-initiated and admin-initiated
- Real-time subscription status validation on every request via `proxy.js`

### Score Management
- Rolling 5-score system (Stableford format, 1–45)
- New score auto-replaces oldest
- Date validation — no future dates allowed
- Scores displayed newest-first

### Draw & Reward Engine
- Monthly draw simulation + publish flow
- **Two draw modes:**
  - `random` — standard lottery-style
  - `algorithmic` — weighted by inverse score frequency (rare scores more likely to be drawn)
- Prize tiers: 5-match (40%), 4-match (35%), 3-match (25%)
- Jackpot rollover if no 5-match winner
- Prizes split equally among multiple winners per tier

### Charity System
- Charity directory with category filter
- Individual charity profile pages with donation stats
- User selects charity at signup / can change on dashboard
- 10% minimum contribution, slideable up to 50%
- Donation recorded on every subscription activation

### Winner Verification
- Proof upload UI on dashboard (screenshot URL)
- Admin approve / reject / mark as paid flow
- Status lifecycle: `pending_verification` → `approved` → `paid`

### User Dashboard
- Subscription status + renewal date
- Score entry interface
- Charity picker + contribution slider
- Draw participation count
- Winnings table with payment status
- Proof upload when winner verification is required
- Cancel subscription with 2-step confirmation

### Admin Panel
- User directory with live search + status filter
- Admin cancel any user's subscription
- Draw simulate (random or algorithmic) + publish
- Charity CRUD (add, edit, delete, feature)
- Winners management with approve / reject / mark as paid
- System overview with live stats

---

## Known Limitations & Planned Enhancements

### Payment Gateway
**Current state:** Mock activation only — no real payment processing.
**Planned:** Stripe integration using `stripe.checkout.sessions.create()` with webhook handling for subscription lifecycle events (renewal, cancellation, failed payment).

### Email Notifications
**Current state:** Not implemented.
**Planned:** Transactional emails via [Resend](https://resend.com) or Nodemailer for:
- Draw result notifications
- Winner alerts with proof upload instructions
- Subscription renewal reminders
- Welcome email on signup

### Charity Events / Upcoming Golf Days
**Current state:** Charity profiles show description and donation stats.
**Planned:** A `charity_events` table with event name, date, location, and registration link — displayed on individual charity profile pages.

### Reports & Analytics
**Current state:** Admin overview page shows headline stats.
**Planned:** Dedicated `/admin/reports` page with charts for monthly revenue, donation totals per charity, draw participation rates, and winner payout history.

### Mobile App
**Current state:** Mobile-responsive web app.
**Planned:** React Native app sharing the same Supabase backend, using Expo for iOS/Android.

---

## Project Structure

```
greenheart/
  app/
    page.js                          ← Homepage (Server Component, live stats)
    layout.js                        ← Manrope + Inter fonts
    globals.css                      ← Tailwind v4 @theme colors
    (public)/
      login/page.js
      signup/page.js
      pricing/page.js
      charities/
        page.js                      ← Charity listing (dynamic from DB)
        [id]/page.js                 ← Individual charity profile
    (protected)/
      dashboard/page.js
      admin/
        layout.js
        page.js
        users/page.js
        draw/page.js
        charities/page.js
        winners/page.js
    api/
      auth/login  logout  signup
      subscription/activate  cancel
      scores/route  add
      charities/route
      draw/simulate  publish
      user/update-charity
      admin/users  charities  winners
      winners/proof
  components/
    home/  dashboard/  admin/  auth/
  lib/
    supabase.js  supabaseAdmin.js  getUser.js  getUserProfile.js
  proxy.js                           ← Route protection (NOT middleware.js)
```

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=https://your-vercel-url.vercel.app
```

---

## Deployment

1. Create a **new** Vercel account (not personal/existing)
2. Create a **new** Supabase project (not personal/existing)
3. Import this repo to Vercel
4. Add all environment variables in Vercel dashboard
5. Deploy

---

*Built by Siddharth Bohra for Digital Heroes Full-Stack Trainee Selection Process — March 2026*