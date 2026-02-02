# PRODUCT REQUIREMENTS DOCUMENT: Remotion Video Production System

> **Version:** 1.0
> **Created:** 2026-02-02
> **Purpose:** Complete PRD for hackathon video production using Remotion
> **Status:** Ready for Implementation

---

## 1. EXECUTIVE SUMMARY

This document defines the requirements for creating 22 promotional videos for the Solana Privacy Hackathon using Remotion. The system will produce high-quality, consistent videos showcasing each project's unique value proposition.

| Metric | Value |
|--------|-------|
| Total Videos | 22 |
| Total Duration | ~17 minutes |
| Target Runtime | 35-60 seconds per video |
| Output Format | MP4 (1080p) |
| Rendering Time | ~90 minutes (parallel) |

---

## 2. FUNCTIONAL REQUIREMENTS

### 2.1 Core Video Components

| Req ID | Requirement | Priority | Status |
|--------|-------------|----------|--------|
| FR-001 | Video intro sequence with project name and tagline | P0 | Required |
| FR-002 | Problem statement section (8-10 seconds) | P0 | Required |
| FR-003 | Solution/demo section (15-20 seconds) | P0 | Required |
| FR-004 | Feature highlight section (10-15 seconds) | P1 | Required |
| FR-005 | Call-to-action section (5-7 seconds) | P0 | Required |
| FR-006 | Project-specific animations and visual effects | P0 | Required |
| FR-007 | Consistent branding across all videos | P1 | Required |

### 2.2 Animation Requirements

| Animation Type | Projects | Description |
|----------------|----------|-------------|
| Particle Effects | choom.chat, shadowpay | Floating particles representing encryption |
| Matrix Rain | matrix-privacy | Digital rain background effect |
| Code Typing | sdk-solana, silver.sh | Terminal-style code animation |
| Merkle Tree | zk.claims | Tree visualization with proof highlights |
| Shield | privacy-shield-suite | Animated shield icon for security |
| Vault | password-vault, priv.pass.xyz | Vault opening animation |
| Network Graph | helix-core, vpn-daemon | P2P network visualization |
| Game Sprites | thevirus.zip, shadowpay | Animated game characters |

### 2.3 Visual Design Requirements

#### Color Palette Standards
```
Primary Colors:
  - ChoOm: #9D00FF (Purple), #00D4FF (Cyan)
  - Finance: #00D26A (Green), #1E3A5F (Blue)
  - Security: #22C55E (Green), #3B82F6 (Blue)
  - ZK/Crypto: #9945FF (Solana), #6B3FA0 (Aztec)
  - Gaming: #39FF14 (Neon Green), #7C3AED (Purple)
  - Rust: #DEA584 (Orange)

Backgrounds:
  - Dark mode: #0A0A0F to #1A1A2E
  - Grid overlays for technical content
  - Animated gradients for transitions
```

#### Typography
```
Headlines: Inter Bold, 72pt
Subtitles: Inter Medium, 48pt
Body: Inter Regular, 32pt
Code: JetBrains Mono, 28pt
```

### 2.4 Technical Requirements

| Req ID | Requirement | Specification |
|--------|-------------|---------------|
| TR-001 | Composition Size | 1920x1080 (1080p) |
| TR-002 | Frame Rate | 30 fps |
| TR-003 | Duration | 35-60 seconds |
| TR-004 | Output Format | MP4 (H.264) |
| TR-005 | Audio | Optional background music |
| TR-006 | Rendering | Parallel support (4 concurrent) |

---

## 3. PROJECT-SPECIFIC REQUIREMENTS

### 3.1 TIER1_PRIORITY Projects

#### choom.chat (P0)
```
Sections:
  1. Intro: "Quantum-Secure Messaging" (5s)
  2. Problem: "Your messages aren't safe" (8s)
  3. Solution: Kyber-768 encryption demo (20s)
  4. Features: E2E, group chat, Matrix integration (15s)
  5. CTA: "Message securely today" (5s)

Animations:
  - Particle field for quantum effect
  - Key exchange visualization
  - Mock chat interface with encryption indicators
```

#### sdk-solana (P0)
```
Sections:
  1. Intro: "Privacy SDK for Solana" (5s)
  2. Problem: "Building privacy is hard" (8s)
  3. Solution: SDK installation & code (20s)
  4. Features: ZK, stealth, transfers (12s)
  5. CTA: "npm install today" (5s)

Animations:
  - Terminal typing effect
  - API call flow diagram
  - ZK proof visualization
```

