import type { Metadata } from 'next'

import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Cormorant_Garamond, Montserrat, Playfair_Display } from 'next/font/google'
import { Providers } from './providers'

// Initialize elegant fonts for high-society theme
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ["300","400","500","600","700"],
  variable: '--font-display',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ["300","400","500","600"],
  variable: '--font-sans',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ["400","500","600","700"],
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: 'MadaLaws - Lois de Madagascar',
  description: 'Plateforme complète de consultation des lois de Madagascar avec une structure hiérarchique avancée',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${cormorant.variable} ${montserrat.variable} ${playfair.variable} bg-background text-foreground antialiased font-sans`}>
        <Providers>
          {children}
        </Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
