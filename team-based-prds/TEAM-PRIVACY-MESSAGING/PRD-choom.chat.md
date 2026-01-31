# Product Requirements Document: choom.chat (Quantum Terminal)

> **Domain:** choom.chat  
> **Team:** TEAM-PRIVACY-MESSAGING  
> **Completeness:** 75%  
> **Tier:** TIER1_PRIORITY

## 1. Overview

**Project Name:** Quantum Terminal (choom.chat)  
**Tagline:** Post-Quantum Secure Terminal Chat  
**Purpose:** A terminal-based chat application with Kyber-768 post-quantum encryption

## 2. Problem Statement

Existing chat applications are vulnerable to:
- **Harvest now, decrypt later** attacks
- Quantum computers breaking current encryption
- Man-in-the-middle attacks on key exchange

## 3. Solution

A terminal-based chat application using:
- **Kyber-768** for post-quantum key encapsulation
- **Hybrid encryption** (Kyber + X25519 + ChaCha20-Poly1305)
- **E2E messaging** with forward secrecy

## 4. Target Users

| User Segment | Need | Solution |
|--------------|------|----------|
| Privacy Advocates | Maximum security | PQ crypto by default |
| Developers | Terminal-first workflow | CLI interface |
| Enterprise | Compliance | Audit-ready encryption |

## 5. Functional Requirements

### 5.1 Core Features

| Priority | Feature | Description | Status |
|----------|---------|-------------|--------|
| P0 | Key Generation | Generate Kyber-768 key pairs | ✅ Complete |
| P0 | Hybrid Encryption | Encrypt messages with hybrid scheme | ✅ Complete |
| P0 | E2E Messaging | End-to-end encrypted chat | ✅ Complete |
| P1 | CLI Interface | Terminal user interface | ✅ Complete |
| P1 | File Sharing | Encrypted file transfer | 🔄 In Progress |
| P2 | Group Chat | Multi-party encrypted chat | ⏳ Pending |
| P2 | Voice/Video | Encrypted real-time comms | ⏳ Future |

### 5.2 Encryption Requirements

```
┌────────────────────────────────────────────────────────────────┐
│                 ENCRYPTION STACK                               │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Layer 1: Post-Quantum                                        │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  Kyber-768 Key Encapsulation Mechanism (KEM)            │  │
│  │  - Generate key pairs                                    │  │
│  │  - Encapsulate shared secret                             │  │
│  │  - Decapsulate shared secret                             │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  Layer 2: Classical Hybrid                                     │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  X25519 Key Exchange + ChaCha20-Poly1305 AEAD           │  │
│  │  - Ephemeral key agreement                               │  │
│  │  - Symmetric encryption                                  │  │
│  │  - Authenticated encryption                              │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  Layer 3: Forward Secrecy                                      │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  Double Ratchet Protocol                                 │  │
│  │  - Continuous key rotation                               │  │
│  │  - Past message security                                 │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## 6. Technical Architecture

### 6.1 Source Code References

| Component | Path | Status |
|-----------|------|--------|
| Kyber-768 | `TIER1_PRIORITY/choom.chat/src/crypto/kyber.ts` | ✅ 800 LOC |
| Hybrid Crypto | `TIER1_PRIORITY/choom.chat/src/crypto/hybrid.ts` | ✅ 400 LOC |
| E2E Messaging | `TIER1_PRIORITY/choom.chat/src/core/messaging.ts` | ✅ 600 LOC |
| CLI Interface | `TIER1_PRIORITY/choom.chat/src/cli/index.ts` | ✅ Complete |
| Tests | `TIER1_PRIORITY/choom.chat/tests/` | ✅ 4 test suites |

### 6.2 API Endpoints

```typescript
// Key Management
POST /api/keys/generate     // Generate Kyber key pair
POST /api/keys/exchange     // Exchange public keys
GET  /api/keys/public/:id   // Get user's public key

