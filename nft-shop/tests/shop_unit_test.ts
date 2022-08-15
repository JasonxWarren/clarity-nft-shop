import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v0.31.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

const contractName = 'shop';

const defaultNftAssetContract = 'sip009-nft-trait';
const defaultPaymentAssetContract = 'sip010-ft-trait';

const contractPrincipal = (deployer: Account) => `${deployer.address}.${contractName}`;

function mintNft({ chain, deployer, recipient, nftAssetContract = defaultNftAssetContract }: { chain: Chain, deployer: Account, recipient: Account, nftAssetContract?: string }) {
    const block = chain.mineBlock([
        Tx.contractCall(nftAssetContract, 'mint', [types.principal(recipient.address)], deployer.address),
    ]);
    block.receipts[0].result.expectOk();
    const nftMintEvent = block.receipts[0].events[0].nft_mint_event;
    const [nftAssetContractPrincipal, nftAssetId] = nftMintEvent.asset_identifier.split('::');
    return { nftAssetContract: nftAssetContractPrincipal, nftAssetId, tokenId: nftMintEvent.value.substr(1), block };
}
 
function mintFt({ chain, deployer, amount, recipient, paymentAssetContract = defaultPaymentAssetContract }: { chain: Chain, deployer: Account, amount: number, recipient: Account, paymentAssetContract?: string }) {
    const block = chain.mineBlock([
        Tx.contractCall(paymentAssetContract, 'mint', [types.uint(amount), types.principal(recipient.address)], deployer.address),
    ]);
    block.receipts[0].result.expectOk();
    const ftMintEvent = block.receipts[0].events[0].ft_mint_event;
    const [paymentAssetContractPrincipal, paymentAssetId] = ftMintEvent.asset_identifier.split('::');
    return { paymentAssetContract: paymentAssetContractPrincipal, paymentAssetId, block };
}

interface Sip009NftTransferEvent {
    type: string,
    nft_transfer_event: {
        asset_identifier: string,
        sender: string,
        recipient: string,
        value: string
    }
}

function assertNftTransfer(event: Sip009NftTransferEvent, nftAssetContract: string, tokenId: number, sender: string, recipient: string) {
    assertEquals(typeof event, 'object');
    assertEquals(event.type, 'nft_transfer_event');
    assertEquals(event.nft_transfer_event.asset_identifier.substr(0, nftAssetContract.length), nftAssetContract);
    event.nft_transfer_event.sender.expectPrincipal(sender);
    event.nft_transfer_event.recipient.expectPrincipal(recipient);
    event.nft_transfer_event.value.expectUint(tokenId);
}
interface Order {
	taker?: string,
	tokenId: number,
	expiry: number,
	price: number,
	paymentAssetContract?: string
}

const makeOrder = (order: Order) =>
	types.tuple({
		'taker': order.taker ? types.some(types.principal(order.taker)) : types.none(),
		'token-id': types.uint(order.tokenId),
		'expiry': types.uint(order.expiry),
		'price': types.uint(order.price),
		'payment-asset-contract': order.paymentAssetContract ? types.some(types.principal(order.paymentAssetContract)) : types.none(),
	});
    