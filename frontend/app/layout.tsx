'use client';

import "./globals.css";
import dynamic from "next/dynamic";
import WalletButton from "@/components/WalletButton";
import Link from "next/link";
import { useEffect } from "react";

// Dynamically import WalletProvider with SSR disabled to avoid Set serialization errors
const WalletProvider = dynamic(
  () => import("@/components/WalletProvider"),
  { ssr: false }
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Set document metadata on client side
  useEffect(() => {
    document.title = "NFT Donation Platform";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Mint NFTs and accept donations on Movement blockchain');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Mint NFTs and accept donations on Movement blockchain';
      document.head.appendChild(meta);
    }
  }, []);
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          <div className="min-h-screen bg-dark-950">
            {/* Navigation Header */}
            <nav className="glass border-b border-white/10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <div className="flex items-center gap-8">
                    <Link href="/" className="text-2xl font-bold gradient-text">
                      NFT Donations
                    </Link>
                    <div className="hidden md:flex gap-6">
                      <Link
                        href="/"
                        className="text-gray-300 hover:text-white transition-colors"
                      >
                        Gallery
                      </Link>
                      <Link
                        href="/mint"
                        className="text-gray-300 hover:text-white transition-colors"
                      >
                        Mint NFT
                      </Link>
                    </div>
                  </div>
                  <WalletButton />
                </div>
              </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>

            {/* Footer */}
            <footer className="mt-20 border-t border-white/10 py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">


              </div>
            </footer>
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}
