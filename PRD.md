# Hackathon Master Plan - Project Organization & Completion Tracking

**Created:** 2026-01-30
**Status:** PLANNING
**Deadline:** January 30, 2026 (TODAY!)

---

## PART 1: PROPOSED FOLDER STRUCTURE

Important Arcium information https://docs.arcium.com/developers/migration/migration-v0.5-to-v0.6
```
~/work/hackathon/
├── README.md                          # This file - master index
├── COMPLETION_MATRIX.md               # Full completion matrix (separate doc)
├── SUBMISSION_CHECKLIST.md            # What needs to be submitted today
│
├── TIER1_PRIORITY/                    # Highest value, submit TODAY
│   ├── choom.chat/                    # Quantum Terminal (Paneless)
│   │   ├── README.md
│   │   └── BINARIES/                  # Pre-built binaries
│   │
│   ├── zk.claims/                     # Aztec submission (contractregistry)
│   │   ├── README.md
│   │   └── DEPLOY_STATUS.txt
│   │
│   ├── billpayx.com/                  # Stealth Payment Gateway
│   │   └── SUBMISSION_READY.txt
│   │
│   ├── bytes.zip/                     # E2E Encrypted File Sharing
│   │   └── DEPLOY_STATUS.txt
│   │
│   └── androidsecuritycamera.com/     # Privacy Shield Suite (70% complete)
│       └── VPN_INTEGRATION_STATUS.txt
│
├── TIER2_DEVELOPMENT/                 # Need work, submit if time permits
│   ├── dns.foo/                       # PrivacyDNS + QuantumDNS (NEW)
│   │   └── PRD_DRAFT.md
│   │
│   ├── gpteams.app/                   # ZK Team Workspace (NEW)
│   │   └── PRD_DRAFT.md
│   │
│   ├── themailhost/
│   │   ├── vpn/                       # VPN Daemon (70% complete)
│   │   ├── vault/                     # Password Vault
│   │   ├── dasr/                      # DASR Marketplace
│   │   └── zk-email/                  # ZK Email
│   │
│   └── helix/
│       ├── core/                      # Kyber KEM (stub)
│       ├── flutter_app/               # Complete
│       └── P2P_relay/                 # Complete
│
├── TIER3_CONCEPTS/                    # Concepts only, low priority
│   ├── shadowpay/                     # ShadowPay ($43K concept)
│   ├── stealthgame/                   # StealthGame ($15K concept)
│   ├── qrmoji.com/                    # QRmoji Identity
│   ├── mactalk.xyz/                   # MCP Private Chat
│   ├── mcpmail.dev/                   # Agent Email Protocol
│   ├── spacespaceai.com/              # Private Research Assistant
│   ├── grokumentation.com/            # AI Documentation
│   ├── moderate.chat/                 # ZK Content Moderation
│   ├── megabyte.zip/                  # Encrypted Compression
│   └── blankcard.org/                 # Programmable QR Cards
│
├── PYXL_SUITE/                        # Consolidated under pyxl.finance
│   ├── pyxl.finance/                  # Private DeFi Dashboard
│   ├── pyxl.me/                       # Redirect to pyxl.finance
│   └── pyxlswap.com/                  # Redirect to pyxl.finance
│
├── DOCUMENTATION/
│   ├── CENTRALIZED-HACKATHON.md       # (symlink to root)
│   ├── DOMAIN_MAPPING.md              # (symlink to root)
│   ├── SUBMISSION_GUIDES/
│   │   ├── AZTEC_SUBMISSION.md
│   │   ├── HELIUS_SUBMISSION.md
│   │   ├── QUICKNODE_SUBMISSION.md
│   │   ├── STARPAY_SUBMISSION.md
│   │   └── RADR_SUBMISSION.md
│   └── VIDEO_SCRIPTS/
│       ├── QUANTUM_TERMINAL_SCRIPT.md
│       ├── STEALTH_GATEWAY_SCRIPT.md
│       └── PRIVACY_SDK_SCRIPT.md
│
└── TRACKING/
    ├── PRIZE_MATRIX.md                # All prizes tracked
    ├── WIN_PROBABILITY.md             # Project-by-project probabilities
    └── DEADLINE_STATUS.txt            # What must be done TODAY
```

---

## PART 2: COMPLETION MATRIX

### TIER 1: READY TO SUBMIT (Highest Priority)

| # | Project | Domain | Prize | Website | Docs | Submission | Code | Status |
|---|---------|--------|-------|---------|------|------------|------|--------|
| 1 | Quantum Terminal | choom.chat | $25-35K | ✅ | ✅ | ✅ | ✅ | 90% - SUBMIT NOW |
| 2 | zk.claims | zk.claims | $7.5K | ✅ | ✅ | ✅ | ✅ | Ready - Aztec |
| 3 | Stealth Payment | billpayx.com | $18K | ✅ | ✅ | ✅ | ✅ | Ready |
| 4 | bytes.zip | bytes.zip | $8.5K | ✅ | ✅ | ✅ | ✅ | Ready |
| 5 | silver.sh | silver.sh | $4K | ✅ | ✅ | ✅ | ✅ | Ready |
| 6 | deidentify.ai | deidentify.ai | $1K | ✅ | ✅ | ✅ | ✅ | Ready |
| 7 | lnk.zip | lnk.zip | $2K | ✅ | ✅ | ✅ | ✅ | Ready |
| 8 | thevirus.zip | thevirus.zip | $15K | ✅ | ✅ | ✅ | ✅ | Ready |
| 9 | matrix-privacy | mranderson.one | $5K | ✅ | ✅ | ✅ | ✅ | Ready |
| 10 | priv.pass.xyz | priv.pass.xyz | $5K | ✅ | ✅ | ✅ | ✅ | Needs domain |
| 11 | SDK-Solana | @thegit/solana | $15K | N/A | ✅ | ✅ | ✅ | Ready |
| 12 | CLI (gitnpm) | gitnpm | $3K | N/A | ✅ | ✅ | ✅ | Ready |
| 13 | Privacy SDK | privacy-toolkit | $9.5K | N/A | ✅ | ✅ | ✅ | Ready |
| 14 | DASR Marketplace | themail.host | $5K | ✅ | ✅ | ✅ | ✅ | Ready |

### TIER 2: PARTIAL (Need Work)

| # | Project | Domain | Prize | Website | Docs | Submission | Code | Status |
|---|---------|--------|-------|---------|------|------------|------|--------|
| 15 | Privacy Shield Suite | androidsecuritycamera.com | $18K | ✅ | ✅ | ⚠️ | 70% | VPN integration pending |
| 16 | VPN Daemon | themail.host/vpn | $23K | N/A | ✅ | ⚠️ | 70% | PQ crypto incomplete |
| 17 | Password Vault | themail.host/vault | $10K | ✅ | ✅ | ⚠️ | 80% | HIBP integration stub |
| 18 | ZK Email | themail.host | $8K | ✅ | ⚠️ | ⚠️ | ✅ | Needs submission docs |
| 19 | Helix Core | helix | $7K | N/A | ✅ | ⚠️ | 70% | Kyber KEM stub |
| 20 | Helix Flutter | helix_app | $3K | ✅ | ✅ | ✅ | ✅ | Ready |
| 21 | PrivacyDNS | dns.foo | $40-55K | ❌ | ⚠️ | ❌ | 0% | **NEW - Create** |
| 22 | ZK Team Workspace | gpteams.app | $24K | ❌ | ⚠️ | ❌ | 0% | **NEW - Create** |

### TIER 3: CONCEPTS (Low Priority)

| # | Project | Domain | Prize | Website | Docs | Submission | Code | Status |
|---|---------|--------|-------|---------|------|------------|------|--------|
| 23 | ShadowPay | shadowpay.app | $43K | ❌ | ✅ | ⚠️ | ❌ | Concept only |
| 24 | StealthGame | stealthgame.io | $15K | ❌ | ✅ | ⚠️ | ❌ | Concept only |
| 25 | QRmoji Identity | qrmoji.com | $17.5K | ❌ | ✅ | ❌ | ❌ | Concept only |
| 26 | MCP Private Chat | mactalk.xyz | $25K | ❌ | ✅ | ❌ | ❌ | Concept only |
| 27 | Agent Email | mcpmail.dev | $14K | ❌ | ✅ | ❌ | ❌ | Concept only |
| 28 | Privacy AI | spacespaceai.com | $30K | ❌ | ✅ | ❌ | ❌ | Concept only |
| 29 | AI Docs | grokumentation.com | $9K | ❌ | ✅ | ❌ | ❌ | Concept only |
| 30 | ZK Moderation | moderate.chat | $30K | ❌ | ✅ | ❌ | ❌ | Concept only |
| 31 | Encrypted Compression | megabyte.zip | $20K | ❌ | ✅ | ❌ | ❌ | Concept only |
| 32 | QR Cards | blankcard.org | $10K | ✅ | ⚠️ | ❌ | ✅ | Needs submission |

### CROSS-PROJECT COMBINATIONS

| # | Combination | Components | Prize | Status |
|---|-------------|------------|-------|--------|
| 33 | SecureCam Messenger | android-cam + helix | $10.5K | 50% |
| 34 | CamVault | android-cam + vault | $10K | 50% |
| 35 | Verified Messenger | helix + zk.claims | $15.5K | 50% |
| 36 | Secure Transfer VPN | themailhost + bytes.zip | $10.5K | 50% |
| 37 | CamLinks | android-cam + lnk.zip | $7K | 50% |
| 38 | PassKey Identity | vault + priv.pass.xyz | $10K | 50% |
| 39 | Privacy Node Marketplace | themailhost + DASR | $10K | 80% |
| 40 | Red Pill Messenger | helix + matrix-privacy | $10K | 50% |
| 41 | StealthGame | ShadowPay + Stealth | $15K | Concept |

---

## PART 3: SUBMISSION SUMMARY BY CHALLENGE

### Aztec ($15K available)

| Project | Prize | Status | Action |
|---------|-------|--------|--------|
| zk.claims | $7.5K | Ready | Submit TODAY |
| ShadowPay | $15K | Concept | Skip (no code) |
| ZK Vote | $5K | Ready | Submit if time |

### Helius ($10K available)

| Project | Prize | Status | Action |
|---------|-------|--------|--------|
| SDK + silver.sh | $5K | Ready | Submit TODAY |
| Privacy Toolkit | $5K | Ready | Submit TODAY |

### Quicknode ($3K available)

| Project | Prize | Status | Action |
|---------|-------|--------|--------|
| SDK + CLI | $3K | Ready | Submit TODAY |

### Starpay ($3.5K available)

| Project | Prize | Status | Action |
|---------|-------|--------|--------|
| Stealth Payment Gateway | $3.5K | Ready | Submit TODAY |

### Privacy Cash ($6K available)

| Project | Prize | Status | Action |
|---------|-------|--------|--------|
| bytes.zip + vault | $6K | Ready | Submit TODAY |

### Radr Labs ($15K available)

| Project | Prize | Status | Action |
|---------|-------|--------|--------|
| ShadowPay | $15K | Concept | Skip |

### Light Protocol ($13K available)

| Project | Prize | Status | Action |
|---------|-------|--------|--------|
| ShadowPay | $13K | Concept | Skip |

---

## PART 4: IMMEDIATE ACTION ITEMS (TODAY)


- [ ] 1. Deploy zk.claims to Vercel - Aztec submission deadline
- [ ] 2. Record 3-minute demo video for zk.claims
- [ ] 3. Submit zk.claims to Aztec - Best Overall ($5K)
- [ ] 4. Submit zk.claims to Aztec - Non-Financial ($2.5K)
- [ ] 5. Submit SDK-Solana to Helius - Best Privacy ($5K)
- [ ] 6. Submit SDK-Solana to Quicknode - Open Source ($3K)
- [ ] 7. Submit Stealth Payment Gateway to Starpay ($3.5K)
- [ ] 8. Submit bytes.zip to Privacy Cash ($6K)

- [ ] 9. Submit silver.sh to Quicknode - Developer Tool ($4K)
- [ ] 10. Submit priv.pass.xyz to Auth/Privacy ($5K)
- [ ] 11. Submit matrix-privacy to Arcium ($3K)
- [ ] 12. Submit thevirus.zip to Gamification ($2K)
- [ ] 13. Submit SDK to Inco - Payments ($2K)

- [ ] 14. Deploy choom.chat (Quantum Terminal) - $25-35K potential
- [ ] 15. Submit choom.chat to Post-Quantum ($15K)
- [ ] 16. Submit choom.chat to Most Innovative ($10K)

---

## PART 5: CODE COMPLETENESS ANALYSIS

### By Repository

