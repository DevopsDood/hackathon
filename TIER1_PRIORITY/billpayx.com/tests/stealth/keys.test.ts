/**
 * Tests for Stealth Key Management
 */

import { StealthKeyManager, ScanResult } from '../../src/stealth/keys';

describe('StealthKeyManager', () => {
  let keyManager: StealthKeyManager;

  beforeEach(() => {
    keyManager = new StealthKeyManager();
  });

  describe('generateEphemeralKeys', () => {
    it('should generate a valid ephemeral key pair', async () => {
      const keys = await keyManager.generateEphemeralKeys();
      
      expect(keys).toHaveProperty('privateKey');
      expect(keys).toHaveProperty('publicKey');
      expect(keys.privateKey).toBeInstanceOf(Uint8Array);
      expect(keys.publicKey).toBeInstanceOf(Uint8Array);
      expect(keys.privateKey.length).toBe(32);
      expect(keys.publicKey.length).toBe(33); // Compressed format
    });

    it('should generate unique keys each time', async () => {
      const keys1 = await keyManager.generateEphemeralKeys();
      const keys2 = await keyManager.generateEphemeralKeys();
      
      // Private keys should be different
      expect(Buffer.from(keys1.privateKey).toString('hex'))
        .not.toBe(Buffer.from(keys2.privateKey).toString('hex'));
    });

    it('should generate valid secp256k1 keys', async () => {
      const keys = await keyManager.generateEphemeralKeys();
      
      // Public key should start with 0x02 or 0x03 (compressed format)
      expect([0x02, 0x03]).toContain(keys.publicKey[0]);
    });
  });

  describe('deriveSharedSecret', () => {
    it('should derive consistent shared secrets', async () => {
      const ephemeralKeys = await keyManager.generateEphemeralKeys();
      
      // Create a mock merchant public key (33 bytes compressed)
      const merchantPrivateKey = new Uint8Array(32);
      for (let i = 0; i < 32; i++) {
        merchantPrivateKey[i] = i;
      }
      
      // Import secp256k1 to get public key
      const secp = await import('@noble/secp256k1');
      const merchantPublicKey = secp.getPublicKey(merchantPrivateKey);
      
      // Derive shared secret
      const sharedSecret = await keyManager.deriveSharedSecret(
        ephemeralKeys.privateKey,
        merchantPublicKey
      );
      
      expect(sharedSecret).toBeInstanceOf(Uint8Array);
      expect(sharedSecret.length).toBe(32); // SHA256 output
    });

    it('should derive same shared secret from both sides', async () => {
      const secp = await import('@noble/secp256k1');
      
      // Generate two keypairs
      const ephemeralKeys = await keyManager.generateEphemeralKeys();
      const merchantPrivateKey = secp.utils.randomPrivateKey();
      const merchantPublicKey = secp.getPublicKey(merchantPrivateKey);
      
      // Alice (ephemeral) derives shared secret
      const sharedFromEphemeral = await keyManager.deriveSharedSecret(
        ephemeralKeys.privateKey,
        merchantPublicKey
      );
      
      // Bob (merchant) derives shared secret
      const sharedFromMerchant = await keyManager.deriveSharedSecret(
        merchantPrivateKey,
        ephemeralKeys.publicKey
      );
      
      // Should be the same
      expect(Buffer.from(sharedFromEphemeral).toString('hex'))
        .toBe(Buffer.from(sharedFromMerchant).toString('hex'));
    });
  });

  describe('generateStealthAddress', () => {
    it('should generate a valid stealth address', async () => {
      const ephemeralKeys = await keyManager.generateEphemeralKeys();
      const secp = await import('@noble/secp256k1');
      
      const merchantPrivateKey = secp.utils.randomPrivateKey();
      const merchantPublicKey = secp.getPublicKey(merchantPrivateKey);
      
      const sharedSecret = await keyManager.deriveSharedSecret(
        ephemeralKeys.privateKey,
        merchantPublicKey
      );
      
      const stealth = keyManager.generateStealthAddress(
        sharedSecret,
        merchantPublicKey
      );
      
      expect(stealth).toHaveProperty('address');
      expect(stealth).toHaveProperty('viewTag');
      expect(typeof stealth.address).toBe('string');
      expect(typeof stealth.viewTag).toBe('number');
      expect(stealth.address.startsWith('stealth_')).toBe(true);
      expect(stealth.viewTag).toBeGreaterThanOrEqual(0);
      expect(stealth.viewTag).toBeLessThan(256);
    });

    it('should generate unique addresses for different secrets', async () => {
      const secp = await import('@noble/secp256k1');
      const merchantPublicKey = secp.getPublicKey(secp.utils.randomPrivateKey());
      
      const sharedSecret1 = new Uint8Array(32).fill(1);
      const sharedSecret2 = new Uint8Array(32).fill(2);
      
      const stealth1 = keyManager.generateStealthAddress(sharedSecret1, merchantPublicKey);
      const stealth2 = keyManager.generateStealthAddress(sharedSecret2, merchantPublicKey);
      
      expect(stealth1.address).not.toBe(stealth2.address);
      expect(stealth1.viewTag).not.toBe(stealth2.viewTag);
    });

    it('should generate consistent view tags for same secret', async () => {
      const secp = await import('@noble/secp256k1');
      const merchantPublicKey = secp.getPublicKey(secp.utils.randomPrivateKey());
      
      const sharedSecret = new Uint8Array(32).fill(42);
      
      const stealth1 = keyManager.generateStealthAddress(sharedSecret, merchantPublicKey);
      const stealth2 = keyManager.generateStealthAddress(sharedSecret, merchantPublicKey);
      
      expect(stealth1.viewTag).toBe(stealth2.viewTag);
    });
  });

  describe('end-to-end stealth address flow', () => {
    it('should complete full stealth address generation flow', async () => {
      const secp = await import('@noble/secp256k1');
      
      // 1. Merchant generates master keypair
      const merchantPrivateKey = secp.utils.randomPrivateKey();
      const merchantPublicKey = secp.getPublicKey(merchantPrivateKey);
      
      // 2. Customer generates ephemeral keys
      const ephemeralKeys = await keyManager.generateEphemeralKeys();
      
      // 3. Customer derives shared secret
      const sharedSecret = await keyManager.deriveSharedSecret(
        ephemeralKeys.privateKey,
        merchantPublicKey
      );
      
      // 4. Customer generates stealth address
      const stealth = keyManager.generateStealthAddress(
        sharedSecret,
        merchantPublicKey
      );
      
      // 5. Verify address format
      expect(stealth.address).toMatch(/^stealth_[A-Za-z0-9+/]+={0,2}$/);
      expect(stealth.address.length).toBeGreaterThan(40);
      
      // 6. Verify view tag
      expect(stealth.viewTag).toBeGreaterThanOrEqual(0);
      expect(stealth.viewTag).toBeLessThan(256);
    });

    it('should generate different stealth addresses for each payment', async () => {
      const secp = await import('@noble/secp256k1');
      const merchantPublicKey = secp.getPublicKey(secp.utils.randomPrivateKey());
      
      const addresses = new Set<string>();
      
      // Generate 10 stealth addresses
      for (let i = 0; i < 10; i++) {
        const ephemeralKeys = await keyManager.generateEphemeralKeys();
        const sharedSecret = await keyManager.deriveSharedSecret(
          ephemeralKeys.privateKey,
          merchantPublicKey
        );
        const stealth = keyManager.generateStealthAddress(sharedSecret, merchantPublicKey);
        addresses.add(stealth.address);
      }
      
      // All addresses should be unique
      expect(addresses.size).toBe(10);
    });
  });
});
