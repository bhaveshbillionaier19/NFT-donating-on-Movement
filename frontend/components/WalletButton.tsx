'use client';

import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { formatAddress } from '@/lib/aptos';

export default function WalletButton() {
  const { connect, disconnect, account, connected, wallets } = useWallet();

  const handleConnect = async () => {
    try {
      const petraWallet = wallets?.find((wallet) => wallet.name === 'Petra');
      if (petraWallet) {
        await connect(petraWallet.name);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  if (connected && account) {
    return (
      <div className="flex items-center gap-3">
        <div className="glass px-4 py-2 rounded-lg">
          <p className="text-sm font-mono text-gray-300">
            {formatAddress(account.address)}
          </p>
        </div>
        <button
          onClick={disconnect}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      className="px-6 py-2 bg-gradient-primary hover:opacity-90 text-white font-semibold rounded-lg transition-opacity"
    >
      Connect Wallet
    </button>
  );
}
