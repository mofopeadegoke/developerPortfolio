import type React from "react";
import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const barlow = Barlow({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-barlow",
});
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600"],
  variable: "--font-barlow-condensed",
});

const description =
  "Software Engineer in Famagusta, Cyprus. Frontend architecture in React, React Native and TypeScript, APIs in Python, and C++ systems work. Open to relocation across Europe or remote.";

export const metadata: Metadata = {
  title: "Daniel Adegoke | Software Engineer",
  description,
  keywords: [
    "Software Engineer",
    "Frontend Engineer",
    "React",
    "React Native",
    "TypeScript",
    "Python",
    "C++",
    "Cyprus",
  ],
  authors: [{ name: "Daniel Mofopefoluwa Adegoke" }],
  openGraph: {
    title: "Daniel Adegoke | Software Engineer",
    description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daniel Adegoke | Software Engineer",
    description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ecede8" },
    { media: "(prefers-color-scheme: dark)", color: "#1e2329" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${barlow.variable} ${barlowCondensed.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
