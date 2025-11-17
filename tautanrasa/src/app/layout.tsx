import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// TypeScript may complain about side-effect CSS imports when no declaration exists.
// Suppress the error here; consider adding a `declare module '*.css'` in a global .d.ts file later.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TAUTAN RASA - Where Every Flowers Tell a Story",
  description: "TAUTAN RASA is a creative fashion brand that brings together innovative design with local Indonesian craftsmanship.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
