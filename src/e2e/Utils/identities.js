//identity.ts
import { Secp256k1KeyIdentity } from "@dfinity/identity";
import { fromMasterSeed } from "hdkey";
import { mnemonicToSeed, generateMnemonic } from "bip39";
import { brotliCompress } from "zlib";

export async function identityFromSeed(phrase) {
  const seed = await mnemonicToSeed(phrase);
  const root = fromMasterSeed(seed);
  const addrnode = root.derive("m/44'/223'/0'/0/0");

  return Secp256k1KeyIdentity.fromSecretKey(addrnode.privateKey);
};

export async function newMnemonic() {
  return generateMnemonic();
};