# MASTER PRODUCT REQUIREMENTS DOCUMENT (INTAKE)

> **Master PRD for Hackathon Agent**  
> **Version:** 1.0  
> **Created:** 2026-01-31  
> **Purpose:** Single point of reference for all project work - intake document for agent workflow

---

## 1. DOCUMENT HIERARCHY

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      DOCUMENT HIERARCHY                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   MASTER PRD (This Document)                                           │
│       │                                                                 │
│       ├──► FINAL-HACKATHON-MATRIX.md (Strategy & Prize Coverage)        │
│       │                                                                  │
│       ├──► team-based-prds/ (Organized by Domain Teams)                 │
│       │     ├──► README.md (Team Navigation)                            │
│       │     ├──► navigate.sh (Quick Access)                             │
│       │     ├──► TEAM-XXX-YYY/                                          │
│       │     │     ├──► README.md (Team Overview)                        │
│       │     │     ├──► ARCHITECTURE.md (Shared Modules)                 │
│       │     │     ├──► PRD-<domain>.md (Domain Requirements)            │
│       │     │     └──► SUBMISSION-<domain>.md (Submission Template)     │
│       │     └──► ... (11 Teams Total)                                   │
│       │                                                                  │
│       ├──► TIER1_PRIORITY/ (Production-Ready Projects)                  │
│       │     ├──► choom.chat/                                            │
│       │     ├──► billpayx.com/                                          │
│       │     ├──► sdk-solana/                                            │
│       │     └──► ... (16+ Projects)                                     │
│       │                                                                  │
│       ├──► TIER2_DEVELOPMENT/ (In-Progress Projects)                    │
│       │     ├──► vpn-daemon/                                            │
│       │     ├──► helix-core/                                            │
│       │     ├──► privacy-shield-suite/                                  │
│       │     └──► ... (12+ Projects)                                     │
│       │                                                                  │
│       └──► TIER3_CONCEPTS/ (Experimental Projects)                      │
│             └──► shadowpay/                                             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. AGENT INTAKE WORKFLOW

### 2.1 Processing New Work

When new work is requested, follow this intake workflow:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     AGENT INTAKE WORKFLOW                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   STEP 1: Classify Request                                              │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  • What type of work?                                           │   │
│   │    □ New feature / enhancement                                  │   │
│   │    □ Bug fix / security patch                                   │   │
│   │    □ Documentation update                                       │   │
│   │    □ New domain / project                                       │   │
│   │                                                                 │   │
│   │  • Which domain? Check FINAL-HACKATHON-MATRIX.md                │   │
│   │  • Which team? Use navigate.sh or team-based-prds/README.md     │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                   │                                     │
│                                   ▼                                     │
│   STEP 2: Locate Target                                                │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  • Find domain in team-based-prds/TEAM-XXX-YYY/                 │   │
│   │  • Read PRD-<domain>.md for requirements                        │   │
│   │  • Read ARCHITECTURE.md for module dependencies                  │   │
│   │  • Read SUBMISSION-<domain>.md for output format                 │   │
│   │                                                                 │   │
│   │  • Locate actual code:                                          │   │
│   │    □ TIER1_PRIORITY/ (85%+ complete)                            │   │
│   │    □ TIER2_DEVELOPMENT/ (30-84% complete)                       │   │
│   │    □ TIER3_CONCEPTS/ (<30% complete)                            │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                   │                                     │
│                                   ▼                                     │
│   STEP 3: Implement                                                     │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  • Follow PRD requirements                                     │   │
│   │  • Use shared modules from ARCHITECTURE.md                      │   │
│   │  • Maintain coding patterns from existing code                  │   │
│   │  • Add tests (Jest, Mocha, Rust tests)                          │   │
│   │  • Update documentation                                         │   │
│   │                                                                 │   │
│   │  Cross-reference patterns:                                      │   │
│   │  • Kyber-768: choom.chat/src/crypto/kyber.ts                    │   │
│   │  • Hybrid: choom.chat/src/crypto/hybrid.ts                      │   │
│   │  • Stealth: billpayx.com/src/stealth/                           │   │
│   │  • Merkle: sdk-solana/src/zk/merkle.ts                          │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                   │                                     │
│                                   ▼                                     │
│   STEP 4: Validate                                                      │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  • Run tests                                                    │   │
│   │  • Check against PRD requirements                               │   │
│   │  • Verify architecture alignment                                │   │
│   │  • Update completion status in PRD                              │   │
│   │                                                                 │   │
│   │  Submission ready?                                              │   │
│   │  • Fill SUBMISSION-<domain>.md template                         │   │
│   │  • Cross-check FINAL-HACKATHON-MATRIX.md                        │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Quick Reference Commands