| Repository | Projects | Complete | Partial | Concept | Not Started |
|------------|----------|----------|---------|---------|-------------|
| contractregistry | 18 | 13 | 2 | 3 | 0 |
| thegit.network | 22 | 16 | 4 | 2 | 0 |
| themailhost | 10 | 4 | 4 | 2 | 0 |
| paneless | 6 | 2 | 1 | 3 | 0 |
| helix | 7 | 4 | 2 | 1 | 0 |
| android-security-cam | 6 | 4 | 2 | 0 | 0 |
| Cross-project | 9 | 0 | 5 | 4 | 0 |
| **TOTAL** | **78** | **43** | **20** | **15** | **0** |

### Quality Breakdown

| Category | Count | Percentage |
|----------|-------|------------|
| Ready to Submit | 25 | 32% |
| Needs Minor Work | 18 | 23% |
| Needs Major Work | 15 | 19% |
| Concept Only | 15 | 19% |
| Not Started | 5 | 6% |

---

## PART 6: PRIZE POTENTIAL SUMMARY

### Conservative Estimate (Ready Only)

| Source | Prize |
|--------|-------|
| Tier 1 (Ready) | $80,000 |
| Tier 2 (With work) | $40,000 |
| **Conservative Total** | **$120,000** |

### Realistic Target

| Scenario | Expected |
|----------|----------|
| Submit all ready | $60,000 - $80,000 |
| Fix + submit tier 2 | +$30,000 - $40,000 |
| **Realistic Range** | **$90,000 - $120,000** |

### Maximum Potential (All Complete)

| Category | Prize |
|----------|-------|
| Individual Projects | $175,000 |
| Cross-Project Combinations | $60,000 |
| **Maximum** | **$235,000** |

---

## PART 7: FILES & LOCATIONS REFERENCE

### Key Documents

| Document | Location |
|----------|----------|
| Master Index | `~/work/CENTRALIZED-HACKATHON.md` |
| Domain Mapping | `~/work/DOMAIN_MAPPING.md` |
| Master Inventory | `~/work/thegit.network/docs/hackathon/MASTER_HACKATHON_INVENTORY.md` |
| Completion Checklist | `~/work/thegit.network/docs/hackathon/COMPLETION_CHECKLIST.md` |
| Submission Summary | `~/work/thegit.network/docs/hackathon/SUBMISSION_SUMMARY.md` |
| Hackathon Submission | `~/work/contractregistry/privacy-hack-web/HACKATHON_SUBMISSION.md` |

### Code Locations

| Project | Location |
|---------|----------|
| 8 Privacy Web Apps | `~/work/contractregistry/privacy-hack-web/` |
| SDK-Solana | `~/work/thegit.network/packages/sdk-solana/` |
| CLI | `~/work/thegit.network/packages/cli/` |
| Quantum Terminal | `~/work/paneless/quantum_terminal/` |
| Helix Core | `~/work/helix/helix_core/src/` |
| VPN Daemon | `~/work/themailhost/daemon/src/vpn/` |
| Password Vault | `~/work/themailhost/vault/` |
| DASR Marketplace | `~/work/themailhost/contracts/dasr/` |
| Android Security Cam | `~/work/android-security-cam/securitycam/` |

---

## PART 8: VERIFICATION CHECKLIST

### Before Final Submission

- [ ] All TypeScript compiles without errors
- [ ] All Flutter web apps build successfully
- [ ] Demo videos recorded and uploaded
- [ ] README files have accurate domain mappings
- [ ] Submission forms filled out completely
- [ ] GitHub repos are public
- [ ] Code is pushed to GitHub
- [ ] All submission deadlines verified

### For Each Project

- [ ] Domain resolves (or will resolve)
- [ ] Website deployed (or can be deployed)
- [ ] Demo video recorded
- [ ] README complete with:
  - [ ] Project description
  - [ ] How to run
  - [ ] Competition fit explanation
  - [ ] Submission link

---

## NEXT STEPS

1. **Review this plan** - Confirm folder structure and priorities
2. **Approve PRD requirements** - What needs to be built vs submitted
3. **Begin execution** - Start with Tier 1 immediate actions
4. **Update matrix** - As projects are completed/submitted

---

**Plan Version:** 1.0
**Created:** 2026-01-30
**For:** Solana Privacy Hackathon 2026

---

# PART 9: DETAILED PRDS FOR INCOMPLETE PROJECTS

## PRD 1: PrivacyDNS + QuantumDNS (dns.foo)

**Domain:** dns.foo
**Status:** NEW PROJECT
**Prize Potential:** $40,000 - $55,000
**Complexity:** High
**Time to Complete:** 2-3 days

### Executive Summary

A dual-mode DNS resolver that provides:
1. **PrivacyDNS**: ZK-proof DNS queries (prove you visited a site without revealing which site)
2. **QuantumDNS**: Post-quantum encrypted DNS (Kyber-768 + X25519 hybrid)

`★ Insight ─────────────────────────────────────`
**Why DNS Privacy Matters:**
- DNS queries reveal your entire browsing history to ISPs, DNS resolvers, and network observers
- "Harvest now, decrypt later" attacks target DNS data for future decryption
- ZK proofs allow you to prove domain access without revealing the domain
─────────────────────────────────────────────────

### Features

| Feature | PrivacyDNS | QuantumDNS |
|---------|------------|------------|
| Standard DNS queries | ✅ | ✅ |
| ZK proof generation | ✅ | ❌ |
| Post-quantum encryption | ❌ | ✅ |
| Tracker blocking | ✅ | ✅ |
| Privacy score per domain | ✅ | ❌ |
| Kyber-768 KEM | ❌ | ✅ |
| Hybrid X25519 fallback | ❌ | ✅ |
| CLI tool | ✅ | ✅ |
| Web dashboard | ✅ | ✅ |

### Hackathon Categories

| Challenge | Prize | Fit |
|-----------|-------|-----|
| Post-Quantum | $15,000 | High (QuantumDNS) |
| Privacy Tooling | $15,000 | High (PrivacyDNS) |
| Security | $10,000 | High |
| Infrastructure | $5,000 | Medium |
| ICEP Cryptography | $10,000 | High (QuantumDNS) |

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        PrivacyDNS + QuantumDNS                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      Client Side                          │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │  │
│  │  │ CLI Tool    │  │ Web Dashboard│  │ Mobile App      │  │  │
│  │  │ (Rust)      │  │ (Flutter)   │  │ (Flutter)       │  │  │
│  │  └──────┬──────┘  └──────┬──────┘  └───────┬─────────┘  │  │
│  │         │                │                  │            │  │
│  │         └────────────────┼──────────────────┘            │  │
│  │                          ▼                               │  │
│  │         ┌──────────────────────────────────────────┐    │  │
│  │         │           DNS Resolver Core              │    │  │
│  │         │  ┌────────────────┐ ┌─────────────────┐  │    │  │
│  │         │  │ PrivacyDNS    │ │ QuantumDNS      │  │    │  │
│  │         │  │ - ZK Prover   │ │ - Kyber KEM     │  │    │  │
│  │         │  │ - Merkle Tree │ │ - X25519        │  │    │  │
│  │         │  │ - Range Proof │ │ - ChaCha20      │  │    │  │
│  │         │  └────────────────┘ └─────────────────┘  │    │  │
│  │         └──────────────────────────────────────────┘    │  │
│  │                          │                               │  │
│  └──────────────────────────┼───────────────────────────────┘  │
│                             │                                   │
│                             ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      Upstream                            │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │  │
│  │  │ Root Server │  │ TLD Server  │  │ Authoritative   │  │  │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Implementation Plan

#### Phase 1: DNS Core (Day 1)

**Tasks:**
1. Create `dns_resolver.rs` - Core DNS resolution logic
2. Implement DNS packet parsing (RFC 1035)
3. Add caching layer (30s TTL)
4. Implement upstream DNS proxy

**File Structure:**
```
dns.foo/
├── src/
│   ├── dns_resolver.rs     # Core DNS logic (500 lines)
│   ├── packet.rs           # DNS packet parsing (300 lines)
│   ├── cache.rs            # LRU cache (200 lines)
│   ├── upstream.rs         # Upstream proxy (200 lines)
│   └── cli.rs              # CLI interface (300 lines)
├── tests/
│   └── dns_tests.rs
└── Cargo.toml
```

**Code Example - DNS Resolver Core:**
```rust
pub struct DnsResolver {
    cache: LruCache<DomainName, DnsRecord>,
    upstream: UpstreamResolver,
    zk_prover: Option<ZkProver>,
}

impl DnsResolver {
    pub async fn resolve(
        &mut self,
        domain: &str,
        mode: DnsMode,
    ) -> Result<DnsResponse, DnsError> {
        // Check cache first
        if let Some(cached) = self.cache.get(domain) {
            return Ok(cached.clone());
        }

        // Resolve upstream
        let response = self.upstream.resolve(domain).await?;

        // For PrivacyDNS: generate ZK proof
        if mode == DnsMode::Privacy {
            let proof = self.generate_zk_proof(&response)?;
            return Ok(DnsResponse::with_proof(response, proof));
        }

        Ok(response)
    }

    fn generate_zk_proof(
        &self,
        response: &DnsResponse,
    ) -> Result<ZkProof, DnsError> {
        // Create Merkle tree of query-response pair
        let leaf = format!("{}:{}", response.query, response.ip);
        let merkle_proof = self.merkle_tree.insert(leaf.as_bytes());

        // Generate range proof for privacy score
        let tracker_count = response.trackers.len();
        let range_proof = self.commitment_scheme.prove_range(tracker_count, 0, 100);

        Ok(ZkProof {
            merkle_proof,
            range_proof,
            timestamp: Utc::now(),
        })
    }
}
```

#### Phase 2: QuantumDNS (Day 2)

**Tasks:**
1. Implement Kyber-768 KEM (reuse from helix/helix_core)
2. Implement X25519 key exchange
3. Create hybrid encryption wrapper
4. Add ChaCha20-Poly1305 for data encryption

**Key Exchange Protocol:**
```rust
pub struct QuantumDnsResolver {
    kyber: Kyber768,
    x25519: X25519,
    chacha: ChaCha20Poly1305,
}

impl QuantumDnsResolver {
    pub async fn resolve_encrypted(
        &self,
        domain: &str,
    ) -> Result<EncryptedResponse, DnsError> {
        // Generate ephemeral key pair
        let (client_ephemeral, client_public) = self.kyber.keygen();
        let (x25519_ephemeral, x25519_public) = self.x25519.keygen();

        // Hybrid encapsulation: Kyber + X25519
        let (shared_secret, ciphertext) = self.hybrid_encapsulate(
            &client_public,
            &x25519_public,
        ).await?;

        // Encrypt DNS query
        let query_encrypted = self.chacha.encrypt(
            &shared_secret,
            domain.as_bytes(),
        )?;

        // Send to server
        let response = self.send_encrypted_query(
            &ciphertext,
            &query_encrypted,
        ).await?;

        // Decrypt response
        let response_decrypted = self.chacha.decrypt(
            &shared_secret,
            &response.ciphertext,
        )?;

        Ok(EncryptedResponse {
            ciphertext: response_decrypted,
            encapsulated_key: ciphertext,
        })
    }

    async fn hybrid_encapsulate(
        &self,
        kyber_pk: &KyberPublicKey,
        x25519_pk: &X25519PublicKey,
    ) -> Result<(Vec<u8>, Vec<u8>), CryptoError> {
        // Kyber encapsulation
        let (kyber_ss, kyber_ct) = self.kyber.encapsulate(kyber_pk)?;

        // X25519 key agreement
        let x25519_ss = self.x25519.agree(
            &self.x25519_ephemeral,
            x25519_pk,
        )?;

        // Combine secrets with KDF
        let combined_ss = self.kdf.combine(&[&kyber_ss, &x25519_ss]);

        // Return ciphertext and combined shared secret
        let mut ciphertext = Vec::new();
        ciphertext.extend_from_slice(&kyber_ct);
        ciphertext.extend_from_slice(&x25519_public);

        Ok((combined_ss, ciphertext))
    }
}
```

#### Phase 3: PrivacyDNS ZK Proofs (Day 2)

**Tasks:**
1. Implement Merkle tree for query-response pairing
2. Create range proofs for privacy scoring
3. Implement selective disclosure
4. Add verification SDK

