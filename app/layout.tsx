import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DAKSHIN-Twin — Antarctic Station Operations Intelligence',
  description: 'Digital Twin framework for Maitri and Bharati Antarctic research stations. SIH 2026 — Problem Statement 26060.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="polar-bg contour-lines min-h-screen">
        {children}
      </body>
    </html>
  )
}
