# SDK-Solana API Documentation

Complete API reference for `@thegit/solana` - a privacy-focused SDK for Solana blockchain development.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [SolanaPrivacySDK](#solanaprivacysdk)
- [ZK Module](#zk-module)
- [Stealth Module](#stealth-module)
- [Transfer Module](#transfer-module)
- [Utilities](#utilities)
- [Error Handling](#error-handling)
- [Types](#types)

---

## Installation

```bash
npm install @thegit/solana
```

---

## Quick Start

```typescript
import { SolanaPrivacySDK } from '@thegit/solana';

// Initialize SDK
const sdk = new SolanaPrivacySDK({
  network: 'devnet',
  rpcUrl: 'https://api.devnet.solana.com',
  commitment: 'confirmed',
});

// Access modules
console.log(sdk.getNetwork()); // 'devnet'
```

---

## SolanaPrivacySDK

The main SDK class that provides access to all privacy modules.

### Constructor

```typescript
new SolanaPrivacySDK(config?: SDKConfig)
```

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `config` | `SDKConfig` | No | See below | SDK configuration |

**SDKConfig Interface:**

```typescript
interface SDKConfig {
  network: 'mainnet-beta' | 'testnet' | 'devnet' | 'localnet';
  rpcUrl: string;
  commitment?: 'processed' | 'confirmed' | 'finalized';
  timeout?: number;
}
```

**Default Config:**
- `network`: 'devnet'
- `rpcUrl`: 'https://api.devnet.solana.com'
- `commitment`: 'confirmed'
- `timeout`: 30000 (ms)

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `zk` | `ZKModule` | Zero-knowledge primitives module |
| `stealth` | `StealthModule` | Stealth address operations module |
| `transfer` | `TransferModule` | Private transfer module |

### Methods

#### `getNetwork()`

Returns the configured network.

```typescript
getNetwork(): Network
```

**Returns:** `Network` - 'mainnet-beta' | 'testnet' | 'devnet' | 'localnet'

---

#### `getRpcUrl()`

Returns the configured RPC URL.

```typescript
getRpcUrl(): string
```

**Returns:** `string` - RPC endpoint URL

---

#### `getCommitment()`

Returns the configured commitment level.

```typescript
getCommitment(): string | undefined
```

**Returns:** `'processed' | 'confirmed' | 'finalized' | undefined`

---

#### `getTimeout()`

Returns the configured timeout.

```typescript
getTimeout(): number | undefined
```

**Returns:** `number | undefined` - Timeout in milliseconds

---

### Factory Functions

#### `createMainnetSDK()`

Create SDK configured for mainnet-beta.

```typescript
createMainnetSDK(rpcUrl?: string): SolanaPrivacySDK
```

**Example:**
```typescript
const sdk = createMainnetSDK('https://my-rpc.com');
```

---

#### `createDevnetSDK()`

Create SDK configured for devnet.

```typescript
createDevnetSDK(rpcUrl?: string): SolanaPrivacySDK
```

---

#### `createTestnetSDK()`

Create SDK configured for testnet.

```typescript
createTestnetSDK(rpcUrl?: string): SolanaPrivacySDK
```

---

## ZK Module

Provides zero-knowledge primitives for privacy-preserving operations.

### Class: `ZKModule`

```typescript
const zk = new ZKModule();
```

### Methods

#### `createMerkleTree()`

Create a Merkle tree from leaves.

```typescript
createMerkleTree(leaves: Uint8Array[], config?: MerkleTreeConfig): MerkleTree
```

**Example:**
```typescript
const leaves = [
  new Uint8Array(32).fill(1),
  new Uint8Array(32).fill(2),
];
const tree = zk.createMerkleTree(leaves);
console.log(tree.root); // 32-byte root hash
```

---

#### `verifyMerkleProof()`

Verify a Merkle proof.

```typescript
verifyMerkleProof(leaf: Uint8Array, proof: MerkleProof, root: Uint8Array): boolean
```

**Example:**
```typescript
const proof = tree.generateProof(leaf);
const valid = zk.verifyMerkleProof(leaf, proof, tree.root);
```

---

#### `pedersenCommit()`

Create a Pedersen commitment to hide a value.

```typescript
pedersenCommit(value: bigint, blinding: Uint8Array): ZKCommitment
```

**Returns:**
```typescript
interface ZKCommitment {
  commitment: Uint8Array;  // 32 bytes
  value: bigint;           // Original value (private)
  blinding: Uint8Array;    // Blinding factor (private)
}
```

**Example:**
```typescript
const blinding = new Uint8Array(32);
crypto.getRandomValues(blinding);

const commitment = zk.pedersenCommit(1000n, blinding);
console.log(commitment.commitment); // Public commitment
```

---

#### `verifyCommitment()`

Verify that a commitment opens to the correct value.

```typescript
verifyCommitment(commitment: ZKCommitment, value: bigint, blinding: Uint8Array): boolean
```

---

#### `proveRange()`

Generate a range proof to prove a value is within a range.

```typescript
proveRange(value: bigint, min: bigint, max: bigint): RangeProof
```

**Returns:**
```typescript
interface RangeProof {
  proof: Uint8Array;
  min: bigint;
  max: bigint;
  value: bigint;
}
```

**Example:**
```typescript
// Prove value is between 0 and 10000 without revealing it
const proof = zk.proveRange(5000n, 0n, 10000n);
```

---

#### `verifyRangeProof()`

Verify a range proof.

```typescript
verifyRangeProof(proof: RangeProof, min: bigint, max: bigint): boolean
```

**Example:**
```typescript
const valid = zk.verifyRangeProof(proof, 0n, 10000n);
// Returns true if value is in range, but doesn't reveal the value
```

---

#### `generateBlinding()`

Generate a random 32-byte blinding factor.

```typescript
generateBlinding(): Uint8Array
```

---

#### `poseidonHash()`

Compute a ZK-friendly Poseidon hash.

```typescript
poseidonHash(inputs: Uint8Array[]): Uint8Array
```

---

#### `pedersenHash()`

Compute a Pedersen hash.

```typescript
pedersenHash(inputs: Uint8Array[]): Uint8Array
```

---

### Class: `MerkleTree`

Efficient Merkle tree implementation.

#### Constructor

```typescript
new MerkleTree(leaves: Buffer[], config?: MerkleTreeConfig)
```

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `root` | `Buffer` | 32-byte Merkle root |
| `depth` | `number` | Tree depth |
| `size` | `number` | Number of leaves |

#### Methods

| Method | Description |
|--------|-------------|
| `generateProof(leaf)` | Generate proof for a leaf |
| `generateProofByIndex(index)` | Generate proof by index |
| `verifyProof(leaf, proof)` | Verify a proof |
| `updateLeaf(index, newLeaf)` | Update a leaf at index |
| `insert(leaf)` | Insert a new leaf |
| `getLeaves()` | Get all leaves |

---

## Stealth Module

Provides stealth address generation and payment scanning.

### Class: `StealthModule`

```typescript
const stealth = new StealthModule();
```

### Methods

#### `generateAddress()`

Generate a stealth address for a recipient.

```typescript
generateAddress(recipientPublicKey: Uint8Array): Promise<StealthAddress>
```

**Returns:**
```typescript
interface StealthAddress {
  address: string;                    // e.g., "stealth_abc123..."
  ephemeralPublicKey: Uint8Array;     // 32 bytes
  viewKeyHint: Uint8Array;            // 32 bytes
  metadata?: StealthAddressMetadata;
}
```

**Example:**
```typescript
const recipientKey = new Uint8Array(32).fill(1);
const stealthAddress = await stealth.generateAddress(recipientKey);
console.log(stealthAddress.address); // stealth_...
```

---

#### `generatePaymentAddress()`

Generate a complete payment address with ephemeral key.

```typescript
generatePaymentAddress(merchantPublicKey: Uint8Array): Promise<PaymentAddress>
```

**Returns:**
```typescript
interface PaymentAddress {
  stealthAddress: StealthAddress;
  ephemeralPublicKey: Uint8Array;
  ephemeralPrivateKey: Uint8Array;  // Sender keeps this temporarily
}
```

---

#### `scanPayments()`

Scan for payments addressed to a recipient.

```typescript
scanPayments(
  privateKey: Uint8Array,
  ephemeralPublicKeys: Uint8Array[]
): Promise<DetectedPayment[]>
```

**Example:**
```typescript
const payments = await stealth.scanPayments(
  merchantPrivateKey,
  [ephemeralKey1, ephemeralKey2]
);
```

---

#### `deriveViewKey()`

Derive a view key from a private key for auditors.

```typescript
deriveViewKey(privateKey: Uint8Array): ViewKey
```

**Returns:**
```typescript
interface ViewKey {
  key: Uint8Array;
  publicKey: Uint8Array;
  canViewAmounts: boolean;
  canViewRecipients: boolean;
}
```

---

#### `deriveScanKey()`

Derive a scan key from a private key (read-only).

```typescript
deriveScanKey(privateKey: Uint8Array): ScanKey
```

**Returns:**
```typescript
interface ScanKey {
  key: Uint8Array;
  publicKey: Uint8Array;
  canDetectPayments: boolean;
  canSpend: false;
}
```

---

#### `verifyPayment()`

Verify ownership of a stealth address.

```typescript
verifyPayment(stealthAddress: StealthAddress, privateKey: Uint8Array): boolean
```

---

#### `isStealthAddress()`

Check if a string is a valid stealth address format.

```typescript
isStealthAddress(address: string): boolean
```

---

#### `extractEphemeralKey()`

Extract the ephemeral public key from a stealth address.

```typescript
extractEphemeralKey(stealthAddress: StealthAddress): Uint8Array
```

---

### Utilities: `StealthUtils`

#### `generateSpendingKey()`

Generate a random spending key.

```typescript
StealthUtils.generateSpendingKey(): Uint8Array
```

---

#### `generateViewingKey()`

Generate a random viewing key.

```typescript
StealthUtils.generateViewingKey(): Uint8Array
```

---

#### `serializePaymentAddress()`

Serialize a payment address for storage/transmission.

```typescript
StealthUtils.serializePaymentAddress(paymentAddress: PaymentAddress): string
```

---

#### `deserializePaymentAddress()`

Deserialize a payment address from JSON string.

```typescript
StealthUtils.deserializePaymentAddress(serialized: string): PaymentAddress
```

---

### Function: `generateEphemeralKey()`

Generate an ephemeral key pair.

```typescript
generateEphemeralKey(): { publicKey: Uint8Array; privateKey: Uint8Array }
```

---

## Transfer Module

Provides private transfer functionality.

### Class: `TransferModule`

```typescript
const transfer = new TransferModule();
```

### Methods

#### `createTransfer()`

Create a private transfer transaction.

```typescript
createTransfer(params: PrivateTransferParams): Promise<PrivateTransaction>
```

**Parameters:**
```typescript
interface PrivateTransferParams {
  recipient: StealthAddress | string;
  amount: bigint;
  token: string;              // 'SOL', 'USDC', etc.
  memo?: string;              // Encrypted memo
  hideAmount?: boolean;       // Default: true
  hideRecipient?: boolean;    // Default: true
  feePayer?: Uint8Array;
}
```

**Returns:**
```typescript
interface PrivateTransaction {
  transaction: Uint8Array;
  proof?: RangeProof;
  commitment?: ZKCommitment;
  ephemeralKey?: Uint8Array;
  metadata?: TransferMetadata;
}
```

**Example:**
```typescript
const transfer = await sdk.transfer.createTransfer({
  recipient: stealthAddress,
  amount: 1000000n,  // 1 USDC (6 decimals)
  token: 'USDC',
  memo: 'Invoice #12345',
  hideAmount: true,
  hideRecipient: true,
});
```

---

#### `send()`

Send a transaction (returns simulated signature in this version).

```typescript
send(transaction: PrivateTransaction, signer: Uint8Array): Promise<string>
```

**Returns:** `string` - Transaction signature

---

#### `verify()`

Verify a transaction.

```typescript
verify(transaction: PrivateTransaction): Promise<VerificationResult>
```

**Returns:**
```typescript
interface VerificationResult {
  valid: boolean;
  rangeProofValid?: boolean;
  commitmentValid?: boolean;
  stealthValid?: boolean;
  error?: string;
}
```

---

#### `decode()`

Decode a transfer using a view key.

```typescript
decode(transaction: PrivateTransaction, viewKey: Uint8Array): Promise<DecodedTransfer>
```

**Returns:**
```typescript
interface DecodedTransfer {
  sender: Uint8Array;
  recipient: Uint8Array;
  amount: bigint;
  token: string;
  memo?: string;
  timestamp: number;
}
```

---

## Utilities

### Crypto Utilities

```typescript
import { 
  randomBytes, 
  hashSHA256, 
  toBase58, 
  fromBase58,
  bufferToBigint,
  bigintToBuffer 
} from '@thegit/solana';
```

| Function | Description |
|----------|-------------|
| `randomBytes(size)` | Generate cryptographically secure random bytes |
| `randomBigint(min, max)` | Generate random bigint in range |
| `hashSHA256(data)` | Compute SHA-256 hash |
| `hashSHA512(data)` | Compute SHA-512 hash |
| `hashPoseidon(inputs)` | Compute ZK-friendly Poseidon hash |
| `bufferToBigint(buffer)` | Convert buffer to bigint |
| `bigintToBuffer(value, size)` | Convert bigint to buffer |
| `toBase58(buffer)` | Encode buffer to base58 |
| `fromBase58(str)` | Decode base58 to buffer |
| `toHex(buffer)` | Encode buffer to hex |
| `fromHex(hex)` | Decode hex to buffer |

---

## Error Handling

### SDKError Class

```typescript
import { SDKError, SDKErrorCode } from '@thegit/solana';

try {
  // ... SDK operation
} catch (error) {
  if (error instanceof SDKError) {
    console.log(error.code);      // SDKErrorCode
    console.log(error.message);   // Error message
    console.log(error.details);   // Additional details
  }
}
```

### Error Codes

| Code | Description |
|------|-------------|
| `INVALID_CONFIG` | Invalid configuration |
| `INVALID_PUBLIC_KEY` | Invalid public key |
| `INVALID_PRIVATE_KEY` | Invalid private key |
| `INVALID_COMMITMENT` | Invalid commitment |
| `INVALID_PROOF` | Invalid proof |
| `INVALID_STEALTH_ADDRESS` | Invalid stealth address |
| `MERKLE_PROOF_FAILED` | Merkle proof verification failed |
| `RANGE_PROOF_FAILED` | Range proof verification failed |
| `CRYPTO_ERROR` | Cryptographic operation failed |
| `NETWORK_ERROR` | Network request failed |
| `TIMEOUT` | Operation timed out |
| `NOT_IMPLEMENTED` | Feature not implemented |

---

## Types

### Core Types

```typescript
type Network = 'mainnet-beta' | 'testnet' | 'devnet' | 'localnet';
type TxCommitment = 'processed' | 'confirmed' | 'finalized';
type Bytes = Uint8Array;

interface SDKConfig {
  network: Network;
  rpcUrl: string;
  commitment?: TxCommitment;
  timeout?: number;
}
```

### Helper Functions

```typescript
import { bytesEqual, bytesToHex, toBytes, concatBytes } from '@thegit/solana';

// Compare two byte arrays
const equal = bytesEqual(a, b);

// Convert to hex string
const hex = bytesToHex(bytes, true); // true = truncate

// Convert various types to bytes
const bytes = toBytes('0x1234');
const bytes2 = toBytes(new Uint8Array([1, 2, 3]));

// Concatenate byte arrays
const combined = concatBytes(a, b, c);
```

---

## Complete Example

```typescript
import { 
  SolanaPrivacySDK, 
  createDevnetSDK,
  bytesEqual 
} from '@thegit/solana';

async function main() {
  // Initialize SDK
  const sdk = createDevnetSDK();
  
  // Generate keys for recipient
  const recipientKey = new Uint8Array(32);
  crypto.getRandomValues(recipientKey);
  
  // Create stealth address
  const stealthAddress = await sdk.stealth.generateAddress(recipientKey);
  console.log('Stealth address:', stealthAddress.address);
  
  // Create commitment for amount
  const blinding = sdk.zk.generateBlinding();
  const commitment = sdk.zk.pedersenCommit(1000n, blinding);
  
  // Create range proof
  const rangeProof = sdk.zk.proveRange(1000n, 0n, 10000n);
  
  // Create private transfer
  const transfer = await sdk.transfer.createTransfer({
    recipient: stealthAddress,
    amount: 1000n,
    token: 'USDC',
    hideAmount: true,
    hideRecipient: true,
  });
  
  // Verify the transfer
  const result = await sdk.transfer.verify(transfer);
  console.log('Transfer valid:', result.valid);
  
  // Scan for payments
  const ephemeralKeys = [stealthAddress.ephemeralPublicKey];
  const payments = await sdk.stealth.scanPayments(recipientKey, ephemeralKeys);
  console.log('Detected payments:', payments.length);
}

main();
```

---

## Version

```typescript
import { VERSION, PACKAGE_NAME } from '@thegit/solana';

console.log(PACKAGE_NAME); // '@thegit/solana'
console.log(VERSION);      // '1.0.0'
```

---

## License

MIT License - See [LICENSE](../LICENSE) for details.
