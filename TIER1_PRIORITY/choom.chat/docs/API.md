# Quantum Terminal API Documentation

Complete API reference for the Quantum Terminal (choom.chat) post-quantum secure messaging system.

## Table of Contents

- [KyberCrypto](#kybercrypto)
- [HybridEncryption](#hybridencryption)
- [MessagingClient](#messagingclient)
- [CLI Commands](#cli-commands)

---

## KyberCrypto

Post-quantum key encapsulation using Kyber-768 (NIST FIPS 203 compliant).

### Class: `KyberCrypto`

**Location:** `src/crypto/kyber.ts`

### Methods

#### `generateKeypair(): Promise<KyberKeypair>`

Generates a new Kyber-768 key pair.

**Returns:**
- `KyberKeypair` - Object containing `publicKey` and `secretKey` Buffers

**Example:**
```typescript
import { KyberCrypto } from './src/crypto/kyber';

const kyber = new KyberCrypto();
const keypair = await kyber.generateKeypair();

console.log('Public Key:', keypair.publicKey.toString('hex'));
console.log('Secret Key:', keypair.secretKey.toString('hex'));
```

#### `encapsulate(publicKey: Buffer): Promise<EncapsulationResult>`

Encapsulates a shared secret using the recipient's public key.

**Parameters:**
- `publicKey` (`Buffer`): Recipient's Kyber-768 public key

**Returns:**
- `EncapsulationResult` - Object containing:
  - `ciphertext` (`Buffer`): Encapsulation ciphertext to send to recipient
  - `sharedSecret` (`Buffer`): 32-byte shared secret

**Example:**
```typescript
const encapsulation = await kyber.encapsulate(recipientPublicKey);
const { ciphertext, sharedSecret } = encapsulation;
```

#### `decapsulate(secretKey: Buffer, ciphertext: Buffer): Promise<Buffer>`

Decapsulates the shared secret using the recipient's secret key.

**Parameters:**
- `secretKey` (`Buffer`): Recipient's Kyber-768 secret key
- `ciphertext` (`Buffer`): Ciphertext received from sender

**Returns:**
- `Buffer` - 32-byte shared secret

**Example:**
```typescript
const sharedSecret = await kyber.decapsulate(secretKey, ciphertext);
```

#### `getParameters(): KyberParams`

Returns the Kyber-768 algorithm parameters.

**Returns:**
```typescript
{
  n: 256,              // Polynomial degree
  q: 3329,             // Modulus
  k: 3,                // Security parameter (Kyber-768)
  publicKeySize: 1184, // Bytes
  secretKeySize: 2400, // Bytes
  ciphertextSize: 1088 // Bytes
}
```

---

## HybridEncryption

Hybrid encryption combining Kyber-768 (post-quantum) with X25519 (classical).

### Class: `HybridEncryption`

**Location:** `src/crypto/hybrid.ts`

### Methods

#### `encryptMessage(message: string, recipientKyberPk?: Buffer, recipientX25519Pk?: Buffer): Promise<HybridCiphertext>`

Encrypts a message using hybrid encryption.

**Parameters:**
- `message` (`string`): Plaintext message to encrypt
- `recipientKyberPk` (`Buffer`, optional): Recipient's Kyber-768 public key
- `recipientX25519Pk` (`Buffer`, optional): Recipient's X25519 public key

**Returns:**
- `HybridCiphertext` - Object containing:
  - `kyberCiphertext` (`Buffer`): Kyber encapsulation ciphertext
  - `x25519Public` (`Buffer`): Ephemeral X25519 public key
  - `ciphertext` (`Buffer`): ChaCha20-Poly1305 encrypted message
  - `nonce` (`Buffer`): 12-byte nonce

**Example:**
```typescript
import { HybridEncryption } from './src/crypto/hybrid';
import * as nacl from 'tweetnacl';

const hybrid = new HybridEncryption();
const x25519Keys = nacl.box.keyPair();

const encrypted = await hybrid.encryptMessage(
  'Hello, Quantum World!',
  kyberPublicKey,
  x25519Keys.publicKey
);
```

#### `getSecurityInfo(): SecurityInfo`

Returns security configuration information.

**Returns:**
```typescript
{
  pqAlgorithm: 'Kyber-768',
  classicalAlgorithm: 'X25519',
  symmetricAlgorithm: 'ChaCha20-Poly1305',
  hybridApproach: true,
  postQuantumSecure: true,
  forwardSecrecy: true
}
```

---

## MessagingClient

Client for encrypted messaging.

### Class: `MessagingClient`

**Location:** `src/core/messaging.ts`

### Constructor

#### `new MessagingClient(config: ClientConfig)`

**Parameters:**
- `config` (`ClientConfig`):
  - `username` (`string`): User identifier
  - `room` (`string`): Room/channel name
  - `useHybrid` (`boolean`): Enable hybrid encryption
  - `serverUrl` (`string`, optional): WebSocket server URL

**Example:**
```typescript
import { MessagingClient } from './src/core/messaging';

const client = new MessagingClient({
  username: 'alice',
  room: 'developers',
  useHybrid: true,
  serverUrl: 'wss://relay.choom.chat'
});
```

### Methods

#### `connect(): Promise<void>`

Connects to the messaging relay.

**Example:**
```typescript
await client.connect();
console.log('Connected!');
```

#### `sendMessage(text: string): Promise<void>`

Sends an encrypted message.

**Parameters:**
- `text` (`string`): Message text

**Throws:**
- `Error`: If not connected

**Example:**
```typescript
await client.sendMessage('Hello, team!');
```

#### `onMessage(handler: (msg: Message) => void): void`

Registers a message handler callback.

**Parameters:**
- `handler` (`function`): Callback receiving `Message` object

**Example:**
```typescript
client.onMessage((msg) => {
  console.log(`[${msg.username}] ${msg.text}`);
});
```

#### `disconnect(): void`

Disconnects from the relay.

**Example:**
```typescript
client.disconnect();
```

### Types

#### `Message`

```typescript
interface Message {
  id: string;        // Unique message ID
  username: string;  // Sender username
  text: string;      // Message content
  timestamp: number; // Unix timestamp (ms)
  encrypted: boolean; // Encryption status
}
```

---

## CLI Commands

Command-line interface for Quantum Terminal.

### Installation

```bash
npm install -g quantum-terminal
# or
npx quantum-terminal
```

### Global Options

| Option | Description |
|--------|-------------|
| `-V, --version` | Show version number |
| `-h, --help` | Show help |

### Commands

#### `keygen`

Generate post-quantum key pair.

```bash
quantum-chat keygen [options]
```

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `--algorithm <algo>` | Key algorithm | `kyber768` |
| `--show-details` | Show detailed key info | `false` |

**Example:**
```bash
quantum-chat keygen --show-details
```

**Output:**
```
🔐 Generating post-quantum keys...
✅ Keys generated successfully!

Public Key:
5f6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d...

Algorithm: kyber768
Key size: 1184 bytes
```

---

#### `start`

Start secure chat session.

```bash
quantum-chat start [options]
```

**Options:**
| Option | Required | Description |
|--------|----------|-------------|
| `--username <name>` | Yes | Your username |
| `--room <room>` | Yes | Room name |
| `--pq-only` | No | Use only post-quantum crypto |

**Example:**
```bash
quantum-chat start --username alice --room dev-team
```

---

#### `send`

Send encrypted message.

```bash
quantum-chat send [options]
```

**Options:**
| Option | Required | Description |
|--------|----------|-------------|
| `--room <room>` | Yes | Room name |
| `--message <text>` | Yes | Message to send |
| `--verbose` | No | Show encryption details |

**Example:**
```bash
quantum-chat send --room dev-team --message "Hello!" --verbose
```

**Output:**
```
🔐 Encrypting with hybrid Kyber-768 + X25519...
✅ Message encrypted and sent!

Ciphertext size: 256 bytes
Kyber ciphertext: 1088 bytes
X25519 public key: 32 bytes
```

---

#### `status`

Show crypto status.

```bash
quantum-chat status
```

**Output:**
```
🔐 Quantum Terminal Crypto Status

✅ Kyber-768 (Post-Quantum)
✅ X25519 (Elliptic Curve)
✅ ChaCha20-Poly1305 (Symmetric)
✅ Hybrid Mode (Kyber + X25519)

Protection: Harvest now, decrypt later defense enabled
```

---

#### `verify`

Verify contact identity.

```bash
quantum-chat verify [options]
```

**Options:**
| Option | Required | Description |
|--------|----------|-------------|
| `--contact <name>` | Yes | Contact name |
| `--fingerprint <fp>` | Yes | Expected fingerprint |

**Example:**
```bash
quantum-chat verify --contact bob --fingerprint abc123...
```

---

## Encryption Flow

```
Step 1: Key Generation
  ├─ Generate Kyber-768 key pair (pk_kyber, sk_kyber)
  ├─ Generate X25519 key pair (pk_x25519, sk_x25519)
  └─ Publish public keys

Step 2: Encapsulation (Sender)
  ├─ Kyber encapsulate(pk_kyber) → (ct_kyber, ss_kyber)
  ├─ X25519 ECDH(sk_x25519_sender, pk_x25519_recipient) → ss_x25519
  └─ KDF(ss_kyber || ss_x25519) → master_key

Step 3: Encryption
  ├─ Generate random nonce (12 bytes)
  ├─ ChaCha20-Poly1305(master_key, nonce, plaintext) → ciphertext
  └─ Output: (ct_kyber, pk_x25519_sender, ciphertext, nonce, auth_tag)

Step 4: Decapsulation (Recipient)
  ├─ Kyber decapsulate(sk_kyber, ct_kyber) → ss_kyber
  ├─ X25519 ECDH(sk_x25519_recipient, pk_x25519_sender) → ss_x25519
  └─ KDF(ss_kyber || ss_x25519) → master_key

Step 5: Decryption
  └─ ChaCha20-Poly1305 decrypt → plaintext
```

---

## Security Properties

| Property | Implementation |
|----------|----------------|
| **Post-Quantum Security** | Kyber-768 (lattice-based) |
| **Classical Security** | X25519 (elliptic curve) |
| **Hybrid Security** | Both must be broken to compromise |
| **Forward Secrecy** | Ephemeral keys per session |
| **Authenticated Encryption** | ChaCha20-Poly1305 |

---

## Error Handling

### Common Errors

```typescript
// Connection errors
try {
  await client.connect();
} catch (error) {
  console.error('Connection failed:', error.message);
}

// Message sending errors
try {
  await client.sendMessage('Hello');
} catch (error) {
  if (error.message === 'Not connected') {
    console.error('Please connect first');
  }
}
```

---

## Browser/Web API

The web interface provides the same commands as the CLI:

```javascript
// Available in browser console
// Commands: help, keygen, status, demo, clear
```

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-30
