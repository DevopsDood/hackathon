# TEAM-PAYMENTS-STEALTH

> Stealth payments & privacy wallets

## Team Domains

| Domain | Project | Completeness | Tier |
|--------|---------|--------------|------|
| billpayx.com | Stealth Payments | 85% | TIER1 |
| thevirus.zip | Virus Game | 50% | TIER1 |
| shadowpay | Shadow Pay | 40% | TIER3 |
| priv.pass.xyz | Private Pass | 40% | TIER1 |

## Team Overview

This team focuses on privacy-preserving payment systems leveraging:
- **Stealth addresses** for transaction privacy
- **Merkle trees** for payment verification
- **ZK proofs** for transaction validity
- **Pedersen commitments** for amount privacy

## Prize Categories

| Prize | Entry | Backup | Status |
|-------|-------|--------|--------|
| Best ZK App ($15K) | Shadow Pay | ZK Claims | Active |
| Starpay Payment UX ($3.5K) | Stealth Payments | Virus Game | Active |
| Gamification ($2K) | Virus Game | Shadow Game | Active |
| Inco Privacy Payments ($2K) | Private Pass | Password Vault | Active |

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for shared modules and dependencies.

## Source Code References

```
cross-references/
├── billpayx.com/ → ../../TIER1_PRIORITY/billpayx.com/
├── thevirus.zip/ → ../../TIER1_PRIORITY/thevirus.zip/
├── shadowpay/ → ../../TIER3_CONCEPTS/shadowpay/
└── priv.pass.xyz/ → ../../TIER1_PRIORITY/priv.pass.xyz/
```

## Key Dependencies

### From Other Teams
- **CRYPTO-MODULE**: `choom.chat/src/crypto/` (Team 1)
- **ZK-MODULE**: `sdk-solana/src/zk/` (Team 4)

### Shared Within Team
- **Stealth Module**: `billpayx.com/src/stealth/addr.ts`
- **Merkle Tree**: `billpayx.com/src/utils/merkle.ts`
- **Pedersen**: `shadowpay/src/zk/commitment.ts`

## Domain PRDs

| Domain | PRD | Submission Template |
|--------|-----|---------------------|
| billpayx.com | [PRD-billpayx.com.md](./PRD-billpayx.com.md) | [SUBMISSION-billpayx.com.md](./SUBMISSION-billpayx.com.md) |
| thevirus.zip | [PRD-thevirus.zip.md](./PRD-thevirus.zip.md) | [SUBMISSION-thevirus.zip.md](./SUBMISSION-thevirus.zip.md) |
| shadowpay | [PRD-shadowpay.md](./PRD-shadowpay.md) | [SUBMISSION-shadowpay.md](./SUBMISSION-shadowpay.md) |
| priv.pass.xyz | [PRD-priv.pass.xyz.md](./PRD-priv.pass.xyz.md) | [SUBMISSION-priv.pass.xyz.md](./SUBMISSION-priv.pass.xyz.md) |

## Quick Start

```bash
# Navigate to team folder
cd TEAM-PAYMENTS-STEALTH

# View architecture
cat ARCHITECTURE.md

# Open specific domain PRD
cat PRD-billpayx.com.md

# Use navigation script from parent
cd .. && ./navigate.sh payments-stealth
```

## Milestones

| Milestone | Date | Domains |
|-----------|------|---------|
| Stealth Payments v1.0 | Day -3 | billpayx.com |
| Private Pass v1.0 | Day -2 | priv.pass.xyz |
| Virus Game | Day 1 | thevirus.zip |
| Shadow Pay | Day 1 | shadowpay |

## Cross-Team Dependencies

| Dependent Team | Needed From | Purpose |
|----------------|-------------|---------|
| Team 1 (Messaging) | Stealth addresses | Payment links in chat |
| Team 3 (ZK Tech) | ZK circuits | Payment proofs |
| Team 4 (Dev Tools) | SDK-Solana | Blockchain integration |

## Related Documents

- [FINAL-HACKATHON-MATRIX.md](../FINAL-HACKATHON-MATRIX.md) - Master reference
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Team architecture
- Team PRDs: [PRD-billpayx.com.md](./PRD-billpayx.com.md), etc.

---

**Team Lead:** Payments Lead  
**Status:** Active  
**Last Updated:** 2026-01-31

