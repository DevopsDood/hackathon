# zk.claims - ZK Proof Claims System

**Prize Category:** Aztec - Best Overall ($5K) + Non-Financial ($2.5K)  
**Total Potential:** $7.5K  
**Status:** ✅ SUBMISSION READY

## Overview

A zero-knowledge claims verification system built on Aztec. Users can prove claims (age, credentials, ownership) without revealing underlying data.

## Features

- **ZK Claims**: Prove age, income, credentials privately
- **No Data Exposure**: Verifiers see only proof, not data
- **Reusable Proofs**: Generate once, use multiple times
- **Aztec Integration**: Privacy by default

## Quick Start

```bash
npm install
npm run dev
```

## Usage

```typescript
const claim = await zkClaims.create({
  type: 'age',
  value: 25,
  threshold: 18
});
const proof = await claim.generateProof();
const valid = await zkClaims.verify(proof);
```

## License
MIT
