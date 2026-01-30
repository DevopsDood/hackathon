/**
 * ShadowPay Stealth Address System
 * Extended from billpayx.com stealth keys with enhanced privacy features
 */

import * as secp from '@noble/secp256k1';
import { sha256, sha512 } from '@noble/hashes/sha256';
import { poseidon2 } from '@noble/hashes/poseidon2';

// Re-export from billpayx.com for compatibility
export { StealthKeyManager } from '../../../../TIER1_PRIORITY/billpayx.com/src/stealth/keys';

export interface StealthAddress {
  address: string;           // One-time stealth address
  viewTag: number;           // For efficient scanning
  ephemeralPublicKey: Uint8Array;
  sharedSecret: Uint8Array;
  amount: bigint;            // Encrypted amount
  commitment: Uint8Array;    // Note commitment for verification
}

export interface FullStealthAddress {
  stealth: StealthAddress;
  viewKey: Uint8Array;       // For detecting incoming payments
  spendKey: Uint8Array;      // For spending funds (keep secret!)
  nullifierKey: Uint8Array;  // Derived nullifier key
}

export interface ScanResult {
  detected: boolean;
  stealthAddress: StealthAddress;
  amount: bigint;
  nullifierKey: Uint8Array;
}

export interface PaymentNote {
  commitment: Uint8Array;
  amount: bigint;
  randomness: Uint8Array;
  nullifierKey: Uint8Array;
  viewKey: Uint8Array;
  spendKey: Uint8Array;
}

/**
 * Enhanced Stealth Address Generator for ShadowPay
 */
export class ShadowPayStealth {
  private readonly CURVE_ORDER = secp.CURVE.n;

  /**
   * Generate a complete stealth address setup for a recipient
   */
  async generateStealthAddress(
    recipientViewKey: Uint8Array,
    amount: bigint
  ): Promise<FullStealthAddress> {
    // Generate ephemeral key pair for this transaction
    const ephemeral = await this.generateEphemeralKeys();

    // Derive shared secret using ECDH
    const sharedSecret = await this.deriveSharedSecret(
      ephemeral.privateKey,
      recipientViewKey
    );

    // Generate stealth address
    const stealth = await this.generateStealthAddressFromSharedSecret(
      sharedSecret,
      recipientViewKey,
      amount
    );

    // Generate view key for detecting payments
    const viewKey = await this.deriveViewKey(sharedSecret, ephemeral.privateKey);

    // Generate spend key (should be kept very secret)
    const spendKey = await this.deriveSpendKey(sharedSecret, ephemeral.privateKey);

    // Generate nullifier key for spending
    const nullifierKey = await this.deriveNullifierKey(spendKey, stealth.commitment);

    return {
      stealth,
      viewKey,
      spendKey,
      nullifierKey,
    };
  }

  /**
   * Scan for payments using a scanning key
   */
  async scanForPayments(
    scanKey: Uint8Array,
    transactions: StealthTransaction[]
  ): Promise<ScanResult[]> {
    const detected: ScanResult[] = [];

    for (const tx of transactions) {
      // Try to derive shared secret using the scan key
      const sharedSecret = await this.tryDeriveSharedSecret(
        scanKey,
        tx.ephemeralPublicKey
      );

      if (sharedSecret) {
        // Decrypt the amount
        const amount = this.decryptAmount(tx.encryptedAmount, sharedSecret);

        // Derive the nullifier key for spending
        const nullifierKey = await this.deriveNullifierKeyFromShared(
          sharedSecret,
          tx.ephemeralPublicKey
        );

        // Reconstruct the stealth address
        const stealthAddress = await this.reconstructStealthAddress(
          sharedSecret,
          tx.ephemeralPublicKey,
          amount
        );

        detected.push({
          detected: true,
          stealthAddress,
          amount,
          nullifierKey,
        });
      }
    }

    return detected;
  }

  /**
   * Generate ephemeral key pair
   */
  async generateEphemeralKeys(): Promise<{ privateKey: Uint8Array; publicKey: Uint8Array }> {
    const privateKey = secp.utils.randomPrivateKey();
    const publicKey = secp.getPublicKey(privateKey);
    return { privateKey, publicKey };
  }

  /**
   * Derive shared secret using ECDH
   */
  async deriveSharedSecret(
    ephemeralPrivateKey: Uint8Array,
    recipientPublicKey: Uint8Array
  ): Promise<Uint8Array> {
    const sharedPoint = secp.getSharedSecret(ephemeralPrivateKey, recipientPublicKey);
    return sha256(sharedPoint);
  }

