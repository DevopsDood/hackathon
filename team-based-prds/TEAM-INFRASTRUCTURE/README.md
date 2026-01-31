# TEAM-INFRASTRUCTURE

> DNS, hosting, and node infrastructure

## Team Domains

| Domain | Project | Completeness | Tier |
|--------|---------|--------------|------|
| dns.foo | PrivacyDNS | 50% | TIER2 |
| themail.host | Private Email | 30% | TIER2 |
| thenode.host | Node Hosting | 20% | TIER2 |
| thedomain.host | Domain Platform | 20% | TIER2 |
| thegit.host | Git Hosting | 40% | TIER2 |

## Team Overview

Privacy infrastructure services:
- **Privacy DNS**: DNS-over-TLS/HTTPS with PQ crypto
- **Private Email**: Encrypted email hosting
- **Node Hosting**: Private RPC nodes
- **Domain Services**: Privacy-preserving domains
- **Git Hosting**: Private code hosting

## Prize Categories

| Prize | Entry | Backup | Status |
|-------|-------|--------|--------|
| Most Innovative ($10K) | Privacy DNS | Block Unifier AI | Active |
| Post-Quantum Security ($15K) | VPN Daemon | Helix Core | Active |

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for shared modules.

## Source Code References

```
cross-references/
├── dns.foo/ → ../../TIER2_DEVELOPMENT/dns-foo/
├── themail.host/ → ../../TIER2_DEVELOPMENT/vpn-daemon/ (related)
├── thenode.host/ → ../../TIER2_DEVELOPMENT/
├── thedomain.host/ → ../../TIER2_DEVELOPMENT/
└── thegit.host/ → ../../TIER2_DEVELOPMENT/
```

## Key Dependencies

### From Other Teams
- **VPN Module**: `vpn-daemon/` (PQ security)
- **Helix Core**: P2P messaging

## Domain PRDs

| Domain | PRD | Submission Template |
|--------|-----|---------------------|
| dns.foo | [PRD-dns.foo.md](./PRD-dns.foo.md) | [SUBMISSION-dns.foo.md](./SUBMISSION-dns.foo.md) |
| themail.host | [PRD-themail.host.md](./PRD-themail.host.md) | [SUBMISSION-themail.host.md](./SUBMISSION-themail.host.md) |
| thenode.host | [PRD-thenode.host.md](./PRD-thenode.host.md) | [SUBMISSION-thenode.host.md](./SUBMISSION-thenode.host.md) |
| thedomain.host | [PRD-thedomain.host.md](./PRD-thedomain.host.md) | [SUBMISSION-thedomain.host.md](./SUBMISSION-thedomain.host.md) |
| thegit.host | [PRD-thegit.host.md](./PRD-thegit.host.md) | [SUBMISSION-thegit.host.md](./SUBMISSION-thegit.host.md) |

## Quick Start

```bash
cd TEAM-INFRASTRUCTURE
cat ARCHITECTURE.md
cat PRD-dns.foo.md
cd .. && ./navigate.sh infrastructure
```

## Related Documents

- [FINAL-HACKATHON-MATRIX.md](../FINAL-HACKATHON-MATRIX.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)

---

**Team Lead:** Infrastructure Lead  
**Status:** Active  
**Last Updated:** 2026-01-31

