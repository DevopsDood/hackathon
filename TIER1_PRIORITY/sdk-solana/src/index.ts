/**
 * SDK-Solana - Privacy-Focused SDK for Solana
 * 
 * A comprehensive privacy toolkit providing zero-knowledge primitives,
 * stealth addresses, and private transaction utilities.
 * 
 * @package @thegit/solana
 * @version 1.0.0
 * @license MIT
 */

// Export types
export * from './types';

// Export error utilities
export {
  SDKError,
  SDKErrorCode,
  assert,
  assertDefined,
  assertBufferLength,
  assertBigintRange,
  invalidConfig,
  invalidPublicKey,
  invalidPrivateKey,
  invalidCommitment,
  invalidProof,
  invalidStealthAddress,
  merkleProofFailed,
  rangeProofFailed,
  cryptoError,
  networkError,
  timeout,
  notImplemented,
  ok,
  fail,
  map,
  flatMap,
  unwrap,
  unwrapOr,
  isOk,
  isFail,
  Result,
} from './utils/errors';

// Export crypto utilities (excluding duplicates from ZK module)
export {
  randomBytes,
  randomBigint,
  hashSHA256,
  hashSHA512,
  hashRIPEMD160,
  hashDoubleSHA256,
  hashSHA256Concat,
  hashPoseidon,
  bufferToBigint,
  bigintToBuffer,
  pointAdd,
  pointMultiply,
  modInverse,
  pedersenCommitMulti,
  pedersenVerify,
  concatBuffers,
  xorBuffers,
  isZeroBuffer,
  constantTimeEquals,
  toBase58,
  fromBase58,
  toHex,
  fromHex,
  generateTestData,
  KeyPair,
  EncryptedData,
} from './utils/crypto';

// Export ZK module
export { ZKModule } from './zk';
export {
  MerkleTree,
  generateBlinding,
  pedersenCommit,
  verifyCommitment,
  generateRangeProof,
  verifyRangeProof,
  generateKnowledgeProof,
  verifyKnowledgeProof,
  poseidonHash,
  pedersenHash,
} from './zk';

// Export stealth module with all utilities
export { StealthModule } from './stealth';
export {
  generateStealthAddress,
  generatePaymentAddress,
  scanPayments,
  deriveViewKey,
  deriveScanKey,
  verifyStealthAddress,
  isStealthAddress,
  extractEphemeralKey,
  StealthUtils,
  generateEphemeralKey,
  EphemeralKeyPair,
} from './stealth';

// Export transfer module
export { TransferModule } from './transfer';
export {
  createPrivateTransfer,
  verifyTransfer,
  decodeTransfer,
} from './transfer';

// ============================================================================
// Main SDK Class
// ============================================================================

import {
  SDKConfig,
  Network,
} from './types';

import { ZKModule } from './zk';
import { StealthModule } from './stealth';
import { TransferModule } from './transfer';

/**
 * Solana Privacy SDK - Main entry point
 * 
 * Provides a unified interface for all privacy-focused operations on Solana:
 * - Zero-knowledge proofs and commitments
 * - Stealth address generation and scanning
 * - Private transfers with amount hiding
 * 
 * @example
 * ```typescript
 * const sdk = new SolanaPrivacySDK({
 *   network: 'devnet',
 *   rpcUrl: 'https://api.devnet.solana.com'
 * });
 * 
 * // Create a stealth address
 * const stealth = await sdk.stealth.generateAddress(recipientPublicKey);
 * 
 * // Generate a commitment
 * const commitment = sdk.zk.pedersenCommit(1000n, blindingFactor);
 * ```
 */
export class SolanaPrivacySDK {
  private config: SDKConfig;
  
  /**
   * ZK Module - Zero-knowledge primitives
   */
  readonly zk: ZKModule;
  
  /**
   * Stealth Module - Stealth address operations
   */
  readonly stealth: StealthModule;
  
  /**
   * Transfer Module - Private transfers
   */
  readonly transfer: TransferModule;
  
  /**
   * Create a new SolanaPrivacySDK instance
   * @param config - SDK configuration
   */
  constructor(config?: SDKConfig) {
    const defaultConfig: SDKConfig = {
      network: 'devnet',
      rpcUrl: 'https://api.devnet.solana.com',
      commitment: 'confirmed',
      timeout: 30000,
    };
    
    this.config = config ? { ...defaultConfig, ...config } : defaultConfig;
    
    // Initialize modules
    this.zk = new ZKModule();
    this.stealth = new StealthModule();
    this.transfer = new TransferModule();
  }
  
  /**
   * Get the configured network
   * @returns The network identifier
   */
  getNetwork(): Network {
    return this.config.network;
  }
  
  /**
   * Get the RPC URL
   * @returns The configured RPC endpoint URL
   */
  getRpcUrl(): string {
    return this.config.rpcUrl;
  }
  
  /**
   * Get the commitment level
   * @returns The transaction commitment level
   */
  getCommitment(): string | undefined {
    return this.config.commitment;
  }
  
  /**
   * Get the configured timeout
   * @returns The timeout in milliseconds
   */
  getTimeout(): number | undefined {
    return this.config.timeout;
  }
}

// ============================================================================
// Factory Functions
// ============================================================================

/**
 * Create SDK for mainnet-beta
 * @param rpcUrl - Optional custom RPC URL
 * @returns Configured SolanaPrivacySDK instance
 */
export function createMainnetSDK(rpcUrl?: string): SolanaPrivacySDK {
  return new SolanaPrivacySDK({
    network: 'mainnet-beta',
    rpcUrl: rpcUrl || 'https://api.mainnet-beta.solana.com',
  });
}

/**
 * Create SDK for devnet
 * @param rpcUrl - Optional custom RPC URL
 * @returns Configured SolanaPrivacySDK instance
 */
export function createDevnetSDK(rpcUrl?: string): SolanaPrivacySDK {
  return new SolanaPrivacySDK({
    network: 'devnet',
    rpcUrl: rpcUrl || 'https://api.devnet.solana.com',
  });
}

/**
 * Create SDK for testnet
 * @param rpcUrl - Optional custom RPC URL
 * @returns Configured SolanaPrivacySDK instance
 */
export function createTestnetSDK(rpcUrl?: string): SolanaPrivacySDK {
  return new SolanaPrivacySDK({
    network: 'testnet',
    rpcUrl: rpcUrl || 'https://api.testnet.solana.com',
  });
}

// ============================================================================
// Version Information
// ============================================================================

/**
 * SDK Version
 */
export const VERSION = '1.0.0';

/**
 * Package Name
 */
export const PACKAGE_NAME = '@thegit/solana';
