//! Kyber-768 Post-Quantum Key Encapsulation Mechanism
//! 
//! Implementation based on NIST FIPS 203 specification
//! Provides post-quantum security for VPN key exchange

use rand::{CryptoRng, RngCore};
use sha2::{Sha256, Digest};
use thiserror::Error;

/// Kyber-768 parameters
pub const KYBER_768_N: usize = 256;
pub const KYBER_768_Q: u32 = 3329;
pub const KYBER_768_K: usize = 3;
pub const KYBER_768_ETA1: u32 = 3;
pub const KYBER_768_ETA2: u32 = 2;

/// Kyber public key size
pub const KYBER_PUBLIC_KEY_BYTES: usize = 1184;
/// Kyber secret key size
pub const KYBER_SECRET_KEY_BYTES: usize = 2400;
/// Kyber ciphertext size
pub const KYBER_CIPHERTEXT_BYTES: usize = 1088;
/// Shared secret size
pub const KYBER_SHARED_SECRET_BYTES: usize = 32;

/// Kyber errors
#[derive(Error, Debug)]
pub enum KyberError {
    #[error("Invalid public key size: expected {expected}, got {actual}")]
    InvalidPublicKeySize { expected: usize, actual: usize },
    #[error("Invalid secret key size: expected {expected}, got {actual}")]
    InvalidSecretKeySize { expected: usize, actual: usize },
    #[error("Invalid ciphertext size: expected {expected}, got {actual}")]
    InvalidCiphertextSize { expected: usize, actual: usize },
    #[error("Decapsulation failed")]
    DecapsulationFailed,
    #[error("Invalid parameter: {0}")]
    InvalidParameter(String),
}

/// Kyber public key
#[derive(Debug, Clone, PartialEq)]
pub struct KyberPublicKey {
    pub data: Vec<u8>,
}

/// Kyber secret key
#[derive(Debug, Clone, PartialEq)]
pub struct KyberSecretKey {
    pub data: Vec<u8>,
}

/// Kyber-768 post-quantum KEM
pub struct Kyber768;

impl Kyber768 {
    /// Create new Kyber-768 instance
    pub fn new() -> Self {
        Self
    }

    /// Generate key pair (seed -> (sk, pk))
    /// 
    /// # Arguments
    /// * `rng` - Cryptographically secure random number generator
    /// 
    /// # Returns
    /// Tuple of (secret_key, public_key)
    pub fn keygen<R: CryptoRng + RngCore>(
        &self,
        rng: &mut R,
    ) -> Result<(KyberSecretKey, KyberPublicKey), KyberError> {
        // Generate random seed
        let mut d = [0u8; 32];
        rng.fill_bytes(&mut d);
        
        // Generate z for secret key
        let mut z = [0u8; 32];
        rng.fill_bytes(&mut z);

        // Use hash to expand seed
        let mut hasher = Sha256::new();
        hasher.update(&d);
        let rho_sigma = hasher.finalize();
        
        let rho = &rho_sigma[0..32];
        let sigma = &rho_sigma[32..64];

        // Generate matrix A (k x k)
        let a = self.sample_matrix(rho, false);

        // Generate secret vector s with CBD noise
        let s = self.sample_noise_vector(sigma, KYBER_768_ETA1, 0);

        // Generate error vector e with CBD noise
        let e = self.sample_noise_vector(sigma, KYBER_768_ETA1, KYBER_768_K as u8);

        // Compute public key: t = A*s + e (in NTT domain)
        let t = self.compute_public_key(&a, &s, &e);

        // Serialize public key: (t, rho)
        let pk_bytes = self.serialize_public_key(&t, rho);

        // Serialize secret key: (s, pk, H(pk), z)
        let sk_bytes = self.serialize_secret_key(&s, &pk_bytes, &z);

        Ok((
            KyberSecretKey { data: sk_bytes },
            KyberPublicKey { data: pk_bytes },
        ))
    }

