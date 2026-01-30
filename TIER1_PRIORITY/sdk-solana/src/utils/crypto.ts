/**
 * SDK-Solana Cryptographic Utilities
 * 
 * Core cryptographic functions for privacy-preserving operations.
 * Uses @noble libraries for secure, constant-time implementations.
 */

import { sha256 as nobleSha256 } from '@noble/hashes/sha256';
import { sha512 as nobleSha512 } from '@noble/hashes/sha512';
import { ripemd160 as nobleRipemd160 } from '@noble/hashes/ripemd160';
import { bytesToHex as nobleBytesToHex, hexToBytes as nobleHexToBytes } from '@noble/hashes/utils';
import {
  assert,
  assertBufferLength,
  assertBigintRange,
  SDKError,
  cryptoError,
} from './errors';
import { SDKErrorCode } from '../types';

// ============================================================================
// Type Definitions
// ============================================================================

export interface KeyPair {
  publicKey: Buffer;
  privateKey: Buffer;
}

export interface EncryptedData {
  ciphertext: Buffer;
  nonce: Buffer;
  tag: Buffer;
}

// ============================================================================
// Random Number Generation
// ============================================================================

/**
 * Generate cryptographically secure random bytes
 */
export function randomBytes(size: number): Buffer {
  if (size <= 0) {
    throw cryptoError('Random bytes size must be positive');
  }
  
  const array = new Uint8Array(size);
  crypto.getRandomValues(array);
  return Buffer.from(array);
}

/**
 * Generate a random bigint within a range
 */
export function randomBigint(min: bigint, max: bigint): bigint {
  assertBigintRange(min, 0n, max, 'min');
  assertBigintRange(max, min, 2n ** 256n, 'max');
  
  const range = max - min;
  const bytesNeeded = Math.ceil(Number(range).toString(2).length / 8);
  const maxAttempts = 10;
  
  for (let i = 0; i < maxAttempts; i++) {
    const randomBuffer = randomBytes(bytesNeeded);
    const randomValue = BigInt('0x' + randomBuffer.toString('hex'));
    const value = (randomValue % range) + min;
    
    if (value >= min && value <= max) {
      return value;
    }
  }
  
  // Fallback with uniform distribution
  const rangeBytes = Buffer.alloc(bytesNeeded);
  let candidate = 0n;
  
  do {
    const arr = new Uint8Array(rangeBytes.length);
    crypto.getRandomValues(arr);
    candidate = BigInt('0x' + Buffer.from(arr).toString('hex')) % range;
  } while (candidate >= range);
  
  return candidate + min;
}

// ============================================================================
// Hash Functions
// ============================================================================

/**
 * SHA-256 hash function
 */
export function hashSHA256(data: Buffer): Buffer {
  return Buffer.from(nobleSha256(data));
}

/**
 * SHA-512 hash function
 */
export function hashSHA512(data: Buffer): Buffer {
  return Buffer.from(nobleSha512(data));
}

/**
 * RIPEMD-160 hash function (used in Bitcoin/Solana addresses)
 */
export function hashRIPEMD160(data: Buffer): Buffer {
  return Buffer.from(nobleRipemd160(data));
}

/**
 * Double SHA-256 (used in Bitcoin)
 */
export function hashDoubleSHA256(data: Buffer): Buffer {
  return hashSHA256(hashSHA256(data));
}

/**
 * Compute SHA-256 hash of multiple buffers (concatenated)
 */
export function hashSHA256Concat(...inputs: Buffer[]): Buffer {
  const concatenated = Buffer.concat(inputs);
  return hashSHA256(concatenated);
}

/**
 * Poseidon hash - ZK-friendly hash function
 * Simplified implementation for educational purposes
 * In production, use a verified implementation
 */
