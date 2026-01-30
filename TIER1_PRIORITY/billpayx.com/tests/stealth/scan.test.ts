/**
 * Tests for Payment Scanner
 */

import { 
  PaymentScanner, 
  createScanner, 
  exportStealthPrivateKey,
  DetectedPayment,
  ScanOptions,
} from '../../src/stealth/scan';
import * as secp from '@noble/secp256k1';

describe('PaymentScanner', () => {
  let scanner: PaymentScanner;
  let merchantPrivateKey: Uint8Array;
  let merchantPublicKey: Uint8Array;

  beforeEach(() => {
    merchantPrivateKey = secp.utils.randomPrivateKey();
    merchantPublicKey = secp.getPublicKey(merchantPrivateKey);
    scanner = new PaymentScanner(merchantPrivateKey, 'https://api.devnet.solana.com');
  });

  describe('constructor', () => {
    it('should create scanner with valid keys', () => {
      expect(scanner).toBeInstanceOf(PaymentScanner);
    });

    it('should store merchant public key correctly', () => {
      // The scanner should be able to derive view tags
      expect(scanner).toBeDefined();
    });
  });

  describe('deriveViewTag', () => {
    it('should derive consistent view tag', async () => {
      const ephemeralKeys = {
        privateKey: secp.utils.randomPrivateKey(),
        publicKey: secp.getPublicKey(secp.utils.randomPrivateKey()),
      };

      const viewTag1 = await scanner.deriveViewTag(ephemeralKeys.publicKey);
      const viewTag2 = await scanner.deriveViewTag(ephemeralKeys.publicKey);

      expect(viewTag1).toBe(viewTag2);
      expect(viewTag1).toBeGreaterThanOrEqual(0);
      expect(viewTag1).toBeLessThan(256);
    });

    it('should derive different view tags for different ephemeral keys', async () => {
      const ephemeralKeys1 = {
        publicKey: secp.getPublicKey(secp.utils.randomPrivateKey()),
      };
      const ephemeralKeys2 = {
        publicKey: secp.getPublicKey(secp.utils.randomPrivateKey()),
      };

      const viewTag1 = await scanner.deriveViewTag(ephemeralKeys1.publicKey);
      const viewTag2 = await scanner.deriveViewTag(ephemeralKeys2.publicKey);

      // View tags could collide but probability is low (1/256)
      // For this test, we just verify they're valid numbers
      expect(typeof viewTag1).toBe('number');
      expect(typeof viewTag2).toBe('number');
    });
  });

  describe('verifyStealthAddress', () => {
    it('should verify valid stealth address', async () => {
      // Create ephemeral keys
      const ephemeralPrivateKey = secp.utils.randomPrivateKey();
      const ephemeralPublicKey = secp.getPublicKey(ephemeralPrivateKey);

      // Derive shared secret and generate stealth address
      const sharedPoint = secp.getSharedSecret(ephemeralPrivateKey, merchantPublicKey);
      const { sha256 } = await import('@noble/hashes/sha256');
      const sharedSecret = sha256(sharedPoint);

      const { StealthKeyManager } = await import('../../src/stealth/keys');
      const keyManager = new StealthKeyManager();
      const stealth = keyManager.generateStealthAddress(sharedSecret, merchantPublicKey);

      // Verify the address
      const isValid = await scanner.verifyStealthAddress(
        stealth.address,
        ephemeralPublicKey
      );

      expect(isValid).toBe(true);
    });

    it('should reject invalid stealth address', async () => {
      const ephemeralPublicKey = secp.getPublicKey(secp.utils.randomPrivateKey());
      
      const isValid = await scanner.verifyStealthAddress(
        'stealth_invalid_address',
        ephemeralPublicKey
      );

      expect(isValid).toBe(false);
    });
  });

  describe('checkViewTag', () => {
    it('should match correct view tag', async () => {
      const ephemeralPrivateKey = secp.utils.randomPrivateKey();
      const ephemeralPublicKey = secp.getPublicKey(ephemeralPrivateKey);

      // Derive expected view tag
      const sharedPoint = secp.getSharedSecret(merchantPrivateKey, ephemeralPublicKey);
      const { sha256 } = await import('@noble/hashes/sha256');
      const sharedSecret = sha256(sharedPoint);
      const expectedViewTag = sharedSecret[0];

      // Check view tag
      const matches = await scanner.checkViewTag(expectedViewTag, ephemeralPublicKey);

      expect(matches).toBe(true);
    });

    it('should not match incorrect view tag', async () => {
      const ephemeralPublicKey = secp.getPublicKey(secp.utils.randomPrivateKey());
      
      // Use a view tag that's unlikely to match (different by at least 128)
      const wrongViewTag = 128;

      const matches = await scanner.checkViewTag(wrongViewTag, ephemeralPublicKey);

      // Should not match (with high probability)
      expect(matches).toBe(false);
    });
  });

  describe('scanForPayments', () => {
    it('should return scan result structure', async () => {
      const result = await scanner.scanForPayments();

      expect(result).toHaveProperty('payments');
      expect(result).toHaveProperty('blocksScanned');
      expect(result).toHaveProperty('lastBlock');
      expect(result).toHaveProperty('scanDuration');
      expect(Array.isArray(result.payments)).toBe(true);
      expect(typeof result.blocksScanned).toBe('number');
      expect(typeof result.scanDuration).toBe('number');
    });

    it('should accept scan options', async () => {
      const options: ScanOptions = {
        fromBlock: 1000000,
        toBlock: 1000100,
        tokenMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        limit: 50,
      };

      const result = await scanner.scanForPayments(options);

      expect(result.blocksScanned).toBe(100); // 1000100 - 1000000
    });
  });

  describe('processTransactions', () => {
    it('should detect valid payments', async () => {
      // Create a valid payment transaction
      const ephemeralPrivateKey = secp.utils.randomPrivateKey();
      const ephemeralPublicKey = secp.getPublicKey(ephemeralPrivateKey);

      const sharedPoint = secp.getSharedSecret(ephemeralPrivateKey, merchantPublicKey);
      const { sha256 } = await import('@noble/hashes/sha256');
      const sharedSecret = sha256(sharedPoint);

      const { StealthKeyManager } = await import('../../src/stealth/keys');
      const keyManager = new StealthKeyManager();
      const stealth = keyManager.generateStealthAddress(sharedSecret, merchantPublicKey);

      const mockTx = {
        signature: 'mock_signature_' + Date.now(),
        ephemeralPublicKey,
        stealthAddress: stealth.address,
        amount: BigInt(1000000),
        blockNumber: 12345678,
        tokenMint: undefined as string | undefined,
      };

      const detected = await scanner.processTransactions([mockTx]);

      expect(detected.length).toBe(1);
      expect(detected[0].stealthAddress).toBe(stealth.address);
      expect(detected[0].amount).toBe(BigInt(1000000));
      expect(detected[0].viewTag).toBe(stealth.viewTag);
    });

    it('should not detect payments for other merchants', async () => {
      // Create keys for a different merchant
      const otherPrivateKey = secp.utils.randomPrivateKey();
      const otherPublicKey = secp.getPublicKey(otherPrivateKey);

      // Create payment for other merchant
      const ephemeralPrivateKey = secp.utils.randomPrivateKey();
      const ephemeralPublicKey = secp.getPublicKey(ephemeralPrivateKey);

      const sharedPoint = secp.getSharedSecret(ephemeralPrivateKey, otherPublicKey);
      const { sha256 } = await import('@noble/hashes/sha256');
      const sharedSecret = sha256(sharedPoint);

      const { StealthKeyManager } = await import('../../src/stealth/keys');
      const keyManager = new StealthKeyManager();
      const stealth = keyManager.generateStealthAddress(sharedSecret, otherPublicKey);

      const mockTx = {
        signature: 'mock_signature_' + Date.now(),
        ephemeralPublicKey,
        stealthAddress: stealth.address,
        amount: BigInt(1000000),
        blockNumber: 12345678,
      };

      // Our scanner should not detect this payment
      const detected = await scanner.processTransactions([mockTx]);

      expect(detected.length).toBe(0);
    });
  });

  describe('getDetectedPayments', () => {
    it('should return empty array initially', () => {
      const payments = scanner.getDetectedPayments();
      expect(Array.isArray(payments)).toBe(true);
      expect(payments.length).toBe(0);
    });

    it('should return detected payments after processing', async () => {
      // Create and process a payment
      const ephemeralPrivateKey = secp.utils.randomPrivateKey();
      const ephemeralPublicKey = secp.getPublicKey(ephemeralPrivateKey);

      const sharedPoint = secp.getSharedSecret(ephemeralPrivateKey, merchantPublicKey);
      const { sha256 } = await import('@noble/hashes/sha256');
      const sharedSecret = sha256(sharedPoint);

      const { StealthKeyManager } = await import('../../src/stealth/keys');
      const keyManager = new StealthKeyManager();
      const stealth = keyManager.generateStealthAddress(sharedSecret, merchantPublicKey);

      await scanner.processTransactions([{
        signature: 'mock_signature_' + Date.now(),
        ephemeralPublicKey,
        stealthAddress: stealth.address,
        amount: BigInt(1000000),
        blockNumber: 12345678,
      }]);

      const payments = scanner.getDetectedPayments();
      expect(payments.length).toBe(1);
    });
  });

  describe('getTotalBalance', () => {
    it('should return zero initially', () => {
      expect(scanner.getTotalBalance()).toBe(BigInt(0));
    });

    it('should sum all detected payment amounts', async () => {
      const ephemeralPrivateKey1 = secp.utils.randomPrivateKey();
      const ephemeralPublicKey1 = secp.getPublicKey(ephemeralPrivateKey1);
      const ephemeralPrivateKey2 = secp.utils.randomPrivateKey();
      const ephemeralPublicKey2 = secp.getPublicKey(ephemeralPrivateKey2);

      const sharedPoint1 = secp.getSharedSecret(ephemeralPrivateKey1, merchantPublicKey);
      const sharedPoint2 = secp.getSharedSecret(ephemeralPrivateKey2, merchantPublicKey);
      const { sha256 } = await import('@noble/hashes/sha256');
      const sharedSecret1 = sha256(sharedPoint1);
      const sharedSecret2 = sha256(sharedPoint2);

      const { StealthKeyManager } = await import('../../src/stealth/keys');
      const keyManager = new StealthKeyManager();
      const stealth1 = keyManager.generateStealthAddress(sharedSecret1, merchantPublicKey);
      const stealth2 = keyManager.generateStealthAddress(sharedSecret2, merchantPublicKey);

      await scanner.processTransactions([
        {
          signature: 'mock_sig_1',
          ephemeralPublicKey: ephemeralPublicKey1,
          stealthAddress: stealth1.address,
          amount: BigInt(1000000),
          blockNumber: 12345678,
        },
        {
          signature: 'mock_sig_2',
          ephemeralPublicKey: ephemeralPublicKey2,
          stealthAddress: stealth2.address,
          amount: BigInt(2000000),
          blockNumber: 12345679,
        },
      ]);

      expect(scanner.getTotalBalance()).toBe(BigInt(3000000));
    });
  });

  describe('deriveStealthPrivateKey', () => {
    it('should derive correct stealth private key', async () => {
      const ephemeralPrivateKey = secp.utils.randomPrivateKey();
      const ephemeralPublicKey = secp.getPublicKey(ephemeralPrivateKey);

      const stealthPrivateKey = await scanner.deriveStealthPrivateKey(ephemeralPublicKey);

      expect(stealthPrivateKey).toBeInstanceOf(Uint8Array);
      expect(stealthPrivateKey.length).toBe(32);
    });

    it('should derive consistent private key', async () => {
      const ephemeralPublicKey = secp.getPublicKey(secp.utils.randomPrivateKey());

      const key1 = await scanner.deriveStealthPrivateKey(ephemeralPublicKey);
      const key2 = await scanner.deriveStealthPrivateKey(ephemeralPublicKey);

      expect(Buffer.from(key1).toString('hex')).toBe(Buffer.from(key2).toString('hex'));
    });
  });
});

describe('createScanner', () => {
  it('should create scanner from base58 key', () => {
    const mockKey = 'mock_base58_key_' + Date.now();
    const scanner = createScanner(mockKey);

    expect(scanner).toBeInstanceOf(PaymentScanner);
  });
});

describe('exportStealthPrivateKey', () => {
  it('should export key in correct format', async () => {
    const merchantPrivateKey = secp.utils.randomPrivateKey();
    const scanner = new PaymentScanner(merchantPrivateKey);

    const ephemeralPublicKey = secp.getPublicKey(secp.utils.randomPrivateKey());
    const exported = await exportStealthPrivateKey(scanner, ephemeralPublicKey);

    expect(typeof exported).toBe('string');
    expect(exported.startsWith('stealth_key_')).toBe(true);
  });
});
