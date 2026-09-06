import type { Metadata } from "next";
import { Inter, Amarante } from "next/font/google";
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
    <html lang="en" className={`${inter.variable} ${amarante.variable} h-full antialiased`}>
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
