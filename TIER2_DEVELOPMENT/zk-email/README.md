# ZK Email

Zero-Knowledge Email Verification using ZK proofs for privacy-preserving authentication.

## Features

- **Privacy-Preserving**: Prove email ownership without revealing address
- **Domain Verification**: Verify email domain without exposing full email
- **ZK Proofs**: Cryptographic proof generation and verification

## Prize Competition Fit

### Identity Category ($7,500)
- **Anonymous Verification**: Prove email ownership privately

### Privacy Tooling ($500)
- **Selective Disclosure**: Reveal only what's necessary

## Usage

```typescript
import { ZkEmailProver } from 'zk-email';

const prover = new ZkEmailProver({
  allowedDomains: ['company.com'],
  proofExpiry: 3600,
});

const proof = await prover.generateProof('user@company.com', 'secret');
const result = await prover.verifyProof(proof);
```

## Competition Submission

**Challenge**: Identity + Privacy Tooling  
**Domain**: themail.host/zk-email  
**Prize Target**: $8,000