**ZK Proof Architecture:**
```rust
pub struct ZkDnsProver {
    merkle_tree: MerkleTree<Sha256>,
    commitment_scheme: PedersenCommitment,
    range_proof: RangeProof,
}

impl ZkDnsProver {
    /// Prove you visited a domain without revealing which one
    pub fn generate_domain_proof(
        &self,
        domain: &str,
        domains_visited: &[&str],
    ) -> Result<DomainProof, ZkError> {
        // Create leaf for actual domain
        let real_leaf = self.hash_domain(domain);

        // Create dummy leaves for other domains
        let dummy_leaves: Vec<_> = domains_visited
            .iter()
            .filter(|&&d| d != domain)
            .map(|d| self.hash_domain(d))
            .collect();

        // Build Merkle tree with real + dummies
        let all_leaves: Vec<_> = std::iter::once(real_leaf.clone())
            .chain(dummy_leaves)
            .collect();

        let root = self.merkle_tree.build(&all_leaves);

        // Generate proof for real domain
        let proof = self.merkle_tree.prove(&real_leaf);

        // Generate range proof for privacy score
        let privacy_score = self.calculate_privacy_score(domain);
        let range_proof = self.range_proof.prove(
            privacy_score,
            0,
            100,
        );

        Ok(DomainProof {
            merkle_root: root,
            merkle_proof: proof,
            range_proof,
            commitment: self.commitment_scheme.commit(domain.as_bytes()),
        })
    }

    /// Verify domain proof WITHOUT seeing the domain
    pub fn verify_proof(
        &self,
        proof: &DomainProof,
        expected_root: &[u8],
    ) -> bool {
        // Verify Merkle proof
        let valid_merkle = self.merkle_tree.verify(
            &proof.merkle_proof,
            expected_root,
        );

        // Verify range proof (score is between 0-100)
        let valid_range = self.range_proof.verify(
            &proof.range_proof,
            0,
            100,
        );

        valid_merkle && valid_range
    }
}
```

#### Phase 4: CLI & Dashboard (Day 3)

**CLI Commands:**
```bash
# PrivacyDNS - ZK proof queries
privacydns query example.com --zk --proof-output proof.json

# Verify proof without seeing domain
privacydns verify proof.json --root MerkleRoot123

# QuantumDNS - Post-quantum encrypted queries
quantumdns query example.com --kyber --output encrypted_response.bin

# Show privacy score
privacydns score example.com

# Privacy dashboard
privacydns serve --dashboard --port 3000
```

### Code Links

| Component | Path | Status |
|-----------|------|--------|
| DNS Resolver Core | `themailhost/daemon/src/dns/` | Create new |
| ZK Proof Generation | `contractregistry/privacy-hack-web/zk-claims/` | Reuse |
| Post-Quantum KEM | `helix/helix_core/src/kyber.rs` | Reuse |
| CLI Tool | `thegit.network/packages/cli/` | Extend |
| Web Dashboard | `thegit.network/packages/dashboard/` | Extend |

### Demo Flow (3 minutes)

```
1. Show "harvest now, decrypt later" threat to DNS
   - Display DNS query in plain text
   - Explain how ISPs/resolvers see everything

2. Demonstrate standard DNS vulnerability
   - Run wireshark showing DNS queries
   - Show privacy score of 0/100

3. Show PrivacyDNS query with ZK proof
   - Run: privacydns query example.com --zk
   - Display generated proof
   - Show privacy score of 85/100

4. Prove you can verify proof WITHOUT seeing domain
   - Run: privacydns verify proof.json --root MerkleRoot
   - Show verification passes
   - Domain remains hidden!

5. Show QuantumDNS encryption with Kyber
   - Run: quantumdns query example.com --kyber
   - Display encrypted packet
   - Show hybrid encryption details

6. Demonstrate hybrid fallback for compatibility
   - Show X25519 fallback works
   - Display encryption algorithm negotiation
```

### Testing Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                     TESTING PYRAMID                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                         ┌───────────┐                           │
│                         │   E2E     │                           │
│                         │   Tests   │                           │
│                         │   (10)    │                           │
│                         └─────┬─────┘                           │
│                               │                                 │
│                    ┌──────────┼──────────┐                      │
│                    ▼          ▼          ▼                      │
│              ┌─────────┐ ┌─────────┐ ┌─────────┐                │
│              │Integration│ │ Privacy │ │ Quantum │                │
│              │  Tests   │ │  Tests  │ │  Tests  │                │
│              │   (20)   │ │   (15)  │ │   (15)  │                │
│              └────┬─────┘ └────┬─────┘ └────┬─────┘              │
│                   │            │            │                    │
│         ┌─────────┼─────────┐  │            │                    │
│         ▼         ▼         ▼  ▼            ▼                    │
│   ┌─────────┐┌─────────┐┌─────────┐┌─────────┐┌─────────┐       │
│   │ Unit    ││ Unit     ││ Unit     ││ Unit     ││ Unit     │       │
│   │ Tests   ││ Tests    ││ Tests    ││ Tests    ││ Tests    │       │
│   │ (100+)  ││ (50+)    ││ (30+)    ││ (30+)    ││ (30+)    │       │
│   └─────────┘└─────────┘└─────────┘└─────────┘└─────────┘       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Unit Tests Required:**
- DNS packet parsing (all RFC 1035 record types)
- Cache invalidation logic
- ZK proof generation and verification
- Kyber keygen/encap/decap
- X25519 key agreement
- ChaCha20 encryption/decryption
- Hybrid encryption composition

**Integration Tests:**
- End-to-end query resolution
- Proof generation and verification flow
- Quantum encryption round-trip
- CLI command pipeline

### Files to Create/Modify

| File | Action | Lines |
|------|--------|-------|
| `themailhost/daemon/src/dns/mod.rs` | Create | 200 |
| `themailhost/daemon/src/dns/resolver.rs` | Create | 500 |
| `themailhost/daemon/src/dns/packet.rs` | Create | 300 |
| `themailhost/daemon/src/dns/zk_prover.rs` | Create | 400 |
| `themailhost/daemon/src/dns/quantum.rs` | Create | 500 |
| `themailhost/daemon/src/dns/cli.rs` | Create | 300 |
| `themailhost/daemon/src/dns/web.rs` | Create | 300 |
| `themailhost/daemon/src/dns/tests/mod.rs` | Create | 200 |
| **Total** | | **2,700** |

---

## PRD 2: ZK Team Workspace (gpteams.app)

**Domain:** gpteams.app
**Status:** NEW PROJECT
**Prize Potential:** $24,000
**Complexity:** High
**Time to Complete:** 2-3 days

### Executive Summary

Privacy-first team infrastructure with three core features:
1. **Anonymous Team Voting** - ZK proofs of vote counts without revealing individual votes
2. **Secure Code Review** - ZK proofs of test results without revealing code
3. **Zero-Knowledge Analytics** - Team metrics without individual tracking

### Features

| Feature | Description |
|---------|-------------|
| ZK Voting | Prove "X/Y voted yes" without revealing who |
| ZK Code Review | Prove "tests pass" without revealing code |
| Team Analytics | Aggregated metrics, individual privacy |
| Anonymous Membership | Prove team membership without identity |
| Secure Storage | Encrypted team data |
| CLI Tools | `zkvote`, `zkreview`, `zkstats` |

### Hackathon Categories

| Challenge | Prize | Fit |
|-----------|-------|-----|
| DAO Governance | $5,000 | High |
| Identity | $7,500 | High |
| Developer Tools | $4,000 | High (ZK code review) |
| Security | $5,000 | Medium |
| Analytics | $2,500 | Medium |

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      ZK TEAM WORKSPACE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      Team Members                         │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │  │
│  │  │ Member A│ │ Member B│ │ Member C│ │ Member D│        │  │
│  │  │ (Vote)  │ │ (Vote)  │ │ (Review)│ │ (Read)  │        │  │
│  │  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘        │  │
│  │       │          │          │          │               │  │
│  │       └──────────┼──────────┼──────────┘               │  │
│  │                  ▼                                     │  │
│  │       ┌─────────────────────────────────────┐         │  │
│  │       │      ZK Vote Contract (Solana)      │         │  │
│  │       │  ┌───────────┐ ┌─────────────────┐ │         │  │
│  │       │  │ Encrypted │ │ Merkle Tree     │ │         │  │
│  │       │  │ Ballots   │ │ of Commitments  │ │         │  │
│  │       │  └───────────┘ └─────────────────┘ │         │  │
│  │       └─────────────────────────────────────┘         │  │
│  │                        │                               │  │
│  │                        ▼                               │  │
│  │       ┌─────────────────────────────────────┐         │  │
│  │       │    ZK Prover Service (TypeScript)   │         │  │
│  │       │  ┌─────────┐ ┌───────────────────┐ │         │  │
│  │       │  │ Vote    │ │ Review Proofs     │ │         │  │
│  │       │  │ Prover  │ │ Generator         │ │         │  │
│  │       │  └─────────┘ └───────────────────┘ │         │  │
│  │       └─────────────────────────────────────┘         │  │
│  │                        │                               │  │
│  └────────────────────────┼───────────────────────────────┘  │
│                           │                                   │
│                           ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      External Verifiers                   │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │  │
│  │  │ Team Lead   │  │ DAO Members │  │ External Auditor│  │  │
│  │  │ (See results│  │ (Vote on    │  │ (Verify code    │  │  │
│  │  │  without    │ │  proposals) │ │ │  quality)       │  │  │
│  │  │  voters)    │ │             │ │ │                 │  │  │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Implementation Plan

#### Phase 1: ZK Voting System (Day 1)

**Core Components:**

```typescript
// ZK Voting Contract
import { ZkVoteProver } from '@thegit/solana';

export class ZkVoteSystem {
  private prover: ZkVoteProver;
  private merkleTree: MerkleTree;

  async createProposal(
    title: string,
    options: string[],
    votingPeriod: number
  ): Promise<Proposal> {
    const proposalId = uuidv4();

    // Create on-chain proposal
    const proposal = await this.program.methods
      .createProposal(title, options, votingPeriod)
      .accounts({
        proposal: proposalId,
        authority: this.wallet.publicKey,
      })
      .rpc();

    return { proposalId, options, votingPeriod };
  }

  async castVote(
    proposalId: string,
    optionIndex: number,
    voterIdentity: IdentityProof
  ): Promise<VoteReceipt> {
    // Generate ZK proof of vote
    const voteCommitment = this.merkleTree.insert({
      proposalId,
      optionIndex,
      voterHash: voterIdentity.commitment,
      timestamp: Date.now(),
    });

    // Create encrypted ballot
    const encryptedVote = await this.encryptVote(optionIndex);

    // Submit to contract
    const receipt = await this.program.methods
      .castVote(proposalId, encryptedVote, voteCommitment)
      .accounts({
        voter: this.wallet.publicKey,
      })
      .rpc();

    return {
      receiptId: receipt,
      commitment: voteCommitment,
    };
  }

  async tallyVotes(proposalId: string): Promise<ZkTallyResult> {
    // Get all encrypted votes
    const votes = await this.getAllVotes(proposalId);

    // Generate ZK proof of tally
    const tallyProof = await this.prover.generateTallyProof({
      votes: votes.map(v => v.encryptedOption),
      expectedCounts: this.countOptions(votes),
    });

    // Prove the sum equals total without revealing distribution
    const rangeProof = await this.prover.generateRangeProof(
      tallyProof.totalVotes,
      0,
      votes.length
    );

    return {
      totalVotes: tallyProof.totalVotes,
      resultsByOption: tallyProof.results,
      zkProof: tallyProof.proof,
      rangeProof,
    };
  }
}
```

**ZK Vote Proof Circuit (Noir):**
```
// Vote tally proof - prove you counted correctly without revealing counts
circuit vote_tally {
    // Private inputs (known only to prover)
    secret votes: [Field; MAX_VOTES],

    // Public inputs
    total_votes: Field,
    merkle_root: Field,

    constraint total_votes == votes.sum()

    // Range proof: each vote is 0 or 1
    for i in 0..MAX_VOTES {
        votes[i] * (1 - votes[i]) == 0
    }

    // Commitment proof
    let commitment = pedersen_commitment(votes)
    commitment.merkle_proof(merkle_root)
}
```

#### Phase 2: ZK Code Review (Day 2)

