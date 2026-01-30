# ShadowPay - Private Stealth Payment System

🔒 **Privacy-first payment system with zero-knowledge proofs and stealth addresses**

ShadowPay enables private, unlinkable payments using advanced cryptographic techniques. Recipients can remain anonymous while receiving funds through one-time stealth addresses.

## Features

- 🔐 **Stealth Addresses** - One-time addresses prevent transaction linking
- 📜 **ZK Balance Proofs** - Prove balance without revealing amounts
- 🎮 **StealthGame Integration** - Private in-game payments
- 🌐 **Multi-chain** - Solana & Aztec network support
- 💰 **Hackathon Prize-eligible** - $43K across multiple categories

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

## Quick Start

### Installation

```bash
# Install SDK
npm install @shadowpay/sdk

# Install CLI
npm install -g @shadowpay/cli

# Install Web Dashboard
cd web && npm install
```

### Basic Usage

```typescript
import { ShadowPay } from '@shadowpay/sdk';

// Initialize
const shadowpay = new ShadowPay({ network: 'devnet' });
await shadowpay.initialize();

// Generate receive keys
const keys = await shadowpay.generateReceiveKeys();
// keys.viewKey - share this to receive payments
// keys.spendKey - keep secret, used to spend funds
// keys.scanKey - used to scan for incoming payments

// Create stealth address for payment
const stealthAddress = await shadowpay.createStealthAddress(recipientViewKey);

// Make payment
const payment = await shadowpay.createPayment({
  amount: BigInt(1000000), // 1 SOL
  recipientViewKey: recipientViewKey,
  memo: 'Payment description'
});

// Scan for incoming payments
const payments = await shadowpay.scanForPayments(scanKey);
```

### CLI Usage

```bash
# Start interactive CLI
shadowpay

# Commands:
# 1. Generate receive keys
# 2. Create stealth address
# 3. Make payment
# 4. Scan for payments
# 5. Check balance
# 6. Prove balance
# 7. Export/import keys
# 9. Game integration
```

## Cryptographic Primitives

### Stealth Address Protocol

```
Sender:                          Recipient:
1. Generate ephemeral key pair   1. Publish view key (Pv)
2. Compute shared secret         2. Derive stealth keys
3. Create one-time address       3. Scan transactions
4. Publish payment note          4. Spend funds
```

**Components:**
- **View Key (Pv)** - Public key for generating stealth addresses
- **Spend Key (Ps)** - Private key for spending from stealth addresses  
- **Scan Key** - Used to detect incoming payments
- **View Tag** - Short tag to identify payments without revealing recipient

### ZK Proofs

1. **Balance Proof** - Prove sufficient balance without revealing amount
2. **Range Proof** - Prove value is positive (no negative balances)
3. **Payment Proof** - Prove payment validity with zkSNARKs

### Pedersen Commitments

```
Commitment = G * value + H * randomness

- G, H: Fixed generator points
- value: Hidden amount
- randomness: Blinding factor
```

## Project Structure

```
shadowpay/
├── src/                          # SDK source
│   ├── index.ts                  # Main exports
│   ├── shadowpay.ts              # Main SDK class
│   ├── stealth/
│   │   └── stealth-address.ts    # Stealth address system
│   ├── zk/
│   │   └── balance-proof.ts      # ZK proof circuits
│   └── games/
│       └── stealthgame.ts        # Game integration
├── programs/                     # Solana contracts
│   └── shadowpay/
│       └── src/lib.rs            # Anchor program
├── contracts/                    # Aztec contracts
│   └── shadowpay.nr              # Noir contract
├── web/                          # Web dashboard
│   ├── src/app/page.tsx          # React dashboard
│   └── package.json
├── cli/                          # CLI tool
│   ├── src/index.ts              # CLI implementation
│   └── bin/shadowpay.js          # Entry point
└── package.json                  # Root package.json
```

## Hackathon Categories

| Prize | Category | Amount |
|-------|----------|--------|
| 🥇 Aztec | Private Payments | $15,000 |
| 🥈 Radr Labs | Privacy Infrastructure | $15,000 |
| 🥉 Light Protocol | ZK Proofs | $13,000 |

**Total Potential: $43,000**

## API Reference

### ShadowPay Class

```typescript
class ShadowPay {
  constructor(config: { network: 'mainnet' | 'devnet' })
  async initialize(): void
  
  // Key Management
  async generateReceiveKeys(): { viewKey: Uint8Array; spendKey: Uint8Array; scanKey: Uint8Array }
  async importKeys(keys: { viewKey: Uint8Array; spendKey: Uint8Array; scanKey: Uint8Array }): void
  
  // Payments
  createPayment(intent: PaymentIntent): Promise<PaymentResult>
  async scanForPayments(scanKey: Uint8Array, recentTransactions?: StealthTransaction[]): Promise<ScanResult[]>
  
  // Balance
  async getBalance(notes: PaymentNote[]): Promise<BalanceResult>
  async proveBalance(notes: PaymentNote[], minRequired?: bigint): Promise<BalanceProof>
}
```

### PaymentIntent

```typescript
interface PaymentIntent {
  amount: bigint              // Payment amount
  recipientViewKey: Uint8Array // Recipient's view key
  fee?: bigint                // Optional fee
  memo?: string               // Optional memo
  timestamp?: bigint          // Optional timestamp
}
```

### ScanResult

```typescript
interface ScanResult {
  note: PaymentNote
  commitment: Uint8Array
  nullifier: Uint8Array
  blockHeight: number
  timestamp: bigint
}
```

## Testing

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# ZK proof tests
npm run test:zk
```

## Security Considerations

1. **Key Storage** - Spend keys must be stored securely (hardware wallet, encrypted storage)
2. **View Tag Collision** - Extremely unlikely but theoretically possible
3. **Merkle Tree Depth** - Current depth of 32 supports up to 4B notes
4. **Nullifier Uniqueness** - Critical for preventing double-spends

## License

MIT License - See LICENSE file for details

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/privacy-enhancement`)
3. Commit changes (`git commit -am 'Add privacy enhancement'`)
4. Push to branch (`git push origin feature/privacy-enhancement`)
5. Create Pull Request

## References

- [BIP-324: Stealth Addresses](https://github.com/bitcoin/bips/blob/master/bip-0324.mediawiki)
- [Zcash Sapling Protocol](https://z.cash/technology/sapling/)
- [Aztec Network Documentation](https://docs.aztec.network/)
- [Solana Anchor Framework](https://book.anchor-lang.com/)
