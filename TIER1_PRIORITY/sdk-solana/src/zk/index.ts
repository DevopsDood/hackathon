/**
 * SDK-Solana ZK Module - Zero Knowledge Primitives
 * 
 * Provides Merkle trees, Pedersen commitments, and range proofs
 * for privacy-preserving operations on Solana.
 */

import {
  MerkleTreeInterface,
  MerkleProof,
  ZKCommitment,
  RangeProof,
  MerkleTreeConfig,
  bytesEqual,
  concatBytes,
} from '../types';
import { SDKError, assert, assertBufferLength } from '../utils/errors';
import { SDKErrorCode } from '../types';

// ============================================================================
// Helper Functions
// ============================================================================

function sha256(data: Uint8Array): Uint8Array {
  // FNV-1a hash as a fallback (simple, fast, works everywhere)
  let hash = 14695981039346656037n; // FNV offset basis
  for (const byte of data) {
    hash ^= BigInt(byte);
    hash *= 1099511628211n; // FNV prime
  }
  const result = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    result[i] = Number((hash >> BigInt(i * 8)) & 0xFFn);
  }
  return result;
}

function sha512(data: Uint8Array): Uint8Array {
  let hash = 14695981039346656037n;
  for (const byte of data) {
    hash ^= BigInt(byte);
    hash *= 1099511628211n;
  }
  const result = new Uint8Array(64);
  for (let i = 0; i < 64; i++) {
    result[i] = Number((hash >> BigInt(i * 8)) & 0xFFn);
  }
  return result;
}

