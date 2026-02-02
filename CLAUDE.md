# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Solana Privacy Hackathon** codebase containing 20+ privacy-focused applications and libraries. Projects are organized by tier:

- **TIER1_PRIORITY**: Completed submission-ready projects (8 projects)
- **TIER2_DEVELOPMENT**: In-progress development (6 projects)
- **TIER3_CONCEPTS**: Early-stage concepts (6 projects)

## Common Commands

### TypeScript/Node.js Projects
```bash
npm install          # Install dependencies
npm run build        # Compile TypeScript (tsc)
npm run test         # Run Jest tests
npm run test:zk      # Run ZK primitive tests only
npm run test:stealth # Run stealth module tests
npm run lint         # Run ESLint
npm run typecheck    # Type-check without emitting (tsc --noEmit)
```

### Rust Projects (vpn-daemon, helix-core)
```bash
cargo build --release
cargo test
cargo test --features integration
cargo bench         # Benchmark Kyber operations
```

### Next.js Web Apps
```bash
npm run dev          # Development server
npm run build:web    # Production build (next build)
```

## Architecture

### Core SDK Layer (sdk-solana)
The main privacy SDK at `TIER1_PRIORITY/sdk-solana/` providing:
- **ZK Primitives**: Merkle trees (`src/zk/merkle.ts`), Pedersen commitments, range proofs
- **Stealth Module**: Address generation, payment scanning, key management
- **Transfer Module**: Private transactions with amount/recipient hiding

### Cross-Project Dependencies
```
TEAM-SDK (ZK + Stealth)
    ├──► TEAM-PAY (billpayx.com, shadowpay) - consumes stealth addresses
    ├──► TEAM-PQ-MSG (choom.chat) - uses ZK verification
    └──► TEAM-CONSUMER - uses encryption utilities

TEAM-RUST (Kyber-768)
    ├──► TEAM-SDK - TypeScript fork source
    ├──► TEAM-PQ-MSG - post-quantum crypto for messaging
    └──► TEAM-PAY - optional PQC
```

### Key Cryptographic Libraries
- **@noble/curves**: X25519, secp256k1
- **@noble/hashes**: SHA-256, SHA-512
- **@solana/web3.js**: Solana blockchain SDK
- **@coral-xyz/anchor**: Solana programs (Anchor framework)

## Project Structure

```
TIER1_PRIORITY/
├── sdk-solana/          # Core privacy SDK (TypeScript)
├── choom.chat/          # Post-quantum messaging (Next.js + CLI)
├── billpayx.com/        # Stealth payment gateway
├── zk.claims/           # Zero-knowledge claims
└── ... (4 more projects)

TIER2_DEVELOPMENT/
├── vpn-daemon/          # Post-quantum VPN (Rust)
├── helix-core/          # Kyber-768 Rust implementation
├── password-vault/      # Encrypted password manager
└── ... (3 more projects)

TIER3_CONCEPTS/
└── shadowpay/           # ZK payment system with game mechanics
```

## Testing Patterns

- Jest with `ts-jest` for TypeScript projects
- Supertest for API endpoint testing
- Unit tests for all cryptographic operations
- Integration tests for payment flows

## Code Conventions

- TypeScript with strict mode
- ESM modules (`"type": "commonjs"` in package.json)
- BigInt for cryptographic values
- Buffer/Uint8Array for binary data
- Async/await for all crypto operations