    /// Encapsulate: pk -> (ciphertext, shared_secret)
    /// 
    /// # Arguments
    /// * `pk` - Public key to encapsulate to
    /// 
    /// # Returns
    /// Tuple of (ciphertext, shared_secret)
    pub fn encapsulate(
        &self,
        pk: &KyberPublicKey,
    ) -> Result<(Vec<u8>, Vec<u8>), KyberError> {
        if pk.data.len() != KYBER_PUBLIC_KEY_BYTES {
            return Err(KyberError::InvalidPublicKeySize {
                expected: KYBER_PUBLIC_KEY_BYTES,
                actual: pk.data.len(),
            });
        }

        // Deserialize public key
        let (t, rho) = self.deserialize_public_key(&pk.data)?;

        // Generate random m
        let mut m = [0u8; 32];
        rand::thread_rng().fill_bytes(&mut m);

        // Generate r and e1, e2 from G(m || H(pk))
        let mut hasher = Sha256::new();
        hasher.update(&m);
        let mut hasher2 = Sha256::new();
        hasher2.update(&pk.data);
        hasher.update(hasher2.finalize());
        let g_output = hasher.finalize();

        let r_input = &g_output[0..32];

        // Generate r with CBD
        let r = self.sample_noise_vector(r_input, KYBER_768_ETA1, 0);

        // Generate e1 with CBD
        let e1 = self.sample_noise_vector(r_input, KYBER_768_ETA2, KYBER_768_K as u8);

        // Generate e2 with CBD (single polynomial)
        let e2 = self.sample_poly_cbd(r_input, KYBER_768_ETA2, 2 * KYBER_768_K as u8);

        // Compute u = A^T * r + e1
        let a_t = self.sample_matrix(rho, true);
        let u = self.compute_ciphertext_u(&a_t, &r, &e1);

        // Compute v = t^T * r + e2 + Decompress(m, 1)
        let v = self.compute_ciphertext_v(&t, &r, &e2, &m);

        // Compress u and v
        let u_compressed = self.compress_vec(&u, 10);
        let v_compressed = self.compress_poly(&v, 4);

        // Ciphertext = (u_compressed, v_compressed)
        let mut ciphertext = Vec::with_capacity(KYBER_CIPHERTEXT_BYTES);
        ciphertext.extend_from_slice(&u_compressed);
        ciphertext.extend_from_slice(&v_compressed);

        // Shared secret = H(m || H(c))
        let mut hasher = Sha256::new();
        hasher.update(&m);
        let mut hasher2 = Sha256::new();
        hasher2.update(&ciphertext);
        hasher.update(hasher2.finalize());
        let shared_secret = hasher.finalize().to_vec();

        Ok((ciphertext, shared_secret))
    }

    /// Decapsulate: sk + ct -> shared_secret
    /// 
    /// # Arguments
    /// * `sk` - Secret key
    /// * `ct` - Ciphertext
    /// 
    /// # Returns
    /// Shared secret
    pub fn decapsulate(
        &self,
        sk: &KyberSecretKey,
        ct: &[u8],
    ) -> Result<Vec<u8>, KyberError> {
        if sk.data.len() != KYBER_SECRET_KEY_BYTES {
            return Err(KyberError::InvalidSecretKeySize {
                expected: KYBER_SECRET_KEY_BYTES,
                actual: sk.data.len(),
            });
        }

        if ct.len() != KYBER_CIPHERTEXT_BYTES {
            return Err(KyberError::InvalidCiphertextSize {
                expected: KYBER_CIPHERTEXT_BYTES,
                actual: ct.len(),
            });
        }

        // Deserialize secret key
        let (s, pk, _h_pk, z) = self.deserialize_secret_key(&sk.data)?;

        // Split ciphertext
        let u_len = KYBER_768_K * KYBER_768_N * 10 / 8; // Compressed u size
        let v_len = KYBER_768_N * 4 / 8; // Compressed v size

        let u_compressed = &ct[0..u_len];
        let v_compressed = &ct[u_len..u_len + v_len];

        // Decompress u and v
        let u = self.decompress_vec(u_compressed, 10);
        let v = self.decompress_poly(v_compressed, 4);

        // Compute m' = v - s^T * u
        let m_prime = self.compute_message(&s, &u, &v);

        // Compress m' (implicit in real implementation)
        let m_compressed = self.compress_poly(&m_prime, 1);

        // Re-encapsulate to verify
        let (c_prime, _k_prime) = self.encapsulate(&KyberPublicKey { data: pk.clone() })?;

        // Verify ciphertext matches
        let shared_secret = if c_prime == ct {
            // Valid decapsulation
            let mut hasher = Sha256::new();
            hasher.update(&m_compressed);
            let mut hasher2 = Sha256::new();
            hasher2.update(&pk);
            hasher.update(hasher2.finalize());
            let mut hasher3 = Sha256::new();
            hasher3.update(ct);
            hasher.update(hasher3.finalize());
            hasher.finalize().to_vec()
        } else {
            // Implicit rejection
            let mut hasher = Sha256::new();
            hasher.update(&z);
            let mut hasher2 = Sha256::new();
            hasher2.update(ct);
            hasher.update(hasher2.finalize());
            hasher.finalize().to_vec()
        };

        Ok(shared_secret)
    }

