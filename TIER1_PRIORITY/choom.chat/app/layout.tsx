import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Quantum Terminal (choom.chat)',
  description: 'Post-quantum secure terminal and messaging application - Protect against quantum computer attacks',
  keywords: ['post-quantum', 'cryptography', 'kyber', 'messaging', 'privacy', 'quantum-safe'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-green-400 font-mono">{children}</body>
    </html>
  )
}
