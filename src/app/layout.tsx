import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/ui/Sidebar";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { ToastProvider } from "@/components/ui/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Atlaz — Land Intelligence & Business Operations",
    template: "%s | Atlaz",
  },
  description:
    "Best-in-class land intelligence and business operations platform for frontier real estate markets. Interactive mapping, plot intelligence, growth simulation, deal pipeline, and due diligence.",
  keywords: [
    "Zanzibar", "land intelligence", "real estate", "investment",
    "capital allocation", "property analysis", "GIS", "frontier markets",
    "business operations", "deal pipeline", "land investment",
  ],
  openGraph: {
    title: "Atlaz — Land Intelligence & Business Operations",
    description: "Best-in-class land intelligence and business operations platform for frontier real estate markets.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className="h-full overflow-hidden" style={{ background: "#080c18", color: "#f0f4f8" }}>
        <ToastProvider>
          <div className="flex h-full">
            <Sidebar />
            <main className="flex-1 min-w-0 h-full">
              <ErrorBoundary>{children}</ErrorBoundary>
            </main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