```bash
# Navigate to team folder
cd team-based-prds && ./navigate.sh <team-name>

# Find domain PRD
find team-based-prds -name "PRD-<domain>"

# Find submission template
find team-based-prds -name "SUBMISSION-<domain>"

# View architecture for team
cat team-based-prds/TEAM-XXX-YYY/ARCHITECTURE.md

# Check matrix for prize coverage
cat team-based-prds/FINAL-HACKATHON-MATRIX.md
```

---

## 3. DOMAIN-TO-TEAM MAPPING

### 3.1 Team Structure

| # | Team | Domains | Focus | Path |
|---|------|---------|-------|------|
| 1 | TEAM-PRIVACY-MESSAGING | choom.chat, mranderson.one, mactalk.xyz, mcpmail.dev | Secure messaging | `team-based-prds/TEAM-PRIVACY-MESSAGING/` |
| 2 | TEAM-PAYMENTS-STEALTH | billpayx.com, thevirus.zip, shadowpay, priv.pass.xyz | Stealth payments | `team-based-prds/TEAM-PAYMENTS-STEALTH/` |
| 3 | TEAM-ZK-PRIVACY-TECH | contractregistry.io, zk.claims, zk-email, deidentify.ai | ZK proofs | `team-based-prds/TEAM-ZK-PRIVACY-TECH/` |
| 4 | TEAM-DEV-TOOLS | sdk-solana, silver.sh, cli-gitnpm, thegit.network | SDKs & CLI | `team-based-prds/TEAM-DEV-TOOLS/` |
| 5 | TEAM-INFRASTRUCTURE | dns.foo, themail.host, thenode.host, thedomain.host, thegit.host | DNS & hosting | `team-based-prds/TEAM-INFRASTRUCTURE/` |
| 6 | TEAM-AI-UNIFIER | spacespaceai.com, grokumentation.com, blockusign.app | AI privacy | `team-based-prds/TEAM-AI-UNIFIER/` |
| 7 | TEAM-DEFI-PYXEL | pyxelchain.com, pyxlswap.com, pyxl.finance, pyxel.* | DeFi apps | `team-based-prds/TEAM-DEFI-PYXEL/` |
| 8 | TEAM-IDENTITY-SIGN | qrmoji.com, block2sign.com, block2sign.ink, blockusign.ink | Identity & signing | `team-based-prds/TEAM-IDENTITY-SIGN/` |
| 9 | TEAM-MCP-AGENTS | dubhashi.com, nopane.dev, thailate.com, dubhashi.app | MCP agents | `team-based-prds/TEAM-MCP-AGENTS/` |
| 10 | TEAM-PANELESS-FRAMEWORK | paneless.dev, panehub.org, blankcard.org, moderate.chat | Frameworks | `team-based-prds/TEAM-PANELESS-FRAMEWORK/` |
| 11 | TEAM-CONSUMER-PRIVACY | megabyte.zip, lnk.zip, bytes.zip, password-vault, dasr-marketplace | Consumer tools | `team-based-prds/TEAM-CONSUMER-PRIVACY/` |

### 3.2 Finding a Domain's Team

To find which team owns a domain:

```bash
# Search all team PRDs for the domain
grep -r "choom.chat" team-based-prds/*/PRD-*.md

# Or check the README navigation
cat team-based-prds/README.md | grep -A2 "choom.chat"
```

---

## 4. SHARED MODULES REFERENCE

