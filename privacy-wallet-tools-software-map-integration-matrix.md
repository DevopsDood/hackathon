# Privacy Wallet Tools Software Map & Integration Matrix

**Created:** 2026-01-30  
**Purpose:** Comprehensive mapping of all privacy SDKs, tools, and components with monetary valuation and code reuse opportunities  
**Competition:** https://solana.com/privacyhack

---

## Executive Summary

This document maps all privacy-related SDKs, tools, and components across our codebase with:
- **Monetary valuation** per component
- **Lines of code (LOC)** estimates
- **Reusability score** across projects
- **Integration paths** between components
- **Effort estimates** to complete

---

## PART 1: COMPONENT INVENTORY BY CATEGORY

### 1.1 Zero-Knowledge (ZK) Components

| Component | Location | LOC | Status | Value | Reuse Score |
|-----------|----------|-----|--------|-------|-------------|
| **Merkle Tree** | `sdk-solana/src/zk/merkle.ts` | 600 | ✅ Complete | $2,000 | 10/10 |
| **Pedersen Commitment** | `sdk-solana/src/zk/commitment.ts` | 500 | ✅ Complete | $2,500 | 10/10 |
| **Range Proof** | `sdk-solana/src/zk/range-proof.ts` | 200 | ✅ Complete | $1,500 | 8/10 |
| **ZK Prover Interface** | `choom.chat/src/crypto/` | 400 | ✅ Complete | $3,000 | 9/10 |
| **ZK Verifier** | `choom.chat/src/crypto/` | 300 | ✅ Complete | $2,500 | 9/10 |
| **Balance Proof** | `shadowpay/src/zk/balance-proof.ts` | 400 | ⚠️ Partial | $2,000 | 7/10 |
| **Membership Proof** | `sdk-solana/src/zk/` | 300 | ⚠️ Partial | $1,500 | 6/10 |
| **Noir Circuits** | `shadowpay/contracts/` | 500 | ⚠️ Partial | $2,000 | 5/10 |
| **ZK Claims** | `zk.claims/src/` | 600 | ✅ Complete | $3,000 | 8/10 |
| **ZK Email** | `zk-email/src/` | 400 | ⚠️ Partial | $2,000 | 6/10 |
| **TOTAL ZK** | | **5,200** | | **$22,000** | |

### 1.2 Post-Quantum Cryptography (PQC) Components

| Component | Location | LOC | Status | Value | Reuse Score |
|-----------|----------|-----|--------|-------|-------------|
| **Kyber-768 KEM** | `choom.chat/src/crypto/kyber.ts` | 800 | ✅ Complete | $5,000 | 10/10 |
| **Kyber-768 Rust** | `helix-core/src/kyber.rs` | 600 | ✅ Complete | $4,000 | 10/10 |
| **X25519 Key Exchange** | `choom.chat/src/crypto/` | 300 | ✅ Complete | $2,000 | 9/10 |
| **Hybrid Encryption** | `choom.chat/src/crypto/hybrid.ts` | 400 | ✅ Complete | $2,500 | 9/10 |
| **ChaCha20-Poly1305** | `sdk-solana/src/utils/crypto.ts` | 500 | ✅ Complete | $2,000 | 8/10 |
| **PQ Handshake** | `vpn-daemon/src/pq_handshake.rs` | 400 | ⚠️ Partial | $3,000 | 7/10 |
| **Key Rotation** | `vpn-daemon/src/key_rotation.rs` | 300 | ⚠️ Partial | $2,000 | 6/10 |
| **Key Storage** | `privacy-shield-suite/` | 200 | ✅ Complete | $1,500 | 7/10 |
| **TOTAL PQC** | | **3,500** | | **$22,000** | |

### 1.3 Stealth Address Components

| Component | Location | LOC | Status | Value | Reuse Score |
|-----------|----------|-----|--------|-------|-------------|
| **Stealth Address Gen** | `billpayx.com/src/stealth/` | 500 | ✅ Complete | $3,000 | 10/10 |
| **Stealth Keys** | `billpayx.com/src/stealth/keys.ts` | 300 | ✅ Complete | $2,000 | 9/10 |
| **Payment Scanner** | `billpayx.com/src/stealth/scan.ts` | 400 | ✅ Complete | $2,500 | 9/10 |
| **Stealth Module TS** | `sdk-solana/src/stealth/` | 400 | ✅ Complete | $2,500 | 10/10 |
| **ShadowPay Stealth** | `shadowpay/src/stealth/` | 600 | ⚠️ Partial | $3,000 | 8/10 |
| **View Key Derivation** | `sdk-solana/src/stealth/` | 200 | ✅ Complete | $1,500 | 8/10 |
| **Scan Key Derivation** | `sdk-solana/src/stealth/` | 150 | ✅ Complete | $1,000 | 7/10 |
| **Stealth Spend** | `shadowpay/src/` | 300 | ⚠️ Partial | $2,000 | 6/10 |
| **TOTAL STEALTH** | | **2,850** | | **$17,500** | |

