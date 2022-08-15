# clarity-nft-shop

After downloading Clarinet. in the nft-shop repository type clarinet console. 

to mint an nft to your wallet address type  (contract-call? .sip009-nft-trait mint tx-sender)

to whitelist the contract (contract-call? .shop set-whitelisted .sip009-nft-trait true)

to list the nft to the shop type (contract-call? .shop list-asset .sip009-nft-trait {taker: none, token-id: u1, expiry: u500, price: u150, payment-asset-contract: none})
Note the token id will be u1 if you have only minted one nft, the expiry is how many blocks will it stay active, and the payment asset contract is if you do not want to use the native currency you can put another

to purchase that nft type ::set_tx_sender and pick a wallet from the devnet list of wallets. 

(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.shop fulfil-listing-stx u0 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sip009-nft-trait)
the address in front of the contract name is the address you first used, fulfil listing in stx means you are buying it in the native currency, u0 means you are buying the first listing in the shop. 

to now view the state of the active wallets type ::get_assets_maps
we should see that the second wallet has sent 150 to wallet 1 and wallet 1 no longer has the nft, and wallet 2 does have it, and we should see that the shop now has no listings. 

to purchase with another asset, you first have to give the second wallet some of those funds, and then list the nft from the first wallet and specify the payment asset contract to our sip010 contract, and then we can switch to the second wallet that is funded, and purchase the nft by following these steps below. 
;; mint some ft (contract-call? .sip010-ft-trait mint u1000 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5)
;; (contract-call? .shop set-whitelisted .sip010-ft-trait true)
;; (contract-call? .shop list-asset .sip009-nft-trait {taker: none, token-id: u1, expiry: u500, price: u800, payment-asset-contract: (some .sip010-ft-trait)})

;; (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.shop fulfil-listing-ft u0 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sip009-nft-trait 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sip010-ft-trait)
you can now view ::get_assets_maps to see the changes that were made. 
