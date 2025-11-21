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
      <head>
        {/* Midtrans Snap.js - Load based on environment */}
        <script 
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-nZWQ-kJgPOGy5R8J'}
          async
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              console.log('Midtrans Client Key:', '${process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'NOT_SET'}');
              window.addEventListener('load', function() {
                if (typeof window.snap !== 'undefined') {
                  console.log('✅ Midtrans Snap.js loaded successfully');
                } else {
                  console.warn('⚠️ Midtrans Snap.js NOT loaded - check Client Key');
                }
              });
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
