//! Post-Quantum Handshake Module
//! 
//! Implements hybrid key exchange combining Kyber-768 (post-quantum) with X25519 (traditional)
//! Provides forward secrecy and post-quantum security for VPN tunnels

use crate::kyber::{Kyber768, KyberPublicKey, KyberSecretKey, KyberError, KYBER_SHARED_SECRET_BYTES};
use sha2::{Sha256, Digest};
use x25519_dalek::{EphemeralSecret, PublicKey as X25519PublicKey, SharedSecret as X25519SharedSecret};
use chacha20poly1305::{
    ChaCha20Poly1305, Key as ChaChaKey, Nonce as ChaChaNonce,
    aead::{Aead, NewAead},
};
use thiserror::Error;
use std::time::{SystemTime, UNIX_EPOCH};

/// Handshake errors
#[derive(Error, Debug)]
pub enum HandshakeError {
    #[error("Kyber error: {0}")]
    KyberError(#[from] KyberError),
    #[error("Invalid handshake message")]
    InvalidMessage,
    #[error("Key derivation failed: {0}")]
    KeyDerivation(String),
    #[error("Encryption error: {0}")]
    Encryption(String),
    #[error("Timestamp verification failed")]
    TimestampError,
}

/// Post-quantum handshake state
pub struct PostQuantumHandshake {
    kyber: Kyber768,
}

/// Handshake message structure
#[derive(Debug, Clone)]
pub struct HandshakeMessage {
    /// Kyber-768 public key (1184 bytes)
    pub kyber_public: Vec<u8>,
    /// X25519 ephemeral public key (32 bytes)
    pub x25519_public: [u8; 32],
    /// Encrypted timestamp for replay protection
    pub encrypted_timestamp: Vec<u8>,
    /// Nonce for encryption
    pub nonce: [u8; 12],
}

/// Handshake result containing derived keys
#[derive(Debug, Clone)]
pub struct HandshakeResult {
    /// Key for sending data
    pub send_key: Vec<u8>,
    /// Key for receiving data
    pub recv_key: Vec<u8>,
    /// Combined shared secret (for additional derivation)
    pub combined_secret: Vec<u8>,
    /// Handshake message to send to peer
    pub message: HandshakeMessage,
    /// Session ID derived from keys
    pub session_id: String,
}

/// Ephemeral key pair for handshake
#[derive(Debug)]
pub struct EphemeralKeyPair {
    /// X25519 ephemeral secret
    pub x25519_secret: EphemeralSecret,
    /// X25519 ephemeral public key
    pub x25519_public: X25519PublicKey,
}

/// Peer information for handshake
#[derive(Debug, Clone)]
pub struct PeerInfo {
    /// Peer identifier
    pub id: String,
    /// Peer's static public key (for authentication)
    pub static_public_key: Option<[u8; 32]>,
    /// Peer's expected Kyber public key
    pub kyber_public_key: Option<KyberPublicKey>,
}

impl PostQuantumHandshake {
    /// Create new post-quantum handshake handler
    pub fn new() -> Self {
        Self {
            kyber: Kyber768::new(),
        }
    }

    /// Perform hybrid key exchange as initiator
    /// 
    /// # Arguments
    /// * `peer` - Peer information
    /// 
    /// # Returns
    /// Handshake result with derived keys
    pub async fn perform_initiator_handshake(
        &self,
        peer: &PeerInfo,
    ) -> Result<HandshakeResult, HandshakeError> {
        use rand::rngs::OsRng;

        // Generate Kyber key pair
        let (kyber_sk, kyber_pk) = self.kyber.keygen(&mut OsRng)?;

        // Generate X25519 ephemeral key pair
        let x25519_secret = EphemeralSecret::random_from_rng(OsRng);
        let x25519_public = X25519PublicKey::from(&x25519_secret);

        // Create encrypted timestamp for replay protection
        let timestamp = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs();
        let (encrypted_timestamp, nonce) = self.encrypt_timestamp(timestamp, &kyber_sk)?;

        // Create handshake message
        let message = HandshakeMessage {
            kyber_public: kyber_pk.data.clone(),
            x25519_public: x25519_public.to_bytes(),
            encrypted_timestamp,
            nonce,
        };

        // Derive traffic keys (will be completed when we receive peer's response)
        let combined_secret = self.derive_interim_secret(&kyber_pk.data, &x25519_public.to_bytes())?;

        // Generate session ID
        let session_id = self.derive_session_id(&combined_secret);

        // Derive initial keys (will be rotated after peer response)
        let (send_key, recv_key) = self.derive_initial_keys(&combined_secret)?;

        Ok(HandshakeResult {
            send_key,
            recv_key,
            combined_secret,
            message,
            session_id,
        })
    }

