# TEAM-CONSUMER-PRIVACY Architecture

> Shared modules, dependencies, and integration patterns

## Module Dependency Graph

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    TEAM-CONSUMER-PRIVACY                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐   │
│  │  bytes.zip      │     │  megabyte.zip   │     │   lnk.zip       │   │
│  │  (File Encrypt) │     │  (Compression)  │     │   (Links)       │   │
│  └────────┬────────┘     └────────┬────────┘     └────────┬────────┘   │
│           │                       │                       │            │
│           └───────────────────────┼───────────────────────┘            │
│                                   │                                    │
│                                   ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │              SHARED CONSUMER MODULES                        │       │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐│       │
│  │  │ File Encrypt │ │ Streaming    │ │ Link Encryption      ││       │
│  │  │  (AES-256)   │ │  (ChaCha20)  │ │  (URL-safe)          ││       │
│  │  └──────────────┘ └──────────────┘ └──────────────────────┘│       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                   │                                    │
│                                   ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │              FORKED FROM SDK-TEAM (Team 4)                  │       │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐│       │
│  │  │ ChaCha20     │ │ Merkle Tree  │ │ Crypto Utils         ││       │
│  │  │  (Streaming) │ │  (Verify)    │ │  (Hash/AES)          ││       │
│  │  └──────────────┘ └──────────────┘ └──────────────────────┘│       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                         │
│  ┌─────────────────┐     ┌─────────────────┐                          │
│  │  password-vault │     │  dasr-market    │                          │
│  │  (Passwords)    │     │  (Marketplace)  │                          │
│  └─────────────────┘     └─────────────────┘                          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Shared Modules

### 1. File Encryption

**Primary Location:** `bytes.zip/src/file-encrypt.ts`

**Forks:**
- `megabyte/src/file-encrypt.ts` → megabyte.zip
- `priv.pass/src/file-encrypt.ts` → priv.pass.xyz
- `password-vault/src/file-encrypt.ts` → password-vault

**Usage:**
```typescript
import { encryptFile, decryptFile } from '@consumer/encryption';

await encryptFile(inputPath, outputPath, password);
await decryptFile(inputPath, outputPath, password);
```

### 2. Streaming Encryption

**Primary Location:** `bytes.zip/src/streaming.ts`

**Usage:**
```typescript
import { createEncryptStream, createDecryptStream } from '@consumer/streaming';

const encryptor = createEncryptStream(password);
const input = fs.createReadStream(file);
const output = fs.createWriteStream(encrypted);
input.pipe(encryptor).pipe(output);
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                      TECHNOLOGY STACK                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FRAMEWORK              │  LANGUAGE    │  CRYPTO LIB            │
│  ───────────────────────┼──────────────┼─────────────────────   │
│  Express (API)          │  TypeScript  │  crypto-js             │
│  Node.js (CLI)          │  TypeScript  │  @noble/curves        │
│  React (UI)             │  TypeScript  │  tweetnacl             │
│                                                                 │
│  STORAGE                │  DEPLOYMENT  │  TESTING               │
│  ───────────────────────┼──────────────┼─────────────────────   │
│  S3 (encrypted)         │  Vercel      │  Jest                  │
│  IPFS (optional)        │  Railway     │  Mocha                 │
│  Local (encrypted)      │  Docker      │  Cypress               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Security Architecture

### Threat Model

| Threat | Mitigation | Implementation |
|--------|------------|----------------|
| File theft | AES-256-GCM | `file-encrypt.ts` |
| Stream interception | ChaCha20-Poly1305 | `streaming.ts` |
| Password breach | bcrypt/Argon2 | `vault.ts` |
| Link leakage | Encrypted URLs | `link.ts` |

### Key Management

```
┌────────────────────────────────────────────────────────────────┐
│                 CONSUMER KEY HIERARCHY                         │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Master Password (User memorization)                           │
│      │                                                         │
│      ├── File Encryption Key (Derived)                         │
│      │     └── AES-256-GCM key                                 │
│      │                                                           │
│      ├── Link Key (Derived)                                    │
│      │     └── ChaCha20 key                                    │
│      │                                                           │
│      └── Vault Key (Derived)                                   │
│            └── Argon2id memory-hard function                   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## Related Documents

- [README.md](./README.md) - Team overview
- [PRD-bytes.zip.md](./PRD-bytes.zip.md) - Domain requirements
- [SUBMISSION-bytes.zip.md](./SUBMISSION-bytes.zip.md) - Submission template
- Source: `TIER1_PRIORITY/bytes.zip/src/`

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-31

