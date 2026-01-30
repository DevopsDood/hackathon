//! Kyber-768 Post-Quantum KEM for Helix Messaging

use rand::{CryptoRng, RngCore};
use sha2::{Sha256, Digest};

pub const KYBER_N: usize = 256;
pub const KYBER_Q: u32 = 3329;
pub const KYBER_K: usize = 3;
pub const KYBER_PUBLIC_KEY_BYTES: usize = 1184;
pub const KYBER_SECRET_KEY_BYTES: usize = 2400;
pub const KYBER_CIPHERTEXT_BYTES: usize = 1088;
pub const KYBER_SHARED_SECRET_BYTES: usize = 32;

#[derive(Debug, Clone)]
pub struct KyberPublicKey { pub data: Vec<u8> }

#[derive(Debug, Clone)]
pub struct KyberSecretKey { pub data: Vec<u8> }

pub struct Kyber768;

impl Kyber768 {
    pub fn new() -> Self { Self }

    pub fn keygen<R: CryptoRng + RngCore>(&self, rng: &mut R) -> (KyberSecretKey, KyberPublicKey) {
        let mut d = [0u8; 32];
        rng.fill_bytes(&mut d);
        let mut z = [0u8; 32];
        rng.fill_bytes(&mut z);

        let rho = &d[..32];
        let sigma = &d[..32];

        let a = self.sample_matrix(rho, false);
        let s = self.sample_noise_vector(sigma, 3, 0);
        let e = self.sample_noise_vector(sigma, 3, KYBER_K as u8);

        let t = self.compute_public_key(&a, &s, &e);
        let pk_bytes = self.serialize_public_key(&t, rho);
        let sk_bytes = self.serialize_secret_key(&s, &pk_bytes, &z);

        (KyberSecretKey { data: sk_bytes }, KyberPublicKey { data: pk_bytes })
    }

    pub fn encapsulate(&self, pk: &KyberPublicKey) -> (Vec<u8>, Vec<u8>) {
        let m = self.random_bytes(32);
        
        let (_t, rho) = self.deserialize_public_key(&pk.data).unwrap();
        let a_t = self.sample_matrix(rho, true);
        
        let r = self.sample_noise_vector(&m, 2, 0);
        let e1 = self.sample_noise_vector(&m, 2, KYBER_K as u8);
        let e2 = self.sample_poly_cbd(&m, 2, 2 * KYBER_K as u8);

        let u = self.compute_ciphertext_u(&a_t, &r, &e1);
        let v = self.compute_ciphertext_v(&_t, &r, &e2, &m);

        let mut ciphertext = Vec::new();
        ciphertext.extend_from_slice(&self.compress_vec(&u, 10));
        ciphertext.extend_from_slice(&self.compress_poly(&v, 4));

        let mut hasher = Sha256::new();
        hasher.update(&m);
        hasher.update(&ciphertext);
        let shared_secret = hasher.finalize().to_vec();

        (ciphertext, shared_secret)
    }

    pub fn decapsulate(&self, sk: &KyberSecretKey, ct: &[u8]) -> Vec<u8> {
        let (s, _pk, _, _) = self.deserialize_secret_key(&sk.data).unwrap();
        
        let u_len = KYBER_K * KYBER_N * 10 / 8;
        let v_len = KYBER_N * 4 / 8;
        
        let u = self.decompress_vec(&ct[0..u_len], 10);
        let v = self.decompress_poly(&ct[u_len..u_len + v_len], 4);

        let m_prime = self.compute_message(&s, &u, &v);

        let mut hasher = Sha256::new();
        hasher.update(&self.compress_poly(&m_prime, 1));
        hasher.update(ct);
        hasher.finalize().to_vec()
    }

    fn sample_matrix(&self, rho: &[u8], transpose: bool) -> Vec<Vec<Vec<i16>>> {
        let mut a = Vec::with_capacity(KYBER_K);
        for i in 0..KYBER_K {
            let mut row = Vec::with_capacity(KYBER_K);
            for j in 0..KYBER_K {
                let idx = if transpose { i + KYBER_K * j } else { j + KYBER_K * i };
                row.push(self.sample_uniform_poly(rho, idx as u16));
            }
            a.push(row);
        }
        a
    }

