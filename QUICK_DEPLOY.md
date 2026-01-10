# Quick Deployment Steps - Movement Network

Since the CLI is not installed yet, follow these steps to deploy your smart contract:

## Step 1: Install Aptos CLI (Compatible with Movement)

### For Windows (PowerShell - Run as Administrator):

```powershell
# Download Aptos CLI
iwr "https://github.com/aptos-labs/aptos-core/releases/latest/download/aptos-cli-latest-windows-x86_64.zip" -OutFile aptos-cli.zip

# Extract
Expand-Archive aptos-cli.zip -DestinationPath "$env:LOCALAPPDATA\aptos"

# Add to PATH (temporary for this session)
$env:PATH += ";$env:LOCALAPPDATA\aptos"

# Verify installation
aptos --version
```

**To add to PATH permanently:**
1. Press `Win + X` → System
2. Advanced system settings → Environment Variables
3. Under System Variables, find `Path`
4. Click Edit → New
5. Add: `C:\Users\HP\AppData\Local\aptos`
6. Click OK on all windows
7. Restart your terminal

---

## Step 2: Initialize Your Account

Navigate to your project:

```bash
cd c:\Users\HP\Desktop\intern\nftdonationonmoveantiG
```

Initialize the account:

```bash
aptos init
```

**You'll see prompts:**

1. **Choose network**: Type `testnet` and press Enter
2. **Enter private key**: Press Enter (to generate a new key)

**SAVE THE OUTPUT!** You'll see something like:

```yaml
Account Address: 0xYOUR_ADDRESS_HERE
Private Key: 0xYOUR_PRIVATE_KEY_HERE  
Public Key: 0xYOUR_PUBLIC_KEY_HERE
Network: Testnet
```

---

## Step 3: Update Move.toml with Your Address

Open `Move.toml` and replace the address:

```toml
[addresses]
nft_donation = "0xYOUR_ADDRESS_HERE"
```

**Replace `0xYOUR_ADDRESS_HERE` with the address from Step 2!**

---

## Step 4: Fund Your Account

Get testnet tokens:

```bash
aptos account fund-with-faucet --account default
```

Or visit: https://aptoslabs.com/testnet-faucet

Verify your balance:

```bash
aptos account list --account default
```

You should see:
```
TYPE: 0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>
DATA:
  coin:
    value: "100000000"  # 1 APT
```

---

## Step 5: Build the Smart Contract

```bash
aptos move compile
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

✅ If you see this, compilation succeeded!

---

## Step 6: Publish to Movement/Aptos Network

```bash
aptos move publish
```

**You'll see:**

```
Do you want to submit a transaction for a range of [X - Y] Octas at a gas unit price of Z? [yes/no]
```

Type `yes` and press Enter.

**Expected Output:**

```json
{
  "Result": {
    "transaction_hash": "0xABC123...",
    "gas_used": 1234,
    "sender": "0xYOUR_ADDRESS",
    "success": true,
    "vm_status": "Executed successfully"
  }
}
```

🎉 **Contract Published!**

---

## Step 7: Verify Deployment

Check your account resources:

```bash
aptos account list --account default
```

Look for your module in the output. You should see:

```
TYPE: 0x1::code::PackageRegistry
DATA:
  packages:
    - name: "NFTDonation"
      modules:
        - name: "nft_donation"
```

---

## Step 8: Test the Contract

### Test Minting an NFT:

```bash
aptos move run \
  --function-id 'default::nft_donation::mint_nft' \
  --args 'string:ipfs://QmTestMetadata123'
```

### Verify the NFT was created:

```bash
aptos account list --account default
```

Look for:

```
TYPE: 0xYOUR_ADDRESS::nft_donation::NFT
DATA:
  id: "..."
  total_donations: "0"
  uri: [105, 112, 102, 115, ...]  # "ipfs://..."
```

### Query total donations:

```bash
aptos move view \
  --function-id 'default::nft_donation::get_total_donations' \
  --args 'address:0xYOUR_ADDRESS'
```

Should return: `["0"]`

---

## Step 9: Update Frontend Configuration

Once deployed, update `frontend/.env.local`:

```env
NEXT_PUBLIC_NETWORK=testnet
NEXT_PUBLIC_NODE_URL=https://fullnode.testnet.aptoslabs.com/v1
NEXT_PUBLIC_MODULE_ADDRESS=0xYOUR_ADDRESS_HERE  # ← Your deployed address

PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_API_KEY=your_pinata_secret_api_key
NEXT_PUBLIC_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
```

---

## Step 10: Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit: http://localhost:3000

---

## Troubleshooting

### "Insufficient balance"
```bash
aptos account fund-with-faucet --account default
```

### "Module already exists"
You've already published. Use a new account or upgrade the module.

### "Compilation failed"
- Check `Move.toml` has the correct address
- Verify syntax in `nft_donation.move`

### "Transaction failed"
- Check you have sufficient balance
- Verify the network is correct (testnet)
- Try again after a few seconds

---

## Quick Command Reference

```bash
# Account management
aptos init                              # Setup account
aptos account list --account default    # View resources
aptos account fund-with-faucet          # Get testnet tokens

# Module deployment
aptos move compile                      # Compile
aptos move publish                      # Deploy

# Testing
aptos move run --function-id 'default::module::function' --args 'type:value'
aptos move view --function-id 'default::module::function' --args 'type:value'
```

---

## Next Steps

1. ✅ Install Aptos CLI
2. ✅ Initialize account and get testnet tokens
3. ✅ Update Move.toml with your address
4. ✅ Compile the contract
5. ✅ Publish to testnet
6. ✅ Test minting and donations
7. ✅ Configure and run frontend
8. 🎉 Start accepting NFT donations!

---

**Need Help?**
- Aptos Discord: https://discord.gg/aptoslabs
- Documentation: https://aptos.dev/
