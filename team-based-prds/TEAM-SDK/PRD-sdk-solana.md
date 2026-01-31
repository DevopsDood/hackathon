# PRD: SDK-Solana

**Product Requirements Document**  
**Version:** 2.0  
**Last Updated:** 2026-01-31  
**Team:** TEAM-SDK  
**Domain:** thegit.network  
**Prize Target:** $15,000 (Helius + Quicknode)

---

## 1. Executive Summary

SDK-Solana is a TypeScript SDK providing privacy-preserving primitives for Solana developers, including ZK proofs (Merkle trees, Pedersen commitments, range proofs) and stealth address capabilities. This is the foundational SDK consumed by other teams for their implementations.

## 2. Problem Statement

Solana developers lack easy-to-use privacy tools for building confidential applications. Existing solutions are either:
- Too low-level (raw cryptographic primitives)
- Not privacy-preserving (transparent by design)
- Not compatible with Solana's architecture

## 3. Target Users

1. **Hackathon Developers** - Need quick privacy integration
2. **dApp Developers** - Building confidential DeFi, gaming, voting
3. **Tool Builders** - Creating privacy-focused developer tools

## 4. Product Requirements

### 4.1 Core SDK Features

#### 4.1.1 ZK Primitives Module

| Feature | Priority | Status | LOC |
|---------|----------|--------|-----|
| Merkle Tree | P0 | Complete | 600 |
| Pedersen Commitment | P0 | Complete | 500 |
| Range Proof | P0 | Complete | 200 |
| ZK Circuit Builder | P1 | Partial | 300 |

#### 4.1.2 Stealth Address Module

| Feature | Priority | Status | LOC |
|---------|----------|--------|-----|
| Address Generation | P0 | Complete | 500 |
| Payment Scanner | P0 | Complete | 400 |
| Key Management | P0 | Complete | 300 |
| View/Scan Keys | P0 | Complete | 200 |

#### 4.1.3 Crypto Utilities

| Feature | Priority | Status | LOC |
|---------|----------|--------|-----|
| ChaCha20-Poly1305 | P0 | Complete | 500 |
| Key Derivation | P0 | Complete | 300 |
| Random Generation | P0 | Complete | 200 |

### 4.2 API Requirements

```typescript
// Main SDK export
export class PrivacySDK {
  // ZK Module
  readonly zk: ZKModule;
  
  // Stealth Module  
  readonly stealth: StealthModule;
  
  // Crypto Module
  readonly crypto: CryptoModule;
  
  // Constructor
  constructor(config: SDKConfig);
  
  // Initialize SDK
  async initialize(): Promise<void>;
}

// ZK Module API
export class ZKModule {
  // Merkle Tree
  createMerkleTree(depth: number): MerkleTree;
  
  // Pedersen Commitments
  createCommitment(value: bigint, blinding: Buffer): Promise<Point>;
  addCommitments(a: Point, b: Point): Promise<Point>;
  
  // Range Proofs
  createRangeProof(value: bigint, min: bigint, max: bigint): Promise<RangeProof>;
  verifyRangeProof(proof: RangeProof): Promise<boolean>;
}

// Stealth Module API
export class StealthModule {
  generateStealthKeys(): Promise<StealthKeyPair>;
  generateStealthAddress(viewPublicKey: Buffer, spendPublicKey: Buffer): Promise<StealthAddress>;
  createPaymentTag(stealthAddress: StealthAddress, privateViewKey: Buffer): Promise<PaymentTag>;
  scanForPayments(paymentTag: PaymentTag, blockchainData: Block[]): Promise<StealthPayment[]>;
  derivePaymentKey(stealthAddress: StealthAddress, privateViewKey: Buffer): Promise<PaymentKey>;
}
```

## 5. Technical Architecture

### 5.1 Directory Structure