    fn sample_uniform_poly(&self, seed: &[u8], nonce: u16) -> Vec<i16> {
        let mut poly = vec![0i16; KYBER_N];
        let mut hasher = Sha256::new();
        hasher.update(seed);
        hasher.update(&nonce.to_le_bytes());
        let hash = hasher.finalize();
        for i in 0..KYBER_N.min(32) {
            poly[i] = (hash[i % hash.len()] as i16) % KYBER_Q as i16;
        }
        poly
    }

    fn sample_noise_vector(&self, seed: &[u8], eta: u32, nonce_offset: u8) -> Vec<Vec<i16>> {
        (0..KYBER_K).map(|i| self.sample_poly_cbd(seed, eta, nonce_offset + i as u8)).collect()
    }

    fn sample_poly_cbd(&self, seed: &[u8], eta: u32, nonce: u8) -> Vec<i16> {
        let mut poly = vec![0i16; KYBER_N];
        let mut hasher = Sha256::new();
        hasher.update(seed);
        hasher.update(&[nonce]);
        let hash = hasher.finalize();
        for i in 0..KYBER_N {
            poly[i] = ((hash[i % hash.len()] as i16) % (2 * eta as i16)) - (eta as i16);
        }
        poly
    }

    fn compute_public_key(&self, a: &[Vec<Vec<i16>>], s: &[Vec<i16>], e: &[Vec<i16>]) -> Vec<Vec<i16>> {
        let mut t = Vec::with_capacity(KYBER_K);
        for i in 0..KYBER_K {
            let mut ti = vec![0i16; KYBER_N];
            for j in 0..KYBER_K {
                let prod = self.poly_mul(&a[i][j], &s[j]);
                for k in 0..KYBER_N { ti[k] = (ti[k] + prod[k]) % KYBER_Q as i16; }
            }
            for k in 0..KYBER_N { ti[k] = (ti[k] + e[i][k]) % KYBER_Q as i16; }
            t.push(ti);
        }
        t
    }

    fn compute_ciphertext_u(&self, a_t: &[Vec<Vec<i16>>], r: &[Vec<i16>], e1: &[Vec<i16>]) -> Vec<Vec<i16>> {
        let mut u = Vec::with_capacity(KYBER_K);
        for i in 0..KYBER_K {
            let mut ui = vec![0i16; KYBER_N];
            for j in 0..KYBER_K {
                let prod = self.poly_mul(&a_t[i][j], &r[j]);
                for k in 0..KYBER_N { ui[k] = (ui[k] + prod[k]) % KYBER_Q as i16; }
            }
            for k in 0..KYBER_N { ui[k] = (ui[k] + e1[i][k]) % KYBER_Q as i16; }
            u.push(ui);
        }
        u
    }

    fn compute_ciphertext_v(&self, t: &[Vec<i16>], r: &[Vec<i16>], e2: &[i16], m: &[u8]) -> Vec<i16> {
        let mut v = vec![0i16; KYBER_N];
        for i in 0..KYBER_K {
            let prod = self.poly_mul(&t[i], &r[i]);
            for k in 0..KYBER_N { v[k] = (v[k] + prod[k]) % KYBER_Q as i16; }
        }
        for k in 0..KYBER_N {
            v[k] = (v[k] + e2[k]) % KYBER_Q as i16;
            let m_val = ((m[k / 8] >> (k % 8)) & 1) as i16 * (KYBER_Q as i16 / 2);
            v[k] = (v[k] + m_val) % KYBER_Q as i16;
        }
        v
    }

    fn compute_message(&self, s: &[Vec<i16>], u: &[Vec<i16>], v: &[i16]) -> Vec<i16> {
        let mut m = v.to_vec();
        for i in 0..KYBER_K {
            let prod = self.poly_mul(&s[i], &u[i]);
            for k in 0..KYBER_N {
                m[k] = (m[k] - prod[k]) % KYBER_Q as i16;
                if m[k] < 0 { m[k] += KYBER_Q as i16; }
            }
        }
        m
    }

    fn poly_mul(&self, a: &[i16], b: &[i16]) -> Vec<i16> {
        let mut c = vec![0i16; KYBER_N];
        for i in 0..KYBER_N {
            for j in 0..KYBER_N {
                let idx = (i + j) % KYBER_N;
                let sign = if i + j < KYBER_N { 1 } else { -1 };
                c[idx] = (c[idx] + sign * a[i] * b[j]) % KYBER_Q as i16;
            }
        }
        c
    }

