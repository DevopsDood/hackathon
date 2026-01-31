# TEAM-DEV-TOOLS

> CLI tools, SDKs, and developer utilities

## Team Domains

| Domain | Project | Completeness | Tier |
|--------|---------|--------------|------|
| sdk-solana | SDK-Solana | 95% | TIER1 |
| silver.sh | CLI Silver | 70% | TIER1 |
| cli-gitnpm | CLI Gitnpm | 70% | TIER1 |
| thegit.network | Git Network | 40% | TIER1 |

## Team Overview

Developer tools for privacy-focused development:
- **SDK-Solana**: ZK/stealth SDK for Solana
- **CLI Tools**: Command-line utilities
- **Git Integration**: Privacy-preserving version control

## Prize Categories

| Prize | Entry | Backup | Status |
|-------|-------|--------|--------|
| Best Dev Tool ($10K) | SDK-Solana | Silver.sh | Active |
| Quicknode Open Source ($3K) | SDK-Solana | CLI Tool | Active |
| Quicknode Dev Tool ($4K) | Silver.sh | CLI Gitnpm | Active |

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for shared modules.

## Source Code References

```
cross-references/
├── sdk-solana/ → ../../TIER1_PRIORITY/sdk-solana/
├── silver.sh/ → ../../TIER1_PRIORITY/silver.sh/
├── cli-gitnpm/ → ../../TIER1_PRIORITY/cli-gitnpm/
└── thegit.network/ → ../../TIER1_PRIORITY/thegit.network/
```

## Key Dependencies

### Shared Modules
- **Merkle Tree**: `sdk-solana/src/zk/merkle.ts`
- **ChaCha20 Crypto**: `sdk-solana/src/utils/crypto.ts`
- **Stealth Addresses**: `sdk-solana/src/stealth/`

## Domain PRDs

| Domain | PRD | Submission Template |
|--------|-----|---------------------|
| sdk-solana | [PRD-sdk-solana.md](./PRD-sdk-solana.md) | [SUBMISSION-sdk-solana.md](./SUBMISSION-sdk-solana.md) |
| silver.sh | [PRD-silver.sh.md](./PRD-silver.sh.md) | [SUBMISSION-silver.sh.md](./SUBMISSION-silver.sh.md) |
| cli-gitnpm | [PRD-cli-gitnpm.md](./PRD-cli-gitnpm.md) | [SUBMISSION-cli-gitnpm.md](./SUBMISSION-cli-gitnpm.md) |
| thegit.network | [PRD-thegit.network.md](./PRD-thegit.network.md) | [SUBMISSION-thegit.network.md](./SUBMISSION-thegit.network.md) |

## Quick Start

```bash
cd TEAM-DEV-TOOLS
cat ARCHITECTURE.md
cat PRD-sdk-solana.md
cd .. && ./navigate.sh dev-tools
```

## Related Documents

- [FINAL-HACKATHON-MATRIX.md](../FINAL-HACKATHON-MATRIX.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)

---

**Team Lead:** Dev Tools Lead  
**Status:** Active  
**Last Updated:** 2026-01-31