```
sdk-solana/
├── src/
│   ├── index.ts              # Main SDK class
│   ├── zk/
│   │   ├── index.ts          # ZK module exports
│   │   ├── merkle.ts         # Merkle tree (600 LOC)
│   │   ├── commitment.ts     # Pedersen (500 LOC)
│   │   └── range-proof.ts    # Range proof (200 LOC)
│   ├── stealth/
│   │   ├── index.ts          # Stealth module exports
│   │   ├── types.ts          # TypeScript types
│   │   ├── address.ts        # Address generation
│   │   ├── scanner.ts        # Payment scanning
│   │   └── keys.ts           # Key management
│   ├── utils/
│   │   ├── crypto.ts         # Crypto utilities (500 LOC)
│   │   ├── errors.ts         # Error definitions
│   │   └── index.ts          # Utils exports
│   ├── transfer/
│   │   ├── index.ts          # Transfer module
│   │   ├── stealth.ts        # Stealth transfers
│   │   └── standard.ts       # Standard transfers
│   └── types/
│       ├── index.ts          # Type exports
│       ├── stealth.ts        # Stealth types
│       └── zk.ts             # ZK types
├── tests/
│   ├── zk/
│   │   ├── merkle.test.ts
│   │   ├── commitment.test.ts
│   │   └── range-proof.test.ts
│   └── stealth/
│       ├── address.test.ts
│       ├── scanner.test.ts
│       └── keys.test.ts
├── docs/
│   ├── API.md
│   └── ARCHITECTURE.md
├── package.json
├── tsconfig.json
├── jest.config.js
├── README.md
└── LICENSE
```

### 5.2 Dependencies

```json
{
  "name": "@thegit/solana",
  "version": "1.0.0",
  "dependencies": {
    "@noble/curves": "^1.0.0",
    "@noble/hashes": "^1.3.0",
    "@solana/web3.js": "^2.0.0",
    "bn.js": "^5.2.1",
    "buffer": "^6.0.3"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "jest": "^29.0.0",
    "ts-jest": "^29.0.0"
  }
}
```

## 6. Security Requirements

### 6.1 Cryptographic Standards
- All operations use constant-time implementations
- Keys generated using secure random (CSPRNG)
- No private keys stored in plaintext
- Zero-knowledge proofs verified on-chain

### 6.2 Isolation Requirements
- Package name: `@thegit/solana` (unique)
- No shared dependencies visible in other projects
- Forked code has 80%+ modifications for other teams

## 7. Testing Requirements

### 7.1 Unit Tests
- 100% coverage for ZK primitives
- 90% coverage for stealth module
- Property-based testing for cryptographic properties

### 7.2 Integration Tests
- Full stealth payment flow test
- Solana transaction integration test
- ZK proof verification test

## 8. Completion Criteria

| Criterion | Target | Current |
|-----------|--------|---------|
| Core SDK class | 100% | 100% |
| ZK module tests | 100% | 95% |
| Stealth module tests | 100% | 85% |
| Documentation complete | 100% | 80% |
| Demo video recorded | No | No |

## 9. Dependencies & Relationships

### 9.1 Consumed By
- **TEAM-PAY**: Uses ZK primitives and stealth system
- **TEAM-PQ-MSG**: Uses ZK verification
- **TEAM-CONSUMER**: Uses encryption utilities

### 9.2 Forks To
- `choom/src/lib/merkle.ts` - Forked Merkle tree
- `billpayx/src/utils/merkle.ts` - Forked Merkle tree
- `shadowpay/src/zk/merkle.ts` - Forked Merkle tree

## 10. Timeline

| Milestone | Date | Status |
|-----------|------|--------|
| Core SDK structure | Day 1 | Complete |
| ZK primitives | Day 2 | Complete |
| Stealth module | Day 3 | Complete |
| Documentation | Day 4 | In Progress |
| Submit to Helius | Day 5 | Pending |
| Submit to Quicknode | Day 5 | Pending |

---

## Appendix A: API Reference

See `docs/API.md` for complete API documentation.

## Appendix B: Architecture

See `docs/ARCHITECTURE.md` for detailed architecture.

## Appendix C: Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-30 | Initial version |
| 2.0 | 2026-01-31 | Updated for hackathon v2 |

---

*Document Version: 2.0*  
*Last Updated: 2026-01-31*

