# GreenHeart — Golf Charity Subscription Platform

A subscription-based web platform combining golf performance tracking,
charity fundraising, and a monthly draw-based reward engine.

Built for the **Digital Heroes Full-Stack Development Trainee Selection Process**.

---

## Live Demo

- **Website:** [your-vercel-url.vercel.app]
- **User Login:** user@demo.com / demo123
- **Admin Login:** admin@demo.com / admin123

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Deployment | Vercel |

---

## Core Features

### User Side
- Subscription system (Monthly £9.99 / Yearly £99)
- 5-score rolling tracker (Stableford format, 1–45)
- Monthly prize draw participation
- Charity selection with variable contribution (10–50%)
- Independent donation system
- Winner verification — proof upload flow
- Personal dashboard with draw countdown and prize pool

### Admin Side
- User management — view all subscribers
- Draw engine — simulate → review → publish
- Prize pool calculation with jackpot rollover
- Charity CRUD with deletion guard
- Winner verification — approve / reject / mark paid

---

## System Architecture

### Database Schema
```
users         → profiles + subscription + charity link
scores        → rolling 5 per user, 1-45 constraint
charities     → category, featured flag, soft delete
draws         → one per month, jackpot rollover
draw_results  → match snapshot + verification workflow
donations     → independent charity contributions
```

### Access Control
- Middleware runs on every protected route server-side
- Role-based routing: /dashboard (user) vs /admin (admin)
- Subscription expiry auto-checked and updated on every request
- RLS enabled on all Supabase tables

### Draw Logic
1. Admin clicks Run Simulation (not saved to DB)
2. 5 unique random numbers generated (1–45)
3. Each active user's scores matched against drawn numbers
4. Winners at 3/4/5 match receive prize from pool split (25/35/40%)
5. Jackpot rolls over if no 5-match winner
6. Admin reviews preview then publishes

### Prize System
```
Total subscription fee = 100%
  Prize pool = 50% (fixed)
  Platform   = 50% (fixed)
  
  Charity deducted from platform share:
  charity_amount = (fee × 0.5) × (charity_percentage / 100)

Pool distribution:
  5-match = 40% + carry forward (jackpot)
  4-match = 35%
  3-match = 25%
  
  No winners in tier 4/3 → remains in platform (by design)
  No winner in tier 5    → carries forward to next month
```

---

## Key Design Decisions

**Why middleware over client-side checks?**
Client-side auth can be bypassed. Middleware runs server-side on every
request before the page loads — impossible to bypass.

**Why snapshot user_scores in draw_results?**
Users can edit scores after a draw. The snapshot freezes scores at draw
time, preserving integrity against post-draw manipulation.

**Why simulate before publish?**
Admin needs to review results before they go live. Saving on simulate
would corrupt the DB if the admin wants to re-run.

**Why soft delete charities (is_active)?**
Hard delete breaks FK references in users.charity_id.
Soft delete preserves data integrity.

**Why carry_forward on draws table?**
Each draw record is self-contained. No extra joins needed to calculate
jackpot — cleaner queries and auditable history.

---

## Partially Implemented (By Design)

| Feature | Status | Notes |
|---|---|---|
| Stripe payments | Not implemented | Mock activation used. Integration point marked in code. |
| Weighted draw algorithm | DB field only | draw_logic column exists. Random only for now. |
| Email notifications | Not implemented | Mentioned in system design. Schema extensible. |
| Charity events | Not implemented | Schema extensible for Phase 2. |
| Proof file upload | URL input only | No file storage. Text URL accepted for demo. |

---

## Local Setup
```bash
# Clone
git clone https://github.com/yourusername/greenheart.git
cd greenheart

# Install
npm install

# Environment variables
cp .env.example .env.local
# Fill in your Supabase credentials

# Run
npm run dev
```

---

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## Database Setup

Run the SQL in `/supabase/schema.sql` in your Supabase SQL editor.

---

## Deployment

Deployed on Vercel. Connect GitHub repo and add environment variables
in Vercel dashboard. Supabase project is separate from any personal accounts.
```

---

## Step 3 — Create .env.example

Create `.env.example` at root (no real values — just the keys):
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=