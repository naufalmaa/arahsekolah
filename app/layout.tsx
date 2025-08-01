// File: app/layout.tsx
// (Your main root layout file for the entire application)

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Your global CSS imports
import { Toaster } from "@/components/ui/sonner"; // Assuming you use Sonner for toasts
import { getServerSession } from "next-auth"; // Import getServerSession for server-side session fetching
import { authOptions } from "@/lib/auth";
import Providers from "@/components/Providers"; // CORRECTED: Import the new Providers component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Arah Sekolah",
  description: "Find your next school",
  icons: {
    icon: [
      { rel: 'icon', type: 'image/png', sizes: '35x35', url: '/logo_only.png' },
    ], // Path to your favicon
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* CORRECTED: Wrap the entire application with the Providers client component. */}
        <Providers session={session}>
          {children}
          <Toaster /> {/* Your toaster component */}
        </Providers>
      </body>
    </html>
  );
}