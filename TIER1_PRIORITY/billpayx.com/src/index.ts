/**
 * Stealth Payment Gateway - Main Entry Point
 * 
 * @module @thegit/stealth-gateway
 * @description Stealth Payment Gateway for private Solana payments
 * @version 1.0.0
 * @author thegit.network
 * @license MIT
 */

// ============================================================================
// Core Stealth Address Modules
// ============================================================================

export { 
  StealthKeyManager, 
  ScanResult as KeyScanResult 
} from './stealth/keys';

export { 
  PaymentScanner, 
  createScanner, 
  exportStealthPrivateKey,
  type DetectedPayment,
  type ScanOptions,
  type ScanResult,
} from './stealth/scan';

// ============================================================================
// API Server
// ============================================================================

export { 
  default as app,
  app as apiApp,
  scanners,
  keyManager 
} from './api/server';

// ============================================================================
// Types
// ============================================================================

/**
 * Payment status enum
 */
export enum PaymentStatus {
  PENDING = 'pending',
  DETECTED = 'detected',
  CONFIRMED = 'confirmed',
  EXPIRED = 'expired',
  FAILED = 'failed',
}

/**
 * Supported currencies
 */
export enum Currency {
  SOL = 'SOL',
  USDC = 'USDC',
  USDT = 'USDT',
  BONK = 'BONK',
}

/**
 * Gateway configuration
 */
export interface GatewayConfig {
  /** Solana network to use */
  network: 'mainnet-beta' | 'devnet' | 'testnet';
  /** RPC endpoint URL */
  rpcUrl: string;
  /** Merchant's private key (base58 encoded) */
  merchantKey: string;
  /** Stealth program ID on Solana */
  programId?: string;
}

/**
 * Payment request parameters
 */
export interface PaymentParams {
  /** Payment amount */
  amount: number;
  /** Currency code */
  currency: Currency | string;
  /** Merchant order ID */
  orderId: string;
  /** Payment expiration in minutes */
  expiresIn?: number;
  /** Customer email for notifications */
  customerEmail?: string;
  /** Payment description */
  description?: string;
  /** Metadata for the payment */
  metadata?: Record<string, unknown>;
}

/**
 * Payment request response
 */
export interface PaymentRequest {
  /** Unique payment ID */
  paymentId: string;
  /** Stealth address for the payment */
  stealthAddress: string;
  /** Ephemeral public key */
  ephemeralPublicKey: string;
  /** View tag for scanning */
  viewTag: number;
  /** Payment amount */
  amount: number;
  /** Currency */
  currency: string;
  /** Order ID */
  orderId: string;
  /** Payment URL */
  url: string;
  /** QR code data URL */
  qrCode: string;
  /** Expiration timestamp */
  expiresAt: Date;
  /** Current status */
  status: PaymentStatus;
}

/**
 * Payment status response
 */
export interface PaymentStatusResponse {
  /** Payment ID */
  paymentId: string;
  /** Current status */
  status: PaymentStatus;
  /** Stealth address */
  stealthAddress?: string;
  /** Amount paid */
  amount?: number;
  /** Currency */
  currency?: string;
  /** Transaction signature */
  transactionSignature?: string;
  /** Detection timestamp */
  detectedAt?: Date;
  /** Confirmation timestamp */
  confirmedAt?: Date;
}

/**
 * Withdrawal parameters
 */
export interface WithdrawParams {
  /** Amount to withdraw or 'all' */
  amount: number | 'all';
  /** Recipient wallet address */
  recipient: string;
  /** Currency to withdraw */
  currency: Currency | string;
  /** Priority fee in lamports */
  priorityFee?: number;
}

/**
 * Withdrawal result
 */
export interface WithdrawalResult {
  /** Withdrawal ID */
  withdrawalId: string;
  /** Transaction signature */
  signature: string;
  /** Amount withdrawn */
  amount: number;
  /** Recipient address */
  recipient: string;
  /** Status */
  status: 'pending' | 'confirmed' | 'failed';
  /** Timestamp */
  timestamp: Date;
}

// ============================================================================
// Main Gateway Class
// ============================================================================

/**
 * Stealth Payment Gateway
 * 
 * Main SDK class for merchant integration
 * 
 * @example
 * ```typescript
 * const gateway = new StealthGateway({
 *   network: 'mainnet-beta',
 *   rpcUrl: 'https://api.mainnet-beta.solana.com',
 *   merchantKey: process.env.MERCHANT_KEY
 * });
 * 
 * const payment = await gateway.createPayment({
 *   amount: 100,
 *   currency: 'USDC',
 *   orderId: 'order_123'
 * });
 * 
 * console.log(`Payment URL: ${payment.url}`);
 * ```
 */
export class StealthGateway {
  private config: GatewayConfig;
  private keyManager: StealthKeyManager;

  constructor(config: GatewayConfig) {
    this.config = config;
    this.keyManager = new StealthKeyManager();
  }