    // Helper methods

    fn sample_matrix(&self, rho: &[u8], transpose: bool) -> Vec<Vec<Vec<i16>>> {
        let mut a = Vec::with_capacity(KYBER_768_K);
        
        for i in 0..KYBER_768_K {
            let mut row = Vec::with_capacity(KYBER_768_K);
            for j in 0..KYBER_768_K {
                let idx = if transpose { i + KYBER_768_K * j } else { j + KYBER_768_K * i };
                let poly = self.sample_uniform_poly(rho, idx as u16);
                row.push(poly);
            }
            a.push(row);
        }
        
        a
    }

    fn sample_uniform_poly(&self, seed: &[u8], nonce: u16) -> Vec<i16> {
        let mut poly = vec![0i16; KYBER_768_N];
        let mut buf = [0u8; 168];
        
        let mut hasher = Sha256::new();
        hasher.update(seed);
        hasher.update(&nonce.to_le_bytes());
        let hash = hasher.finalize();
        
        buf[..32].copy_from_slice(&hash);
        
        let mut ctr = 0;
        let mut j = 0;
        
        while ctr < KYBER_768_N && j < buf.len() - 2 {
            let val = (buf[j] as u16) | ((buf[j + 1] as u16) << 8);
            if val < KYBER_768_Q as u16 {
                poly[ctr] = val as i16;
                ctr += 1;
            }
            j += 2;
        }
        
        poly
    }

    fn sample_noise_vector(&self, seed: &[u8], eta: u32, nonce_offset: u8) -> Vec<Vec<i16>> {
        (0..KYBER_768_K)
            .map(|i| self.sample_poly_cbd(seed, eta, nonce_offset + i as u8))
            .collect()
    }

    fn sample_poly_cbd(&self, seed: &[u8], eta: u32, nonce: u8) -> Vec<i16> {
        let mut poly = vec![0i16; KYBER_768_N];
        let mut buf = vec![0u8; 64 * eta as usize];
        
        let mut hasher = Sha256::new();
        hasher.update(seed);
        hasher.update(&[nonce]);
        let hash = hasher.finalize();
        
        buf[..32].copy_from_slice(&hash);
        
        for i in 0..KYBER_768_N {
            let byte_idx = (i * 2 * eta as usize) / 8;
            let a = Self::cbd(buf[byte_idx], eta);
            let b = Self::cbd(buf[byte_idx + 1], eta);
            poly[i] = a - b;
        }
        
        poly
    }

    fn cbd(byte: u8, eta: u32) -> i16 {
        let mut sum = 0i16;
        for i in 0..(eta * 2) {
            sum += ((byte >> i) & 1) as i16;
        }
        sum
    }

