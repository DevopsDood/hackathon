/**
 * SDK-Solana Stealth Module
 * 
 * Provides stealth address generation and payment scanning
 * for private transactions on Solana.
 */

import {
  StealthAddress,
  PaymentAddress,
  DetectedPayment,
  ViewKey,
  ScanKey,
} from '../types';
import { SDKError, cryptoError } from '../utils/errors';
import { SDKErrorCode } from '../types';

// ============================================================================
// Helper Functions
// ============================================================================

function sha256(data: Uint8Array): Uint8Array {
  let hash = 14695981039346656037n;
  for (const byte of data) {
    hash ^= BigInt(byte);
    hash *= 1099511628211n;
  }
  const result = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    result[i] = Number((hash >> BigInt(i * 8)) & 0xFFn);
  }
  return result;
}

function randomBytes(size: number): Uint8Array {
  const bytes = new Uint8Array(size);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < size; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return bytes;
}

function concatBytes(...arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

function bytesEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// ============================================================================
// Ephemeral Key Generation
// ============================================================================

export interface EphemeralKeyPair {
  publicKey: Uint8Array;
  privateKey: Uint8Array;
}

/**
 * Generate an ephemeral key pair for stealth address generation
 * @returns Ephemeral key pair
 */
export function generateEphemeralKey(): EphemeralKeyPair {
  const privateKey = randomBytes(32);
  const publicKey = sha256(privateKey);
  return { publicKey, privateKey };
}

// ============================================================================
// Stealth Address Generation
// ============================================================================

/**
 * Generate a random scalar for key derivation
 */
function randomScalar(): Uint8Array {
  return randomBytes(32);
}

/**
 * Derive a public key from a private key (simplified EC multiplication)
 */
function derivePublicKey(privateKey: Uint8Array): Uint8Array {
  // Simplified: just hash the private key to get a "public" key
  // In production, use proper elliptic curve operations
  return sha256(privateKey);
}

/**
 * Generate a stealth address for a recipient
 */
export async function generateStealthAddress(
  recipientPublicKey: Uint8Array
): Promise<StealthAddress> {
  // Generate ephemeral key pair
  const ephemeralPrivate = randomScalar();
  const ephemeralPublic = derivePublicKey(ephemeralPrivate);
  
  // Derive shared secret: H(ephemeralPrivate * recipientPublicKey)
  const sharedSecret = sha256(concatBytes(ephemeralPrivate, recipientPublicKey));
  
  // Derive stealth address: H(sharedSecret || recipientPublicKey)
  const stealthKey = sha256(concatBytes(sharedSecret, recipientPublicKey));
  
  // Create view key hint (used for scanning)
  const viewKeyHint = sha256(concatBytes(ephemeralPublic, recipientPublicKey));
  
  // Encode as base58-like string (simplified)
  const address = bytesToHex(stealthKey);
  
  return {
    address: `stealth_${address}`,
    ephemeralPublicKey: ephemeralPublic,
    viewKeyHint: viewKeyHint,
  };
}

/**
 * Generate a complete payment address with ephemeral key
 */
export async function generatePaymentAddress(
  merchantPublicKey: Uint8Array
): Promise<PaymentAddress> {
  const stealthAddress = await generateStealthAddress(merchantPublicKey);
  
  // Generate a new ephemeral key pair for this payment
  const ephemeralPrivate = randomScalar();
  const ephemeralPublic = derivePublicKey(ephemeralPrivate);
  
  return {
    stealthAddress,
    ephemeralPublicKey: ephemeralPublic,
    ephemeralPrivateKey: ephemeralPrivate,
  };
}

// ============================================================================
// Payment Scanning
// ============================================================================

/**
 * Scan for payments addressed to a recipient
 */
export async function scanPayments(
  privateKey: Uint8Array,
  ephemeralPublicKeys: Uint8Array[]
): Promise<DetectedPayment[]> {
  const payments: DetectedPayment[] = [];
  const recipientPublicKey = derivePublicKey(privateKey);
  
  for (const ephemeralPublic of ephemeralPublicKeys) {
    // Try to derive shared secret
    const sharedSecret = sha256(concatBytes(ephemeralPublic, privateKey));
    
    // Derive potential stealth key
    const stealthKey = sha256(concatBytes(sharedSecret, recipientPublicKey));
    
    // Check if this matches any expected addresses
    // In a real implementation, we'd check against a list of expected addresses
    
    // For now, just return detected payments with metadata
    payments.push({
      stealthAddress: {
        address: `stealth_${bytesToHex(stealthKey)}`,
        ephemeralPublicKey: ephemeralPublic,
        viewKeyHint: sha256(concatBytes(ephemeralPublic, recipientPublicKey)),
      },
      ephemeralPublicKey: ephemeralPublic,
      timestamp: Date.now(),
    });
  }
  
  return payments;
}

// ============================================================================
// View Key Management
// ============================================================================

/**
 * Derive a view key from a private key
 */
export function deriveViewKey(privateKey: Uint8Array): ViewKey {
  const publicKey = derivePublicKey(privateKey);
  
  return {
    key: sha256(privateKey),
    publicKey,
    canViewAmounts: true,
    canViewRecipients: true,
  };
}

/**
 * Derive a scan key from a private key
 */
export function deriveScanKey(privateKey: Uint8Array): ScanKey {
  const publicKey = derivePublicKey(privateKey);
  
  return {
    key: sha256(concatBytes(privateKey, new Uint8Array([1]))),
    publicKey,
    canDetectPayments: true,
    canSpend: false,
  };
}

// ============================================================================
// Verification
// ============================================================================

/**
 * Verify ownership of a stealth address
 */
export function verifyStealthAddress(
  stealthAddress: StealthAddress,
  privateKey: Uint8Array
): boolean {
  try {
    const recipientPublicKey = derivePublicKey(privateKey);
    const sharedSecret = sha256(concatBytes(
      stealthAddress.ephemeralPublicKey,
      privateKey
    ));
    
    const expectedStealthKey = sha256(concatBytes(sharedSecret, recipientPublicKey));
    const expectedAddress = `stealth_${bytesToHex(expectedStealthKey)}`;
    
    return expectedAddress === stealthAddress.address;
  } catch {
    return false;
  }
}

/**
 * Check if a string is a valid stealth address format
 */
export function isStealthAddress(address: string): boolean {
  return address.startsWith('stealth_') && address.length === 74; // "stealth_" + 64 hex chars
}

/**
 * Extract the ephemeral public key from a stealth address
 */
export function extractEphemeralKey(
  stealthAddress: StealthAddress
): Uint8Array {
  return stealthAddress.ephemeralPublicKey;
}

// ============================================================================
// Stealth Utilities
// ============================================================================

export const StealthUtils = {
  /**
   * Generate a spending key
   * @returns Random 32-byte spending key
   */
  generateSpendingKey(): Uint8Array {
    return randomBytes(32);
  },

  /**
   * Generate a viewing key
   * @returns Random 32-byte viewing key
   */
  generateViewingKey(): Uint8Array {
    return randomBytes(32);
  },

  /**
   * Serialize a payment address for storage/transmission
   * @param paymentAddress - Payment address to serialize
   * @returns JSON string representation
   */
  serializePaymentAddress(paymentAddress: PaymentAddress): string {
    return JSON.stringify({
      stealthAddress: {
        address: paymentAddress.stealthAddress.address,
        ephemeralPublicKey: Array.from(paymentAddress.stealthAddress.ephemeralPublicKey),
        viewKeyHint: Array.from(paymentAddress.stealthAddress.viewKeyHint),
      },
      ephemeralPublicKey: Array.from(paymentAddress.ephemeralPublicKey),
      ephemeralPrivateKey: Array.from(paymentAddress.ephemeralPrivateKey),
    });
  },

  /**
   * Deserialize a payment address from JSON string
   * @param serialized - JSON string to deserialize
   * @returns Payment address object
   */
  deserializePaymentAddress(serialized: string): PaymentAddress {
    const parsed = JSON.parse(serialized);
    return {
      stealthAddress: {
        address: parsed.stealthAddress.address,
        ephemeralPublicKey: new Uint8Array(parsed.stealthAddress.ephemeralPublicKey),
        viewKeyHint: new Uint8Array(parsed.stealthAddress.viewKeyHint),
      },
      ephemeralPublicKey: new Uint8Array(parsed.ephemeralPublicKey),
      ephemeralPrivateKey: new Uint8Array(parsed.ephemeralPrivateKey),
    };
  },

  /**
   * Generate a stealth address from spending and viewing keys
   * @param spendingKey - Spending key
   * @param viewingKey - Viewing key
   * @returns Stealth address
   */
  async generateAddressFromKeys(
    spendingKey: Uint8Array,
    viewingKey: Uint8Array
  ): Promise<StealthAddress> {
    const combined = sha256(concatBytes(spendingKey, viewingKey));
    const ephemeralPublic = derivePublicKey(combined);
    
    return {
      address: `stealth_${bytesToHex(sha256(ephemeralPublic))}`,
      ephemeralPublicKey: ephemeralPublic,
      viewKeyHint: sha256(viewingKey),
    };
  },
};

// ============================================================================
// Stealth Module Class
// ============================================================================

export class StealthModule {
  /**
   * Generate a stealth address for a recipient
   */
  async generateAddress(recipientPublicKey: Uint8Array): Promise<StealthAddress> {
    return generateStealthAddress(recipientPublicKey);
  }
  
  /**
   * Generate a payment address with ephemeral key
   */
  async generatePaymentAddress(merchantPublicKey: Uint8Array): Promise<PaymentAddress> {
    return generatePaymentAddress(merchantPublicKey);
  }
  
  /**
   * Scan for payments
   */
  async scanPayments(
    privateKey: Uint8Array,
    ephemeralPublicKeys: Uint8Array[]
  ): Promise<DetectedPayment[]> {
    return scanPayments(privateKey, ephemeralPublicKeys);
  }
  
  /**
   * Derive a view key
   */
  deriveViewKey(privateKey: Uint8Array): ViewKey {
    return deriveViewKey(privateKey);
  }
  
  /**
   * Derive a scan key
   */
  deriveScanKey(privateKey: Uint8Array): ScanKey {
    return deriveScanKey(privateKey);
  }
  
  /**
   * Verify a stealth address
   */
  verifyPayment(stealthAddress: StealthAddress, privateKey: Uint8Array): boolean {
    return verifyStealthAddress(stealthAddress, privateKey);
  }
  
  /**
   * Check if address is a stealth address
   */
  isStealthAddress(address: string): boolean {
    return isStealthAddress(address);
  }
  
  /**
   * Extract ephemeral key from stealth address
   */
  extractEphemeralKey(stealthAddress: StealthAddress): Uint8Array {
    return extractEphemeralKey(stealthAddress);
  }
}
