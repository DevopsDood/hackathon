# TEAM-PRIVACY-MESSAGING Architecture

> Shared modules, dependencies, and integration patterns

## Module Dependency Graph

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     TEAM-PRIVACY-MESSAGING                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐   │
│  │  choom.chat     │     │ mranderson.one  │     │   mactalk.xyz   │   │
│  │  (Primary)      │     │  (Matrix)       │     │   (MCP)         │   │
│  └────────┬────────┘     └────────┬────────┘     └────────┬────────┘   │
│           │                       │                       │            │
│           └───────────────────────┼───────────────────────┘            │
│                                   │                                    │
│                                   ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │              SHARED CRYPTO MODULES                          │       │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐│       │
│  │  │ Kyber-768    │ │ Hybrid       │ │ E2E Messaging        ││       │
│  │  │ (PQ Crypto)  │ │ Encryption   │ │ (Session Mgmt)       ││       │
│  │  └──────────────┘ └──────────────┘ └──────────────────────┘│       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                   │                                    │
│                                   ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │              FORKED FROM OTHER TEAMS                        │       │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐│       │
│  │  │ Stealth      │ │ Merkle       │ │ File Encryption      ││       │
│  │  │ Addresses    │ │ Trees        │ │ (Bytes/Zip)          ││       │
│  │  │ (Team 2)     │ │ (Team 4)     │ │ (Team 11)            ││       │
│  │  └──────────────┘ └──────────────┘ └──────────────────────┘│       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Shared Modules

### 1. Kyber-768 Post-Quantum Crypto

**Primary Location:** `choom.chat/src/crypto/kyber.ts`

**Forks:**
- `matrix-privacy/src/crypto/kyber.ts` → mranderson.one
- `mactalk/src/crypto/kyber.ts` → mactalk.xyz

**Usage:**
```typescript
import { Kyber768 } from '@choom/crypto/kyber';

const keyPair = await Kyber768.generateKeyPair();
const ciphertext = await Kyber768.encapsulate(publicKey);
const sharedSecret = await Kyber768.decapsulate(ciphertext, privateKey);
```

**Integration Points:**
- Hybrid encryption module
- Session key establishment
- File encryption key wrapping

### 2. Hybrid Encryption

**Primary Location:** `choom.chat/src/crypto/hybrid.ts`

**Forks:**
- `matrix/src/crypto/hybrid.ts` → mranderson.one
- `billpayx/src/crypto/hybrid.ts` → Team 2

