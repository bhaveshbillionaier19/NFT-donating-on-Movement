# NFT Donation Platform - Deployment Guide

Complete step-by-step guide for deploying the NFT donation smart contract to Movement blockchain.

## Prerequisites

- Movement CLI installed
- Movement wallet with testnet/mainnet tokens
- Basic command line knowledge

---

## Part 1: Install Movement CLI

### Windows (PowerShell)

```powershell
# Download and install Movement CLI
iwr "https://github.com/movementlabsxyz/aptos-core/releases/download/movement-cli/movement-windows-x86_64.zip" -OutFile movement.zip
Expand-Archive movement.zip -DestinationPath "$env:USERPROFILE\movement"
$env:PATH += ";$env:USERPROFILE\movement"
```

### macOS/Linux

```bash
# Download and install Movement CLI
curl -fsSL "https://raw.githubusercontent.com/movementlabsxyz/aptos-core/main/scripts/install_movement_cli.sh" | bash

# Add to PATH
echo 'export PATH="$HOME/.movement/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### Verify Installation

```bash
movement --version
```

Expected output: `movement x.x.x`

---

## Part 2: Initialize Movement Account

### Step 1: Initialize Account Configuration

```bash
cd c:/Users/HP/Desktop/intern/nftdonationonmoveantiG
movement init
```

You'll be prompted with:

```
Choose network from [devnet, testnet, mainnet, local, custom]:
```

**For testing:** Enter `testnet`

```
Enter your private key as a hex literal (0x...) [Current: None | No input: Generate new key (or keep one if present)]
```

**For new account:** Press Enter to generate a new key

**For existing account:** Enter your private key

### Step 2: Save Account Information

The CLI will display:

```yaml
---
Account Address: 0xYOUR_ADDRESS_HERE
Private Key: 0xYOUR_PRIVATE_KEY_HERE
Public Key: 0xYOUR_PUBLIC_KEY_HERE
Network: Testnet
REST API URL: https://aptos.testnet.suzuka.movementlabs.xyz/v1
```

**⚠️ IMPORTANT:** Save these credentials securely!

### Step 3: Fund Your Account

#### Testnet Faucet

```bash
# Request testnet tokens
movement account fund-with-faucet --account default
```

Or visit: https://faucet.testnet.suzuka.movementlabs.xyz/

#### Check Balance

```bash
movement account list --account default
```

You should see:
```
TYPE: 0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>
DATA:
  coin:
    value: "100000000"  # 1 APT = 100,000,000 octas
```

---

## Part 3: Configure Move Package

### Step 1: Update Move.toml

Edit `Move.toml` and replace the module address placeholder:

```toml
[package]
name = "NFTDonation"
version = "1.0.0"
authors = []

[addresses]
nft_donation = "0xYOUR_ADDRESS_HERE"  # Replace with your address from Step 2

[dependencies.AptosFramework]
git = "https://github.com/aptos-labs/aptos-core.git"
rev = "mainnet"
subdir = "aptos-move/framework/aptos-framework"

[dev-addresses]

[dev-dependencies]
```

**Replace `0xYOUR_ADDRESS_HERE` with your actual account address!**

---

## Part 4: Build the Smart Contract

### Step 1: Compile the Move Module

```bash
movement move build
```

**Expected Output:**

```
INCLUDING DEPENDENCY AptosFramework
INCLUDING DEPENDENCY AptosStdlib
INCLUDING DEPENDENCY MoveStdlib
BUILDING NFTDonation
{
  "Result": [
    "0xYOUR_ADDRESS::nft_donation"
  ]
}
```

### Step 2: Verify Build Artifacts

Check that the build was successful:

```bash
ls build/NFTDonation/bytecode_modules/
```

You should see:
```
nft_donation.mv
```

---

## Part 5: Publish to Movement Blockchain

### Step 1: Test Compilation (Optional)

```bash
movement move test
```

If you have tests, they'll run here. Otherwise, skip to publishing.

### Step 2: Publish the Module

```bash
movement move publish
```

You'll be prompted:

```
Do you want to submit a transaction for a range of [X - Y] Octas at a gas unit price of Z? [yes/no]
```

Type `yes` and press Enter.

**Expected Output:**

```
{
  "Result": {
    "transaction_hash": "0xTRANSACTION_HASH",
    "gas_used": 1234,
    "gas_unit_price": 100,
    "sender": "0xYOUR_ADDRESS",
    "sequence_number": 0,
    "success": true,
    "version": 12345678,
    "vm_status": "Executed successfully"
  }
}
```

### Step 3: Verify Deployment

```bash
movement account list --account default
```

Look for your module in the output:

```
TYPE: 0x1::code::PackageRegistry
DATA:
  packages:
    - name: "NFTDonation"
      modules:
        - name: "nft_donation"
      ...
```

---

## Part 6: Test Smart Contract Functions

### Test 1: Mint an NFT

First, prepare a test IPFS URI (or use the IPFS utilities):

```bash
movement move run \
  --function-id 'default::nft_donation::mint_nft' \
  --args 'string:ipfs://QmTest123456789'
```

**Expected Output:**

```
{
  "Result": {
    "transaction_hash": "0x...",
    "success": true,
    "vm_status": "Executed successfully"
  }
}
```

### Test 2: Check NFT Resource

```bash
movement account list --account default
```

Look for your NFT resource:

```
TYPE: 0xYOUR_ADDRESS::nft_donation::NFT
DATA:
  id: "YOUR_ADDRESS_AS_U64"
  total_donations: "0"
  uri: [105, 112, 102, 115, ...]  # UTF-8 encoded "ipfs://..."
```

### Test 3: Query Total Donations

```bash
movement move view \
  --function-id 'default::nft_donation::get_total_donations' \
  --args 'address:0xYOUR_ADDRESS'
