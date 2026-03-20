// lib/email.js
/**
 * Email notification utility using Resend
 * PRD §13: "Email notifications — system updates, draw results, winner alerts"
 *
 * Setup:
 *  1. npm install resend
 *  2. Add RESEND_API_KEY to .env.local (get free key at resend.com)
 *  3. Add RESEND_FROM_EMAIL to .env.local (e.g. "GreenHeart <noreply@yourdomain.com>")
 *     For testing without a domain, use: "onboarding@resend.dev"
 */

// ── Indian currency formatter ─────────────────────────────────────
function formatINR(amount) {
  if (!amount || amount === 0) return '₹0'
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
  if (amount >= 1000)   return `₹${(amount / 1000).toFixed(1)}k`
  return `₹${Number(amount).toFixed(0)}`
}

/**
 * Core send function — wraps Resend API
 * Falls back gracefully if RESEND_API_KEY is not set (dev mode)
 */
async function sendEmail({ to, subject, html }) {
  const apiKey   = process.env.RESEND_API_KEY
  const fromAddr = process.env.RESEND_FROM_EMAIL || 'GreenHeart <onboarding@resend.dev>'

  if (!apiKey) {
    // Silently skip in dev if key not configured — don't crash the app
    console.log(`[Email skipped — no RESEND_API_KEY] To: ${to} | Subject: ${subject}`)
    return { ok: true, skipped: true }
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({ from: fromAddr, to, subject, html }),
    })

    if (!res.ok) {
      const err = await res.json()
      console.error('[Email error]', err)
      return { ok: false, error: err }
    }

    return { ok: true }
  } catch (err) {
    console.error('[Email send failed]', err)
    return { ok: false, error: err.message }
  }
}

// ─────────────────────────────────────────────────────────────────
// EMAIL TEMPLATES
// ─────────────────────────────────────────────────────────────────

/**
 * Welcome email — sent on successful signup
 * @param {{ name: string, email: string }} user
 */
