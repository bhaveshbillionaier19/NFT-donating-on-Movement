'use client';

import { NFT } from '@/lib/nft';
import NFTCard from './NFTCard';

interface NFTGalleryProps {
  nfts: NFT[];
  loading?: boolean;
}

export default function NFTGallery({ nfts, loading }: NFTGalleryProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass rounded-xl overflow-hidden animate-pulse">
            <div className="aspect-square bg-dark-700" />
            <div className="p-4 space-y-3">
              <div className="h-6 bg-dark-700 rounded" />
              <div className="h-4 bg-dark-700 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🎨</div>
        <h3 className="text-2xl font-semibold text-gray-300 mb-2">
          No NFTs Yet
        </h3>
        <p className="text-gray-400 mb-6">
          Be the first to mint an NFT on the platform!
        </p>
        <a
          href="/mint"
          className="inline-block px-6 py-3 bg-gradient-primary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          Mint Your First NFT
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {nfts.map((nft) => (
        <NFTCard key={`${nft.owner}-${nft.id}`} nft={nft} />
      ))}

      {/* Mint New NFT Card */}
      <a href="/mint" className="glass rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer flex flex-col items-center justify-center min-h-[350px] bg-white/5 hover:bg-white/10 group border-2 border-dashed border-white/20 hover:border-white/40">
        <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-4xl text-white">
          +
        </div>
        <span className="text-xl font-bold text-white">Mint NFT</span>
      </a>
    </div>
  );
}
