# NFT Donation Platform - Frontend

A modern Next.js frontend for the NFT donation platform on Movement blockchain.

## 🚀 Features

- 🔐 Petra Wallet Integration
- 🎨 Modern Dark Theme UI
- 📱 Fully Responsive Design
- ⛓️ Movement Blockchain Integration
- 🖼️ IPFS Metadata Storage
- 💸 On-chain Donations

## 📋 Prerequisites

- Node.js 18+ and npm
- [Petra Wallet](https://petra.app/) browser extension
- Pinata API credentials (free at [pinata.cloud](https://pinata.cloud/))

## 🛠️ Setup

### 1. Install Dependencies

```bash
cd frontend/
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your configuration:

```env
# Movement Network Configuration
NEXT_PUBLIC_NETWORK=testnet
NEXT_PUBLIC_NODE_URL=https://aptos.testnet.suzuka.movementlabs.xyz/v1
NEXT_PUBLIC_MODULE_ADDRESS=0xYourDeployedModuleAddress

# Pinata API Keys (Server-side only)
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_API_KEY=your_pinata_secret_api_key

# IPFS Gateway
NEXT_PUBLIC_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Pages

### Home Page (`/`)

- NFT Gallery with all minted NFTs
- Stats dashboard (total NFTs, donations)
- Wallet connection status
- Refresh functionality

### Mint Page (`/mint`)

- Image upload with preview
- NFT name and description inputs
- Automatic IPFS upload
- On-chain minting transaction

### Donate Page (`/donate/[address]`)

- NFT details and image display
- Current donation total
- Donation amount input with quick amounts
- Direct on-chain donation

## 🏗️ Project Structure

```
frontend/
├── app/
│   ├── api/
│   │   └── upload/
│   │       └── route.ts          # IPFS upload API
│   ├── donate/
│   │   └── [address]/
│   │       └── page.tsx          # Donate page
│   ├── mint/
│   │   └── page.tsx              # Mint page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   ├── NFTCard.tsx               # NFT card component
│   ├── NFTGallery.tsx            # NFT gallery grid
│   ├── WalletButton.tsx          # Wallet connect button
│   └── WalletProvider.tsx        # Wallet context provider
├── lib/
│   ├── aptos.ts                  # Aptos client setup
│   ├── nft.ts                    # NFT utilities
│   └── transactions.ts           # Transaction builders
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 🔧 Key Technologies

### Blockchain Integration

- **Aptos TypeScript SDK** (`@aptos-labs/ts-sdk`)
  - Resource queries for NFT data
  - Transaction building and submission
  
- **Wallet Adapter** (`@aptos-labs/wallet-adapter-react`)
  - Petra wallet connection
  - Transaction signing
  - Account management

### Frontend Stack

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**

### Storage

- **IPFS via Pinata**
  - Image hosting
  - Metadata storage
  - CDN gateway

## 💡 Usage Guide

### For Users

#### Mint an NFT

1. Connect Petra wallet
2. Navigate to "Mint NFT"
3. Upload an image
4. Enter NFT name and description
5. Click "Mint NFT"
6. Approve transaction in Petra
7. Wait for confirmation

#### Donate to an NFT

1. Browse NFT gallery on home page
2. Click on an NFT card
3. Enter donation amount in APT
4. Click "Donate Now"
5. Approve transaction in Petra
6. See updated donation total

### For Developers

#### Query NFT Resource

```typescript
import { getNFTResource } from '@/lib/nft';

const nft = await getNFTResource('0x123...');
console.log(nft.totalDonations); // In octas
```

#### Build Transactions

```typescript
import { buildMintTransaction, buildDonateTransaction } from '@/lib/transactions';

// Mint transaction
const mintTx = buildMintTransaction('ipfs://QmXxx...');

// Donate transaction (amount in octas)
const donateTx = buildDonateTransaction('0x123...', 100_000_000); // 1 APT
```

#### Unit Conversion

```typescript
import { aptToOctas, octasToApt } from '@/lib/aptos';

const octas = aptToOctas(5.5); // 550,000,000
const apt = octasToApt(100_000_000); // 1.0
```

## 🎨 Styling

The app uses Tailwind CSS with custom utilities:

- **Glass Effect**: `.glass` - Glassmorphism background
- **Gradient Text**: `.gradient-text` - Primary gradient text
- **Animations**: `animate-float`, `animate-pulse-slow`

### Custom Colors

- Primary: Blue gradient (#667eea → #764ba2)
- Dark theme: Custom dark shades
- Accents: Gradient overlays

## 🔐 Security Features

- **Server-side IPFS Upload**
  - API keys never exposed to client
  - Secure file handling
  
- **Wallet Integration**
  - User must approve all transactions
  - No private key handling
  
- **Environment Variables**
  - `.env.local` is git-ignored
  - Separate public/private variables

## 🌐 Network Configuration

### Testnet (Default)

```env
NEXT_PUBLIC_NETWORK=testnet
NEXT_PUBLIC_NODE_URL=https://aptos.testnet.suzuka.movementlabs.xyz/v1
```

### Mainnet

```env
NEXT_PUBLIC_NETWORK=mainnet
NEXT_PUBLIC_NODE_URL=https://aptos.mainnet.suzuka.movementlabs.xyz/v1
```

## 🐛 Troubleshooting

### Wallet Not Connecting

- Ensure Petra wallet is installed
- Check if you're on the correct network
- Try refreshing the page

### NFTs Not Loading

- Verify module address in `.env.local`
- Check console for errors
- Ensure wallet is connected

### IPFS Upload Failing

- Verify Pinata API keys
- Check file size (< 10MB recommended)
- Ensure stable internet connection

### Transaction Failures

- Check wallet has sufficient APT for gas
- Verify you're on the correct network
- Make sure contract is deployed

## 📦 Build for Production

```bash
npm run build
npm run start
```

## 🚧 Future Enhancements

- [ ] Implement indexer for better NFT discovery
- [ ] Add NFT transfer functionality
- [ ] Donation history and analytics
- [ ] Multiple NFTs per user support
- [ ] Search and filter capabilities
- [ ] Social sharing features

## 📄 License

MIT

---

Built with ❤️ on Movement Blockchain
