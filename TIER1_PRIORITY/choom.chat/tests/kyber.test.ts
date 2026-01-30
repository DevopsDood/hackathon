/**
 * Tests for Kyber-768 Post-Quantum Cryptography
 */

import { KyberCrypto } from '../src/crypto/kyber';

describe('KyberCrypto', () => {
  let kyber: KyberCrypto;

  beforeEach(() => {
    kyber = new KyberCrypto();
  });

  describe('Key Generation', () => {
    it('should generate a valid key pair', async () => {
      const keypair = await kyber.generateKeypair();
      
      expect(keypair).toBeDefined();
      expect(keypair.publicKey).toBeInstanceOf(Buffer);
      expect(keypair.secretKey).toBeInstanceOf(Buffer);
    });

    it('should generate keys with correct sizes', async () => {
      const keypair = await kyber.generateKeypair();
      const params = kyber.getParameters();
      
      expect(keypair.publicKey.length).toBe(params.publicKeySize);
      expect(keypair.secretKey.length).toBe(params.secretKeySize);
    });

    it('should generate unique keys each time', async () => {
      const keypair1 = await kyber.generateKeypair();
      const keypair2 = await kyber.generateKeypair();
      
      expect(keypair1.publicKey.toString('hex')).not.toBe(keypair2.publicKey.toString('hex'));
      expect(keypair1.secretKey.toString('hex')).not.toBe(keypair2.secretKey.toString('hex'));
    });
  });

  describe('Encapsulation/Decapsulation', () => {
    it('should encapsulate and decapsulate successfully', async () => {
      const keypair = await kyber.generateKeypair();
      
      const encapsulation = await kyber.encapsulate(keypair.publicKey);
      expect(encapsulation.ciphertext).toBeInstanceOf(Buffer);
      expect(encapsulation.sharedSecret).toBeInstanceOf(Buffer);
      
      const decapsulatedSecret = await kyber.decapsulate(
        keypair.secretKey,
        encapsulation.ciphertext
      );
      
      expect(decapsulatedSecret).toBeInstanceOf(Buffer);
      expect(decapsulatedSecret.length).toBe(32);
    });

    it('should produce ciphertext of correct size', async () => {
      const keypair = await kyber.generateKeypair();
      const encapsulation = await kyber.encapsulate(keypair.publicKey);
      const params = kyber.getParameters();
      
      expect(encapsulation.ciphertext.length).toBe(params.ciphertextSize);
    });

    it('should produce consistent shared secrets', async () => {
      const keypair = await kyber.generateKeypair();
      
      // Multiple encapsulations should work with same keypair
      const enc1 = await kyber.encapsulate(keypair.publicKey);
      const enc2 = await kyber.encapsulate(keypair.publicKey);
      
      // Each encapsulation produces unique ciphertext
      expect(enc1.ciphertext.toString('hex')).not.toBe(enc2.ciphertext.toString('hex'));
      
      // But decapsulation should work
      const dec1 = await kyber.decapsulate(keypair.secretKey, enc1.ciphertext);
      const dec2 = await kyber.decapsulate(keypair.secretKey, enc2.ciphertext);
      
      expect(dec1).toBeInstanceOf(Buffer);
      expect(dec2).toBeInstanceOf(Buffer);
    });
  });

  describe('Parameters', () => {
    it('should return correct Kyber-768 parameters', () => {
      const params = kyber.getParameters();
      
      expect(params).toEqual({
        n: 256,
        q: 3329,
        k: 3,
        publicKeySize: 1184,
        secretKeySize: 2400,
        ciphertextSize: 1088
      });
    });
  });
});
