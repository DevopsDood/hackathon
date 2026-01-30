# ShadowPay Feature Documentation

**Date:** 2026-01-30  
**Status:** CONCEPT (Needs Development)  
**Prize Potential:** $43,000

## Overview

ShadowPay is a privacy-first payment system implementing stealth addresses and zero-knowledge proofs for unlinkable, private transactions. The system enables recipients to receive funds through one-time addresses while maintaining complete privacy.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     ShadowPay SDK                       │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │ Stealth     │  │ ZK Balance  │  │ StealthGame     │  │
│  │ Address     │  │ Proofs      │  │ Integration     │  │
│  │ System      │  │             │  │                 │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
│  ┌─────────────┐  ┌─────────────┐                       │
│  │ Solana      │  │ Aztec       │                       │
│  │ Contract    │  │ Contract    │                       │
│  └─────────────┘  └─────────────┘                       │
└─────────────────────────────────────────────────────────┘
```

## Implemented Features

### 1. Stealth Address System

**File:** [`src/stealth/stealth-address.ts`](TIER3_CONCEPTS/shadowpay/src/stealth/stealth-address.ts)

The stealth address system uses ECDH (Elliptic Curve Diffie-Hellman) for shared secret derivation and one-time addresses.

**Key Components:**

| Component | Description |
|-----------|-------------|
| `ShadowPayStealth` | Main class for stealth address operations |
| `generateStealthAddress()` | Creates complete stealth address setup |
| `scanForPayments()` | Detects incoming payments using view key |
| `createNoteCommitment()` | Pedersen commitment with Poseidon hash |
| `deriveSharedSecret()` | ECDH-based shared secret computation |
| `generateViewTag()` | Short tag for efficient scanning |

**Protocol Flow:**
1. Recipient publishes view key (Pv)
2. Sender generates ephemeral key pair
3. Shared secret derived via ECDH
4. One-time stealth address created
5. Payment note published with encrypted amount
6. Recipient scans and detects payment using scan key
7. Recipient derives spend key to spend funds

**Key Derivation:**
```typescript
// View key for detecting payments
deriveViewKey(sharedSecret, ephemeralPrivateKey)

// Spend key for spending (keep secret)
deriveSpendKey(sharedSecret, ephemeralPrivateKey)

