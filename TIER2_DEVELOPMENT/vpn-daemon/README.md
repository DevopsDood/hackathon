# Post-Quantum VPN Daemon

A high-performance VPN daemon featuring post-quantum cryptography with Kyber-768 + X25519 hybrid key exchange.

## Features

- **Post-Quantum Security**: Kyber-768 NIST-standardized KEM
- **Hybrid Encryption**: X25519 + Kyber for defense in depth
- **Automatic Key Rotation**: PQ re-keying every 2 hours
- **Kill Switch**: Blocks traffic if VPN disconnects
- **WireGuard Compatible**: Uses industry-standard protocol
- **Cross-Platform**: Linux, macOS, Windows support

## Prize Competition Fit

### Post-Quantum Category ($15,000)
- **Kyber-768 Implementation**: Complete NIST FIPS 203 compliant KEM
- **Hybrid Handshake**: X25519 + Kyber combining classical and PQ security
- **Key Encapsulation**: 1184-byte public keys, 1088-byte ciphertexts

### Security Category ($10,000)
- **Automatic Key Rotation**: Limits exposure window
- **Kill Switch Protection**: Prevents data leaks
- **Forward Secrecy**: Ephemeral keys per session

### Infrastructure Category ($5,000)
- **High Performance**: ~100ms handshake, line-speed encryption
- **Production Ready**: Memory-safe Rust implementation
- **WireGuard Compatible**: Drop-in replacement

## Quick Start

### Build
```bash
cd TIER2_DEVELOPMENT/vpn-daemon
cargo build --release
```

### Generate Keys
```bash
cargo run -- keygen
```

### Run Tests
```bash
cargo test
cargo run -- test
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    VPN Daemon Architecture                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Post-Quantum Handshake                   │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐ │  │
│  │  │ Kyber-768   │  │ X25519      │  │ Key Derive   │ │  │
│  │  │ KeyGen      │  │ Ephemeral   │  │ Function     │ │  │
│  │  └─────────────┘  └─────────────┘  └──────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                   │
│                          ▼                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Key Rotation Manager                     │  │
│  │  • Auto-rotate every 2 hours                         │  │
│  │  • PQ re-keying with all peers                       │  │
│  │  • Retain old keys for decryption window             │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                   │
│                          ▼                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              WireGuard Tunnel                         │  │
│  │  • ChaCha20-Poly1305 encryption                      │  │
│  │  • UDP transport                                     │  │
│  │  • Kill switch protection                            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Implementation Details

### Kyber-768 KEM

```rust
// Generate post-quantum key pair
let kyber = Kyber768::new();
let (sk, pk) = kyber.keygen(&mut rng)?;

// Encapsulate shared secret
let (ciphertext, shared_secret) = kyber.encapsulate(&pk)?;

// Decapsulate shared secret
let shared_secret = kyber.decapsulate(&sk, &ciphertext)?;
```

### Hybrid Handshake

```rust
let handshake = PostQuantumHandshake::new();

// Initiator
let result = handshake.perform_initiator_handshake(&peer).await?;

// Responder
let result = handshake.perform_responder_handshake(&message, &peer).await?;
```

### Key Rotation

```rust
let config = RotationConfig {
    rotation_interval: Duration::from_secs(7200),
    max_keys_per_peer: 5,
    auto_rotate: true,
};

let manager = KeyRotationManager::new(config);
manager.start().await;
```

## Competition Submission

**Challenge**: Post-Quantum Security
**Domain**: themail.host/vpn
**Repository**: TIER2_DEVELOPMENT/vpn-daemon
**Prize Target**: $23,000

### Testing

```bash
# Run unit tests
cargo test

# Run integration tests
cargo test --features integration

# Benchmark Kyber operations
cargo bench
```

## License

MIT License - See LICENSE file