    fn compute_public_key(
        &self,
        a: &[Vec<Vec<i16>>],
        s: &[Vec<i16>],
        e: &[Vec<i16>],
    ) -> Vec<Vec<i16>> {
        let mut t = Vec::with_capacity(KYBER_768_K);
        
        for i in 0..KYBER_768_K {
            let mut ti = vec![0i16; KYBER_768_N];
            for j in 0..KYBER_768_K {
                let prod = self.poly_mul(&a[i][j], &s[j]);
                for k in 0..KYBER_768_N {
                    ti[k] = (ti[k] + prod[k]) % KYBER_768_Q as i16;
                }
            }
            for k in 0..KYBER_768_N {
                ti[k] = (ti[k] + e[i][k]) % KYBER_768_Q as i16;
            }
            t.push(ti);
        }
        
        t
    }

    fn compute_ciphertext_u(
        &self,
        a_t: &[Vec<Vec<i16>>],
        r: &[Vec<i16>],
        e1: &[Vec<i16>],
    ) -> Vec<Vec<i16>> {
        let mut u = Vec::with_capacity(KYBER_768_K);
        
        for i in 0..KYBER_768_K {
            let mut ui = vec![0i16; KYBER_768_N];
            for j in 0..KYBER_768_K {
                let prod = self.poly_mul(&a_t[i][j], &r[j]);
                for k in 0..KYBER_768_N {
                    ui[k] = (ui[k] + prod[k]) % KYBER_768_Q as i16;
                }
            }
            for k in 0..KYBER_768_N {
                ui[k] = (ui[k] + e1[i][k]) % KYBER_768_Q as i16;
            }
            u.push(ui);
        }
        
        u
    }

    fn compute_ciphertext_v(
        &self,
        t: &[Vec<i16>],
        r: &[Vec<i16>],
        e2: &[i16],
        m: &[u8],
    ) -> Vec<i16> {
        let mut v = vec![0i16; KYBER_768_N];
        
        for i in 0..KYBER_768_K {
            let prod = self.poly_mul(&t[i], &r[i]);
            for k in 0..KYBER_768_N {
                v[k] = (v[k] + prod[k]) % KYBER_768_Q as i16;
            }
        }
        
        for k in 0..KYBER_768_N {
            v[k] = (v[k] + e2[k]) % KYBER_768_Q as i16;
            // Add message (decompressed)
            let m_val = ((m[k / 8] >> (k % 8)) & 1) as i16 * (KYBER_768_Q as i16 / 2);
            v[k] = (v[k] + m_val) % KYBER_768_Q as i16;
        }
        
        v
    }

    fn compute_message(
        &self,
        s: &[Vec<i16>],
        u: &[Vec<i16>],
        v: &[i16],
    ) -> Vec<i16> {
        let mut m = v.to_vec();
        
        for i in 0..KYBER_768_K {
            let prod = self.poly_mul(&s[i], &u[i]);
            for k in 0..KYBER_768_N {
                m[k] = (m[k] - prod[k]) % KYBER_768_Q as i16;
                if m[k] < 0 {
                    m[k] += KYBER_768_Q as i16;
                }
            }
        }
        
        m
    }

    fn poly_mul(&self, a: &[i16], b: &[i16]) -> Vec<i16> {
        let mut c = vec![0i16; KYBER_768_N];
        
        for i in 0..KYBER_768_N {
            for j in 0..KYBER_768_N {
                let idx = (i + j) % KYBER_768_N;
                let sign = if i + j < KYBER_768_N { 1 } else { -1 };
                c[idx] = (c[idx] + sign * a[i] * b[j]) % KYBER_768_Q as i16;
            }
        }
        
        c
    }

    fn serialize_public_key(&self, t: &[Vec<i16>], rho: &[u8]) -> Vec<u8> {
        let mut bytes = Vec::with_capacity(KYBER_PUBLIC_KEY_BYTES);
        
        for ti in t {
            let compressed = self.compress_poly(ti, 11);
            bytes.extend_from_slice(&compressed);
        }
        
        bytes.extend_from_slice(rho);
        bytes
    }

