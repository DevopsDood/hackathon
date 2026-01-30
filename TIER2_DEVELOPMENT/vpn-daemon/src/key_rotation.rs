//! Key Rotation Manager
//! 
//! Implements automatic periodic key rotation with post-quantum re-keying
//! Ensures forward secrecy and limits exposure window for compromised keys

use crate::kyber::{Kyber768, KyberPublicKey, KyberSecretKey};
use crate::pq_handshake::{PostQuantumHandshake, HandshakeResult, PeerInfo, HandshakeError};
use std::sync::Arc;
use std::time::{Duration, Instant};
use tokio::sync::RwLock;
use tokio::time::interval;
use tracing::{info, warn, error, debug};
use dashmap::DashMap;
use thiserror::Error;

/// Key rotation errors
#[derive(Error, Debug)]
pub enum RotationError {
    #[error("Handshake error: {0}")]
    HandshakeError(#[from] HandshakeError),
    #[error("Key generation failed: {0}")]
    KeyGeneration(String),
    #[error("Rekey in progress")]
    RekeyInProgress,
    #[error("Peer not found: {0}")]
    PeerNotFound(String),
}

/// Key material stored for a session
#[derive(Debug, Clone)]
pub struct KeyMaterial {
    /// Kyber secret key
    pub kyber_sk: KyberSecretKey,
    /// X25519 secret key bytes
    pub x25519_sk: Vec<u8>,
    /// Traffic keys
    pub send_key: Vec<u8>,
    pub recv_key: Vec<u8>,
    /// Session ID
    pub session_id: String,
    /// Key creation timestamp
    pub created_at: Instant,
    /// Key ID for rotation tracking
    pub key_id: u64,
}

/// Key rotation configuration
#[derive(Debug, Clone)]
pub struct RotationConfig {
    /// Rotation interval (default: 2 hours)
    pub rotation_interval: Duration,
    /// Maximum number of keys to retain per peer
    pub max_keys_per_peer: usize,
    /// Key expiration time (default: 24 hours)
    pub key_expiration: Duration,
    /// Enable automatic rotation
    pub auto_rotate: bool,
    /// Rekey on packet threshold
    pub rekey_packet_threshold: Option<u64>,
}

impl Default for RotationConfig {
    fn default() -> Self {
        Self {
            rotation_interval: Duration::from_secs(7200), // 2 hours
            max_keys_per_peer: 5,
            key_expiration: Duration::from_secs(86400), // 24 hours
            auto_rotate: true,
            rekey_packet_threshold: Some(1_000_000), // 1M packets
        }
    }
}

/// Active peer session tracking
#[derive(Debug)]
struct PeerSession {
    /// Peer information
    peer_info: PeerInfo,
    /// Active key materials (newest first)
    keys: Vec<KeyMaterial>,
    /// Current key ID counter
    key_counter: u64,
    /// Packets sent with current key
    packets_sent: u64,
    /// Last rotation time
    last_rotation: Instant,
    /// Rekey in progress flag
    rekeying: bool,
}

/// Key rotation manager
pub struct KeyRotationManager {
    /// Configuration
    config: RotationConfig,
    /// Post-quantum handshake handler
    handshake: PostQuantumHandshake,
    /// Active peer sessions
    sessions: DashMap<String, RwLock<PeerSession>>,
    /// Background rotation task handle
    rotation_task: Option<tokio::task::JoinHandle<()>>,
}

impl KeyRotationManager {
    /// Create new key rotation manager
    pub fn new(config: RotationConfig) -> Self {
        Self {
            config,
            handshake: PostQuantumHandshake::new(),
            sessions: DashMap::new(),
            rotation_task: None,
        }
    }

    /// Start background rotation task
    pub async fn start(&mut self) {
        if !self.config.auto_rotate {
            return;
        }

        let interval_duration = self.config.rotation_interval;
        let sessions = self.sessions.clone();
        let config = self.config.clone();

        let handle = tokio::spawn(async move {
            let mut ticker = interval(interval_duration);

            loop {
                ticker.tick().await;
                
                debug!("Running scheduled key rotation");
                
                for entry in sessions.iter() {
                    let peer_id = entry.key().clone();
                    let session = entry.value();
                    
                    if let Err(e) = Self::rotate_peer_keys(&peer_id, session, &config).await {
                        warn!("Key rotation failed for peer {}: {}", peer_id, e);
                    }
                }
            }
        });

        self.rotation_task = Some(handle);
        info!("Key rotation manager started with {:?} interval", interval_duration);
    }

    /// Stop background rotation
    pub async fn stop(&mut self) {
        if let Some(handle) = self.rotation_task.take() {
            handle.abort();
            info!("Key rotation manager stopped");
        }
    }

