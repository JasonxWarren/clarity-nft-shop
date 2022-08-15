import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v0.31.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

const contractName = 'shop';

const defaultNftAssetContract = 'sip009-nft-trait';
const defaultPaymentAssetContract = 'sip010-ft-trait';