### 4.1 Most Forked Modules

| Module | Primary Location | Forks In | Usage |
|--------|-----------------|----------|-------|
| Merkle Tree | `TIER1_PRIORITY/sdk-solana/src/zk/merkle.ts` | Teams 1,2,3,11 | Payment verification |
| Kyber-768 | `TIER1_PRIORITY/choom.chat/src/crypto/kyber.ts` | Teams 1,2,4,5 | Post-quantum crypto |
| ChaCha20 Crypto | `TIER1_PRIORITY/sdk-solana/src/utils/crypto.ts` | Teams 1,2,11 | Stream encryption |
| Stealth Address | `TIER1_PRIORITY/billpayx.com/src/stealth/` | Teams 1,2,11 | Payment privacy |
| Hybrid Encryption | `TIER1_PRIORITY/choom.chat/src/crypto/hybrid.ts` | Teams 1,2 | Combined crypto |
| Pedersen | `TIER1_PRIORITY/sdk-solana/src/zk/commitment.ts` | Teams 2,3,7 | Amount privacy |
| E2E Messaging | `TIER1_PRIORITY/choom.chat/src/core/messaging.ts` | Team 1 | Secure chat |

### 4.2 Technology Stack by Tier

**TIER1_PRIORITY** (Production-Ready)
```
Language: TypeScript
Framework: Next.js, Express
Crypto: @noble/curves, @noble/hashes, tweetnacl
Testing: Jest
Blockchain: Solana
Deployment: Vercel
```

**TIER2_DEVELOPMENT** (In-Progress)
```
Language: TypeScript, Rust, Dart
Framework: Actix-web, Flutter, Node.js
Crypto: ring (Rust), @noble (TS)
Testing: Jest, Cargo test
Blockchain: Solana, Custom
Deployment: Docker, Railway
```

**TIER3_CONCEPTS** (Experimental)
```
Language: TypeScript, Rust, Noir
Framework: Next.js, Custom
Crypto: Mixed
Testing: Basic
Blockchain: Solana, Aztec (planned)
```

---

## 5. PRIZE CATEGORIES COVERAGE

### 5.1 Primary Prizes

| Prize | Amount | Primary Entry | Backup | Team |
|-------|--------|---------------|--------|------|
| Best Privacy App | $35,000 | Quantum Terminal (choom.chat) | Stealth Payments (billpayx) | Team 1,2 |
| Best ZK App | $20,000 | ZK Claims (contractregistry) | Shadow Pay (shadowpay) | Team 2,3 |
| Best Dev Tool | $10,000 | SDK-Solana | Silver.sh | Team 4 |
| Most Innovative | $15,000 | Privacy DNS (dns.foo) | Block Unifier AI | Team 5,6 |
| Post-Quantum Security | $15,000 | Quantum Terminal | VPN Daemon | Team 1,5 |
| Privacy Infrastructure | $10,000 | SDK-Solana | Ingestion Proxy | Team 4,8 |
| Consumer Privacy | $10,000 | Private Pass | Bytes Zip | Team 2,11 |

### 5.2 Partner Challenges

| Partner | Prize | Entry | Team |
|---------|-------|-------|------|
| Aztec | $7,500 | ZK Claims v2 | Team 3 |
| Helius | $15,000 | Shadow Pay, SDK-Solana | Team 2,4 |
| Quicknode | $7,000 | SDK-Solana, Silver.sh | Team 4 |
| Privacy Cash | $6,000 | Bytes Zip | Team 11 |
| Starpay | $3,500 | BillPayX | Team 2 |
| Arcium | $3,000 | Matrix Privacy | Team 1 |
| Inco | $2,000 | Private Pass | Team 2,11 |
| Gamification | $2,000 | TheVirus Game | Team 2 |

**Total Prize Pool: $160,500+**

---

## 6. AGENT PROMPT TEMPLATE

### 6.1 Standard Task Request

When given a new task, use this intake template:

