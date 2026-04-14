import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mi-Lot — Vehicle Referral Network",
  description: "Make the dealers compete for your business. Submit your vehicle request and let the offers come to you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,600;0,700;0,800;1,400;1,700&family=Montserrat:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400;1,700&family=Oswald:wght@400;600;700&family=Raleway:ital,wght@0,400;0,600;0,700;0,800;1,400;1,700&family=Space+Grotesk:wght@400;500;600;700&family=Bebas+Neue&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700&family=Righteous&family=Russo+One&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
