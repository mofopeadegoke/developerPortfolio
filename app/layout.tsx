import type React from "react";
import type { Metadata, Viewport } from "next";
import { Archivo, Schibsted_Grotesk } from "next/font/google";
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

// Applied before first paint so list-view visitors never see the gallery flash.
const viewScript = `try{var v=new URLSearchParams(location.search).get("view")||localStorage.getItem("gallery-view");if(v==="list")document.documentElement.dataset.view="list"}catch(e){}`;

const description =
  "Software Engineer in Famagusta, Cyprus. Frontend architecture in React, React Native and TypeScript, full-stack apps with Next.js, PostgreSQL and the Claude API, and C++ systems work. Open to relocation across Europe or remote.";

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
  themeColor: "#0b0807",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${archivo.variable} ${schibsted.variable} font-sans antialiased`}>
        <script dangerouslySetInnerHTML={{ __html: viewScript }} />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
