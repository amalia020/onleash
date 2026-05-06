import type { Metadata } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-sans-family", subsets: ["latin"], weight: ["400","500","600","700"], display: "swap" });
const interTight = Inter_Tight({ variable: "--font-display-family", subsets: ["latin"], weight: ["700","800","900"], display: "swap" });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-mono-family", subsets: ["latin"], weight: ["400","500","600"], display: "swap" });

export const metadata: Metadata = {
  title: "Onleash · Agents unleashed. Wallets on leash.",
  description: "Token-2022 transfer hook for AI agent wallets. Spending policy enforced at the mint layer — a jailbroken agent can sign anything, the chain refuses to clear it.",
  metadataBase: new URL("https://onleash.vercel.app"),
  openGraph: {
    title: "Onleash — Agents unleashed. Wallets on leash.",
    description: "Token-2022 transfer hooks. Spending policy inside the mint, not in middleware.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Onleash — Agents unleashed. Wallets on leash.",
    description: "Token-2022 transfer hooks. Spending policy inside the mint, not in middleware.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
