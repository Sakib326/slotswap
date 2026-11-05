import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/lib/redux/StoreProvider";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | SlotSwap",
    default: "SlotSwap - University Course Section Swapping Platform",
  },
  description:
    "Swap course sections in minutes, not Facebook posts. Graph-based multi-way matching, schedule clash validation, and atomic confirmation for university students.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-bg text-text antialiased font-sans">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