#### billpayx.com (P0)
```
Sections:
  1. Intro: "Stealth Payments" (5s)
  2. Problem: "Payment privacy is broken" (8s)
  3. Solution: Stealth address flow (20s)
  4. Features: Scanning, privacy, speed (12s)
  5. CTA: "Pay privately" (5s)

Animations:
  - Address generation animation
  - Payment flow diagram
  - Scanning radar effect
```

#### bytes.zip (P0)
```
Sections:
  1. Intro: "Privacy Cash" (5s)
  2. Problem: "Digital privacy is gone" (8s)
  3. Solution: File encryption demo (20s)
  4. Features: Secure, fast, private (12s)
  5. CTA: "Get bytes.zip" (5s)

Animations:
  - File encryption lock animation
  - Transfer progress bar
  - Zipper effect
```

#### zk.claims (P0)
```
Sections:
  1. Intro: "Zero-Knowledge Claims" (5s)
  2. Problem: "Prove without revealing" (8s)
  3. Solution: Merkle tree demo (20s)
  4. Features: Privacy, scalability, ZK (12s)
  5. CTA: "Prove it" (5s)

Animations:
  - Merkle tree growth
  - Proof generation animation
  - Verification checkmark
```

#### shadowpay (P0)
```
Sections:
  1. Intro: "Shadow Pay" (5s)
  2. Problem: "Privacy payments needed" (8s)
  3. Solution: ZK + Game mechanics (25s)
  4. Features: Stealth, rewards, fun (15s)
  5. CTA: "Enter the shadow" (5s)

Animations:
  - Shadow avatar animation
  - Game character movement
  - ZK payment flow
```

### 3.2 TIER2_DEVELOPMENT Projects

#### helix-core (P1)
```
Sections:
  1. Intro: "Helix Core" (5s)
  2. Problem: "PQC in Rust is hard" (8s)
  3. Solution: Kyber implementation (20s)
  4. Features: Fast, secure, P2P (12s)
  5. CTA: "Build with Helix" (5s)

Animations:
  - Rust code highlighting
  - Network node connection
  - Performance metrics
```

#### vpn-daemon (P1)
```
Sections:
  1. Intro: "Post-Quantum VPN" (5s)
  2. Problem: "VPNs aren't quantum-safe" (8s)
  3. Solution: PQ handshake demo (20s)
  4. Features: Tunnel, encryption, speed (12s)
  5. CTA: "Connect securely" (5s)

Animations:
  - Tunnel visualization
  - Handshake animation
  - Connection status
```

### 3.3 Remaining Projects (P1/P2)

| Project | Duration | Key Visual | CTA |
|---------|----------|------------|-----|
| silver.sh | 40s | Terminal | npm install |
| privacy-sdk | 40s | API flow | Build faster |
| matrix-privacy | 45s | Matrix rain | Chat securely |
| cli-gitnpm | 40s | Git graph | Try gitnpm |
| thevirus.zip | 50s | Game sprites | Play now |
| priv.pass.xyz | 40s | Vault | Secure your pass |
| password-vault | 45s | Password meter | Protect passwords |
| deidentify.ai | 45s | Neural net | AI privacy |
| helix | 45s | Helix logo | Unified PQC |
| privacy-shield-suite | 45s | Shield | Mobile privacy |
| lnk.zip | 35s | Link lock | Share securely |
| dasr-marketplace | 45s | Charts | Trade privately |
| zk-email | 45s | Email lock | Verify privately |
| helix-flutter | 40s | Mobile app | Mobile PQC |

---

## 4. TECHNICAL ARCHITECTURE

### 4.1 Component Library

```
src/components/
├── ui/
│   ├── TitleCard.tsx      // Project name display
│   ├── SubtitleCard.tsx   // Tagline display
│   ├── LogoAnimation.tsx  // Animated logos
│   └── ProgressBar.tsx    // Section progress
├── animations/
│   ├── ParticleField.tsx  // Quantum particles
│   ├── MatrixRain.tsx     // Matrix effect
│   ├── CodeTyping.tsx     // Terminal typing
│   ├── CryptoAnimation.tsx // Encryption viz
│   ├── MerkleTree.tsx     // ZK tree
│   ├── Shield.tsx         // Shield anim
│   ├── Vault.tsx          // Vault anim
│   └── NetworkGraph.tsx   // P2P network
└── backgrounds/
    ├── GradientBackground.tsx
    ├── GridBackground.tsx
    └── AnimatedGradient.tsx
```

### 4.2 Template System

```
src/templates/
├── StandardVideo.tsx      // 5-section standard
├── TechDemoVideo.tsx      // Code-focused
├── GamingVideo.tsx        // Game-centric
└── MinimalVideo.tsx       // Simple/clean
```