// Nullifier for preventing double-spends
deriveNullifierKey(spendKey, commitment)
```

### 2. ZK Proof System

**File:** [`src/zk/balance-proof.ts`](TIER3_CONCEPTS/shadowpay/src/zk/balance-proof.ts)

The ZK proof system provides privacy-preserving verification without revealing transaction details.

**Proof Types:**

| Proof Type | Purpose | Status |
|------------|---------|--------|
| `BalanceProof` | Prove sufficient balance | Implemented |
| `RangeProof` | Prove amount within range | Simplified |
| `PaymentProof` | Prove valid transaction | Implemented |
| `MerkleProof` | Prove note inclusion | Implemented |

**Pedersen Commitment:**
```
Commitment = G * value + H * randomness
```

**Key Methods:**
- [`createCommitment()`](TIER3_CONCEPTS/shadowpay/src/zk/balance-proof.ts:77) - Generate Pedersen commitment
- [`generateBalanceProof()`](TIER3_CONCEPTS/shadowpay/src/zk/balance-proof.ts:86) - Prove balance without revealing amount
- [`generatePaymentProof()`](TIER3_CONCEPTS/shadowpay/src/zk/balance-proof.ts:221) - Prove valid payment with change
- [`generateRangeProof()`](TIER3_CONCEPTS/shadowpay/src/zk/balance-proof.ts:136) - Prove value in [min, max]
- [`verifyBalanceProof()`](TIER3_CONCEPTS/shadowpay/src/zk/balance-proof.ts:184) - Verify balance proof

**Range Proof Implementation:**
Uses binary decomposition for range verification:
- Decomposes value into binary bits
- Creates bit commitments for each set bit
- Proves all bits are 0 or 1 (no negative values)

### 3. Main SDK

**File:** [`src/shadowpay.ts`](TIER3_CONCEPTS/shadowpay/src/shadowpay.ts)

The main SDK orchestrates all ShadowPay functionality.

**Core Classes:**

| Class | Purpose |
|-------|---------|
| `ShadowPay` | Main SDK orchestrator |
| `ShadowPayStealth` | Stealth address operations |
| `ShadowPayZK` | ZK proof generation/verification |

**Key Methods:**

| Method | Description |
|--------|-------------|
| `generateReceiveKeys()` | Create view/spend key pair |
| `createPayment()` | Create anonymous payment |
| `scanForPayments()` | Scan blockchain for payments |
| `getBalance()` | Get balance with ZK proof |
| `proveBalance()` | Prove sufficient balance |
| `createPaymentWithChange()` | Create payment with change outputs |
| `withdraw()` | Withdraw to external address |
| `createStealthAddress()` | Generate stealth address |

### 4. StealthGame Integration

**File:** [`src/games/stealthgame.ts`](TIER3_CONCEPTS/shadowpay/src/games/stealthgame.ts)

Private in-game payments and currency transfers using ShadowPay.

**Features:**

| Feature | Description |
|---------|-------------|
| `purchaseItem()` | Private in-game item purchase |
| `transferCurrency()` | Private player-to-player transfer |
| `joinTable()` | Join game table with stake |
| `withdrawWinnings()` | Withdraw game winnings privately |
| `depositToGame()` | Deposit funds to game |

**Game State Management:**
- Mock in-memory state for development
- Player notes and balances
- Table reservations and stakes
- Purchase and transfer records

### 5. Solana Program

**File:** [`programs/shadowpay/src/lib.rs`](TIER3_CONCEPTS/shadowpay/programs/shadowpay/src/lib.rs)

On-chain Solana program using Anchor framework.

**Instructions:**

| Instruction | Purpose |
|-------------|---------|
| `initialize()` | Initialize program state |
| `create_note()` | Create note commitment |
| `spend_note()` | Spend note with ZK proof |
| `verify_balance_proof()` | Verify balance proof |
| `withdraw()` | Withdraw funds |

**Account Structures:**

| Account | Purpose |
|---------|---------|
| `State` | Program configuration and counters |
| `MerkleTree` | Note commitment Merkle tree |
| `NullifierList` | Spent nullifier tracking |
| `Note` | Individual note data |
| `FeeVault` | Fee collection |
| `Vault` | User fund storage |

**Limitations:**
- Fixed Merkle tree size (1024 leaves)
- Simplified Merkle proof verification
- Mock ZK proof verification

### 6. Aztec Contract

**File:** [`contracts/shadowpay.nr`](TIER3_CONCEPTS/shadowpay/contracts/shadowpay.nr)

Aztec Noir contract for private payments on Aztec.

**Functions:**

| Function | Type | Purpose |
|----------|------|---------|
| `constructor()` | Init | Initialize contract |
| `create_note()` | Stateful | Create note commitment |
| `spend_note()` | Stateful | Spend note with proof |
| `verify_balance_proof()` | View | Verify balance proof |
| `get_merkle_root()` | View | Get current Merkle root |
| `withdraw_fees()` | Stateful | Withdraw collected fees |

**Limitations:**
- Simplified Merkle operations
- Mock Poseidon hash implementation
- No actual Noir circuit compilation

## Cross-Chain Support

### Solana Integration
- Anchor program with full account structure
- Merkle tree for note commitments
- Nullifier tracking to prevent double-spends
- Fee collection mechanism

### Aztec Integration
- Noir contract structure
- Private note management
- ZK proof verification placeholder
- Fee handling

## Security Considerations

### Cryptographic Security
1. **Key Storage** - Spend keys must use secure storage (hardware wallet, encrypted)
2. **View Tag Collision** - Extremely unlikely (1/256 probability per view tag)
3. **Merkle Tree Depth** - Current depth supports up to 4B notes
4. **Nullifier Uniqueness** - Critical for preventing double-spends

### Implementation Concerns
1. **Randomness** - Uses `crypto.getRandomValues()` and `@noble/secp256k1`
2. **Commitment Schemes** - Pedersen commitments with Poseidon hashing
3. **Encryption** - XOR-based amount encryption with shared secret

## Dependencies

```json
{
  "@noble/secp256k1": "^2.0.0",
  "@noble/hashes": "^1.4.0",
  "anchor-lang": "^0.30.0"
}
```

## Hackathon Prize Categories

| Prize | Category | Amount |
|-------|----------|--------|
| 🥇 Aztec | Private Payments | $15,000 |
| 🥈 Radr Labs | Privacy Infrastructure | $15,000 |
| 🥉 Light Protocol | ZK Proofs | $13,000 |

**Total Potential: $43,000**

## File Structure

```
TIER3_CONCEPTS/shadowpay/
├── src/
│   ├── index.ts                  # Main exports
│   ├── shadowpay.ts              # Main SDK class
│   ├── stealth/
│   │   └── stealth-address.ts    # Stealth address system
│   ├── zk/
│   │   └── balance-proof.ts      # ZK proof circuits
│   └── games/
│       └── stealthgame.ts        # Game integration
├── programs/
│   └── shadowpay/
│       └── src/lib.rs            # Solana Anchor program
├── contracts/
│   └── shadowpay.nr              # Aztec Noir contract
├── web/
│   ├── src/app/page.tsx          # React dashboard
│   └── package.json
├── cli/
│   ├── src/index.ts              # CLI implementation
│   └── bin/shadowpay.js          # Entry point
├── package.json                  # Monorepo config
└── README.md                     # Project README
```

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-30 | Initial concept implementation |
