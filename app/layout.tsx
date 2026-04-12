import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "R2·OS",
  description: "Your life. One screen.",
};

export const viewport = {
  themeColor: "#F2F0EB",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const themeScript = `(function(){var t=localStorage.getItem('r2os-theme')||'light';document.documentElement.setAttribute('data-theme',t)})()`;
  return (
    <html lang="en" className={playfair.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