// Messaging
POST /api/messages/send     // Send encrypted message
GET  /api/messages/inbox    // Retrieve messages
POST /api/messages/verify   // Verify message authenticity
```

## 7. User Stories

| ID | Story | Priority | Status |
|----|-------|----------|--------|
| US1 | As a user, I want to generate a PQ key pair | P0 | ✅ |
| US2 | As a user, I want to send encrypted messages | P0 | ✅ |
| US3 | As a user, I want to receive encrypted messages | P0 | ✅ |
| US4 | As a user, I want to share files securely | P1 | 🔄 |
| US5 | As a user, I want group chat functionality | P2 | ⏳ |
| US6 | As a user, I want voice/video calls | P2 | ⏳ |

## 8. Security Requirements

| Requirement | Implementation |
|-------------|----------------|
| Quantum Resistance | Kyber-768 KEM |
| Forward Secrecy | Double Ratchet |
| Authentication | Digital signatures |
| Key Compromise | Perfect forward secrecy |
| Metadata Protection | Onion routing (future) |

## 9. Non-Functional Requirements

| Requirement | Target | Current |
|-------------|--------|---------|
| Encryption Speed | < 10ms | 8ms |
| Key Gen Speed | < 100ms | 85ms |
| Message Latency | < 100ms | 75ms |
| Memory Usage | < 50MB | 42MB |
| Test Coverage | > 90% | 92% |

## 10. Dependencies

### 10.1 Internal Dependencies

| Module | Purpose | Location |
|--------|---------|----------|
| Kyber-768 | PQ crypto | `./src/crypto/kyber.ts` |
| Hybrid | Encryption | `./src/crypto/hybrid.ts` |
| Messaging | E2E chat | `./src/core/messaging.ts` |

### 10.2 External Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| @noble/curves | ^1.4.0 | Elliptic curve crypto |
| @noble/hashes | ^1.4.0 | Hash functions |
| tweetnacl | ^1.0.3 | NaCl crypto |
| yargs | ^17.7.2 | CLI parser |

### 10.3 Cross-Team Dependencies

| Team | Dependency | Purpose |
|------|------------|---------|
| Team 2 | Stealth addresses | Payment integration |
| Team 4 | SDK-Solana | Blockchain identity |
| Team 11 | File encryption | Attachments |

## 11. Integration Points

| Integration | Method | Status |
|-------------|--------|--------|
| Matrix Protocol | Bridging | ⏳ Future |
| Solana Wallet | Web3 auth | ⏳ Future |
| File sharing | Encrypted P2P | 🔄 |

## 12. Testing Strategy

| Test Type | Coverage | Status |
|-----------|----------|--------|
| Unit Tests | 100% | ✅ |
| Integration Tests | 85% | ✅ |
| E2E Tests | 70% | 🔄 |
| Security Audit | N/A | ⏳ Pending |

## 13. Deployment

| Environment | Platform | Status |
|-------------|----------|--------|
| Development | Local | ✅ |
| Staging | Vercel | ✅ |
| Production | Vercel | 🔄 |

## 14. Success Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Active Users | 1000 | 0 |
| Messages/Day | 10000 | 0 |
| Encryption Errors | < 0.1% | 0% |
| User Satisfaction | > 4.5/5 | N/A |

## 15. Risks and Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Kyber vulnerability | Low | High | Monitor NIST updates |
| Performance issues | Medium | Medium | Optimize crypto ops |
| User adoption | High | Medium | Developer outreach |

## 16. Related Documents

| Document | Path |
|----------|------|
| Architecture | `./ARCHITECTURE.md` |
| Submission Template | `./SUBMISSION-choom.chat.md` |
| Source Code | `TIER1_PRIORITY/choom.chat/` |
| API Docs | `TIER1_PRIORITY/choom.chat/docs/API.md` |
| Master Matrix | `../FINAL-HACKATHON-MATRIX.md` |

---

**Document Version:** 1.0  
**Status:** Active  
**Last Updated:** 2026-01-31