export async function sendWelcomeEmail({ name, email }) {
  return sendEmail({
    to:      email,
    subject: 'Welcome to GreenHeart 🌿',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
        <div style="background:linear-gradient(135deg,#002e0b,#0b4619);border-radius:16px;
                    padding:32px;text-align:center;margin-bottom:32px;">
          <h1 style="color:#6bfe9c;font-size:32px;margin:0 0 8px;">GreenHeart</h1>
          <p style="color:rgba(255,255,255,0.7);margin:0;font-size:14px;">
            Golf with Purpose. Graceful Giving.
          </p>
        </div>

        <h2 style="color:#002e0b;font-size:24px;">Welcome, ${name}! 👋</h2>
        <p style="color:#424940;line-height:1.6;">
          Your GreenHeart account is ready. You're now part of a community turning
          fairways into fountains of change.
        </p>

        <div style="background:#f2f4f3;border-radius:12px;padding:24px;margin:24px 0;">
          <h3 style="color:#002e0b;margin-top:0;">What's next?</h3>
          <ul style="color:#424940;line-height:2;padding-left:16px;">
            <li>Choose a subscription plan (monthly ₹799 or yearly ₹7,999)</li>
            <li>Select a charity to support</li>
            <li>Enter your Stableford scores</li>
            <li>Participate in monthly prize draws</li>
          </ul>
        </div>

        <div style="text-align:center;margin:32px 0;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/pricing"
             style="background:linear-gradient(135deg,#002e0b,#0b4619);color:white;
                    padding:14px 32px;border-radius:999px;text-decoration:none;
                    font-weight:bold;display:inline-block;">
            View Plans →
          </a>
        </div>

        <p style="color:#72796f;font-size:12px;text-align:center;margin-top:32px;">
          GreenHeart · digitalheroes.co.in<br/>
          You're receiving this because you signed up at greenheart.
        </p>
      </div>
    `,
  })
}

/**
 * Winner alert email — sent when a user wins a draw
 * @param {{ name: string, email: string }} user
 * @param {{ matchCount: number, prizeAmount: number, drawMonth: string }} winDetails
 */
export async function sendWinnerEmail({ name, email }, { matchCount, prizeAmount, drawMonth }) {
  const tierLabel =
    matchCount === 5 ? 'Jackpot (5-Number Match)' :
    matchCount === 4 ? 'Tier 2 (4-Number Match)' :
    'Tier 3 (3-Number Match)'

  return sendEmail({
    to:      email,
    subject: `🏆 You won ${formatINR(prizeAmount)} in the ${drawMonth} GreenHeart Draw!`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
        <div style="background:linear-gradient(135deg,#002e0b,#0b4619);border-radius:16px;
                    padding:32px;text-align:center;margin-bottom:32px;">
          <div style="font-size:48px;">🏆</div>
          <h1 style="color:#6bfe9c;font-size:28px;margin:8px 0 4px;">
            Congratulations!
          </h1>
          <p style="color:rgba(255,255,255,0.7);margin:0;">
            GreenHeart Monthly Draw — ${drawMonth}
          </p>
        </div>

        <h2 style="color:#002e0b;font-size:22px;">
          You've won ${formatINR(prizeAmount)}, ${name}!
        </h2>
        <p style="color:#424940;line-height:1.6;">
          Your scores matched ${matchCount} of the drawn numbers in the
          ${drawMonth} draw — earning you the <strong>${tierLabel}</strong> prize.
        </p>

        <div style="background:#9bf6b2;border-radius:12px;padding:24px;
                    margin:24px 0;text-align:center;">
          <p style="color:#002e0b;font-size:12px;text-transform:uppercase;
                    letter-spacing:0.1em;margin:0 0 8px;font-weight:bold;">
            Your Prize
          </p>
          <p style="color:#002e0b;font-size:40px;font-weight:900;margin:0;">
            ${formatINR(prizeAmount)}
          </p>
          <p style="color:#006d37;font-size:14px;margin:8px 0 0;">
            ${tierLabel}
          </p>
        </div>

        <div style="background:#fff9c4;border:1px solid #f59e0b;border-radius:12px;
                    padding:20px;margin:24px 0;">
          <h3 style="color:#92400e;margin-top:0;font-size:16px;">
            ⚠️ Action Required — Submit Your Proof
          </h3>
          <p style="color:#78350f;font-size:14px;line-height:1.6;margin-bottom:16px;">
            To claim your prize, you need to upload a screenshot of your scores
            from your golf platform. Log in to your dashboard to submit.
          </p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard"
             style="background:#f59e0b;color:#78350f;padding:12px 24px;
                    border-radius:999px;text-decoration:none;font-weight:bold;
                    display:inline-block;font-size:14px;">
            Go to Dashboard →
          </a>
        </div>

        <p style="color:#72796f;font-size:12px;text-align:center;margin-top:32px;">
          GreenHeart · digitalheroes.co.in
        </p>
      </div>
    `,
  })
}

/**
 * Draw results email — sent to all participants after a draw is published
 * @param {{ name: string, email: string }} user
 * @param {{ numbers: number[], drawMonth: string, totalPool: number }} drawInfo
 * @param {number[]} userScores — the user's current scores
 * @param {number[]} matchedNumbers — numbers that matched (empty = no match)
 */
