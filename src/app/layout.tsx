import type { Metadata } from "next";
import { Inter, Amarante, IBM_Plex_Mono, VT323 } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const amarante = Amarante({
  variable: "--font-amarante",
  weight: "400",
  subsets: ["latin"],
});

/* Terminal type for the Projects section. Two faces, because one cannot
   do both jobs: VT323 is a genuine CRT bitmap face and is unreadable
   below ~18px, so it takes the display sizes only, and IBM Plex Mono —
   readable down to 9px — carries the body copy and every micro-label. */
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const vt323 = VT323({
  variable: "--font-vt323",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Anika Jain — Portfolio",
  description: "Personal portfolio of Anika Jain — developer, designer, creator.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${amarante.variable} ${plexMono.variable} ${vt323.variable} h-full antialiased`}
    >
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/2.6.0/uicons-solid-straight/css/uicons-solid-straight.css" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
