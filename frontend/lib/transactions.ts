import { InputTransactionData } from '@aptos-labs/wallet-adapter-react';
import { getModuleId } from './aptos';

/**
 * Build transaction payload for minting an NFT
 * Using simplified format for better wallet compatibility
 */
export function buildMintTransaction(metadataURI: string): InputTransactionData {
    return {
        data: {
            function: getModuleId('mint_nft') as `${string}::${string}::${string}`,
            functionArguments: [metadataURI],
        },
    };
}

/**
 * Build transaction payload for donating to an NFT
 */
export function buildDonateTransaction(
    nftOwner: string,
    nftId: string,
    amount: number
): InputTransactionData {
    return {
        data: {
            function: getModuleId('donate') as `${string}::${string}::${string}`,
            functionArguments: [nftOwner, nftId, amount.toString()],
        },
    };
}
