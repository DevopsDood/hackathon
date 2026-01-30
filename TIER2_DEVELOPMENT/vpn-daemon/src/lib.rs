//! Post-Quantum VPN Daemon
//! 
//! A high-performance VPN daemon featuring:
//! - Kyber-768 post-quantum key encapsulation
//! - Hybrid X25519+Kyber key exchange
//! - Automatic key rotation with PQ re-keying
//! - WireGuard protocol compatibility
//! - Kill switch protection
//!
//! # Example
//! ```rust
//! use vpn_daemon::{PostQuantumHandshake, PeerInfo};
//!
//! #[tokio::main]
//! async fn main() -> Result<(), Box<dyn std::error::Error>> {
//!     let handshake = PostQuantumHandshake::new();
//!     let peer = PeerInfo {
//!         id: "peer-1".to_string(),
//!         static_public_key: None,
//!         kyber_public_key: None,
//!     };
//!     
//!     let result = handshake.perform_initiator_handshake(&peer).await?;
//!     println!("Session ID: {}", result.session_id);
//!     
//!     Ok(())
//! }
//! ```

pub mod kyber;
pub mod pq_handshake;
pub mod key_rotation;
pub mod tunnel;

pub use kyber::{Kyber768, KyberPublicKey, KyberSecretKey, KyberError};
pub use pq_handshake::{
    PostQuantumHandshake, HandshakeMessage, HandshakeResult, 
    PeerInfo, EphemeralKeyPair, HandshakeError
};
pub use key_rotation::{
    KeyRotationManager, KeyMaterial, RotationConfig, 
    RotationStats, RotationError
};
pub use tunnel::{
    VpnTunnel, TunnelConfig, TunnelState, TunnelStats
};

use thiserror::Error;

/// Main VPN daemon error type
#[derive(Error, Debug)]
pub enum VpnError {
    #[error("Kyber error: {0}")]
    Kyber(#[from] KyberError),
    #[error("Handshake error: {0}")]
    Handshake(#[from] HandshakeError),
    #[error("Rotation error: {0}")]
    Rotation(#[from] RotationError),
    #[error("Tunnel error: {0}")]
    Tunnel(String),
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),
    #[error("Configuration error: {0}")]
    Config(String),
}

/// VPN daemon version
pub const VERSION: &str = env!("CARGO_PKG_VERSION");

/// Get library version
pub fn version() -> &'static str {
    VERSION
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_version() {
        assert!(!version().is_empty());
    }
}