import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cafe POS',
  description: 'Offline-first cafe point of sale system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
        {children}
      </body>
    </html>
  )
}