### 1.4 Encryption Components

| Component | Location | LOC | Status | Value | Reuse Score |
|-----------|----------|-----|--------|-------|-------------|
| **E2E Encryption** | `choom.chat/src/core/` | 600 | ✅ Complete | $3,000 | 9/10 |
| **Streaming Encrypt** | `choom.chat/src/core/` | 300 | ✅ Complete | $2,000 | 7/10 |
| **File Encryption** | `bytes.zip/src/` | 400 | ⚠️ Partial | $2,500 | 8/10 |
| **Session Management** | `choom.chat/src/core/` | 200 | ✅ Complete | $1,500 | 8/10 |
| **Forward Secrecy** | `choom.chat/src/crypto/` | 300 | ✅ Complete | $2,000 | 7/10 |
| **Memo Encryption** | `sdk-solana/src/transfer/` | 200 | ⚠️ Partial | $1,000 | 6/10 |
| **TOTAL ENCRYPTION** | | **2,000** | | **$12,000** | |

### 1.5 Solana Integration Components

| Component | Location | LOC | Status | Value | Reuse Score |
|-----------|----------|-----|--------|-------|-------------|
| **SDK Main Class** | `sdk-solana/src/index.ts` | 200 | ✅ Complete | $2,000 | 10/10 |
| **Solana Connection** | `sdk-solana/src/solana/` | 300 | ⚠️ Partial | $2,000 | 8/10 |
| **Transaction Builder** | `sdk-solana/src/transfer/` | 300 | ⚠️ Partial | $2,000 | 8/10 |
| **Stealth Payment** | `billpayx.com/src/` | 400 | ✅ Complete | $2,500 | 8/10 |
| **Helius Integration** | `choom.chat/` | 200 | ✅ Complete | $1,500 | 7/10 |
| **Program Integration** | `shadowpay/programs/` | 600 | ⚠️ Partial | $3,000 | 6/10 |
| **TOTAL SOLANA** | | **2,000** | | **$13,000** | |

### 1.6 Utility Components

| Component | Location | LOC | Status | Value | Reuse Score |
|-----------|----------|-----|--------|-------|-------------|
| **Crypto Utils** | `sdk-solana/src/utils/crypto.ts` | 700 | ✅ Complete | $3,000 | 10/10 |
| **Hash Functions** | `sdk-solana/src/utils/` | 400 | ✅ Complete | $2,000 | 9/10 |
| **Encoding Utils** | `sdk-solana/src/utils/` | 200 | ✅ Complete | $1,000 | 8/10 |
| **Random Utils** | `sdk-solana/src/utils/` | 150 | ✅ Complete | $1,000 | 7/10 |
| **Error Handling** | `sdk-solana/src/utils/errors.ts` | 100 | ✅ Complete | $500 | 9/10 |
| **Type Definitions** | `sdk-solana/src/types.ts` | 450 | ✅ Complete | $2,000 | 10/10 |
| **Buffer Utils** | `sdk-solana/src/utils/` | 200 | ✅ Complete | $1,000 | 8/10 |
| **EC Operations** | `sdk-solana/src/utils/crypto.ts` | 400 | ✅ Complete | $2,000 | 8/10 |
| **TOTAL UTILS** | | **2,600** | | **$12,500** | |

---

## PART 2: PROS AND CONS MATRIX

### 2.1 Integration Approach Comparison

