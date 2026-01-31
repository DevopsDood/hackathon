# TEAM-SDK: Core SDK + ZK + Stealth

**Primary Focus:** SDK development, ZK primitives, stealth addresses, Solana integration  
**Prize Pool:** $46,000+ primary, $10,000 backup  
**Language:** TypeScript + Rust + Noir

## Team Members & Responsibilities

| Role | Member | Focus Area |
|------|--------|------------|
| Lead | TBD | SDK Architecture |
| ZK Engineer | TBD | Merkle/Pedersen/Range Proofs |
| Stealth Engineer | TBD | Stealth Address System |
| Solana Developer | TBD | Transaction Integration |

## Projects

| Project | Domain | Status | Completion | Prize Target |
|---------|--------|--------|------------|--------------|
| **sdk-solana** | thegit.network | Active | 95% | $15K (Helius + Quicknode) |
| **privacy-sdk** | contractregistry.io | Active | 85% | $5K (Helius) |
| **billpayx.com** | billpayx.com | Active | 85% | $3.5K (Starpay) |
| **shadowpay** | thevirus.zip | Active | 40% | $43K (Multiple) |
| **zk.claims** | contractregistry.io | Active | 70% | $7.5K (Aztec) |
| **dasr-marketplace** | dasr-marketplace | Backup | 20% | $5K (DeFi) |

## Architecture Components

### ZK Primitives (TypeScript)

```
sdk-solana/src/zk/
├── merkle.ts          (600 LOC) - Merkle Tree for verification
├── commitment.ts      (500 LOC) - Pedersen Commitments
└── range-proof.ts     (200 LOC) - Range Proofs for privacy
```

### Stealth Address System (TypeScript)

```
billpayx.com/src/stealth/
├── addr.ts            (500 LOC) - Stealth address generation
├── scan.ts            (400 LOC) - Payment scanning
└── keys.ts            (300 LOC) - View/scan key management
```

### ZK Circuits (Noir)

```
zk.claims/src/
└── circuits/          ZK proofs for claims verification

shadowpay/contracts/
└── shadowpay.nr       Noir circuits for stealth payments
```

## Forking Strategy

| Original | Fork Location | Changes |
|----------|---------------|---------|
| sdk-solana/src/zk/merkle.ts | choom/src/lib/merkle.ts | Different class name, added features |
| sdk-solana/src/zk/merkle.ts | billpayx/src/utils/merkle.ts | Different variable names |
| sdk-solana/src/zk/merkle.ts | shadowpay/src/zk/merkle.ts | 80% LOC change |
| billpayx/stealth/addr.ts | shadowpay/src/stealth/addr.ts | Different class, added game features |
| billpayx/stealth/addr.ts | thevirus/src/stealth/addr.ts | Game-specific modifications |

## Dependencies

### Internal
- TEAM-RUST: Kyber-768 Rust implementation
- TEAM-PAY: Stealth address system integration

### External
- @solana/web3.js - Solana blockchain interaction
- @noble/hashes - Cryptographic hashing
- @noble/curves - Elliptic curve cryptography
- Noir - ZK circuit compilation

## Timeline

### Phase 1: Immediate (Day 1)
- [ ] Submit sdk-solana to Helius + Quicknode ($15K)
- [ ] Submit zk.claims to Aztec ($7.5K)

### Phase 2: Day 2
- [ ] Complete shadowpay ZK circuit integration
- [ ] Add Solana transaction support to sdk-solana

### Phase 3: Stretch (Day 3-4)
- [ ] Deploy dasr-marketplace contract
- [ ] Add game mechanics to shadowpay

## Success Metrics

| Metric | Target | Current |
|--------|--------|---------|
| SDK Completion | 100% | 95% |
| ZK Circuit Tests | 100% | 70% |
| Stealth Address Tests | 100% | 85% |
| Prize Submissions | 4 | 2 |

## Files Reference

| File | Location | Purpose |
|------|----------|---------|
| PRD.md | TIER1_PRIORITY/sdk-solana/PRD.md | SDK Product Requirements |
| ARCHITECTURE.md | TIER1_PRIORITY/sdk-solana/docs/ | Technical Architecture |
| COMPLETION_REPORT.md | TIER1_PRIORITY/sdk-solana/COMPLETION_REPORT.md | Progress Tracking |

## Related Teams

- **TEAM-PAY**: Consumes ZK primitives and stealth system
- **TEAM-PQ-MSG**: Uses forked ZK components
- **TEAM-RUST**: Provides Kyber-768 Rust implementation

---

*Last Updated: 2026-01-31*  
*Document Version: 1.0*