  /**
   * Create a new stealth payment request
   * @param params - Payment parameters
   * @returns Payment request details
   */
  async createPayment(params: PaymentParams): Promise<PaymentRequest> {
    const ephemeral = await this.keyManager.generateEphemeralKeys();
    const sharedSecret = await this.keyManager.deriveSharedSecret(
      ephemeral.privateKey,
      this.decodePublicKey(this.config.merchantKey)
    );
    const stealth = this.keyManager.generateStealthAddress(
      sharedSecret,
      this.decodePublicKey(this.config.merchantKey)
    );

    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const expiresAt = new Date(Date.now() + (params.expiresIn || 60) * 60000);

    return {
      paymentId,
      stealthAddress: stealth.address,
      ephemeralPublicKey: Buffer.from(ephemeral.publicKey).toString('base64'),
      viewTag: stealth.viewTag,
      amount: params.amount,
      currency: params.currency,
      orderId: params.orderId,
      url: `https://billpayx.com/pay/${paymentId}`,
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
        `https://billpayx.com/pay/${paymentId}`
      )}`,
      expiresAt,
      status: PaymentStatus.PENDING,
    };
  }

  /**
   * Check payment status
   * @param paymentId - Payment ID to check
   * @returns Payment status
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentStatusResponse> {
    // In production, query database or blockchain
    return {
      paymentId,
      status: PaymentStatus.PENDING,
    };
  }

  /**
   * Scan for incoming payments
   * @returns Array of detected payments
   */
  async scanForPayments(): Promise<PaymentStatusResponse[]> {
    // In production, use PaymentScanner to scan blockchain
    return [];
  }

  /**
   * Generate ZK proof of payment
   * @param paymentId - Payment ID
   * @returns Proof data
   */
  async generatePaymentProof(paymentId: string): Promise<{ valid: boolean; proof?: string }> {
    // In production, generate ZK proof
    return { valid: true };
  }

  /**
   * Withdraw accumulated funds
   * @param params - Withdrawal parameters
   * @returns Withdrawal result
   */
  async withdraw(params: WithdrawParams): Promise<WithdrawalResult> {
    // In production, create and send withdrawal transaction
    return {
      withdrawalId: `wd_${Date.now()}`,
      signature: 'mock_signature',
      amount: typeof params.amount === 'number' ? params.amount : 0,
      recipient: params.recipient,
      status: 'pending',
      timestamp: new Date(),
    };
  }

  /**
   * Get merchant balance across all stealth addresses
   * @returns Balance information
   */
  async getBalance(): Promise<{
    total: number;
    pending: number;
    available: number;
    addresses: Array<{ address: string; balance: number }>;
  }> {
    // In production, scan all stealth addresses
    return {
      total: 0,
      pending: 0,
      available: 0,
      addresses: [],
    };
  }

  private decodePublicKey(key: string): Uint8Array {
    // In production, properly decode base58 key
    return new Uint8Array(33);
  }
}

// ============================================================================
// Customer Wallet Class
// ============================================================================

/**
 * Customer-side stealth wallet interface
 * 
 * @example
 * ```typescript
 * const wallet = new StealthWallet(solanaWallet);
 * 
 * await wallet.sendStealthPayment({
 *   recipient: merchantStealthAddress,
 *   amount: 100,
 *   currency: 'USDC',
 *   memo: 'Payment for order #123'
 * });
 * ```
 */
export class StealthWallet {
  private wallet: { publicKey: { toBytes(): Uint8Array }; signTransaction(tx: unknown): Promise<unknown> };
  private keyManager: StealthKeyManager;

  constructor(wallet: { publicKey: { toBytes(): Uint8Array }; signTransaction(tx: unknown): Promise<unknown> }) {
    this.wallet = wallet;
    this.keyManager = new StealthKeyManager();
  }

  /**
   * Send a stealth payment
   * @param params - Payment parameters
   * @returns Transaction result
   */
  async sendStealthPayment(params: {
    recipient: string;
    amount: number;
    currency: string;
    memo?: string;
  }): Promise<{
    signature: string;
    stealthAddress: string;
    ephemeralPublicKey: string;
  }> {
    // Generate ephemeral keys
    const ephemeral = await this.keyManager.generateEphemeralKeys();
    
    // In production, create and send stealth transaction
    return {
      signature: 'mock_tx_signature',
      stealthAddress: params.recipient,
      ephemeralPublicKey: Buffer.from(ephemeral.publicKey).toString('base64'),
    };
  }

  /**
   * Generate ephemeral keys for payment
   * @returns Ephemeral key pair
   */
  async generateEphemeralKeys(): Promise<{
    privateKey: Uint8Array;
    publicKey: Uint8Array;
  }> {
    return this.keyManager.generateEphemeralKeys();
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Validate a stealth address format
 * @param address - Address to validate
 * @returns True if valid
 */
export function isValidStealthAddress(address: string): boolean {
  return address.startsWith('stealth_') && address.length >= 40;
}

/**
 * Convert stealth address to Solana public key format
 * @param stealthAddress - Stealth address
 * @returns Base58-encoded Solana public key
 */
export function stealthToSolanaAddress(stealthAddress: string): string {
  // In production, properly convert to Solana address format
  return stealthAddress.replace('stealth_', 'sol_');
}

/**
 * Get version information
 * @returns Version string
 */
export function getVersion(): string {
  return '1.0.0';
}

// ============================================================================
// Constants
// ============================================================================

/** Default RPC endpoints */
export const RPC_ENDPOINTS = {
  mainnet: 'https://api.mainnet-beta.solana.com',
  devnet: 'https://api.devnet.solana.com',
  testnet: 'https://api.testnet.solana.com',
};

/** Stealth program IDs (placeholder for actual deployment) */
export const PROGRAM_IDS = {
  mainnet: 'stealthPay111111111111111111111111111111111',
  devnet: 'stealthPay222222222222222222222222222222222',
};

/** Token mint addresses */
export const TOKEN_MINTS = {
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  BONK: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
};

// Default export
export default StealthGateway;
