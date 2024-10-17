import { ethers } from "ethers";

/**
 * Encode a string to bytes20 (padded to 20 bytes)
 * @param {string} input - Input string (max length: 20 bytes)
 * @returns {string} Hex string representing bytes20
 */
function stringToBytes20(input: string) {
  const utf8Bytes = ethers.toUtf8Bytes(input);
  const slicedBytes = utf8Bytes.slice(0, 20);

  // Pad with zeros to make it exactly 20 bytes
  const paddedBytes = new Uint8Array(20);
  paddedBytes.set(slicedBytes); // Copy input bytes into the padded array

  return ethers.hexlify(paddedBytes); // Convert to hex string
}

/**
 * Decode a bytes20 hex string back to the original string
 * @param {string} hex - Input bytes20 hex string
 * @returns {string} Original decoded string
 */
function bytes20ToString(hex: string) {
  const bytes = ethers.getBytes(hex); // Convert hex to byte array

  // Trim trailing zeros (padding) and decode to UTF-8 string
  const trimmedBytes = bytes.filter(byte => byte !== 0);
  
  return ethers.toUtf8String(trimmedBytes);
}

export { stringToBytes20, bytes20ToString };