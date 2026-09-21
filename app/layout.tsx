import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const deploymentBase = isGitHubPages ? "/vita-sense" : "";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(isGitHubPages ? "https://mohamed-imam.github.io" : "https://vita-sense.com"),
  title: "VitaSense | EEG, VNG, Allergy & NCV Testing",
  description: "Professional EEG, VNG, skin allergy and NCV testing, delivered with precision, trust and care.",
  icons: {
    icon: `${deploymentBase}/vitasense-mark.png`,
    shortcut: `${deploymentBase}/vitasense-mark.png`,
    apple: `${deploymentBase}/vitasense-mark.png`,
  },
  openGraph: {
    title: "VitaSense | Clearer answers. Confident next steps.",
    description: "Professional EEG, VNG, skin allergy and NCV testing, delivered with care.",
    images: [{ url: `${deploymentBase}/og.png`, width: 1730, height: 909, alt: "Vitasense testing services" }],
  },
  twitter: { card: "summary_large_image", images: [`${deploymentBase}/og.png`] },
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
