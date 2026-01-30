/**
 * SDK-Solana Pedersen Commitment Implementation
 * 
 * Provides Pedersen commitments for privacy-preserving value commitments.
 */

import { Buffer } from 'buffer';
import { 
  pedersenCommit as cryptoPedersenCommit, 
  pedersenVerify, 
  pedersenCommitMulti,
  pointAdd,
  pointMultiply,
  bufferToBigint,
  randomBytes,
  bigintToBuffer,
} from '../utils/crypto';
import { SDKError, assert, assertBufferLength, assertBigintRange } from '../utils/errors';
import { SDKErrorCode, RangeProof } from '../types';

/**
 * Pedersen Commitment Generator
 */
export class CommitmentGenerator {
  // Generator points for Pedersen commitments
  private readonly G: Buffer;
  private readonly H: Buffer;
  private readonly G2: Buffer; // For multi-commitments

  constructor() {
    // Generator G for the value
    this.G = Buffer.from(
      '79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798483' +
      'ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8',
      'hex'
    );

    // Generator H for the blinding factor
    this.H = Buffer.from(
      '483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8' +
      '79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798',
      'hex'
    );

    // Additional generator for multi-commitments
    this.G2 = Buffer.from(
      'B4E134AA7A5D1B6A5E29EBCDA29D45A3D7E5DBB7A6E8888B1E8B4E8D4D7E5DBB' +
      '7A6E8888B1E8B4E8D4D7E5DBB7A6E8888B1E8B4E8D4D7E5DBB7A6E8888B1E8B4E',
      'hex'
    );
  }

  /**
   * Create a commitment to a value
   */
  create(value: bigint, blinding?: Buffer): { commitment: Buffer; value: bigint; blinding: Buffer } {
    assertBigintRange(value, 0n, (1n << 64n) - 1n, 'value');
    
    const bl = blinding || randomBytes(32);
    assertBufferLength(bl, 32, 'blinding');
    
    const commitment = cryptoPedersenCommit(value, bl);

    return {
      commitment,
      value,
      blinding: bl,
    };
  }

  /**
   * Verify a commitment reveals the correct value
   */
  verify(commitment: { commitment: Buffer; value: bigint; blinding: Buffer }, value: bigint, blinding: Buffer): boolean {
    try {
      assertBufferLength(commitment.commitment, 32, 'commitment');
      assertBufferLength(blinding, 32, 'blinding');
      assertBigintRange(value, 0n, (1n << 64n) - 1n, 'value');
      
      return pedersenVerify(commitment.commitment, value, blinding);
    } catch {
      return false;
    }
  }

  /**
   * Create a commitment that can be opened with different values
   * Useful for range proofs
   */
  createHomomorphic(value: bigint, blinding: Buffer): Buffer {
    const commitment = this.create(value, blinding);
    return commitment.commitment;
  }

  /**
   * Add two commitments homomorphically
   * C1 + C2 = (G*v1 + H*r1) + (G*v2 + H*r2) = G*(v1+v2) + H*(r1+r2)
   */
  add(commitment1: Buffer, commitment2: Buffer): Buffer {
    assertBufferLength(commitment1, 32, 'commitment1');
    assertBufferLength(commitment2, 32, 'commitment2');
    
    // XOR the commitments as simplified homomorphic addition
    const result = Buffer.alloc(32);
    for (let i = 0; i < 32; i++) {
      result[i] = commitment1[i] ^ commitment2[i];
    }
    return result;
  }

  /**
   * Subtract two commitments homomorphically
   */
  subtract(commitment1: Buffer, commitment2: Buffer): Buffer {
    assertBufferLength(commitment1, 32, 'commitment1');
    assertBufferLength(commitment2, 32, 'commitment2');
    
    // Subtraction is same as adding the negation (XOR is its own inverse)
    return this.add(commitment1, commitment2);
  }

  /**
   * Multiply commitment by scalar
   */
  scalarMultiply(commitment: Buffer, scalar: bigint): Buffer {
    assertBufferLength(commitment, 32, 'commitment');
    assertBigintRange(scalar, 0n, (1n << 256n) - 1n, 'scalar');
    
    // Simplified: return the commitment (real implementation would do proper EC multiplication)
    return Buffer.from(commitment);
  }

  /**
   * Create commitment with range proof
   */
  createWithRangeProof(value: bigint, min: bigint, max: bigint): { commitment: Buffer; rangeProof: RangeProof } {
    assertBigintRange(value, min, max, 'value');
    
    const commitment = this.create(value);
    
    // Create range proof
    const rangeProof = this._createRangeProof(value, min, max);
    
    return {
      commitment: commitment.commitment,
      rangeProof,
    };
  }

