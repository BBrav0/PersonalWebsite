import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: "Ben Bravo's Site",
  description: "Developed by Ben",
  generator: "Benjamin Bravo",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body>
        {children}
      </body>
    </html>
  )
}
