/**
 * SDK-Solana Merkle Tree Implementation
 * 
 * Provides efficient Merkle tree data structure for privacy proofs.
 */

import { Buffer } from 'buffer';
import { hashSHA256 } from '../utils/crypto';
import { assert, SDKError } from '../utils/errors';
import { SDKErrorCode, MerkleProof, MerkleTreeConfig } from '../types';

/**
 * Merkle Tree implementation using SHA-256
 */
export class MerkleTree {
  private _leaves: Buffer[];
  private _layers: Buffer[][];
  private readonly _depth: number;
  private readonly _hashFunction: (data: Buffer) => Buffer;

  /**
   * Create a new Merkle tree from leaves
   */
  constructor(
    leaves: Buffer[],
    config?: MerkleTreeConfig
  ) {
    const hashFunction = config?.hashFunction === 'poseidon' 
      ? this._poseidonHash.bind(this) 
      : hashSHA256;
    
    this._hashFunction = hashFunction;
    this._leaves = [];
    this._layers = [];

    // Hash leaves if they're not already hashes
    this._leaves = leaves.map(leaf => 
      leaf.length === 32 ? leaf : hashFunction(leaf)
    );

    // Calculate depth if not specified
    this._depth = config?.depth || this._calculateDepth(this._leaves.length);

    // Build tree
    this._buildTree();
  }

  /**
   * Get the Merkle root
   */
  get root(): Buffer {
    if (this._layers.length === 0) {
      return Buffer.alloc(32);
    }
    return this._layers[this._layers.length - 1][0];
  }

  /**
   * Get the tree depth
   */
  get depth(): number {
    return this._depth;
  }

  /**
   * Get the number of leaves
   */
  get size(): number {
    return this._leaves.length;
  }

  /**
   * Get all leaves
   */
  getLeaves(): Buffer[] {
    return [...this._leaves];
  }

  /**
   * Get leaf at index
   */
  getLeaf(index: number): Buffer | null {
    if (index < 0 || index >= this._leaves.length) {
      return null;
    }
    return this._leaves[index];
  }

  /**
   * Generate proof for a leaf
   */
  generateProof(leaf: Buffer): MerkleProof {
    const index = this._leaves.findIndex(l => l.equals(leaf));
    if (index === -1) {
      throw new SDKError(
        SDKErrorCode.MERKLE_PROOF_FAILED,
        'Leaf not found in tree'
      );
    }
    return this.generateProofByIndex(index);
  }

  /**
   * Generate proof by leaf index
   */
  generateProofByIndex(index: number): MerkleProof {
    assert(
      index >= 0 && index < this._leaves.length,
      SDKErrorCode.INVALID_CONFIG,
      `Invalid leaf index: ${index}`
    );

    const proof: MerkleProof = {
      siblings: [],
      indices: [],
      root: this.root,
    };

    let currentIndex = index;
    
    // Collect siblings from each level
    for (let level = 0; level < this._layers.length - 1; level++) {
      const layer = this._layers[level];
      const isRightNode = currentIndex % 2 === 1;
      const siblingIndex = isRightNode ? currentIndex - 1 : currentIndex + 1;
      
      if (siblingIndex < layer.length) {
        proof.siblings.push(layer[siblingIndex]);
        proof.indices.push(siblingIndex);
      }
      
      currentIndex = Math.floor(currentIndex / 2);
    }

    return proof;
  }

  /**
   * Verify a Merkle proof
   */
  verifyProof(leaf: Buffer, proof: MerkleProof): boolean {
    try {
      // Hash leaf if needed
      const hashedLeaf = leaf.length === 32 ? leaf : this._hashFunction(leaf);
      
      // Reconstruct root from proof
      let computedHash = hashedLeaf;
      
      for (let i = 0; i < proof.siblings.length; i++) {
        const sibling = proof.siblings[i];
        const isRightNode = (proof.indices[i] % 2) === 1;
        
        if (isRightNode) {
          // sibling is left, our hash is right
          computedHash = this._hashFunction(
            Buffer.concat([sibling, computedHash])
          );
        } else {
          // our hash is left, sibling is right
          computedHash = this._hashFunction(
            Buffer.concat([computedHash, sibling])
          );
        }
      }

      return computedHash.equals(proof.root);
    } catch {
      return false;
    }
  }

  /**
   * Update a leaf at specific index
   */
  updateLeaf(index: number, newLeaf: Buffer): void {
    assert(
      index >= 0 && index < this._leaves.length,
      SDKErrorCode.INVALID_CONFIG,
      `Invalid leaf index: ${index}`
    );

    const hashedLeaf = newLeaf.length === 32 
      ? newLeaf 
      : this._hashFunction(newLeaf);

    this._leaves[index] = hashedLeaf;

    // Rebuild tree from the changed leaf
    this._layers[0][index] = hashedLeaf;
    this._rebuildFromLevel(0);
  }

  /**
   * Insert a new leaf
   */
  insert(leaf: Buffer): number {
    const hashedLeaf = leaf.length === 32 
      ? leaf 
      : this._hashFunction(leaf);

    // Add leaf to first layer
    this._leaves.push(hashedLeaf);
    
    if (this._layers.length === 0) {
      this._layers.push([hashedLeaf]);
    } else {
      this._layers[0].push(hashedLeaf);
    }

    // Rebuild from level 0
    this._rebuildFromLevel(0);

    return this._leaves.length - 1;
  }

  /**
   * Calculate the depth needed for n leaves
   */
  private _calculateDepth(n: number): number {
    let depth = 0;
    let size = 1;
    
    while (size < n) {
      size *= 2;
      depth++;
    }
    
    return depth;
  }

