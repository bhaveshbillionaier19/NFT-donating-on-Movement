import { aptos, getNFTResourceType } from './aptos';

export interface NFTMetadata {
    name: string;
    description: string;
    image: string;
}

export interface NFT {
    owner: string;
    id: string;
    uri: string;
    totalDonations: number;
    metadata: NFTMetadata | null;
}

/**
 * Fetch all NFTs from an account's collection
 */
export async function getNFTCollection(address: string): Promise<NFT[]> {
    try {
        const resource = await aptos.getAccountResource({
            accountAddress: address,
            resourceType: getNFTResourceType(),
        });

        const data = resource as any;
        const nfts: NFT[] = [];

        // Iterate over the nfts vector in the collection
        if (data.nfts && Array.isArray(data.nfts)) {
            for (const nftData of data.nfts) {
                // Fetch metadata for each NFT
                const metadata = await getMetadataFromIPFS(arrayToString(nftData.uri));

                nfts.push({
                    owner: address,
                    id: nftData.id,
                    uri: arrayToString(nftData.uri),
                    totalDonations: parseInt(nftData.total_donations),
                    metadata,
                });
            }
        }

        return nfts;
    } catch (error) {
        // If resource doesn't exist (E_COLLECTION_NOT_FOUND or just not initialized), return empty
        // We log only if it's not a 404/Not Found type error to avoid noise for new users
        const err = error as any;
        if (err?.status !== 404 && !err?.message?.includes('Resource not found')) {
            console.error(`Failed to fetch NFT collection for address ${address}:`, error);
        }
        return [];
    }
}

/**
 * Check if an account has an NFT
 */
export async function hasNFT(address: string): Promise<boolean> {
    try {
        await aptos.getAccountResource({
            accountAddress: address,
            resourceType: getNFTResourceType(),
        });
        return true;
    } catch {
        return false;
    }
}

/**
 * Fetch metadata from IPFS
 */
export async function getMetadataFromIPFS(uri: string): Promise<NFTMetadata | null> {
    try {
        // Convert ipfs:// to gateway URL
        const gatewayUrl = ipfsToHttp(uri);

        const response = await fetch(gatewayUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch metadata');
        }

        const metadata = await response.json();

        // Convert image IPFS URI to HTTP
        if (metadata.image && metadata.image.startsWith('ipfs://')) {
            metadata.image = ipfsToHttp(metadata.image);
        }

        return metadata;
    } catch (error) {
        console.error('Failed to fetch metadata from IPFS:', error);
        return null;
    }
}

/**
 * Convert IPFS URI to HTTP gateway URL
 */
export function ipfsToHttp(ipfsUri: string): string {
    if (!ipfsUri.startsWith('ipfs://')) {
        return ipfsUri;
    }

    const cid = ipfsUri.replace('ipfs://', '');
    const gateway = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';

    return `${gateway}${cid}`;
}

/**
 * Convert string to vector<u8> for Move
 */
export function stringToVector(str: string): Uint8Array {
    return new TextEncoder().encode(str);
}

/**
 * Convert vector<u8> from Move to string
 * Handles both array format and hex string format
 */
export function arrayToString(arr: number[] | Uint8Array | string): string {
    // If it's a hex string (starts with 0x), convert it
    if (typeof arr === 'string') {
        // Remove 0x prefix if present
        const hex = arr.startsWith('0x') ? arr.slice(2) : arr;
        // Convert hex to bytes
        const bytes = new Uint8Array(hex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
        return new TextDecoder().decode(bytes);
    }

    // Handle array format
    const uint8Array = arr instanceof Uint8Array ? arr : new Uint8Array(arr);
    return new TextDecoder().decode(uint8Array);
}

/**
 * Get all NFTs (simplified version - in production use an indexer)
 * This is a placeholder that would need to be implemented with proper indexing
 */
export async function getAllNFTs(knownAddresses: string[]): Promise<NFT[]> {
    const nfts: NFT[] = [];

    for (const address of knownAddresses) {
        const userNFTs = await getNFTCollection(address);
        nfts.push(...userNFTs);
    }

    return nfts;
}