| Approach | Pros | Cons | Timeline | Cost | Risk |
|----------|------|------|----------|------|------|
| **A: Single Unified SDK** | | | | | |
| (Combine all into @thegit/privacy) | • One install for all features<br>• Consistent API<br>• Easy maintenance<br>• Better DX<br>• Cross-module optimization | • Larger bundle size<br>• More complex build<br>• Harder to test<br>• Feature bloat | 3-4 weeks | $15,000 | Medium |
| **B: Modular Monorepo** | | | | | |
| (Multiple packages, shared core) | • Tree-shaking support<br>• Independent updates<br>• Clear boundaries<br>• Flexible组合 | • More complex publishing<br>• Version management<br>• Harder onboarding | 4-5 weeks | $20,000 | Low |
| **C: Federated Approach** | | | | | |
| (Keep separate, integrate via adapters) | • Minimal changes needed<br>• Preserve existing APIs<br>• Fastest to market<br>• Teams can work independently | • Inconsistent APIs<br>• Adapter overhead<br>• Harder to maintain<br>• Larger total footprint | 1-2 weeks | $5,000 | Lowest |
| **D: Cherry-Pick Core** | | | | | |
| (Create new wallet-specific SDK) | • Purpose-built<br>• Optimal bundle<br>• Clear scope<br>• Focused testing | • Duplication of effort<br>• May miss features<br>• Slower to add new features | 2-3 weeks | $10,000 | Medium |

### 2.2 Component-Level Pros/Cons

| Component | Pros | Cons | Recommended Action |
|-----------|------|------|-------------------|
| **Merkle Tree** | Battle-tested, TypeScript, High reuse | No sparse tree optimization | Keep as-is |
| **Pedersen Commitment** | Complete implementation, Verified | No batch operations | Enhance for batch |
| **Kyber-768 (TS)** | Full implementation, Tests exist | No WASM optimization | Add WASM later |
| **Kyber-768 (Rust)** | Production-ready, Fast | Language barrier for JS devs | Create TS bindings |
| **Stealth Module** | Complete feature set, Scannable | Complex key derivation docs | Improve docs |
| **E2E Encryption** | Forward secrecy, Session mgmt | No group encryption | Add group support |
| **Solana Integration** | Clean API, Typed | Limited program support | Expand programs |

---

## PART 3: MONETARY VALUATION MATRIX

### 3.1 Current Asset Value by Category

| Category | LOC | Market Value | Investment Multiple | Total Value |
|----------|-----|--------------|---------------------|-------------|
| ZK Components | 5,200 | $4.25/LOC | 3x | $66,300 |
| PQC Components | 3,500 | $6.29/LOC | 3x | $66,300 |
| Stealth Components | 2,850 | $6.14/LOC | 3x | $52,575 |
| Encryption Components | 2,000 | $6.00/LOC | 3x | $36,000 |
| Solana Integration | 2,000 | $6.50/LOC | 3x | $39,000 |
| Utility Components | 2,600 | $4.81/LOC | 3x | $37,530 |
| **TOTAL** | **18,150** | **$5.50/avg LOC** | **3x** | **$297,705** |

### 3.2 Prize Potential by Integration Path

| Path | Effort | Cost | Prize Potential | ROI |
|------|--------|------|-----------------|-----|
| **Submit SDK-Solana as-is** | 0 days | $0 | $15,000 | ∞ |
| **Add Solana TX integration** | 3 days | $1,500 | $15,000 | 10x |
| **Create unified privacy SDK** | 21 days | $15,000 | $50,000+ | 3.3x |
| **Build cherry-pick wallet** | 14 days | $10,000 | $40,000 | 4x |
| **Add Kyber WASM** | 5 days | $3,000 | $20,000 | 6.7x |
| **Add group encryption** | 7 days | $4,000 | $15,000 | 3.75x |
| **Complete ShadowPay** | 30 days | $20,000 | $60,000 | 3x |

### 3.3 Revenue Potential Matrix

| Component | License | Est. Users (Year 1) | Price/User | Revenue |
|-----------|---------|---------------------|------------|---------|
| @thegit/solana | MIT | 500 | $0 | $0 |
| @thegit/privacy (Pro) | MIT + Commercial | 100 | $2,400 | $240,000 |
| @thegit/wallet | MIT | 1,000 | $0 | $0 |
| Enterprise Support | Commercial | 10 | $24,000 | $240,000 |
| Custom Integration | Service | 5 | $50,000 | $250,000 |
| Training | Service | 20 | $5,000 | $100,000 |
| **TOTAL ANNUAL** | | | | **$830,000** |

---

## PART 4: CODE REUSE OPPORTUNITIES

### 4.1 Cross-Project Dependency Matrix

