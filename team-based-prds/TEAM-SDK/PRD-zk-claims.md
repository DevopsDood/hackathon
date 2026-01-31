# PRD: ZK Claims

**Product Requirements Document**  
**Version:** 2.0  
**Last Updated:** 2026-01-31  
**Team:** TEAM-SDK  
**Domain:** contractregistry.io  
**Prize Target:** $7,500 (Aztec Prize)

---

## 1. Executive Summary

ZK Claims is a privacy-preserving claim verification system using zero-knowledge proofs (Noir circuits) to enable confidential credential verification on Aztec and other privacy-focused blockchains. Users can prove they meet certain criteria without revealing the underlying data.

## 2. Problem Statement

Traditional claim verification requires revealing sensitive information:
- Age verification reveals birthdate
- Credit checks expose financial history
- Identity verification exposes personal data
- No privacy-preserving alternatives exist

## 3. Target Users

1. **DeFi Protocols** - Verify collateral without exposure
2. **DAO Governance** - Prove membership without revealing identity
3. **KYC Services** - Verify credentials privately
4. **Gaming** - Prove achievements without revealing stats

## 4. Product Requirements

### 4.1 Core Features

| Feature | Priority | Status | Description |
|---------|----------|--------|-------------|
| Claim Circuit | P0 | Complete | Base ZK circuit for claims |
| Ownership Proof | P0 | Partial | Prove claim ownership |
| Range Proof | P0 | Complete | Prove values in range |
| Aggregation | P1 | Pending | Combine multiple claims |
| Revocation | P1 | Pending | Revoke compromised claims |

### 4.2 API Requirements

```typescript
// Claim types
interface Claim {
  id: string;
  issuer: PublicKey;
  subject: PublicKey;
  predicate: ClaimPredicate;
  metadata: ClaimMetadata;
  signature: Signature;
}

interface ClaimPredicate {
  type: 'age' | 'membership' | 'score' | 'custom';
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  value: bigint;
}

interface ZKClaimProof {
  nullifier: Buffer;
  commitment: Buffer;
  proof: Buffer;
  publicInputs: Buffer[];
}

// Main class
class ZKClaims {
  // Generate a claim
  async createClaim(
    subject: PublicKey,
    predicate: ClaimPredicate,
    metadata: ClaimMetadata
  ): Promise<Claim>;
  
  // Generate ZK proof of claim
  async generateProof(
    claim: Claim,
    privateKey: PrivateKey,
    witness: Witness
  ): Promise<ZKClaimProof>;
  
  // Verify ZK proof on-chain
  async verifyProof(
    proof: ZKClaimProof,
    verifierAddress: PublicKey
  ): Promise<boolean>;
  
  // Check if claim satisfies predicate
  async verifyPredicate(
    claim: Claim,
    predicate: ClaimPredicate
  ): Promise<boolean>;
}
```

## 5. Technical Architecture

### 5.1 Directory Structure

```
zk.claims/
├── src/
│   ├── circuits/              # Noir circuits
│   │   ├── claim_verify.nr   # Main claim verification
│   │   ├── ownership_proof.nr # Ownership proof
│   │   └── range_proof.nr    # Range proof for predicates
│   ├── contracts/             # On-chain contracts
│   │   ├── ClaimVerifier.sol
│   │   └── ClaimRegistry.sol
│   ├── web/                   # Frontend
│   │   ├── components/
│   │   │   ├── ClaimForm.tsx
│   │   │   ├── ClaimList.tsx
│   │   │   └── ProofGenerator.tsx
│   │   ├── pages/
│   │   │   ├── index.tsx
│   │   │   ├── create.tsx
│   │   │   └── verify.tsx
│   │   └── utils/
│   │       ├── noir.ts
│   │       └── witness.ts
│   └── index.ts
├── tests/
├── docs/
├── package.json
├── README.md
└── PRD.md
```

### 5.2 Noir Circuit

```noir
// claim_verify.nr - Main claim verification circuit

fn main(
    // Public inputs
    claim_commitment: Field,
    predicate_value: Field,
    issuer_public_key: [u8; 32],
    
    // Private inputs (witness)
    private_value: Field,
    private_blinding: Field,
    issuer_signature: [u8; 64]
) -> pub {
    // Verify issuer signature
    let valid_signature = verify_ed25519(
        claim_commitment,
        issuer_public_key,
        issuer_signature
    );
    assert(valid_signature == 1);
    
    // Compute commitment
    let computed_commitment = pedersen_commitment(
        private_value,
        private_blinding
    );
    assert(computed_commitment == claim_commitment);
    
    // Verify predicate
    let predicate_holds = match predicate_type {
        0 => private_value > predicate_value,
        1 => private_value < predicate_value,
        2 => private_value == predicate_value,
        _ => false
    };
    assert(predicate_holds);
    
    // Return nullifier for double-spend prevention
    pedersen_commitment(claim_commitment, private_blinding)
}
```

### 5.3 Dependencies

```json
{
  "name": "zk-claims",
  "version": "1.0.0",
  "dependencies": {
    "@noir-lang/noir.js": "^0.19.0",
    "@aztec/aztec.js": "^0.10.0",
    "@noble/curves": "^1.0.0",
    "@noble/hashes": "^1.3.0"
  }
}
```

## 6. Security Requirements

### 6.1 Privacy Guarantees
- **Zero-knowledge**: No data revealed in proof
- **Completeness**: Valid proofs always verify
- **Soundness**: Invalid claims cannot produce valid proofs
- **Zero-knowledge**: Multiple proofs of same claim indistinguishable

### 6.2 Safety Measures
- Nullifiers prevent double-claiming
- Time-limited claims with expiration
- Issuer revocation capability

## 7. Testing Requirements

### 7.1 Circuit Tests
- Valid claim proof generation
- Invalid claim rejection
- Predicate verification accuracy
- Nullifier uniqueness

### 7.2 Integration Tests
- Aztec contract deployment
- On-chain verification
- Frontend proof generation

## 8. Completion Criteria

| Criterion | Target | Current |
|-----------|--------|---------|
| Claim circuit compiles | 100% | 100% |
| Ownership proof | 100% | 60% |
| Range proof integration | 100% | 100% |
| Web UI functional | 100% | 50% |
| Submit to Aztec | Day 2 | Pending |

## 9. Dependencies & Relationships

### 9.1 Consumed From
- **TEAM-SDK**: ZK primitives (Merkle, Pedersen)
- **TEAM-RUST**: Kyber-768 for PQC (future)

### 9.2 Forking Strategy
This is a **primary implementation** - no forking from SDK directly.
Noir circuits are original work.

## 10. Timeline

| Milestone | Date | Status |
|-----------|------|--------|
| Noir circuit design | Day 1 | Complete |
| Claim verification | Day 2 | Complete |
| Ownership proof | Day 3 | In Progress |
| Web UI | Day 4 | In Progress |
| Submit to Aztec | Day 5 | Pending |

---

*Document Version: 2.0*  
*Last Updated: 2026-01-31*

