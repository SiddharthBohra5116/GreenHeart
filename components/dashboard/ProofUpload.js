'use client'

import { useState } from 'react'

/**
 * ProofUpload — Dashboard component
 *
 * Shows when the user has a draw_result with status
 * 'pending_verification' or 'rejected'.
 *
 * Props:
 *   resultId  — draw_results.id (UUID string)
 *   status    — current status string ('pending_verification' | 'rejected')
 *   proofUrl  — existing proof_url if already submitted (string | null)
 *   onSuccess — optional callback after successful submission
 */
export default function ProofUpload({ resultId, status, proofUrl, onSuccess }) {
  const [url, setUrl] = useState(proofUrl || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  // Only render for eligible statuses
  if (!['pending_verification', 'rejected'].includes(status)) return null

  async function handleSubmit() {
    setError(null)

    if (!url.trim()) {
      setError('Please paste a valid screenshot URL.')
      return
    }

    // Basic URL sanity check
    try {
      new URL(url.trim())
    } catch {
      setError('That doesn\'t look like a valid URL. Please check and try again.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/winners/proof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resultId, proofUrl: url.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        setLoading(false)
        return
      }

      setSubmitted(true)
      if (onSuccess) onSuccess()
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Success state ──────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="glass-panel rounded-[2rem] p-6 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #002e0b 0%, #0b4619 100%)' }}
          >
            <span className="material-symbols-outlined text-[#6bfe9c] text-xl">check_circle</span>
          </div>
          <div>
            <p className="font-headline font-semibold text-[#191c1c] text-base">
              Proof submitted!
            </p>
            <p className="text-[#424940] text-sm">
              Our team will review your submission shortly.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ── Main form ──────────────────────────────────────────────────
  return (
    <div className="glass-panel rounded-[2rem] p-6 flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: 'linear-gradient(135deg, #002e0b 0%, #0b4619 100%)' }}
        >
          <span className="material-symbols-outlined text-[#6bfe9c] text-xl">emoji_events</span>
        </div>
        <div>
          <p className="font-headline font-semibold text-[#191c1c] text-base leading-tight">
            {status === 'rejected' ? 'Proof rejected — resubmit' : 'Winner verification required'}
          </p>
          <p className="text-[#424940] text-sm mt-1">
            {status === 'rejected'
              ? 'Your previous submission was rejected. Please upload a clearer screenshot of your scores.'
              : 'Congratulations on your win! Submit a screenshot of your scores from your golf platform to verify and claim your prize.'}
          </p>
        </div>
      </div>

      {/* Rejected badge */}
      {status === 'rejected' && (
        <div
          className="rounded-full px-4 py-1.5 text-xs font-semibold self-start"
          style={{ background: '#fef2f2', color: '#b91c1c' }}
        >
          Previous submission rejected
        </div>
      )}

      {/* Instructions */}
      <div
        className="rounded-[1rem] p-4 flex flex-col gap-2"
        style={{ background: '#f2f4f3', border: '1px solid #c1c9bd' }}
      >
        <p className="text-[#191c1c] text-xs font-semibold uppercase tracking-wider">
          How to submit
        </p>
        <ol className="text-[#424940] text-sm flex flex-col gap-1 list-decimal list-inside">
          <li>Take a screenshot of your scores on your golf platform.</li>
          <li>Upload the image to any image host (e.g. Imgur, Google Drive).</li>
          <li>Paste the public link below and click Submit.</li>
        </ol>
      </div>

      {/* URL input */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="proof-url"
          className="text-[#191c1c] text-sm font-semibold"
        >
          Screenshot URL
        </label>
        <input
          id="proof-url"
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value)
            if (error) setError(null)
          }}
          placeholder="https://i.imgur.com/your-screenshot.png"
          disabled={loading}
          className="w-full rounded-full px-5 py-3 text-sm text-[#191c1c] outline-none transition-all"
          style={{
            background: '#ffffff',
            border: error ? '1.5px solid #b91c1c' : '1.5px solid #c1c9bd',
            boxShadow: error ? '0 0 0 3px rgba(185,28,28,0.08)' : 'none',
          }}
          onFocus={(e) => {
            if (!error) e.target.style.border = '1.5px solid #006d37'
            if (!error) e.target.style.boxShadow = '0 0 0 3px rgba(0,109,55,0.12)'
          }}
          onBlur={(e) => {
            if (!error) e.target.style.border = '1.5px solid #c1c9bd'
            if (!error) e.target.style.boxShadow = 'none'
          }}
        />
        {error && (
          <p className="text-sm flex items-center gap-1.5" style={{ color: '#b91c1c' }}>
            <span className="material-symbols-outlined text-base">error</span>
            {error}
          </p>
        )}
      </div>

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="signature-gradient rounded-full px-6 py-3 text-sm font-semibold text-white flex items-center justify-center gap-2 transition-opacity self-start"
        style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
      >
        {loading ? (
          <>
            <span
              className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
            />
            Submitting…
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[#6bfe9c] text-base">upload</span>
            Submit proof
          </>
        )}
      </button>
    </div>
  )
}