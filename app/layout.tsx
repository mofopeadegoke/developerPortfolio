import React from "react"
import type { Metadata } from 'next'
import { Inter, Fira_Code } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-fira" });

export const metadata: Metadata = {
  title: 'Daniel Adegoke | Full-Stack Developer',
  description: 'Software Developer specializing in React, Vue.js, TypeScript, PHP, and Node.js. Building production-ready web applications with a strong product mindset.',
  keywords: ['Software Developer', 'Full-Stack Developer', 'React', 'TypeScript', 'Node.js', 'Frontend Developer'],
  authors: [{ name: 'Daniel Mofopefoluwa Adegoke' }],
  openGraph: {
    title: 'Daniel Adegoke | Full-Stack Developer',
    description: 'Software Developer specializing in modern JavaScript frameworks and scalable APIs.',
    type: 'website',
  },
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${firaCode.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
