import type { Metadata } from "next";
import { Suspense } from "react";
import localFont from "next/font/local";
import { Inter, Poppins } from "next/font/google";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { ContactFormDialogProvider } from "@/components/forms/ContactFormDialogProvider";
import { JsonLd } from "@/components/shared/JsonLd";
import { UtmCapture } from "@/components/shared/UtmCapture";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/data/site";
import "./globals.css";
import { GoogleTagManager } from '@next/third-parties/google'

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

const grenettePro = localFont({
  src: [
    {
      path: "../../public/Grenette-Pro/GrenettePro-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/Grenette-Pro/GrenettePro-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/Grenette-Pro/GrenettePro-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/Grenette-Pro/GrenettePro-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/Grenette-Pro/GrenettePro-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  robots: { index: true, follow: true },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  email: siteConfig.email,
  telephone: siteConfig.phone,
  address: {
    "@type": "PostalAddress",
    addressLocality: siteConfig.address,
    addressCountry: "IN",
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
      className={`${inter.variable} ${poppins.variable} ${grenettePro.variable} h-full scroll-smooth antialiased overflow-x-clip`}
    >
      <GoogleTagManager gtmId="GTM-PC7XMGZ8" />
      <body className="flex min-h-full flex-col font-sans overflow-x-clip">
        <ContactFormDialogProvider>
          <JsonLd data={organizationJsonLd} />
          <Suspense fallback={null}>
            <UtmCapture />
          </Suspense>
          <SiteChrome>{children}</SiteChrome>
          <Toaster />
        </ContactFormDialogProvider>
      </body>
    </html>
  );
}
