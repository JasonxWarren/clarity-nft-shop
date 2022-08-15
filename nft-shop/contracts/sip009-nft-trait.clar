
 (impl-trait .nft-trait.nft-trait)

(define-constant contract-owner tx-sender)

(define-constant err-owner-only (err u10))
(define-constant err-token-id-failure (err u11))
(define-constant err-not-token-owner (err u12))

(define-non-fungible-token stacksies uint)
(define-data-var token-id-nonce uint u0)

(define-read-only (get-last-token-id)
	(ok (var-get token-id-nonce))
)

(define-read-only (get-token-uri (token-id uint))
	(ok none)
)

(define-read-only (get-owner (token-id uint))
	(ok (nft-get-owner? stacksies token-id))
)

(define-public (transfer (token-id uint) (sender principal) (recipient principal))
	(begin
		(asserts! (is-eq tx-sender sender) err-not-token-owner)
		(nft-transfer? stacksies token-id sender recipient)
	)
)

(define-public (mint (recipient principal))
	(let ((token-id (+ (var-get token-id-nonce) u1)))
		(asserts! (is-eq tx-sender contract-owner) err-owner-only)
		(try! (nft-mint? stacksies token-id recipient))
		(asserts! (var-set token-id-nonce token-id) err-token-id-failure)
		(ok token-id)
	)
)
;; mint yourself an nft with (contract-call? .sip009-nft-trait mint tx-sender)

;; check to see if you now on own it (contract-call? .sip009-nft-trait get-owner u1)

;; whitelist contract (contract-call? .shop set-whitelisted .test-sip009 true)
;; (contract-call? .tiny-market set-whitelisted .sip009-nft-trait true)

;; (contract-call? .shop list-asset .sip009-nft-trait {taker: none, token-id: u1, expiry: u500, price: u1000, payment-asset-contract: none})

;; (contract-call? .shop get-listing u0)

;; who owns the first nft
;; (contract-call? .sip009-nft-trait get-owner u1)