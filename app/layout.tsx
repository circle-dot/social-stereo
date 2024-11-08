import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import "./globals.css";
import Providers from "@/components/providers/Providers";
import { SITE_CONFIG } from "@/config/site";
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: SITE_CONFIG.name,
  description: SITE_CONFIG.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased text-custom-white`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