```
## TASK INTAKE

### Request
[FILL: Description of the work requested]

### Classification
- **Type:** [Feature/Bug/Docs/New Domain]
- **Domain:** [e.g., choom.chat]
- **Team:** [e.g., TEAM-PRIVACY-MESSAGING]
- **Priority:** [P0/P1/P2]
- **Tier:** [TIER1/TIER2/TIER3]

### Steps Taken
1. Located domain in [FINAL-HACKATHON-MATRIX.md]
2. Found team in [team-based-prds/README.md]
3. Read requirements: [PRD-<domain>.md]
4. Reviewed architecture: [TEAM-XXX/ARCHITECTURE.md]
5. Located code: [Path to actual source]
6. Identified shared modules needed:
   - [Module 1]
   - [Module 2]

### Implementation Plan
[Outline the implementation approach]

### Files to Modify
- [File 1]
- [File 2]
- [File 3]

### New Files to Create
- [File 1]
- [File 2]

### Tests Required
- [Test 1]
- [Test 2]

### Documentation Updates
- [Doc 1]
- [Doc 2]

### Submission Ready?
□ Yes - Fill SUBMISSION-<domain>.md
□ No - Requires more work
```

### 6.2 Domain-Specific Task Example

```
## EXAMPLE: Add file encryption to mranderson.one

### Request
Add file encryption capability to Matrix Privacy (mranderson.one)

### Classification
- **Type:** Feature Enhancement
- **Domain:** mranderson.one
- **Team:** TEAM-PRIVACY-MESSAGING
- **Priority:** P1
- **Tier:** TIER1

### Steps Taken
1. FINAL-HACKATHON-MATRIX.md → mranderson.one = Team 1
2. team-based-prds/TEAM-PRIVACY-MESSAGING/README.md
3. PRD-mranderson.one.md → Requirements for group encryption
4. ARCHITECTURE.md → Forked from choom.chat crypto modules
5. TIER1_PRIORITY/matrix-privacy/src/ → Current code location
6. TIER1_PRIORITY/bytes.zip/src/file-encrypt.ts → Shared module to use

### Implementation Plan
1. Fork bytes.zip file encryption for Matrix Privacy
2. Integrate with existing messaging system
3. Add end-to-end file encryption option
4. Update tests
5. Update PRD completion status

### Files to Modify
- TIER1_PRIORITY/matrix-privacy/src/crypto/file-encrypt.ts (new fork)
- TIER1_PRIORITY/matrix-privacy/src/core/messaging.ts (add file support)

### Tests Required
- Test file encryption/decryption
- Test E2E integration with messaging
- Test large file handling

### Submission Ready?
□ Yes - Fill SUBMISSION-mranderson.one.md
```

---

## 7. CODING STANDARDS

### 7.1 TypeScript Conventions

```typescript
// File: src/<module>/<feature>.ts

import { Kyber768 } from '@choom/crypto/kyber';
import { HybridEncryption } from '@choom/crypto/hybrid';

export interface FeatureConfig {
  enabled: boolean;
  timeout: number;
}

export class Feature {
  private config: FeatureConfig;
  
  constructor(config: FeatureConfig) {
    this.config = config;
  }
  
  async initialize(): Promise<void> {
    // Implementation
  }
  
  async process(input: Input): Promise<Output> {
    // Implementation
  }
}

// Export for shared use
export { Feature as DefaultFeature };
```

### 7.2 Rust Conventions

```rust
// File: src/<module>/<feature>.rs

use ring::{digest, pki::types::AlgorithmIdentifier};
use zeroize::Zeroize;

pub struct Feature {
    key: Vec<u8>,
}

impl Feature {
    pub fn new(key: &[u8]) -> Self {
        Self { key: key.to_vec() }
    }
    
    pub fn process(&self, data: &[u8]) -> Vec<u8> {
        // Implementation
    }
}

impl Drop for Feature {
    fn drop(&mut self) {
        self.key.zeroize();
    }
}
```

### 7.3 Test Structure

```
tests/
├── unit/
│   ├── crypto.test.ts
│   ├── messaging.test.ts
│   └── utils.test.ts
├── integration/
│   ├── api.test.ts
│   └── e2e.test.ts
└── fixtures/
    ├── test-keys.json
    └── test-messages.json
```

