/**
 * SDK-Solana Stealth Module Types
 */

// ============================================================================
// Stealth Address Types
// ============================================================================

export interface StealthAddress {
  address: string;
  ephemeralPublicKey: Uint8Array;
  viewKeyHint: Uint8Array;
  metadata?: StealthAddressMetadata;
}

export interface StealthAddressMetadata {
  amount?: bigint;
  token?: string;
  memo?: string;
}

export interface PaymentAddress {
  stealthAddress: StealthAddress;
  ephemeralPublicKey: Uint8Array;
  ephemeralPrivateKey: Uint8Array;
}

export interface DetectedPayment {
  stealthAddress: StealthAddress;
  ephemeralPublicKey: Uint8Array;
  amount?: bigint;
  token?: string;
  timestamp: number;
  memo?: string;
}

export interface ViewKey {
  key: Uint8Array;
  publicKey: Uint8Array;
  canViewAmounts: boolean;
  canViewRecipients: boolean;
}

export interface ScanKey {
  key: Uint8Array;
  publicKey: Uint8Array;
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
  feePayer?: Uint8Array;
}

export interface PrivateTransaction {
  transaction: Uint8Array;
  proof?: RangeProof;
  commitment?: ZKCommitmentData;
  ephemeralKey?: Uint8Array;
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
  sender: Uint8Array;
  recipient: Uint8Array;
  amount: bigint;
  token: string;
  memo?: string;
  timestamp: number;
}

// ============================================================================
// ZK Types
// ============================================================================

export interface MerkleProof {
  siblings: Uint8Array[];
  indices: number[];
  root: Uint8Array;
}

export interface ZKCommitmentData {
  commitment: Uint8Array;
  value: bigint;
  blinding: Uint8Array;
}

export interface RangeProof {
  proof: Uint8Array;
  min: bigint;
  max: bigint;
  value: bigint;
}