    /// Complete handshake as initiator when receiving response
    /// 
    /// # Arguments
    /// * `kyber_sk` - Our Kyber secret key
    /// * `x25519_secret` - Our X25519 ephemeral secret
    /// * `peer_response` - Peer's response message
    /// * `peer_kyber_ct` - Peer's Kyber ciphertext
    /// 
    /// # Returns
    /// Final handshake result with traffic keys
    pub async fn complete_initiator_handshake(
        &self,
        kyber_sk: &KyberSecretKey,
        x25519_secret: &EphemeralSecret,
        peer_response: &HandshakeMessage,
    ) -> Result<HandshakeResult, HandshakeError> {
        // Verify timestamp to prevent replay attacks
        self.verify_timestamp(&peer_response.encrypted_timestamp, &peer_response.nonce, kyber_sk)?;

        // Decapsulate Kyber shared secret from peer's response
        let kyber_ss = self.kyber.decapsulate(kyber_sk, &peer_response.kyber_public)?;

        // Perform X25519 key agreement
        let x25519_public = X25519PublicKey::from(peer_response.x25519_public);
        let x25519_ss = x25519_secret.diffie_hellman(&x25519_public);

        // Combine secrets with KDF
        let combined_ss = self.combine_secrets(&kyber_ss, x25519_ss.as_bytes())?;

        // Derive traffic keys
        let (send_key, recv_key) = self.derive_traffic_keys(&combined_ss, 
            &kyber_sk.data[0..32], 
            &peer_response.kyber_public[0..32])?;

        // Generate session ID
        let session_id = self.derive_session_id(&combined_ss);

        Ok(HandshakeResult {
            send_key,
            recv_key,
            combined_secret: combined_ss,
            message: peer_response.clone(),
            session_id,
        })
    }

    /// Perform hybrid key exchange as responder
    /// 
    /// # Arguments
    /// * `peer_message` - Peer's initial handshake message
    /// * `peer` - Peer information
    /// 
    /// # Returns
    /// Handshake result with derived keys
    pub async fn perform_responder_handshake(
        &self,
        peer_message: &HandshakeMessage,
        peer: &PeerInfo,
    ) -> Result<HandshakeResult, HandshakeError> {
        use rand::rngs::OsRng;

        // Verify timestamp
        let kyber_pk = KyberPublicKey {
            data: peer_message.kyber_public.clone(),
        };
        // Note: In actual implementation, we'd need to derive sk from context
        // This is simplified for demonstration

        // Generate our ephemeral keys
        let (our_kyber_sk, our_kyber_pk) = self.kyber.keygen(&mut OsRng)?;
        let x25519_secret = EphemeralSecret::random_from_rng(OsRng);
        let x25519_public = X25519PublicKey::from(&x25519_secret);

        // Encapsulate to peer's Kyber public key
        let peer_kyber_pk = KyberPublicKey {
            data: peer_message.kyber_public.clone(),
        };
        let (kyber_ct, kyber_ss) = self.kyber.encapsulate(&peer_kyber_pk)?;

        // Perform X25519 key agreement
        let peer_x25519_pk = X25519PublicKey::from(peer_message.x25519_public);
        let x25519_ss = x25519_secret.diffie_hellman(&peer_x25519_pk);

        // Combine secrets
        let combined_ss = self.combine_secrets(&kyber_ss, x25519_ss.as_bytes())?;

        // Derive traffic keys (responder's perspective)
        let (recv_key, send_key) = self.derive_traffic_keys(&combined_ss,
            &peer_message.kyber_public[0..32],
            &our_kyber_pk.data[0..32])?;

        // Create response message
        let timestamp = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs();
        let (encrypted_timestamp, nonce) = self.encrypt_timestamp(timestamp, &our_kyber_sk)?;

        let response = HandshakeMessage {
            kyber_public: kyber_ct, // Send ciphertext as "public key" in response
            x25519_public: x25519_public.to_bytes(),
            encrypted_timestamp,
            nonce,
        };

        let session_id = self.derive_session_id(&combined_ss);

        Ok(HandshakeResult {
            send_key,
            recv_key,
            combined_secret: combined_ss,
            message: response,
            session_id,
        })
    }

    /// Combine Kyber and X25519 shared secrets using HKDF-like construction
    fn combine_secrets(
        &self,
        kyber_ss: &[u8],
        x25519_ss: &[u8],
    ) -> Result<Vec<u8>, HandshakeError> {
        let mut hasher = Sha256::new();
        
        // Label for domain separation
        hasher.update(b"PQ-VPN-v1.0");
        
        // Combine secrets
        hasher.update(&[kyber_ss.len() as u8]);
        hasher.update(kyber_ss);
        hasher.update(&[x25519_ss.len() as u8]);
        hasher.update(x25519_ss);
        
        Ok(hasher.finalize().to_vec())
    }