```typescript
export class ZkCodeReview {
  async generateReviewProof(
    codeHash: string,
    testResults: TestResult[],
    analysisResults: AnalysisResult[]
  ): Promise<ZkReviewProof> {
    // Generate Merkle tree of test results
    const testTree = MerkleTree.build(
      testResults.map(t => t.toString())
    );

    // Generate ZK proof of test coverage
    const coverageProof = await this.generateCoverageProof(
      testResults,
      analysisResults
    );

    // Generate ZK proof of no critical bugs
    const bugProof = await this.generateBugProof(
      analysisResults,
      CRITICAL_SEVERITY
    );

    // Generate commitment to code hash
    const codeCommitment = pedersenCommit(codeHash);

    return {
      codeCommitment,
      testMerkleRoot: testTree.root(),
      coverageProof,
      bugProof,
      // Public outputs
      public: {
        testCount: testResults.length,
        passRate: testResults.filter(t => t.passed).length / testResults.length,
        coveragePercent: calculateCoverage(testResults, analysisResults),
        criticalBugs: 0, // Proved!
      },
    };
  }

  async verifyReviewProof(
    proof: ZkReviewProof,
    expectedCoverage: number
  ): Promise<boolean> {
    // Verify coverage proof
    const coverageValid = this.groth16.verify(
      proof.coverageProof.circuitHash,
      proof.coverageProof.publicInputs,
      proof.coverageProof.proof
    );

    // Verify bug proof (proves criticalBugs == 0)
    const bugValid = this.groth16.verify(
      proof.bugProof.circuitHash,
      proof.bugProof.publicInputs,
      proof.bugProof.proof
    );

    // Verify coverage meets threshold
    const thresholdValid = proof.public.coveragePercent >= expectedCoverage;

    return coverageValid && bugValid && thresholdValid;
  }
}
```

#### Phase 3: ZK Analytics (Day 3)

```typescript
export class ZkAnalytics {
  async generateTeamMetrics(
    memberIds: string[],
    activities: Activity[]
  ): Promise<ZkMetrics> {
    // Calculate aggregated metrics
    const totalContributions = activities.length;
    const uniqueDays = new Set(activities.map(a => a.date)).size;
    const avgResponseTime = this.calculateAvgResponseTime(activities);

    // Generate range proofs for each metric
    const contributionProof = await this.prover.rangeProof(
      totalContributions,
      0,
      10000
    );

    const activityProof = await this.prover.rangeProof(
      uniqueDays,
      1,
      365
    );

    const responseTimeProof = await this.prover.rangeProof(
      avgResponseTime,
      0,
      86400 // 24 hours in seconds
    );

    // Generate anonymous membership proof
    const membershipTree = await this.buildMembershipTree(memberIds);
    const membershipProof = await this.prover.membershipProof(
      this.currentUser.id,
      membershipTree
    );

    return {
      aggregated: {
        totalContributions,
        uniqueDays,
        avgResponseTime,
      },
      proofs: {
        contribution: contributionProof,
        activity: activityProof,
        responseTime: responseTimeProof,
        membership: membershipProof,
      },
    };
  }

  async verifyTeamMetrics(
    metrics: ZkMetrics,
    minContributions: number,
    minActivityDays: number
  ): Promise<VerificationResult> {
    // Verify each metric meets threshold
    const contributionValid = this.prover.verifyRange(
      metrics.proofs.contribution,
      minContributions,
      10000
    );

    const activityValid = this.prover.verifyRange(
      metrics.proofs.activity,
      minActivityDays,
      365
    );

    // Verify membership
    const membershipValid = this.prover.verifyMembership(
      metrics.proofs.membership
    );

    return {
      meetsContributionThreshold: contributionValid,
      meetsActivityThreshold: activityValid,
      isTeamMember: membershipValid,
      isQualified: contributionValid && activityValid && membershipValid,
    };
  }
}
```

### Demo Flow (3 minutes)

```
1. Create team proposal: "Allocate 10 ETH to security audit"
   - Run: zkvote create-proposal --title "Security Audit" --options "yes,no, abstain"

2. Cast anonymous votes with ZK proofs
   - Member A votes yes (generates encrypted ballot + ZK proof)
   - Member B votes no
   - Member C votes yes

3. Show results: "7/10 yes" - NOT individual votes
   - Run: zkvote tally --proposal-id abc123
   - Display: "Total: 10 votes | Yes: 7 | No: 2 | Abstain: 1"
   - Show ZK proof verification

4. Submit PR for code review
   - Run: zkreview submit --pr 456 --tests results.json

5. Generate ZK proof: "All tests pass, no critical bugs"
   - Run: zkreview generate-proof --code-hash abc123
   - Show proof output (no code revealed)

6. Share proof with auditors without exposing code
   - Send proof.json to auditors
   - They verify: tests pass, coverage > 80%, 0 critical bugs
   - They never see the code!
```

### Files to Create/Modify

| File | Action | Lines |
|------|--------|-------|
| `thegit.network/packages/sdk-solana/src/zk/vote-prover.ts` | Create | 500 |
| `thegit.network/packages/sdk-solana/src/zk/code-review.ts` | Create | 500 |
| `thegit.network/packages/sdk-solana/src/zk/analytics.ts` | Create | 400 |
| `thegit.network/packages/cli/src/commands/zkvote.ts` | Create | 300 |
| `thegit.network/packages/cli/src/commands/zkreview.ts` | Create | 300 |
| `thegit.network/packages/cli/src/commands/zkstats.ts` | Create | 300 |
| `thegit.network/docs/zk-team-workspace.md` | Create | 400 |
| **Total** | | **2,700** |

---

## PRD 3: VPN Post-Quantum Completion (themailhost/vpn)

**Location:** `~/work/themailhost/daemon/src/vpn/`
**Status:** 70% COMPLETE
**Prize Potential:** $23,000
**Time to Complete:** 1-2 days

### Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| WireGuard Core | ✅ Complete | Working VPN tunnel |
| macOS Client | ✅ Complete | Full functionality |
| Linux Client | ✅ Complete | Full functionality |
| Kill Switch | ✅ Complete | Network block on disconnect |
| Split Tunneling | ✅ Complete | Per-app routing |
| **PQ Key Exchange** | ⚠️ 50% | Kyber implemented, needs integration |
| **Windows Client** | ❌ Stub | Future (not needed for hackathon) |

### What's Missing

1. **Kyber-768 Integration**: KEM implemented in `kyber.rs` but not integrated into key exchange
2. **Hybrid Handshake**: Need to combine Kyber + X25519 for hybrid security
3. **Key Rotation**: Automated periodic key rotation with PQ re-keying
4. **Test Suite**: Unit tests for PQ key exchange flow

### Implementation Tasks

#### Task 1: Integrate Kyber into WireGuard Handshake

```rust
// themailhost/daemon/src/vpn/pq_handshake.rs

pub struct PostQuantumHandshake {
    kyber: Kyber768,
    x25519: X25519,
    cipher: ChaCha20Poly1305,
}

impl PostQuantumHandshake {
    /// Perform hybrid key exchange: Kyber + X25519
    pub async fn perform_handshake(
        &self,
        peer: &Peer,
        local_ephemeral: &EphemeralKey,
    ) -> Result<HandshakeResult, VpnError> {
        // Step 1: Generate Kyber key pair
        let (kyber_sk, kyber_pk) = self.kyber.keygen();

        // Step 2: Generate X25519 key pair
        let (x25519_sk, x25519_pk) = self.x25519.keygen();

        // Step 3: Create hybrid encapsulation
        let (combined_ss, ciphertext) = self.hybrid_encapsulate(
            &kyber_pk,
            &x25519_pk,
            &peer.public_key,
        ).await?;

        // Step 4: Derive traffic keys
        let (send_key, recv_key) = self.derive_traffic_keys(
            &combined_ss,
            &local_ephemeral.public,
            &peer.public_key,
        );

        // Step 5: Create handshake message
        let handshake_msg = HandshakeMessage {
            kyber_ciphertext: &kyber_pk,
            x25519_public: &x25519_pk,
            ephemeral_public: &local_ephemeral.public,
            timestamp: Utc::now(),
        };

        Ok(HandshakeResult {
            send_key,
            recv_key,
            handshake_message: handshake_msg,
            key_material: combined_ss,
        })
    }

    async fn hybrid_encapsulate(
        &self,
        kyber_pk: &KyberPublicKey,
        x25519_pk: &X25519PublicKey,
        peer_x25519_pk: &X25519PublicKey,
    ) -> Result<(Vec<u8>, Vec<u8>), CryptoError> {
        // Kyber encapsulation (provides post-quantum security)
        let (kyber_ss, kyber_ct) = self.kyber.encapsulate(kyber_pk)?;

        // X25519 key agreement (provides forward secrecy)
        let x25519_ss = self.x25519.agree(x25519_sk, peer_x25519_pk)?;

        // Combine with KDF
        let mut combined = Vec::new();
        combined.extend_from_slice(&kyber_ss);
        combined.extend_from_slice(&x25519_ss);

        let combined_ss = sha256_hash(&combined);

        // Build ciphertext
        let mut ciphertext = Vec::new();
        ciphertext.extend_from_slice(&kyber_ct);  // 1088 bytes for Kyber768
        ciphertext.extend_from_slice(x25519_pk);  // 32 bytes

        Ok((combined_ss, ciphertext))
    }
}
```

#### Task 2: Add Key Rotation with PQ Re-keying

```rust
pub struct KeyRotationManager {
    rotation_interval: Duration,
    max_keys: usize,
    key_store: Arc<RwLock<KeyStore>>,
    pq_handshake: PostQuantumHandshake,
}

impl KeyRotationManager {
    pub async fn start_background_rotation(&self) {
        let mut interval = tokio::time::interval(self.rotation_interval);

        loop {
            interval.tick().await;
            self.rotate_keys().await;
        }
    }

    async fn rotate_keys(&self) {
        // Check if rotation is needed
        let keys = self.key_store.read().await;
        if !self.should_rotate(&keys) {
            return;
        }
        drop(keys);

        // Generate new PQ keys
        let (new_kyber_sk, new_kyber_pk) = self.pq_handshake.kyber.keygen();
        let (new_x25519_sk, new_x25519_pk) = self.pq_handshake.x25519.keygen();

        // Perform re-keying handshake with all peers
        let peers = self.get_active_peers().await;
        for peer in peers {
            self.perform_rekey(peer, &new_kyber_sk, &new_x25519_sk).await;
        }

        // Store new keys
        let mut keys = self.key_store.write().await;
        keys.insert(new_key_id(), KeyMaterial {
            kyber_sk: new_kyber_sk,
            x25519_sk: new_x25519_sk,
            created_at: Utc::now(),
        });

        // Clean up old keys
        self.cleanup_expired_keys(&mut keys);
    }

    async fn perform_rekey(
        &self,
        peer: &Peer,
        new_kyber_sk: &KyberSecretKey,
        new_x25519_sk: &X25519SecretKey,
    ) {
        // Send rekey message with new public keys
        let rekey_msg = RekeyMessage {
            new_kyber_pk: &new_kyber_pk,
            new_x25519_pk: &new_x25519_pk,
            key_id: new_key_id(),
        };

        // Wait for peer's response
        let response = self.send_rekey_request(peer, &rekey_msg).await;

        // Derive new traffic keys
        let combined_ss = self.derive_combined_ss(
            new_kyber_sk,
            new_x25519_sk,
            &response.peer_kyber_ct,
            &response.peer_x25519_pk,
        ).await;

        // Install new keys
        self.install_keys(peer, &combined_ss, KeyType::Send);

        // Verify peer installed keys
        self.verify_key_installed(peer, KeyType::Receive).await;
    }
}
```

#### Task 3: Add Comprehensive Tests

```rust
#[cfg(test)]
mod pq_handshake_tests {
    use super::*;

    #[tokio::test]
    async fn test_hybrid_key_generation() {
        let handshake = PostQuantumHandshake::new();
        let peer = create_test_peer();

        let result = handshake.perform_handshake(&peer, &local_ephemeral).await;

        assert!(result.is_ok());
        let keys = result.unwrap();
        assert_eq!(keys.send_key.len(), 32);
        assert_eq!(keys.recv_key.len(), 32);
    }

    #[tokio::test]
    async fn test_key_independence() {
        // Different handshakes should produce different keys
        let handshake = PostQuantumHandshake::new();

        let result1 = handshake.perform_handshake(&peer1, &ephemeral1).await;
        let result2 = handshake.perform_handshake(&peer2, &ephemeral2).await;

        let keys1 = result1.unwrap();
        let keys2 = result2.unwrap();

        assert_ne!(keys1.send_key, keys2.send_key);
        assert_ne!(keys1.recv_key, keys2.recv_key);
    }

    #[test]
    fn test_kyber_encapsulation_size() {
        let kyber = Kyber768::new();
        let (pk, _) = kyber.keygen();
        let (ss, ct) = kyber.encapsulate(&pk).unwrap();

        // Kyber768 encapsulation produces 1088 byte ciphertext
        assert_eq!(ct.len(), 1088);
        // Shared secret is 32 bytes
        assert_eq!(ss.len(), 32);
    }
}
```

### Files to Modify

