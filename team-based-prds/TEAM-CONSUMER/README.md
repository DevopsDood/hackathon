# TEAM-CONSUMER: Privacy Consumer Apps

**Primary Focus:** Consumer-facing privacy applications, password management, file security, link encryption  
**Prize Pool:** $16,000+ primary, $5,000 backup  
**Language:** TypeScript

## Team Members & Responsibilities

| Role | Member | Focus Area |
|------|--------|------------|
| Lead | TBD | Consumer UX |
| Security Engineer | TBD | Vault & Passwords |
| File Engineer | TBD | Encryption |

## Projects

| Project | Domain | Status | Completion | Prize Target |
|---------|--------|--------|------------|--------------|
| **priv.pass.xyz** | priv.pass.xyz | Active | 40% | $2K (Inco) |
| **password-vault** | password-vault | Active | 60% | $6K (Privacy Cash) |
| **megabyte.zip** | megabyte.zip | Active | 75% | $6K (Privacy Cash) |
| **lnk.zip** | lnk.zip | Active | 40% | $2K (Consumer) |

## Architecture Components

### Password Vault (TypeScript)

```
password-vault/src/
├── vault.ts           (600 LOC) - Encrypted vault
├── hibp-client.ts     (200 LOC) - HIBP integration
├── generate.ts        (150 LOC) - Password generation
└── api.ts             (200 LOC) - Vault API
```

### File Encryption (TypeScript)

```
bytes.zip/src/
├── file-encrypt.ts    (400 LOC) - AES-256-GCM
├── streaming.ts       (300 LOC) - Chunked encryption
└── compress.ts        (250 LOC) - Compression
```

## Dependencies

```json
{
  "crypto-js": "^4.2.0",
  "pbkdf2": "^3.1.0",
  "haveibeenpwned": "^7.0.0"
}
```

## Timeline

### Phase 1: Immediate (Day 1)
- [ ] Submit password-vault to Privacy Cash ($6K)
- [ ] Submit megabyte.zip to Privacy Cash ($6K)

### Phase 2: Day 2
- [ ] Complete priv.pass.xyz integration
- [ ] Add lnk.zip link encryption

## Related Teams

- **TEAM-SDK**: Consumes encryption primitives
- **TEAM-PAY**: Uses file encryption system

---

*Last Updated: 2026-01-31*  
*Document Version: 1.0*