    fn serialize_public_key(&self, t: &[Vec<i16>], rho: &[u8]) -> Vec<u8> {
        let mut bytes = Vec::with_capacity(KYBER_PUBLIC_KEY_BYTES);
        for ti in t { bytes.extend_from_slice(&self.compress_poly(ti, 11)); }
        bytes.extend_from_slice(rho);
        bytes
    }

    fn deserialize_public_key(&self, bytes: &[u8]) -> Option<(Vec<Vec<i16>>, &[u8])> {
        let t_len = KYBER_K * KYBER_N * 11 / 8;
        let t_compressed = &bytes[0..t_len];
        let rho = &bytes[t_len..t_len + 32];
        let mut t = Vec::with_capacity(KYBER_K);
        for i in 0..KYBER_K {
            let start = i * KYBER_N * 11 / 8;
            let end = start + KYBER_N * 11 / 8;
            t.push(self.decompress_poly(&t_compressed[start..end], 11));
        }
        Some((t, rho))
    }

    fn serialize_secret_key(&self, s: &[Vec<i16>], pk: &[u8], z: &[u8; 32]) -> Vec<u8> {
        let mut bytes = Vec::with_capacity(KYBER_SECRET_KEY_BYTES);
        for si in s { bytes.extend_from_slice(&self.compress_poly(si, 12)); }
        bytes.extend_from_slice(pk);
        let mut hasher = Sha256::new();
        hasher.update(pk);
        bytes.extend_from_slice(&hasher.finalize());
        bytes.extend_from_slice(z);
        bytes
    }

    fn deserialize_secret_key(&self, bytes: &[u8]) -> Option<(Vec<Vec<i16>>, Vec<u8>, Vec<u8>, [u8; 32])> {
        let s_len = KYBER_K * KYBER_N * 12 / 8;
        let pk_start = s_len;
        let h_pk_start = pk_start + KYBER_PUBLIC_KEY_BYTES;
        let z_start = h_pk_start + 32;
        let s_compressed = &bytes[0..s_len];
        let pk = bytes[pk_start..h_pk_start].to_vec();
        let h_pk = bytes[h_pk_start..z_start].to_vec();
        let z: [u8; 32] = bytes[z_start..z_start + 32].try_into().ok()?;
        let mut s = Vec::with_capacity(KYBER_K);
        for i in 0..KYBER_K {
            let start = i * KYBER_N * 12 / 8;
            let end = start + KYBER_N * 12 / 8;
            s.push(self.decompress_poly(&s_compressed[start..end], 12));
        }
        Some((s, pk, h_pk, z))
    }

    fn compress_poly(&self, poly: &[i16], d: u8) -> Vec<u8> {
        let mut compressed = vec![0u8; KYBER_N * d as usize / 8];
        for (i, coeff) in poly.iter().enumerate() {
            let c = ((*coeff as u16) << d) / KYBER_Q as u16;
            let bit_pos = i * d as usize;
            let byte_pos = bit_pos / 8;
            if byte_pos < compressed.len() {
                compressed[byte_pos] |= (c as u8);
            }
        }
        compressed
    }

    fn decompress_poly(&self, bytes: &[u8], d: u8) -> Vec<i16> {
        let mut poly = vec![0i16; KYBER_N];
        let mask = (1u16 << d) - 1;
        for i in 0..KYBER_N {
            let bit_pos = i * d as usize;
            let byte_pos = bit_pos / 8;
            if byte_pos < bytes.len() {
                let c = (bytes[byte_pos] as u16) & mask;
                poly[i] = ((c as u32 * KYBER_Q as u32) >> d) as i16;
            }
        }
        poly
    }

    fn compress_vec(&self, vec: &[Vec<i16>], d: u8) -> Vec<u8> {
        let mut compressed = Vec::with_capacity(KYBER_K * KYBER_N * d as usize / 8);
        for poly in vec { compressed.extend_from_slice(&self.compress_poly(poly, d)); }
        compressed
    }

    fn decompress_vec(&self, bytes: &[u8], d: u8) -> Vec<Vec<i16>> {
        let poly_size = KYBER_N * d as usize / 8;
        (0..KYBER_K).map(|i| self.decompress_poly(&bytes[i * poly_size..(i + 1) * poly_size], d)).collect()
    }

    fn random_bytes(&self, len: usize) -> Vec<u8> {
        let mut bytes = vec![0u8; len];
        rand::thread_rng().fill_bytes(&mut bytes);
        bytes
    }
}

impl Default for Kyber768 {
    fn default() -> Self { Self::new() }
}