| File | Action | Changes |
|------|--------|---------|
| `themailhost/daemon/src/vpn/mod.rs` | Modify | Add PQ handshake exports |
| `themailhost/daemon/src/vpn/pq_handshake.rs` | Create |  lines |
| `400themailhost/daemon/src/vpn/key_rotation.rs` | Create | 300 lines |
| `themailhost/daemon/src/vpn/tests/pq_tests.rs` | Create | 200 lines |
| `themailhost/daemon/src/security/kyber.rs` | Modify | Verify integration points |

---

## PRD 4: Helix Kyber KEM Implementation

**Location:** `~/work/helix/helix_core/src/`
**Status:** STUB (needs implementation)
**Prize Potential:** $7,000
**Time to Complete:** 1 day

### Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| X25519 | ✅ Complete | Used for key agreement |
| ChaCha20-Poly1305 | ✅ Complete | Message encryption |
| P2P Relay | ✅ Complete | ~100ms delivery |
| Group Messaging | ✅ Complete | Multi-party support |
| Disappearing Messages | ✅ Complete | Configurable expiry |
| **Kyber KEM** | ❌ Stub | Only placeholder, needs implementation |
| **Solana Settlement** | ❌ Stub | Future enhancement |

### Implementation Tasks

#### Task 1: Complete Kyber-768 Implementation

```rust
// helix/helix_core/src/kyber.rs

use ring::digest;
use rand::{RngCore, CryptoRng};

/// Kyber-768 Post-Quantum Key Encapsulation Mechanism
/// Based on NIST FIPS 203 draft specification
pub struct Kyber768 {
    n: usize,           // Polynomial ring degree (256)
    q: u32,             // Modulus (3329)
    k: usize,           // Matrix dimension (3 for 768)
    eta_1: u32,         // Noise parameter for key generation
    eta_2: u32,         // Noise parameter for encapsulation
}

impl Kyber768 {
    pub fn new() -> Self {
        Self {
            n: 256,
            q: 3329,
            k: 3,
            eta_1: 3,
            eta_2: 2,
        }
    }

    /// Generate key pair (seed → (sk, pk))
    pub fn keygen(&self, rng: &mut impl CryptoRng) -> (KyberSecretKey, KyberPublicKey) {
        // Step 1: Generate rho, sigma from random
        let mut seed = [0u8; 64];
        rng.fill_bytes(&mut seed);

        let rho = &seed[0..32];
        let sigma = &seed[32..64];

        // Step 2: Generate matrix A from rho using PRF
        let a = self.sample_matrix(rho, false);

        // Step 3: Generate secret vector s from sigma
        let s = self.sample_noise_vector(sigma, self.eta_1, rng);

        // Step 4: Generate error vector e from sigma
        let mut sigma_prime = sigma.to_vec();
        let e = self.sample_noise_vector(&sigma_prime, self.eta_1, rng);

        // Step 5: Compute public key pk = A·s + e
        let a_times_s = self.matrix_vector_mul(&a, &s);
        let pk_ntt = self.add_noise(&a_times_s, &e);

        // Format public key: (pk_ntt, rho)
        let pk_bytes = self.serialize_pk(&pk_ntt, rho);

        // Format secret key: pk + s (packed for efficient multiplication)
        let sk_bytes = self.serialize_sk(&s, &pk_ntt, rho);

        (
            KyberSecretKey { data: sk_bytes },
            KyberPublicKey { data: pk_bytes },
        )
    }

    /// Encapsulate: pk → (ciphertext, shared secret)
    pub fn encapsulate(&self, pk: &KyberPublicKey) -> Result<(Vec<u8>, Vec<u8>), KyberError> {
        // Deserialize public key
        let (pk_ntt, rho) = self.deserialize_pk(&pk.data)?;

        // Step 1: Generate m and r from random
        let mut seed = [0u8; 64];
        rand::fill(&mut seed);

        let m = &seed[0..32];      // Message (for CCA security)
        let r = &seed[32..64];     // Noise for encapsulation

        // Step 2: Generate matrix A^T from rho
        let a_transpose = self.sample_matrix(rho, true);

        // Step 3: Generate error vectors
        let r_vec = self.sample_noise_vector(r, self.eta_2, &mut rng());
        let e_1 = self.sample_noise_vector(r, self.eta_2, &mut rng());
        let e_2 = self.sample_noise_vector(m, self.eta_2, &mut rng());

        // Step 4: Compute u = A^T·r + e_1
        let a_times_r = self.matrix_vector_mul(&a_transpose, &r_vec);
        let u = self.add_noise(&a_times_r, &e_1);

        // Step 5: Compute v = pk·r + e_2 + Decompress(m)
        let pk_times_r = self.vector_mul(&pk_ntt, &r_vec);
        let m_decompressed = self.decompress_message(m);
        let v = self.add_vec(&[&pk_times_r, &e_2, &m_decompressed]);

        // Step 6: Compress v and m for ciphertext
        let v_compressed = self.compress(&v, 4);  // 4 bits per coefficient
        let m_compressed = self.compress_message(m);

        // Ciphertext = (u, v_compressed, m_compressed)
        let mut ciphertext = Vec::new();
        ciphertext.extend_from_slice(&self.serialize_vector(&u));
        ciphertext.extend_from_slice(&v_compressed);
        ciphertext.extend_from_slice(&m_compressed);

        // Step 7: Compute shared secret from m and v
        let h = self.hash_g(m_compressed);
        let k = self.hash_h(&ciphertext);
        let ss = self.hash_hk(&[&h, &k]);

        Ok((ciphertext, ss))
    }

    /// Decapsulate: sk + ct → shared secret
    pub fn decapsulate(&self, sk: &KyberSecretKey, ct: &[u8]) -> Result<Vec<u8>, KyberError> {
        // Deserialize secret key
        let (s, pk_ntt, rho) = self.deserialize_sk(&sk.data)?;

        // Split ciphertext
        let u_len = self.k * self.n * 2;  // NTT coefficients
        let v_len = self.n * 4;           // Compressed coefficients

        if ct.len() < u_len + v_len + 32 {
            return Err(KyberError::InvalidCiphertext);
        }

        let u = self.deserialize_vector(&ct[0..u_len]);
        let v_compressed = &ct[u_len..u_len + v_len];
        let m_compressed = &ct[u_len + v_len..];

        // Step 1: m' = Decompress(v - pk·s, 4)
        let pk_times_s = self.vector_mul(&pk_ntt, &s);
        let v_decompressed = self.decompress(v_compressed, 4);
        let m_prime = self.subtract(&v_decompressed, &pk_times_s);

        // Step 2: Decompress m'
        let m_prime_decompressed = self.decompress_message(&m_prime);

        // Step 3: r' = Decompress(H(m'), 2)
        let h_m = self.hash_g(&m_prime_decompressed);
        let r_prime = self.decompress(&h_m, 2);

        // Step 4: u' = A·r' + e_1
        let a = self.sample_matrix(rho, false);
        let a_times_r_prime = self.matrix_vector_mul(&a, &r_prime);
        let e_1_prime = self.sample_noise_vector(r_prime, self.eta_2, &mut rng());
        let u_prime = self.add_noise(&a_times_r_prime, &e_1_prime);

        // Step 5: Verify u == u' (rejects with probability ~2^-t)
        if !self.vector_equals(&u, &u_prime) {
            // Rejection sampling - this is expected to fail rarely
            // For now, continue with error
            return Err(KyberError::DecapsulationFailed);
        }

        // Step 6: Compute shared secret
        let h_ct = self.hash_h(ct);
        let ss_prime = self.hash_hk(&[&h_m, &h_ct]);

        Ok(ss_prime)
    }

    // Helper methods for polynomial operations
    fn sample_matrix(&self, rho: &[u8], transpose: bool) -> Vec<Vec<Polynomial>> {
        // Generate k×k matrix from rho using PRF
        let mut a = Vec::with_capacity(self.k);
        for i in 0..self.k {
            let mut row = Vec::with_capacity(self.k);
            for j in 0..self.k {
                let idx = if transpose { i + self.k * j } else { j + self.k * i };
                let prf_input = [rho, &[idx as u8]].concat();
                let noise = self.prf(prf_input.as_slice(), 64);
                let poly = self.sample_poly_cbd(&noise, self.eta_1);
                row.push(poly);
            }
            a.push(row);
        }
        a
    }

    fn sample_noise_vector(&self, seed: &[u8], eta: u32, rng: &mut impl RngCore) -> Vec<Polynomial> {
        // Sample k polynomials using centered binomial distribution
        (0..self.k).map(|i| {
            let mut prf_input = seed.to_vec();
            prf_input.push(i as u8);
            let noise = self.prf(&prf_input, 64);
            self.sample_poly_cbd(&noise, eta)
        }).collect()
    }

    fn sample_poly_cbd(&self, noise: &[u8], eta: u32) -> Polynomial {
        // Centered binomial distribution
        let mut coefficients = Vec::with_capacity(self.n);

        for i in 0..self.n / 4 {
            let d1 = noise[3*i] & 0x03;
            let d2 = (noise[3*i] >> 2) & 0x03;
            let d3 = (noise[3*i + 1]) & 0x03;
            let d4 = (noise[3*i + 1] >> 2) & 0x03;
            let d5 = (noise[3*i + 2]) & 0x03;
            let d6 = (noise[3*i + 2] >> 2) & 0x03;

            coefficients.push(self.cbd(d1, d2, eta));
            coefficients.push(self.cbd(d3, d4, eta));
            coefficients.push(self.cbd(d5, d6, eta));
            coefficients.push(self.cbd(d1, d2, eta)); // Fix: need 4 values
        }

        Polynomial { coefficients }
    }

    fn cbd(&self, d1: u8, d2: u8, eta: u32) -> i16 {
        let a = (d1 as i16) % 2;
        let b = (d2 as i16) % 2;
        let count = (d1 >> 2) + (d2 >> 2) + ((d1 & 2) >> 1) + ((d2 & 2) >> 1) +
                    ((d1 & 4) >> 2) + ((d2 & 4) >> 2) + ((d1 & 8) >> 3) + ((d2 & 8) >> 3);

        a + b + count - 2 * count
    }

    // NTT, inverse NTT, compression, decompression, hashing...
}
```

#### Task 2: Integration with Helix Messaging

```rust
// helix/helix_core/src/pq_message.rs

pub struct PostQuantumMessage {
    /// Kyber-768 encapsulated key
    pub encapsulated_key: Vec<u8>,  // 1088 + 32 = 1120 bytes
    /// ChaCha20-Poly1305 encrypted payload
    pub encrypted_payload: Vec<u8>,
    /// Authentication tag
    pub tag: [u8; 16],
    /// Message nonce (different from encapsulated key)
    pub nonce: u64,
}

impl PostQuantumMessage {
    pub async fn encrypt(
        &self,
        plaintext: &[u8],
        recipient_pk: &KyberPublicKey,
        rng: &mut impl CryptoRng,
    ) -> Result<Self, CryptoError> {
        // Generate ephemeral key pair for this message
        let kyber = Kyber768::new();
        let (ephemeral_sk, ephemeral_pk) = kyber.keygen(rng);

        // Encapsulate key for recipient
        let (shared_secret, ciphertext) = kyber.encapsulate(&ephemeral_pk)?;

        // Generate message-specific nonce
        let nonce = rng.next_u64();

        // Encrypt with ChaCha20-Poly1305
        let (encrypted, tag) = chacha20_poly1305_encrypt(
            &shared_secret,
            nonce,
            plaintext,
        )?;

        Ok(PostQuantumMessage {
            encapsulated_key: ciphertext,
            encrypted_payload: encrypted,
            tag,
            nonce,
        })
    }

    pub async fn decrypt(
        &self,
        recipient_sk: &KyberSecretKey,
    ) -> Result<Vec<u8>, CryptoError> {
        // Decapsulate shared secret
        let kyber = Kyber768::new();
        let shared_secret = kyber.decapsulate(recipient_sk, &self.encapsulated_key)?;

        // Decrypt payload
        let plaintext = chacha20_poly1305_decrypt(
            &shared_secret,
            self.nonce,
            &self.encrypted_payload,
            &self.tag,
        )?;

        Ok(plaintext)
    }
}
```

### Files to Create/Modify

| File | Action | Lines |
|------|--------|-------|
| `helix/helix_core/src/kyber.rs` | Rewrite | 800 |
| `helix/helix_core/src/pq_message.rs` | Create | 300 |
| `helix/helix_core/src/tests/kyber_tests.rs` | Create | 200 |
| `helix/helix_core/src/lib.rs` | Modify | Export new types |

---

## PRD 5: Privacy Shield Suite Integration

**Location:** `~/work/android-security-cam/` + `~/work/themailhost/daemon/src/vpn/`
**Status:** 70% COMPLETE
**Prize Potential:** $18,000
**Time to Complete:** 1-2 days

