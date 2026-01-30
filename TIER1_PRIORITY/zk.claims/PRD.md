# zk.claims - Product Requirements Document

**Version:** 1.0.0  
**Last Updated:** 2026-01-30  
**Status:** ⚠️ CONCEPT / SUBMISSION READY (Documentation Only)  
**Prize Category:** Aztec - Best Overall ($5K) + Non-Financial ($2.5K)  
**Total Potential:** $7,500 USD  

---

## 1. Executive Summary

### 1.1 Project Overview

**zk.claims** is a zero-knowledge claims verification system built on the Aztec privacy network. The system enables users to prove verifiable claims (age, credentials, income, ownership) without revealing the underlying sensitive data to verifiers.

### 1.2 Core Value Proposition

- **Privacy-Preserving Verification:** Prove claims without exposing personal data
- **Reusable Proofs:** Generate proofs once, verify multiple times
- **Trustless Verification:** No trusted third parties required
- **Aztec Integration:** Built on Aztec's privacy-by-default architecture

### 1.3 Competition Fit

| Challenge | Prize | Fit | Status |
|-----------|-------|-----|--------|
| Aztec - Best Overall | $5,000 | High | Ready to Submit |
| Aztec - Non-Financial | $2,500 | High | Ready to Submit |
| **TOTAL** | **$7,500** | | |

---

## 2. Architecture & Design

### 2.1 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    zk.claims SYSTEM ARCHITECTURE                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      User Interface                       │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │  │
│  │  │ Web Portal  │  │ CLI Tool    │  │ SDK Integration │  │  │
│  │  │ (Next.js)   │  │ (Node.js)   │  │ (TypeScript)    │  │  │
│  │  └──────┬──────┘  └──────┬──────┘  └───────┬─────────┘  │  │
│  │         │                │                  │            │  │
│  │         └────────────────┼──────────────────┘            │  │
│  │                          ▼                               │  │
│  │         ┌──────────────────────────────────────────┐    │  │
│  │         │          Core ZK Claims SDK              │    │  │
│  │         │  ┌────────────────────────────────────┐  │    │  │
│  │         │  │ Claim Manager    │ Proof Generator │  │    │  │
│  │         │  │ • Create claims  │ • Noir circuits │  │    │  │
│  │         │  │ • Store metadata │ • Aztec integration│  │  │
│  │         │  │ • Revoke claims  │ • Verification  │  │    │  │
│  │         │  └────────────────────────────────────┘  │    │  │
│  │         └──────────────────────────────────────────┘    │  │
│  │                          │                               │  │
│  └──────────────────────────┼───────────────────────────────┘  │
│                             │                                   │
│                             ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Aztec Network Layer                    │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │              Noir Smart Contracts                  │  │  │
│  │  │  ┌──────────────┐ ┌──────────────┐ ┌────────────┐ │  │  │
│  │  │  │ Claims       │ │ Proof        │ │ Verifier   │ │  │  │
│  │  │  │ Registry     │ │ Generator    │ │ Contract   │ │  │  │
│  │  │  └──────────────┘ └──────────────┘ └────────────┘ │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                          │                               │  │
│  │         ┌────────────────┼────────────────┐              │  │
│  │         ▼                ▼                ▼              │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────────┐    │  │
│  │  │ Aztec L2   │  │ Privacy    │  │ Rollup         │    │  │
│  │  │ Execution  │  │ Circuits   │  │ Verification   │    │  │
│  │  └────────────┘  └────────────┘  └────────────────┘    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Smart Contracts | Noir (Aztec) | ZK circuit definitions |
| Frontend | Next.js + TypeScript | User interface |
| Backend | Node.js + Express | API services |
| ZK Proofs | Aztec.js | Proof generation/verification |
| Storage | IPFS (encrypted) | Claim metadata |
| Blockchain | Aztec Network | Settlement layer |

### 2.3 Claim Types Supported

| Claim Type | Description | Use Case |
|------------|-------------|----------|
| **Age** | Prove age ≥ threshold | Age-restricted access |
| **Income** | Prove income ≥ amount | Loan eligibility |
| **Credentials** | Prove certification | Professional verification |
| **Ownership** | Prove asset ownership | NFT/access token proof |
| **Membership** | Prove group membership | DAO/gated communities |
| **Reputation** | Prove reputation score | Trustless ratings |

---

## 3. API Documentation

### 3.1 Core SDK API

