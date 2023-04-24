import * as bip39 from 'bip39';
import CryptoJS from 'crypto-js';
import { Principal } from '@dfinity/principal';
import {
  byteArrayToWordArray,
  generateChecksum,
  wordArrayToByteArray,
} from '../crypto/binary';
import { ACCOUNT_DOMAIN_SEPERATOR, SUB_ACCOUNT_ZERO } from './constants';

/*
    Used dfinity/keysmith/account/account.go as a base for the ID generation
*/
export const getAccountId = (
  principal,
  subAccount
) => {
  const sha = CryptoJS.algo.SHA224.create();
  sha.update(ACCOUNT_DOMAIN_SEPERATOR); // Internally parsed with UTF-8, like go does
  sha.update(byteArrayToWordArray(principal.toUint8Array()));
  const subBuffer = Buffer.from(SUB_ACCOUNT_ZERO);
  if (subAccount) {
    subBuffer.writeUInt32BE(subAccount);
  }
  sha.update(byteArrayToWordArray(subBuffer));
  const hash = sha.finalize();

  /// While this is backed by an array of length 28, it's canonical representation
  /// is a hex string of length 64. The first 8 characters are the CRC-32 encoded
  /// hash of the following 56 characters of hex. Both, upper and lower case
  /// characters are valid in the input string and can even be mixed.
  /// [ic/rs/rosetta-api/ledger_canister/src/account_identifier.rs]
  const byteArray = wordArrayToByteArray(hash, 28);
  const checksum = generateChecksum(byteArray);
  const val = checksum + hash.toString();

  return val;
};
