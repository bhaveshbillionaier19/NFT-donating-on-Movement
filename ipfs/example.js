import {
    testAuthentication,
    uploadNFT,
    getMetadata
} from './ipfs-uploader.js';

/**
 * Example usage of the IPFS uploader
 * 
 * Before running this example:
 * 1. Copy .env.example to .env
 * 2. Add your Pinata API credentials to .env
 * 3. Place a test image in the ipfs/ directory
 * 4. Update the imagePath below
 * 5. Run: npm install && node example.js
 */

async function main() {
    try {
        // Test Pinata authentication
        console.log('Testing Pinata connection...\n');
        const isAuthenticated = await testAuthentication();

        if (!isAuthenticated) {
            console.error('\n⚠️  Please check your Pinata API credentials in .env file');
            process.exit(1);
        }

        // Example NFT details
        const nftDetails = {
            imagePath: './test-image.jpg',  // ⚠️ UPDATE THIS PATH
            name: 'My Awesome NFT',
            description: 'This is a test NFT for the donation platform'
        };

        console.log('\n📋 NFT Details:');
        console.log(`   Name: ${nftDetails.name}`);
        console.log(`   Description: ${nftDetails.description}`);
        console.log(`   Image: ${nftDetails.imagePath}`);

        // Upload the NFT (image + metadata)
        const metadataURI = await uploadNFT(
            nftDetails.imagePath,
            nftDetails.name,
            nftDetails.description
        );

        // Demonstrate metadata retrieval
        console.log('\n🔍 Verifying uploaded metadata...');
        const cid = metadataURI.replace('ipfs://', '');
        const metadata = await getMetadata(cid);
        console.log('Retrieved metadata:', JSON.stringify(metadata, null, 2));

        console.log('\n✨ Next steps:');
        console.log('1. Use the Aptos/Movement CLI to mint the NFT:');
        console.log(`   aptos move run \\`);
        console.log(`     --function-id 'nft_donation::nft_donation::mint_nft' \\`);
        console.log(`     --args 'string:${metadataURI}'`);
        console.log('\n2. After minting, users can donate to your NFT!');

    } catch (error) {
        console.error('\n❌ Example failed:', error.message);
        process.exit(1);
    }
}

// Run the example
main();