#### `ZkClaims` Class

```typescript
class ZkClaims {
  /**
   * Initialize the ZK Claims SDK
   * @param config - SDK configuration
   */
  constructor(config: ZkClaimsConfig);

  /**
   * Create a new claim
   * @param claim - Claim data and type
   * @returns Claim instance
   */
  async create(claim: ClaimData): Promise<Claim>;

  /**
   * Verify a claim proof
   * @param proof - Proof to verify
   * @returns Verification result
   */
  async verify(proof: ClaimProof): Promise<VerificationResult>;

  /**
   * Revoke an existing claim
   * @param claimId - ID of claim to revoke
   */
  async revoke(claimId: string): Promise<void>;
}
```

#### Claim Creation

```typescript
interface ClaimData {
  type: 'age' | 'income' | 'credential' | 'ownership' | 'membership';
  value: number | string;
  threshold?: number;
  metadata?: Record<string, unknown>;
  expiresAt?: Date;
}

// Example: Age claim
const ageClaim = await zkClaims.create({
  type: 'age',
  value: 25,
  threshold: 18
});

// Example: Income claim
const incomeClaim = await zkClaims.create({
  type: 'income',
  value: 100000,
  threshold: 50000,
  metadata: { currency: 'USD', period: 'annual' }
});
```

#### Proof Generation

```typescript
interface Claim {
  id: string;
  type: ClaimType;
  commitment: string;  // Hashed claim data
  
  /**
   * Generate ZK proof for this claim
   * @returns Proof that can be verified without revealing value
   */
  async generateProof(): Promise<ClaimProof>;
  
  /**
   * Get public claim info (without sensitive data)
   */
  getPublicInfo(): PublicClaimInfo;
}
```

### 3.2 Verification API

```typescript
interface VerificationResult {
  valid: boolean;
  claimType: ClaimType;
  threshold: number;
  timestamp: Date;
  proofId: string;
  // Note: actual value is NOT included
}

// Verify without seeing the actual value
const result = await zkClaims.verify(proof);
// result.valid = true
// result.threshold = 18 (only threshold is visible)
// result.value = undefined (actual value hidden)
```

### 3.3 Noir Circuit Interface

```rust
// claims/src/main.nr

fn main(
    // Private inputs (kept secret)
    value: Field,
    threshold: Field,
    secret: Field,
    
    // Public inputs (visible to all)
    commitment: pub Field,
    merkle_root: pub Field,
) {
    // Verify value meets threshold
    assert(value >= threshold);
    
    // Verify commitment matches
    let computed_commitment = poseidon_hash([value, secret]);
    assert(computed_commitment == commitment);
    
    // Verify in Merkle tree
    assert(merkle_proof_verify(merkle_root, commitment));
}
```

---

## 4. Feature List & Implementation Status

### 4.1 Feature Matrix

| Feature | Status | Priority | Notes |
|---------|--------|----------|-------|
| **Core Features** | | | |
| Age claim proofs | ⚠️ Planned | High | Circuit design complete |
| Income claim proofs | ⚠️ Planned | High | Circuit design complete |
| Credential proofs | ⚠️ Planned | Medium | Architecture defined |
| Ownership proofs | ⚠️ Planned | Medium | Architecture defined |
| Membership proofs | ⚠️ Planned | Low | Architecture defined |
| **Technical Features** | | | |
| Noir circuit implementation | ⚠️ Planned | Critical | Aztec integration required |
| Aztec.js SDK integration | ⚠️ Planned | Critical | Pending Aztec docs review |
| Proof generation | ⚠️ Planned | Critical | Core functionality |
| Proof verification | ⚠️ Planned | Critical | Core functionality |
| Reusable proofs | ⚠️ Planned | High | Design pattern defined |
| Claim revocation | ⚠️ Planned | Medium | Architecture defined |
| **User Interface** | | | |
| Web portal | ⚠️ Planned | High | Next.js scaffold ready |
| CLI tool | ⚠️ Planned | Medium | Node.js structure ready |
| SDK package | ⚠️ Planned | High | TypeScript types defined |
| Documentation | ✅ Complete | Critical | This PRD + README |

### 4.2 Implementation Gaps

| Gap | Impact | Mitigation |
|-----|--------|------------|
| No Noir circuits | Critical | Use Aztec documentation patterns |
| No Aztec deployment | Critical | Reference Aztec testnet |
| No working proof gen | Critical | Document expected behavior |
| Empty src/ directory | High | Document intended structure |
| No tests | Medium | Document test strategy |

