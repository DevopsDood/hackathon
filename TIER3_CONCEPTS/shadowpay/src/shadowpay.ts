/**
 * ShadowPay - Main SDK Class
 * 
 * Orchestrates all ShadowPay functionality:
 * - Stealth addresses
 * - ZK proofs
 * - Payment creation and verification
 * - Balance management
 */

import { 
  ShadowPayStealth, 
  createStealthTransaction,
  type StealthAddress,
  type FullStealthAddress,
  type ScanResult,
  type PaymentNote,
  type StealthTransaction 
} from './stealth/stealth-address';

import { 
  ShadowPayZK, 
  type BalanceProof, 
  type PaymentProof,
  type PaymentNote as ZKPaymentNote 
} from './zk/balance-proof';

// Configuration
export interface ShadowPayConfig {
  network: 'mainnet' | 'devnet' | 'localnet';
  rpcUrl?: string;
  commitmentProgramId?: string;
  merkleTreeAddress?: string;
}

// Payment types
export interface PaymentIntent {
  amount: bigint;
  recipientViewKey: Uint8Array;
  memo?: string;
  hideAmount?: boolean;
  hideRecipient?: boolean;
  fee?: bigint;
}

export interface PaymentResult {
  proofId: string;
  transaction: StealthTransaction;
  stealthAddress: FullStealthAddress;
  timestamp: number;
}

export interface WithdrawalResult {
  withdrawalId: string;
  amount: bigint;
  targetAddress: string;
  stealthAddress: StealthAddress;
  timestamp: number;
}

export interface BalanceResult {
  totalBalance: bigint;
  balanceProof: BalanceProof;
  noteCount: number;
}

/**
 * Main ShadowPay SDK Class
 */
export class ShadowPay {
  private config: ShadowPayConfig;
  private stealth: ShadowPayStealth;
  private zk: ShadowPayZK;
  private connection: any; // Solana connection
  private wallet: any;     // Wallet adapter

  constructor(config: ShadowPayConfig, wallet?: any) {
    this.config = config;
    this.stealth = new ShadowPayStealth();
    this.zk = new ShadowPayZK();
    this.wallet = wallet;

    // Initialize Solana connection if RPC provided
    if (config.rpcUrl) {
      this.connection = {
        getAccountInfo: async () => null,
        getRecentBlockhash: async () => ({ blockhash: 'mock' }),
        confirmTransaction: async () => ({ value: { err: null } }),
      };
    }
  }

  /**
   * Initialize the SDK with a wallet
   */
  async initialize(): Promise<void> {
    if (this.wallet) {
      // Set up wallet connection
      console.log('ShadowPay initialized with wallet');
    }
  }

  /**
   * Generate a new key pair for receiving payments
   */
  async generateReceiveKeys(): Promise<{ viewKey: Uint8Array; spendKey: Uint8Array }> {
    const viewKey = secp.utils.randomPrivateKey();
    const spendKey = secp.utils.randomPrivateKey();
    return { viewKey, spendKey };
  }

  /**
   * Create an anonymous payment
   */
  async createPayment(intent: PaymentIntent): Promise<PaymentResult> {
    // Generate stealth address for recipient
    const stealthAddress = await this.stealth.generateStealthAddress(
      intent.recipientViewKey,
      intent.amount
    );

    // Create transaction
    const { transaction } = await createStealthTransaction(
      this.stealth,
      intent.recipientViewKey,
      intent.amount
    );

    // Generate proof ID
    const proofId = this.generateProofId();

    return {
      proofId,
      transaction: {
        ...transaction,
        ephemeralPublicKey: new Uint8Array(), // Set from ephemeral keys
      },
      stealthAddress,
      timestamp: Date.now(),
    };
  }

  /**
   * Scan for incoming payments
   */
  async scanForPayments(
    scanKey: Uint8Array,
    recentTransactions?: StealthTransaction[]
  ): Promise<ScanResult[]> {
    // In production, fetch recent transactions from blockchain
    const transactions = recentTransactions || [];
    return this.stealth.scanForPayments(scanKey, transactions);
  }

