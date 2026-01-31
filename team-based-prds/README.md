# Team-Based PRDs - Hackathon 2026

**Comprehensive team organization for maximum prize coverage**

This directory contains all team-based Product Requirements Documents (PRDs), architecture documents, and submission plans organized by team.

## Team Structure

Based on the updated HACKATHON_PLAN.md, the following teams have been organized to maximize prize coverage while maintaining implementation isolation.

### P0 Priority Teams (Highest Combined Work)

| Team | Focus Area | Primary Projects | Prize Pool |
|------|------------|------------------|------------|
| **TEAM-SDK** | Core SDK + ZK + Stealth | sdk-solana, zk.claims, shadowpay | $46K+ |
| **TEAM-PQ-MSG** | Post-Quantum Messaging | choom.chat, matrix-privacy | $33K+ |
| **TEAM-PAY** | Stealth Payments + Games | billpayx.com, thevirus.zip, bytes.zip | $56.5K+ |

### Supporting Teams

| Team | Focus Area | Primary Projects | Prize Pool |
|------|------------|------------------|------------|
| **TEAM-RUST** | Post-Quantum Infrastructure | helix-core, vpn-daemon | $20K+ |
| **TEAM-AI** | AI Unification + Privacy | blockusign.app, deidentify.ai | $15K+ |
| **TEAM-INFRA** | Infrastructure + Dev Tools | silver.sh, cli-gitnpm | $7K+ |
| **TEAM-CONSUMER** | Consumer Privacy Apps | password-vault, priv.pass.xyz | $16K+ |

## Directory Structure

```
team-based-prds/
├── README.md                          # This file
├── HACKATHON_PLAN.md                  # Master strategic plan
├── FINAL-HACKATHON-MATRIX.md          # Complete coverage matrix
├── navigate.sh                        # Navigation helper
│
├── TEAM-SDK/                          # Core SDK + ZK + Stealth
│   ├── README.md                      # Team overview & responsibilities
│   ├── ARCHITECTURE.md                # Technical architecture
│   └── PRD-*.md                       # Individual project PRDs
│
├── TEAM-PQ-MSG/                       # Post-Quantum Messaging
│   ├── README.md
│   ├── ARCHITECTURE.md
│   ├── PRD-choom.chat.md
│   ├── PRD-mranderson.one.md
│   ├── PRD-mactalk.xyz.md
│   ├── PRD-mcpmail.dev.md
│   ├── SUBMISSION-choom.chat.md
│   ├── SUBMISSION-mranderson.one.md
│   ├── SUBMISSION-mactalk.xyz.md
│   └── SUBMISSION-mcpmail.dev.md
│
├── TEAM-PAY/                          # Stealth Payments
│   ├── README.md
│   ├── ARCHITECTURE.md
│   └── PRD-*.md
│
├── TEAM-RUST/                         # Rust PQC Infrastructure
│   ├── README.md
│   └── ARCHITECTURE.md
│
├── TEAM-AI/                           # AI Unification
│   ├── README.md
│   └── ARCHITECTURE.md
│
├── TEAM-INFRA/                        # Dev Tools + Infrastructure
│   ├── README.md
│   └── ARCHITECTURE.md
│
├── TEAM-CONSUMER/                     # Consumer Privacy Apps
│   ├── README.md
│   └── ARCHITECTURE.md
│
├── TEAM-DEV-TOOLS/                    # Developer Tools
│   ├── README.md
│   └── ARCHITECTURE.md
│
├── TEAM-INFRASTRUCTURE/               # Infrastructure
│   ├── README.md
│   └── ARCHITECTURE.md
│
├── TEAM-DEFI-PYXEL/                   # DeFi + Pyxel Brand
│   ├── README.md
│   └── ARCHITECTURE.md
│
├── TEAM-IDENTITY-SIGN/                # Identity + Signing
│   ├── README.md
│   └── ARCHITECTURE.md
│
├── TEAM-MCP-AGENTS/                   # MCP Agents
│   ├── README.md
│   └── ARCHITECTURE.md
│
└── TEAM-PANELESS-FRAMEWORK/           # Paneless Framework
    ├── README.md
    └── ARCHITECTURE.md
```

## Language-Based Organization

### TypeScript/JavaScript (15 projects)
- choom.chat, billpayx.com, sdk-solana, bytes.zip
- matrix-privacy, shadowpay, silver.sh, cli-gitnpm
- lnk.zip, priv.pass.xyz, blockusign.ink, zk.claims
- dasr-marketplace, thevirus.zip, deidentify.ai

### Rust (3 projects)
- helix-core, vpn-daemon, dns.foo

### Dart/Flutter (1 project)
- privacy-shield-suite

### Python (2 projects)
- blockusign.app, grokumentation.com

### Noir/Solidity (3 projects)
- zk.claims, shadowpay, dasr-marketplace

## Prize Summary

| Category | Prize Pool | Status |
|----------|------------|--------|
| **Solana Privacy Hackathon** |
| Best Privacy App | $25,000 | Active |
| Best ZK App | $15,000 | Active |
| Best Dev Tool | $10,000 | Active |
| Most Innovative | $10,000 | Active |
| Post-Quantum Security | $15,000 | Active |
| Privacy Infrastructure | $10,000 | Active |
| Consumer Privacy | $10,000 | Active |
| **Partner Challenges** |
| Aztec | $7,500 | Active |
| Helius | $10,000 | Active |
| Quicknode | $7,000 | Active |
| Privacy Cash | $6,000 | Active |
| Starpay | $3,500 | Active |
| Arcium | $3,000 | Active |
| Inco | $2,000 | Active |
| Gamification | $2,000 | Active |
| **TOTAL** | **$160,500** | 100% Coverage |

## Quick Navigation

```bash
# View all teams
./navigate.sh

# View specific team
./navigate.sh TEAM-SDK

# View architecture
cat TEAM-SDK/ARCHITECTURE.md
```

## Implementation Isolation

All teams must ensure:
1. **No shared npm packages visible** across projects
2. **Different package names** for each submission
3. **Forked code has 80%+ changes** (renamed files, variables, structure)
4. **Independent Git repositories** per submission

## Cross-Team Dependencies

```
TEAM-SDK (ZK Primitives, Stealth)
    │
    ├──► TEAM-PAY (consumes ZK, Stealth)
    │
    ├──► TEAM-PQ-MSG (uses ZK verification)
    │
    └──► TEAM-CONSUMER (uses encryption)

TEAM-RUST (Kyber-768 Rust)
    │
    └──► TEAM-PQ-MSG (PQC for messaging)

TEAM-AI (Inference Model)
    │
    └──► All teams (privacy processing)
```

## Related Documents

| Document | Description |
|----------|-------------|
| [HACKATHON_PLAN.md](HACKATHON_PLAN.md) | Master strategic plan |
| [FINAL-HACKATHON-MATRIX.md](FINAL-HACKATHON-MATRIX.md) | Complete coverage matrix |
| [DOMAINS.md](../DOMAINS.md) | Domain inventory |
| [PRD.md](../PRD.md) | Master requirements |

---

*Last Updated: 2026-01-31*  
*Document Version: 2.0*

