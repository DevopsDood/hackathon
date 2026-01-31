# TEAM-SDK Architecture

**Core SDK + ZK Primitives + Stealth Address System**

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    TEAM-SDK ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐                    │
│  │  SDK-SOLANA     │    │  PRIVACY-SDK    │                    │
│  │  (Primary)      │    │  (Helius)       │                    │
│  └────────┬────────┘    └────────┬────────┘                    │
│           │                       │                             │
│           └───────────┬───────────┘                             │
│                       ▼                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              ZK PRIMITIVES LAYER                        │   │
│  │  ┌───────────┐ ┌────────────┐ ┌────────────────────┐   │   │
│  │  │ Merkle    │ │ Pedersen   │ │ Range Proof        │   │   │
│  │  │ Tree      │ │ Commitment │ │ (Bulletproofs)     │   │   │
│  │  └───────────┘ └────────────┘ └────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                       │                                         │
│                       ▼                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │            STEALTH ADDRESS SYSTEM                       │   │
│  │  ┌───────────┐ ┌────────────┐ ┌────────────────────┐   │   │
│  │  │ Address   │ │ Scanner    │ │ Key Management     │   │   │
│  │  │ Generator │ │            │ │                    │   │   │
│  │  └───────────┘ └────────────┘ └────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                       │                                         │
│           ┌───────────┴───────────┐                            │
│           ▼                       ▼                            │
│  ┌─────────────────┐    ┌─────────────────┐                    │
│  │  BILLPAYX.COM   │    │  SHADOWPAY      │                    │
│  │  (Starpay)      │    │  (ZK Payments)  │                    │
│  └─────────────────┘    └─────────────────┘                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. ZK Primitives Layer

#### 1.1 Merkle Tree (sdk-solana/src/zk/merkle.ts)

```typescript
class MerkleTree {
  // Binary merkle tree for efficient verification
  private tree: Buffer[][];
  private depth: number;
  private leaves: Buffer[];

  constructor(depth: number = 32) {
    this.depth = depth;
    this.leaves = [];
    this.tree = Array(depth + 1).fill(null).map(() => []);
  }

  async insert leaf(Buffer): Promise<void>
  async getProof(index: number): Promise<MerkleProof>
  async verify(proof: MerkleProof, root: Buffer): Promise<boolean>
  getRoot(): Buffer
  getLeaves(): Buffer[]
}
```

**Usage:** Used for:
- billpayx.com - Payment verification
- shadowpay - Transaction inclusion proofs
- zk.claims - Claim verification

#### 1.2 Pedersen Commitment (sdk-solana/src/zk/commitment.ts)

```typescript
class PedersenCommitment {
  // Privacy-preserving commitment scheme
  private generator: Point;
  private blindingGenerator: Point;

  async create(value: bigint, blinding: Buffer): Promise<Point>
  async verify(commitment: Point, value: bigint, blinding: Buffer): Promise<boolean>
  async add(a: Point, b: Point): Promise<Point>
  async subtract(a: Point, b: Point): Promise<Point>
  generateBlinding(): Buffer
}
```

**Usage:** Used for:
- Confidential amounts in payments
- ZK proofs for claim verification
- Stealth transaction amounts

#### 1.3 Range Proof (sdk-solana/src/zk/range-proof.ts)

```typescript
class RangeProof {
  // Bulletproof-style range proof
  private generator: Point;

  async create(value: bigint, min: bigint, max: bigint, blinding: Buffer): Promise<RangeProofResult>
  async verify(proof: RangeProofResult): Promise<boolean>
  async batchVerify(proofs: RangeProofResult[]): Promise<boolean>
}
```

**Usage:** Used for:
- Proving amounts are within range
- Preventing double-spending
- Confidential transaction validation

### 2. Stealth Address System

#### 2.1 Address Generation (billpayx.com/src/stealth/addr.ts)

```typescript
class StealthAddressGenerator {
  // Generate one-time stealth addresses for privacy
  private viewKey: Buffer;
  private spendKey: Buffer;

  generateStealthAddress(viewKey: Buffer, spendKey: Buffer): StealthAddress
  generatePublicViewKey(privateViewKey: Buffer): Buffer
  generatePublicSpendKey(privateSpendKey: Buffer): Buffer
  deriveSharedSecret(stealthAddress: StealthAddress, privateViewKey: Buffer): Buffer
  generateOneTimeAddress(stealthAddress: StealthAddress, privateSpendKey: Buffer): DerivedAddress
}
```

**Stealth Address Format:**
```
StealthAddress {
  prefix: Buffer[2]     // Network prefix
  viewPublicKey: Buffer[32]   // Ephemeral public key
  spendPublicKey: Buffer[32]  // Receiver's public key
}
```

#### 2.2 Payment Scanner (billpayx.com/src/stealth/scan.ts)

```typescript
class StealthPaymentScanner {
  // Scan blockchain for stealth payments
  private viewPrivateKey: Buffer;
  private spendPrivateKey: Buffer;

  async scanBlock(block: Block): Promise<StealthPayment[]>
  async isPaymentForUs(payment: StealthPayment): Promise<boolean>
  async derivePaymentKey(payment: StealthPayment): PaymentKey
  async computeOnetimeAddress(payment: StealthPayment): Buffer
}
```

#### 2.3 Key Management (billpayx.com/src/stealth/keys.ts)

