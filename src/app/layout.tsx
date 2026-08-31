import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatbotWidget from "@/components/layout/ChatbotWidget";
import { AuthProvider } from "@/lib/context/AuthContext";

export const metadata: Metadata = {
  title: "ApnaKona — Find PG, Hostel & Flats Near Your College",
  description:
    "ApnaKona helps students find safe, affordable PGs, hostels, and flats near their college or workplace in any city across India. Verified listings, owner chats, and roommate matching.",
  keywords: "PG, hostel, flat, student accommodation, India, find room, college PG",
  authors: [{ name: "ApnaKona Team" }],
  openGraph: {
    title: "ApnaKona — Your Corner in Every City",
    description: "Find PG, Hostel & Flats Near Your College",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-surface">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <ChatbotWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
