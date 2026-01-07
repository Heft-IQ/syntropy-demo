import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Syntropy Demo - Enterprise Intelligence Layer",
  description: "Demo application showcasing Syntropy's enterprise intelligence layer with voice-driven metric definition and architecture visualization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          rootBox: 'mx-auto',
          card: 'bg-slate-900 border border-slate-800',
          headerTitle: 'text-white',
          headerSubtitle: 'text-slate-400',
          socialButtonsBlockButton: 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700',
          formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-500',
          formFieldInput: 'bg-slate-800 border-slate-700 text-white',
          formFieldLabel: 'text-slate-300',
          footerActionLink: 'text-indigo-400 hover:text-indigo-300',
        },
      }}
    >
      <html lang="en" className="dark">
        <body className={`${inter.variable} antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
