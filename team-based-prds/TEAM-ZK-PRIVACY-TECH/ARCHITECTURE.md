# TEAM-ZK-PRIVACY-TECH Architecture

> Shared modules, dependencies, and integration patterns

## Module Dependency Graph

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    TEAM-ZK-PRIVACY-TECH                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐   │
│  │ contractreg.io  │     │ deidentify.ai   │     │   zk-email      │   │
│  │  (ZK Claims)    │     │  (AI Privacy)   │     │   (Email ZK)    │   │
│  └────────┬────────┘     └────────┬────────┘     └────────┬────────┘   │
│           │                       │                       │            │
│           └───────────────────────┼───────────────────────┘            │
│                                   │                                    │
│                                   ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │              SHARED ZK MODULES                              │       │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐│       │
│  │  │ Noir Circuits│ │ Pedersen     │ │ Range Proofs         ││       │
│  │  │  (Noir)      │ │ Commitment   │ │  (Bulletproofs)      ││       │
│  │  └──────────────┘ └──────────────┘ └──────────────────────┘│       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                   │                                    │
│                                   ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │              FORKED FROM OTHER TEAMS                        │       │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐│       │
│  │  │ Merkle Tree  │ │ ChaCha20     │ │ Stealth Addresses    ││       │
│  │  │ (Team 4)     │ │ (Team 4)     │ │ (Team 2)             ││       │
│  │  └──────────────┘ └──────────────┘ └──────────────────────┘│       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Shared Modules

### 1. ZK Circuits (Noir)

**Primary Location:** `TIER3_CONCEPTS/shadowpay/contracts/`

**Forks:**
- `zk.claims/contracts/` → contractregistry.io
- `deidentify.ai/circuits/` → deidentify.ai

**Usage:**
```typescript
import { compileNoirCircuit } from '@zk/circuits';

const circuit = await compileNoirCircuit('identity_proof');
const proof = await generateProof(circuit, witness);
```

### 2. Pedersen Commitments

**Primary Location:** `sdk-solana/src/zk/commitment.ts`

**Usage:**
```typescript
import { PedersenCommitment } from '@sdk/zk/commitment';

const commit = PedersenCommitment.create(value, blinding);
const open = PedersenCommitment.open(commit, value, blinding);
```

### 3. Range Proofs

**Primary Location:** `sdk-solana/src/zk/range-proof.ts`

**Usage:**
```typescript
import { RangeProof } from '@sdk/zk/range-proof';

const proof = RangeProof.create(value, blinding, min, max);
const valid = RangeProof.verify(proof, min, max);
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                      TECHNOLOGY STACK                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FRAMEWORK              │  ZK FRAMEWORK  │  LANGUAGE            │
│  ───────────────────────┼────────────────┼──────────────────    │
│  Next.js (zk.claims)    │  Noir          │  Rust (circuits)     │
│  Node.js (zk-email)     │  Circom        │  TypeScript          │
│  Express (deidentify)   │  Gnark         │  JavaScript          │
│                                                                 │
│  BLOCKCHAIN             │  TESTING       │  CRYPTO LIB          │
│  ───────────────────────┼────────────────┼──────────────────    │
│  Aztec (planned)        │  Jest          │  @noble/curves       │
│  Solana (verification)  │  Mocha         │  @noble/hashes       │
│  Ethereum (contracts)   │  Hardhat       │  circomlib           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Security Architecture

### Threat Model

| Threat | Mitigation | Implementation |
|--------|------------|----------------|
| Proof forgery | ZK circuit soundness | Noir proof system |
| Privacy leak | Zero-knowledge property | Circuit design |
| Value manipulation | Pedersen commitments | Cryptographic binding |
| Range violation | Range proofs | Bulletproofs |

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-31

