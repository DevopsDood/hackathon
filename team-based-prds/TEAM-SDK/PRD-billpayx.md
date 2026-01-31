# PRD: BillPayX - Stealth Payment System

**Product Requirements Document**  
**Version:** 2.0  
**Last Updated:** 2026-01-31  
**Team:** TEAM-SDK (Primary), TEAM-PAY (Consumer)  
**Domain:** billpayx.com  
**Prize Target:** $3,500 (Starpay Payment UX)

---

## 1. Executive Summary

BillPayX is a privacy-preserving payment system that uses stealth addresses to enable confidential transactions. Merchants can receive payments without revealing their actual address, and payers can send private payments that only the recipient can identify and claim.

## 2. Problem Statement

Current payment systems have fundamental privacy issues:
- All transactions are publicly visible on-chain
- Merchants must expose receive addresses
- Payment correlation enables tracking
- No privacy for routine transactions

## 3. Target Users

1. **Merchants** - Receive payments privately
2. **Consumers** - Pay without exposing spending habits
3. **Services** - Process private payments
4. **Gaming** - Anonymous in-game purchases

## 4. Product Requirements

### 4.1 Core Features

| Feature | Priority | Status | Description |
|---------|----------|--------|-------------|
| Stealth Address Gen | P0 | Complete | Generate one-time addresses |
| Payment Scanner | P0 | Complete | Find payments for user |
| Key Management | P0 | Complete | View/scan key handling |
| Payment API | P0 | Complete | REST API for payments |
| Web Dashboard | P1 | Partial | Admin interface |
| QR Payments | P1 | Pending | QR code generation |

### 4.2 API Requirements

```typescript
// Main API
interface BillPayXAPI {
  // Merchant endpoints
  createStealthAddress(merchantId: string): Promise<StealthAddress>;
  getPaymentStatus(paymentId: string): Promise<PaymentStatus>;
  
  // Payer endpoints
  createPayment(
    stealthAddress: StealthAddress,
    amount: bigint,
    metadata: PaymentMetadata
  ): Promise<Payment>;
  
  // Scanner endpoints
  scanForPayments(viewPrivateKey: Buffer): Promise<StealthPayment[]>;
  claimPayment(payment: StealthPayment, privateKey: Buffer): Promise<Transaction>;
  
  // Admin endpoints
  getMerchantStats(merchantId: string): Promise<MerchantStats>;
}

// Stealth address types
interface StealthAddress {
  prefix: Buffer;           // Network prefix
  viewPublicKey: Buffer;    // Ephemeral public key
  spendPublicKey: Buffer;   // Receiver's public key
  metadata: StealthMetadata;
}

interface StealthPayment {
  paymentId: string;
  stealthAddress: StealthAddress;
  amount: bigint;
  transactionSignature: string;
  blockNumber: number;
  createdAt: Date;
}
```

## 5. Technical Architecture

### 5.1 Directory Structure

```
billpayx.com/
├── src/
│   ├── index.ts            # Main entry point
│   ├── api/
│   │   ├── server.ts       # Express server (400 LOC)
│   │   ├── routes.ts       # API routes
│   │   └── middleware.ts   # Auth, validation
│   ├── stealth/
│   │   ├── index.ts        # Module exports
│   │   ├── addr.ts         # Address generation (500 LOC)
│   │   ├── scan.ts         # Payment scanning (400 LOC)
│   │   ├── keys.ts         # Key management (300 LOC)
│   │   └── transfer.ts     # Transfer logic (350 LOC)
│   ├── crypto/
│   │   ├── elliptic.ts     # EC operations
│   │   └── utils.ts        # Crypto helpers
│   ├── db/
│   │   ├── models.ts       # Database models
│   │   └── postgres.ts     # Postgres connection
│   └── types/
│       └── index.ts        # TypeScript types
├── tests/
│   ├── stealth/
│   │   ├── address.test.ts
│   │   ├── scanner.test.ts
│   │   └── keys.test.ts
│   └── api/
│       └── server.test.ts
├── docs/
│   ├── API.md
│   └── ARCHITECTURE.md
├── package.json
├── tsconfig.json
├── jest.config.js
├── README.md
├── LICENSE
└── SUBMISSION.md
```

