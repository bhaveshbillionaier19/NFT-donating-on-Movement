import pinataSDK from '@pinata/sdk';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Pinata client
const pinata = new pinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_SECRET_API_KEY
);

/**
 * Verifies Pinata API credentials
 * @returns {Promise<boolean>} True if authentication is successful
 */
export async function testAuthentication() {
  try {
    const result = await pinata.testAuthentication();
    console.log('✅ Pinata authentication successful:', result);
    return true;
  } catch (error) {
    console.error('❌ Pinata authentication failed:', error.message);
    return false;
  }
}

/**
 * Uploads an image file to IPFS via Pinata
 * @param {string} imagePath - Path to the image file
 * @param {string} pinName - Optional name for the pin (for organization)
 * @returns {Promise<string>} IPFS CID of the uploaded image
 */
export async function uploadImage(imagePath, pinName = null) {
  try {
    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      throw new Error(`File not found: ${imagePath}`);
    }

    // Create readable stream
    const readableStreamForFile = fs.createReadStream(imagePath);
    
    // Prepare options
    const options = {
      pinataMetadata: {
        name: pinName || `NFT_Image_${Date.now()}`
      }
    };

    console.log(`📤 Uploading image to IPFS...`);
    const result = await pinata.pinFileToIPFS(readableStreamForFile, options);
    
    console.log(`✅ Image uploaded successfully!`);
    console.log(`   CID: ${result.IpfsHash}`);
    console.log(`   URL: https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`);
    
    return result.IpfsHash;
  } catch (error) {
    console.error('❌ Error uploading image:', error.message);
    throw error;
  }
}

/**
 * Creates NFT metadata JSON object
 * @param {string} name - NFT name
 * @param {string} description - NFT description
 * @param {string} imageCID - IPFS CID of the image
 * @returns {Object} Metadata object in standard NFT format
 */
export function createMetadata(name, description, imageCID) {
  const metadata = {
    name: name,
    description: description,
    image: `ipfs://${imageCID}`
  };
  
  console.log('📝 Created metadata:', JSON.stringify(metadata, null, 2));
  return metadata;
}

/**
 * Uploads metadata JSON to IPFS via Pinata
 * @param {Object} metadataObject - The metadata object to upload
 * @param {string} pinName - Optional name for the pin
 * @returns {Promise<string>} IPFS CID of the uploaded metadata
 */
export async function uploadMetadata(metadataObject, pinName = null) {
  try {
    const options = {
      pinataMetadata: {
        name: pinName || `NFT_Metadata_${Date.now()}`
      }
    };

    console.log(`📤 Uploading metadata to IPFS...`);
    const result = await pinata.pinJSONToIPFS(metadataObject, options);
    
    console.log(`✅ Metadata uploaded successfully!`);
    console.log(`   CID: ${result.IpfsHash}`);
    console.log(`   URL: https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`);
    
    return result.IpfsHash;
  } catch (error) {
    console.error('❌ Error uploading metadata:', error.message);
    throw error;
  }
}

/**
 * Complete NFT upload flow: image → metadata → IPFS URI
 * This is the main function to use for minting NFTs
 * 
 * @param {string} imagePath - Path to the NFT image file
 * @param {string} name - NFT name
 * @param {string} description - NFT description
 * @returns {Promise<string>} Complete IPFS URI (ipfs://CID) for use in mint_nft
 */
export async function uploadNFT(imagePath, name, description) {
  try {
    console.log('\n🚀 Starting NFT upload flow...\n');
    
    // Step 1: Upload image to IPFS
    console.log('Step 1/3: Uploading image...');
    const imageCID = await uploadImage(imagePath, `${name}_image`);
    
    // Step 2: Create metadata JSON
    console.log('\nStep 2/3: Creating metadata...');
    const metadata = createMetadata(name, description, imageCID);
    
    // Step 3: Upload metadata to IPFS
    console.log('\nStep 3/3: Uploading metadata...');
    const metadataCID = await uploadMetadata(metadata, `${name}_metadata`);
    
    // Return the final IPFS URI
    const ipfsURI = `ipfs://${metadataCID}`;
    
    console.log('\n✅ NFT upload complete!');
    console.log('='.repeat(50));
    console.log(`📦 Metadata URI: ${ipfsURI}`);
    console.log(`🔗 View metadata: https://gateway.pinata.cloud/ipfs/${metadataCID}`);
    console.log(`🖼️  View image: https://gateway.pinata.cloud/ipfs/${imageCID}`);
    console.log('='.repeat(50));
    console.log(`\n💡 Use this URI in your Move contract:`);
    console.log(`   mint_nft(signer, "${ipfsURI}")\n`);
    
    return ipfsURI;
  } catch (error) {
    console.error('\n❌ NFT upload failed:', error.message);
    throw error;
  }
}

/**
 * Retrieves metadata from IPFS
 * @param {string} metadataCID - The CID of the metadata
 * @returns {Promise<Object>} The metadata object
 */
export async function getMetadata(metadataCID) {
  try {
    const response = await fetch(`https://gateway.pinata.cloud/ipfs/${metadataCID}`);
    const metadata = await response.json();
    return metadata;
  } catch (error) {
    console.error('❌ Error fetching metadata:', error.message);
    throw error;
  }
}
