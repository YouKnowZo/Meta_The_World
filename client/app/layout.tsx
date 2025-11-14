import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Meta The World - Virtual Reality Metaverse',
  description: 'A hyper-realistic virtual world where you can be anything and own virtual real estate',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