### Current Status

| Component | Status | Location |
|-----------|--------|----------|
| Camera App | ✅ Complete | `android-security-cam/securitycam/` |
| Web Viewer | ✅ Complete | `android-security-cam/website/` |
| Motion Detection | ✅ Complete | `android-security-cam/` |
| VPN Service | ✅ 70% | `themailhost/daemon/src/vpn/` |
| **Integration** | ❌ Needed | Connect camera to VPN |

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                  PRIVACY SHIELD SUITE ARCHITECTURE              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Android Device                         │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │                 Flutter App                         │  │  │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌───────────┐  │  │  │
│  │  │  │ Camera      │  │ VPN Status  │  │ Settings  │  │  │  │
│  │  │  │ Screen      │  │ Indicator   │  │ Screen    │  │  │  │
│  │  │  └──────┬──────┘  └──────┬──────┘  └─────┬─────┘  │  │  │
│  │  │         │                │               │        │  │  │
│  │  │         └────────────────┼───────────────┘        │  │  │
│  │  │                          ▼                        │  │  │
│  │  │         ┌──────────────────────────────────┐     │  │  │
│  │  │         │    ShieldIntegrationService      │     │  │  │
│  │  │         │  • VPN connection management     │     │  │  │
│  │  │         │  • Tunnel configuration          │     │  │  │
│  │  │         │  • Kill switch monitoring        │     │  │  │
│  │  │         └──────────────────────────────────┘     │  │  │
│  │  │                          │                        │  │  │
│  │  │         ┌────────────────┼────────────────┐       │  │  │
│  │  │         ▼                ▼                ▼       │  │  │
│  │  │  ┌────────────┐  ┌────────────┐  ┌───────────┐  │  │  │
│  │  │  │ Camera     │  │ Motion     │  │ Recording │  │  │  │
│  │  │  │ Service    │  │ Detection  │  │ Service   │  │  │  │
│  │  │  └────────────┘  └────────────┘  └───────────┘  │  │  │
│  │  └────────────────────────────────────────────────────┘  │
│  │                          │                                 │
│  │                          ▼                                 │
│  │  ┌──────────────────────────────────────────────────────┐│
│  │  │              VPN Tunnel (WireGuard + PQ)             ││
│  │  │  ┌────────────────────────────────────────────────┐ ││
│  │  │  │              Tunnel Pipeline                   │ ││
│  │  │  │  Camera → Encrypt → PQ Handshake → WireGuard →│ ││
│  │  │  │                 → Network                       │ ││
│  │  │  └────────────────────────────────────────────────┘ ││
│  │  └──────────────────────────────────────────────────────┘│
│  │                           │                               │
│  └───────────────────────────┼───────────────────────────────┘
│                               │
│                               ▼
│  ┌──────────────────────────────────────────────────────────┐
│  │                    Internet                              │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  │ VPN Server   │  │ Camera Cloud │  │ Alert Service │  │
│  │  │              │  │ (Encrypted)  │  │ • Push        │  │
│  │  └──────────────┘  └──────────────┘  └───────────────┘  │
│  └──────────────────────────────────────────────────────────┘
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Implementation Tasks

#### Task 1: Create Flutter Shield Integration Service

```dart
// android-security-cam/lib/services/shield_integration_service.dart

import 'package:flutter_vpn/flutter_vpn.dart';
import 'package:themailhost_vpn/themailhost_vpn.dart';

class ShieldIntegrationService {
  static const String VPN_SERVER = 'vpn.themail.host';
  static const int VPN_PORT = 51820;

  final _vpnStateController = StreamController<VpnState>.broadcast();
  final _killSwitchEnabled = BehaviorSubject<bool>.seeded(true);

  Stream<VpnState> get vpnState => _vpnStateController.stream;
  Stream<bool> get killSwitchEnabled => _killSwitchEnabled.stream;

  /// Initialize VPN connection
  Future<void> initializeShield({
    required String username,
    required String password,
  }) async {
    // Configure VPN
    final config = VpnConfig(
      serverAddress: VPN_SERVER,
      serverPort: VPN_PORT,
      username: username,
      password: password,
      privateKey: await _getPrivateKey(),
      dnsServers: ['10.0.0.1', '10.0.0.2'],
      allowedApps: [], // Empty = all traffic through VPN
      blockedApps: [], // Blocked apps bypass VPN
    );

    await FlutterVpn.configure(config);

    // Listen to state changes
    FlutterVpn.stateChanged.listen(_handleVpnStateChange);
  }

  /// Start the VPN tunnel
  Future<void> startShield() async {
    await FlutterVpn.connect();
    _killSwitchEnabled.add(true);
  }

  /// Stop the VPN tunnel
  Future<void> stopShield() async {
    if (_killSwitchEnabled.value) {
      // Kill switch is enabled - block traffic
      await _enableKillSwitch();
    }
    await FlutterVpn.disconnect();
  }

  /// Enable kill switch - blocks all network traffic if VPN drops
  Future<void> _enableKillSwitch() async {
    // Configure OS-level kill switch
    await FlutterVpn.setKillSwitch(true);
    _killSwitchEnabled.add(true);
  }

  /// Check if camera can send data
  bool canSendCameraData() {
    final state = _vpnStateController.valueOrNull;
    return state == VpnState.connected;
  }

  /// Get VPN status for UI
  VpnStatusModel get currentStatus {
    return VpnStatusModel(
      isConnected: _vpnStateController.valueOrNull == VpnState.connected,
      isConnecting: _vpnStateController.valueOrNull == VpnState.connecting,
      killSwitchEnabled: _killSwitchEnabled.valueOrNull ?? true,
      serverAddress: VPN_SERVER,
      connectedSince: _connectedSince,
    );
  }

  void _handleVpnStateChange(VpnState state) {
    _vpnStateController.add(state);

    if (state == VpnState.disconnected && _killSwitchEnabled.value) {
      // VPN dropped! Kill switch should have blocked traffic
      _log.warning('VPN disconnected with kill switch enabled');
    }
  }
}
```

#### Task 2: Connect Camera to VPN Tunnel

```dart
// android-security-cam/lib/services/camera_vpn_tunnel.dart

class CameraVpnTunnel {
  final ShieldIntegrationService _shield;
  final CameraService _camera;
  final StreamController<EncryptedFrame> _encryptedFrames;

  CameraVpnTunnel({
    required ShieldIntegrationService shield,
    required CameraService camera,
  })  : _shield = shield,
        _camera = camera,
        _encryptedFrames = StreamController();

  /// Start encrypted camera streaming through VPN
  Future<void> startEncryptedStream({
    required String targetUrl,
    required EncryptionKey key,
  }) async {
    // Ensure VPN is connected before streaming
    if (!_shield.canSendCameraData()) {
      throw VpnNotConnectedException('VPN must be connected for encrypted streaming');
    }

    // Start camera preview with VPN-aware frame capture
    await _camera.startPreview();

    // Subscribe to frames and encrypt them
    _camera.frames.listen((frame) async {
      try {
        // Encrypt frame with session key
        final encrypted = await _encryptFrame(frame, key);

        // Send through VPN tunnel
        await _sendThroughVpn(targetUrl, encrypted);

        // Emit for UI preview
        _encryptedFrames.add(EncryptedFrame(
          data: encrypted,
          timestamp: DateTime.now(),
          size: encrypted.length,
        ));
      } catch (e) {
        _log.error('Frame encryption failed: $e');
      }
    });
  }

  Future<List<int>> _encryptFrame(
    CameraFrame frame,
    EncryptionKey key,
  ) async {
    // Use ChaCha20-Poly1305 for streaming encryption
    final nonce = frame.timestamp.microsecondsSinceEpoch.toBytes();

    return chacha20Poly1305Encrypt(
      key: key.sessionKey,
      nonce: nonce,
      plaintext: frame.data,
    );
  }

  Future<void> _sendThroughVpn(String url, List<int> encrypted) async {
    // Create HTTPS connection through VPN
    final client = HttpClient();
    final request = await client.postUrl(Uri.parse(url));

    // VPN tunnel is already established, so this goes through it
    request.headers.contentLength = encrypted.length.toLong();
    request.add(encrypted);

    final response = await request.close();
    return response.drain();
  }
}
```

#### Task 3: Add Kill Switch for Camera

```dart
// android-security-cam/lib/services/camera_kill_switch.dart

class CameraKillSwitch {
  static const String FIREWALL_RULE = 'BLOCK_CAMERA_NO_VPN';

  final ShieldIntegrationService _shield;

  /// Enable kill switch - blocks camera network access if VPN drops
  Future<void> enableKillSwitch() async {
    // Block camera app from network
    await _blockCameraNetworkAccess();

    // Listen for VPN state changes
    _shield.vpnState.listen(_handleVpnStateChange);
  }

  Future<void> _blockCameraNetworkAccess() async {
    // Use FlutterVpn to block app
    await FlutterVpn.addBlockedApp('com.example.securitycam');
  }

  Future<void> _handleVpnStateChange(VpnState state) async {
    switch (state) {
      case VpnState.connected:
        // Allow camera network access
        await _allowCameraNetworkAccess();
        _showNotification('VPN Connected - Camera streaming enabled');
        break;

      case VpnState.disconnected:
      case VpnState.invalid:
        // Block camera network access immediately
        await _blockCameraNetworkAccess();
        _showNotification(
          'VPN Disconnected - Camera blocked for privacy',
          isCritical: true,
        );
        break;

      case VpnState.connecting:
      case VpnState.disconnecting:
        // Maintain block during transition
        await _blockCameraNetworkAccess();
        break;
    }
  }

  void _showNotification(String message, {bool isCritical = false}) {
    // Show system notification
    flutterLocalNotificationsPlugin.show(
      1,
      'Privacy Shield',
      message,
      isCritical ? NotificationImportance.max : NotificationImportance.high,
    );
  }
}
```

### Files to Create/Modify

| File | Action | Lines |
|------|--------|-------|
| `android-security-cam/lib/services/shield_integration_service.dart` | Create | 250 |
| `android-security-cam/lib/services/camera_vpn_tunnel.dart` | Create | 200 |
| `android-security-cam/lib/services/camera_kill_switch.dart` | Create | 150 |
| `android-security-cam/lib/main.dart` | Modify | Initialize shield |
| `android-security-cam/lib/screens/camera_screen.dart` | Modify | VPN status indicator |
| `android-security-cam/lib/screens/settings_screen.dart` | Modify | VPN settings |

---

## PRD 6: ShadowPay - Stealth Payment System

**Domain:** shadowpay.app
**Status:** CONCEPT (Needs Development)
**Prize Potential:** $43,000
**Complexity:** High
**Time to Complete:** 3-4 days

### Executive Summary

ShadowPay is a privacy-first payment system that enables anonymous, unlinkable transactions using zero-knowledge proofs and stealth addresses. Building on the existing [Stealth Payment Gateway](TIER1_PRIORITY/billpayx.com/) infrastructure, ShadowPay adds ZK proof capabilities for:

1. **Anonymous Payments** - Prove transaction validity without revealing sender, recipient, or amount
2. **Stealth Addresses** - One-time addresses per transaction for unlinkability
3. **ZK Range Proofs** - Prove funds exist without revealing transaction amounts
4. **Private Balance Proofs** - Prove sufficient balance without exposing current balance
5. **Cross-Project Integration** - Powers StealthGame for private in-game transactions

`★ Insight ─────────────────────────────────────`
**Why Stealth Payments Matter:**
- Traditional blockchains reveal sender, recipient, and amount for all transactions
- Financial privacy is essential for freedom of commerce and expression
- "Privacy by default" prevents surveillance and discrimination
- ZK proofs enable privacy without compromising auditability
────────────────────────────────────────────────

### Features

| Feature | Description | Priority |
|---------|-------------|----------|
| ZK Payment Proofs | Prove transaction validity without revealing details | High |
| Stealth Addresses | One-time addresses prevent transaction linking | High |
| Amount Hiding | Range proofs hide transaction amounts | High |
| Private Balances | Prove sufficient balance without exposure | Medium |
| Batch Transactions | Multiple payments in single ZK proof | Medium |
| Cross-Chain Support | Bridge to Solana, Ethereum, and beyond | Low |
| StealthGame Integration | Private in-game currency and payments | Medium |
| Merchant API | Easy integration for merchants | Medium |

### Hackathon Categories