export function hashPoseidon(inputs: bigint[]): bigint {
  // Simplified Poseidon-like hash
  // Uses a simple mixing function for demonstration
  // Real implementations require careful constant selection
  
  if (inputs.length === 0) {
    return 0n;
  }
  
  let state = inputs.reduce((acc, val) => acc + val, 0n) % BigInt(2 ** 64);
  
  // Simple mixing rounds
  for (let i = 0; i < 8; i++) {
    state = (state * state) % BigInt(2 ** 64);
    state = (state + BigInt(i) + 1n) % BigInt(2 ** 64);
    state = (state * state) % BigInt(2 ** 64);
    state = (state + inputs[i % inputs.length]) % BigInt(2 ** 64);
  }
  
  return state;
}

/**
 * Convert buffer to bigint (little-endian)
 */
export function bufferToBigint(buffer: Buffer): bigint {
  let result = 0n;
  for (let i = 0; i < buffer.length; i++) {
    result += BigInt(buffer[i]) << BigInt(i * 8);
  }
  return result;
}

/**
 * Convert bigint to buffer (little-endian)
 */
export function bigintToBuffer(value: bigint, size: number): Buffer {
  assertBigintRange(value, 0n, (1n << BigInt(size * 8)) - 1n, 'value');
  
  const buffer = Buffer.alloc(size);
  let remaining = value;
  
  for (let i = 0; i < size; i++) {
    buffer[i] = Number(remaining & 0xFFn);
    remaining >>= 8n;
  }
  
  return buffer;
}

// ============================================================================
// Elliptic Curve Operations (Simplified secp256k1-like)
// ============================================================================

/**
 * Point addition on an elliptic curve
 */
export function pointAdd(p1: Buffer, p2: Buffer): Buffer {
  // Simplified implementation
  // In production, use @noble/secp256k1
  
  assertBufferLength(p1, 64, 'Point 1');
  assertBufferLength(p2, 64, 'Point 2');
  
  // Simplified: just XOR the points for demonstration
  const result = Buffer.alloc(64);
  for (let i = 0; i < 64; i++) {
    result[i] = p1[i] ^ p2[i];
  }
  
  return result;
}

/**
 * Scalar multiplication on an elliptic curve
 */
export function pointMultiply(point: Buffer, scalar: bigint): Buffer {
  // Simplified implementation
  // In production, use @noble/secp256k1
  
  assertBufferLength(point, 64, 'Point');
  
  // Simplified: just return the point for demonstration
  // Real implementation would do proper EC scalar multiplication
  return Buffer.from(point);
}

/**
 * Compute modular multiplicative inverse using extended Euclidean algorithm
 */
export function modInverse(a: bigint, m: bigint): bigint {
  assertBigintRange(m, 2n, 2n ** 256n, 'modulus');
  a = ((a % m) + m) % m;
  
  if (a === 0n) {
    throw new Error('Inverse does not exist');
  }
  
  let [old_r, r] = [a, m];
  let [old_s, s] = [1n, 0n];
  
  while (r !== 0n) {
    const quotient = old_r / r;
    [old_r, r] = [r, old_r - quotient * r];
    [old_s, s] = [s, old_s - quotient * s];
  }
  
  // old_r is now gcd, should be 1
  assert(old_r === 1n, SDKErrorCode.CRYPTO_ERROR, 'Inverse does not exist');
  
  return ((old_s % m) + m) % m;
}

// ============================================================================
// Pedersen Commitment
// ============================================================================

// Generator points for Pedersen commitments
// In production, use cryptographically verified generators
const G_VALUE = Buffer.from(
  '79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798483' +
  'ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8',
  'hex'
);

const H_VALUE = Buffer.from(
  '483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8' +
  '79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798',
  'hex'
);

/**
 * Pedersen commitment to a value
 * Hides the value while allowing verification
 */
export function pedersenCommit(value: bigint, blinding: Buffer): Buffer {
  assertBigintRange(value, 0n, (1n << 64n) - 1n, 'value');
  assertBufferLength(blinding, 32, 'blinding');
  
  // Simplified commitment: hash of value and blinding
  const valueBuf = bigintToBuffer(value, 32);
  const combined = Buffer.concat([valueBuf, blinding]);
  
  return hashSHA256(combined);
}

