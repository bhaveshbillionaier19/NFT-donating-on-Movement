# IPFS Utilities for NFT Donation Platform

Off-chain utilities for uploading NFT images and metadata to IPFS using Pinata.

## 📋 Prerequisites

- Node.js (v14 or higher)
- Pinata account (free at [pinata.cloud](https://www.pinata.cloud/))
- Pinata API credentials

## 🚀 Setup

### 1. Install Dependencies

```bash
cd ipfs/
npm install
```

### 2. Configure Pinata API Credentials

1. Sign up at [pinata.cloud](https://www.pinata.cloud/)
2. Generate API keys from the Pinata dashboard
3. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
4. Edit `.env` and add your credentials:
   ```env
   PINATA_API_KEY=your_actual_api_key
   PINATA_SECRET_API_KEY=your_actual_secret_key
   ```

## 📚 API Reference

### `testAuthentication()`

Tests your Pinata API credentials.

```javascript
import { testAuthentication } from './ipfs-uploader.js';

const isAuth = await testAuthentication();
```

### `uploadImage(imagePath, pinName?)`

Uploads an image file to IPFS.

**Parameters:**
- `imagePath` (string): Path to the image file
- `pinName` (string, optional): Name for the pin in Pinata

**Returns:** `Promise<string>` - IPFS CID of the image

```javascript
import { uploadImage } from './ipfs-uploader.js';

const imageCID = await uploadImage('./my-nft.jpg', 'MyNFT_Image');
// Returns: "QmXxx..."
```

### `createMetadata(name, description, imageCID)`

Creates NFT metadata JSON object.

**Parameters:**
- `name` (string): NFT name
- `description` (string): NFT description
- `imageCID` (string): IPFS CID of the image

**Returns:** `Object` - Metadata in standard NFT format

```javascript
import { createMetadata } from './ipfs-uploader.js';

const metadata = createMetadata(
  'My Cool NFT',
  'This NFT supports donations!',
  'QmXxx...'
);
// Returns: { name: "...", description: "...", image: "ipfs://QmXxx..." }
```

### `uploadMetadata(metadataObject, pinName?)`

Uploads metadata JSON to IPFS.

**Parameters:**
- `metadataObject` (Object): The metadata object
- `pinName` (string, optional): Name for the pin

**Returns:** `Promise<string>` - IPFS CID of the metadata

```javascript
import { uploadMetadata } from './ipfs-uploader.js';

const metadataCID = await uploadMetadata(metadata, 'MyNFT_Metadata');
// Returns: "QmYyy..."
```

### `uploadNFT(imagePath, name, description)`

**Main function** - Complete upload flow from image to metadata URI.

**Parameters:**
- `imagePath` (string): Path to the image file
- `name` (string): NFT name
- `description` (string): NFT description

**Returns:** `Promise<string>` - Complete IPFS URI (`ipfs://CID`)

```javascript
import { uploadNFT } from './ipfs-uploader.js';

const metadataURI = await uploadNFT(
  './artwork.png',
  'Donation NFT #1',
  'A beautiful NFT that accepts donations'
);
// Returns: "ipfs://QmYyy..."
```

### `getMetadata(metadataCID)`

Retrieves metadata from IPFS.

**Parameters:**
- `metadataCID` (string): The CID of the metadata

**Returns:** `Promise<Object>` - The metadata object

```javascript
import { getMetadata } from './ipfs-uploader.js';

const metadata = await getMetadata('QmYyy...');
```

## 🎯 Usage Examples

### Basic Usage

```javascript
import { uploadNFT } from './ipfs-uploader.js';

// Upload NFT and get metadata URI
const uri = await uploadNFT(
  './my-image.jpg',
  'My NFT',
  'An amazing NFT'
);

console.log('Metadata URI:', uri);
// Output: ipfs://QmXxx...
```

### Complete Flow with Move Contract

```javascript
import { uploadNFT } from './ipfs-uploader.js';

async function mintNFT() {
  // 1. Upload to IPFS
  const metadataURI = await uploadNFT(
    './nft-artwork.png',
    'Genesis NFT',
    'First NFT in the collection'
  );

  // 2. Use URI with Move contract
  console.log('Use this command to mint:');
  console.log(`aptos move run \\`);
  console.log(`  --function-id 'nft_donation::nft_donation::mint_nft' \\`);
  console.log(`  --args 'string:${metadataURI}'`);
}

mintNFT();
```

### Run the Example

```bash
# Update example.js with your test image path
node example.js
```

## 📦 Metadata Format

The utilities create metadata in the standard NFT format:

```json
{
  "name": "NFT Name",
  "description": "NFT Description",
  "image": "ipfs://QmImageCID"
}
```

This format is compatible with:
- OpenSea
- Rarible
- Most NFT marketplaces
- Standard NFT viewers

## 🔗 Integration with Move Contract

After uploading to IPFS, use the returned URI with the Move contract:

```bash
# The uploadNFT function returns: "ipfs://QmMetadataCID"
# Use this in your mint_nft call:

aptos move run \
  --function-id 'nft_donation::nft_donation::mint_nft' \
  --args 'string:ipfs://QmYourMetadataCID'
```

## 🌐 IPFS Gateways

Your uploaded files are accessible via multiple gateways:

- Pinata: `https://gateway.pinata.cloud/ipfs/CID`
- IPFS.io: `https://ipfs.io/ipfs/CID`
- Cloudflare: `https://cloudflare-ipfs.com/ipfs/CID`

## 🔒 Best Practices

1. **Test First**: Run `testAuthentication()` before uploading
2. **Image Formats**: Use JPEG, PNG, GIF, or WebP
3. **File Sizes**: Keep images under 10MB for best performance
4. **Pin Names**: Use descriptive names for easy management
5. **Error Handling**: Always wrap uploads in try-catch blocks

## 🐛 Troubleshooting

### Authentication Failed
- Check your API keys in `.env`
- Verify keys are active in Pinata dashboard
- Ensure no extra spaces in `.env` file

### File Not Found
- Use absolute paths or relative to script location
- Verify file exists: `fs.existsSync(path)`

### Upload Timeout
- Check internet connection
- Try smaller file sizes
- Verify Pinata service status

## 📁 Project Structure

```
ipfs/
├── package.json           # Dependencies
├── .env.example          # Environment template
├── .env                  # Your API keys (git-ignored)
├── ipfs-uploader.js      # Main IPFS utilities
├── example.js            # Usage example
└── README.md            # This file
```

## 🔐 Security Notes

- **Never commit `.env`** - It contains your API keys
- The `.env` file is git-ignored by default
- Rotate API keys if accidentally exposed
- Use separate keys for development/production

## 📝 License

MIT
