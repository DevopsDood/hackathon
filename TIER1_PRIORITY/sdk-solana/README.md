# SDK-Solana (@thegit/solana)

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://www.npmjs.com/package/@thegit/solana)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)

**Prize Category:** Helius - Best Privacy ($5K) + Quicknode - Open Source ($3K) + Helius - Privacy Toolkit ($5K)  
**Total Potential:** $13K  
**Status:** ✅ SUBMISSION READY

A comprehensive privacy-focused SDK for Solana blockchain development. Provides zero-knowledge primitives, stealth addresses, and private transaction utilities.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Modules](#modules)
  - [ZK Module](#zk-module)
  - [Stealth Module](#stealth-module)
  - [Transfer Module](#transfer-module)
- [Usage Examples](#usage-examples)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Competition Fit](#competition-fit)
- [License](#license)

---

## Features

- **🔒 ZK Primitives**: Merkle trees, Pedersen commitments, range proofs
- **👤 Stealth Addresses**: Private payment recipients
- **💸 Private Transfers**: Hide amounts and recipients
- **🔍 Compliance**: View keys for auditors
- **📘 TypeScript**: Full type safety and IntelliSense
- **🧩 Modular**: Use only what you need
- **⚡ Fast**: Optimized for Solana's high performance
- **🛡️ Secure**: Uses @noble cryptographic libraries

---

## Installation

```bash
npm install @thegit/solana
```

**Requirements:**
- Node.js >= 18.0.0
- TypeScript >= 5.2.0 (for TypeScript projects)

---

## Quick Start

```typescript
import { SolanaPrivacySDK } from '@thegit/solana';

// Initialize SDK
const sdk = new SolanaPrivacySDK({
  network: 'devnet',
  rpcUrl: 'https://api.devnet.solana.com'
});

// Create stealth address
const recipientKey = new Uint8Array(32);
crypto.getRandomValues(recipientKey);

const stealth = await sdk.stealth.generateAddress(recipientKey);
console.log('Stealth address:', stealth.address);

// Generate ZK commitment
const blinding = sdk.zk.generateBlinding();
const commitment = sdk.zk.pedersenCommit(1000n, blinding);
console.log('Commitment:', commitment.commitment);

// Create range proof
const proof = sdk.zk.proveRange(1000n, 0n, 10000n);
console.log('Range proof valid:', sdk.zk.verifyRangeProof(proof, 0n, 10000n));
```

---

## Modules

### ZK Module

Zero-knowledge primitives for privacy-preserving operations.

```typescript
import { ZKModule } from '@thegit/solana';

const zk = new ZKModule();

// Merkle tree for membership proofs
const leaves = [
  new Uint8Array(32).fill(1),
  new Uint8Array(32).fill(2),
];
const tree = zk.createMerkleTree(leaves);
const proof = tree.generateProof(leaves[0]);
const valid = tree.verifyProof(leaves[0], proof);

// Pedersen commitment
const commitment = zk.pedersenCommit(1000n, blinding);
const isValid = zk.verifyCommitment(commitment, 1000n, blinding);

// Range proof
const rangeProof = zk.proveRange(5000n, 0n, 10000n);
const inRange = zk.verifyRangeProof(rangeProof, 0n, 10000n);
```

#### ZK Module Methods

| Method | Description |
|--------|-------------|
| `createMerkleTree(leaves)` | Create Merkle tree from leaves |
| `verifyMerkleProof(leaf, proof, root)` | Verify Merkle proof |
| `pedersenCommit(value, blinding)` | Create commitment to value |
| `verifyCommitment(commitment, value, blinding)` | Verify commitment |
| `proveRange(value, min, max)` | Generate range proof |
| `verifyRangeProof(proof, min, max)` | Verify range proof |
| `generateBlinding()` | Generate random blinding factor |
| `poseidonHash(inputs)` | ZK-friendly hash |
| `pedersenHash(inputs)` | Pedersen hash |

---

### Stealth Module

Stealth address generation and payment scanning for private payments.

```typescript
import { StealthModule, StealthUtils } from '@thegit/solana';

const stealth = new StealthModule();

// Generate ephemeral keys
const { ephemeralPublicKey, stealthAddress } = 
  await stealth.generatePaymentAddress(merchantPublicKey);

// Scan for payments
const payments = await stealth.scanPayments(
  merchantPrivateKey,
  ephemeralPublicKeys
);

// View keys for auditors
const viewKey = stealth.deriveViewKey(merchantPrivateKey);
```

#### Stealth Module Methods

| Method | Description |
|--------|-------------|
| `generateAddress(recipientPublicKey)` | Generate stealth address |
| `generatePaymentAddress(merchantPublicKey)` | Generate payment address with keys |
| `scanPayments(privateKey, ephemeralPublicKeys)` | Scan for payments |
| `deriveViewKey(privateKey)` | Derive view key |
| `deriveScanKey(privateKey)` | Derive scan key |
| `verifyPayment(stealthAddress, privateKey)` | Verify payment ownership |
| `isStealthAddress(address)` | Check if valid stealth format |
| `extractEphemeralKey(stealthAddress)` | Extract ephemeral key |

#### StealthUtils

```typescript
// Generate keys
const spendingKey = StealthUtils.generateSpendingKey();
const viewingKey = StealthUtils.generateViewingKey();

// Serialize/deserialize
const serialized = StealthUtils.serializePaymentAddress(paymentAddress);
const deserialized = StealthUtils.deserializePaymentAddress(serialized);
```

---

### Transfer Module

Private transfer creation and verification.

```typescript
import { TransferModule } from '@thegit/solana';

const transfer = new TransferModule();

// Create private transfer
const tx = await transfer.createTransfer({
  recipient: stealthAddress,
  amount: 1000000n,  // 1 USDC
  token: 'USDC',
  memo: 'Invoice #12345',
  hideAmount: true,
  hideRecipient: true,
});

// Verify transfer
const result = await transfer.verify(tx);
console.log('Valid:', result.valid);

// Decode with view key
const decoded = await transfer.decode(tx, viewKey);
console.log('Amount:', decoded.amount);
```

#### Transfer Module Methods

| Method | Description |
|--------|-------------|
| `createTransfer(params)` | Create private transfer |
| `send(transaction, signer)` | Send transaction |
| `verify(transaction)` | Verify transaction |
| `decode(transaction, viewKey)` | Decode with view key |

---

## Usage Examples

### Complete Privacy Flow

```typescript
import { 
  SolanaPrivacySDK, 
  createDevnetSDK,
  bytesEqual 
} from '@thegit/solana';

async function privatePayment() {
  // Initialize SDK
  const sdk = createDevnetSDK();
  
  // Recipient setup
  const recipientKey = new Uint8Array(32);
  crypto.getRandomValues(recipientKey);
  
  // 1. Create stealth address
  const stealthAddress = await sdk.stealth.generateAddress(recipientKey);
  console.log('Stealth address:', stealthAddress.address);
  
  // 2. Create commitment for amount
  const blinding = sdk.zk.generateBlinding();
  const commitment = sdk.zk.pedersenCommit(1000n, blinding);
  
  // 3. Create range proof
  const rangeProof = sdk.zk.proveRange(1000n, 0n, 10000n);
  
  // 4. Create private transfer
  const transfer = await sdk.transfer.createTransfer({
    recipient: stealthAddress,
    amount: 1000n,
    token: 'USDC',
    memo: 'Private payment',
    hideAmount: true,
    hideRecipient: true,
  });
  
  // 5. Verify transfer
  const result = await sdk.transfer.verify(transfer);
  console.log('Transfer valid:', result.valid);
  
  // 6. Recipient scans for payments
  const ephemeralKeys = [stealthAddress.ephemeralPublicKey];
  const payments = await sdk.stealth.scanPayments(recipientKey, ephemeralKeys);
  console.log('Detected payments:', payments.length);
  
  return { stealthAddress, transfer, payments };
}

privatePayment().catch(console.error);
```

### Merkle Tree for NFT Ownership

```typescript
import { SolanaPrivacySDK } from '@thegit/solana';

const sdk = new SolanaPrivacySDK({ network: 'devnet', rpcUrl: '...' });

// Create Merkle tree of NFT owners
const owners = [
  hashSHA256(Buffer.from('owner1')),
  hashSHA256(Buffer.from('owner2')),
  hashSHA256(Buffer.from('owner3')),
];

const tree = sdk.zk.createMerkleTree(owners);

// Generate proof for owner
const proof = tree.generateProof(owners[0]);

// Verify ownership without revealing which NFT
const isOwner = tree.verifyProof(owners[0], proof);
```

### Compliance with View Keys

```typescript
import { SolanaPrivacySDK } from '@thegit/solana';

const sdk = new SolanaPrivacySDK({ network: 'mainnet-beta', rpcUrl: '...' });

// Merchant creates view key for auditor
const merchantKey = new Uint8Array(32);
crypto.getRandomValues(merchantKey);

const viewKey = sdk.stealth.deriveViewKey(merchantKey);

// Auditor can scan payments
const auditorPayments = await sdk.stealth.scanPayments(viewKey.key, ephemeralKeys);

// But cannot spend
console.log(viewKey.canViewAmounts);   // true
console.log(viewKey.canViewRecipients); // true
```

---

## API Documentation

Complete API reference available at [docs/API.md](docs/API.md)

Key sections:
- [SolanaPrivacySDK](docs/API.md#solanaprivacysdk)
- [ZK Module](docs/API.md#zk-module)
- [Stealth Module](docs/API.md#stealth-module)
- [Transfer Module](docs/API.md#transfer-module)
- [Utilities](docs/API.md#utilities)
- [Error Handling](docs/API.md#error-handling)

---

## Testing

```bash
# Run all tests
npm test

# Run specific module tests
npm run test:zk
npm run test:stealth
npm run test:transfer

# Run with coverage
npm run test:coverage
```

---

## Competition Fit

### Helius - Best Privacy ($5K)

**Why we fit:**
- Complete privacy toolkit for Solana
- ZK primitives for confidential transactions
- Stealth addresses for unlinkable payments
- Production-ready code with TypeScript

**Privacy Features:**
- Hide transaction amounts (Pedersen commitments)
- Hide recipients (stealth addresses)
- Prove value ranges without revealing (range proofs)
- Membership proofs without revealing member (Merkle trees)

### Quicknode - Open Source ($3K)

**Why we fit:**
- MIT licensed open source SDK
- Comprehensive documentation
- Full TypeScript type definitions
- Modular architecture for easy extension

**Open Source Qualities:**
- Clean, well-documented code
- Comprehensive test suite
- Developer-friendly API
- Active maintenance

### Helius - Privacy Toolkit ($5K)

**Why we fit:**
- Modular architecture (use only needed features)
- Easy integration (npm install @thegit/solana)
- Type-safe APIs (full TypeScript support)
- Developer-friendly documentation

**Toolkit Features:**
| Feature | Module | Status |
|---------|--------|--------|
| Merkle Trees | ZK | ✅ Complete |
| Pedersen Commitments | ZK | ✅ Complete |
| Range Proofs | ZK | ✅ Complete |
| Stealth Addresses | Stealth | ✅ Complete |
| View Keys | Stealth | ✅ Complete |
| Private Transfers | Transfer | ✅ Complete |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      SDK-Solana Architecture                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Application Layer                      │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │  │
│  │  │ DeFi Apps   │  │ Wallets     │  │ Privacy Tools   │  │  │
│  │  └──────┬──────┘  └──────┬──────┘  └────────┬────────┘  │  │
│  │         └────────────────┼───────────────────┘           │  │
│  │                          ▼                               │  │
│  │         ┌──────────────────────────────────────────┐    │  │
│  │         │         SolanaPrivacySDK (Main)          │    │  │
│  │         │  ┌──────────────┐  ┌──────────────────┐  │    │  │
│  │         │  │ Config       │  │ Event Emitter    │  │    │  │
│  │         │  │ - Network    │  │ - State Changes  │  │    │  │
│  │         │  │ - RPC URL    │  │ - Error Handling │  │    │  │
│  │         │  └──────────────┘  └──────────────────┘  │    │  │
│  │         └────────────────────┬─────────────────────┘    │  │
│  └──────────────────────────────┼───────────────────────────┘  │
│                                 │                               │
│  ┌──────────────────────────────┼───────────────────────────┐  │
│  │                     Core Modules                         │  │
│  │                                                          │  │
│  │  ┌─────────────────┐  ┌───────────────────────────────┐ │  │
│  │  │   ZK Module     │  │     Stealth Module            │ │  │
│  │  │ ┌─────────────┐ │  │ ┌───────────────────────────┐ │ │  │
│  │  │ │ Merkle Tree │ │  │ │ StealthAddressGenerator   │ │ │  │
│  │  │ │ Commitments │ │  │ │ PaymentScanner            │ │ │  │
│  │  │ │ Range Proofs│ │  │ │ ViewKeyManager            │ │ │  │
│  │  │ │ Hash Utils  │ │  │ │ EphemeralKeyGenerator     │ │ │  │
│  │  │ └─────────────┘ │  │ └───────────────────────────┘ │ │  │
│  │  └─────────────────┘  └───────────────────────────────┘ │  │
│  │                                                          │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │              Private Transfer Module                │ │  │
│  │  │  ┌─────────────┐  ┌──────────────┐  ┌────────────┐ │ │  │
│  │  │  │ Transaction │  │ Amount Hider │  │ Memo Enc   │ │ │  │
│  │  │  │ Builder     │  │ (Range Proof)│  │ (AES-256)  │ │ │  │
│  │  │  └─────────────┘  └──────────────┘  └────────────┘ │ │  │
│  │  └─────────────────────────────────────────────────────┘ │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                 │                               │
│                                 ▼                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Solana Blockchain                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Version

```typescript
import { VERSION, PACKAGE_NAME } from '@thegit/solana';

console.log(PACKAGE_NAME); // '@thegit/solana'
console.log(VERSION);      // '1.0.0'
```

---

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Support

- 📧 Email: hello@thegit.network
- 🐛 Issues: [GitHub Issues](https://github.com/thegit/solana-sdk/issues)
- 📖 Docs: [API Documentation](docs/API.md)

---

**Built with ❤️ by thegit.network**
