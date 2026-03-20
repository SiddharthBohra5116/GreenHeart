'use client'

import { useState } from 'react'

export default function CancelSubscription() {
  const [loading,   setLoading]   = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [error,     setError]     = useState('')

  async function handleCancel() {
    if (!confirmed) {
      setConfirmed(true) // first click = show confirmation
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/subscription/cancel', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()

      if (res.ok) {
        window.location.replace('/dashboard')
      } else {
        setError(data.error || 'Failed to cancel. Please try again.')
        setConfirmed(false)
      }
    } catch {
      setError('Network error. Please try again.')
      setConfirmed(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-4 space-y-2">
      {error && (
        <p className="text-xs text-red-600 text-center">{error}</p>
      )}
      {confirmed && !loading && (
        <p className="text-xs text-red-600 text-center font-medium">
          Are you sure? This will end your access immediately.
        </p>
      )}
      <button
        onClick={handleCancel}
        disabled={loading}
        className={`w-full py-3 rounded-full text-xs font-bold transition-all
                    disabled:opacity-50 disabled:cursor-not-allowed ${
          confirmed
            ? 'bg-red-600 text-white hover:bg-red-700'
            : 'bg-[#f2f4f3] text-red-600 hover:bg-red-50 border border-red-200'
        }`}>
        {loading
          ? 'Cancelling…'
          : confirmed
          ? 'Yes, cancel my subscription'
          : 'Cancel Subscription'}
      </button>
      {confirmed && !loading && (
        <button
          onClick={() => setConfirmed(false)}
          className="w-full py-2 text-xs text-[#424940] hover:text-[#191c1c]
                     font-medium transition-colors">
          Keep my subscription
        </button>
      )}
    </div>
  )
}