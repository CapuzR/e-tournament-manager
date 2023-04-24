import { Secp256k1KeyIdentity } from "@dfinity/identity";
import hdkey from "hdkey";
import bip39 from "bip39";
// import { mnemonicToSeed, generateMnemonic } from "bip39";

// Completely insecure seed phrase. Do not use for any purpose other than testing.
// Resolves to "wnkwv-wdqb5-7wlzr-azfpw-5e5n5-dyxrf-uug7x-qxb55-mkmpa-5jqik-tqe"
const adminSeed = "peacock peacock peacock peacock peacock peacock peacock peacock peacock peacock peacock peacock";
const tMSeed = "ricardo ricardo ricardo ricardo ricardo ricardo ricardo ricardo ricardo ricardo ricardo ricardo";
const seed = bip39.generateMnemonic();

export const identityFromSeed = async (phrase) => {
  const s = await bip39.mnemonicToSeed(phrase);
  const root = hdkey.fromMasterSeed(s);
  const addrnode = root.derive("m/44'/223'/0'/0/0");

  return Secp256k1KeyIdentity.fromSecretKey(addrnode.privateKey);
};

export const identity = identityFromSeed(seed);
// export const principal = await identity.getPrincipal();
export const adminIdentity = identityFromSeed(adminSeed);
export const tMIdentity = identityFromSeed(tMSeed);