---

## 8. DOCUMENTATION UPDATES

### 8.1 PRD Update Protocol

When updating a PRD, maintain this structure:

```markdown
# Product Requirements Document: <domain>

> **Domain:** [domain]  
> **Team:** [team-name]  
> **Completeness:** [X]%  
> **Tier:** [TIER#]

## 1. Overview
[Keep updated]

## 2. Functional Requirements
| Priority | Feature | Description | Status |
|----------|---------|-------------|--------|
| P0 | [Feature] | [Description] | ✅/🔄/⏳ |

## 3. Technical Architecture
[Keep synced with actual code]

## 4. Dependencies
[Keep updated with fork sources]

## 5. Completion Status
| Component | Status | Completion |
|-----------|--------|------------|
| [Comp] | ✅ Complete | 100% |
```

### 8.2 Architecture Update Protocol

When updating ARCHITECTURE.md:

```markdown
# TEAM-XXX Architecture

## Module Dependency Graph
[Keep diagram updated]

## Shared Modules
| Module | Primary | Forks | Usage |
|--------|---------|-------|-------|
| [Mod] | [Path] | [Teams] | [Purpose] |

## Cross-Team Dependencies
| From Team | Module | Purpose |
|-----------|--------|---------|
```

---

## 9. QUICK ACCESS REFERENCE

### 9.1 Essential Paths

| Purpose | Path |
|---------|------|
| Master Matrix | `team-based-prds/FINAL-HACKATHON-MATRIX.md` |
| Team Navigation | `team-based-prds/README.md` |
| Navigate Script | `team-based-prds/navigate.sh` |
| TIER1 Code | `TIER1_PRIORITY/` |
| TIER2 Code | `TIER2_DEVELOPMENT/` |
| TIER3 Code | `TIER3_CONCEPTS/` |
| This Document | `PRD-MASTER-INTAKE.md` |

### 9.2 Most-Used PRDs

| Domain | PRD Path |
|--------|----------|
| choom.chat | `team-based-prds/TEAM-PRIVACY-MESSAGING/PRD-choom.chat.md` |
| billpayx.com | `team-based-prds/TEAM-PAYMENTS-STEALTH/PRD-billpayx.com.md` |
| sdk-solana | `team-based-prds/TEAM-DEV-TOOLS/PRD-sdk-solana.md` |
| shadowpay | `team-based-prds/TEAM-PAYMENTS-STEALTH/PRD-shadowpay.md` |

---

## 10. RELATED DOCUMENTS

| Document | Purpose |
|----------|---------|
| `FINAL-HACKATHON-MATRIX.md` | Prize coverage & strategy |
| `PRD.md` | Master product requirements |
| `PRdD.md` | Design document |
| `HACKATHON_PLAN.md` | Execution strategy |
| `DOMAINS.md` | Domain inventory |
| `DEPLOYMENT_CHECKLIST.md` | Deployment procedures |

---

## 11. AGENT SYSTEM PROMPT

> You are an agent working on a privacy-focused hackathon project. Your single source of truth is `PRD-MASTER-INTAKE.md`. When given a task:
>
> 1. **Classify** the request using Section 2 (Intake Workflow)
> 2. **Locate** the domain in FINAL-HACKATHON-MATRIX.md → find team
> 3. **Read** team PRD and ARCHITECTURE from team-based-prds/
> 4. **Find** actual code in TIER1_PRIORITY, TIER2_DEVELOPMENT, or TIER3_CONCEPTS
> 5. **Implement** using shared modules (Section 4)
> 6. **Validate** against PRD requirements
> 7. **Update** PRD completion status and docs
>
> All paths are relative to `/Users/morgoth/work/hackathon/` unless otherwise specified.

---

**Document Version:** 1.0  
**Status:** Active  
**Last Updated:** 2026-01-31  
**Owner:** Master PRD for Agent Intake  
**Path:** `/Users/morgoth/work/hackathon/PRD-MASTER-INTAKE.md`

