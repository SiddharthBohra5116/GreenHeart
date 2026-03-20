// components/home/CharityImage.js
// Small client wrapper so onError (event handler) works inside Server Components
'use client'

const FALLBACK = 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800'

export default function CharityImage({ src, alt, className }) {
  return (
    <img
      src={src || FALLBACK}
      alt={alt}
      className={className}
      onError={(e) => { e.currentTarget.src = FALLBACK }}
    />
  )
}