'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import NFTGallery from '@/components/NFTGallery';
import { NFT, getNFTCollection } from '@/lib/nft';

export default function HomePage() {
  const { account } = useWallet();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNFTs();
  }, [account]);

  const loadNFTs = async () => {
    setLoading(true);
    try {
      // In a production app, you would use an indexer to get all NFTs
      // For now, we'll just load the connected user's NFT if they have one
      const testNFTs: NFT[] = [];

      if (account?.address) {
        const userNFTs = await getNFTCollection(account.address);
        testNFTs.push(...userNFTs);
      }

      // You can add more known addresses here for testing
      // Example: const knownAddresses = ['0x123...', '0x456...'];

      setNfts(testNFTs);
    } catch (error) {
      console.error('Failed to load NFTs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          <span className="gradient-text">LoanFunding</span>
        </h1>

      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass p-6 rounded-xl text-center">
          <div className="text-3xl font-bold gradient-text mb-2">
            {nfts.length}
          </div>
          <div className="text-gray-400">Total NFTs</div>
        </div>
        <div className="glass p-6 rounded-xl text-center">
          <div className="text-3xl font-bold gradient-text mb-2">
            {nfts.reduce((sum, nft) => sum + nft.totalDonations, 0) / 100_000_000}
          </div>
          <div className="text-gray-400">Total Loan (APT)</div>
        </div>
        <div className="glass p-6 rounded-xl text-center">
          <div className="text-3xl font-bold gradient-text mb-2">Move</div>
          <div className="text-gray-400">Blockchain</div>
        </div>
      </div>

      {/* NFT Gallery */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">NFT Gallery</h2>
          <button
            onClick={loadNFTs}
            className="px-4 py-2 glass hover:bg-white/10 rounded-lg transition-colors"
          >
            🔄 Refresh
          </button>
        </div>

        <NFTGallery nfts={nfts} loading={loading} />
      </div>

      {/* Call to Action */}
      {!account && (
        <div className="mt-12 text-center glass p-8 rounded-xl">
          <h3 className="text-2xl font-semibold mb-4">To start</h3>
          <p className="text-gray-400 mb-6">
            Connect your Petra wallet to mint NFTs and start accepting Loan
          </p>
          <div className="text-sm text-gray-500">

            <a
              href="https://petra.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300"
            >
              Download here
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
