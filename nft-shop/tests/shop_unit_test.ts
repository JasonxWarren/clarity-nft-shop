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