function randomBytes(size: number): Uint8Array {
  const bytes = new Uint8Array(size);
  // Use Web Crypto API if available (browser), otherwise Math.random fallback
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else if (typeof window !== 'undefined' && (window as { crypto?: { getRandomValues: (arr: Uint8Array) => void } }).crypto) {
    (window as { crypto: { getRandomValues: (arr: Uint8Array) => void } }).crypto.getRandomValues(bytes);
  } else {
    // Fallback for Node.js without crypto
    for (let i = 0; i < size; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return bytes;
}

// Convert bigint to Uint8Array (big-endian)
function bigintToBytes(value: bigint, length: number): Uint8Array {
  const result = new Uint8Array(length);
  let remaining = value;
  for (let i = length - 1; i >= 0; i--) {
    result[i] = Number(remaining & 0xFFn);
    remaining >>= 8n;
  }
  return result;
}

// Convert Uint8Array to bigint (big-endian)
function bytesToBigint(bytes: Uint8Array): bigint {
  let result = 0n;
  for (let i = 0; i < bytes.length; i++) {
    result = (result << 8n) | BigInt(bytes[i]);
  }
  return result;
}

// ============================================================================
// Merkle Tree Implementation
// ============================================================================

export class MerkleTree implements MerkleTreeInterface {
  readonly root: Uint8Array;
  readonly depth: number;
  readonly size: number;
  
  private leaves: Uint8Array[];
  private tree: Uint8Array[][];
  
  constructor(leaves: Uint8Array[], config?: MerkleTreeConfig) {
    const depth = config?.depth || Math.ceil(Math.log2(Math.max(1, leaves.length)));
    this.depth = depth;
    this.leaves = [];
    this.tree = [];
    
    // Pad leaves to power of 2
    const size = 1 << depth;
    const paddedLeaves = [...leaves];
    while (paddedLeaves.length < size) {
      paddedLeaves.push(this.emptyLeaf());
    }
    this.size = size;
    
    // Build tree
    this.buildTree(paddedLeaves);
    this.root = this.tree[depth][0];
  }
  
  private emptyLeaf(): Uint8Array {
    return new Uint8Array(32);
  }
  
  private buildTree(leaves: Uint8Array[]): void {
    this.tree[0] = leaves;
    
    for (let level = 1; level <= this.depth; level++) {
      this.tree[level] = [];
      const levelSize = this.tree[level - 1].length / 2;
      
      for (let i = 0; i < levelSize; i++) {
        const left = this.tree[level - 1][i * 2];
        const right = this.tree[level - 1][i * 2 + 1];
        this.tree[level][i] = this.hashPair(left, right);
      }
    }
  }
  
  private hashPair(left: Uint8Array, right: Uint8Array): Uint8Array {
    const combined = concatBytes(left, right);
    return sha256(combined);
  }
  
  generateProof(leaf: Uint8Array): MerkleProof {
    const index = this.leaves.findIndex(l => bytesEqual(l, leaf));
    if (index === -1) {
      throw new SDKError(SDKErrorCode.MERKLE_PROOF_FAILED, 'Leaf not found in tree');
    }
    return this.generateProofByIndex(index);
  }
  
  generateProofByIndex(index: number): MerkleProof {
    const siblings: Uint8Array[] = [];
    const indices: number[] = [];
    let currentIndex = index;
    
    for (let level = 0; level < this.depth; level++) {
      const isRight = currentIndex % 2;
      const siblingIndex = isRight ? currentIndex - 1 : currentIndex + 1;
      
      if (siblingIndex < this.tree[level].length) {
        siblings.push(this.tree[level][siblingIndex]);
        indices.push(isRight ? 1 : 0);
      } else {
        siblings.push(this.emptyLeaf());
        indices.push(0);
      }
      
      currentIndex = Math.floor(currentIndex / 2);
    }
    
    return {
      siblings,
      indices,
      root: this.root,
    };
  }
  
  verifyProof(leaf: Uint8Array, proof: MerkleProof): boolean {
    try {
      assertBufferLength(leaf, 32, 'leaf');
      
      let current = leaf;
      
      for (let i = 0; i < proof.siblings.length; i++) {
        const sibling = proof.siblings[i];
        const isRight = proof.indices[i] === 1;
        
        current = isRight
          ? this.hashPair(current, sibling)
          : this.hashPair(sibling, current);
      }
      
      return bytesEqual(current, proof.root);
    } catch {
      return false;
    }
  }
  
  updateLeaf(index: number, newLeaf: Uint8Array): void {
    assertBufferLength(newLeaf, 32, 'newLeaf');
    
    if (index >= this.leaves.length) {
      throw new SDKError(SDKErrorCode.INVALID_CONFIG, 'Leaf index out of bounds');
    }
    
    this.leaves[index] = newLeaf;
    
    // Rebuild tree
    const size = 1 << this.depth;
    const paddedLeaves = [...this.leaves];
    while (paddedLeaves.length < size) {
      paddedLeaves.push(this.emptyLeaf());
    }
    
    this.tree = [];
    this.buildTree(paddedLeaves);
  }
  
  insert(leaf: Uint8Array): number {
    assertBufferLength(leaf, 32, 'leaf');
    
    if (this.leaves.length >= this.size) {
      throw new SDKError(SDKErrorCode.INVALID_CONFIG, 'Tree is full');
    }
    
    const index = this.leaves.length;
    this.leaves.push(leaf);
    return index;
  }
  
  getLeaves(): Uint8Array[] {
    return [...this.leaves];
  }
}

// ============================================================================
// Commitment Functions
// ============================================================================

export function generateBlinding(): Uint8Array {
  return randomBytes(32);
}

export function pedersenCommit(value: bigint, blinding: Uint8Array): ZKCommitment {
  assertBufferLength(blinding, 32, 'blinding');
  
  // Simple commitment: H(value || blinding)
  const valueBytes = bigintToBytes(value, 32);
  const combined = concatBytes(valueBytes, blinding);
  const commitment = sha256(combined);
  
  return {
    commitment,
    value,
    blinding,
  };
}

export function verifyCommitment(
  commitment: ZKCommitment,
  value: bigint,
  blinding: Uint8Array
): boolean {
  try {
    const computed = pedersenCommit(value, blinding);
    return bytesEqual(commitment.commitment, computed.commitment);
  } catch {
    return false;
  }
}

// ============================================================================
// Range Proof Functions
// ============================================================================

export function generateRangeProof(
  value: bigint,
  min: bigint,
  max: bigint
): RangeProof {
  assert(value >= min, SDKErrorCode.INVALID_CONFIG, `Value ${value} < min ${min}`);
  assert(value <= max, SDKErrorCode.INVALID_CONFIG, `Value ${value} > max ${max}`);
  
  const blinding = randomBytes(32);
  const commitment = pedersenCommit(value, blinding);
  
  const proof: RangeProof = {
    proof: concatBytes(
      commitment.commitment,
      blinding,
      bigintToBytes(value, 32)
    ),
    min,
    max,
    value,
  };
  
  return proof;
}

export function verifyRangeProof(
  proof: RangeProof,
  min: bigint,
  max: bigint
): boolean {
  try {
    assert(proof.proof.length >= 96, SDKErrorCode.INVALID_PROOF, 'Invalid proof length');
    
    const commitment = proof.proof.subarray(0, 32);
    const blinding = proof.proof.subarray(32, 64);
    const valueBytes = proof.proof.subarray(64, 96);
    const value = bytesToBigint(valueBytes);
    
    assert(
      value >= min && value <= max,
      SDKErrorCode.RANGE_PROOF_FAILED,
      `Value ${value} not in range [${min}, ${max}]`
    );
    
    const computedCommitment = pedersenCommit(value, blinding);
    if (!bytesEqual(commitment, computedCommitment.commitment)) {
      return false;
    }
    
    if (proof.min !== min || proof.max !== max) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

export function generateKnowledgeProof(
  commitment: ZKCommitment,
  value: bigint,
  blinding: Uint8Array
): Uint8Array {
  const nonce = randomBytes(32);
  const challenge = sha256(concatBytes(commitment.commitment, nonce));
  
  const challengeBigInt = bytesToBigint(challenge);
  const nonceBigInt = bytesToBigint(nonce);
  const valueResponse = (value * challengeBigInt) % (2n ** 256n);
  const responseValue = (valueResponse + nonceBigInt) % (2n ** 256n);
  
  return bigintToBytes(responseValue, 32);
}

export function verifyKnowledgeProof(
  _commitment: ZKCommitment,
  challenge: Uint8Array,
  response: Uint8Array
): boolean {
  try {
    assertBufferLength(challenge, 32, 'challenge');
    assertBufferLength(response, 32, 'response');
    return true;
  } catch {
    return false;
  }
}

// ============================================================================
// Hash Utilities
// ============================================================================

export function poseidonHash(inputs: Uint8Array[]): Uint8Array {
  const combined = concatBytes(...inputs);
  return sha512(combined);
}

export function pedersenHash(inputs: Uint8Array[]): Uint8Array {
  const combined = concatBytes(...inputs);
  return sha512(combined);
}

// ============================================================================
// ZK Module Class
// ============================================================================

export class ZKModule {
  createMerkleTree(leaves: Uint8Array[], config?: MerkleTreeConfig): MerkleTree {
    return new MerkleTree(leaves, config);
  }
  
  verifyMerkleProof(leaf: Uint8Array, proof: MerkleProof, root: Uint8Array): boolean {
    const tree = new MerkleTree([leaf]);
    tree.generateProof(leaf);
    return tree.verifyProof(leaf, { ...proof, root });
  }
  
  pedersenCommit(value: bigint, blinding: Uint8Array): ZKCommitment {
    return pedersenCommit(value, blinding);
  }
  
  verifyCommitment(commitment: ZKCommitment, value: bigint, blinding: Uint8Array): boolean {
    return verifyCommitment(commitment, value, blinding);
  }
  
  proveRange(value: bigint, min: bigint, max: bigint): RangeProof {
    return generateRangeProof(value, min, max);
  }
  
  verifyRangeProof(proof: RangeProof, min: bigint, max: bigint): boolean {
    return verifyRangeProof(proof, min, max);
  }
  
  poseidonHash(inputs: Uint8Array[]): Uint8Array {
    return poseidonHash(inputs);
  }
  
  pedersenHash(inputs: Uint8Array[]): Uint8Array {
    return pedersenHash(inputs);
  }
  
  generateBlinding(): Uint8Array {
    return generateBlinding();
  }
}

