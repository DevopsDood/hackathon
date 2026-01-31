# Product Requirements Document: mcpmail.dev

> **Domain:** mcpmail.dev  
> **Team:** TEAM-PRIVACY-MESSAGING  
> **Completeness:** 30%  
> **Tier:** TIER2_DEVELOPMENT

## 1. Overview

**Project Name:** Agent Email  
**Tagline:** MCP-Based Private Email System  
**Purpose:** Privacy-preserving email for AI agents using MCP protocol

## 2. Problem Statement

AI agents need secure email communication:
- Traditional email is not agent-friendly
- Lack of encryption standards for agents
- No verifiable agent identity
- Privacy leakage through headers

## 3. Solution

An MCP-based email system:
- **MCP protocol** for agent email
- **End-to-end encryption** for content
- **Agent verification** through signatures
- **Header privacy** protection

## 4. Functional Requirements

| Priority | Feature | Description | Status |
|----------|---------|-------------|--------|
| P0 | MCP Transport | Email via MCP | ✅ Complete |
| P0 | Agent Auth | Agent authentication | ✅ Complete |
| P0 | Message Encryption | E2E email encryption | 🔄 In Progress |
| P1 | Inbox Management | Agent inbox handling | ⏳ Pending |
| P2 | Auto-responses | Agent automation | ⏳ Future |

## 5. Technical Architecture

### 5.1 Source Code References

| Component | Path | Status |
|-----------|------|--------|
| MCP Email | `TIER2_DEVELOPMENT/zk-email/src/zk-email.ts` | 🔄 30% |
| MCP Transport | `TIER2_DEVELOPMENT/zk-email/src/` | ✅ |

### 5.2 Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                   AGENT EMAIL ARCHITECTURE                     │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   Agent Email Clients                   │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │   │
│  │  │  Agent  │  │  Agent  │  │  Agent  │  │  Agent  │   │   │
│  │  │    A    │  │    B    │  │    C    │  │    D    │   │   │
│  │  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘   │   │
│  └───────┼────────────┼────────────┼────────────┼────────┘   │
│          │            │            │            │              │
│          └────────────┴─────┬──────┴────────────┘              │
│                             │                                   │
│                             ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              MCP Email Protocol                         │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │  Email Operations: send, receive, search, etc.  │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                             │                                   │
│                             ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                 Security Layer                          │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │   │
│  │  │  ZK Proofs  │  │  Signatures │  │  Encryption     │ │   │
│  │  │  (Optional) │  │  Ed25519    │  │  Hybrid (Team1) │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## 6. Prize Categories

| Prize | Entry | Backup | Status |
|-------|-------|--------|--------|
| Aztec ZK Application ($7.5K) | Agent Email | ZK Claims | Active |
| Most Innovative ($10K) | Agent Email | MCP Chat | Active |

## 7. Dependencies

### 7.1 Internal (Team 1)
- Kyber-768: `choom.chat/src/crypto/kyber.ts`
- Hybrid Encryption: `choom.chat/src/crypto/hybrid.ts`

### 7.2 Cross-Team
- ZK Email: Team 3 (ZK-TECH)

## 8. Related Documents

| Document | Path |
|----------|------|
| Architecture | `./ARCHITECTURE.md` |
| Submission | `./SUBMISSION-mcpmail.dev.md` |
| Source | `TIER2_DEVELOPMENT/zk-email/` |
| Master Matrix | `../FINAL-HACKATHON-MATRIX.md` |

---

**Document Version:** 1.0  
**Status:** Active  
**Last Updated:** 2026-01-31

