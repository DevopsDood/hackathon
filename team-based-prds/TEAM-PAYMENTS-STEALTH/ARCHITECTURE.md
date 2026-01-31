# TEAM-PAYMENTS-STEALTH Architecture

> Shared modules, dependencies, and integration patterns

## Module Dependency Graph

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    TEAM-PAYMENTS-STEALTH                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐   │
│  │  billpayx.com   │     │ thevirus.zip    │     │   shadowpay     │   │
│  │  (Primary)      │     │  (Game)         │     │   (ZK Pay)      │   │
│  └────────┬────────┘     └────────┬────────┘     └────────┬────────┘   │
│           │                       │                       │            │
│           └───────────────────────┼───────────────────────┘            │
│                                   │                                    │
│                                   ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │              SHARED STEALTH MODULES                         │       │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐│       │
│  │  │ Stealth Addr │ │ Merkle Tree  │ │ Pedersen Commitment ││       │
│  │  │  Generation  │ │  (Payment)   │ │  (Amount Privacy)   ││       │
│  │  └──────────────┘ └──────────────┘ └──────────────────────┘│       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                   │                                    │
│                                   ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │              FORKED FROM OTHER TEAMS                        │       │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐│       │
│  │  │ Kyber-768    │ │ Hybrid       │ │ ZK Circuits          ││       │
│  │  │ (Team 1)     │ │ Encryption   │ │ (Team 3)             ││       │
│  │  └──────────────┘ └──────────────┘ └──────────────────────┘│       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Shared Modules

### 1. Stealth Address Generation

**Primary Location:** `billpayx.com/src/stealth/addr.ts`

**Forks:**
- `shadowpay/src/stealth/addr.ts` → shadowpay
- `thevirus/src/stealth/addr.ts` → thevirus.zip
- `priv.pass/src/stealth/addr.ts` → priv.pass.xyz

**Usage:**
```typescript
import { generateStealthAddress, scanKey, viewKey } from '@billpay/stealth';

const { stealthAddress, scanPublicKey } = await generateStealthAddress(
  masterViewKey,
  masterSpendKey
);
```

### 2. Payment Scanner

**Primary Location:** `billpayx.com/src/stealth/scan.ts`

**Forks:**
- `shadowpay/src/stealth/scan.ts` → shadowpay

**Usage:**
```typescript
import { scanForPayments } from '@billpay/stealth/scanner';

const payments = await scanForPayments(scanKey, fromBlock);
```

### 3. Merkle Tree for Verification

**Primary Location:** `billpayx.com/src/utils/merkle.ts`

**Usage:**
```typescript
import { MerkleTree } from '@billpay/zk/merkle';

const tree = new MerkleTree(transactions);
const root = tree.root;
const proof = tree.proof(transactionId);
```

### 4. Pedersen Commitments

**Primary Location:** `shadowpay/src/zk/commitment.ts`

**Usage:**
```typescript
import { PedersenCommitment } from '@shadow/zk/commitment';

const commitment = PedersenCommitment.blind(amount, blindingFactor);
```

## Cross-Team Dependencies

### From Team 1 (PRIVACY-MESSAGING)

| Module | Path | Purpose |
|--------|------|---------|
| Kyber-768 | `choom.chat/src/crypto/kyber.ts` | Key encapsulation |
| Hybrid | `choom.chat/src/crypto/hybrid.ts` | Message encryption |

### From Team 4 (DEV-TOOLS)

| Module | Path | Purpose |
|--------|------|---------|
| Merkle Tree | `sdk-solana/src/zk/merkle.ts` | Verification |
| ChaCha20 | `sdk-solana/src/utils/crypto.ts` | Stream encryption |

### From Team 3 (ZK-PRIVACY-TECH)

| Module | Path | Purpose |
|--------|------|---------|
| ZK Circuits | `shadowpay/contracts/` | Payment proofs |
| Range Proof | `sdk-solana/src/zk/range-proof.ts` | Amount privacy |

## Technology Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                      TECHNOLOGY STACK                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FRAMEWORK              │  LANGUAGE    │  BLOCKCHAIN           │
│  ───────────────────────┼──────────────┼─────────────────────   │
│  Express (billpayx)     │  TypeScript  │  Solana               │
│  Next.js (shadowpay)    │  TypeScript  │  Aztec (planned)      │
│  Node.js (priv.pass)    │  TypeScript  │  None (local)         │
│                                                                 │
│  CRYPTO LIB             │  TESTING     │  DEPLOYMENT           │
│  ───────────────────────┼──────────────┼─────────────────────   │
│  @noble/curves          │  Jest        │  Vercel                │
│  tweetnacl              │  Mocha       │  Railway               │
│  circom (ZK)            │  Hardhat     │  Docker                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Security Architecture

### Threat Model

| Threat | Mitigation | Implementation |
|--------|------------|----------------|
| Transaction tracing | Stealth addresses | `addr.ts` |
| Amount leakage | Pedersen commitments | `commitment.ts` |
| Double spending | Merkle proofs | `merkle.ts` |
| Key compromise | View/scan separation | `keys.ts` |

### Key Management

```
┌────────────────────────────────────────────────────────────────┐
│                    KEY MANAGEMENT HIERARCHY                    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Master Spend Key (Cold Storage)                               │
│      │                                                         │
│      ├── Derived Spend Keys (Per transaction)                  │
│      │     └── Stealth Public Keys                             │
│      │                                                           │
│      └── Master View Key (Read-only)                           │
│            └── Derived Scan Keys                               │
│                                                                │
│  Key Separation:                                               │
│  - Can view all transactions with view key                     │
│  - Cannot spend with view key alone                            │
│  - Need both keys + private metadata to spend                  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## Performance Targets

| Operation | Target | Current |
|-----------|--------|---------|
| Stealth Gen | < 50ms | 45ms |
| Scan Payments | < 100ms | 85ms |
| Merkle Proof | < 20ms | 15ms |
| ZK Proof Gen | < 2s | 1.5s |

## Testing Strategy

```
┌────────────────────────────────────────────────────────────────┐
│                    TESTING PYRAMID                             │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│                        ┌─────────┐                             │
│                        │   E2E   │  ← Integration tests        │
│                        │  Tests  │    (Cypress)                │
│                       ┌┴─────────┴┐                            │
│                       │  Unit     │  ← Component tests         │
│                       │  Tests    │    (Jest)                  │
│                      ┌┴───────────┴┐                           │
│                      │ Crypto      │  ← Module tests           │
│                      │ Tests       │    (100% coverage)        │
│                     ┌┴─────────────┴┐                          │
│                     │ Fuzzing       │  ← Security tests        │
│                     │ & Audit       │    (Custom fuzzers)      │
│                     └───────────────┘                          │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## Related Documents

- [README.md](./README.md) - Team overview
- [PRD-billpayx.com.md](./PRD-billpayx.com.md) - Domain requirements
- [SUBMISSION-billpayx.com.md](./SUBMISSION-billpayx.com.md) - Submission template
- Source: `TIER1_PRIORITY/billpayx.com/src/stealth/`

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-31

