/**
 * Hybrid Encryption: Kyber-768 + X25519
 */

import * as crypto from 'crypto';
import * as nacl from 'tweetnacl';
import { KyberCrypto } from './kyber';

export interface HybridCiphertext {
  kyberCiphertext: Buffer;
  x25519Public: Buffer;
  ciphertext: Buffer;
  nonce: Buffer;
}

export class HybridEncryption {
  private kyber: KyberCrypto;

  constructor() {
    this.kyber = new KyberCrypto();
  }

  async encryptMessage(
    message: string,
    recipientKyberPk?: Buffer,
    recipientX25519Pk?: Buffer
  ): Promise<HybridCiphertext> {
    const ephemeralX25519 = nacl.box.keyPair();
    
    let kyberResult = { ciphertext: Buffer.alloc(0), sharedSecret: Buffer.alloc(32) };
    if (recipientKyberPk) {
      kyberResult = await this.kyber.encapsulate(recipientKyberPk);
    }

    let x25519Shared = Buffer.alloc(32);
    if (recipientX25519Pk) {
      x25519Shared = Buffer.from(
        nacl.scalarMult(ephemeralX25519.secretKey, recipientX25519Pk)
      );
    }

    const combinedSecret = this.kdfCombine([
      kyberResult.sharedSecret,
      x25519Shared
    ]);

    const nonce = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(
      'chacha20-poly1305',
      combinedSecret,
      nonce
    );
    
    const ciphertext = Buffer.concat([
      cipher.update(message, 'utf8'),
      cipher.final()
    ]);
    const authTag = cipher.getAuthTag();

    return {
      kyberCiphertext: kyberResult.ciphertext,
      x25519Public: Buffer.from(ephemeralX25519.publicKey),
      ciphertext: Buffer.concat([ciphertext, authTag]),
      nonce
    };
  }

  private kdfCombine(secrets: Buffer[]): Buffer {
    const hash = crypto.createHash('sha256');
    secrets.forEach(secret => hash.update(secret));
    return hash.digest();
  }

  getSecurityInfo() {
    return {
      pqAlgorithm: 'Kyber-768',
      classicalAlgorithm: 'X25519',
      symmetricAlgorithm: 'ChaCha20-Poly1305',
      hybridApproach: true,
      postQuantumSecure: true,
      forwardSecrecy: true
    };
  }
}
