import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { clsx } from "clsx";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair"
});

export const metadata: Metadata = {
  title: "Braniva Oils | Pure Rice Bran Oil",
  description:
    "Order Braniva Rice Bran Oil with Cash on Delivery. Pure, heart-healthy, locally sourced Nepali cooking oil.",
  icons: {
    icon: [
      { url: "/favicon-large.png?v=3", sizes: "512x512", type: "image/png" },
      { url: "/favicon-192.png?v=3", sizes: "192x192", type: "image/png" },
      { url: "/favicon-32.png?v=3", sizes: "32x32", type: "image/png" }
    ],
    apple: [{ url: "/favicon-large.png?v=3", sizes: "512x512", type: "image/png" }]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={clsx(inter.variable, playfair.variable, "font-sans antialiased")}>{children}</body>
    </html>
  );
}