```

**Expected Output:**

```
{
  "Result": [
    "0"
  ]
}
```

### Test 4: Make a Test Donation (Optional)

Create a second account or use another wallet to donate:

```bash
movement move run \
  --function-id 'default::nft_donation::donate' \
  --args 'address:0xNFT_OWNER_ADDRESS' 'u64:100000000'
```

This donates 1 APT (100,000,000 octas).

---

## Part 7: Update Frontend Configuration

### Step 1: Configure Environment Variables

Edit `frontend/.env.local`:

```env
# Movement Network Configuration
NEXT_PUBLIC_NETWORK=testnet
NEXT_PUBLIC_NODE_URL=https://aptos.testnet.suzuka.movementlabs.xyz/v1
NEXT_PUBLIC_MODULE_ADDRESS=0xYOUR_DEPLOYED_ADDRESS  # ← Update this!

# Pinata API Keys (Server-side only)
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_API_KEY=your_pinata_secret_api_key

# IPFS Gateway
NEXT_PUBLIC_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
```

**Replace `0xYOUR_DEPLOYED_ADDRESS` with your account address!**

### Step 2: Install Frontend Dependencies

```bash
cd frontend/
npm install
```

### Step 3: Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 and test:

1. ✅ Connect Petra wallet
2. ✅ Mint an NFT
3. ✅ View NFT in gallery
4. ✅ Make a donation

---

## Part 8: Deploy to Mainnet (Production)

⚠️ **Only after thorough testnet testing!**

### Step 1: Switch to Mainnet

```bash
movement init
```

Choose `mainnet` as the network.

### Step 2: Fund Mainnet Account

- Transfer real tokens to your mainnet address
- Ensure sufficient balance for gas fees

### Step 3: Update Move.toml

```toml
[addresses]
nft_donation = "0xYOUR_MAINNET_ADDRESS"
```

### Step 4: Publish to Mainnet

```bash
movement move build
movement move publish
```

### Step 5: Update Frontend for Mainnet

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_NETWORK=mainnet
NEXT_PUBLIC_NODE_URL=https://aptos.mainnet.suzuka.movementlabs.xyz/v1
NEXT_PUBLIC_MODULE_ADDRESS=0xYOUR_MAINNET_ADDRESS
```

---

## Troubleshooting

### Error: "Insufficient balance"

**Solution:** Fund your account with testnet tokens:

```bash
movement account fund-with-faucet --account default
```

### Error: "Module already exists"

**Solution:** You're trying to republish. Either:

1. Use a new account address
2. Upgrade the module (requires upgrade policy)

### Error: "Compilation failed"

**Solution:** Check your Move.toml:

- Verify module address matches your account
- Ensure dependencies are correct
- Check for syntax errors in `nft_donation.move`

### Error: "Transaction failed"

**Solution:**

1. Check gas balance
2. Verify function arguments are correct
3. Review transaction details with:
   ```bash
   movement account list --account default
   ```

### Frontend Not Connecting

**Solution:**

1. Verify Petra wallet is on the correct network (testnet/mainnet)
2. Check `.env.local` has correct module address
3. Clear browser cache and reload
4. Check browser console for errors

---

## Verification Checklist

After deployment, verify:

- [ ] Smart contract compiled successfully
- [ ] Module published to blockchain
- [ ] Account shows deployed module
- [ ] Can mint NFT via CLI
- [ ] Can query NFT data via CLI
- [ ] Frontend connects to correct network
- [ ] Frontend displays module address correctly
- [ ] Can mint NFT via frontend
- [ ] Can view NFTs in gallery
- [ ] Can make donations
- [ ] Donation totals update correctly

---

## Network Endpoints Reference

| Network | Node URL | Faucet |
|---------|----------|--------|
| **Testnet** | https://aptos.testnet.suzuka.movementlabs.xyz/v1 | https://faucet.testnet.suzuka.movementlabs.xyz/ |
| **Mainnet** | https://aptos.mainnet.suzuka.movementlabs.xyz/v1 | N/A (real tokens) |
| **Devnet** | https://aptos.devnet.suzuka.movementlabs.xyz/v1 | https://faucet.devnet.suzuka.movementlabs.xyz/ |

---

## Next Steps After Deployment

1. **Test Thoroughly**
   - Mint multiple NFTs
   - Test donations from different accounts
   - Verify all view functions work

2. **Monitor Transactions**
   - Use Movement Explorer
   - Check transaction history
   - Monitor gas costs

3. **Share Your DApp**
   - Deploy frontend to Vercel/Netlify
   - Share with community
   - Gather feedback

4. **Add Features**
   - NFT transfer functionality
   - Donation withdrawal
   - Multiple NFTs per user
   - Analytics dashboard

---

## Useful Commands Reference

```bash
# Account Management
movement init                                    # Initialize account
movement account list --account default          # View account resources
movement account fund-with-faucet                # Get testnet tokens

# Module Development
movement move build                              # Compile Move module
movement move test                               # Run tests
movement move publish                            # Publish to blockchain

# Transactions
movement move run \
  --function-id 'default::module::function' \
  --args 'type:value'                           # Execute entry function

movement move view \
  --function-id 'default::module::function' \
  --args 'type:value'                           # Query view function

# Configuration
movement config show-global-config              # Show current config
movement config set-global-config \
  --config-type global                          # Update config
```

---

## Support Resources

- **Movement Documentation**: https://docs.movementlabs.xyz/
- **Aptos Move Book**: https://move-language.github.io/move/
- **Movement Discord**: https://discord.gg/movementlabs
- **Movement GitHub**: https://github.com/movementlabsxyz

---

**Deployment Complete!** 🎉

Your NFT donation platform is now live on Movement blockchain!
