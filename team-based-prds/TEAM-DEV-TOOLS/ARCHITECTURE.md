# TEAM-DEV-TOOLS Architecture

> Shared modules, dependencies, and integration patterns

## Module Dependency Graph

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       TEAM-DEV-TOOLS                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐   │
│  │  sdk-solana     │     │   silver.sh     │     │   cli-gitnpm    │   │
│  │  (Primary SDK)  │     │   (Shell Tool)  │     │   (NPM Tool)    │   │
│  └────────┬────────┘     └────────┬────────┘     └────────┬────────┘   │
│           │                       │                       │            │
│           └───────────────────────┼───────────────────────┘            │
│                                   │                                    │
│                                   ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │              SHARED CRYPTO MODULES                          │       │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐│       │
│  │  │ Merkle Tree  │ │ ChaCha20     │ │ Stealth Addresses    ││       │
│  │  │  (ZK Proof)  │ │ Crypto       │ │  (Payment Privacy)   ││       │
│  │  └──────────────┘ └──────────────┘ └──────────────────────┘│       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                   │                                    │
│                                   ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │              FORKED TO OTHER TEAMS                          │       │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐│       │
│  │  │ Teams 1,2,3  │ │ Teams 1,2,11 │ │ Teams 2,11           ││       │
│  │  │ (Merkle)     │ │ (Crypto)     │ │ (Stealth)            ││       │
│  │  └──────────────┘ └──────────────┘ └──────────────────────┘│       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Shared Modules

### 1. Merkle Tree (Most Forked)

**Primary Location:** `sdk-solana/src/zk/merkle.ts`

**Forks:** Teams 1, 2, 3
- `choom/src/lib/merkle.ts`
- `billpayx/src/utils/merkle.ts`
- `shadowpay/src/zk/merkle.ts`
- `zk.claims/src/zk/merkle.ts`

### 2. ChaCha20 Crypto

**Primary Location:** `sdk-solana/src/utils/crypto.ts`

**Forks:** Teams 1, 2, 11
- `bytes/src/utils/crypto.ts`
- `megabyte/src/utils/crypto.ts`
- `choom/src/crypto/chacha.ts`

### 3. Stealth Addresses

**Primary Location:** `sdk-solana/src/stealth/`

**Forks:** Teams 1, 2, 11
- `billpayx/src/stealth/`
- `shadowpay/src/stealth/`

## Technology Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                      TECHNOLOGY STACK                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FRAMEWORK              │  LANGUAGE    │  CRYPTO LIB            │
│  ───────────────────────┼──────────────┼─────────────────────   │
│  Node.js (SDK)          │  TypeScript  │  @noble/curves        │
│  Commander.js (CLI)     │  TypeScript  │  @noble/hashes        │
│  Rust (lib)             │  Rust        │  tweetnacl             │
│                                                                 │
│  BLOCKCHAIN             │  TESTING     │  PACKAGE MGMT          │
│  ───────────────────────┼──────────────┼─────────────────────   │
│  Solana                 │  Jest        │  NPM                   │
│  (Optional chains)      │  Mocha       │  Cargo (Rust)          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-31

