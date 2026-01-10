import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

// Get configuration from environment variables
const network = (process.env.NEXT_PUBLIC_NETWORK as Network) || Network.TESTNET;
const nodeUrl = process.env.NEXT_PUBLIC_NODE_URL;

// Configure Aptos client
const config = nodeUrl
    ? new AptosConfig({
        network,
        fullnode: nodeUrl
    })
    : new AptosConfig({ network });

export const aptos = new Aptos(config);

export const MODULE_ADDRESS = process.env.NEXT_PUBLIC_MODULE_ADDRESS || '';
export const MODULE_NAME = 'nft_donation';

/**
 * Get the full module identifier
 */
export function getModuleId(functionName: string): string {
    return `${MODULE_ADDRESS}::${MODULE_NAME}::${functionName}`;
}

/**
 * Get resource type for NFT Collection
 */
export function getNFTResourceType(): `${string}::${string}::${string}` {
    return `${MODULE_ADDRESS}::${MODULE_NAME}::NFTCollection`;
}

/**
 * Convert APT to Octas (smallest unit)
 * 1 APT = 100,000,000 Octas
 */
export function aptToOctas(apt: number): number {
    return Math.floor(apt * 100_000_000);
}

/**
 * Convert Octas to APT
 */
export function octasToApt(octas: number | string): number {
    const octasNum = typeof octas === 'string' ? parseInt(octas) : octas;
    return octasNum / 100_000_000;
}

/**
 * Format address for display (shortened)
 */
export function formatAddress(address: string): string {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
