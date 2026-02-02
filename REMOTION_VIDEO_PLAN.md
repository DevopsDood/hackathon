# REMOTION VIDEO PRODUCTION PLAN - Solana Privacy Hackathon

> **Created:** 2026-02-02
> **Purpose:** Complete video production plan for all 24 hackathon projects
> **Tool:** Remotion (react-motiongraphics.io)
> **Output Directory:** `remotion-videos/`

---

## PROJECT INVENTORY SUMMARY

| Tier | Count | Projects |
|------|-------|----------|
| TIER1_PRIORITY | 14 | billpayx.com, bytes.zip, choom.chat, cli-gitnpm, dasr-marketplace, deidentify.ai, lnk.zip, matrix-privacy, privacy-sdk, priv.pass.xyz, sdk-solana, silver.sh, thevirus.zip, zk.claims |
| TIER2_DEVELOPMENT | 7 | helix, helix-core, helix-flutter, password-vault, privacy-shield-suite, vpn-daemon, zk-email |
| TIER3_CONCEPTS | 1 | shadowpay |
| **TOTAL** | **22** | |

---

## VIDEO PRODUCTION SPECIFICATIONS

### Standard Video Config (All Projects)

```typescript
// remotion.config.ts (shared)
import { Config } from '@remotion/next';

export const Config: Config = {
  compositionWidth: 1920,
  compositionHeight: 1080,
  frameRate: 30,
  durationInSeconds: 45,
};
```

### Video Structure Template

```
remotion-videos/
├── src/
│   ├── components/
│   │   ├── Intro.tsx           // 5s - Project name + tagline
│   │   ├── Problem.tsx         // 8s - What problem it solves
│   │   ├── Solution.tsx        // 10s - How it works
│   │   ├── Demo.tsx            // 15s - Live demo simulation
│   │   └── CTA.tsx             // 7s - Call to action
│   ├── assets/
│   │   ├── logos/              // Project logos
│   │   ├── animations/         // Lottie/JSON animations
│   │   └── backgrounds/        // Gradient backgrounds
│   ├── data/
│   │   └── project-data.ts     // Project-specific data
│   └── Root.tsx                // Main composition
├── compositions/
│   └── [project-name]/
│       ├── index.tsx
│       └── config.ts
└── package.json
```

---

## PROJECT VIDEO PLAN - TIER1_PRIORITY

