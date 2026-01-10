# NFT Donation Platform on Movement Blockchain

A complete decentralized application for minting NFTs and accepting donations, built on Movement blockchain with Move smart contracts.

##  Features

- **NFT Minting**: Create unique NFTs with IPFS metadata
- **Direct Donations**: Accept donations in native Movement/Aptos coins
- **Resource-Oriented**: Pure Move design with no Solidity patterns
- **Decentralized Storage**: IPFS via Pinata for metadata
- **Modern UI**: Next.js frontend with premium dark theme
- **Wallet Integration**: Petra wallet support

##  Project Structure

```
nftdonationonmoveantiG/
├── sources/              # Move smart contract
├── ipfs/                 # IPFS upload utilities
├── frontend/             # Next.js web application
└── DEPLOYMENT.md         # Deployment guide
```

## Start

### 1. Deploy Smart Contract

```bash
# Install Movement CLI
# See DEPLOYMENT.md for installation instructions

# Initialize and deploy
movement init
movement move build
movement move publish
```

### 2. Setup IPFS Utilities

```bash
cd ipfs/
npm install
cp .env.example .env
# Add your Pinata API keys to .env
```

### 3. Run Frontend

```bash
cd frontend/
npm install
cp .env.local.example .env.local
# Add your deployment address and Pinata keys
npm run dev
```

Visit http://localhost:3000


##  Tech Stack

| Layer | Technology |
|-------|-----------|
| Blockchain | Movement (Aptos) |
| Smart Contract | Move Language |
| Storage | IPFS (Pinata) |
| Frontend | Next.js 15, React 19, TypeScript |
| Styling | Tailwind CSS |
| Wallet | Petra |
| SDK | @aptos-labs/ts-sdk |


**Ready to deploy?** See [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step instructions.
