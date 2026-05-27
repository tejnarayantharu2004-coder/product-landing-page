import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
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
      <body className={clsx(inter.variable, playfair.variable, "font-sans antialiased")}>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1411434077416270');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1411434077416270&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
