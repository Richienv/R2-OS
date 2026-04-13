import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "R2·OS — Your Personal Operating System",
  description:
    "Fitness. School. Finance. Build. One hub to control your entire life.",

  openGraph: {
    title: "R2·OS",
    description:
      "Fitness. School. Finance. Build. One hub to control your entire life.",
    url: "https://r2-os.vercel.app",
    siteName: "R2·OS",
    images: [
      {
        url: "https://r2-os.vercel.app/api/og",
        width: 1200,
        height: 630,
        alt: "R2·OS — Personal Operating System",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "R2·OS",
    description:
      "Fitness. School. Finance. Build. One hub to control your entire life.",
    images: ["https://r2-os.vercel.app/api/og"],
  },

  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },

  manifest: "/manifest.json",

  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "R2·OS",
  },
};

export const viewport: Viewport = {
  themeColor: "#080808",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
