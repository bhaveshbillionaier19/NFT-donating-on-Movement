'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { NFT, getNFTCollection } from '@/lib/nft';
import { buildDonateTransaction } from '@/lib/transactions';
import { aptToOctas, octasToApt } from '@/lib/aptos';

export default function DonatePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { account, signAndSubmitTransaction } = useWallet();

  const nftOwner = params.address as string;
  const nftId = searchParams.get('id');

  const [nft, setNft] = useState<NFT | null>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [donating, setDonating] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (nftOwner) {
      loadNFT();
    }
  }, [nftOwner, nftId]);

  const loadNFT = async () => {
    setLoading(true);
    try {
      const nfts = await getNFTCollection(nftOwner);
      const targetNFT = nfts.find(n => n.id === (nftId || '0'));

      if (!targetNFT) {
        setError('NFT not found at this address with the specified ID');
      } else {
        setNft(targetNFT);
      }
    } catch (err) {
      console.error('Failed to load NFT:', err);
      setError('Failed to load NFT data');
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account) {
      setError('Please connect your wallet first');
      return;
    }

    if (!nft) return;

    const donationAmount = parseFloat(amount);
    if (!donationAmount || donationAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setDonating(true);
    setError('');
    setStatus('Preparing transaction...');

    try {
      // Convert APT to Octas
      const amountInOctas = aptToOctas(donationAmount);

      setStatus('Waiting for wallet approval...');

      // Build and submit loan transaction
      const transaction = buildDonateTransaction(nftOwner, nft.id, amountInOctas);
      const response = await signAndSubmitTransaction(transaction);

      setStatus('Processing loan...');

      // Wait for transaction confirmation
      await new Promise(resolve => setTimeout(resolve, 2000));

      setStatus(`Successfully lent ${donationAmount} APT! 🎉`);
      setAmount('');

      // Reload NFT data to show updated loans
      setTimeout(() => {
        loadNFT();
        setStatus('');
      }, 3000);

    } catch (err: any) {
      console.error('Loan error:', err);
      setError(err.message || 'Failed to process loan');
      setStatus('');
    } finally {
      setDonating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="glass p-8 rounded-xl animate-pulse">
          <div className="aspect-square bg-dark-700 rounded-lg mb-6" />
          <div className="h-8 bg-dark-700 rounded mb-4" />
          <div className="h-4 bg-dark-700 rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (error && !nft) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <div className="glass p-12 rounded-xl">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-semibold mb-4">{error}</h2>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  if (!nft) return null;

  const imageUrl = nft.metadata?.image || '/placeholder-nft.png';
  const name = nft.metadata?.name || 'Unnamed NFT';
  const desc = nft.metadata?.description || 'No description available';

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => router.push('/')}
        className="mb-6 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
      >
        ← Back to Gallery
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* NFT Display */}
        <div className="glass p-6 rounded-xl">
          <div className="relative aspect-square overflow-hidden rounded-lg mb-6">
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <h1 className="text-3xl font-bold mb-4">{name}</h1>
          <p className="text-gray-400 mb-6">{desc}</p>

          <div className="glass p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">Total Loans</div>
            <div className="text-3xl font-bold gradient-text">
              {octasToApt(nft.totalDonations).toFixed(4)} APT
            </div>
          </div>
        </div>

        {/* Loan Form */}
        <div className="glass p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-6">Support This NFT</h2>

          <form onSubmit={handleDonate} className="space-y-6">
            <div>
              <label htmlFor="amount" className="block text-sm font-semibold mb-2">
                Loan Amount (APT)
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.1"
                step="any"
                min="0"
                className="w-full px-4 py-3 bg-dark-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary-500 transition-colors text-lg"
                required
              />
              <p className="text-sm text-gray-400 mt-2">
                {amount && parseFloat(amount) > 0
                  ? `≈ ${aptToOctas(parseFloat(amount)).toLocaleString()} Octas`
                  : 'Minimum: 0.00000001 APT'}
              </p>
            </div>

            {/* Quick Amount Buttons */}
            <div>
              <p className="text-sm font-semibold mb-2">Quick amounts:</p>
              <div className="grid grid-cols-4 gap-2">
                {[0.1, 0.5, 1, 5].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt.toString())}
                    className="px-3 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors text-sm"
                  >
                    {amt} APT
                  </button>
                ))}
              </div>
            </div>

            {/* Status Messages */}
            {status && (
              <div className="p-4 bg-primary-900/20 border border-primary-500/50 rounded-lg text-primary-300">
                {status}
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-300">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={donating || !account}
              className="w-full py-4 bg-gradient-primary hover:opacity-90 text-white font-semibold rounded-lg transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {donating ? 'Processing...' : account ? 'Lend Now' : 'Connect Wallet First'}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-dark-800/50 rounded-lg">
            {/* <p className="text-sm text-gray-400">
              All loans are processed on-chain and directly sent to the NFT owner.
              Transaction fees apply.
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
}