export async function sendDrawResultEmail(
  { name, email },
  { numbers, drawMonth, totalPool },
  userScores = [],
  matchedNumbers = []
) {
  const matchCount = matchedNumbers.length
  const hasWon     = matchCount >= 3

  const numberBalls = numbers.map((n) => {
    const matched = matchedNumbers.includes(n)
    return `
      <span style="display:inline-flex;align-items:center;justify-content:center;
                   width:40px;height:40px;border-radius:50%;font-weight:bold;
                   font-size:14px;margin:4px;
                   background:${matched ? '#9bf6b2' : '#e1e3e2'};
                   color:${matched ? '#00210c' : '#424940'};">
        ${n}
      </span>
    `
  }).join('')

  return sendEmail({
    to:      email,
    subject: `GreenHeart Draw Results — ${drawMonth} ${hasWon ? '🏆 You Won!' : '🎯'}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
        <div style="background:linear-gradient(135deg,#002e0b,#0b4619);border-radius:16px;
                    padding:32px;text-align:center;margin-bottom:32px;">
          <h1 style="color:#6bfe9c;font-size:24px;margin:0 0 4px;">
            Monthly Draw Results
          </h1>
          <p style="color:rgba(255,255,255,0.7);margin:0;">${drawMonth}</p>
        </div>

        <h2 style="color:#002e0b;">Hi ${name},</h2>
        <p style="color:#424940;line-height:1.6;">
          The ${drawMonth} GreenHeart draw has been published!
          Here are the results:
        </p>

        <div style="background:#f2f4f3;border-radius:12px;padding:24px;margin:24px 0;
                    text-align:center;">
          <p style="color:#424940;font-size:12px;text-transform:uppercase;
                    letter-spacing:0.1em;margin:0 0 12px;font-weight:bold;">
            Drawn Numbers
          </p>
          <div>${numberBalls}</div>
        </div>

        ${hasWon ? `
          <div style="background:#9bf6b2;border-radius:12px;padding:20px;
                      margin:24px 0;text-align:center;">
            <p style="color:#002e0b;font-weight:bold;font-size:18px;margin:0;">
              🎉 You matched ${matchCount} number${matchCount > 1 ? 's' : ''}!
            </p>
            <p style="color:#006d37;font-size:14px;margin:8px 0 0;">
              Check your dashboard to submit proof and claim your prize.
            </p>
          </div>
        ` : `
          <div style="background:#f2f4f3;border-radius:12px;padding:20px;
                      margin:24px 0;text-align:center;">
            <p style="color:#424940;font-size:14px;margin:0;">
              You matched ${matchCount} number${matchCount !== 1 ? 's' : ''} this month.
              Keep playing — the jackpot rolls over if unclaimed! 🏌️
            </p>
          </div>
        `}

        <div style="text-align:center;margin:32px 0;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard"
             style="background:linear-gradient(135deg,#002e0b,#0b4619);color:white;
                    padding:14px 32px;border-radius:999px;text-decoration:none;
                    font-weight:bold;display:inline-block;">
            View Dashboard →
          </a>
        </div>

        <p style="color:#72796f;font-size:12px;text-align:center;margin-top:32px;">
          GreenHeart · digitalheroes.co.in
        </p>
      </div>
    `,
  })
}

/**
 * Winner verification approved email
 * @param {{ name: string, email: string }} user
 * @param {{ prizeAmount: number }} winDetails
 */
export async function sendApprovalEmail({ name, email }, { prizeAmount }) {
  return sendEmail({
    to:      email,
    subject: `✅ Your GreenHeart prize has been approved — ${formatINR(prizeAmount)}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
        <div style="background:linear-gradient(135deg,#002e0b,#0b4619);border-radius:16px;
                    padding:32px;text-align:center;margin-bottom:32px;">
          <div style="font-size:48px;">✅</div>
          <h1 style="color:#6bfe9c;font-size:24px;margin:8px 0 0;">
            Prize Approved!
          </h1>
        </div>

        <h2 style="color:#002e0b;">Great news, ${name}!</h2>
        <p style="color:#424940;line-height:1.6;">
          Your proof of scores has been reviewed and approved by our team.
          Your prize of <strong>${formatINR(prizeAmount)}</strong> is being
          processed and will be paid out shortly.
        </p>

        <p style="color:#72796f;font-size:12px;text-align:center;margin-top:32px;">
          GreenHeart · digitalheroes.co.in
        </p>
      </div>
    `,
  })
}