---

## 5. Code Structure

### 5.1 Project Layout

```
zk.claims/
├── README.md                    # Basic documentation
├── package.json                 # NPM configuration
├── PRD.md                       # This document
├── Nargo.toml                   # Noir project config [NEEDED]
├── src/
│   ├── index.ts                 # Main SDK export [NEEDED]
│   ├── claims/
│   │   ├── age.ts               # Age claim implementation [NEEDED]
│   │   ├── income.ts            # Income claim implementation [NEEDED]
│   │   ├── credential.ts        # Credential claims [NEEDED]
│   │   └── ownership.ts         # Ownership claims [NEEDED]
│   ├── circuits/
│   │   ├── age.nr               # Age proof circuit [NEEDED]
│   │   ├── income.nr            # Income proof circuit [NEEDED]
│   │   └── verifier.nr          # Verification circuit [NEEDED]
│   ├── sdk/
│   │   ├── client.ts            # Aztec client wrapper [NEEDED]
│   │   ├── prover.ts            # Proof generation [NEEDED]
│   │   └── verifier.ts          # Proof verification [NEEDED]
│   └── types/
│       └── index.ts             # TypeScript definitions [NEEDED]
├── tests/
│   ├── age.test.ts              # Age claim tests [NEEDED]
│   ├── income.test.ts           # Income claim tests [NEEDED]
│   └── integration.test.ts      # End-to-end tests [NEEDED]
└── docs/
    └── api.md                   # API documentation [NEEDED]
```

### 5.2 Key Files Status

| File | Status | Lines | Description |
|------|--------|-------|-------------|
| `package.json` | ✅ Exists | 9 | NPM config with nargo scripts |
| `README.md` | ✅ Exists | 38 | Basic overview |
| `src/` | ⚠️ Empty | 0 | Source directory empty |
| `Nargo.toml` | ❌ Missing | - | Noir project config |
| `*.nr` circuits | ❌ Missing | - | ZK proof circuits |

---

## 6. Submission Details - Aztec Challenge

### 6.1 Submission Categories

#### Category 1: Best Overall ($5,000)
- **Why We Fit:** Privacy-preserving claims verification is a core use case for ZK technology
- **Innovation:** Reusable proofs without data exposure
- **Technical Merit:** Direct Aztec/Noir integration

#### Category 2: Non-Financial ($2,500)
- **Why We Fit:** Age verification, credentials, identity proofs
- **Social Impact:** Privacy-preserving identity verification
- **Non-Financial Use Cases:** Voting, access control, reputation

### 6.2 Submission Checklist

- [x] Project idea documented
- [x] Architecture defined
- [x] API specification complete
- [x] README.md created
- [ ] Demo video recorded [NEEDED]
- [ ] Working prototype [CONCEPT STAGE]
- [ ] Aztec testnet deployment [NEEDED]
- [ ] GitHub repository public [VERIFY]

### 6.3 Submission Links

| Item | Link | Status |
|------|------|--------|
| GitHub Repo | `https://github.com/thegit-network/zk-claims` | Verify |
| Live Demo | `https://zk.claims` | Deploy |
| Demo Video | YouTube/Twitter | Record |
| Documentation | This PRD | Complete |

---

## 7. Demo Script (3 Minutes)

### 7.1 Video Script

```
[0:00-0:30] INTRO - The Privacy Problem
"Every day, we share sensitive personal data to prove simple things:
- Show your ID to prove you're over 18
- Share bank statements to prove income
- Display credentials to prove qualifications

This exposes way more information than necessary."

[0:30-1:00] SOLUTION - Zero-Knowledge Claims
"zk.claims solves this using zero-knowledge proofs on Aztec.
Instead of sharing your birthdate, you generate a mathematical proof
that only reveals: 'Yes, this person is over 18.'

The verifier sees only the proof result, not your actual data."

[1:00-1:45] DEMO - Age Verification
"Let me demonstrate with an age claim:

1. User creates claim: 'I am 25 years old'
   - Value stored privately on Aztec
   - Only a commitment is public

2. Generate proof for threshold: 'Age >= 18'
   - Noir circuit computes: 25 >= 18 ✓
   - Creates cryptographic proof

3. Share proof with verifier
   - Verifier sees: "Age verified: Over 18"
   - Verifier does NOT see: "Age: 25"

4. Proof can be reused multiple times
   - Same proof, multiple verifications
   - No additional data exposure"

[1:45-2:30] DEMO - Income Verification
"Same pattern for income verification:

1. User: 'I earn $75,000/year'
2. Proof: 'Income >= $50,000'
3. Verifier: Sees only the boolean result
4. Actual salary remains completely private

Perfect for loan applications, rental agreements,
and any situation requiring proof of means."

[2:30-3:00] CONCLUSION
"zk.claims brings privacy-preserving verification to everyday use:
- Prove without exposing
- Verify without trusting
- Reuse without revealing

Built on Aztec for privacy by default.

zk.claims - Prove it. Privately."
```

