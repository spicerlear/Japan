import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Japan 2026 Trip Planner',
  description: 'May 6-17, 2026: Hakone, Kyoto, Tokyo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
