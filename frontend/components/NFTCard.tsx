'use client';

import Link from 'next/link';
import Image from 'next/image';
import { NFT } from '@/lib/nft';
import { octasToApt } from '@/lib/aptos';

interface NFTCardProps {
  nft: NFT;
}

export default function NFTCard({ nft }: NFTCardProps) {
  const imageUrl = nft.metadata?.image || '/placeholder-nft.png';
  const name = nft.metadata?.name || 'Unnamed NFT';
  const donationsInApt = octasToApt(nft.totalDonations);

  return (
    <Link href={`/donate/${nft.owner}?id=${nft.id}`}>
      <div className="glass rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer group">
        <div className="relative aspect-square overflow-hidden bg-dark-800">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-2 truncate">
            {name}
          </h3>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Total Loans</span>
            <span className="text-lg font-bold gradient-text">
              {donationsInApt.toFixed(4)} APT
            </span>
          </div>

          <button className="mt-4 w-full py-2 bg-gradient-primary text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
            Lend Now
          </button>
        </div>
      </div>
    </Link>
  );
}
