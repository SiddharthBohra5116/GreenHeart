import { Manrope, Inter } from 'next/font/google'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  title: 'GreenHeart — Golf. Win. Give.',
  description: 'Subscribe, track your scores, win prizes, support charity.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en"
      className={`${manrope.variable} ${inter.variable}`}
      suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body
        style={{ backgroundColor: '#f8faf9', color: '#191c1c' }}
        suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}