# TEAM-PQ-MSG: Post-Quantum Messaging

**Primary Focus:** End-to-end encryption, post-quantum key exchange, Matrix protocol, secure communication  
**Prize Pool:** $33,000+ primary, $5,000 backup  
**Language:** TypeScript + Matrix Protocol

## Team Members & Responsibilities

| Role | Member | Focus Area |
|------|--------|------------|
| Lead | TBD | Architecture & Crypto |
| PQ Engineer | TBD | Kyber-768 Implementation |
| Messaging Engineer | TBD | E2E Encryption & Session Mgmt |
| Matrix Engineer | TBD | Matrix Protocol Integration |

## Projects

| Project | Domain | Status | Completion | Prize Target |
|---------|--------|--------|------------|--------------|
| **choom.chat** | choom.chat | Active | 75% | $25K (Best Privacy App) |
| **matrix-privacy** | mranderson.one | Active | 60% | $3K (Arcium) |
| **mactalk.xyz** | mactalk.xyz | Active | 40% | $3K (Consumer Privacy) |
| **mcpmail.dev** | mcpmail.dev | Active | 30% | $2K (Consumer Communication) |

## Architecture Components

### Post-Quantum Crypto (TypeScript)

```
choom.chat/src/crypto/
├── kyber.ts           (800 LOC) - Kyber-768 KEM implementation
├── x25519.ts          (300 LOC) - X25519 key exchange
├── hybrid.ts          (400 LOC) - Hybrid PQ + classical encryption
└── utils.ts           (200 LOC) - Crypto utilities
```

### E2E Messaging System

```
choom.chat/src/core/
├── messaging.ts       (600 LOC) - Core messaging logic
├── session.ts         (200 LOC) - Session management
├── store.ts           (300 LOC) - Message storage
└── events.ts          (150 LOC) - Event handling
```

### Group Encryption (Matrix)

```
matrix-privacy/src/crypto/
├── group.ts           (500 LOC) - Multi-party encryption
├── pairwise.ts        (300 LOC) - Pairwise encryption
└── OlmAdapter.ts      (400 LOC) - Olm protocol adapter
```

## Forking Strategy

| Original | Fork Location | Changes |
|----------|---------------|---------|
| choom/crypto/kyber.ts | matrix/src/crypto/kyber.ts | Different class, Matrix integration |
| choom/crypto/kyber.ts | mactalk/src/crypto/kyber.ts | MCP-specific features |
| choom/core/messaging.ts | matrix/src/core/messaging.ts | Matrix room support |
| choom/core/messaging.ts | mactalk/src/core/messaging.ts | Agent communication |

## Dependencies

### Internal
- TEAM-SDK: ZK primitives for verification
- TEAM-AI: AI unifier for message classification

### External
- @noble/curves - Kyber, X25519, Ed25519
- @noble/hashes - SHA-256, SHA-512
- matrix-js-sdk - Matrix protocol client
- libolm - E2E encryption library

## Timeline

### Phase 1: Immediate (Day 1)
- [ ] Complete choom.chat web interface
- [ ] Add group encryption to matrix-privacy

### Phase 2: Day 2
- [ ] Integrate Matrix protocol fully
- [ ] Add MCP support to mactalk.xyz

### Phase 3: Stretch (Day 3-4)
- [ ] Deploy mcpmail.dev email system
- [ ] Add AI message classification

## Success Metrics

| Metric | Target | Current |
|--------|--------|---------|
| PQ Key Exchange | 100% | 85% |
| E2E Encryption | 100% | 75% |
| Group Chat Support | 100% | 60% |
| Matrix Integration | 100% | 60% |

## Related Teams

- **TEAM-SDK**: Consumes ZK primitives for verification
- **TEAM-AI**: Integrates for message analysis
- **TEAM-RUST**: Uses Kyber-768 Rust for PQC

---

*Last Updated: 2026-01-31*  
*Document Version: 1.0*