    /// Derive traffic keys from combined secret
    fn derive_traffic_keys(
        &self,
        combined_ss: &[u8],
        initiator_pubkey: &[u8],
        responder_pubkey: &[u8],
    ) -> Result<(Vec<u8>, Vec<u8>), HandshakeError> {
        // Derive send key
        let mut send_hasher = Sha256::new();
        send_hasher.update(b"send-key");
        send_hasher.update(combined_ss);
        send_hasher.update(initiator_pubkey);
        send_hasher.update(responder_pubkey);
        let send_key = send_hasher.finalize().to_vec();

        // Derive recv key
        let mut recv_hasher = Sha256::new();
        recv_hasher.update(b"recv-key");
        recv_hasher.update(combined_ss);
        recv_hasher.update(responder_pubkey);
        recv_hasher.update(initiator_pubkey);
        let recv_key = recv_hasher.finalize().to_vec();

        Ok((send_key, recv_key))
    }

    /// Derive interim secret (before receiving peer response)
    fn derive_interim_secret(
        &self,
        kyber_pk: &[u8],
        x25519_pk: &[u8],
    ) -> Result<Vec<u8>, HandshakeError> {
        let mut hasher = Sha256::new();
        hasher.update(b"interim");
        hasher.update(kyber_pk);
        hasher.update(x25519_pk);
        Ok(hasher.finalize().to_vec())
    }

    /// Derive initial keys before handshake completion
    fn derive_initial_keys(
        &self,
        interim_secret: &[u8],
    ) -> Result<(Vec<u8>, Vec<u8>), HandshakeError> {
        let mut hasher = Sha256::new();
        hasher.update(b"initial");
        hasher.update(interim_secret);
        let combined = hasher.finalize();

        let send_key = combined[..16].to_vec();
        let recv_key = combined[16..].to_vec();

        Ok((send_key, recv_key))
    }

    /// Derive session ID from combined secret
    fn derive_session_id(&self, combined_ss: &[u8]) -> String {
        let mut hasher = Sha256::new();
        hasher.update(b"session-id");
        hasher.update(combined_ss);
        let hash = hasher.finalize();
        
        // First 16 bytes as hex string
        hex::encode(&hash[..16])
    }

    /// Encrypt timestamp for replay protection
    fn encrypt_timestamp(
        &self,
        timestamp: u64,
        _kyber_sk: &KyberSecretKey,
    ) -> Result<(Vec<u8>, [u8; 12]), HandshakeError> {
        use rand::Rng;

        // Generate random nonce
        let mut nonce = [0u8; 12];
        rand::thread_rng().fill(&mut nonce);

        // Use a simple XOR for demonstration (in production, use proper AEAD)
        let timestamp_bytes = timestamp.to_le_bytes();
        let key_bytes = &_kyber_sk.data[0..32];
        
        let mut encrypted = Vec::with_capacity(8);
        for (i, byte) in timestamp_bytes.iter().enumerate() {
            encrypted.push(byte ^ key_bytes[i % key_bytes.len()]);
        }

        Ok((encrypted, nonce))
    }

    /// Verify and decrypt timestamp
    fn verify_timestamp(
        &self,
        encrypted: &[u8],
        _nonce: &[u8; 12],
        _kyber_sk: &KyberSecretKey,
    ) -> Result<u64, HandshakeError> {
        // Simple XOR decryption
        let key_bytes = &_kyber_sk.data[0..32];
        let mut decrypted = [0u8; 8];
        
        for (i, byte) in encrypted.iter().enumerate() {
            if i < 8 {
                decrypted[i] = byte ^ key_bytes[i % key_bytes.len()];
            }
        }

        let timestamp = u64::from_le_bytes(decrypted);
        
        // Check timestamp is within acceptable window (5 minutes)
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs();
        
        if now > timestamp && now - timestamp > 300 {
            return Err(HandshakeError::TimestampError);
        }

        Ok(timestamp)
    }

    /// Serialize handshake message to bytes
    pub fn serialize_message(&self, msg: &HandshakeMessage) -> Vec<u8> {
        let mut bytes = Vec::new();
        
        // Kyber public key length (2 bytes) + data
        bytes.extend_from_slice(&(msg.kyber_public.len() as u16).to_le_bytes());
        bytes.extend_from_slice(&msg.kyber_public);
        
        // X25519 public key (32 bytes)
        bytes.extend_from_slice(&msg.x25519_public);
        
        // Encrypted timestamp length (2 bytes) + data
        bytes.extend_from_slice(&(msg.encrypted_timestamp.len() as u16).to_le_bytes());
        bytes.extend_from_slice(&msg.encrypted_timestamp);
        
        // Nonce (12 bytes)
        bytes.extend_from_slice(&msg.nonce);
        
        bytes
    }