**Encryption Flow:**
```
┌────────────────────────────────────────────────────────────────┐
│                    HYBRID ENCRYPTION                           │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Plaintext                                                     │
│      │                                                         │
│      ▼                                                         │
│  ┌─────────┐     ┌────────────┐     ┌────────────────────┐    │
│  │ X25519  │────▶│ ChaCha20-  │────▶│ Encrypted Message  │    │
│  │ Key Enc │     │ Poly1305   │     │ + Auth Tag         │    │
│  └─────────┘     └────────────┘     └────────────────────┘    │
│      │                                                         │
│      ▼                                                         │
│  ┌─────────┐     ┌────────────┐                                │
│  │ Kyber   │────▶│ KEM        │                                │
│  │ PQ Enc  │     │ Ciphertext │                                │
│  └─────────┘     └────────────┘                                │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 3. E2E Messaging

**Primary Location:** `choom.chat/src/core/messaging.ts`

**Forks:**
- `matrix/src/core/messaging.ts` → mranderson.one
- `mactalk/src/core/messaging.ts` → mactalk.xyz

**Features:**
- Double Ratchet for forward secrecy
- Pre-key bundles for offline messaging
- Group encryption support

## Cross-Team Dependencies

### From Team 2 (PAYMENTS-STEALTH)

| Module | Path | Purpose |
|--------|------|---------|
| Stealth Address Gen | `billpayx.com/src/stealth/addr.ts` | Secure payment links in chat |
| Payment Scanner | `billpayx.com/src/stealth/scan.ts` | Scan payment QR codes |
| View/Scan Keys | `billpayx.com/src/stealth/keys.ts` | Key management |

### From Team 4 (DEV-TOOLS)

| Module | Path | Purpose |
|--------|------|---------|
| Merkle Tree | `sdk-solana/src/zk/merkle.ts` | Message authenticity proofs |
| ChaCha20 Utils | `sdk-solana/src/utils/crypto.ts` | Stream encryption |

### From Team 11 (CONSUMER-PRIVACY)

| Module | Path | Purpose |
|--------|------|---------|
| File Encryption | `bytes.zip/src/file-encrypt.ts` | Attachments |
| Streaming Encrypt | `bytes.zip/src/streaming.ts` | Voice/video |

## Technology Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                      TECHNOLOGY STACK                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FRAMEWORK              │  LANGUAGE    │  CRYPTO LIB           │
│  ───────────────────────┼──────────────┼─────────────────────   │
│  Next.js (choom.chat)   │  TypeScript  │  @noble/curves        │
│  Matrix SDK (mranderson)│  TypeScript  │  @noble/hashes        │
│  Custom MCP (mactalk)   │  TypeScript  │  tweetnacl            │
│                                                                 │
│  BLOCKCHAIN             │  DEPLOYMENT  │  TESTING              │
│  ───────────────────────┼──────────────┼─────────────────────   │
│  Solana (optional)      │  Vercel      │  Jest                 │
│  Matrix (decentralized) │  Docker      │  Mocha                │
│  None (local)           │  NPM         │  Cypress              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Security Architecture

### Threat Model

| Threat | Mitigation | Implementation |
|--------|------------|----------------|
| Quantum Decryption | Kyber-768 KEM | `kyber.ts` |
| MITM Attacks | Hybrid Certs | `hybrid.ts` |
| Forward Secrecy | Double Ratchet | `messaging.ts` |
| Metadata Leakage | Mix Networks | Pending |
| Side Channels | Constant-time Ops | Native crypto |

### Key Management

```
┌────────────────────────────────────────────────────────────────┐
│                    KEY MANAGEMENT HIERARCHY                    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Master Key (Hardware/Keychain)                                │
│      │                                                         │
│      ├── Identity Key (Long-term)                              │
│      │     └── Kyber Key Pair                                  │
│      │                                                           │
│      ├── Session Keys (Ephemeral)                              │
│      │     ├── X25519 Key Pair                                 │
│      │     └── Chain Key (Ratchet)                             │
│      │                                                           │
│      └── Storage Keys (At-rest)                                │
│            └── ChaCha20-Secret                                 │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## Performance Targets

| Operation | Target | Current |
|-----------|--------|---------|
| Key Generation | < 100ms | 85ms |
| Encryption (1KB) | < 10ms | 8ms |
| Decryption (1KB) | < 10ms | 9ms |
| Message Send | < 50ms | 42ms |
| Session Init | < 200ms | 175ms |

## Testing Strategy

```
┌────────────────────────────────────────────────────────────────┐
│                    TESTING PYRAMID                             │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│                        ┌─────────┐                             │
│                        │   E2E   │  ← Integration tests        │
│                        │  Tests  │    (Cypress)                │
│                       ┌┴─────────┴┐                            │
│                       │  Unit     │  ← Component tests         │
│                       │  Tests    │    (Jest/Mocha)            │
│                      ┌┴───────────┴┐                           │
│                      │ Crypto      │  ← Module tests           │
│                      │ Tests       │    (100% coverage)        │
│                     ┌┴─────────────┴┐                          │
│                     │ Fuzzing       │  ← Security tests        │
│                     │ & Audit       │    (Custom fuzzers)      │
│                     └───────────────┘                          │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## Related Documents

- [README.md](./README.md) - Team overview
- [PRD-choom.chat.md](./PRD-choom.chat.md) - Domain requirements
- [SUBMISSION-choom.chat.md](./SUBMISSION-choom.chat.md) - Submission template
- Source: `TIER1_PRIORITY/choom.chat/src/crypto/kyber.ts`
- Source: `TIER1_PRIORITY/choom.chat/src/crypto/hybrid.ts`

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-31

