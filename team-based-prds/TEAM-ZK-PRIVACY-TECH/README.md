# TEAM-ZK-PRIVACY-TECH

> Zero-knowledge proof systems & privacy tech

## Team Domains

| Domain | Project | Completeness | Tier |
|--------|---------|--------------|------|
| contractregistry.io | ZK Claims | 80% | TIER1 |
| deidentify.ai | De-Identify AI | 20% | TIER1 |
| zk-email | ZK Email | 30% | TIER2 |

## Team Overview

This team focuses on zero-knowledge cryptography and privacy-preserving computation:
- **ZK proofs** for verification without revelation
- **Noir circuits** for ZK application development
- **Pedersen commitments** for hidden values
- **Range proofs** for confidential transactions

## Prize Categories

| Prize | Entry | Backup | Status |
|-------|-------|--------|--------|
| Best ZK App ($15K) | ZK Claims | Shadow Pay | Active |
| Aztec ZK Application ($7.5K) | ZK Claims v2 | Private Claims | Active |
| Helius Best Privacy ($5K) | Shadow Pay | SDK-Solana | Active |

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for shared modules and dependencies.

## Source Code References

```
cross-references/
├── contractregistry.io/ → ../../TIER1_PRIORITY/zk.claims/
├── deidentify.ai/ → ../../TIER1_PRIORITY/deidentify.ai/
└── zk-email/ → ../../TIER2_DEVELOPMENT/zk-email/
```

## Key Dependencies

### From Other Teams
- **STEALTH-MODULE**: `billpayx.com/src/stealth/` (Team 2)
- **CRYPTO-MODULE**: `sdk-solana/src/utils/crypto.ts` (Team 4)

### Shared Within Team
- **ZK Circuits**: `shadowpay/contracts/`
- **Merkle Tree**: `sdk-solana/src/zk/merkle.ts`
- **Pedersen**: `sdk-solana/src/zk/commitment.ts`

## Domain PRDs

| Domain | PRD | Submission Template |
|--------|-----|---------------------|
| contractregistry.io | [PRD-contractregistry.io.md](./PRD-contractregistry.io.md) | [SUBMISSION-contractregistry.io.md](./SUBMISSION-contractregistry.io.md) |
| deidentify.ai | [PRD-deidentify.ai.md](./PRD-deidentify.ai.md) | [SUBMISSION-deidentify.ai.md](./SUBMISSION-deidentify.ai.md) |
| zk-email | [PRD-zk-email.md](./PRD-zk-email.md) | [SUBMISSION-zk-email.md](./SUBMISSION-zk-email.md) |

## Quick Start

```bash
cd TEAM-ZK-PRIVACY-TECH
cat ARCHITECTURE.md
cat PRD-contractregistry.io.md
cd .. && ./navigate.sh zk-privacy-tech
```

## Related Documents

- [FINAL-HACKATHON-MATRIX.md](../FINAL-HACKATHON-MATRIX.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)

---

**Team Lead:** ZK Tech Lead  
**Status:** Active  
**Last Updated:** 2026-01-31

