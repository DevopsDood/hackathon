# TEAM-PRIVACY-MESSAGING

> Secure messaging applications with Post-Quantum cryptography

## Team Domains

| Domain | Project | Completeness | Tier |
|--------|---------|--------------|------|
| choom.chat | Quantum Terminal | 75% | TIER1 |
| mranderson.one | Matrix Privacy | 60% | TIER1 |
| mactalk.xyz | MCP Private Chat | 40% | TIER1 |
| mcpmail.dev | Agent Email | 30% | TIER2 |

## Team Overview

This team focuses on privacy-preserving messaging applications leveraging:
- **Kyber-768** post-quantum key encapsulation
- **Hybrid encryption** (Kyber + X25519 + ChaCha20-Poly1305)
- **E2E encryption** for message confidentiality
- **Matrix protocol** for decentralized communication

## Prize Categories

| Prize | Entry | Backup | Status |
|-------|-------|--------|--------|
| Best Privacy App ($25K) | Quantum Terminal | Matrix Privacy | Active |
| Post-Quantum Security ($15K) | Quantum Terminal | Matrix Privacy | Active |
| Arcium Confidential Compute ($3K) | Matrix Privacy | MCP Private Chat | Active |

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for shared modules and dependencies.

## Source Code References

```
cross-references/
├── choom.chat/ → ../../TIER1_PRIORITY/choom.chat/
├── matrix-privacy/ → ../../TIER1_PRIORITY/matrix-privacy/
└── mactalk.xyz/ → ../../TIER1_PRIORITY/mactalk.xyz/
```

## Key Dependencies

### From Other Teams
- **STEALTH-MODULE**: `billpayx.com/src/stealth/` (Team 2)
- **CRYPTO-UTILS**: `sdk-solana/src/utils/crypto.ts` (Team 4)

### Shared Within Team
- **Kyber-768**: `choom.chat/src/crypto/kyber.ts`
- **Hybrid Encryption**: `choom.chat/src/crypto/hybrid.ts`
- **E2E Messaging**: `choom.chat/src/core/messaging.ts`

## Domain PRDs

| Domain | PRD | Submission Template |
|--------|-----|---------------------|
| choom.chat | [PRD-choom.chat.md](./PRD-choom.chat.md) | [SUBMISSION-choom.chat.md](./SUBMISSION-choom.chat.md) |
| mranderson.one | [PRD-mranderson.one.md](./PRD-mranderson.one.md) | [SUBMISSION-mranderson.one.md](./SUBMISSION-mranderson.one.md) |
| mactalk.xyz | [PRD-mactalk.xyz.md](./PRD-mactalk.xyz.md) | [SUBMISSION-mactalk.xyz.md](./SUBMISSION-mactalk.xyz.md) |
| mcpmail.dev | [PRD-mcpmail.dev.md](./PRD-mcpmail.dev.md) | [SUBMISSION-mcpmail.dev.md](./SUBMISSION-mcpmail.dev.md) |

## Quick Start

```bash
# Navigate to team folder
cd TEAM-PRIVACY-MESSAGING

# View architecture
cat ARCHITECTURE.md

# Open specific domain PRD
cat PRD-choom.chat.md

# Use navigation script from parent
cd .. && ./navigate.sh privacy-messaging
```

## Milestones

| Milestone | Date | Domains |
|-----------|------|---------|
| Quantum Terminal v1.0 | Day -3 | choom.chat |
| Matrix Privacy v1.0 | Day -2 | mranderson.one |
| MCP Private Chat | Day 1 | mactalk.xyz, mcpmail.dev |

## Cross-Team Dependencies

| Dependent Team | Needed From | Purpose |
|----------------|-------------|---------|
| Team 2 (Payments) | E2E Messaging | Secure payment notifications |
| Team 3 (ZK Tech) | Hybrid Crypto | ZK proof communication |
| Team 4 (Dev Tools) | CLI Tools | Terminal integration |

## Related Documents

- [FINAL-HACKATHON-MATRIX.md](../FINAL-HACKATHON-MATRIX.md) - Master reference
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Team architecture
- Team PRDs: [PRD-choom.chat.md](./PRD-choom.chat.md), [PRD-mranderson.one.md](./PRD-mranderson.one.md)

---

**Team Lead:** Privacy Messaging Lead  
**Status:** Active  
**Last Updated:** 2026-01-31

