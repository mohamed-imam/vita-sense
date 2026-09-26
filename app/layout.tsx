import type { Metadata } from "next";
import "./globals.css";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const deploymentBase = isGitHubPages ? "/vita-sense" : "";
const siteUrl = isGitHubPages ? "https://mohamed-imam.github.io/vita-sense" : "https://vita-sense.com";

export const metadata: Metadata = {
  metadataBase: new URL(isGitHubPages ? "https://mohamed-imam.github.io" : "https://vita-sense.com"),
  title: "VitaSense | EEG, VNG, Allergy & NCV Testing",
  description: "Professional EEG, VNG, skin allergy and NCV testing, delivered with precision, trust and care.",
  alternates: { canonical: `${siteUrl}/` },
  icons: {
    icon: `${deploymentBase}/vitasense-mark.png`,
    shortcut: `${deploymentBase}/vitasense-mark.png`,
    apple: `${deploymentBase}/vitasense-mark.png`,
  },
  openGraph: {
    title: "VitaSense | Clearer answers. Confident next steps.",
    description: "Professional EEG, VNG, skin allergy and NCV testing, delivered with care.",
    url: `${siteUrl}/`,
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
      <body>
        {children}
      </body>
    </html>
  );
}
