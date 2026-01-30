/**
 * Tests for Hybrid Encryption (Kyber-768 + X25519)
 */

import { HybridEncryption, HybridCiphertext } from '../src/crypto/hybrid';
import { KyberCrypto } from '../src/crypto/kyber';
import * as nacl from 'tweetnacl';

describe('HybridEncryption', () => {
  let hybrid: HybridEncryption;
  let kyber: KyberCrypto;

  beforeEach(() => {
    hybrid = new HybridEncryption();
    kyber = new KyberCrypto();
  });

  describe('Encryption', () => {
    it('should encrypt a message with hybrid encryption', async () => {
      const message = 'Hello, Quantum World!';
      const kyberKeys = await kyber.generateKeypair();
      const x25519Keys = nacl.box.keyPair();

      const encrypted = await hybrid.encryptMessage(
        message,
        kyberKeys.publicKey,
        x25519Keys.publicKey
      );

      expect(encrypted).toBeDefined();
      expect(encrypted.kyberCiphertext).toBeInstanceOf(Buffer);
      expect(encrypted.x25519Public).toBeInstanceOf(Buffer);
      expect(encrypted.ciphertext).toBeInstanceOf(Buffer);
      expect(encrypted.nonce).toBeInstanceOf(Buffer);
    });

    it('should encrypt without recipient keys (ephemeral only)', async () => {
      const message = 'Test message';
      
      const encrypted = await hybrid.encryptMessage(message);

      expect(encrypted).toBeDefined();
      expect(encrypted.ciphertext.length).toBeGreaterThan(0);
      expect(encrypted.nonce.length).toBe(12);
    });

    it('should produce different ciphertexts for same message', async () => {
      const message = 'Same message';
      const kyberKeys = await kyber.generateKeypair();
      const x25519Keys = nacl.box.keyPair();

      const encrypted1 = await hybrid.encryptMessage(
        message,
        kyberKeys.publicKey,
        x25519Keys.publicKey
      );
      const encrypted2 = await hybrid.encryptMessage(
        message,
        kyberKeys.publicKey,
        x25519Keys.publicKey
      );

      // Nonce should be different
      expect(encrypted1.nonce.toString('hex')).not.toBe(encrypted2.nonce.toString('hex'));
      
      // Ciphertext should be different
      expect(encrypted1.ciphertext.toString('hex')).not.toBe(encrypted2.ciphertext.toString('hex'));
    });

    it('should handle empty messages', async () => {
      const message = '';
      
      const encrypted = await hybrid.encryptMessage(message);
      
      expect(encrypted).toBeDefined();
      expect(encrypted.ciphertext.length).toBeGreaterThanOrEqual(16); // Auth tag size
    });

    it('should handle large messages', async () => {
      const message = 'A'.repeat(10000);
      const kyberKeys = await kyber.generateKeypair();
      const x25519Keys = nacl.box.keyPair();

      const encrypted = await hybrid.encryptMessage(
        message,
        kyberKeys.publicKey,
        x25519Keys.publicKey
      );

      expect(encrypted).toBeDefined();
      expect(encrypted.ciphertext.length).toBeGreaterThan(10000);
    });
  });

  describe('Security Info', () => {
    it('should return correct security information', () => {
      const info = hybrid.getSecurityInfo();

      expect(info).toEqual({
        pqAlgorithm: 'Kyber-768',
        classicalAlgorithm: 'X25519',
        symmetricAlgorithm: 'ChaCha20-Poly1305',
        hybridApproach: true,
        postQuantumSecure: true,
        forwardSecrecy: true
      });
    });

    it('should confirm post-quantum security', () => {
      const info = hybrid.getSecurityInfo();
      
      expect(info.postQuantumSecure).toBe(true);
      expect(info.pqAlgorithm).toBe('Kyber-768');
    });

    it('should confirm hybrid approach', () => {
      const info = hybrid.getSecurityInfo();
      
      expect(info.hybridApproach).toBe(true);
      expect(info.pqAlgorithm).toBeDefined();
      expect(info.classicalAlgorithm).toBeDefined();
    });
  });

  describe('X25519 Integration', () => {
    it('should generate valid X25519 ephemeral keys during encryption', async () => {
      const message = 'Test';
      const encrypted = await hybrid.encryptMessage(message);

      expect(encrypted.x25519Public.length).toBe(32);
    });
  });

  describe('Nonce Generation', () => {
    it('should generate 12-byte nonce for ChaCha20-Poly1305', async () => {
      const encrypted = await hybrid.encryptMessage('test');

      expect(encrypted.nonce.length).toBe(12);
    });

    it('should generate unique nonces', async () => {
      const encrypted1 = await hybrid.encryptMessage('test');
      const encrypted2 = await hybrid.encryptMessage('test');
      const encrypted3 = await hybrid.encryptMessage('test');

      expect(encrypted1.nonce.toString('hex')).not.toBe(encrypted2.nonce.toString('hex'));
      expect(encrypted2.nonce.toString('hex')).not.toBe(encrypted3.nonce.toString('hex'));
    });
  });
});