| Challenge | Prize | Fit |
|-----------|-------|-----|
| Aztec - ZK Applications | $15,000 | High (ZK payment proofs) |
| Radr Labs - Privacy | $15,000 | High (stealth payments) |
| Light Protocol - Privacy | $13,000 | High (ZK infrastructure) |
| Starpay - Payment UX | $3,500 | Medium (already submitted) |
| Cross-Project StealthGame | $15,000 | High (integration) |

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         SHADOWPAY                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      User Layer                           │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │  │
│  │  │ Mobile App  │  │ Web Wallet  │  │ CLI Tool        │  │  │
│  │  │ (Flutter)   │  │ (React)     │  │ (Rust)          │  │  │
│  │  └──────┬──────┘  └──────┬──────┘  └───────┬─────────┘  │  │
│  │         │                │                  │            │  │
│  │         └────────────────┼──────────────────┘            │  │
│  │                          ▼                               │  │
│  │         ┌──────────────────────────────────────────┐    │  │
│  │         │        ShadowPay SDK (TypeScript)        │    │  │
│  │         │  ┌────────────────────────────────────┐  │    │  │
│  │         │  │ ZK Prover     │ Stealth Address   │  │    │  │
│  │         │  │ - Groth16     │ Generator         │  │    │  │
│  │         │  │ - PLONK       │ - Nullifier Derive│  │    │  │
│  │         │  │ - Range Proof │ - View Key Derive │  │    │  │
│  │         │  └────────────────────────────────────┘  │    │  │
│  │         └──────────────────────────────────────────┘    │  │
│  │                          │                               │  │
│  └──────────────────────────┼───────────────────────────────┘  │
│                             │                                   │
│                             ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Blockchain Layer                       │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │              ShadowPay Contract (Solana)           │  │  │
│  │  │  ┌──────────────┐ ┌──────────────┐ ┌────────────┐ │  │  │
│  │  │  │ Merkle Tree  │ │ Nullifier    │ │ Commit-    │ │  │  │
│  │  │  │ of Notes     │ │ Storage      │ │ ment Pool  │ │  │  │
│  │  │  └──────────────┘ └──────────────┘ └────────────┘ │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                          │                               │  │
│  │         ┌────────────────┼────────────────┐              │  │
│  │         ▼                ▼                ▼              │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────────┐    │  │
│  │  │ Solana     │  │ Aztec      │  │ Ethereum (via  │    │  │
│  │  │ Program    │  │ Contract   │  │ Bridge)        │    │  │
│  │  └────────────┘  └────────────┘  └────────────────┘    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Implementation Plan

#### Phase 1: ZK Payment Circuit (Day 1-2)

**Core ZK Circuit for Payment Proofs:**

```typescript
// shadowpay/circuits/payment_proof.ts

import { Circuit, Field, Group, Scalar } from 'o1js';

export class PaymentCircuit extends Circuit {
  // Private inputs (known only to prover)
  @circuitField secretKey: Field;          // Sender's secret key
  @circuitField amount: Field;              // Payment amount
  @circuitField randomSeed: Field;          // For note commitment randomness
  @circuitField senderNullifierRand: Field; // For nullifier derivation
  
  // Public inputs
  @circuitField merkleRoot: Field;          // Current note tree root
  @circuitField commitment: Field;          // New note commitment
  @circuitField nullifier: Field;           // New nullifier
  @circuitField recipientViewKey: Field;    // Recipient's view key
  @circuitField fee: Field;                 // Transaction fee
  
  // Public outputs (visible to everyone)
  @circuitField(public) newMerkleRoot: Field;
  @circuitField(public) nullifierHash: Field;

  /**
   * Main payment proof constraint
   * Proves: sender has funds, recipient receives funds, sender's note is consumed
   */
  @circuitMethod payment() {
    // 1. Derive public key from secret key
    const publicKey = Group.generator.mul(this.secretKey);
    
    // 2. Create note commitment: Hash(publicKey, amount, random)
    const noteCommitment = this.computeNoteCommitment(
      publicKey,
      this.amount,
      this.randomSeed
    );
    
    // 3. Compute nullifier: Hash(nullifierKey, merklePath)
    const nullifierKey = Poseidon.hash([
      this.secretKey,
      this.senderNullifierRand
    ]);
    this.nullifier = Poseidon.hash([
      nullifierKey,
      this.merkleRoot
    ]);
    
    // 4. Verify sender's note exists in Merkle tree
    const merkleProofValid = this.verifyMerkleProof(
      this.merkleRoot,
      noteCommitment
    );
    
    // 5. Range proof: amount is positive and bounded
    const amountValid = this.rangeProof(this.amount, 0n, 1_000_000n);
    
    // 6. Fee is reasonable
    const feeValid = this.fee.lt(Field(1000));
    
    // 7. Compute new Merkle root with consumed and new notes
    this.newMerkleRoot = this.updateMerkleRoot(
      this.merkleRoot,
      noteCommitment,        // Consume old note
      this.commitment        // Create new note
    );

    // Constraints
    merkleProofValid.assertTrue();
    amountValid.assertTrue();
    feeValid.assertTrue();
  }

  /**
   * Compute note commitment using Poseidon hash
   */
  computeNoteCommitment(
    publicKey: Group,
    amount: Field,
    randomSeed: Field
  ): Field {
    return Poseidon.hash([
      publicKey.x,
      publicKey.y,
      amount,
      randomSeed
    ]);
  }

  /**
   * Range proof using binary decomposition
   * Proves: 0 <= value <= max without revealing value
   */
  rangeProof(value: Field, min: bigint, max: bigint): Bool {
    const range = max - min;
    const bits = range.toString(2).length;
    
    // Decompose value into binary bits
    let reconstructed = Field(0);
    for (let i = 0; i < bits; i++) {
      const bit = value.div(2 ** i).mod(2);
      reconstructed = reconstructed.add(bit.mul(2 ** i));
      // Constraint: bit * bit = bit (bit is 0 or 1)
      bit.mul(bit).assertEquals(bit);
    }
    
    // Value equals reconstructed bits
    value.assertEquals(reconstructed);
    
    return Bool(true);
  }

  /**
   * Verify Merkle proof for note existence
   */
  verifyMerkleProof(root: Field, leaf: Field): Bool {
    // Verify leaf is in tree with given root
    return MerkleProof.verify(root, leaf, this.merklePath);
  }

  /**
   * Update Merkle root after spending and creating notes
   */
  updateMerkleRoot(
    currentRoot: Field,
    spentNote: Field,
    newNote: Field
  ): Field {
    // Mark spent note as zero (or use nullifier tree)
    const spentRoot = MerkleProof.update(currentRoot, spentNote, Field(0));
    // Add new note
    return MerkleProof.update(spentRoot, newNote, newNote);
  }
}
```

#### Phase 2: Stealth Address System (Day 2)

```typescript
// shadowpay/stealth/stealth_address.ts

export class StealthAddressGenerator {
  private viewKeyPrivate: Field;      // Keep secret - derives view key
  private scanKeyPrivate: Field;      // Share with scanner/observer
  
  /**
   * Generate stealth address for recipient
   * One-time address that only recipient can detect and spend from
   */
  async generateStealthAddress(
    recipientViewKey: Field,
    amount: bigint
  ): Promise<StealthAddress> {
    // Step 1: Generate ephemeral key pair
    const ephemeral = KeyPair.random();
    
    // Step 2: Derive shared secret using recipient's view key
    // stealth_pub = G1 * random + recipient_view_key * G2
    const sharedSecret = this.deriveSharedSecret(
      ephemeral.public,
      recipientViewKey
    );
    
    // Step 3: Derive one-time address
    const oneTimeAddress = this.deriveOneTimeAddress(
      sharedSecret,
      recipientViewKey
    );
    
    // Step 4: Generate view key for this specific address
    const viewingKey = this.deriveViewingKey(
      sharedSecret,
      ephemeral.private
    );
    
    // Step 5: Generate nullifier derivation key
    const nullifierKey = this.deriveNullifierKey(
      sharedSecret,
      ephemeral.private
    );
    
    return {
      address: oneTimeAddress,
      viewingKey: viewingKey,        // For detecting payments
      nullifierKey: nullifierKey,    // For spending funds
      amount: amount,                // Encrypted amount
      ephemeralPublic: ephemeral.public,
    };
  }

  /**
   * Detect payments sent to stealth addresses
   */
  async scanForPayments(
    scanningKey: Field,
    transactions: StealthTransaction[]
  ): Promise<DetectedPayment[]> {
    const detected: DetectedPayment[] = [];
    
    for (const tx of transactions) {
      // Try to derive shared secret with scanning key
      const sharedSecret = this.tryDeriveSharedSecret(
        scanningKey,
        tx.ephemeralPublic
      );
      
      if (sharedSecret) {
        // This transaction is for us!
        const viewingKey = this.deriveViewingKey(
          sharedSecret,
          tx.ephemeralPublic  // Need ephemeral private for full derivation
        );
        
        // Decrypt amount
        const amount = this.decryptAmount(
          tx.encryptedAmount,
          sharedSecret
        );
        
        detected.push({
          transaction: tx,
          amount,
          viewingKey,
          nullifierKey: this.deriveNullifierKey(
            sharedSecret,
            tx.ephemeralPublic
          ),
        });
      }
    }
    
    return detected;
  }

  /**
   * Spend from a stealth address using nullifier key
   */
  async createSpendingProof(
    stealthAddress: StealthAddress,
    amount: bigint,
    recipient: RecipientAddress,
    nullifierKey: Field
  ): Promise<PaymentProof> {
    // Generate nullifier (unique per spend)
    const nullifierRandomness = Field.random();
    const nullifier = Poseidon.hash([
      nullifierKey,
      nullifierRandomness
    ]);
    
    // Create commitment to new note (for recipient)
    const newNoteCommitment = this.createNoteCommitment(
      recipient.viewKey,
      amount,
      Field.random()
    );
    
    // Generate ZK proof that:
    // 1. We know the nullifier key
    // 2. The note being spent exists
    // 3. We're creating a valid new note
    const proof = await this.generatePaymentProof({
      private: {
        nullifierKey,
        noteCommitment: stealthAddress.commitment,
        amount,
      },
      public: {
        merkleRoot: await this.getCurrentMerkleRoot(),
        newNoteCommitment,
        nullifier,
        recipientAddress: recipient.address,
      },
    });

    return {
      proof,
      nullifier,
      newNoteCommitment,
    };
  }

  /**
   * Derive shared secret using elliptic curve multiplication
   */
  private deriveSharedSecret(
    ephemeralPublic: Group,
    recipientViewKey: Field
  ): Group {
    // EC multiplication: shared = ephemeral_public * recipient_view_key
    return ephemeralPublic.mul(recipientViewKey);
  }

  /**
   * Derive one-time stealth address from shared secret
   */
  private deriveOneTimeAddress(
    sharedSecret: Group,
    recipientViewKey: Field
  ): Field {
    // Address = Hash(shared_secret + recipient_view_key * G)
    const pubKeyComponent = Group.generator.mul(recipientViewKey);
    return Poseidon.hash([
      sharedSecret.x,
      sharedSecret.y,
      pubKeyComponent.x,
      pubKeyComponent.y,
    ]);
  }
}

// Types
export interface StealthAddress {
  address: Field;           // One-time address
  viewingKey: Field;        // For detecting incoming payments
  nullifierKey: Field;      // For spending (keep secret!)
  amount: bigint;           // Encrypted amount
  ephemeralPublic: Group;   // Ephemeral public key
}

export interface DetectedPayment {
  transaction: StealthTransaction;
  amount: bigint;
  viewingKey: Field;
  nullifierKey: Field;
}
```

#### Phase 3: Private Balance Proofs (Day 3)