### 7.2 Technical Talking Points

1. **Noir Circuits:** Native Aztec circuit language for ZK proofs
2. **Aztec Integration:** Privacy-preserving L2 for settlement
3. **Reusable Proofs:** Generate once, verify infinitely
4. **Trustless:** No trusted setup or third parties
5. **Extensible:** Support for any claim type

---

## 8. Code Completeness Verification

### 8.1 Current State

| Component | Exists | Complete | Tested |
|-----------|--------|----------|--------|
| Project structure | Partial | 10% | No |
| Package configuration | Yes | 100% | N/A |
| Documentation | Yes | 100% | N/A |
| Source code | No | 0% | No |
| Noir circuits | No | 0% | No |
| Tests | No | 0% | No |
| Deployment | No | 0% | No |

### 8.2 Overall Completeness: 15%

**Status:** CONCEPT STAGE - Documentation complete, implementation pending

### 8.3 What's Missing

1. **Critical:**
   - Noir circuit implementations
   - Aztec.js integration
   - Proof generation logic
   - Proof verification logic

2. **Important:**
   - TypeScript SDK implementation
   - Web interface
   - CLI tool
   - Unit tests

3. **Nice to Have:**
   - Additional claim types
   - Mobile app
   - Browser extension

---

## 9. Improvements Needed

### 9.1 Immediate (Before Submission)

1. **Create Minimal Working Demo**
   - Implement basic age claim circuit
   - Deploy to Aztec testnet
   - Record demo video

2. **Complete Core Implementation**
   - Write Noir circuits for age/income
   - Implement TypeScript SDK
   - Add basic tests

3. **Documentation**
   - API reference docs
   - Circuit explanation
   - Deployment guide

### 9.2 Post-Submission

1. **Expand Claim Types**
   - Credential verification
   - Ownership proofs
   - Reputation systems

2. **Production Features**
   - Claim revocation
   - Proof delegation
   - Multi-sig claims

3. **Ecosystem Integration**
   - Wallet integration
   - DApp SDK
   - Mobile support

---

## 10. References & Resources

### 10.1 Aztec Documentation

- [Aztec Docs](https://docs.aztec.network/)
- [Noir Language](https://noir-lang.org/)
- [Aztec.js SDK](https://docs.aztec.network/reference/developer_references/aztecjs)

### 10.2 ZK Resources

- [ZKProof Standards](https://zkproof.org/)
- [Noir Examples](https://github.com/noir-lang/noir-examples)
- [Aztec Tutorials](https://docs.aztec.network/tutorials)

### 10.3 Related Projects

| Project | Relation | Link |
|---------|----------|------|
| billpayx.com | Stealth payments | `TIER1_PRIORITY/billpayx.com/` |
| ShadowPay | Extended concept | `TIER3_CONCEPTS/shadowpay/` |
| Privacy SDK | Reusable components | `TIER1_PRIORITY/privacy-sdk/` |

---

## 11. Team & Attribution

**Developer:** thegit.network  
**License:** MIT  
**Repository:** `TIER1_PRIORITY/zk.claims/`  

---

## 12. Conclusion

zk.claims represents a compelling use case for zero-knowledge proofs on Aztec. While currently in concept stage with complete documentation, the implementation requires:

1. **Noir circuit development** for ZK proof generation
2. **Aztec testnet deployment** for live demonstration
3. **Demo video recording** for submission

The architecture is sound, the API is well-defined, and the competition fit is strong. With focused development, this project can become a production-ready privacy tool for claim verification.

**Recommendation:** Submit as concept/documentation entry with clear roadmap, or complete minimal implementation for full submission.

---

*Document Version: 1.0.0*  
*Last Updated: 2026-01-30*  
*Status: Complete for Documentation Review*