### 1. choom.chat (Post-Quantum Messaging)
| Field | Value |
|-------|-------|
| **Duration** | 60s (extended) |
| **Category** | Best Privacy App ($25K) |
| **Style** | Cyberpunk / Quantum aesthetic |
| **Key Visuals** | Encryption particles, key exchange animation, Matrix-style chat bubbles |
| **Color Palette** | Neon purple (#9D00FF), Cyber blue (#00D4FF), Dark background (#0A0A0F) |
| **Sections** | 1. Quantum encryption intro (10s) 2. Kyber-768 demo (15s) 3. Chat UI walkthrough (20s) 4. Security metrics (10s) 5. CTA (5s) |
| **Assets Needed** | Logo animation, particle effects, mock chat interface |

### 2. billpayx.com (Stealth Payments)
| Field | Value |
|-------|-------|
| **Duration** | 45s |
| **Category** | Starpay ($3.5K) |
| **Style** | Financial / Secure |
| **Key Visuals** | Stealth address generation, payment flow, scanning animation |
| **Color Palette** | Professional blue (#1E3A5F), Security green (#00D26A), White |
| **Sections** | 1. Privacy payment problem (8s) 2. Stealth address demo (15s) 3. Transaction flow (15s) 4. Benefits (7s) |
| **Assets Needed** | Payment UI mockups, blockchain visualization |

### 3. sdk-solana (Core Privacy SDK)
| Field | Value |
|-------|-------|
| **Duration** | 50s |
| **Category** | Helius + Quicknode ($15K) |
| **Style** | Developer-focused / Technical |
| **Key Visuals** | Code snippets, API calls, ZK proof visualization |
| **Color Palette** | Dark code editor theme, Solana gradient (#9945FF → #14F195) |
| **Sections** | 1. SDK intro (8s) 2. Installation demo (10s) 3. Key features (15s) 4. Code example (12s) 5. CTA (5s) |
| **Assets Needed** | Terminal animation, API documentation mockups |

### 4. bytes.zip (Privacy Cash)
| Field | Value |
|-------|-------|
| **Duration** | 45s |
| **Category** | Privacy Cash ($6K) |
| **Style** | Modern / Sleek |
| **Key Visuals** | File encryption animation, secure transfer visualization |
| **Color Palette** | Zipper orange (#FF6B35), Dark gray (#1A1A2E), White |
| **Sections** | 1. Privacy cash concept (8s) 2. File encryption demo (15s) 3. Transfer flow (15s) 4. Security (7s) |
| **Assets Needed** | File icons, encryption lock animation |

### 5. zk.claims (ZK Proofs)
| Field | Value |
|-------|-------|
| **Duration** | 50s |
| **Category** | Aztec ($7.5K) |
| **Style** | Academic / Technical |
| **Key Visuals** | Merkle tree animation, proof generation, verification flow |
| **Color Palette** | Aztec purple (#6B3FA0), Gold accents, Dark background |
| **Sections** | 1. ZK concept intro (10s) 2. Merkle tree demo (15s) 3. Proof generation (15s) 4. Verification (10s) |
| **Assets Needed** | Tree visualization, math formula animations |

### 6. silver.sh (CLI Dev Tool)
| Field | Value |
|-------|-------|
| **Duration** | 40s |
| **Category** | Quicknode ($4K) |
| **Style** | Terminal / CLI-focused |
| **Key Visuals** | Command-line interface, output animations, status indicators |
| **Color Palette** | Terminal green (#00FF00), Dark background, Monospace fonts |
| **Sections** | 1. CLI intro (5s) 2. Command demo (15s) 3. Feature showcase (15s) 4. Install (5s) |
| **Assets Needed** | Terminal window mockups, command animations |

### 7. cli-gitnpm (Gitnpm CLI)
| Field | Value |
|-------|-------|
| **Duration** | 40s |
| **Category** | Quicknode ($3K) |
| **Style** | Developer / Git-focused |
| **Key Visuals** | Git branching visualization, npm package flow |
| **Color Palette** | Git orange (#F05032), NPM red (#CB3837), Dark |
| **Sections** | 1. Problem statement (8s) 2. Gitnpm workflow (15s) 3. Demo (12s) 5. Install (5s) |
| **Assets Needed** | Git graph animation, package icon animations |

### 8. matrix-privacy (Matrix E2E)
| Field | Value |
|-------|-------|
| **Duration** | 45s |
| **Category** | Arcium ($3K) |
| **Style** | Secure / Matrix-themed |
| **Key Visuals** | Matrix rain, encryption keys, group chat UI |
| **Color Palette** | Matrix green (#00FF41), Dark code background, White |
| **Sections** | 1. Matrix intro (8s) 2. E2E encryption (15s) 3. Group features (15s) 4. Security (7s) |
| **Assets Needed** | Matrix rain effect, key exchange animation |

### 9. privacy-sdk (Helius Toolkit)
| Field | Value |
|-------|-------|
| **Duration** | 40s |
| **Category** | Helius ($5K) |
| **Style** | SDK / API-focused |
| **Key Visuals** | API call flow, toolkit components, integration examples |
| **Color Palette** | Helius blue (#3B82F6), White, Light gray |
| **Sections** | 1. SDK overview (8s) 2. Toolkit components (15s) 3. Integration (12s) 4. CTA (5s) |
| **Assets Needed** | API documentation mockups, component icons |

### 10. priv.pass.xyz (Privacy Pass)
| Field | Value |
|-------|-------|
| **Duration** | 40s |
| **Category** | Inco ($2K) |
| **Style** | Vault / Security |
| **Key Visuals** | Vault opening animation, pass management UI |
| **Color Palette** | Vault gold (#FFD700), Dark steel (#2C3E50), White |
| **Sections** | 1. Pass problem (8s) 2. Vault demo (15s) 3. Features (12s) 4. Security (5s) |
| **Assets Needed** | Vault icon, lock animations |

### 11. thevirus.zip (Gamification)
| Field | Value |
|-------|-------|
| **Duration** | 50s |
| **Category** | Gamification ($2K) |
| **Style** | Gaming / Arcade |
| **Key Visuals** | Virus animation, game mechanics, stealth elements |
| **Color Palette** | Virus green (#39FF14), Dark background, Neon accents |
| **Sections** | 1. Game intro (8s) 2. Gameplay demo (20s) 3. Stealth mechanics (15s) 4. CTA (7s) |
| **Assets Needed** | Game character sprites, virus animation |

### 12. dasr-marketplace (DeFi)
| Field | Value |
|-------|-------|
| **Duration** | 45s |
| **Category** | Backup / DeFi |
| **Style** | DeFi / Trading |
| **Key Visuals** | Marketplace UI, trading charts, contract interactions |
| **Color Palette** | DeFi purple (#8B5CF6), Green (#10B981), Dark |
| **Sections** | 1. Marketplace intro (8s) 2. Trading demo (15s) 3. Contracts (15s) 4. CTA (7s) |
| **Assets Needed** | Chart animations, token icons |

### 13. deidentify.ai (AI Privacy)
| Field | Value |
|-------|-------|
| **Duration** | 45s |
| **Category** | Consumer Privacy ($3K) |
| **Style** | AI / Neural network |
| **Key Visuals** | Neural network animation, data anonymization flow |
| **Color Palette** | AI blue (#3B82F6), Purple (#8B5CF6), Dark |
| **Sections** | 1. AI privacy problem (8s) 2. De-identify demo (15s) 3. Neural process (15s) 4. Benefits (7s) |
| **Assets Needed** | Neural network visualization, data flow animation |

### 14. lnk.zip (Secure Links)
| Field | Value |
|-------|-------|
| **Duration** | 35s |
| **Category** | Consumer Privacy ($2K) |
| **Style** | Link / URL-focused |
| **Key Visuals** | Link transformation, secure sharing animation |
| **Color Palette** | Link blue (#3B82F6), White, Light gray |
| **Sections** | 1. Link security (8s) 2. Encryption demo (12s) 3. Sharing flow (10s) 4. CTA (5s) |
| **Assets Needed** | Link icons, lock animations |

---

## PROJECT VIDEO PLAN - TIER2_DEVELOPMENT

### 15. helix-core (Rust PQC)
| Field | Value |
|-------|-------|
| **Duration** | 50s |
| **Category** | Post-Quantum ($5K) |
| **Style** | High-performance / System |
| **Key Visuals** | Rust code, Kyber implementation, P2P network |
| **Color Palette** | Rust orange (#DEA584), Dark background, Code syntax |
| **Sections** | 1. Core intro (8s) 2. Kyber Rust impl (15s) 3. P2P network (15s) 4. Performance (12s) |
| **Assets Needed** | Rust logo animation, network graph |

### 16. vpn-daemon (Post-Quantum VPN)
| Field | Value |
|-------|-------|
| **Duration** | 50s |
| **Category** | Post-Quantum Security ($5K) |
| **Style** | Security / Infrastructure |
| **Key Visuals** | VPN tunnel animation, PQ handshake, connection flow |
| **Color Palette** | Security blue (#1E40AF), Green (#16A34A), Dark |
| **Sections** | 1. VPN problem (8s) 2. PQ handshake (15s) 3. Tunnel demo (15s) 4. Security (12s) |
| **Assets Needed** | Tunnel animation, connection icons |

### 17. helix (Unified PQC)
| Field | Value |
|-------|-------|
| **Duration** | 45s |
| **Category** | Post-Quantum ($5K) |
| **Style** | Unified / Cross-platform |
| **Key Visuals** | Helix logo, platform icons, unified architecture |
| **Color Palette** | Helix gradient (Purple to blue), Dark |
| **Sections** | 1. Helix intro (8s) 2. Unified architecture (15s) 3. Cross-platform (15s) 4. CTA (7s) |
| **Assets Needed** | Helix logo animation, platform icons |

### 18. helix-flutter (Mobile PQC)
| Field | Value |
|-------|-------|
| **Duration** | 40s |
| **Category** | Mobile Privacy |
| **Style** | Mobile-first / Flutter |
| **Key Visuals** | Mobile device, app interface, PQC on mobile |
| **Color Palette** | Flutter blue (#42A5F5), Dark, White |
| **Sections** | 1. Mobile intro (8s) 2. App demo (15s) 3. PQC mobile (12s) 4. Install (5s) |
| **Assets Needed** | Phone mockups, app screenshots |

### 19. password-vault (Password Manager)
| Field | Value |
|-------|-------|
| **Duration** | 45s |
| **Category** | Privacy Cash ($6K) |
| **Style** | Security / Vault |
| **Key Visuals** | Password strength meter, vault UI, HIBP integration |
| **Color Palette** | Security green (#22C55E), Dark, Gold |
| **Sections** | 1. Password problem (8s) 2. Vault demo (15s) 3. HIBP check (12s) 4. Security (10s) |
| **Assets Needed** | Password meter animation, vault icons |

### 20. privacy-shield-suite (Mobile Shield)
| Field | Value |
|-------|-------|
| **Duration** | 45s |
| **Category** | Consumer Privacy |
| **Style** | Mobile / Protection |
| **Key Visuals** | Shield animation, mobile privacy indicators, VPN toggle |
| **Color Palette** | Shield blue (#0EA5E9), Dark, Green |
| **Sections** | 1. Mobile privacy (8s) 2. Shield features (15s) 3. Camera/mic block (15s) 4. CTA (7s) |
| **Assets Needed** | Shield icon, mobile mockups |

### 21. zk-email (ZK Email)
| Field | Value |
|-------|-------|
| **Duration** | 45s |
| **Category** | ZK / Email Privacy |
| **Style** | Email / Communication |
| **Key Visuals** | Email encryption, ZK proof for email, verification |
| **Color Palette** | Email blue (#3B82F6), Purple (#8B5CF6), Dark |
| **Sections** | 1. Email privacy (8s) 2. ZK email demo (15s) 3. Verification (15s) 4. CTA (7s) |
| **Assets Needed** | Email interface, lock animations |

---

## PROJECT VIDEO PLAN - TIER3_CONCEPTS

### 22. shadowpay (ZK Payments + Game)
| Field | Value |
|-------|-------|
| **Duration** | 60s (extended) |
| **Category** | Best ZK App ($43K combined) |
| **Style** | Gaming + Financial |
| **Key Visuals** | Shadow avatar, ZK proof flow, game integration |
| **Color Palette** | Shadow purple (#7C3AED), Dark, Neon accents |
| **Sections** | 1. Shadow concept (10s) 2. ZK payment (15s) 3. Game mechanics (20s) 4. Future (10s) 5. CTA (5s) |
| **Assets Needed** | Shadow avatar, game sprites, ZK visualizations |

---

## MASTER PRODUCTION TABLE

| # | Project | Tier | Duration | Category | Priority | Est. Render Time | Dependencies |
|---|---------|------|----------|----------|----------|-----------------|--------------|
| 1 | choom.chat | TIER1 | 60s | Best Privacy App ($25K) | P0 | 5 min | Kyber animation |
| 2 | sdk-solana | TIER1 | 50s | Helius/Quicknode ($15K) | P0 | 4 min | Code snippets |
| 3 | billpayx.com | TIER1 | 45s | Starpay ($3.5K) | P0 | 4 min | Payment UI |
| 4 | bytes.zip | TIER1 | 45s | Privacy Cash ($6K) | P0 | 4 min | File encrypt |
| 5 | zk.claims | TIER1 | 50s | Aztec ($7.5K) | P0 | 4 min | Merkle tree |
| 6 | shadowpay | TIER3 | 60s | Best ZK App ($43K) | P0 | 5 min | Game assets |
| 7 | silver.sh | TIER1 | 40s | Quicknode ($4K) | P1 | 3 min | Terminal |
| 8 | privacy-sdk | TIER1 | 40s | Helius ($5K) | P1 | 3 min | API docs |
| 9 | helix-core | TIER2 | 50s | Post-Quantum ($5K) | P1 | 4 min | Rust code |
| 10 | vpn-daemon | TIER2 | 50s | Post-Quantum Security ($5K) | P1 | 4 min | Tunnel anim |
| 11 | matrix-privacy | TIER1 | 45s | Arcium ($3K) | P1 | 4 min | Matrix effect |
| 12 | cli-gitnpm | TIER1 | 40s | Quicknode ($3K) | P1 | 3 min | Git graph |
| 13 | thevirus.zip | TIER1 | 50s | Gamification ($2K) | P1 | 4 min | Game sprites |
| 14 | priv.pass.xyz | TIER1 | 40s | Inco ($2K) | P1 | 3 min | Vault icon |
| 15 | password-vault | TIER2 | 45s | Privacy Cash ($6K) | P2 | 4 min | Password meter |
| 16 | deidentify.ai | TIER1 | 45s | Consumer Privacy ($3K) | P2 | 4 min | Neural net |
| 17 | helix | TIER2 | 45s | Post-Quantum ($5K) | P2 | 4 min | Helix logo |
| 18 | privacy-shield-suite | TIER2 | 45s | Consumer Privacy | P2 | 4 min | Shield icon |
| 19 | lnk.zip | TIER1 | 35s | Consumer Privacy ($2K) | P2 | 3 min | Link icons |
| 20 | dasr-marketplace | TIER1 | 45s | DeFi (backup) | P2 | 4 min | Charts |
| 21 | zk-email | TIER2 | 45s | ZK / Email | P2 | 4 min | Email UI |
| 22 | helix-flutter | TIER2 | 40s | Mobile Privacy | P2 | 3 min | Phone mockup |

---

## REMOTION PROJECT STRUCTURE

```
remotion-videos/
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
├── src/
│   ├── index.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── TitleCard.tsx
│   │   │   ├── SubtitleCard.tsx
│   │   │   ├── LogoAnimation.tsx
│   │   │   └── ProgressBar.tsx
│   │   ├── animations/
│   │   │   ├── ParticleField.tsx
│   │   │   ├── MatrixRain.tsx
│   │   │   ├── CodeTyping.tsx
│   │   │   └── CryptoAnimation.tsx
│   │   └── backgrounds/
│   │       ├── GradientBackground.tsx
│   │       ├── GridBackground.tsx
│   │       └── AnimatedGradient.tsx
│   ├── compositions/
│   │   ├── templates/
│   │   │   ├── StandardVideo.tsx
│   │   │   ├── TechDemoVideo.tsx
│   │   │   └── GamingVideo.tsx
│   │   ├── TIER1/
│   │   │   ├── choom/
│   │   │   │   ├── index.tsx
│   │   │   │   └── config.ts
│   │   │   ├── billpayx/
│   │   │   ├── sdk-solana/
│   │   │   ├── bytes-zip/
│   │   │   ├── zk-claims/
│   │   │   ├── silver-sh/
│   │   │   ├── matrix-privacy/
│   │   │   ├── cli-gitnpm/
│   │   │   ├── privacy-sdk/
│   │   │   ├── priv-pass/
│   │   │   ├── thevirus/
│   │   │   ├── dasr-marketplace/
│   │   │   ├── deidentify-ai/
│   │   │   └── lnk-zip/
│   │   ├── TIER2/
│   │   │   ├── helix-core/
│   │   │   ├── vpn-daemon/
│   │   │   ├── helix/
│   │   │   ├── helix-flutter/
│   │   │   ├── password-vault/
│   │   │   ├── privacy-shield/
│   │   │   └── zk-email/
│   │   └── TIER3/
│   │       └── shadowpay/
│   ├── data/
│   │   ├── colors.ts
│   │   ├── fonts.ts
│   │   └── project-metadata.ts
│   └── styles/
│       └── globals.css
├── public/
│   ├── assets/
│   │   ├── logos/
│   │   ├── icons/
│   │   └── fonts/
│   └── out/
│       └── (rendered videos)
└── README.md
```

---

## QUICK RENDER COMMAND

```bash
# Render single video
npm run render -- --project=choom --output=out/choom.mp4

# Render all TIER1 (P0 first)
npm run render-all -- --tier=TIER1 --priority=P0

# Render with concurrency
npm run render-concurrent -- --concurrency=4
```

---

## ASSET REQUIREMENTS CHECKLIST

### Logos Needed (22 total)
- [ ] choom.chat
- [ ] billpayx.com
- [ ] sdk-solana
- [ ] bytes.zip
- [ ] zk.claims
- [ ] shadowpay
- [ ] silver.sh
- [ ] privacy-sdk
- [ ] matrix-privacy
- [ ] cli-gitnpm
- [ ] priv.pass.xyz
- [ ] thevirus.zip
- [ ] dasr-marketplace
- [ ] deidentify.ai
- [ ] lnk.zip
- [ ] helix-core
- [ ] vpn-daemon
- [ ] helix
- [ ] helix-flutter
- [ ] password-vault
- [ ] privacy-shield-suite
- [ ] zk-email

### Animations Needed
- [ ] Particle effects (choom, shadowpay)
- [ ] Matrix rain (matrix-privacy)
- [ ] Code typing (sdk-solana, silver.sh)
- [ ] Merkle tree (zk.claims)
- [ ] Shield animation (privacy-shield-suite)
- [ ] Vault opening (password-vault, priv.pass.xyz)
- [ ] Network graph (helix-core, vpn-daemon)
- [ ] Game sprites (thevirus.zip, shadowpay)

---

## RENDER ORDER (By Priority)

### Phase 1: P0 Projects (Render First)
1. choom.chat - Best Privacy App ($25K)
2. sdk-solana - Helius/Quicknode ($15K)
3. shadowpay - Best ZK App ($43K)
4. zk.claims - Aztec ($7.5K)
5. billpayx.com - Starpay ($3.5K)
6. bytes.zip - Privacy Cash ($6K)

### Phase 2: P1 Projects
7. matrix-privacy - Arcium ($3K)
8. silver.sh - Quicknode ($4K)
9. cli-gitnpm - Quicknode ($3K)
10. privacy-sdk - Helius ($5K)
11. helix-core - Post-Quantum ($5K)
12. vpn-daemon - Post-Quantum Security ($5K)
13. thevirus.zip - Gamification ($2K)
14. priv.pass.xyz - Inco ($2K)

### Phase 3: P2 Projects
15. password-vault - Privacy Cash ($6K)
16. deidentify.ai - Consumer Privacy ($3K)
17. helix - Post-Quantum ($5K)
18. privacy-shield-suite - Consumer Privacy
19. lnk.zip - Consumer Privacy ($2K)
20. dasr-marketplace - DeFi backup
21. zk-email - ZK Email
22. helix-flutter - Mobile Privacy

---

**Total Estimated Render Time:** ~90 minutes (with 4 concurrent renders)
**Total Video Output:** 22 videos (~17 minutes of content)

---

*Document Version: 1.0*
*Created: 2026-02-02*
*For: Solana Privacy Hackathon Video Production*
