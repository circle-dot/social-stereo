import { ethers } from "ethers";

const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

// function stringToBytes20(input: string): string {
//   const utf8Bytes = ethers.toUtf8Bytes(input);
//   if (utf8Bytes.length > 20) {
//     throw new Error("Input string is too long. Max 20 bytes allowed.");
//   }
//   const paddedBytes = new Uint8Array(20);
//   paddedBytes.set(utf8Bytes);
//   return ethers.hexlify(paddedBytes);
// }

function base62ToBigInt(base62: string): bigint {
  let result = BigInt(0);
  const base = BigInt(62);
  for (let i = 0; i < base62.length; i++) {
    result = result * base + BigInt(BASE62.indexOf(base62[i]));
  }
  return result;
}

export function spotifyIdToEthAddress(spotifyId: string): string {
  const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  
  // Convert base62 to decimal
  let decimal = 0n;
  for (let char of spotifyId) {
      decimal = decimal * 62n + BigInt(BASE62.indexOf(char));
  }
  
  // Convert decimal to hex
  let hexString = decimal.toString(16);
  
  // Ensure the hex string is 40 characters long (20 bytes)
  hexString = hexString.padStart(40, '0');
  
  // Add '0x' prefix and return
  return '0x' + hexString;
}

function bigIntToBase62(value: bigint): string {
  if (value === BigInt(0)) return '0';
  let result = '';
  while (value > 0) {
    result = BASE62[Number(value % BigInt(62))] + result;
    value = value / BigInt(62);
  }
  return result;
}

export function ethAddressToSpotifyId(ethAddress: string): string {
  // Remove '0x' prefix and convert to lowercase
  const addressWithoutPrefix = ethAddress.slice(2).toLowerCase();
  // Convert hex to BigInt
  const bigIntValue = BigInt('0x' + addressWithoutPrefix);
  // Convert BigInt to base62 string
  return bigIntToBase62(bigIntValue);
}