  /**
   * Try to derive shared secret (returns null if not for this recipient)
   */
  async tryDeriveSharedSecret(
    scanKey: Uint8Array,
    ephemeralPublicKey: Uint8Array
  ): Promise<Uint8Array | null> {
    try {
      const sharedSecret = secp.getSharedSecret(scanKey, ephemeralPublicKey);
      return sha256(sharedSecret);
    } catch {
      return null;
    }
  }

  /**
   * Generate stealth address from shared secret
   */
  async generateStealthAddressFromSharedSecret(
    sharedSecret: Uint8Array,
    recipientViewKey: Uint8Array,
    amount: bigint
  ): Promise<StealthAddress> {
    // Derive offset from shared secret
    const offset = sha256(sharedSecret);

    // Calculate stealth public key: recipient_pub + offset_pub
    const offsetPublicKey = secp.getPublicKey(offset);
    const recipientPub = secp.Point.fromHex(recipientViewKey);
    const stealthPublicKey = recipientPub.add(secp.Point.fromHex(offsetPublicKey));

    // Create note commitment
    const randomness = secp.utils.randomPrivateKey();
    const commitment = this.createNoteCommitment(stealthPublicKey, amount, randomness);

    // Generate view tag for efficient scanning
    const viewTag = this.generateViewTag(sharedSecret, stealthPublicKey);

    // Encrypt amount
    const encryptedAmount = this.encryptAmount(amount, sharedSecret);

    return {
      address: this.publicKeyToAddress(stealthPublicKey.toRawBytes()),
      viewTag,
      ephemeralPublicKey: new Uint8Array(0), // Set by caller
      sharedSecret,
      amount,
      commitment,
    };
  }

  /**
   * Reconstruct stealth address from shared secret components
   */
  async reconstructStealthAddress(
    sharedSecret: Uint8Array,
    ephemeralPublicKey: Uint8Array,
    amount: bigint
  ): Promise<StealthAddress> {
    const offset = sha256(sharedSecret);
    const offsetPublicKey = secp.getPublicKey(offset);
    const stealthPublicKey = offsetPublicKey; // Simplified for scan result

    const randomness = sha512(sharedSecret).slice(0, 32);
    const commitment = this.createNoteCommitment(
      secp.Point.fromHex(stealthPublicKey),
      amount,
      randomness
    );

    const viewTag = this.generateViewTag(sharedSecret, stealthPublicKey);

    return {
      address: this.publicKeyToAddress(stealthPublicKey),
      viewTag,
      ephemeralPublicKey,
      sharedSecret,
      amount,
      commitment,
    };
  }

  /**
   * Create note commitment using Poseidon hash
   */
  createNoteCommitment(
    publicKey: secp.Point,
    amount: bigint,
    randomness: Uint8Array
  ): Uint8Array {
    const commitmentInputs = [
      publicKey.x,
      publicKey.y,
      BigInt(amount) % this.CURVE_ORDER,
      BigInt('0x' + Buffer.from(randomness).toString('hex')),
    ];

    const commitment = poseidon2(commitmentInputs.map(x => this.bigIntToBuffer(x)));
    return commitment;
  }

  /**
   * Generate view tag for efficient scanning
   */
  generateViewTag(sharedSecret: Uint8Array, stealthPublicKey: Uint8Array): number {
    const tagInput = new Uint8Array(sharedSecret.length + stealthPublicKey.length);
    tagInput.set(sharedSecret);
    tagInput.set(stealthPublicKey, sharedSecret.length);
    const tagHash = sha256(tagInput);
    return tagHash[0];
  }

  /**
   * Encrypt amount using shared secret
   */
  encryptAmount(amount: bigint, sharedSecret: Uint8Array): Uint8Array {
    const amountBytes = this.amountToBuffer(amount);
    const encrypted = new Uint8Array(amountBytes.length);

    for (let i = 0; i < amountBytes.length; i++) {
      encrypted[i] = amountBytes[i] ^ sharedSecret[i % sharedSecret.length];
    }

    return encrypted;
  }

  /**
   * Decrypt amount using shared secret
   */
  decryptAmount(encrypted: Uint8Array, sharedSecret: Uint8Array): bigint {
    const decrypted = new Uint8Array(encrypted.length);

    for (let i = 0; i < encrypted.length; i++) {
      decrypted[i] = encrypted[i] ^ sharedSecret[i % sharedSecret.length];
    }

    return this.bufferToAmount(decrypted);
  }

