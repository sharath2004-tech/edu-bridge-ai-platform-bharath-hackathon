import type React from "react"
// ... existing code ...
import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next"
import "./globals.css"

// Using system fonts to avoid Turbopack font loading issues in Next.js 16
const _geist = { className: "font-sans" }
const _geistMono = { className: "font-mono" }

export const metadata: Metadata = {
  title: "EduBridge AI - Learn Smarter with AI",
  description: "AI-powered learning platform with offline access, peer sharing, and personalized education",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) {
                    console.log('ServiceWorker registration successful');
                  },
                  function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  }
                );
              });
            }
          `
        }} />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
