import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Veo 3.1 8K AI Video Generator',
  description: 'Generate ultra-realistic cinematic 8K videos with Google Veo 3.1',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <div className="mx-auto max-w-6xl px-4 py-8">
          {children}
        </div>
      </body>
    </html>
  )
}
