/**
 * Payment Scanner for Stealth Addresses
 * 
 * This module handles scanning the blockchain for stealth payments
 * using view tags for efficient filtering.
 */

import * as secp from '@noble/secp256k1';
import { sha256 } from '@noble/hashes/sha256';
import { StealthKeyManager } from './keys';

export interface DetectedPayment {
  /** Unique payment ID */
  paymentId: string;
  /** Stealth address that received the payment */
  stealthAddress: string;
  /** Ephemeral public key used for the payment */
  ephemeralPublicKey: Uint8Array;
  /** View tag for efficient scanning */
  viewTag: number;
  /** Payment amount in smallest unit */
  amount: bigint;
  /** Token mint address (undefined for SOL) */
  tokenMint?: string;
  /** Block number when payment was detected */
  blockNumber: number;
  /** Transaction signature */
  transactionSignature: string;
  /** Timestamp of detection */
  detectedAt: Date;
}

export interface ScanOptions {
  /** Start scanning from this block */
  fromBlock?: number;
  /** End scanning at this block (optional) */
  toBlock?: number;
  /** Token mint to scan for (undefined for SOL) */
  tokenMint?: string;
  /** Minimum amount to filter (optional) */
  minAmount?: bigint;
  /** Maximum results to return */
  limit?: number;
}

export interface ScanResult {
  /** Array of detected payments */
  payments: DetectedPayment[];
  /** Number of blocks scanned */
  blocksScanned: number;
  /** Last block scanned */
  lastBlock: number;
  /** Scan duration in milliseconds */
  scanDuration: number;
}

/**
 * PaymentScanner class for detecting stealth payments on the blockchain
 */
export class PaymentScanner {
  private keyManager: StealthKeyManager;
  private merchantPrivateKey: Uint8Array;
  private merchantPublicKey: Uint8Array;
  private rpcUrl: string;
  private knownViewTags: Set<number> = new Set();
  private detectedPayments: Map<string, DetectedPayment> = new Map();

  /**
   * Create a new PaymentScanner instance
   * @param merchantPrivateKey - The merchant's master private key
   * @param rpcUrl - Solana RPC endpoint URL
   */
  constructor(merchantPrivateKey: Uint8Array, rpcUrl: string = 'https://api.mainnet-beta.solana.com') {
    this.keyManager = new StealthKeyManager();
    this.merchantPrivateKey = merchantPrivateKey;
    this.merchantPublicKey = secp.getPublicKey(merchantPrivateKey);
    this.rpcUrl = rpcUrl;
  }

  /**
   * Derive the view tag for a given ephemeral public key
   * This allows the merchant to quickly check if a payment is for them
   * @param ephemeralPublicKey - The ephemeral public key from the transaction
   * @returns The view tag (first byte of the shared secret hash)
   */
  async deriveViewTag(ephemeralPublicKey: Uint8Array): Promise<number> {
    // Compute shared secret using ECDH: S = merchantPrivateKey * ephemeralPublicKey
    const sharedPoint = secp.getSharedSecret(this.merchantPrivateKey, ephemeralPublicKey);
    const sharedSecret = sha256(sharedPoint);
    return sharedSecret[0];
  }

  /**
   * Derive the stealth private key for a detected payment
   * @param ephemeralPublicKey - The ephemeral public key from the transaction
   * @returns The stealth private key that can spend the funds
   */
  async deriveStealthPrivateKey(ephemeralPublicKey: Uint8Array): Promise<Uint8Array> {
    // Compute shared secret
    const sharedPoint = secp.getSharedSecret(this.merchantPrivateKey, ephemeralPublicKey);
    const sharedSecret = sha256(sharedPoint);
    
    // Derive offset: offset = H(S)
    const offset = sha256(sharedSecret);
    
    // Compute stealth private key: p = m + H(S) mod n
    // where m is the merchant's master private key
    const stealthPrivateKey = secp.utils.mod(
      secp.utils.bytesToNumberBE(this.merchantPrivateKey) + 
      secp.utils.bytesToNumberBE(offset),
      secp.CURVE.n
    );
    
    return secp.utils.numberToBytesBE(stealthPrivateKey, 32);
  }

