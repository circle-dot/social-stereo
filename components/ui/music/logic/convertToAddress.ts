import { ethers } from "ethers";

/**
 * Encode a string to bytes20 (padded to 20 bytes)
 * @param {string} input - Input string (max length: 20 bytes)
 * @returns {string} Hex string representing bytes20
 */
function stringToBytes20(input: string) {
  const utf8Bytes = ethers.toUtf8Bytes(input);
  
  if (utf8Bytes.length > 20) {
    throw new Error("Input string is too long. Max 20 bytes allowed.");
  }

  // Pad with zeros to make it exactly 20 bytes
  const paddedBytes = new Uint8Array(20);
  paddedBytes.set(utf8Bytes); // Copy input bytes into the padded array

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

// Example usage:
const encoded = stringToBytes20("hello");
console.log("Encoded:", encoded); // Encoded: 0x68656c6c6f000000000000000000000000000000

const decoded = bytes20ToString(encoded);
console.log("Decoded:", decoded); // Decoded: hello

export { stringToBytes20, bytes20ToString };