### 5.2 Stealth Address Flow

```
┌──────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Merchant │    │ BillPayX Server  │    │ Blockchain      │
└────┬─────┘    └────────┬─────────┘    └────────┬────────┘
     │                   │                       │
     │ 1. Create Stealth │                       │
     │    Address        │                       │
     ├──────────────────►│                       │
     │                   │ 2. Store Address      │
     │                   │    in Database        │
     │                   └───────────┬───────────┘
     │                                   │
     │ 3. Share Public    ┌─────────────▼───────────┐
     │    Stealth Addr    │ Customer (Payer)        │
     │◄──────────────────┤                         │
     │                   │ 4. Generate One-Time     │
     │                   │    Payment Address       │
     │                   │    (ephemeral key pair)  │
     │                   │                         │
     │                   │ 5. Create Transaction   │
     │                   │    to One-Time Addr     │
     │                   ├─────────────────────────┼──►
     │                   │                         │ 6. Confirm on
     │                   │                         │    Blockchain
     │                   │                         │◄────────────
     │                   │ 7. Scan Blockchain      │
     │                   │    for Payments         │
     │                   ├─────────────────────────┼──►
     │                   │                         │
     │                   │ 8. Find Payment,       │
     │                   │    Derive Real Key     │
     │                   │                         │
     │ 9. Payment        │                         │
     │    Claimed        │                         │
     │◄──────────────────┤                         │
```

### 5.3 Dependencies

```json
{
  "name": "com.billpay.stealth",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.0",
    "@noble/curves": "^1.0.0",
    "@noble/hashes": "^1.3.0",
    "tweetnacl": "^1.0.3",
    "pg": "^8.11.0",
    "redis": "^4.6.0",
    "uuid": "^9.0.0"
  }
}
```

## 6. Security Requirements

### 6.1 Privacy Guarantees
- **Unlinkability**: Cannot link payment to merchant
- **Sender Privacy**: Sender's identity protected
- **Amount Privacy**: Payment amount encrypted

### 6.2 Safety Measures
- View/scan key separation
- Key rotation support
- Payment expiration
- Rate limiting on API

## 7. Testing Requirements

| Test Type | Coverage Target | Current |
|-----------|-----------------|---------|
| Unit Tests | 90% | 85% |
| Integration Tests | 80% | 70% |
| E2E Tests | 60% | 30% |

## 8. Completion Criteria

| Criterion | Target | Current |
|-----------|--------|---------|
| Stealth address generation | 100% | 100% |
| Payment scanning | 100% | 95% |
| API endpoints | 100% | 90% |
| Web dashboard | 100% | 50% |
| Submit to Starpay | Day 2 | Pending |

## 9. Dependencies & Relationships

### 9.1 Forked From (TEAM-SDK)
- `sdk-solana/src/zk/merkle.ts` → `billpayx/src/utils/merkle.ts`
- `sdk-solana/src/utils/crypto.ts` → `billpayx/src/crypto/utils.ts`

### 9.2 Forked To (TEAM-PAY)
- `billpayx/src/stealth/addr.ts` → `shadowpay/src/stealth/addr.ts`
- `billpayx/src/stealth/addr.ts` → `thevirus/src/stealth/addr.ts`

## 10. Timeline

| Milestone | Date | Status |
|-----------|------|--------|
| Stealth address gen | Day 1 | Complete |
| Payment scanner | Day 2 | Complete |
| REST API | Day 3 | Complete |
| Web dashboard | Day 4 | In Progress |
| Submit to Starpay | Day 5 | Pending |

---

*Document Version: 2.0*  
*Last Updated: 2026-01-31*

