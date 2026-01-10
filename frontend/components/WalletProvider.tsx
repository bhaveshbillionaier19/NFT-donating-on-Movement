'use client';

import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { PetraWallet } from 'petra-plugin-wallet-adapter';
import { Network } from '@aptos-labs/ts-sdk';
import { ReactNode, useMemo } from 'react';

interface WalletProviderProps {
  children: ReactNode;
}

export default function WalletProvider({ children }: WalletProviderProps) {
  const network = (process.env.NEXT_PUBLIC_NETWORK as Network) || Network.TESTNET;
  const nodeUrl = process.env.NEXT_PUBLIC_NODE_URL;

  // Initialize wallets inside component to avoid serialization issues
  const wallets = useMemo(() => [new PetraWallet()], []);

  return (
    <AptosWalletAdapterProvider
      plugins={wallets}
      autoConnect={true}
      dappConfig={{
        network: network,
        ...(nodeUrl && { aptosConnectDappId: undefined }), // For custom node URLs
      }}
      onError={(error) => {
        console.error('Wallet error:', error);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}
