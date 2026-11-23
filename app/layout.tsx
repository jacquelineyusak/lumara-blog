import type { Metadata, Viewport } from "next";
import "@fontsource-variable/fraunces/wght.css";
import "@fontsource-variable/fraunces/wght-italic.css";
import "@fontsource-variable/manrope/wght.css";
import "./globals.css";
import { AnalyticsConsent } from "@/components/analytics-consent";
import { siteUrl } from "@/lib/site-url";

const publicSiteUrl = siteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(new URL(publicSiteUrl).origin),
  title: { default: "Lumara Notes", template: "%s | Lumara Notes" },
  description: "Practical notes on bookkeeping, tax reporting, compliance, and building clearer systems for growing businesses.",
  applicationName: "Lumara Notes",
  authors: [{ name: "Lumara" }],
  creator: "Lumara",
  icons: { icon: "/blog/favicon.ico" },
  openGraph: {
    type: "website",
    siteName: "Lumara Notes",
    title: "Lumara Notes",
    description: "Clear thinking for growing businesses.",
    images: [{ url: "/blog/assets/blog/lumara-editorial.png", width: 1536, height: 1024, alt: "Lumara Notes" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumara Notes",
    description: "Clear thinking for growing businesses.",
    images: ["/blog/assets/blog/lumara-editorial.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1a0d1e",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        {children}
        <AnalyticsConsent measurementId={process.env.NEXT_PUBLIC_GA_ID} />
      </body>
    </html>
  );
}