```
                    ┌─────────────┬─────────────┬─────────────┬─────────────┐
                    │  sdk-solana │  choom.chat │ billpayx.com│  shadowpay  │
┌───────────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│ Merkle Tree       │      ●      │      ○      │      ○      │      ●      │
├───────────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│ Pedersen Commit   │      ●      │      ○      │      ○      │      ●      │
├───────────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│ Kyber-768         │      ○      │      ●      │      ○      │      ○      │
├───────────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│ X25519            │      ○      │      ●      │      ○      │      ○      │
├───────────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│ Hybrid Encrypt    │      ○      │      ●      │      ○      │      ○      │
├───────────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│ Stealth Address   │      ●      │      ○      │      ●      │      ●      │
├───────────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│ Payment Scanner   │      ○      │      ○      │      ●      │      ●      │
├───────────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│ E2E Encryption    │      ○      │      ●      │      ○      │      ○      │
├───────────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│ Solana TX         │      ●      │      ○      │      ●      │      ●      │
├───────────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│ Type Definitions  │      ●      │      ○      │      ○      │      ○      │
└───────────────────┴─────────────┴─────────────┴─────────────┴─────────────┘

● = Direct Reuse    ○ = Needs Adapter
```

### 4.2 Integration Effort by Component

| Component | From → To | Effort | Type | Files to Change |
|-----------|-----------|--------|------|-----------------|
| Merkle Tree | sdk-solana → shadowpay | 2 hours | Import | 2 files |
| Pedersen | sdk-solana → shadowpay | 2 hours | Import | 2 files |
| Kyber-768 | choom.chat → sdk-solana | 4 hours | Adapter | 4 files |
| Stealth | billpayx → sdk-solana | 3 hours | Import | 3 files |
| Scanner | billpayx → shadowpay | 4 hours | Adapter | 4 files |
| E2E | choom.chat → matrix-privacy | 6 hours | Adapter | 5 files |
| Solana TX | sdk-solana → shadowpay | 4 hours | Adapter | 4 files |

### 4.3 Quick Wins (Under 4 Hours)

| Component | From Project | To Project | Savings | Value |
|-----------|--------------|------------|---------|-------|
| Import MerkleTree | sdk-solana | shadowpay | 2 days | $2,000 |
| Import Pedersen | sdk-solana | shadowpay | 2 days | $2,000 |
| Import Stealth types | sdk-solana | billpayx | 1 day | $1,000 |
| Import Crypto utils | sdk-solana | all TS projects | 3 days | $3,000 |
| Import Type defs | sdk-solana | choom.chat | 4 hours | $500 |

**Total Quick Win Value:** $8,500  
**Total Time to Implement:** 2 days

---

## PART 5: RECOMMENDED INTEGRATION ROADMAP

### Phase 1: Foundation (Days 1-3) - $5,000

| Task | Effort | Dependencies | Deliverable |
|------|--------|--------------|-------------|
| Create @thegit/privacy core package | 4h | None | Core package structure |
| Move Merkle Tree from sdk-solana | 2h | Core package | Reusable MerkleTree |
| Move Pedersen Commitment | 2h | Core package | Reusable Commitment |
| Move Type Definitions | 4h | None | Unified types package |
| Create compatibility layer | 4h | Core, Types | Adapter utilities |

### Phase 2: PQC Integration (Days 4-7) - $8,000

| Task | Effort | Dependencies | Deliverable |
|------|--------|--------------|-------------|
| Create Kyber TypeScript wrapper | 8h | None | TS Kyber wrapper |
| Add WASM compilation | 8h | Kyber wrapper | Performance boost |
| Integrate X25519 from choom.chat | 4h | Core package | Key exchange |
| Build Hybrid Encryption | 4h | Kyber, X25519 | PQ encryption |
| Add to core package | 4h | All above | PQC module |

### Phase 3: Stealth Integration (Days 8-12) - $10,000

| Task | Effort | Dependencies | Deliverable |
|------|--------|--------------|-------------|
| Consolidate stealth modules | 8h | None | Unified stealth API |
| Add View/Scan keys | 4h | Stealth module | Complete key system |
| Integrate scanner | 8h | Stealth module | Payment detection |
| Add to core package | 4h | All above | Stealth module |
| Write integration tests | 8h | All above | Test coverage 90%+ |

### Phase 4: Encryption Suite (Days 13-17) - $12,000