  /**
   * Build the tree from leaves
   */
  private _buildTree(): void {
    if (this._leaves.length === 0) {
      this._layers = [[Buffer.alloc(32)]];
      return;
    }

    this._layers = [this._leaves.map(l => Buffer.from(l))];

    let currentLayer = this._layers[0];
    
    while (currentLayer.length > 1) {
      const nextLayer: Buffer[] = [];
      
      for (let i = 0; i < currentLayer.length; i += 2) {
        const left = currentLayer[i];
        const right = i + 1 < currentLayer.length ? currentLayer[i + 1] : left;
        
        const combined = Buffer.concat([left, right]);
        nextLayer.push(this._hashFunction(combined));
      }
      
      this._layers.push(nextLayer);
      currentLayer = nextLayer;
    }
  }

  /**
   * Rebuild tree from a specific level
   */
  private _rebuildFromLevel(level: number): void {
    for (let i = level + 1; i < this._layers.length; i++) {
      const prevLayer = this._layers[i - 1];
      const currentLayer: Buffer[] = [];
      
      for (let j = 0; j < prevLayer.length; j += 2) {
        const left = prevLayer[j];
        const right = j + 1 < prevLayer.length ? prevLayer[j + 1] : left;
        
        const combined = Buffer.concat([left, right]);
        currentLayer.push(this._hashFunction(combined));
      }
      
      this._layers[i] = currentLayer;
    }
  }

  /**
   * Poseidon hash (simplified placeholder)
   */
  private _poseidonHash(data: Buffer): Buffer {
    // Simplified Poseidon-like hash
    // For production, use a proper ZK-friendly hash implementation
    return hashSHA256(data);
  }

  /**
   * Convert tree to JSON for serialization
   */
  toJSON(): { root: string; depth: number; leaves: number } {
    return {
      root: this.root.toString('hex'),
      depth: this._depth,
      leaves: this._leaves.length,
    };
  }

  /**
   * Create tree from JSON
   */
  static fromJSON(json: { root: string; depth: number; leaves: number }): MerkleTree {
    // This is a placeholder - full implementation would reconstruct the tree
    throw new SDKError(
      SDKErrorCode.NOT_IMPLEMENTED,
      'MerkleTree.fromJSON not yet implemented'
    );
  }
}

/**
 * Sparse Merkle Tree for large datasets
 */
export class SparseMerkleTree {
  private _defaultHash: Buffer;
  private _depth: number;
  private _nodes: Map<string, Buffer>;

  constructor(depth: number = 32, defaultHash?: Buffer) {
    this._depth = depth;
    this._defaultHash = defaultHash || hashSHA256(Buffer.alloc(32));
    this._nodes = new Map();
  }

  /**
   * Get the root of the tree
   */
  get root(): Buffer {
    return this._getNode(this._getPath(0));
  }

  /**
   * Get value at key
   */
  get(key: Buffer): Buffer {
    const path = this._getPath(this._keyToIndex(key));
    return this._getNode(path);
  }

  /**
   * Set value at key
   */
  set(key: Buffer, value: Buffer): void {
    const index = this._keyToIndex(key);
    const path = this._getPath(index);
    
    // Set leaf
    const leafPath = [...path, 0]; // 0 for leaf
    this._nodes.set(leafPath.join(','), value);
    
    // Update internal nodes
    for (let i = path.length - 1; i >= 0; i--) {
      const currentPath = path.slice(0, i + 1);
      const leftChild = this._getNode([...currentPath, 0]);
      const rightChild = this._getNode([...currentPath, 1]);
      
      const combined = Buffer.concat([leftChild, rightChild]);
      const parentHash = hashSHA256(combined);
      
      this._nodes.set(currentPath.join(','), parentHash);
    }
  }

  /**
   * Generate proof for key
   */
  generateProof(key: Buffer): MerkleProof {
    const index = this._keyToIndex(key);
    const path = this._getPath(index);
    
    const siblings: Buffer[] = [];
    const indices: number[] = [];
    
    for (let i = 0; i < this._depth; i++) {
      const siblingBit = (index >> (this._depth - 1 - i)) & 1;
      const siblingPath = [...path.slice(0, i), siblingBit];
      const siblingNode = this._nodes.get(siblingPath.join(','));
      
      if (siblingNode) {
        siblings.push(siblingNode);
        indices.push(siblingBit);
      } else {
        siblings.push(this._defaultHash);
        indices.push(siblingBit);
      }
    }

    return {
      siblings,
      indices,
      root: this.root,
    };
  }

  /**
   * Verify proof
   */
  verify(key: Buffer, value: Buffer, proof: MerkleProof): boolean {
    let computedHash = hashSHA256(value);
    
    for (let i = 0; i < proof.siblings.length; i++) {
      const sibling = proof.siblings[i];
      const isRightBit = (proof.indices[i] & 1) === 1;
      
      if (isRightBit) {
        computedHash = hashSHA256(Buffer.concat([sibling, computedHash]));
      } else {
        computedHash = hashSHA256(Buffer.concat([computedHash, sibling]));
      }
    }

    return computedHash.equals(proof.root);
  }

  /**
   * Convert key to index
   */
  private _keyToIndex(key: Buffer): number {
    // Use first 4 bytes as index (supports up to 2^32 leaves)
    return key.readUInt32BE(0);
  }

  /**
   * Get path for index
   */
  private _getPath(index: number): number[] {
    const path: number[] = [];
    
    for (let i = 0; i < this._depth; i++) {
      const bit = (index >> (this._depth - 1 - i)) & 1;
      path.push(bit);
    }
    
    return path;
  }

  /**
   * Get node at path
   */
  private _getNode(path: number[]): Buffer {
    const key = path.join(',');
    
    if (this._nodes.has(key)) {
      return this._nodes.get(key)!;
    }
    
    // Return default hash for non-existent nodes
    return this._defaultHash;
  }
}