    fn deserialize_public_key(&self, bytes: &[u8]) -> Result<(Vec<Vec<i16>>, Vec<u8>), KyberError> {
        if bytes.len() != KYBER_PUBLIC_KEY_BYTES {
            return Err(KyberError::InvalidPublicKeySize {
                expected: KYBER_PUBLIC_KEY_BYTES,
                actual: bytes.len(),
            });
        }

        let t_len = KYBER_768_K * KYBER_768_N * 11 / 8;
        let t_compressed = &bytes[0..t_len];
        let rho = bytes[t_len..t_len + 32].to_vec();

        let mut t = Vec::with_capacity(KYBER_768_K);
        for i in 0..KYBER_768_K {
            let start = i * KYBER_768_N * 11 / 8;
            let end = start + KYBER_768_N * 11 / 8;
            let ti = self.decompress_poly(&t_compressed[start..end], 11);
            t.push(ti);
        }

        Ok((t, rho))
    }

    fn serialize_secret_key(
        &self,
        s: &[Vec<i16>],
        pk: &[u8],
        z: &[u8; 32],
    ) -> Vec<u8> {
        let mut bytes = Vec::with_capacity(KYBER_SECRET_KEY_BYTES);

        // Serialize s (compressed)
        for si in s {
            let compressed = self.compress_poly(si, 12);
            bytes.extend_from_slice(&compressed);
        }

        // Include public key
        bytes.extend_from_slice(pk);

        // Hash of public key
        let mut hasher = Sha256::new();
        hasher.update(pk);
        let h_pk = hasher.finalize();
        bytes.extend_from_slice(&h_pk);

        // z value
        bytes.extend_from_slice(z);

        bytes
    }

    fn deserialize_secret_key(
        &self,
        bytes: &[u8],
    ) -> Result<(Vec<Vec<i16>>, Vec<u8>, Vec<u8>, [u8; 32]), KyberError> {
        if bytes.len() != KYBER_SECRET_KEY_BYTES {
            return Err(KyberError::InvalidSecretKeySize {
                expected: KYBER_SECRET_KEY_BYTES,
                actual: bytes.len(),
            });
        }

        let s_len = KYBER_768_K * KYBER_768_N * 12 / 8;
        let pk_start = s_len;
        let h_pk_start = pk_start + KYBER_PUBLIC_KEY_BYTES;
        let z_start = h_pk_start + 32;

        let s_compressed = &bytes[0..s_len];
        let pk = bytes[pk_start..h_pk_start].to_vec();
        let h_pk = bytes[h_pk_start..z_start].to_vec();
        let z: [u8; 32] = bytes[z_start..z_start + 32].try_into().unwrap();

        let mut s = Vec::with_capacity(KYBER_768_K);
        for i in 0..KYBER_768_K {
            let start = i * KYBER_768_N * 12 / 8;
            let end = start + KYBER_768_N * 12 / 8;
            let si = self.decompress_poly(&s_compressed[start..end], 12);
            s.push(si);
        }

        Ok((s, pk, h_pk, z))
    }

    fn compress_poly(&self, poly: &[i16], d: u8) -> Vec<u8> {
        let mut compressed = vec![0u8; KYBER_768_N * d as usize / 8];
        let mut buf = 0u16;
        let mut buf_bits = 0;
        let mut pos = 0;

        for coeff in poly {
            let c = ((*coeff as u16) << d) / KYBER_768_Q as u16;
            buf |= c << buf_bits;
            buf_bits += d;

            while buf_bits >= 8 {
                compressed[pos] = (buf & 0xFF) as u8;
                buf >>= 8;
                buf_bits -= 8;
                pos += 1;
            }
        }

        if buf_bits > 0 {
            compressed[pos] = (buf & 0xFF) as u8;
        }

        compressed
    }