### 4.3 Data Configuration

```typescript
// src/data/project-config.ts
export interface ProjectVideoConfig {
  projectId: string;
  name: string;
  tagline: string;
  duration: number;
  colorPalette: string[];
  sections: SectionConfig[];
  animations: string[];
  assets: AssetConfig[];
}

export const projectConfigs: ProjectVideoConfig[] = [
  {
    projectId: 'choom-chat',
    name: 'ChoOm.chat',
    tagline: 'Quantum-Secure Messaging',
    duration: 60,
    colorPalette: ['#9D00FF', '#00D4FF', '#0A0A0F'],
    sections: [
      { name: 'intro', duration: 5 },
      { name: 'problem', duration: 8 },
      { name: 'solution', duration: 20 },
      { name: 'features', duration: 15 },
      { name: 'cta', duration: 5 },
    ],
    animations: ['particles', 'key-exchange'],
    assets: ['logo', 'chat-mockup'],
  },
  // ... all projects
];
```

---

## 5. DEPENDENCIES

### 5.1 Package Dependencies

```json
{
  "dependencies": {
    "@remotion/cli": "^4.0",
    "@remotion/next": "^4.0",
    "@remotion/player": "^4.0",
    "@remotion/three": "^4.0",
    "react": "^18.2",
    "react-dom": "^18.2",
    "framer-motion": "^10.16",
    "lucide-react": "^0.294",
    "tailwindcss": "^3.4"
  }
}
```

### 5.2 Asset Dependencies

| Asset Type | Source | Format |
|------------|--------|--------|
| Project Logos | Individual projects | SVG/PNG |
| Background Music | Royalty-free | MP3 |
| Icons | Lucide React | SVG |
| Fonts | Google Fonts | WOFF2 |

---

## 6. QUALITY REQUIREMENTS

### 6.1 Video Quality Standards
- Resolution: 1920x1080 (1080p)
- Frame rate: 30 fps constant
- Bitrate: 10+ Mbps
- Audio: 128kbps (if included)

### 6.2 Consistency Standards
- Same intro/outro templates
- Consistent typography across all videos
- Cohesive color usage per project
- Smooth transitions between sections

### 6.3 Performance Standards
- Render time: < 5 minutes per 60s video
- Parallel rendering: 4 concurrent
- Total render time: < 90 minutes

---

## 7. DELIVERABLES

| Deliverable | Format | Location |
|-------------|--------|----------|
| Source Code | TypeScript/React | `remotion-videos/src/` |
| Rendered Videos | MP4 | `remotion-videos/public/out/` |
| Configuration | JSON/TS | `remotion-videos/src/data/` |
| Documentation | Markdown | `remotion-videos/README.md` |

---

## 8. ACCEPTANCE CRITERIA

### Video Acceptance Criteria
- [ ] Video plays without errors
- [ ] All text is readable (contrast check)
- [ ] Animations run smoothly
- [ ] Duration matches specification
- [ ] Project branding is visible
- [ ] CTA is clear and actionable

### Technical Acceptance Criteria
- [ ] All 22 videos render successfully
- [ ] Render times within acceptable range
- [ ] No console errors during render
- [ ] Output files are playable

---

## 9. RISK ASSESSMENT

| Risk | Impact | Mitigation |
|------|--------|------------|
| Long render times | Medium | Use parallel rendering |
| Inconsistent quality | High | Use templates and review |
| Missing assets | Medium | Create placeholders early |
| Design changes | Low | Use configurable colors |

---

## 10. IMPLEMENTATION ORDER

### Phase 1: Foundation (Day 1)
1. Set up Remotion project structure
2. Create base component library
3. Build video templates
4. Configure project data

### Phase 2: P0 Videos (Day 2)
5. Render choom.chat (priority 1)
6. Render sdk-solana (priority 2)
7. Render shadowpay (priority 3)
8. Render zk.claims (priority 4)
9. Render billpayx.com (priority 5)
10. Render bytes.zip (priority 6)

### Phase 3: P1 Videos (Day 3)
11-18. Render remaining TIER1 and TIER2 P1 projects

### Phase 4: P2 Videos (Day 4)
19-22. Render P2 projects

---

**Document Version:** 1.0
**Status:** Approved for Implementation
**Owner:** Remotion Video Production System

---

*Related Documents:*
- `REMOTION_VIDEO_PLAN.md` - Production schedule and details
- `HACKATHON_PLAN.md` - Project priorities
- `PRD-MASTER-INTAKE.md` - Master requirements
