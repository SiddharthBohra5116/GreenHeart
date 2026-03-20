import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm',
  display: 'swap',
})

export const metadata = {
  title: 'GreenHeart — Golf. Win. Give.',
  description: 'Subscribe, track your scores, win prizes, support charity.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="bg-[#0a0f0a] text-[#f0ece0] font-dm antialiased">
        {children}
      </body>
    </html>
  )
}