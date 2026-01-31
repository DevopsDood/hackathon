# TEAM-PAY: Stealth Payments + Games

**Primary Focus:** Stealth addresses, privacy payments, gamification, confidential transactions  
**Prize Pool:** $56,500+ primary, $10,000 backup  
**Language:** TypeScript + Solana + Noir

## Team Members & Responsibilities

| Role | Member | Focus Area |
|------|--------|------------|
| Lead | TBD | Stealth Address System |
| Payment Engineer | TBD | Payment Processing |
| Game Engineer | TBD | Gamification Mechanics |
| ZK Engineer | TBD | Noir Circuit Integration |

## Projects

| Project | Domain | Status | Completion | Prize Target |
|---------|--------|--------|------------|--------------|
| **billpayx.com** | billpayx.com | Active | 85% | $3.5K (Starpay) |
| **shadowpay** | thevirus.zip | Active | 40% | $43K (Multiple) |
| **thevirus.zip** | thevirus.zip | Active | 50% | $2K (Gamification) |
| **priv.pass.xyz** | priv.pass.xyz | Active | 40% | $2K (Inco) |
| **bytes.zip** | megabyte.zip | Active | 75% | $6K (Privacy Cash) |

## Architecture Components

### Stealth Address System (TypeScript)

```
billpayx.com/src/stealth/
├── addr.ts            (500 LOC) - Stealth address generation
├── scan.ts            (400 LOC) - Payment scanning
├── keys.ts            (300 LOC) - View/scan key management
└── transfer.ts        (350 LOC) - Stealth transfers
```

### File Encryption System (TypeScript)

```
bytes.zip/src/
├── file-encrypt.ts    (400 LOC) - AES-256-GCM file encryption
├── streaming.ts       (300 LOC) - Streaming encryption
├── key-derive.ts      (200 LOC) - PBKDF2 key derivation
└── compress.ts        (250 LOC) - LZ4 compression
```

### ZK Payment System (Noir + TypeScript)

```
shadowpay/
├── contracts/
│   └── shadowpay.nr   (500 LOC) - ZK circuit for payments
├── src/stealth/
│   ├── stealth-address.ts
│   └── stealth-transfer.ts
├── src/zk/
│   ├── balance-proof.ts
│   └── range-proof.ts
└── src/games/
    └── stealthgame.ts
```

## Forking Strategy

| Original | Fork Location | Changes |
|----------|---------------|---------|
| billpayx/stealth/addr.ts | shadowpay/src/stealth/addr.ts | Different class, ZK integration |
| billpayx/stealth/addr.ts | thevirus/src/stealth/addr.ts | Game-specific features |
| sdk-solana/utils/crypto.ts | bytes/src/utils/crypto.ts | Different variable names |
| sdk-solana/utils/crypto.ts | password-vault/src/utils/crypto.ts | HIBP integration |

## Dependencies

### Internal
- TEAM-SDK: ZK primitives, Merkle tree, Pedersen commitments
- TEAM-RUST: Kyber-768 Rust for PQC

### External
- @solana/web3.js - Solana blockchain
- @noble/curves - Elliptic curve crypto
- tweetnacl - NaCl for fast encryption
- crypto-js - AES encryption

## Timeline

### Phase 1: Immediate (Day 1)
- [ ] Submit billpayx.com to Starpay ($3.5K)
- [ ] Submit bytes.zip to Privacy Cash ($6K)

### Phase 2: Day 2
- [ ] Complete shadowpay ZK circuit
- [ ] Add game mechanics to thevirus.zip

### Phase 3: Stretch (Day 3-4)
- [ ] Deploy priv.pass.xyz vault system
- [ ] Add stealth payments to thevirus.zip

## Success Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Stealth Address Gen | 100% | 85% |
| Payment Scanner | 100% | 80% |
| File Encryption | 100% | 75% |
| ZK Circuit | 100% | 40% |

## Related Teams

- **TEAM-SDK**: Consumes ZK primitives and stealth system
- **TEAM-PQ-MSG**: Uses forked encryption components
- **TEAM-CONSUMER**: Integrates file encryption

---

*Last Updated: 2026-01-31*  
*Document Version: 1.0*