  /**
   * Get balance with ZK proof
   */
  async getBalance(notes: PaymentNote[]): Promise<BalanceResult> {
    const totalBalance = notes.reduce((sum, n) => sum + n.amount, 0n);
    const balanceProof = await this.zk.generateBalanceProof(notes, 0n);

    return {
      totalBalance,
      balanceProof,
      noteCount: notes.length,
    };
  }

  /**
   * Prove sufficient balance without revealing actual balance
   */
  async proveBalance(
    notes: PaymentNote[],
    minRequired: bigint
  ): Promise<BalanceProof> {
    return this.zk.generateBalanceProof(notes, minRequired);
  }

  /**
   * Verify a balance proof
   */
  async verifyBalanceProof(proof: BalanceProof, minRequired: bigint): Promise<boolean> {
    return this.zk.verifyBalanceProof(proof, minRequired);
  }

  /**
   * Create a payment with change (spending notes)
   */
  async createPaymentWithChange(
    inputNotes: PaymentNote[],
    outputs: Array<{ viewKey: Uint8Array; amount: bigint }>,
    fee: bigint = 1000n
  ): Promise<PaymentProof> {
    const totalOutput = outputs.reduce((sum, o) => sum + o.amount, 0n);

    // Convert outputs to payment notes
    const outputNotes: ZKPaymentNote[] = outputs.map(o => ({
      commitment: new Uint8Array(32), // Will be set by proof generation
      amount: o.amount,
      randomness: secp.utils.randomPrivateKey(),
    }));

    // Convert input notes
    const zkInputNotes = inputNotes.map(n => ({
      commitment: n.commitment,
      amount: n.amount,
      randomness: n.randomness,
    }));

    // Get current Merkle root (mock)
    const merkleRoot = new Uint8Array(32).fill(0);

    // Generate payment proof
    return this.zk.generatePaymentProof(
      zkInputNotes,
      outputNotes,
      fee,
      merkleRoot
    );
  }

  /**
   * Withdraw to external address
   */
  async withdraw(
    notes: PaymentNote[],
    targetViewKey: Uint8Array,
    amount?: bigint
  ): Promise<WithdrawalResult> {
    const withdrawAmount = amount ?? notes.reduce((sum, n) => sum + n.amount, 0n);

    // Create stealth address for withdrawal
    const fullStealth = await this.stealth.generateStealthAddress(
      targetViewKey,
      withdrawAmount
    );

    // Generate withdrawal ID
    const withdrawalId = this.generateProofId();

    return {
      withdrawalId,
      amount: withdrawAmount,
      targetAddress: fullStealth.stealth.address,
      stealthAddress: fullStealth.stealth,
      timestamp: Date.now(),
    };
  }

  /**
   * Create a stealth address for receiving payments
   */
  async createStealthAddress(
    viewKey: Uint8Array,
    amount?: bigint
  ): Promise<FullStealthAddress> {
    return this.stealth.generateStealthAddress(viewKey, amount || 0n);
  }

  /**
   * Derive view key from address (for receiving)
   */
  async deriveViewKey(address: string): Promise<Uint8Array> {
    // In production, decode from address format
    return secp.utils.randomPrivateKey();
  }

  /**
   * Format stealth address for display
   */
  formatStealthAddress(address: FullStealthAddress): string {
    return `shadowpay://${address.stealth.address}`;
  }

  /**
   * Parse stealth address from URL or string
   */
  parseStealthAddress(url: string): StealthAddress | null {
    try {
      const match = url.match(/shadowpay:\/\/([a-zA-Z0-9_]+)/);
      if (match) {
        return {
          address: match[1],
          viewTag: 0,
          ephemeralPublicKey: new Uint8Array(),
          sharedSecret: new Uint8Array(),
          amount: 0n,
          commitment: new Uint8Array(),
        };
      }
    } catch {
      return null;
    }
    return null;
  }

  /**
   * Generate unique proof ID
   */
  private generateProofId(): string {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return 'sp_' + Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Get SDK version
   */
  getVersion(): string {
    return '1.0.0';
  }
}

// Re-export secp for key generation
import * as secp from '@noble/secp256k1';