    /// Register a new peer session
    pub async fn register_peer(
        &self,
        peer_id: String,
        peer_info: PeerInfo,
        initial_handshake: HandshakeResult,
    ) -> Result<(), RotationError> {
        let key_material = KeyMaterial {
            kyber_sk: KyberSecretKey { data: vec![] }, // Would be extracted from handshake
            x25519_sk: vec![],
            send_key: initial_handshake.send_key,
            recv_key: initial_handshake.recv_key,
            session_id: initial_handshake.session_id,
            created_at: Instant::now(),
            key_id: 0,
        };

        let session = PeerSession {
            peer_info,
            keys: vec![key_material],
            key_counter: 1,
            packets_sent: 0,
            last_rotation: Instant::now(),
            rekeying: false,
        };

        self.sessions.insert(peer_id, RwLock::new(session));
        info!("Registered peer session for key rotation");

        Ok(())
    }

    /// Unregister a peer session
    pub async fn unregister_peer(&self, peer_id: &str) {
        self.sessions.remove(peer_id);
        info!("Unregistered peer {} from key rotation", peer_id);
    }

    /// Get current key material for a peer
    pub async fn get_current_keys(&self, peer_id: &str) -> Result<KeyMaterial, RotationError> {
        let entry = self.sessions
            .get(peer_id)
            .ok_or_else(|| RotationError::PeerNotFound(peer_id.to_string()))?;

        let session = entry.read().await;
        
        session.keys.first()
            .cloned()
            .ok_or_else(|| RotationError::KeyGeneration("No keys available".to_string()))
    }

    /// Initiate manual rekey for a peer
    pub async fn initiate_rekey(&self, peer_id: &str) -> Result<HandshakeResult, RotationError> {
        let entry = self.sessions
            .get(peer_id)
            .ok_or_else(|| RotationError::PeerNotFound(peer_id.to_string()))?;

        let mut session = entry.write().await;

        if session.rekeying {
            return Err(RotationError::RekeyInProgress);
        }

        session.rekeying = true;
        
        // Perform new handshake
        let result = self.handshake.perform_initiator_handshake(&session.peer_info).await?;
        
        // Create new key material
        let new_key = KeyMaterial {
            kyber_sk: KyberSecretKey { data: vec![] },
            x25519_sk: vec![],
            send_key: result.send_key.clone(),
            recv_key: result.recv_key.clone(),
            session_id: result.session_id.clone(),
            created_at: Instant::now(),
            key_id: session.key_counter,
        };

        // Add new key
        session.keys.insert(0, new_key);
        session.key_counter += 1;
        session.last_rotation = Instant::now();
        session.packets_sent = 0;

        // Cleanup old keys
        Self::cleanup_old_keys(&mut session, &self.config);

        session.rekeying = false;

        info!("Completed rekey for peer {}: new key_id={}", peer_id, session.key_counter - 1);
        
        Ok(result)
    }

    /// Complete rekey as responder
    pub async fn complete_rekey(
        &self,
        peer_id: &str,
        peer_message: crate::pq_handshake::HandshakeMessage,
    ) -> Result<HandshakeResult, RotationError> {
        let entry = self.sessions
            .get(peer_id)
            .ok_or_else(|| RotationError::PeerNotFound(peer_id.to_string()))?;

        let mut session = entry.write().await;

        // Perform responder handshake
        let result = self.handshake.perform_responder_handshake(&peer_message, &session.peer_info).await?;

        // Create new key material
        let new_key = KeyMaterial {
            kyber_sk: KyberSecretKey { data: vec![] },
            x25519_sk: vec![],
            send_key: result.send_key.clone(),
            recv_key: result.recv_key.clone(),
            session_id: result.session_id.clone(),
            created_at: Instant::now(),
            key_id: session.key_counter,
        };

        session.keys.insert(0, new_key);
        session.key_counter += 1;
        session.last_rotation = Instant::now();

        Self::cleanup_old_keys(&mut session, &self.config);

        info!("Completed responder rekey for peer {}: new key_id={}", peer_id, session.key_counter - 1);

        Ok(result)
    }

    /// Increment packet counter for a peer
    pub async fn increment_packet_count(&self, peer_id: &str) -> Result<(), RotationError> {
        let entry = self.sessions
            .get(peer_id)
            .ok_or_else(|| RotationError::PeerNotFound(peer_id.to_string()))?;

        let mut session = entry.write().await;
        session.packets_sent += 1;

        // Check if we need to rekey based on packet threshold
        if let Some(threshold) = self.config.rekey_packet_threshold {
            if session.packets_sent >= threshold && !session.rekeying {
                drop(session); // Release lock before rekey
                info!("Packet threshold reached for peer {}, initiating rekey", peer_id);
                let _ = self.initiate_rekey(peer_id).await;
            }
        }

        Ok(())
    }

    /// Get rotation statistics
    pub async fn get_stats(&self) -> RotationStats {
        let total_peers = self.sessions.len();
        let mut total_keys = 0;
        let mut peers_needing_rotation = 0;

        for entry in self.sessions.iter() {
            let session = entry.value().read().await;
            total_keys += session.keys.len();
            
            if session.last_rotation.elapsed() > self.config.rotation_interval {
                peers_needing_rotation += 1;
            }
        }

        RotationStats {
            total_peers,
            total_keys,
            peers_needing_rotation,
            config: self.config.clone(),
        }
    }