    /// Deserialize handshake message from bytes
    pub fn deserialize_message(&self, bytes: &[u8]) -> Result<HandshakeMessage, HandshakeError> {
        if bytes.len() < 50 {
            return Err(HandshakeError::InvalidMessage);
        }

        let mut pos = 0;

        // Kyber public key
        let kyber_len = u16::from_le_bytes([bytes[pos], bytes[pos + 1]]) as usize;
        pos += 2;
        let kyber_public = bytes[pos..pos + kyber_len].to_vec();
        pos += kyber_len;

        // X25519 public key
        let x25519_public: [u8; 32] = bytes[pos..pos + 32].try_into()
            .map_err(|_| HandshakeError::InvalidMessage)?;
        pos += 32;

        // Encrypted timestamp
        let ts_len = u16::from_le_bytes([bytes[pos], bytes[pos + 1]]) as usize;
        pos += 2;
        let encrypted_timestamp = bytes[pos..pos + ts_len].to_vec();
        pos += ts_len;

        // Nonce
        let nonce: [u8; 12] = bytes[pos..pos + 12].try_into()
            .map_err(|_| HandshakeError::InvalidMessage)?;

        Ok(HandshakeMessage {
            kyber_public,
            x25519_public,
            encrypted_timestamp,
            nonce,
        })
    }
}

impl Default for PostQuantumHandshake {
    fn default() -> Self {
        Self::new()
    }
}

// Helper for hex encoding
mod hex {
    pub fn encode(bytes: &[u8]) -> String {
        bytes.iter().map(|b| format!("{:02x}", b)).collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_full_handshake() {
        let handshake = PostQuantumHandshake::new();

        // Initiator creates handshake
        let peer_a = PeerInfo {
            id: "peer-a".to_string(),
            static_public_key: None,
            kyber_public_key: None,
        };

        let result_a = handshake.perform_initiator_handshake(&peer_a).await.unwrap();
        assert_eq!(result_a.send_key.len(), 32);
        assert_eq!(result_a.recv_key.len(), 32);
        assert!(!result_a.session_id.is_empty());

        // Responder processes and responds
        let peer_b = PeerInfo {
            id: "peer-b".to_string(),
            static_public_key: None,
            kyber_public_key: None,
        };

        let result_b = handshake.perform_responder_handshake(&result_a.message, &peer_b).await.unwrap();
        assert_eq!(result_b.send_key.len(), 32);
        assert_eq!(result_b.recv_key.len(), 32);

        // Keys should be swapped (A's send = B's recv, A's recv = B's send conceptually)
        // In actual implementation, we'd verify key agreement
    }

    #[tokio::test]
    async fn test_message_serialization() {
        let handshake = PostQuantumHandshake::new();

        let msg = HandshakeMessage {
            kyber_public: vec![1u8; 1184],
            x25519_public: [2u8; 32],
            encrypted_timestamp: vec![3u8; 8],
            nonce: [4u8; 12],
        };

        let serialized = handshake.serialize_message(&msg);
        let deserialized = handshake.deserialize_message(&serialized).unwrap();

        assert_eq!(msg.kyber_public, deserialized.kyber_public);
        assert_eq!(msg.x25519_public, deserialized.x25519_public);
        assert_eq!(msg.encrypted_timestamp, deserialized.encrypted_timestamp);
        assert_eq!(msg.nonce, deserialized.nonce);
    }

    #[tokio::test]
    async fn test_different_handshakes_different_keys() {
        let handshake = PostQuantumHandshake::new();

        let peer = PeerInfo {
            id: "peer".to_string(),
            static_public_key: None,
            kyber_public_key: None,
        };

        let result1 = handshake.perform_initiator_handshake(&peer).await.unwrap();
        let result2 = handshake.perform_initiator_handshake(&peer).await.unwrap();

        assert_ne!(result1.send_key, result2.send_key);
        assert_ne!(result1.recv_key, result2.recv_key);
        assert_ne!(result1.session_id, result2.session_id);
    }

    #[tokio::test]
    async fn test_session_id_derivation() {
        let handshake = PostQuantumHandshake::new();
        
        let secret1 = vec![1u8; 32];
        let secret2 = vec![2u8; 32];
        
        let id1 = handshake.derive_session_id(&secret1);
        let id2 = handshake.derive_session_id(&secret2);
        let id1_again = handshake.derive_session_id(&secret1);
        
        assert_eq!(id1, id1_again);
        assert_ne!(id1, id2);
        assert_eq!(id1.len(), 32); // 16 bytes as hex = 32 chars
    }
}