module nft_donation::nft_donation {
    use std::signer;
    use std::vector;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;

    /// Error codes
    const E_COLLECTION_NOT_FOUND: u64 = 1;
    const E_NFT_NOT_FOUND: u64 = 2;
    const E_INVALID_AMOUNT: u64 = 3;

    /// Individual NFT (stored in collection)
    struct NFT has store, copy, drop {
        id: u64,
        uri: vector<u8>,
        total_donations: u64,
    }

    /// Collection of NFTs for a single account
    struct NFTCollection has key {
        next_id: u64,
        nfts: vector<NFT>,
    }

    /// Initialize an empty NFT collection
    /// Can be called explicitly or auto-called during first mint
    public entry fun init_collection(account: &signer) {
        let owner = signer::address_of(account);
        
        // Only create if doesn't exist
        if (!exists<NFTCollection>(owner)) {
            let collection = NFTCollection {
                next_id: 0,
                nfts: vector::empty<NFT>(),
            };
            move_to(account, collection);
        }
    }

    /// Mint a new NFT and add it to the caller's collection
    /// Auto-initializes collection if needed
    public entry fun mint_nft(
        creator: &signer,
        uri: vector<u8>
    ) acquires NFTCollection {
        let owner = signer::address_of(creator);

        // Auto-initialize collection if it doesn't exist
        if (!exists<NFTCollection>(owner)) {
            init_collection(creator);
        };

        // Borrow collection mutably
        let collection = borrow_global_mut<NFTCollection>(owner);
        
        // Create new NFT with auto-increment ID
        let nft = NFT {
            id: collection.next_id,
            uri,
            total_donations: 0,
        };

        // Add NFT to collection
        vector::push_back(&mut collection.nfts, nft);
        
        // Increment next_id for future mints
        collection.next_id = collection.next_id + 1;
    }

    /// Donate to a specific NFT by owner and nft_id
    public entry fun donate(
        donor: &signer,
        nft_owner: address,
        nft_id: u64,
        amount: u64
    ) acquires NFTCollection {
        // Validate donation amount
        assert!(amount > 0, E_INVALID_AMOUNT);
        
        // Ensure collection exists
        assert!(exists<NFTCollection>(nft_owner), E_COLLECTION_NOT_FOUND);

        // Transfer coins
        let coins = coin::withdraw<AptosCoin>(donor, amount);
        coin::deposit<AptosCoin>(nft_owner, coins);

        // Update donation counter for the specific NFT
        let collection = borrow_global_mut<NFTCollection>(nft_owner);
        let nfts_ref = &mut collection.nfts;
        let len = vector::length(nfts_ref);
        let i = 0;
        let found = false;

        while (i < len) {
            let nft = vector::borrow_mut(nfts_ref, i);
            if (nft.id == nft_id) {
                nft.total_donations = nft.total_donations + amount;
                found = true;
                break
            };
            i = i + 1;
        };

        assert!(found, E_NFT_NOT_FOUND);
    }

    /// View: Get all NFTs for an owner
    #[view]
    public fun get_all_nfts(owner: address): vector<NFT> acquires NFTCollection {
        if (!exists<NFTCollection>(owner)) {
            return vector::empty<NFT>()
        };
        
        let collection = borrow_global<NFTCollection>(owner);
        collection.nfts
    }

    /// View: Get a specific NFT by owner and id
    #[view]
    public fun get_nft(owner: address, nft_id: u64): NFT acquires NFTCollection {
        assert!(exists<NFTCollection>(owner), E_COLLECTION_NOT_FOUND);
        
        let collection = borrow_global<NFTCollection>(owner);
        let nfts_ref = &collection.nfts;
        let len = vector::length(nfts_ref);
        let i = 0;

        while (i < len) {
            let nft = vector::borrow(nfts_ref, i);
            if (nft.id == nft_id) {
                return *nft
            };
            i = i + 1;
        };

        abort E_NFT_NOT_FOUND
    }

    /// View: Get total donations for a specific NFT
    #[view]
    public fun get_total_donations(owner: address, nft_id: u64): u64 acquires NFTCollection {
        let nft = get_nft(owner, nft_id);
        nft.total_donations
    }

    /// View: Get NFT URI
    #[view]
    public fun get_nft_uri(owner: address, nft_id: u64): vector<u8> acquires NFTCollection {
        let nft = get_nft(owner, nft_id);
        nft.uri
    }

    /// View: Check if an address has a collection
    #[view]
    public fun has_collection(owner: address): bool {
        exists<NFTCollection>(owner)
    }

    /// View: Get total number of NFTs for an owner
    #[view]
    public fun get_nft_count(owner: address): u64 acquires NFTCollection {
        if (!exists<NFTCollection>(owner)) {
            return 0
        };
        
        let collection = borrow_global<NFTCollection>(owner);
        vector::length(&collection.nfts)
    }
}