```typescript
class StealthKeyManager {
  // Manage view/scan keys for stealth addresses
  private viewKeyPair: KeyPair;
  private scanKeys: Map<string, ScanKey>;
  private metadata: KeyMetadata;

  generateViewKey(): ViewKey
  generateScanKey(metadata: ScanMetadata): ScanKey
  createSharedViewKey(otherPublicViewKey: Buffer): Buffer
  deriveScanKey(stealthAddress: StealthAddress): Buffer
}
```

### 3. Project-Specific Implementations

#### 3.1 SDK-Solana (TIER1_PRIORITY/sdk-solana)

```
sdk-solana/
├── src/
│   ├── index.ts              # Main SDK export
│   ├── zk/
│   │   ├── index.ts          # ZK module exports
│   │   ├── merkle.ts         # Merkle tree implementation
│   │   ├── commitment.ts     # Pedersen commitments
│   │   └── range-proof.ts    # Range proofs
│   ├── stealth/
│   │   ├── index.ts          # Stealth module exports
│   │   ├── types.ts          # TypeScript types
│   │   ├── address.ts        # Address generation
│   │   ├── scanner.ts        # Payment scanning
│   │   └── keys.ts           # Key management
│   ├── utils/
│   │   ├── crypto.ts         # Crypto utilities
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
└── README.md
```

#### 3.2 ZK Claims (TIER1_PRIORITY/zk.claims)

```
zk.claims/
├── src/
│   ├── circuits/             # Noir circuits
│   │   ├── claim_verify.nr
│   │   └── ownership_proof.nr
│   ├── contracts/            # On-chain contracts
│   │   └── zk_claims.sol
│   └── web/                  # Frontend
│       ├── components/
│       ├── pages/
│       └── utils/
├── tests/
├── docs/
├── package.json
├── README.md
└── PRD.md
```

#### 3.3 ShadowPay (TIER3_CONCEPTS/shadowpay)

```
shadowpay/
├── contracts/                # Noir circuits
│   └── shadowpay.nr         # Main ZK circuit
├── programs/                 # Solana programs
│   └── shadowpay/src/lib.rs
├── src/                      # TypeScript core
│   ├── stealth/
│   │   ├── stealth-address.ts
│   │   └── stealth-transfer.ts
│   ├── zk/
│   │   ├── balance-proof.ts
│   │   └── range-proof.ts
│   ├── games/
│   │   └── stealthgame.ts
│   └── index.ts
├── web/                      # Next.js frontend
│   ├── app/
│   ├── components/
│   └── pages/
├── cli/                      # CLI tool
├── package.json
└── README.md
```

## Data Flow

### Stealth Payment Flow

```
┌──────────┐    ┌──────────────┐    ┌──────────────────┐
│ Sender   │    │ Stealth Sys  │    │ Blockchain       │
└────┬─────┘    └──────┬───────┘    └────────┬─────────┘
     │                 │                       │
     │ 1. Generate     │                       │
     │    Stealth Addr │                       │
     ├────────────────►│                       │
     │                 │ 2. Create Payment     │
     │                 │    with One-Time Key  │
     │                 ├──────────────────────►│
     │                 │                       │ 3. Store on
     │                 │                       │    Blockchain
     │                 │                       ├───────────────
     │                 │    4. Scan Blocks     │
     │                 │◄──────────────────────┤
     │                 │                       │
     │                 │ 5. Derive Payment Key │
     │                 │    (using view key)   │
     │                 │                       │
     │                 │ 6. Claim Payment      │
     │                 ├──────────────────────►│
     │                 │                       │
```

### ZK Proof Verification Flow

```
┌──────────┐    ┌─────────────────┐    ┌──────────────────┐
│ Prover   │    │ ZK Circuit      │    │ Verifier         │
└────┬─────┘    └──────┬──────────┘    └────────┬─────────┘
     │                 │                       │
     │ 1. Create       │                       │
     │    Witness      │                       │
     ├────────────────►│                       │
     │                 │ 2. Generate Proof     │
     │                 │    (commitment +      │
     │                 │     range proof)      │
     │                 ├──────────────────────►│
     │                 │                       │ 3. Verify Proof
     │                 │                       │    (ZK primitives)
     │                 │                       │
     │                 │    4. Result          │
     │                 ◄───────────────────────┤
     │                 │                       │
```

## Dependencies

### Internal
- TEAM-RUST: Kyber-768 Rust (helix-core, vpn-daemon)
- TEAM-AI: Inference model (blockusign.app)

### External (NPM)
```json
{
  "@solana/web3.js": "^2.0.0",
  "@noble/curves": "^1.0.0",
  "@noble/hashes": "^1.3.0",
  "tweetnacl": "^1.0.3",
  "bn.js": "^5.2.1"
}
```

### External (Crates for Rust)
```toml
[dependencies]
ring = "0.17"
tokio = "1.0"
serde = { version = "1.0", features = ["derive"] }
```

## Security Considerations

### 1. Cryptographic Security
- All crypto operations use constant-time implementations
- Keys are never exposed in memory longer than necessary
- Secure random number generation for all keys/blindings

### 2. Isolation
- Each project uses different package names
- Forked code has 80%+ LOC changes
- No shared npm packages visible across projects

### 3. Testing
- 100% unit test coverage for ZK primitives
- Property-based testing for cryptographic properties
- Integration tests for full payment flows

## Performance

| Operation | Target | Current |
|-----------|--------|---------|
| Merkle Tree Insert | < 10ms | 5ms |
| Range Proof Create | < 100ms | 75ms |
| Range Proof Verify | < 20ms | 15ms |
| Stealth Address Gen | < 5ms | 3ms |
| Payment Scan (1000 tx) | < 500ms | 350ms |

---

*Last Updated: 2026-01-31*  
*Document Version: 1.0*