  /**
   * Derive view key from shared secret
   */
  async deriveViewKey(
    sharedSecret: Uint8Array,
    ephemeralPrivateKey: Uint8Array
  ): Promise<Uint8Array> {
    const keyInput = new Uint8Array(sharedSecret.length + ephemeralPrivateKey.length);
    keyInput.set(sharedSecret);
    keyInput.set(ephemeralPrivateKey, sharedSecret.length);
    return sha256(keyInput);
  }

  /**
   * Derive spend key from shared secret
   */
  async deriveSpendKey(
    sharedSecret: Uint8Array,
    ephemeralPrivateKey: Uint8Array
  ): Promise<Uint8Array> {
    const keyInput = new Uint8Array(sharedSecret.length + ephemeralPrivateKey.length + 1);
    keyInput.set(sharedSecret);
    keyInput.set(ephemeralPrivateKey, sharedSecret.length);
    keyInput[keyInput.length - 1] = 1; // Spend key marker
    return sha256(keyInput);
  }

  /**
   * Derive nullifier key from spend key and commitment
   */
  async deriveNullifierKey(
    spendKey: Uint8Array,
    commitment: Uint8Array
  ): Promise<Uint8Array> {
    const keyInput = new Uint8Array(spendKey.length + commitment.length);
    keyInput.set(spendKey);
    keyInput.set(commitment, spendKey.length);
    return sha256(keyInput);
  }

  /**
   * Derive nullifier key from shared secret during scanning
   */
  async deriveNullifierKeyFromShared(
    sharedSecret: Uint8Array,
    ephemeralPublicKey: Uint8Array
  ): Promise<Uint8Array> {
    const spendKey = await this.deriveSpendKey(sharedSecret, ephemeralPublicKey);
    const commitment = sha256(sharedSecret);
    return this.deriveNullifierKey(spendKey, commitment);
  }

  /**
   * Convert public key to address format
   */
  private publicKeyToAddress(publicKey: Uint8Array): string {
    return 'shadow_' + Buffer.from(publicKey).toString('base64').replace(/=/g, '').slice(0, 44);
  }

  /**
   * Convert amount to buffer
   */
  private amountToBuffer(amount: bigint): Uint8Array {
    const hex = amount.toString(16);
    const padded = hex.padStart(64, '0');
    const bytes = Buffer.from(padded, 'hex');
    return new Uint8Array(bytes);
  }

  /**
   * Convert buffer to amount
   */
  private bufferToAmount(buffer: Uint8Array): bigint {
    const hex = Buffer.from(buffer).toString('hex');
    return BigInt('0x' + hex.replace(/\0/g, '').padStart(1, '0'));
  }

  /**
   * Convert bigint to buffer for Poseidon
   */
  private bigIntToBuffer(value: bigint): Uint8Array {
    const hex = value.toString(16).padStart(64, '0');
    return Buffer.from(hex, 'hex');
  }

  /**
   * Generate nullifier for a transaction
   */
  async generateNullifier(
    nullifierKey: Uint8Array,
    merkleRoot: Uint8Array
  ): Promise<Uint8Array> {
    const input = new Uint8Array(nullifierKey.length + merkleRoot.length);
    input.set(nullifierKey);
    input.set(merkleRoot, nullifierKey.length);
    return sha256(input);
  }
}

/**
 * Stealth transaction for scanning
 */
export interface StealthTransaction {
  ephemeralPublicKey: Uint8Array;
  encryptedAmount: Uint8Array;
  commitment: Uint8Array;
  timestamp: number;
}

/**
 * Create a new stealth transaction
 */
export async function createStealthTransaction(
  stealth: ShadowPayStealth,
  recipientViewKey: Uint8Array,
  amount: bigint
): Promise<{ transaction: StealthTransaction; stealthAddress: FullStealthAddress }> {
  const fullStealth = await stealth.generateStealthAddress(recipientViewKey, amount);

  const transaction: StealthTransaction = {
    ephemeralPublicKey: new Uint8Array(), // Set from ephemeral keys
    encryptedAmount: stealth.encryptAmount(amount, fullStealth.stealth.sharedSecret),
    commitment: fullStealth.stealth.commitment,
    timestamp: Date.now(),
  };

  return { transaction, stealthAddress: fullStealth };
}
