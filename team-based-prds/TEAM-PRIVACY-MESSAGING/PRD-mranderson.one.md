# Product Requirements Document: mranderson.one (Matrix Privacy)

> **Domain:** mranderson.one  
> **Team:** TEAM-PRIVACY-MESSAGING  
> **Completeness:** 60%  
> **Tier:** TIER1_PRIORITY

## 1. Overview

**Project Name:** Matrix Privacy  
**Tagline:** Decentralized E2E Encrypted Messaging  
**Purpose:** Matrix protocol-based privacy messaging with group encryption

## 2. Problem Statement

Centralized messaging platforms have:
- Single points of failure
- Metadata collection
- No true ownership of data
- Limited encryption options

## 3. Solution

A decentralized Matrix-based messenger with:
- **Matrix protocol** for federation
- **Group encryption** for multi-party chats
- **E2E encryption** by default
- **Self-hosting** capability

## 4. Functional Requirements

| Priority | Feature | Description | Status |
|----------|---------|-------------|--------|
| P0 | Matrix Sync | Sync with Matrix homeserver | ✅ Complete |
| P0 | E2E Encryption | Olm/Megolm encryption | ✅ Complete |
| P0 | Direct Messages | 1:1 encrypted chats | ✅ Complete |
| P1 | Group Chat | Multi-party encrypted rooms | ✅ Complete |
| P1 | File Sharing | Encrypted attachments | 🔄 In Progress |
| P2 | Voice/Video | VoIP integration | ⏳ Pending |

## 5. Technical Architecture

### 5.1 Source Code References

| Component | Path | Status |
|-----------|------|--------|
| Group Encryption | `TIER1_PRIORITY/matrix-privacy/src/crypto/group.ts` | ✅ 500 LOC |
| E2E Messaging | Forked from `choom.chat/src/core/messaging.ts` | ✅ |
| Kyber-768 | Forked from `choom.chat/src/crypto/kyber.ts` | ✅ |

### 5.2 Encryption Stack

```
┌────────────────────────────────────────────────────────────────┐
│                 MATRIX ENCRYPTION STACK                        │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  User Devices                                                  │
│      │                                                         │
│      ▼                                                         │
│  ┌─────────┐     ┌─────────┐     ┌─────────────────────────┐  │
│  │ Olm     │────▶│ Megolm  │────▶│ Matrix Rooms            │  │
│  │ 1:1     │     │ Groups  │     │ (Federated)             │  │
│  └─────────┘     └─────────┘     └─────────────────────────┘  │
│      │                                                         │
│      ▼                                                         │
│  ┌─────────┐                                                   │
│  │ Kyber   │  ← Post-Quantum key wrapping (future)            │
│  │ (Future)│                                                   │
│  └─────────┘                                                   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## 6. Prize Categories

| Prize | Entry | Backup | Status |
|-------|-------|--------|--------|
| Arcium Confidential Compute ($3K) | Matrix Privacy | GP Teams | Active |
| Best Privacy App ($25K) | Matrix Privacy | Quantum Terminal | Active |

## 7. Dependencies

### 7.1 Internal (Team 1)
- Kyber-768: `./src/crypto/kyber.ts` (forked from choom.chat)
- Hybrid: `./src/crypto/hybrid.ts` (forked from choom.chat)

### 7.2 Cross-Team
- SDK-Solana: Identity integration (Team 4)

## 8. Related Documents

| Document | Path |
|----------|------|
| Architecture | `./ARCHITECTURE.md` |
| Submission | `./SUBMISSION-mranderson.one.md` |
| Source | `TIER1_PRIORITY/matrix-privacy/` |
| Master Matrix | `../FINAL-HACKATHON-MATRIX.md` |

---

**Document Version:** 1.0  
**Status:** Active  
**Last Updated:** 2026-01-31

