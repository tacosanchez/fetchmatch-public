import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FetchMatch — Find Your Rescue Dog",
  description: "AI-powered rescue dog matching for Australian adopters",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <header className="border-b border-warm-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <nav className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-warm-gray-900">
              <span className="text-2xl">🐾</span>
              <span>Fetch<span className="text-amber-600">Match</span></span>
            </Link>
            <Link
              href="/quiz"
              className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-full text-sm font-semibold transition-colors"
            >
              Find Your Match
            </Link>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-warm-gray-200 py-8 mt-16">
          <div className="max-w-5xl mx-auto px-4 text-center text-sm text-warm-gray-500">
            <p>FetchMatch connects adopters with rescue dogs across Australia.</p>
            <p className="mt-1">
              All listings link back to{" "}
              <span className="text-amber-600 font-medium">PetRescue</span>{" "}
              — adopt through the rescue directly.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