| Task | Effort | Dependencies | Deliverable |
|------|--------|--------------|-------------|
| Integrate E2E from choom.chat | 8h | Core package | E2E module |
| Add group encryption | 16h | E2E module | Multi-party support |
| Add file encryption | 8h | E2E module | File module |
| Add streaming support | 8h | File module | Streaming API |
| Add forward secrecy | 4h | E2E module | PFS support |

### Phase 5: Solana Integration (Days 18-21) - $8,000

| Task | Effort | Dependencies | Deliverable |
|------|--------|--------------|-------------|
| Connect to @solana/web3.js | 8h | None | Solana adapter |
| Build transaction builders | 8h | Core, Solana | Transfer module |
| Add program integration | 16h | Solana adapter | Program module |
| Write Solana tests | 8h | All above | Test coverage 90%+ |

---

## PART 6: FINAL RECOMMENDATION

### 6.1 Recommended Approach: **Federated Integration**

Given the deadline constraints and existing code quality:

| Option | Cost | Timeline | Risk | Recommendation |
|--------|------|----------|------|----------------|
| **Federated** | $5,000 | 3 days | Low | ✅ RECOMMENDED |
| Unified SDK | $15,000 | 21 days | Medium | Future |
| Cherry-pick | $10,000 | 14 days | Medium | If time permits |
| Status quo | $0 | 0 days | N/A | Submit SDK-Solana |

### 6.2 Immediate Actions

1. **Submit SDK-Solana to Helius + Quicknode** ($15,000 potential)
   - Already 95% complete
   - Clear documentation
   - Working code

2. **Create integration adapter layer** ($5,000)
   - Minimal changes to existing code
   - Enables all components to work together
   - Preserves existing APIs

3. **Document all components** (Free)
   - Create unified API docs
   - Map dependencies
   - Write integration guide

### 6.3 Long-Term Strategy

| Year | Focus | Revenue Target |
|------|-------|----------------|
| Year 1 | Build user base | $100,000 ARR |
| Year 2 | Enterprise features | $500,000 ARR |
| Year 3 | Platform ecosystem | $2,000,000 ARR |

---

## PART 7: COMPLETE COMPONENT REFERENCE

### 7.1 File Locations Quick Reference

```
@thegit/solana (TIER1_PRIORITY/sdk-solana/)
├── src/
│   ├── index.ts              [200 LOC] - Main SDK class
│   ├── types.ts              [450 LOC] - All type definitions
│   ├── zk/
│   │   ├── index.ts          [500 LOC] - ZK module
│   │   ├── merkle.ts         [600 LOC] - MerkleTree, SparseMerkleTree
│   │   ├── commitment.ts     [500 LOC] - Pedersen commitments
│   │   └── range-proof.ts    [200 LOC] - Range proofs
│   ├── stealth/
│   │   ├── index.ts          [400 LOC] - Stealth module
│   │   └── types.ts          [150 LOC] - Stealth types
│   ├── utils/
│   │   ├── crypto.ts         [700 LOC] - All crypto primitives
│   │   ├── errors.ts         [100 LOC] - Error handling
│   │   └── index.ts          [50 LOC]  - Exports
│   └── transfer/
│       └── index.ts          [200 LOC] - Transfer module

@thegit/privacy (NEW - to be created)
├── packages/
│   ├── core/                 [2000 LOC]
│   ├── pqc/                  [2000 LOC]
│   ├── stealth/              [1500 LOC]
│   ├── encryption/           [1500 LOC]
│   └── solana/               [1500 LOC]
```

### 7.2 Component Readiness Status

| Component | Ready | Needs Testing | Needs Work | Not Started |
|-----------|-------|---------------|------------|-------------|
| Merkle Tree | ✅ | | | |
| Pedersen | ✅ | | | |
| Range Proof | ✅ | | | |
| Kyber-768 TS | ✅ | | | |
| Kyber-768 Rust | ✅ | | | |
| X25519 | ✅ | | | |
| Hybrid Encrypt | ✅ | | | |
| Stealth Address | ✅ | | | |
| Payment Scanner | ✅ | | | |
| E2E Encryption | ✅ | | | |
| Solana TX | | ✅ | | |
| Group Encrypt | | | ✅ | |
| File Encrypt | | ✅ | | |

---

*Document Version: 1.0*  
*Created: 2026-01-30*  
*For: Solana Privacy Hackathon 2026*

**Competition URL:** https://solana.com/privacyhack
