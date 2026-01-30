/**
 * Stealth Address Key Generation
 */

import * as secp from '@noble/secp256k1';
import { sha256 } from '@noble/hashes/sha256';

export interface ScanResult {
  stealthAddress: string;
  ephemeralPublicKey: Uint8Array;
  sharedSecret: Uint8Array;
  viewTag: number;
}

export class StealthKeyManager {
  async generateEphemeralKeys(): Promise<{ privateKey: Uint8Array; publicKey: Uint8Array }> {
    const privateKey = secp.utils.randomPrivateKey();
    const publicKey = secp.getPublicKey(privateKey);
    return { privateKey, publicKey };
  }

  async deriveSharedSecret(
    ephemeralPrivateKey: Uint8Array,
    merchantPublicKey: Uint8Array
  ): Promise<Uint8Array> {
    const sharedPoint = secp.getSharedSecret(ephemeralPrivateKey, merchantPublicKey);
    return sha256(sharedPoint);
  }

  generateStealthAddress(
    sharedSecret: Uint8Array,
    merchantPublicKey: Uint8Array
  ): { address: string; viewTag: number } {
    const offset = sha256(sharedSecret);
    const offsetPublicKey = secp.getPublicKey(offset);
    const stealthPublicKey = secp.Point.fromHex(merchantPublicKey)
      .add(secp.Point.fromHex(offsetPublicKey))
      .toRawBytes();
    const viewTag = offset[0];
    const address = this.publicKeyToAddress(stealthPublicKey);
    return { address, viewTag };
  }

  private publicKeyToAddress(publicKey: Uint8Array): string {
    return 'stealth_' + Buffer.from(publicKey).toString('base64').slice(0, 32);
  }
}
