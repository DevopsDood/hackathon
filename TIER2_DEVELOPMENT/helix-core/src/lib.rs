//! Helix Core - Post-Quantum Messaging Library
//! 
//! Kyber-768 KEM integration for secure messaging

pub mod kyber;
pub mod messaging;

pub use kyber::{Kyber768, KyberPublicKey, KyberSecretKey};
pub use messaging::{PostQuantumMessage, MessageEncryptor};

pub const VERSION: &str = env!("CARGO_PKG_VERSION");

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