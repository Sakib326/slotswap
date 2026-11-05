import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Sans, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/lib/redux/StoreProvider";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex",
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "600"],
  variable: "--font-hind",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | SlotSwap",
    default: "SlotSwap - University course section swapping",
  },
  description:
    "Post the section you hold and the ones you'd take. SlotSwap finds the match, even when it takes three students, and checks every clash before anyone confirms.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${plexSans.variable} ${hindSiliguri.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-paper text-ink font-body antialiased">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
