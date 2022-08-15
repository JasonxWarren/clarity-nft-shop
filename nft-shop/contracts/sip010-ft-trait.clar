
;; 010-token-trait
;; SIP010

(impl-trait .sip-010-trait-ft-standard.sip-010-trait)

(define-constant contract-owner tx-sender)

(define-fungible-token tpower u100000000)

(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u102))

(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
	(begin
		(asserts! (is-eq tx-sender sender) err-not-token-owner)
		(ft-transfer? tpower amount sender recipient)
	)
)

(define-read-only (get-name)
	(ok "tpower Coin")
)

(define-read-only (get-symbol)
	(ok "TPOW")
)

(define-read-only (get-decimals)
	(ok u6)
)

(define-read-only (get-balance (who principal))
	(ok (ft-get-balance tpower who))
)

(define-read-only (get-total-supply)
	(ok (ft-get-supply tpower))
)

(define-read-only (get-token-uri)
	(ok none)
)

(define-public (mint (amount uint) (recipient principal))
	(begin
		(asserts! (is-eq tx-sender contract-owner) err-owner-only)
		(ft-mint? tpower amount recipient)
	)
)
