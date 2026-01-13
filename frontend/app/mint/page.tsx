'use client';

import { useState, useCallback } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useRouter } from 'next/navigation';

export default function MintPage() {
  const { account, signAndSubmitTransaction } = useWallet();
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account) {
      setError('Please connect your wallet first');
      return;
    }

    if (!imageFile || !name || !description) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    setStatus('Uploading to IPFS...');

    try {
      // Step 1: Upload to IPFS via API route
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('name', name);
      formData.append('description', description);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({}));
        const errorMessage = errorData.error || 'Failed to upload to IPFS';
        const errorHint = errorData.hint ? `\n${errorData.hint}` : '';
        throw new Error(errorMessage + errorHint);
      }

      const { metadataURI } = await uploadResponse.json();
      setStatus('Creating NFT on blockchain...');

      // Step 2: Mint NFT on blockchain
      // Use Aptos SDK to build a compatible transaction for Petra
      const payload = {
        function: `${process.env.NEXT_PUBLIC_MODULE_ADDRESS}::nft_donation::mint_nft`,
        typeArguments: [],
        functionArguments: [metadataURI],
      };

      console.log('Transaction payload:', payload);
      console.log('Metadata URI:', metadataURI);

      const response = await signAndSubmitTransaction({
        data: payload as any,
      });

      console.log('Transaction response:', response);
      setStatus('Waiting for confirmation...');

      // Wait a bit for the transaction to be processed
      await new Promise(resolve => setTimeout(resolve, 2000));

      setStatus('NFT minted successfully! 🎉');

      // Redirect to home page after success
      setTimeout(() => {
        router.push('/');
      }, 2000);

    } catch (err: any) {
      console.error('Minting error:', err);
      console.error('Error details:', JSON.stringify(err, null, 2));
      setError(err.message || 'Failed to mint NFT');
      setStatus('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">Mint Your NFT</span>
        </h1>
        <p className="text-gray-400">
          Create a unique NFT that can accept loans on the Movement blockchain
        </p>
      </div>

      <form onSubmit={handleMint} className="glass p-8 rounded-xl space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold mb-2">NFT Image</label>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-64 mx-auto rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview('');
                  }}
                  className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <div className="text-6xl mb-4">📷</div>
                <p className="text-gray-400 mb-4">
                  Click to upload or drag and drop
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-block px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg cursor-pointer transition-colors"
                >
                  Choose Image
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold mb-2">
            NFT Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Awesome NFT"
            className="w-full px-4 py-3 bg-dark-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary-500 transition-colors"
            required
          />
        </div>

        {/* Description Input */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your NFT..."
            rows={4}
            className="w-full px-4 py-3 bg-dark-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary-500 transition-colors resize-none"
            required
          />
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
          disabled={loading || !account}
          className="w-full py-4 bg-gradient-primary hover:opacity-90 text-white font-semibold rounded-lg transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Minting...' : account ? 'Mint NFT' : 'Connect Wallet First'}
        </button>
      </form>

      {/* Info Box */}
      <div className="mt-8 glass p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-3">How it works</h3>
        <ol className="space-y-2 text-gray-400">

          <li>1. Upload your NFT image and add details</li>
          <li>2. Image and metadata are uploaded to IPFS</li>
          <li>3. NFT is minted on Movement blockchain</li>
          <li>4. Your NFT can now accept loans!</li>
        </ol>
      </div>
    </div>
  );
}