  /**
   * Verify that a stealth address belongs to this merchant
   * @param stealthAddress - The stealth address to verify
   * @param ephemeralPublicKey - The ephemeral public key
   * @returns True if the address belongs to this merchant
   */
  async verifyStealthAddress(
    stealthAddress: string, 
    ephemeralPublicKey: Uint8Array
  ): Promise<boolean> {
    try {
      // Derive expected stealth address
      const sharedPoint = secp.getSharedSecret(this.merchantPrivateKey, ephemeralPublicKey);
      const sharedSecret = sha256(sharedPoint);
      const { address: expectedAddress } = this.keyManager.generateStealthAddress(
        sharedSecret,
        this.merchantPublicKey
      );
      
      return stealthAddress === expectedAddress;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if a payment with the given view tag could be for this merchant
   * This is a fast pre-filter before doing full verification
   * @param viewTag - The view tag to check
   * @returns True if the view tag matches
   */
  async checkViewTag(viewTag: number, ephemeralPublicKey: Uint8Array): Promise<boolean> {
    const expectedTag = await this.deriveViewTag(ephemeralPublicKey);
    return viewTag === expectedTag;
  }

  /**
   * Scan for payments (mock implementation for demonstration)
   * In production, this would query Solana RPC for transactions
   * @param options - Scan options
   * @returns Scan results with detected payments
   */
  async scanForPayments(options: ScanOptions = {}): Promise<ScanResult> {
    const startTime = Date.now();
    const payments: DetectedPayment[] = [];
    
    // This is a mock implementation
    // In production, this would:
    // 1. Query Solana RPC for transactions
    // 2. Filter by view tags
    // 3. Verify stealth addresses
    // 4. Return detected payments
    
    const mockFromBlock = options.fromBlock || 1000000;
    const mockToBlock = options.toBlock || mockFromBlock + 1000;
    const blocksScanned = mockToBlock - mockFromBlock;
    
    // Return mock results for demonstration
    const scanDuration = Date.now() - startTime;
    
    return {
      payments,
      blocksScanned,
      lastBlock: mockToBlock,
      scanDuration,
    };
  }

  /**
   * Process a batch of transactions for potential stealth payments
   * @param transactions - Array of transaction data to process
   * @returns Array of detected payments
   */
  async processTransactions(
    transactions: Array<{
      signature: string;
      ephemeralPublicKey: Uint8Array;
      stealthAddress: string;
      amount: bigint;
      blockNumber: number;
      tokenMint?: string;
    }>
  ): Promise<DetectedPayment[]> {
    const detected: DetectedPayment[] = [];
    
    for (const tx of transactions) {
      // Check view tag first (fast filter)
      const viewTag = await this.deriveViewTag(tx.ephemeralPublicKey);
      
      // Verify the stealth address belongs to us
      const isValid = await this.verifyStealthAddress(
        tx.stealthAddress,
        tx.ephemeralPublicKey
      );
      
      if (isValid) {
        const payment: DetectedPayment = {
          paymentId: this.generatePaymentId(tx.signature),
          stealthAddress: tx.stealthAddress,
          ephemeralPublicKey: tx.ephemeralPublicKey,
          viewTag,
          amount: tx.amount,
          tokenMint: tx.tokenMint,
          blockNumber: tx.blockNumber,
          transactionSignature: tx.signature,
          detectedAt: new Date(),
        };
        
        this.detectedPayments.set(payment.paymentId, payment);
        detected.push(payment);
      }
    }
    
    return detected;
  }

  /**
   * Get all detected payments
   * @returns Array of all detected payments
   */
  getDetectedPayments(): DetectedPayment[] {
    return Array.from(this.detectedPayments.values());
  }

  /**
   * Get a specific payment by ID
   * @param paymentId - The payment ID
   * @returns The payment or undefined if not found
   */
  getPayment(paymentId: string): DetectedPayment | undefined {
    return this.detectedPayments.get(paymentId);
  }

  /**
   * Get the total balance across all detected stealth addresses
   * @returns Total balance in smallest unit
   */
  getTotalBalance(): bigint {
    let total = BigInt(0);
    for (const payment of this.detectedPayments.values()) {
      total += payment.amount;
    }
    return total;
  }

  /**
   * Generate a unique payment ID from a transaction signature
   * @param signature - Transaction signature
   * @returns Unique payment ID
   */
  private generatePaymentId(signature: string): string {
    const hash = sha256(new TextEncoder().encode(signature));
    return 'pay_' + Buffer.from(hash.slice(0, 16)).toString('hex');
  }
}

/**
 * Create a payment scanner instance from a merchant keypair
 * @param privateKeyBase58 - Base58-encoded merchant private key
 * @param rpcUrl - Solana RPC endpoint URL
 * @returns PaymentScanner instance
 */
export function createScanner(
  privateKeyBase58: string, 
  rpcUrl?: string
): PaymentScanner {
  // In production, decode base58 private key
  const privateKey = new Uint8Array(32);
  // Mock: fill with random bytes for now
  for (let i = 0; i < 32; i++) {
    privateKey[i] = Math.floor(Math.random() * 256);
  }
  
  return new PaymentScanner(privateKey, rpcUrl);
}

/**
 * Utility to export stealth address private key for importing into a wallet
 * @param scanner - PaymentScanner instance
 * @param ephemeralPublicKey - Ephemeral public key from the payment
 * @returns Base58-encoded private key
 */
export async function exportStealthPrivateKey(
  scanner: PaymentScanner,
  ephemeralPublicKey: Uint8Array
): Promise<string> {
  const privateKey = await scanner.deriveStealthPrivateKey(ephemeralPublicKey);
  // In production, convert to base58
  return 'stealth_key_' + Buffer.from(privateKey.slice(0, 8)).toString('hex') + '...';
}