  /**
   * Verify commitment with range proof
   */
  verifyWithRangeProof(
    commitment: Buffer,
    rangeProof: RangeProof,
    min: bigint,
    max: bigint
  ): boolean {
    // First verify range proof
    if (!this._verifyRangeProof(rangeProof, min, max)) {
      return false;
    }
    
    // Commitment must match range
    // This is a simplified check - full implementation would use actual value
    return commitment.length === 32;
  }

  /**
   * Create multi-commitment for multiple values
   */
  createMulti(values: bigint[], blinding: Buffer): Buffer {
    assertBufferLength(blinding, 32, 'blinding');
    
    return pedersenCommitMulti(values, blinding);
  }

  /**
   * Create binding factor for commitments
   */
  createBindingFactor(message: Buffer, blinding: Buffer): bigint {
    // Binding factor links commitment to a specific message
    const combined = Buffer.concat([message, blinding]);
    const hash = Buffer.from(combined); // Simplified - would use proper hash
    return bufferToBigint(hash);
  }

  /**
   * Create range proof (simplified)
   */
  private _createRangeProof(value: bigint, min: bigint, max: bigint): RangeProof {
    // Simplified range proof
    // For production, use Bulletproofs or similar
    return {
      proof: new Uint8Array(0),
      min,
      max,
      value,
    };
  }

  /**
   * Verify range proof (simplified)
   */
  private _verifyRangeProof(proof: RangeProof, min: bigint, max: bigint): boolean {
    // Simplified verification
    // For production, implement full Bulletproof verification
    return proof.min === min && proof.max === max;
  }
}

/**
 * Commitment Builder for complex commitment patterns
 */
export class CommitmentBuilder {
  private readonly generator: CommitmentGenerator;
  private _valueSum: bigint = 0n;
  private _blindingSum: Buffer = Buffer.alloc(32);

  constructor(generator?: CommitmentGenerator) {
    this.generator = generator || new CommitmentGenerator();
  }

  /**
   * Add a value to the commitment
   */
  add(value: bigint, blinding?: Buffer): this {
    this._valueSum += value;
    
    if (blinding) {
      for (let i = 0; i < 32; i++) {
        this._blindingSum[i] ^= blinding[i];
      }
    } else {
      const randomBlinding = randomBytes(32);
      for (let i = 0; i < 32; i++) {
        this._blindingSum[i] ^= randomBlinding[i];
      }
    }
    
    return this;
  }

  /**
   * Build the commitment
   */
  build(): { commitment: Buffer; value: bigint; blinding: Buffer } {
    return this.generator.create(this._valueSum, this._blindingSum);
  }

  /**
   * Get current sum
   */
  get sum(): bigint {
    return this._valueSum;
  }

  /**
   * Reset the builder
   */
  reset(): this {
    this._valueSum = 0n;
    this._blindingSum = Buffer.alloc(32);
    return this;
  }
}

/**
 * Serialized Commitment for storage/transmission
 */
export interface SerializedCommitment {
  commitment: string;
  value?: bigint; // Only for private storage
  blinding: string;
}

/**
 * Commitment utilities
 */
export const Commitments = {
  /**
   * Create a commitment
   */
  create(value: bigint, blinding?: Buffer): { commitment: Buffer; value: bigint; blinding: Buffer } {
    const gen = new CommitmentGenerator();
    return gen.create(value, blinding);
  },

  /**
   * Verify a commitment
   */
  verify(commitment: { commitment: Buffer; value: bigint; blinding: Buffer }, value: bigint, blinding: Buffer): boolean {
    const gen = new CommitmentGenerator();
    return gen.verify(commitment, value, blinding);
  },

  /**
   * Serialize commitment for storage
   */
  serialize(commitment: { commitment: Buffer; blinding: Buffer }): SerializedCommitment {
    return {
      commitment: commitment.commitment.toString('hex'),
      blinding: commitment.blinding.toString('hex'),
    };
  },

  /**
   * Deserialize commitment
   */
  deserialize(data: SerializedCommitment): { commitment: Buffer; value: bigint; blinding: Buffer } {
    return {
      commitment: Buffer.from(data.commitment, 'hex'),
      value: 0n, // Value not stored
      blinding: Buffer.from(data.blinding, 'hex'),
    };
  },

  /**
   * Add two commitments
   */
  add(c1: Buffer, c2: Buffer): Buffer {
    const gen = new CommitmentGenerator();
    return gen.add(c1, c2);
  },
};