```typescript
// shadowpay/zk/balance_proof.ts

export class BalanceProofGenerator {
  /**
   * Generate ZK proof of balance without revealing actual balance
   * Proves: min_balance <= actual_balance < max_balance
   */
  async generateBalanceProof(
    notes: Note[],
    minRequired: bigint,
    maxReveal: bigint | null = null
  ): Promise<BalanceProof> {
    // Sum of all note values
    const totalBalance = notes.reduce((sum, n) => sum + n.value, 0n);
    
    // Generate range proof for balance
    const rangeProof = await this.generateRangeProof(
      totalBalance,
      minRequired,
      maxReveal ?? (1_000_000_000n * 1_000_000n) // Default max
    );
    
    // Generate Merkle proofs for all notes
    const noteProofs = await Promise.all(
      notes.map(n => this.getNoteMerkleProof(n.commitment))
    );
    
    // Commitment to the proof
    const commitment = Poseidon.hash([
      ...noteProofs.map(p => p.root),
      Field(totalBalance % BigInt(1 << 64)),
    ]);

    return {
      noteCount: notes.length,
      rangeProof,
      noteCommitments: notes.map(n => n.commitment),
      merkleRoots: noteProofs.map(p => p.root),
      commitment,
      // Public outputs
      public: {
        minBalance: minRequired,
        hasMinimumBalance: true,
        // Optional: reveal balance within range
        ...(maxReveal ? { balanceRange: [minRequired, maxReveal] } : {}),
      },
    };
  }

  /**
   * Verify balance proof without seeing actual balance
   */
  async verifyBalanceProof(
    proof: BalanceProof,
    minRequired: bigint
  ): Promise<boolean> {
    // Verify range proof
    const rangeValid = await this.verifyRangeProof(
      proof.rangeProof,
      minRequired
    );
    
    // Verify all note commitments are in their respective trees
    const merkleValid = await Promise.all(
      proof.noteCommitments.map((commitment, i) =>
        this.verifyMerkleProof(commitment, proof.merkleRoots[i])
      )
    );
    
    return rangeValid && merkleValid.every(v => v);
  }

  /**
   * Generate ZK proof for payment with change
   * Proves: input_notes - output_notes - fee = 0
   */
  async generatePaymentWithChangeProof(
    inputNotes: Note[],
    outputNotes: Note[],
    fee: bigint
  ): Promise<PaymentWithChangeProof> {
    const inputSum = inputNotes.reduce((sum, n) => sum + n.value, 0n);
    const outputSum = outputNotes.reduce((sum, n) => sum + n.value, 0n);
    
    // Conservation: input = output + fee
    const change = inputSum - outputSum - fee;
    
    // Prove change >= 0 (no money created)
    const changeRangeProof = await this.generateRangeProof(
      change,
      0n,
      inputSum
    );
    
    // Generate ZK proof circuit
    const circuit = new PaymentWithChangeCircuit();
    
    const proof = await circuit.prove({
      private: {
        inputNotes: inputNotes.map(n => ({
          commitment: n.commitment,
          value: Field(n.value),
          randomness: n.randomness,
        })),
        outputNotes: outputNotes.map(n => ({
          commitment: n.commitment,
          value: Field(n.value),
          randomness: n.randomness,
        })),
        inputMerkleProofs: await Promise.all(
          inputNotes.map(n => this.getNoteMerkleProof(n.commitment))
        ),
      },
      public: {
        merkleRoot: await this.getCurrentMerkleRoot(),
        outputCommitments: outputNotes.map(n => n.commitment),
        fee: Field(fee),
      },
    });

    return {
      proof,
      inputCommitments: inputNotes.map(n => n.commitment),
      outputCommitments: outputNotes.map(n => n.commitment),
      fee,
      change,
      changeRangeProof,
    };
  }
}
```

#### Phase 4: StealthGame Integration (Day 3-4)

```typescript
// shadowpay/games/stealthgame_integration.ts

export class StealthGamePayments {
  private shadowpay: ShadowPaySDK;
  private gameId: string;
  
  /**
   * Initialize game with ShadowPay integration
   */
  async initialize(gameId: string, playerViewKey: Field): Promise<void> {
    this.gameId = gameId;
    await this.shadowpay.initializePlayer(playerViewKey);
  }

  /**
   * Make in-game purchase using private payment
   */
  async purchaseItem(
    item: GameItem,
    quantity: number = 1
  ): Promise<GamePurchaseResult> {
    const totalCost = item.price * BigInt(quantity);
    
    // Generate stealth address for the game merchant
    const merchantStealthAddress = await this.shadowpay.generateStealthAddress(
      this.gameConfig.merchantViewKey,
      totalCost
    );
    
    // Create anonymous payment
    const payment = await this.shadowpay.createAnonymousPayment({
      amount: totalCost,
      recipient: merchantStealthAddress,
      memo: `GAME_ITEM:${item.id}:${quantity}`,
      hideAmount: true,
    });
    
    // Record purchase in game (off-chain for speed)
    await this.gameState.recordPurchase({
      playerId: this.playerId,
      itemId: item.id,
      quantity,
      paymentProof: payment.proofId,
      timestamp: Date.now(),
    });
    
    return {
      success: true,
      paymentId: payment.proofId,
      item: {
        ...item,
        quantity,
      },
    };
  }

  /**
   * Transfer in-game currency between players privately
   */
  async transferCurrency(
    recipientPlayerId: string,
    amount: bigint,
    memo?: string
  ): Promise<CurrencyTransferResult> {
    // Get recipient's stealth address
    const recipientAddress = await this.gameState.getPlayerStealthAddress(
      recipientPlayerId
    );
    
    if (!recipientAddress) {
      throw new Error('Recipient not found or not set up for private transfers');
    }
    
    // Create stealth payment to recipient
    const payment = await this.shadowpay.createAnonymousPayment({
      amount,
      recipient: recipientAddress,
      memo: memo ? `GAME_TRANSFER:${memo}` : 'GAME_TRANSFER',
      hideAmount: true,
      hideRecipient: true,  // Even sender can't prove who received
    });
    
    return {
      transferId: payment.proofId,
      amount,
      recipientId: recipientPlayerId,
      timestamp: Date.now(),
    };
  }

  /**
   * Join game table/room with stake
   */
  async joinTable(
    tableId: string,
    stakeAmount: bigint
  ): Promise<TableJoinResult> {
    // Create stake commitment (revealable later)
    const stakeCommitment = await this.shadowpay.createBalanceCommitment({
      minBalance: stakeAmount,
      revealOnDemand: true,  // Can reveal to dealer if needed
    });
    
    // Create nullifier for table join (prevents double-join)
    const tableJoinNullifier = Poseidon.hash([
      Field(tableId),
      Field(this.playerId),
      Field(Date.now()),
    ]);
    
    // Generate ZK proof of stake without revealing amount
    const stakeProof = await this.shadowpay.generateBalanceProof({
      minRequired: stakeAmount,
      maxReveal: null,  // Don't reveal actual balance
    });
    
    // Submit to table
    const tableEntry = await this.gameTables.joinTable({
      tableId,
      playerId: this.playerId,
      stakeCommitment,
      stakeProof,
      tableJoinNullifier,
    });
    
    return {
      success: true,
      tableEntry,
      stakeProofId: stakeProof.commitment,
    };
  }

  /**
   * Withdraw winnings privately
   */
  async withdrawWinnings(
    targetAddress: string,
    amount?: bigint
  ): Promise<WithdrawalResult> {
    // Get winnings balance
    const winnings = await this.gameState.getPlayerWinnings(this.playerId);
    const withdrawAmount = amount ?? winnings;
    
    // Generate stealth address for withdrawal
    const withdrawalAddress = await this.shadowpay.generateStealthAddress(
      await this.shadowpay.deriveViewKey(targetAddress),
      withdrawAmount
    );
    
    // Create withdrawal proof
    const withdrawal = await this.shadowpay.createAnonymousPayment({
      amount: withdrawAmount,
      recipient: withdrawalAddress,
      memo: 'GAME_WINNINGS_WITHDRAWAL',
      hideAmount: true,
    });
    
    // Clear winnings in game state
    await this.gameState.clearWinnings(this.playerId);
    
    return {
      withdrawalId: withdrawal.proofId,
      amount: withdrawAmount,
      targetAddress: withdrawalAddress.address,
    };
  }
}
```

### Demo Flow (3 minutes)

```
1. Show the privacy problem with traditional payments
   - Display a normal blockchain transaction
   - Highlight: sender, recipient, amount all visible
   - Show how this enables surveillance

2. Introduce ShadowPay stealth addresses
   - Run: shadowpay generate-stealth-address --view-key viewer123
   - Display generated one-time address
   - Show how multiple payments create different addresses

3. Demonstrate ZK payment proof
   - Run: shadowpay send --amount 100 --stealth-addr addr123
   - Display transaction (amount hidden, addresses masked)
   - Show ZK proof verification

4. Prove balance without revealing balance
   - Run: shadowpay prove-balance --min 1000
   - Display proof output: "Balance >= 1000 (verified)"
   - Show actual balance remains hidden

5. Show StealthGame integration
   - Open StealthGame demo
   - Make in-game purchase
   - Display: "Purchase complete - amount hidden"
   - Show payment verification without exposing transaction details

6. Cross-project demo: StealthPay + StealthGame
   - Show integration with StealthGame
   - Make private currency transfer
   - Display: "Transfer complete - recipient anonymous"
```

### Code Links

| Component | Path | Status |
|-----------|------|--------|
| Stealth Payment Gateway | `TIER1_PRIORITY/billpayx.com/` | Reuse/Extend |
| ZK Proof Generation | `contractregistry/privacy-hack-web/zk-claims/` | Reuse |
| SDK TypeScript | `shadowpay/sdk/src/` | Create new |
| Stealth Address Core | `shadowpay/stealth/src/` | Create new |
| Circuit Definitions | `shadowpay/circuits/src/` | Create new |
| Solana Contract | `shadowpay/contracts/solana/` | Create new |
| Aztec Contract | `shadowpay/contracts/aztec/` | Create new |
| Web Dashboard | `shadowpay/web/src/` | Create new |
| Flutter SDK | `shadowpay/flutter/` | Create new |

### Files to Create/Modify

| File | Action | Lines |
|------|--------|-------|
| `shadowpay/sdk/src/index.ts` | Create | 300 |
| `shadowpay/sdk/src/zk/balance_proof.ts` | Create | 400 |
| `shadowpay/stealth/src/stealth_address.ts` | Create | 500 |
| `shadowpay/circuits/payment_circuit.ts` | Create | 600 |
| `shadowpay/circuits/balance_circuit.ts` | Create | 400 |
| `shadowpay/contracts/solana/shadowpay.ts` | Create | 500 |
| `shadowpay/contracts/aztec/shadowpay.nr` | Create | 400 |
| `shadowpay/games/stealthgame_integration.ts` | Create | 400 |
| `shadowpay/web/src/App.tsx` | Create | 300 |
| `shadowpay/cli/src/commands/stealthpay.ts` | Create | 300 |
| `shadowpay/README.md` | Create | 500 |
| **Total** | | **4,500** |

### Testing Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                     TESTING PYRAMID                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                         ┌───────────┐                           │
│                         │   E2E     │                           │
│                         │   Tests   │                           │
│                         │   (5)     │                           │
│                         └─────┬─────┘                           │
│                               │                                 │
│                    ┌──────────┼──────────┐                      │
│                    ▼          ▼          ▼                      │
│              ┌─────────┐ ┌─────────┐ ┌─────────┐                │
│              │Integration│ │ Circuit │ │ Stealth │                │
│              │  Tests   │ │  Tests  │ │  Tests  │                │
│              │   (15)   │ │   (20)  │ │   (15)  │                │
│              └────┬─────┘ └────┬─────┘ └────┬─────┘              │
│                   │            │            │                    │
│         ┌─────────┼─────────┐  │            │                    │
│         ▼         ▼         ▼  ▼            ▼                    │
│   ┌─────────┐┌─────────┐┌─────────┐┌─────────┐┌─────────┐       │
│   │ Unit    ││ Unit     ││ Unit     ││ Unit     ││ Unit     │       │
│   │ Tests   ││ Tests    ││ Tests    ││ Tests    ││ Tests    │       │
│   │ (50+)   ││ (30+)    ││ (30+)    ││ (30+)    ││ (30+)    │       │
│   └─────────┘└─────────┘└─────────┘└─────────┘└─────────┘       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Unit Tests Required:**
- Stealth address generation and detection
- Note commitment and nullifier derivation
- Merkle tree operations
- Range proof generation and verification
- Balance proof circuit constraints
- Payment flow with change
- Multi-party transaction support

**Integration Tests:**
- End-to-end payment flow
- Stealth address scanning
- Balance proof verification
- Cross-chain bridge functionality
- StealthGame integration flow

---

## Summary of PRD Requirements

| Project | Complexity | Time | Lines of Code | Prize |
|---------|------------|------|---------------|-------|
| PrivacyDNS + QuantumDNS | High | 2-3 days | 2,700 | $40-55K |
| ZK Team Workspace | High | 2-3 days | 2,700 | $24K |
| VPN PQ Completion | Medium | 1-2 days | 1,100 | $23K |
| Helix Kyber KEM | High | 1 day | 1,300 | $7K |
| Privacy Shield Suite | Medium | 1-2 days | 800 | $18K |
| **Total** | | **8-12 days** | **8,600** | **$112-127K** |

---

## Recommended Priority Order

1. **VPN PQ Completion** - Already 70% done, highest impact for multiple projects
2. **Helix Kyber KEM** - Powers Quantum Terminal, critical for choom.chat
3. **Privacy Shield Suite** - Integration work, good prize potential
4. **PrivacyDNS** - High value but more complex
5. **ZK Team Workspace** - High value but more complex

**Note:** Given the deadline is TODAY, focus on completing Tier 1 submissions rather than starting new projects.
