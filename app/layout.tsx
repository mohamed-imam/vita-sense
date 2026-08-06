import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  metadataBase: new URL("https://vita-sense.com"),
  title: "VitaSense | Nerve, Allergy & Circulation Testing",
  description: "Professional nerve, allergy and circulation testing, delivered with precision, trust and care.",
  icons: {
    icon: "/vitasense-logo.jpg",
    shortcut: "/vitasense-logo.jpg",
  },
  openGraph: {
    title: "VitaSense | Clearer answers. Confident next steps.",
    description: "Professional nerve, allergy and circulation testing, delivered with care.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "VitaSense testing services" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
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
        {children}
      </body>
    </html>
  );
}
