import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Capehorn Monitor - Network & Transaction Monitoring Platform",
  description: "Comprehensive network and transaction monitoring platform for real-time performance insights, health indicators, and proactive issue detection. Monitor your services with advanced analytics and visual dashboards.",
  keywords: "network monitoring, transaction monitoring, performance analytics, system health, uptime monitoring, real-time metrics",
  generator: "Next.js",
  openGraph: {
    title: "Capehorn Monitor - Network & Transaction Monitoring Platform",
    description: "Comprehensive monitoring platform for real-time performance insights and proactive issue detection.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <style>{`
html {
  font-family: ${inter.style.fontFamily};
  --font-sans: ${inter.style.fontFamily};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