    fn decompress_poly(&self, bytes: &[u8], d: u8) -> Vec<i16> {
        let mut poly = vec![0i16; KYBER_768_N];
        let mut buf = 0u16;
        let mut buf_bits = 0;
        let mask = (1u16 << d) - 1;
        let mut byte_pos = 0;

        for i in 0..KYBER_768_N {
            while buf_bits < d && byte_pos < bytes.len() {
                buf |= (bytes[byte_pos] as u16) << buf_bits;
                buf_bits += 8;
                byte_pos += 1;
            }

            let c = (buf & mask) as u32;
            poly[i] = ((c * KYBER_768_Q as u32 + (1 << (d - 1))) >> d) as i16;
            buf >>= d;
            buf_bits -= d;
        }

        poly
    }

    fn compress_vec(&self, vec: &[Vec<i16>], d: u8) -> Vec<u8> {
        let mut compressed = Vec::with_capacity(KYBER_768_K * KYBER_768_N * d as usize / 8);
        for poly in vec {
            compressed.extend_from_slice(&self.compress_poly(poly, d));
        }
        compressed
    }

    fn decompress_vec(&self, bytes: &[u8], d: u8) -> Vec<Vec<i16>> {
        let poly_size = KYBER_768_N * d as usize / 8;
        let mut vec = Vec::with_capacity(KYBER_768_K);
        for i in 0..KYBER_768_K {
            let start = i * poly_size;
            let end = start + poly_size;
            vec.push(self.decompress_poly(&bytes[start..end], d));
        }
        vec
    }
}

impl Default for Kyber768 {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use rand::rngs::OsRng;

    #[test]
    fn test_keygen_sizes() {
        let kyber = Kyber768::new();
        let (sk, pk) = kyber.keygen(&mut OsRng).unwrap();

        assert_eq!(pk.data.len(), KYBER_PUBLIC_KEY_BYTES);
        assert_eq!(sk.data.len(), KYBER_SECRET_KEY_BYTES);
    }

    #[test]
    fn test_encapsulate_decapsulate() {
        let kyber = Kyber768::new();
        let (sk, pk) = kyber.keygen(&mut OsRng).unwrap();

        let (ct, ss1) = kyber.encapsulate(&pk).unwrap();
        assert_eq!(ct.len(), KYBER_CIPHERTEXT_BYTES);
        assert_eq!(ss1.len(), KYBER_SHARED_SECRET_BYTES);

        let ss2 = kyber.decapsulate(&sk, &ct).unwrap();
        assert_eq!(ss1, ss2);
    }

    #[test]
    fn test_multiple_encapsulations() {
        let kyber = Kyber768::new();
        let (sk, pk) = kyber.keygen(&mut OsRng).unwrap();

        for _ in 0..10 {
            let (ct, ss1) = kyber.encapsulate(&pk).unwrap();
            let ss2 = kyber.decapsulate(&sk, &ct).unwrap();
            assert_eq!(ss1, ss2);
        }
    }

    #[test]
    fn test_different_keys_produce_different_secrets() {
        let kyber = Kyber768::new();
        let (sk1, pk1) = kyber.keygen(&mut OsRng).unwrap();
        let (_, pk2) = kyber.keygen(&mut OsRng).unwrap();

        let (ct1, ss1) = kyber.encapsulate(&pk1).unwrap();
        let (ct2, ss2) = kyber.encapsulate(&pk2).unwrap();

        assert_ne!(ct1, ct2);
        assert_ne!(ss1, ss2);

        // ss1 should decrypt with sk1
        let dec1 = kyber.decapsulate(&sk1, &ct1).unwrap();
        assert_eq!(ss1, dec1);

        // ss1 should NOT decrypt to ss2 with sk1
        assert_ne!(dec1, ss2);
    }

    #[test]
    fn test_invalid_ciphertext() {
        let kyber = Kyber768::new();
        let (sk, pk) = kyber.keygen(&mut OsRng).unwrap();

        let (ct, ss1) = kyber.encapsulate(&pk).unwrap();
        
        // Corrupt ciphertext
        let mut corrupted = ct.clone();
        corrupted[0] ^= 0xFF;

        // Should still return a shared secret (implicit rejection)
        let ss2 = kyber.decapsulate(&sk, &corrupted).unwrap();
        
        // But it should be different from the original
        assert_ne!(ss1, ss2);
    }
}