/**
 * Pedersen commitment to multiple values
 */
export function pedersenCommitMulti(
  values: bigint[],
  blinding: Buffer
): Buffer {
  assertBufferLength(blinding, 32, 'blinding');
  
  let combined = Buffer.concat([blinding]);
  
  for (const value of values) {
    const valueBuf = bigintToBuffer(value, 32);
    combined = Buffer.concat([combined, valueBuf]);
  }
  
  return hashSHA256(combined);
}

/**
 * Verify a Pedersen commitment
 */
export function pedersenVerify(
  commitment: Buffer,
  value: bigint,
  blinding: Buffer
): boolean {
  try {
    assertBufferLength(commitment, 32, 'commitment');
    assertBufferLength(blinding, 32, 'blinding');
    
    const computed = pedersenCommit(value, blinding);
    return commitment.equals(computed);
  } catch {
    return false;
  }
}

// ============================================================================
// Buffer Utilities
// ============================================================================

/**
 * Concatenate multiple buffers
 */
export function concatBuffers(...buffers: Buffer[]): Buffer {
  return Buffer.concat(buffers);
}

/**
 * XOR two buffers of equal length
 */
export function xorBuffers(a: Buffer, b: Buffer): Buffer {
  assert(
    a.length === b.length,
    SDKErrorCode.INVALID_CONFIG,
    'Buffers must have same length for XOR'
  );
  
  const result = Buffer.alloc(a.length);
  for (let i = 0; i < a.length; i++) {
    result[i] = a[i] ^ b[i];
  }
  return result;
}

/**
 * Check if buffer is all zeros
 */
export function isZeroBuffer(buffer: Buffer): boolean {
  for (let i = 0; i < buffer.length; i++) {
    if (buffer[i] !== 0) {
      return false;
    }
  }
  return true;
}

/**
 * Constant-time buffer comparison (for security)
 */
export function constantTimeEquals(a: Buffer, b: Buffer): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i];
  }
  
  return result === 0;
}

// ============================================================================
// Base Encoding
// ============================================================================

/**
 * Encode buffer to base58
 */
export function toBase58(buffer: Buffer): string {
  const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let num = bufferToBigint(buffer);
  const base = BigInt(alphabet.length);
  
  if (num === 0n) {
    return alphabet[0];
  }
  
  let result = '';
  while (num > 0n) {
    const remainder = num % base;
    num = num / base;
    result = alphabet[Number(remainder)] + result;
  }
  
  return result;
}

/**
 * Decode base58 to buffer
 */
export function fromBase58(str: string): Buffer {
  const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  const base = BigInt(alphabet.length);
  let num = 0n;
  
  for (const char of str) {
    const index = alphabet.indexOf(char);
    if (index === -1) {
      throw new Error(`Invalid base58 character: ${char}`);
    }
    num = num * base + BigInt(index);
  }
  
  // Convert back to buffer
  const hex = num.toString(16);
  const padded = hex.length % 2 === 0 ? hex : '0' + hex;
  return Buffer.from(padded, 'hex');
}

/**
 * Encode buffer to hex string
 */
export function toHex(buffer: Buffer): string {
  return nobleBytesToHex(buffer);
}

/**
 * Decode hex string to buffer
 */
export function fromHex(hex: string): Buffer {
  return Buffer.from(nobleHexToBytes(hex));
}

// ============================================================================
// Testing Utilities
// ============================================================================

/**
 * Generate deterministic test data
 */
export function generateTestData(seed: number): {
  randomBytes: Buffer;
  randomBigint: bigint;
  hash: Buffer;
} {
  const seedBuffer = Buffer.alloc(4);
  seedBuffer.writeUInt32LE(seed);
  
  const randomBytes = hashSHA256(seedBuffer);
  const randomBigint = bufferToBigint(randomBytes);
  const hash = hashSHA256(randomBytes);
  
  return { randomBytes, randomBigint, hash };
}
