import type React from "react";
import type { Metadata, Viewport } from "next";
import { Archivo, Geist_Mono, Schibsted_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  weight: "variable",
  axes: ["wdth"],
  variable: "--font-archivo",
});
const schibsted = Schibsted_Grotesk({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-schibsted",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-geist-mono",
});

// Applied before first paint, so phones lay out as the plain page from the
// first frame and the hero entrance never flashes.
const tierScript = `try{var d=document.documentElement,q=new URLSearchParams(location.search);if(q.get("tier")!=="full"&&(q.get("tier")==="still"||matchMedia("(prefers-reduced-motion: reduce)").matches||!matchMedia("(min-width: 1024px) and (pointer: fine)").matches))d.dataset.tier="still"}catch(e){}`;

const description =
  "Software engineer in Famagusta, Cyprus. Frontend architecture in React, React Native and TypeScript, full-stack Next.js and PostgreSQL with the Claude API, open-source MCP contributions, and C++ systems work.";

export const metadata: Metadata = {
  title: "Daniel Adegoke | Software Engineer",
  description,
  keywords: ["Software Engineer", "Frontend Engineer", "React", "React Native", "TypeScript", "Next.js", "MCP", "C++", "Cyprus"],
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
  themeColor: "#0b0807",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${archivo.variable} ${schibsted.variable} ${geistMono.variable} font-sans antialiased`}>
        <script dangerouslySetInnerHTML={{ __html: tierScript }} />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
