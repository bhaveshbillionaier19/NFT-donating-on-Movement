# NFT Donation Platform on Movement Blockchain

A complete decentralized application for minting NFTs and accepting donations, built on Movement blockchain with Move smart contracts.

## 🌟 Features

- **NFT Minting**: Create unique NFTs with IPFS metadata
- **Direct Donations**: Accept donations in native Movement/Aptos coins
- **Resource-Oriented**: Pure Move design with no Solidity patterns
- **Decentralized Storage**: IPFS via Pinata for metadata
- **Modern UI**: Next.js frontend with premium dark theme
- **Wallet Integration**: Petra wallet support

## 📦 Project Structure

```
nftdonationonmoveantiG/
├── sources/              # Move smart contract
├── ipfs/                 # IPFS upload utilities
├── frontend/             # Next.js web application
└── DEPLOYMENT.md         # Deployment guide
```

## 🚀 Quick Start

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

## 📚 Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete deployment guide
- **[sources/README.md](sources/)** - Smart contract documentation  
- **[ipfs/README.md](ipfs/README.md)** - IPFS utilities guide
- **[frontend/README.md](frontend/README.md)** - Frontend setup and usage

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Blockchain | Movement (Aptos) |
| Smart Contract | Move Language |
| Storage | IPFS (Pinata) |
| Frontend | Next.js 15, React 19, TypeScript |
| Styling | Tailwind CSS |
| Wallet | Petra |
| SDK | @aptos-labs/ts-sdk |

## 🎯 Smart Contract Functions

### Entry Functions

```move
// Mint a new NFT
public entry fun mint_nft(creator: &signer, uri: vector<u8>)

// Donate to an NFT owner
public entry fun donate(donor: &signer, nft_owner: address, amount: u64)
```

### View Functions

```move
// Get total donations for an NFT
#[view]
public fun get_total_donations(nft_owner: address): u64
```

## 💡 Usage Examples

### Mint an NFT (CLI)

```bash
movement move run \
  --function-id 'default::nft_donation::mint_nft' \
  --args 'string:ipfs://QmYourMetadataCID'
```

### Donate to an NFT (CLI)

```bash
movement move run \
  --function-id 'default::nft_donation::donate' \
  --args 'address:0xNFTOwnerAddress' 'u64:100000000'
```

### Frontend Usage

1. Connect Petra wallet
2. Navigate to "Mint NFT"
3. Upload image and metadata
4. Approve transaction
5. View NFT in gallery
6. Accept donations from supporters

## 🔐 Security Features

- ✅ Resource-oriented programming (no double-spend)
- ✅ Atomic transactions (coin transfer + state update)
- ✅ Signer-based access control
- ✅ No reentrancy vulnerabilities
- ✅ Type-safe Move language
- ✅ Auditable on-chain logic

## 🌐 Network Endpoints

| Network | RPC URL |
|---------|---------|
| Testnet | https://aptos.testnet.suzuka.movementlabs.xyz/v1 |
| Mainnet | https://aptos.mainnet.suzuka.movementlabs.xyz/v1 |

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## 💬 Support

- **Documentation**: See DEPLOYMENT.md and individual README files
- **Issues**: Open an issue on GitHub
- **Movement Discord**: https://discord.gg/movementlabs

## 🎉 Acknowledgments

Built with Move on Movement blockchain - bringing secure, resource-oriented programming to Web3.

---

**Ready to deploy?** See [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step instructions.
