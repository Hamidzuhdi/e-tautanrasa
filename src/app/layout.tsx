import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "@/components/Providers";
import { ToastContainer } from "@/components/shared/Alert";
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
        <Providers>
          {children}
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