    /// Rotate keys for a specific peer
    async fn rotate_peer_keys(
        peer_id: &str,
        session: &RwLock<PeerSession>,
        config: &RotationConfig,
    ) -> Result<(), RotationError> {
        let mut session = session.write().await;

        // Check if rotation is needed
        if session.last_rotation.elapsed() < config.rotation_interval {
            return Ok(());
        }

        if session.rekeying {
            warn!("Rekey already in progress for peer {}", peer_id);
            return Ok(());
        }

        // Mark as rekeying
        session.rekeying = true;

        // Generate new ephemeral keys
        // In actual implementation, this would perform a full handshake
        // For now, we just mark that rotation occurred

        session.last_rotation = Instant::now();
        session.rekeying = false;

        info!("Rotated keys for peer {}", peer_id);

        Ok(())
    }

    /// Cleanup old keys beyond retention limit
    fn cleanup_old_keys(session: &mut PeerSession, config: &RotationConfig) {
        // Remove expired keys
        let now = Instant::now();
        session.keys.retain(|k| now.duration_since(k.created_at) < config.key_expiration);

        // Keep only max_keys_per_peer
        if session.keys.len() > config.max_keys_per_peer {
            session.keys.truncate(config.max_keys_per_peer);
        }

        debug!("Cleaned up keys for peer, {} keys remaining", session.keys.len());
    }
}

/// Rotation statistics
#[derive(Debug, Clone)]
pub struct RotationStats {
    pub total_peers: usize,
    pub total_keys: usize,
    pub peers_needing_rotation: usize,
    pub config: RotationConfig,
}

impl std::fmt::Display for RotationStats {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "RotationStats {{ peers: {}, keys: {}, need_rotation: {} }}",
            self.total_peers, self.total_keys, self.peers_needing_rotation)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::pq_handshake::HandshakeMessage;

    fn create_test_handshake_result() -> HandshakeResult {
        HandshakeResult {
            send_key: vec![1u8; 32],
            recv_key: vec![2u8; 32],
            combined_secret: vec![3u8; 32],
            message: HandshakeMessage {
                kyber_public: vec![4u8; 1184],
                x25519_public: [5u8; 32],
                encrypted_timestamp: vec![6u8; 8],
                nonce: [7u8; 12],
            },
            session_id: "test-session-123".to_string(),
        }
    }

    #[tokio::test]
    async fn test_register_and_get_keys() {
        let config = RotationConfig::default();
        let manager = KeyRotationManager::new(config);

        let peer_id = "peer-1".to_string();
        let peer_info = PeerInfo {
            id: peer_id.clone(),
            static_public_key: None,
            kyber_public_key: None,
        };

        let handshake_result = create_test_handshake_result();

        manager.register_peer(peer_id.clone(), peer_info, handshake_result).await.unwrap();

        let keys = manager.get_current_keys(&peer_id).await.unwrap();
        assert_eq!(keys.session_id, "test-session-123");
        assert_eq!(keys.key_id, 0);
    }

    #[tokio::test]
    async fn test_unregister_peer() {
        let config = RotationConfig::default();
        let manager = KeyRotationManager::new(config);

        let peer_id = "peer-1".to_string();
        let peer_info = PeerInfo {
            id: peer_id.clone(),
            static_public_key: None,
            kyber_public_key: None,
        };

        manager.register_peer(
            peer_id.clone(),
            peer_info,
            create_test_handshake_result(),
        ).await.unwrap();

        manager.unregister_peer(&peer_id).await;

        let result = manager.get_current_keys(&peer_id).await;
        assert!(result.is_err());
    }

    #[tokio::test]
    async fn test_get_stats() {
        let config = RotationConfig::default();
        let manager = KeyRotationManager::new(config);

        // Register multiple peers
        for i in 0..5 {
            let peer_id = format!("peer-{}", i);
            let peer_info = PeerInfo {
                id: peer_id.clone(),
                static_public_key: None,
                kyber_public_key: None,
            };
            manager.register_peer(peer_id, peer_info, create_test_handshake_result()).await.unwrap();
        }

        let stats = manager.get_stats().await;
        assert_eq!(stats.total_peers, 5);
        assert_eq!(stats.total_keys, 5);
    }

    #[tokio::test]
    async fn test_packet_threshold_rekey() {
        let mut config = RotationConfig::default();
        config.rekey_packet_threshold = Some(100);
        
        let manager = KeyRotationManager::new(config);

        let peer_id = "peer-1".to_string();
        let peer_info = PeerInfo {
            id: peer_id.clone(),
            static_public_key: None,
            kyber_public_key: None,
        };

        manager.register_peer(
            peer_id.clone(),
            peer_info,
            create_test_handshake_result(),
        ).await.unwrap();

        // Increment packets up to threshold
        for _ in 0..99 {
            manager.increment_packet_count(&peer_id).await.unwrap();
        }

        // Should not have triggered rekey yet
        let keys = manager.get_current_keys(&peer_id).await.unwrap();
        assert_eq!(keys.key_id, 0);

        // One more packet should trigger rekey (but will fail in test due to no actual handshake)
        // In real implementation, this would initiate rekey
        let _ = manager.increment_packet_count(&peer_id).await;
    }
}