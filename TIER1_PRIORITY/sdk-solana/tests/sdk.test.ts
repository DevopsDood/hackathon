/**
 * SDK-Solana Unit Tests
 */

import { MerkleTree } from '../src/zk/merkle';
import { CommitmentGenerator } from '../src/zk/commitment';
import { RangeProofGenerator } from '../src/zk/range-proof';
import { StealthModule, StealthUtils, generateEphemeralKey } from '../src/stealth';
import { SolanaPrivacySDK, VERSION } from '../src';
import { bytesEqual } from '../src/types';

// Helper to convert string to Uint8Array
function toBytes(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

// Helper to create 32-byte key from string
function toKey(str: string): Uint8Array {
  const bytes = toBytes(str);
  const key = new Uint8Array(32);
  key.set(bytes.subarray(0, Math.min(bytes.length, 32)));
  return key;
}

describe('SDK-Solana', () => {
  describe('Version', () => {
    it('should export version', () => {
      expect(typeof VERSION).toBe('string');
      expect(VERSION).toBe('1.0.0');
    });
  });

  describe('SDK Initialization', () => {
    it('should create SDK with default config', () => {
      const sdk = new SolanaPrivacySDK();
      expect(sdk.getNetwork()).toBe('devnet');
    });

    it('should create SDK with custom config', () => {
      const sdk = new SolanaPrivacySDK({
        network: 'mainnet-beta',
        rpcUrl: 'https://api.mainnet-beta.solana.com',
      });
      expect(sdk.getNetwork()).toBe('mainnet-beta');
      expect(sdk.getRpcUrl()).toBe('https://api.mainnet-beta.solana.com');
    });
  });

  describe('MerkleTree', () => {
    it('should create tree from leaves', () => {
      const leaves = [
        toBytes('leaf1'),
        toBytes('leaf2'),
        toBytes('leaf3'),
      ];
      
      const tree = new MerkleTree(leaves.map(l => Buffer.from(l)));
      expect(tree.root.length).toBe(32);
      expect(tree.depth).toBeGreaterThan(0);
    });

    it('should generate proof for leaf', () => {
      const leaves = [
        Buffer.from('a'),
        Buffer.from('b'),
        Buffer.from('c'),
      ];
      
      const tree = new MerkleTree(leaves);
      const proof = tree.generateProof(leaves[0]);
      
      expect(proof.siblings.length).toBeGreaterThan(0);
      expect(proof.root.length).toBe(32);
    });

    it('should verify valid proof', () => {
      const leaves = [
        Buffer.from('test1'),
        Buffer.from('test2'),
      ];
      
      const tree = new MerkleTree(leaves);
      const proof = tree.generateProof(leaves[0]);
      const valid = tree.verifyProof(leaves[0], proof);
      
      expect(valid).toBe(true);
    });

    it('should reject invalid proof', () => {
      const leaves = [
        Buffer.from('leaf1'),
        Buffer.from('leaf2'),
      ];
      
      const tree = new MerkleTree(leaves);
      const proof = tree.generateProof(leaves[0]);
      
      // Modify proof
      proof.siblings[0] = Buffer.from('fake');
      
      const valid = tree.verifyProof(leaves[0], proof);
      expect(valid).toBe(false);
    });

    it('should update leaf', () => {
      const leaves = [
        Buffer.from('original'),
        Buffer.from('other'),
      ];
      
      const tree = new MerkleTree(leaves);
      const originalRoot = tree.root;
      
      tree.updateLeaf(0, Buffer.from('updated'));
      
      expect(tree.root.equals(originalRoot)).toBe(false);
    });

    it('should insert new leaf', () => {
      const leaves = [Buffer.from('leaf1')];
      const tree = new MerkleTree(leaves);
      const originalSize = tree.size;
      
      tree.insert(Buffer.from('leaf2'));
      
      expect(tree.size).toBe(originalSize + 1);
    });
  });

  describe('CommitmentGenerator', () => {
    const generator = new CommitmentGenerator();

    it('should create commitment', () => {
      const commitment = generator.create(1000n);
      
      expect(commitment.commitment.length).toBe(64);
      expect(commitment.value).toBe(1000n);
      expect(commitment.blinding.length).toBe(32);
    });

    it('should verify valid commitment', () => {
      const customBlinding = Buffer.alloc(32);
      customBlinding.write('blinding');
      const commitment = generator.create(5000n, customBlinding);
      
      const valid = generator.verify(commitment, 5000n, customBlinding);
      expect(valid).toBe(true);
    });

    it('should reject invalid commitment', () => {
      const commitment = generator.create(1000n);
      
      const valid = generator.verify(commitment, 2000n, commitment.blinding);
      expect(valid).toBe(false);
    });

    it('should add commitments homomorphically', () => {
      const c1 = generator.create(1000n);
      const c2 = generator.create(2000n);
      
      const combined = generator.add(c1.commitment, c2.commitment);
      
      expect(combined.length).toBe(64);
    });

    it('should create commitment with custom blinding', () => {
      const customBlinding = Buffer.from('custom-blinding-32-chars!!');
      const paddedBlinding = Buffer.alloc(32);
      customBlinding.copy(paddedBlinding);
      
      const commitment = generator.create(1000n, paddedBlinding);
      
      expect(commitment.blinding.equals(paddedBlinding)).toBe(true);
    });
  });

  describe('RangeProofGenerator', () => {
    const generator = new RangeProofGenerator();

    it('should generate range proof', () => {
      const proof = generator.generate(5000n, 0n, 10000n);
      
      expect(proof.min).toBe(0n);
      expect(proof.max).toBe(10000n);
      expect(proof.value).toBe(5000n);
    });

    it('should verify valid range proof', () => {
      const proof = generator.generate(7500n, 0n, 10000n);
      
      const valid = generator.verify(proof, 0n, 10000n);
      expect(valid).toBe(true);
    });

    it('should reject invalid range proof', () => {
      const proof = generator.generate(500n, 0n, 1000n);
      
      // Try to verify with wrong range
      const valid = generator.verify(proof, 0n, 500n);
      expect(valid).toBe(false);
    });

    it('should generate positive proof', () => {
      const proof = generator.generatePositive(100n);
      
      expect(proof.min).toBe(0n);
      expect(proof.value).toBe(100n);
    });

    it('should generate bounded proof', () => {
      const proof = generator.generateBounded(500n, 1000n);
      
      expect(proof.min).toBe(0n);
      expect(proof.max).toBe(1000n);
    });

    it('should throw for out-of-range value', () => {
      expect(() => {
        generator.generate(1500n, 0n, 1000n);
      }).toThrow();
    });
  });

  describe('StealthModule', () => {
    const stealth = new StealthModule();

    it('should generate stealth address', async () => {
      const recipientKey = toKey('recipient-key-32-characters!!!');
      const address = await stealth.generateAddress(recipientKey);
      
      expect(address.address.length).toBeGreaterThan(0);
      expect(address.ephemeralPublicKey.length).toBe(32);
      expect(address.viewKeyHint.length).toBe(32);
    });

    it('should generate payment address', async () => {
      const merchantKey = toKey('merchant-key-32-characters!!');
      const paymentAddr = await stealth.generatePaymentAddress(merchantKey);
      
      expect(paymentAddr.stealthAddress.address.length).toBeGreaterThan(0);
      expect(paymentAddr.ephemeralPublicKey.length).toBe(32);
      expect(paymentAddr.ephemeralPrivateKey.length).toBe(32);
    });

    it('should verify stealth address format', async () => {
      const recipientKey = toKey('recipient-key-32-characters!!!');
      const address = await stealth.generateAddress(recipientKey);
      
      expect(stealth.isStealthAddress(address.address)).toBe(true);
      expect(stealth.isStealthAddress('invalid-address')).toBe(false);
    });

    it('should extract ephemeral key', async () => {
      const recipientKey = toKey('recipient-key-32-characters!!!');
      const address = await stealth.generateAddress(recipientKey);
      const ephemeralKey = stealth.extractEphemeralKey(address);
      
      expect(bytesEqual(ephemeralKey, address.ephemeralPublicKey)).toBe(true);
    });

    it('should derive view key', () => {
      const privateKey = toKey('private-key-32-characters!!!!');
      const viewKey = stealth.deriveViewKey(privateKey);
      
      expect(viewKey.key.length).toBe(32);
      expect(viewKey.canViewAmounts).toBe(true);
      expect(viewKey.canViewRecipients).toBe(true);
    });

    it('should derive scan key', () => {
      const privateKey = toKey('private-key-32-characters!!!!');
      const scanKey = stealth.deriveScanKey(privateKey);
      
      expect(scanKey.key.length).toBe(32);
      expect(scanKey.canDetectPayments).toBe(true);
      expect(scanKey.canSpend).toBe(false);
    });

    it('should verify payment', async () => {
      const privateKey = toKey('recipient-key-32-characters!!!');
      const address = await stealth.generateAddress(privateKey);
      
      const valid = await stealth.verifyPayment(address, privateKey);
      expect(valid).toBe(true);
    });

    it('should reject payment verification with wrong key', async () => {
      const privateKey = toKey('recipient-key-32-characters!!!');
      const address = await stealth.generateAddress(privateKey);
      
      const wrongKey = toKey('wrong-key-32-characters!!!!');
      const valid = await stealth.verifyPayment(address, wrongKey);
      expect(valid).toBe(false);
    });
  });

  describe('StealthUtils', () => {
    it('should generate spending key', () => {
      const key = StealthUtils.generateSpendingKey();
      expect(key.length).toBe(32);
    });

    it('should generate viewing key', () => {
      const key = StealthUtils.generateViewingKey();
      expect(key.length).toBe(32);
    });

    it('should serialize and deserialize payment address', async () => {
      const stealth = new StealthModule();
      const merchantKey = toKey('merchant-key-32-characters!!');
      const original = await stealth.generatePaymentAddress(merchantKey);
      
      const serialized = StealthUtils.serializePaymentAddress(original);
      const deserialized = StealthUtils.deserializePaymentAddress(serialized);
      
      expect(deserialized.stealthAddress.address).toBe(original.stealthAddress.address);
    });
  });

  describe('EphemeralKey', () => {
    it('should generate ephemeral key pair', () => {
      const { publicKey, privateKey } = generateEphemeralKey();
      
      expect(publicKey.length).toBe(32);
      expect(privateKey.length).toBe(32);
    });

    it('should generate unique keys each time', () => {
      const key1 = generateEphemeralKey();
      const key2 = generateEphemeralKey();
      
      expect(bytesEqual(key1.publicKey, key2.publicKey)).toBe(false);
      expect(bytesEqual(key1.privateKey, key2.privateKey)).toBe(false);
    });
  });

  describe('ZK Module via SDK', () => {
    it('should create merkle tree', () => {
      const sdk = new SolanaPrivacySDK();
      const leaves = [
        new Uint8Array(32).fill(1),
        new Uint8Array(32).fill(2),
        new Uint8Array(32).fill(3),
      ];
      
      const tree = sdk.zk.createMerkleTree(leaves);
      expect(tree.root.length).toBe(32);
    });

    it('should create and verify commitment', () => {
      const sdk = new SolanaPrivacySDK();
      const blinding = new Uint8Array(32).fill(42);
      
      const commitment = sdk.zk.pedersenCommit(1000n, blinding);
      expect(commitment.commitment.length).toBe(32);
      
      const valid = sdk.zk.verifyCommitment(commitment, 1000n, blinding);
      expect(valid).toBe(true);
    });

    it('should create and verify range proof', () => {
      const sdk = new SolanaPrivacySDK();
      
      const proof = sdk.zk.proveRange(5000n, 0n, 10000n);
      expect(proof.min).toBe(0n);
      expect(proof.max).toBe(10000n);
      
      const valid = sdk.zk.verifyRangeProof(proof, 0n, 10000n);
      expect(valid).toBe(true);
    });
  });

  describe('Stealth Module via SDK', () => {
    it('should generate stealth address', async () => {
      const sdk = new SolanaPrivacySDK();
      const recipientKey = toKey('recipient-key-32-characters!!!');
      
      const address = await sdk.stealth.generateAddress(recipientKey);
      expect(address.address.startsWith('stealth_')).toBe(true);
    });

    it('should scan for payments', async () => {
      const sdk = new SolanaPrivacySDK();
      const recipientKey = toKey('recipient-key-32-characters!!!');
      
      const ephemeralKeys = [
        toKey('ephemeral-key-32-characters!!'),
        toKey('another-key-32-characters!!!!'),
      ];
      
      const payments = await sdk.stealth.scanPayments(recipientKey, ephemeralKeys);
      expect(payments.length).toBe(2);
    });
  });

  describe('Transfer Module via SDK', () => {
    it('should create private transfer', async () => {
      const sdk = new SolanaPrivacySDK();
      const recipientKey = toKey('recipient-key-32-characters!!!');
      const stealthAddress = await sdk.stealth.generateAddress(recipientKey);
      
      const transfer = await sdk.transfer.createTransfer({
        recipient: stealthAddress,
        amount: 1000000n,
        token: 'USDC',
        memo: 'Test payment',
        hideAmount: true,
        hideRecipient: true,
      });
      
      expect(transfer.transaction).toBeDefined();
      expect(transfer.metadata).toBeDefined();
    });

    it('should verify transfer', async () => {
      const sdk = new SolanaPrivacySDK();
      const recipientKey = toKey('recipient-key-32-characters!!!');
      const stealthAddress = await sdk.stealth.generateAddress(recipientKey);
      
      const transfer = await sdk.transfer.createTransfer({
        recipient: stealthAddress,
        amount: 1000000n,
        token: 'USDC',
      });
      
      const result = await sdk.transfer.verify(transfer);
      expect(result.valid).toBe(true);
    });
  });
});
