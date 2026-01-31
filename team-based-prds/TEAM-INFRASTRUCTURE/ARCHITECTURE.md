# TEAM-INFRASTRUCTURE Architecture

> Shared modules, dependencies, and integration patterns

## Module Dependency Graph

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    TEAM-INFRASTRUCTURE                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐   │
│  │   dns.foo       │     │ themail.host    │     │   thegit.host   │   │
│  │  (Privacy DNS)  │     │  (Email)        │     │   (Git)         │   │
│  └────────┬────────┘     └────────┬────────┘     └────────┬────────┘   │
│           │                       │                       │            │
│           └───────────────────────┼───────────────────────┘            │
│                                   │                                    │
│                                   ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │              SHARED INFRA MODULES                           │       │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐│       │
│  │  │ VPN Tunnel   │ │ PQ Handshake │ │ Key Rotation         ││       │
│  │  │  (Security)  │ │  (Crypto)    │ │  (Key Mgmt)          ││       │
│  │  └──────────────┘ └──────────────┘ └──────────────────────┘│       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                   │                                    │
│                                   ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │              FORKED FROM TIER2 (Rust)                       │       │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐│       │
│  │  │ helix-core   │ │ vpn-daemon   │ │ helix-flutter        ││       │
│  │  │ (P2P/Rust)   │ │ (VPN/Rust)   │ │ (Mobile/Rust)        ││       │
│  │  └──────────────┘ └──────────────┘ └──────────────────────┘│       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Shared Modules

### 1. VPN Daemon (PQ Security)

**Primary Location:** `TIER2_DEVELOPMENT/vpn-daemon/src/`

**Components:**
- `pq_handshake.rs` - Post-quantum key exchange
- `key_rotation.rs` - Automatic key rotation
- `main.rs` - VPN tunnel management

### 2. Helix Core (P2P Messaging)

**Primary Location:** `TIER2_DEVELOPMENT/helix-core/src/`

**Components:**
- `kyber.rs` - Kyber-768 in Rust
- `lib.rs` - Core library

## Technology Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                      TECHNOLOGY STACK                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  LANGUAGE               │  FRAMEWORK     │  CRYPTO LIB          │
│  ───────────────────────┼────────────────┼────────────────────   │
│  Rust (infra services)  │  Tokio         │  ring                │
│  TypeScript (APIs)      │  Actix-web     │  rust-crypto         │
│  Dart (mobile)          │  Flutter       │  noble (FFI)         │
│                                                                 │
│  DEPLOYMENT             │  INFRA         │  CONTAINER           │
│  ───────────────────────┼────────────────┼────────────────────   │
│  Docker                 │  Railway       │  Docker              │
│  Kubernetes (future)    │  Vercel        │  Docker Compose      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-31

