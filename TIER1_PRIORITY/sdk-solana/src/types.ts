/**
 * SDK-Solana Type Definitions
 * 
 * Comprehensive type definitions for the privacy-focused Solana SDK.
 */

// Use Uint8Array instead of Buffer for browser compatibility
export type Bytes = Uint8Array;

// ============================================================================
// Core Types
// ============================================================================

export type Network = 'mainnet-beta' | 'testnet' | 'devnet' | 'localnet';

export type TxCommitment = 'processed' | 'confirmed' | 'finalized';

export interface SDKConfig {
  network: Network;
  rpcUrl: string;
  commitment?: TxCommitment;
  timeout?: number;
}

// ============================================================================
// ZK Types
// ============================================================================

/**
 * Merkle Tree Types
 */
export interface MerkleProof {
  siblings: Bytes[];
  indices: number[];
  root: Bytes;
}

export interface MerkleTreeConfig {
  depth: number;
  hashFunction?: 'sha256' | 'poseidon';
}

export interface MerkleTreeInterface {
  readonly root: Bytes;
  readonly depth: number;
  readonly size: number;
  
  generateProof(leaf: Bytes): MerkleProof;
  generateProofByIndex(index: number): MerkleProof;
  verifyProof(leaf: Bytes, proof: MerkleProof): boolean;
  updateLeaf(index: number, newLeaf: Bytes): void;
  insert(leaf: Bytes): number;
  getLeaves(): Bytes[];
}

/**
 * Pedersen Commitment Types - renamed to avoid conflict with TxCommitment
 */
export interface ZKCommitment {
  commitment: Bytes;
  value: bigint;
  blinding: Bytes;
}

export interface CommitmentProof {
  commitment: Bytes;
  rangeProof: RangeProof;
}

/**
 * Range Proof Types
 */
export interface RangeProof {
  proof: Bytes;
  min: bigint;
  max: bigint;
  value: bigint;
}

export interface RangeProofConfig {
  rounds?: number;
  base?: bigint;
}

// ============================================================================
// Stealth Address Types
// ============================================================================

export interface StealthAddress {
  address: string;
  ephemeralPublicKey: Bytes;
  viewKeyHint: Bytes;
  metadata?: StealthAddressMetadata;
}

export interface StealthAddressMetadata {
  amount?: bigint;
  token?: string;
  memo?: string;
}

export interface PaymentAddress {
  stealthAddress: StealthAddress;
  ephemeralPublicKey: Bytes;
  ephemeralPrivateKey: Bytes;
}

export interface DetectedPayment {
  stealthAddress: StealthAddress;
  ephemeralPublicKey: Bytes;
  amount?: bigint;
  token?: string;
  timestamp: number;
  memo?: string;
}

export interface ViewKey {
  key: Bytes;
  publicKey: Bytes;
  canViewAmounts: boolean;
  canViewRecipients: boolean;
}

export interface ScanKey {
  key: Bytes;
  publicKey: Bytes;
  canDetectPayments: boolean;
  canSpend: boolean;
}

// ============================================================================
// Private Transfer Types
// ============================================================================

export interface PrivateTransferParams {
  recipient: StealthAddress | string;
  amount: bigint;
  token: string;
  memo?: string;
  hideAmount?: boolean;
  hideRecipient?: boolean;
  feePayer?: Bytes;
}

export interface PrivateTransaction {
  transaction: Bytes;
  proof?: RangeProof;
  commitment?: ZKCommitment;
  ephemeralKey?: Bytes;
  metadata?: TransferMetadata;
}

export interface TransferMetadata {
  createdAt: number;
  token: string;
  amount: bigint;
}

export interface VerificationResult {
  valid: boolean;
  rangeProofValid?: boolean;
  commitmentValid?: boolean;
  stealthValid?: boolean;
  error?: string;
}

export interface DecodedTransfer {
  sender: Bytes;
  recipient: Bytes;
  amount: bigint;
  token: string;
  memo?: string;
  timestamp: number;
}

// ============================================================================
// Error Types
// ============================================================================

export enum SDKErrorCode {
  INVALID_CONFIG = 'INVALID_CONFIG',
  INVALID_PUBLIC_KEY = 'INVALID_PUBLIC_KEY',
  INVALID_PRIVATE_KEY = 'INVALID_PRIVATE_KEY',
  INVALID_COMMITMENT = 'INVALID_COMMITMENT',
  INVALID_PROOF = 'INVALID_PROOF',
  INVALID_STEALTH_ADDRESS = 'INVALID_STEALTH_ADDRESS',
  MERKLE_PROOF_FAILED = 'MERKLE_PROOF_FAILED',
  RANGE_PROOF_FAILED = 'RANGE_PROOF_FAILED',
  CRYPTO_ERROR = 'CRYPTO_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',
}

// ============================================================================
// Event Types
// ============================================================================

export interface SDKEventMap {
  'statechange': { previous: string; current: string };
  'error': { error: Error };
  'transaction': { signature: string; type: string };
  'proof': { type: string; duration: number };
}

export type SDKEventType = keyof SDKEventMap;

// ============================================================================
// Utility Types
// ============================================================================

export interface KeyPair {
  publicKey: Bytes;
  privateKey: Bytes;
}

export interface EncryptedData {
  ciphertext: Bytes;
  nonce: Bytes;
  tag: Bytes;
}

export type HashFunction = (data: Bytes) => Bytes;

export interface CryptoProvider {
  randomBytes(size: number): Bytes;
  sha256(data: Bytes): Bytes;
  sha512(data: Bytes): Bytes;
  poseidon(inputs: Bytes[]): Bytes;
  pedersenCommit(value: bigint, blinding: Bytes): Bytes;
  pedersenHash(inputs: Bytes[]): Bytes;
}

// Helper function to compare Uint8Arrays
export function bytesEqual(a: Bytes, b: Bytes): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

// Helper function to convert to hex string
export function bytesToHex(bytes: Bytes, truncate: boolean = false): string {
  const hex = Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return truncate && hex.length > 16 ? hex.slice(0, 16) + '...' : hex;
}

// Helper function to create Uint8Array from various inputs
export function toBytes(input: string | Bytes | ArrayBuffer | number): Bytes {
  if (input instanceof Uint8Array) return input;
  if (typeof input === 'string') {
    // Remove 0x prefix if present
    const hex = input.startsWith('0x') ? input.slice(2) : input;
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
    }
    return bytes;
  }
  if (input instanceof ArrayBuffer) return new Uint8Array(input);
  if (typeof input === 'number') return new Uint8Array([input]);
  return new Uint8Array(0);
}

// Helper function to concatenate Uint8Arrays
export function concatBytes(...arrays: Bytes[]): Bytes {
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

// Helper function to create empty Uint8Array
export function emptyBytes(length: number): Bytes {
  return new Uint8Array(length);
}

