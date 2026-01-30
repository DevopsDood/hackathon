# thevirus.zip - Privacy CTF Gamification Platform
## Product Requirements Document (PRD)

**Version:** 1.0.0  
**Last Updated:** 2026-01-30  
**Prize Category:** Gamification ($15,000)  
**Project Status:** ⚠️ CONCEPT STAGE - Implementation Required

---

## 1. Executive Summary

### 1.1 Honest Current State Assessment

**⚠️ CRITICAL: This project is NOT submission-ready.**

| Component | Status | Completeness |
|-----------|--------|--------------|
| Project Documentation | ✅ Partial | 30% - README exists with feature list |
| Backend Server | ❌ Missing | 0% - server.js referenced but doesn't exist |
| Source Code | ❌ Missing | 0% - src/ directory is empty |
| Challenge Content | ❌ Missing | 0% - No challenges implemented |
| Frontend UI | ❌ Missing | 0% - No user interface exists |
| Database | ❌ Missing | 0% - No data persistence layer |
| Smart Contracts | ❌ Missing | 0% - NFT badges not implemented |
| Authentication | ❌ Missing | 0% - No user auth system |
| Leaderboard | ❌ Missing | 0% - Not implemented |
| **OVERALL** | ⚠️ **Concept Only** | **~5%** |

### 1.2 What Exists Today

1. **[`package.json`](TIER1_PRIORITY/thevirus.zip/package.json:1)** - Basic Node.js project configuration
   - Express.js framework dependency
   - crypto-js for cryptographic operations
   - Placeholder scripts (start, dev)

2. **[`README.md`](TIER1_PRIORITY/thevirus.zip/README.md:1)** - Feature specification document
   - Lists 5 challenge categories
   - Describes desired features
   - Contains "Quick Start" instructions for non-existent code

3. **[`src/`](TIER1_PRIORITY/thevirus.zip/src/)** - Empty directory structure

### 1.3 The Vision

**thevirus.zip** is envisioned as a privacy-themed Capture The Flag (CTF) platform that gamifies privacy education. Players solve cryptography, steganography, and security challenges to learn real-world privacy skills while competing on leaderboards and earning NFT achievements.

**Target Audience:**
- Privacy-conscious individuals (18-35)
- Aspiring security professionals
- Developers learning about cryptography
- CTF enthusiasts looking for privacy-focused challenges

---

## 2. Project Overview and Purpose

### 2.1 Mission Statement

> "Make privacy education addictive through competitive gamification. Turn privacy-aware citizens into privacy-native defenders."

### 2.2 Core Value Proposition

1. **Learn by Doing**: Hands-on privacy challenges vs. passive reading
2. **Competitive Learning**: Leaderboards drive engagement
3. **Real Skills**: Challenges mirror actual privacy threats
4. **Verifiable Credentials**: NFT badges prove expertise
5. **Community**: Team challenges build privacy-conscious networks

### 2.3 Competition Alignment (Gamification $15K)

| Judging Criteria | How thevirus.zip Addresses It |
|------------------|------------------------------|
| **Engagement** | CTF format + Leaderboards + Team play |
| **Education** | Progressive learning path with tutorials |
| **Innovation** | Privacy-focused CTF (niche category) |
| **Impact** | Real-world privacy skills transfer |
| **Technical Merit** | Multi-layered architecture with ZK proofs, NFTs |

### 2.4 Unique Selling Points

1. **Privacy-First CTF**: Unlike generic CTFs, every challenge teaches privacy
2. **ZK Proof Integration**: First CTF to gamify zero-knowledge concepts
3. **NFT Achievements**: On-chain credentials for privacy expertise
4. **OSINT Privacy**: Teaches how to find AND remove personal data leaks
5. **Smart Contract Auditing**: Learn to find privacy leaks in contracts

---

## 3. Architecture and Design Decisions

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Web App   │  │   CLI Tool  │  │    Wallet Integration   │  │
│  │  (Next.js)  │  │  (Node.js)  │  │    (MetaMask/Phantom)   │  │
│  └──────┬──────┘  └──────┬──────┘  └─────────────────────────┘  │
└─────────┼────────────────┼──────────────────────────────────────┘
          │                │
          └────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API GATEWAY                               │
│              (Express.js + Rate Limiting + CORS)                 │
└─────────────────────────────────────────────────────────────────┘
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
┌─────────────────┐  ┌─────────────────┐
│   GAME SERVER   │  │  CHALLENGE      │
│   (Core API)    │  │  SANDBOXES      │
│                 │  │  (Isolated)     │
│ • Auth          │  │                 │
│ • Leaderboard   │  │ • Docker per    │
│ • Progress      │  │   challenge     │
│ • Team Mgmt     │  │ • Time-limited  │
│ • NFT Minting   │  │ • Flag capture  │
└────────┬────────┘  └─────────────────┘
         │
    ┌────┴────┬────────────┬────────────┐
    ▼         ▼            ▼            ▼
┌────────┐ ┌────────┐  ┌────────┐  ┌──────────┐
│PostgreSQL│ │ Redis  │  │  IPFS  │  │ Blockchain│
│  (Users, │ │(Cache, │  │(Assets)│  │  (NFTs)  │
│Progress) │ │Sessions│  │        │  │          │
└────────┘ └────────┘  └────────┘  └──────────┘
```

### 3.2 Technology Stack

| Layer | Technology | Justification |
|-------|------------|---------------|
| **Frontend** | Next.js 14 + Tailwind CSS | SSR for SEO, React for interactivity |
| **Backend** | Node.js + Express | Fast prototyping, JS ecosystem |
| **Database** | PostgreSQL + Redis | Relational data + caching/sessions |
| **Smart Contracts** | Solidity + Hardhat | EVM compatibility, mature tooling |
| **File Storage** | IPFS + Pinata | Decentralized challenge assets |
| **Containerization** | Docker + Docker Compose | Isolated challenge environments |
| **Auth** | JWT + Web3 Wallet | Traditional + crypto-native login |
| **Monitoring** | Prometheus + Grafana | Usage analytics, challenge metrics |

### 3.3 Database Schema

```sql
-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(32) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    wallet_address VARCHAR(42) UNIQUE,
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    last_active TIMESTAMP,
    total_points INTEGER DEFAULT 0,
    rank VARCHAR(20) DEFAULT 'novice'
);

-- Challenges Table
CREATE TABLE challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- steganography, zk_proofs, crypto, osint, smart_contract
    difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 10),
    points INTEGER NOT NULL,
    description TEXT NOT NULL,
    hint TEXT,
    flag_hash VARCHAR(64) NOT NULL, -- SHA-256 of flag
    docker_image VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- User Progress Table
CREATE TABLE user_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
    completed_at TIMESTAMP DEFAULT NOW(),
    attempts INTEGER DEFAULT 0,
    time_taken INTEGER, -- seconds
    points_earned INTEGER,
    UNIQUE(user_id, challenge_id)
);

-- Teams Table
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    invite_code VARCHAR(20) UNIQUE NOT NULL,
    captain_id UUID REFERENCES users(id),
    total_points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- NFT Badges Table
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url TEXT,
    contract_address VARCHAR(42),
    token_id INTEGER,
    requirement_type VARCHAR(50), -- challenge_count, category_complete, etc.
    requirement_value INTEGER
);

-- User Badges Table
CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    minted_at TIMESTAMP,
    tx_hash VARCHAR(66),
    UNIQUE(user_id, badge_id)
);
```

### 3.4 Challenge Sandbox Architecture

Each challenge runs in an isolated Docker container:

```dockerfile
# Example: Steganography Challenge Container
FROM alpine:latest

RUN apk add --no-cache steghide zlib-dev

WORKDIR /challenge
COPY challenge_files/ .
COPY flag.txt /root/.flag

# Remove flag from readable location, embed in image
RUN steghide embed -cf innocent.jpg -ef flag.txt -p ""
RUN rm flag.txt

# Expose SSH or HTTP service
EXPOSE 22
CMD ["/usr/sbin/sshd", "-D"]
```

---

## 4. Feature List with Implementation Status

### 4.1 Core Platform Features

| Feature | Priority | Status | Effort | Description |
|---------|----------|--------|--------|-------------|
| **User Authentication** | P0 | ❌ Not Started | 2 days | JWT + Web3 wallet login |
| **Challenge Engine** | P0 | ❌ Not Started | 5 days | Sandbox management, flag validation |
| **Leaderboard System** | P0 | ❌ Not Started | 1 day | Real-time rankings, filters |
| **Progress Tracking** | P0 | ❌ Not Started | 2 days | User stats, challenge history |
| **Admin Dashboard** | P1 | ❌ Not Started | 3 days | Challenge CRUD, user management |
| **Notification System** | P2 | ❌ Not Started | 1 day | Email/webhook notifications |
| **API Documentation** | P1 | ❌ Not Started | 1 day | OpenAPI/Swagger docs |

### 4.2 Challenge Categories

| Category | Challenges | Status | Effort | Description |
|----------|------------|--------|--------|-------------|
| **Steganography** | 10+ | ❌ Not Started | 3 days | Hide/seek messages in media |
| **ZK Proofs** | 8+ | ❌ Not Started | 5 days | Zero-knowledge puzzle games |
| **Crypto Cracking** | 12+ | ❌ Not Started | 4 days | Break weak ciphers |
| **OSINT Privacy** | 10+ | ❌ Not Started | 3 days | Find data leaks, clean footprints |
| **Smart Contract Audits** | 8+ | ❌ Not Started | 4 days | Find vulnerabilities in contracts |

### 4.3 Gamification Features

| Feature | Priority | Status | Effort | Description |
|---------|----------|--------|--------|-------------|
| **Achievement Badges** | P1 | ❌ Not Started | 3 days | NFT-based accomplishments |
| **Team System** | P1 | ❌ Not Started | 3 days | Create/join teams, team leaderboards |
| **Learning Paths** | P1 | ❌ Not Started | 2 days | Curated challenge sequences |
| **Daily Challenges** | P2 | ❌ Not Started | 1 day | Rotating daily puzzles |
| **Tournaments** | P2 | ❌ Not Started | 4 days | Time-limited competitions |
| **Hint System** | P1 | ❌ Not Started | 1 day | Point-cost hints |
| **Streak Tracking** | P2 | ❌ Not Started | 1 day | Daily login rewards |

### 4.4 Social Features

| Feature | Priority | Status | Effort | Description |
|---------|----------|--------|--------|-------------|
| **User Profiles** | P1 | ❌ Not Started | 2 days | Public stats, badges display |
| **Challenge Comments** | P3 | ❌ Not Started | 1 day | Post-solve discussions |
| **Write-up System** | P2 | ❌ Not Started | 2 days | Share solution approaches |
| **Friend System** | P3 | ❌ Not Started | 2 days | Follow other players |

---

## 5. Challenge Categories Detailed Design

### 5.1 Steganography Challenges

**Learning Objectives:**
- Understand data hiding techniques
- Detect steganographic content
- Use tools like steghide, zsteg, exiftool

**Challenge Types:**

| Level | Challenge | Technique | Points |
|-------|-----------|-----------|--------|
| 1 | Hidden in Plain Sight | LSB in PNG | 100 |
| 2 | Audio Secrets | Spectrogram hiding | 200 |
| 3 | Metadata Leak | EXIF data extraction | 150 |
| 4 | Double Layer | Encrypted stego | 300 |
| 5 | Video Frames | Frame extraction | 400 |

**Sample Challenge Setup:**
```javascript
// challenges/stego/level1/generate.js
const { createCanvas } = require('canvas');
const fs = require('fs');

function generateChallenge() {
    const canvas = createCanvas(200, 200);
    const ctx = canvas.getContext('2d');
    
    // Create image
    ctx.fillStyle = '#FF6B6B';
    ctx.fillRect(0, 0, 200, 200);
    
    // Embed flag in LSB
    const flag = process.env.FLAG || 'flag{stego_master_2024}';
    const buffer = canvas.toBuffer('raw');
    
    // Embed flag in least significant bits
    let flagIndex = 0;
    for (let i = 0; i < flag.length; i++) {
        const charCode = flag.charCodeAt(i);
        for (let bit = 0; bit < 8; bit++) {
            const bitVal = (charCode >> bit) & 1;
            buffer[flagIndex] = (buffer[flagIndex] & 0xFE) | bitVal;
            flagIndex++;
        }
    }
    
    fs.writeFileSync('challenge.png', buffer);
}

generateChallenge();
```

### 5.2 ZK Proof Challenges

**Learning Objectives:**
- Understand zero-knowledge concepts
- Use circom/snarkjs for proofs
- Verify knowledge without revealing

**Challenge Types:**

| Level | Challenge | Concept | Points |
|-------|-----------|---------|--------|
| 1 | Hash Preimage | Prove knowledge of hash input | 150 |
| 2 | Range Proof | Prove number in range | 250 |
| 3 | Sudoku ZK | Prove solution without revealing | 350 |
| 4 | Set Membership | Prove element in Merkle tree | 400 |
| 5 | Private Voting | Anonymous voting simulation | 500 |

**Sample Circuit (Circom):**
```circom
// challenges/zk/hash_preimage.circom
pragma circom 2.0.0;

template HashPreimage() {
    signal input preimage;
    signal input hash;
    
    // Compute hash (simplified)
    signal computed_hash <== preimage * preimage + 12345;
    
    // Constraint: computed hash must match provided hash
    computed_hash === hash;
}

component main {public [hash]} = HashPreimage();
```

### 5.3 Crypto Cracking Challenges

**Learning Objectives:**
- Identify weak cryptographic implementations
- Use cryptanalysis techniques
- Understand proper crypto usage

**Challenge Types:**

| Level | Challenge | Cipher/Attack | Points |
|-------|-----------|---------------|--------|
| 1 | Caesar's Secret | Caesar cipher | 50 |
| 2 | Vigenere's Lock | Vigenere cipher | 100 |
| 3 | XOR Madness | Reused key XOR | 200 |
| 4 | AES ECB Leak | ECB mode weakness | 300 |
| 5 | RSA Small e | Low exponent attack | 450 |
| 6 | Padding Oracle | CBC padding attack | 500 |

**Sample Challenge:**
```javascript
// challenges/crypto/caesar/challenge.js
function caesarEncrypt(text, shift) {
    return text.replace(/[a-zA-Z]/g, (char) => {
        const base = char <= 'Z' ? 65 : 97;
        return String.fromCharCode(
            ((char.charCodeAt(0) - base + shift) % 26) + base
        );
    });
}

const flag = process.env.FLAG;
const encrypted = caesarEncrypt(flag, Math.floor(Math.random() * 25) + 1);
console.log('Encrypted:', encrypted);
```

### 5.4 OSINT Privacy Challenges

**Learning Objectives:**
- Find exposed personal information
- Understand digital footprints
- Learn data removal techniques

**Challenge Types:**

| Level | Challenge | Skills | Points |
|-------|-----------|--------|--------|
| 1 | Username Hunt | Cross-platform search | 100 |
| 2 | Image Geolocation | EXIF + visual analysis | 200 |
| 3 | Breach Search | HaveIBeenPwned API usage | 250 |
| 4 | Corporate Leak | LinkedIn scraping | 300 |
| 5 | Metadata Detective | Document forensics | 350 |

**Sample Challenge Setup:**
```javascript
// challenges/osint/username_hunt/setup.js
// Creates fake profiles across platforms for discovery
const fakeProfiles = {
    twitter: '@privacy_target_2024',
    github: 'privacy-target-dev',
    instagram: 'privacy.target.life'
};

// Each platform has piece of flag
// Flag: flag{osint_master_found_me}
// Twitter: flag{osint_
// Github: master_found
// Instagram: _me}
```

### 5.5 Smart Contract Auditing Challenges

**Learning Objectives:**
- Identify common contract vulnerabilities
- Understand privacy implications
- Use auditing tools (Slither, Mythril)

**Challenge Types:**

| Level | Challenge | Vulnerability | Points |
|-------|-----------|---------------|--------|
| 1 | Private Variable | Storage visibility | 150 |
| 2 | Reentrancy | Recursive calls | 250 |
| 3 | Timestamp Dependence | block.timestamp usage | 200 |
| 4 | Front Running | Transaction ordering | 300 |
| 5 | Access Control | Missing modifiers | 250 |
| 6 | Privacy Leak | Event emission | 350 |

**Sample Vulnerable Contract:**
```solidity
// challenges/contracts/PrivacyLeak.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PrivacyLeak {
    // Private doesn't mean secret!
    string private hiddenFlag = "flag{private_isnt_hidden}";
    
    // This emits the flag in logs
    event Debug(address caller, string message);
    
    function debug() external {
        emit Debug(msg.sender, hiddenFlag);
    }
    
    // Should check access
    function getFlag() external view returns (string memory) {
        return hiddenFlag;
    }
}
```

---

## 6. API Documentation

### 6.1 Authentication Endpoints

```yaml
# Authentication
POST /api/auth/register
  Request: { username, email, password }
  Response: { user, token }

POST /api/auth/login
  Request: { username/email, password }
  Response: { user, token }

POST /api/auth/wallet
  Request: { wallet_address, signature }
  Response: { user, token }

POST /api/auth/logout
  Headers: Authorization: Bearer {token}
  Response: { success }
```

### 6.2 Challenge Endpoints

```yaml
# Challenges
GET /api/challenges
  Query: { category, difficulty, page, limit }
  Response: { challenges[], total, page }

GET /api/challenges/:id
  Response: { challenge, userProgress }

POST /api/challenges/:id/start
  Response: { container_url, expires_at }

POST /api/challenges/:id/submit
  Request: { flag }
  Response: { correct, points_earned, new_rank }

POST /api/challenges/:id/hint
  Response: { hint, points_deducted }
```

### 6.3 User Endpoints

```yaml
# User Management
GET /api/users/profile
  Response: { user, stats, badges }

GET /api/users/leaderboard
  Query: { timeframe, category, team }
  Response: { users[], user_rank }

GET /api/users/progress
  Response: { completed[], in_progress[], categories }

PUT /api/users/profile
  Request: { username, bio, avatar }
  Response: { user }
```

### 6.4 Team Endpoints

```yaml
# Teams
POST /api/teams
  Request: { name }
  Response: { team, invite_code }

POST /api/teams/join
  Request: { invite_code }
  Response: { team }

GET /api/teams/:id
  Response: { team, members, stats }

GET /api/teams/leaderboard
  Response: { teams[] }

DELETE /api/teams/:id/members/:userId
  Response: { success }
```

### 6.5 Badge/NFT Endpoints

```yaml
# Badges
GET /api/badges
  Response: { badges[] }

GET /api/users/:id/badges
  Response: { badges[], completed }

POST /api/badges/:id/claim
  Response: { tx_hash, token_id }

GET /api/badges/:id/metadata
  Response: { name, description, image, attributes }
```

---

## 7. Code Completeness Verification

### 7.1 File Structure (Required)

```
thevirus.zip/
├── package.json                    ✅ EXISTS (minimal)
├── README.md                       ✅ EXISTS (feature list)
├── PRD.md                         ✅ THIS FILE
├── server.js                      ❌ MISSING - Main entry point
├── .env.example                   ❌ MISSING - Environment template
├── docker-compose.yml             ❌ MISSING - Infrastructure
│
├── src/
│   ├── config/
│   │   ├── database.js            ❌ MISSING - DB connection
│   │   ├── redis.js               ❌ MISSING - Cache setup
│   │   └── blockchain.js          ❌ MISSING - Web3 config
│   │
│   ├── api/
│   │   ├── routes/
│   │   │   ├── auth.js            ❌ MISSING - Auth routes
│   │   │   ├── challenges.js      ❌ MISSING - Challenge routes
│   │   │   ├── users.js           ❌ MISSING - User routes
│   │   │   ├── teams.js           ❌ MISSING - Team routes
│   │   │   └── badges.js          ❌ MISSING - Badge routes
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.js            ❌ MISSING - JWT verification
│   │   │   ├── rateLimit.js       ❌ MISSING - Rate limiting
│   │   │   └── validation.js      ❌ MISSING - Input validation
│   │   │
│   │   └── controllers/
│   │       ├── authController.js      ❌ MISSING
│   │       ├── challengeController.js ❌ MISSING
│   │       ├── userController.js      ❌ MISSING
│   │       └── teamController.js      ❌ MISSING
│   │
│   ├── models/
│   │   ├── User.js                ❌ MISSING - User model
│   │   ├── Challenge.js           ❌ MISSING - Challenge model
│   │   ├── Team.js                ❌ MISSING - Team model
│   │   └── Badge.js               ❌ MISSING - Badge model
│   │
│   ├── services/
│   │   ├── challengeEngine.js     ❌ MISSING - Challenge runner
│   │   ├── flagValidator.js       ❌ MISSING - Flag checking
│   │   ├── leaderboardService.js  ❌ MISSING - Rankings
│   │   ├── nftService.js          ❌ MISSING - NFT minting
│   │   └── dockerService.js       ❌ MISSING - Container mgmt
│   │
│   ├── challenges/                ❌ MISSING - All challenges
│   │   ├── steganography/
│   │   ├── zk_proofs/
│   │   ├── crypto_cracking/
│   │   ├── osint_privacy/
│   │   └── smart_contracts/
│   │
│   └── utils/
│       ├── crypto.js              ❌ MISSING - Crypto helpers
│       ├── scoring.js             ❌ MISSING - Point calculation
│       └── validators.js          ❌ MISSING - Input validators
│
├── contracts/                     ❌ MISSING - Solidity contracts
│   ├── BadgeNFT.sol
│   └── ChallengeFactory.sol
│
├── frontend/                      ❌ MISSING - React/Next.js app
│   ├── pages/
│   ├── components/
│   ├── styles/
│   └── package.json
│
├── tests/                         ❌ MISSING - Test suite
│   ├── unit/
│   ├── integration/
│   └── challenges/
│
└── docs/                          ❌ MISSING - Documentation
    ├── api/
    ├── deployment/
    └── challenges/
```

### 7.2 Code Quality Checklist

| Requirement | Status | Notes |
|-------------|--------|-------|
| Input Validation | ❌ Missing | All endpoints need sanitization |
| SQL Injection Prevention | ❌ Missing | Use parameterized queries |
| XSS Protection | ❌ Missing | Sanitize output |
| CSRF Tokens | ❌ Missing | For state-changing ops |
| Rate Limiting | ❌ Missing | Prevent brute force |
| Flag Encryption | ❌ Missing | Don't store plain text flags |
| Container Isolation | ❌ Missing | Challenge sandboxing |
| Audit Logging | ❌ Missing | Track submissions |
| Error Handling | ❌ Missing | Consistent error responses |
| API Documentation | ❌ Missing | OpenAPI spec |

---

## 8. Gaps Analysis and Implementation Roadmap

### 8.1 Critical Gaps (Blocking Submission)

| Gap | Impact | Mitigation |
|-----|--------|------------|
| No server.js | Cannot start | Create Express server |
| No database | No persistence | Set up PostgreSQL |
| No challenges | No gameplay | Implement 5 starter challenges |
| No auth | Open access | Add JWT middleware |
| No flag validation | Cannot verify solutions | Implement hash-based checking |

### 8.2 Implementation Roadmap

#### Phase 1: MVP Core (Week 1-2) - ESTIMATED 40 HOURS

**Goal:** Bare minimum functional CTF platform

| Day | Task | Hours | Deliverable |
|-----|------|-------|-------------|
| 1-2 | Setup Express server + database | 8 | Running API server |
| 3 | Implement user auth | 6 | Registration/login endpoints |
| 4 | Create challenge schema + 3 basic challenges | 8 | Database + challenges |
| 5 | Build flag submission system | 6 | /submit endpoint |
| 6 | Simple leaderboard | 4 | GET /leaderboard |
| 7 | Testing + bug fixes | 8 | Working MVP |

**Deliverables:**
- Running backend with 3 working challenges
- User registration/login
- Flag submission and validation
- Basic leaderboard

#### Phase 2: Challenge Expansion (Week 3-4) - ESTIMATED 60 HOURS

**Goal:** Full challenge suite across all categories

| Week | Focus | Deliverables |
|------|-------|--------------|
| 3 | Steganography (5) + Crypto (5) | 10 challenges |
| 4 | ZK Proofs (3) + OSINT (3) + Contracts (3) | 9 challenges |

#### Phase 3: Gamification (Week 5-6) - ESTIMATED 50 HOURS

**Goal:** Engagement features

| Feature | Hours | Tech |
|---------|-------|------|
| NFT Badges | 15 | Solidity + Hardhat |
| Team System | 15 | DB + API changes |
| Learning Paths | 10 | Frontend + curation |
| Hint System | 5 | Points deduction |
| Achievements | 5 | Progress tracking |

#### Phase 4: Frontend (Week 7-8) - ESTIMATED 60 HOURS

**Goal:** Complete UI/UX

| Component | Hours | Stack |
|-----------|-------|-------|
| Landing Page | 8 | Next.js + Tailwind |
| Challenge UI | 15 | Interactive terminal |
| Leaderboard UI | 6 | Real-time updates |
| User Dashboard | 12 | Stats, badges |
| Team Management | 8 | CRUD operations |
| Admin Panel | 11 | Challenge management |

### 8.3 Total Effort Estimate

| Phase | Hours | Calendar Time |
|-------|-------|---------------|
| MVP Core | 40 | 1-2 weeks |
| Challenges | 60 | 2 weeks |
| Gamification | 50 | 2 weeks |
| Frontend | 60 | 2 weeks |
| Testing/Polish | 40 | 1 week |
| **TOTAL** | **250** | **8-10 weeks** |

---

## 9. Submission Details for Gamification ($15K)

### 9.1 Judging Criteria Response

| Criteria | Weight | Our Approach | Evidence Needed |
|----------|--------|--------------|-----------------|
| **Engagement** | 25% | CTF format naturally engaging; competitive leaderboards; team play | DAU metrics, session duration, completion rates |
| **Education** | 25% | Each challenge teaches real skill; progressive difficulty; hints | Learning outcomes survey, skill transfer evidence |
| **Innovation** | 20% | Privacy-first CTF niche; ZK proof gamification; NFT credentials | Unique feature demo, technical architecture |
| **Impact** | 20% | Privacy skills apply to real threats; creates privacy advocates | User testimonials, real-world application stories |
| **Technical Merit** | 10% | Multi-layer architecture; blockchain integration; sandboxing | Code quality, test coverage, security audit |

### 9.2 Submission Package

**Required Deliverables:**

1. **Live Demo** (Primary)
   - URL: https://thevirus.zip (deployed version)
   - Test accounts: demo@thevirus.zip / demo123
   - Video walkthrough: 3-5 minutes

2. **Code Repository**
   - GitHub: github.com/thegitnetwork/thevirus.zip
   - README with setup instructions
   - MIT License

3. **Documentation**
   - This PRD
   - API Documentation (OpenAPI)
   - Challenge write-ups

4. **Presentation**
   - Problem statement slides
   - Architecture diagram
   - Demo screenshots
   - Future roadmap

### 9.3 Competitive Advantages to Highlight

1. **Privacy-Native**: Unlike general CTFs (CTFtime, Hack The Box), we focus exclusively on privacy skills
2. **Web3 Integration**: First CTF platform with on-chain credentials
3. **Educational Depth**: Not just puzzles—structured learning paths
4. **OSINT Focus**: Unique privacy-oriented OSINT challenges
5. **Real Skills**: Challenges based on actual privacy incidents

### 9.4 Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Challenge too hard | Medium | User frustration | Tiered hints, progressive disclosure |
| Cheating/sharing flags | High | Unfair leaderboard | Flag randomization, anti-cheat detection |
| Server costs | Medium | Sustainability | Sponsor funding, freemium model |
| Content stale | Low | Replayability | Regular challenge updates, seasonal events |

---

## 10. Demo Script for Submission Video

### 10.1 3-Minute Demo Script

**[0:00-0:15] Hook - The Problem**
```
"Every day, millions have their data leaked. But privacy education is boring 
docs and dry tutorials. What if learning privacy was as addictive as your 
favorite game?"
```

**[0:15-0:45] The Solution**
```
"Introducing thevirus.zip - a privacy CTF platform where you learn real 
security skills by solving challenges."

[Screen: Landing page with animated background]
"Players compete on leaderboards, earn NFT badges, and join teams to solve 
collaborative challenges."
```

**[0:45-1:45] Live Demo - Challenge Walkthrough**
```
"Let me show you how it works. I'm a new player..."

[Screen: Registration → Dashboard → Challenges]
"I can browse challenges by category - Steganography, ZK proofs, Crypto, 
OSINT, and Smart Contract auditing."

[Screen: Click Steganography Level 1]
"Let's try hiding a message in an image. The challenge gives me a file 
and a hint..."

[Screen: Download image, show terminal using steghide]
"Using standard tools, I extract the hidden flag..."

[Screen: Submit flag → Success animation → Points awarded]
"Correct! I earned 100 points and moved up the leaderboard."
```

**[1:45-2:30] Advanced Features**
```
"As I progress, I unlock harder challenges..."

[Screen: ZK Proof challenge]
"This ZK challenge teaches zero-knowledge proofs—proving I know something 
without revealing what it is."

[Screen: Team interface]
"I can form teams for collaborative challenges..."

[Screen: Badge collection]
"...and earn NFT badges that prove my expertise on-chain."
```

**[2:30-3:00] Impact & Closing**
```
"The skills learned here directly transfer to real-world privacy protection.
Our beta users have reported finding and fixing data leaks in their own 
systems."

[Screen: Testimonials, GitHub stats]
"thevirus.zip - making privacy education addictive."

[Screen: URL, GitHub, social links]
"Join the mission at thevirus.zip"
```

### 10.2 Technical Deep Dive (Optional 2-Minute Addendum)

```
"For the technically curious, here's how we ensure fair, secure gameplay..."

[Screen: Architecture diagram]
"Each challenge runs in an isolated Docker container with randomized flags 
to prevent cheating."

[Screen: Smart contract code]
"Badges are minted as NFTs on Polygon for low-cost, verifiable credentials."

[Screen: Database schema]
"PostgreSQL tracks progress while Redis handles real-time leaderboards."
```

---

## 11. Marketing/Upsell Potential

### 11.1 Target Markets

**Primary: Individual Learners (B2C)**
- Privacy-conscious tech workers
- Aspiring security professionals
- Crypto/web3 developers
- CTF hobbyists

**Secondary: Organizations (B2B)**
- Security training for companies
- University cybersecurity courses
- Bootcamp curriculum supplement
- Corporate CTF events

### 11.2 Revenue Model

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | 20 basic challenges, public leaderboard |
| **Pro** | $12/mo | All challenges, private teams, detailed stats |
| **Enterprise** | Custom | Private instances, custom challenges, admin panel |

**Additional Revenue Streams:**
1. **NFT Badge Sales**: 5% royalty on secondary sales
2. **Tournament Hosting**: $500-2000 per corporate event
3. **Certification**: Paid verification of skills
4. **Sponsored Challenges**: Companies pay to feature their tech

### 11.3 Marketing Channels

| Channel | Strategy | Expected CAC |
|---------|----------|--------------|
| **Twitter/X** | Privacy/crypto community engagement | $5 |
| **Reddit** | r/netsec, r/privacy, r/CTF posts | $3 |
| **Discord** | Privacy server partnerships | $2 |
| **YouTube** | Challenge walkthrough content | $8 |
| **University** | CS department partnerships | $10 |

### 11.4 Growth Metrics (12-Month Targets)

| Metric | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|----------|
| Registered Users | 1,000 | 5,000 | 20,000 |
| Monthly Active | 400 | 2,000 | 8,000 |
| Challenges Completed | 2,000 | 15,000 | 80,000 |
| Paid Subscribers | 50 | 300 | 1,500 |
| MRR | $600 | $3,600 | $18,000 |

### 11.5 Partnership Opportunities

1. **Privacy Tools**: Proton, Signal, Tor - co-marketing
2. **Security Training**: Offensive Security, TryHackMe - content partnership
3. **Web3 Projects**: Integrate ZK tools (Semaphore, MACI) as challenges
4. **Universities**: Curriculum integration, research partnerships

---

## 12. Files and Directory Structure Needed

### 12.1 Complete Project Structure

```
thevirus.zip/
│
├── 📄 Configuration Files
│   ├── package.json                 ✅ EXISTS - Needs expansion
│   ├── package-lock.json            ❌ MISSING
│   ├── .env.example                 ❌ MISSING
│   ├── .env.local                   ❌ MISSING (gitignored)
│   ├── .gitignore                   ❌ MISSING
│   ├── .eslintrc.js                 ❌ MISSING
│   ├── .prettierrc                  ❌ MISSING
│   ├── tsconfig.json                ❌ MISSING (if using TS)
│   ├── docker-compose.yml           ❌ MISSING
│   └── Dockerfile                   ❌ MISSING
│
├── 📄 Documentation
│   ├── README.md                    ✅ EXISTS - Needs update
│   ├── PRD.md                       ✅ THIS FILE
│   ├── CHANGELOG.md                 ❌ MISSING
│   ├── CONTRIBUTING.md              ❌ MISSING
│   └── LICENSE                      ❌ MISSING (claimed MIT)
│
├── 📁 docs/
│   ├── api/
│   │   ├── openapi.yaml             ❌ MISSING
│   │   └── authentication.md        ❌ MISSING
│   ├── deployment/
│   │   ├── local-setup.md           ❌ MISSING
│   │   └── production.md            ❌ MISSING
│   ├── challenges/
│   │   ├── steganography.md         ❌ MISSING
│   │   ├── zk_proofs.md             ❌ MISSING
│   │   ├── crypto_cracking.md       ❌ MISSING
│   │   ├── osint_privacy.md         ❌ MISSING
│   │   └── smart_contracts.md       ❌ MISSING
│   └── marketing/
│       ├── pitch-deck.md            ❌ MISSING
│       └── social-media-kit.md      ❌ MISSING
│
├── 📁 scripts/
│   ├── setup.sh                     ❌ MISSING
│   ├── dev.sh                       ❌ MISSING
│   ├── deploy.sh                    ❌ MISSING
│   ├── seed-database.js             ❌ MISSING
│   └── generate-challenge-flags.js  ❌ MISSING
│
├── 📄 Core Server
│   └── server.js                    ❌ MISSING - Entry point
│
├── 📁 src/
│   ├── 📁 config/
│   │   ├── index.js                 ❌ MISSING - Config loader
│   │   ├── database.js              ❌ MISSING - PostgreSQL
│   │   ├── redis.js                 ❌ MISSING - Redis client
│   │   ├── blockchain.js            ❌ MISSING - Web3 setup
│   │   └── passport.js              ❌ MISSING - Auth strategies
│   │
│   ├── 📁 api/
│   │   ├── 📁 routes/
│   │   │   ├── index.js             ❌ MISSING - Route aggregator
│   │   │   ├── auth.js              ❌ MISSING - Auth routes
│   │   │   ├── users.js             ❌ MISSING - User routes
│   │   │   ├── challenges.js        ❌ MISSING - Challenge routes
│   │   │   ├── teams.js             ❌ MISSING - Team routes
│   │   │   ├── badges.js            ❌ MISSING - Badge routes
│   │   │   ├── leaderboard.js       ❌ MISSING - Leaderboard routes
│   │   │   └── admin.js             ❌ MISSING - Admin routes
│   │   │
│   │   ├── 📁 controllers/
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── challengeController.js
│   │   │   ├── teamController.js
│   │   │   ├── badgeController.js
│   │   │   └── adminController.js   ❌ MISSING ALL
│   │   │
│   │   └── 📁 middleware/
│   │       ├── auth.js              ❌ MISSING - JWT verification
│   │       ├── rateLimit.js         ❌ MISSING - Rate limiting
│   │       ├── validation.js        ❌ MISSING - Input validation
│   │       ├── errorHandler.js      ❌ MISSING - Error handling
│   │       └── logging.js           ❌ MISSING - Request logging
│   │
│   ├── 📁 models/
│   │   ├── index.js                 ❌ MISSING - Model loader
│   │   ├── User.js                  ❌ MISSING
│   │   ├── Challenge.js             ❌ MISSING
│   │   ├── UserChallenge.js         ❌ MISSING
│   │   ├── Team.js                  ❌ MISSING
│   │   ├── TeamMember.js            ❌ MISSING
│   │   ├── Badge.js                 ❌ MISSING
│   │   └── UserBadge.js             ❌ MISSING
│   │
│   ├── 📁 services/
│   │   ├── authService.js           ❌ MISSING
│   │   ├── challengeEngine.js       ❌ MISSING
│   │   ├── flagValidator.js         ❌ MISSING
│   │   ├── leaderboardService.js    ❌ MISSING
│   │   ├── dockerService.js         ❌ MISSING
│   │   ├── nftService.js            ❌ MISSING
│   │   ├── emailService.js          ❌ MISSING
│   │   └── scoringService.js        ❌ MISSING
│   │
│   ├── 📁 challenges/               ❌ MISSING ENTIRE DIRECTORY
│   │   ├── 📁 _templates/
│   │   │   ├── docker/
│   │   │   └── generate.js
│   │   │
│   │   ├── 📁 steganography/
│   │   │   ├── level1/
│   │   │   │   ├── challenge.json
│   │   │   │   ├── generate.js
│   │   │   │   ├── Dockerfile
│   │   │   │   └── files/
│   │   │   ├── level2/
│   │   │   └── ... (5+ levels)
│   │   │
│   │   ├── 📁 zk_proofs/
│   │   │   ├── level1/
│   │   │   │   ├── circuit.circom
│   │   │   │   ├── input.json
│   │   │   │   └── generate.js
│   │   │   └── ... (3+ levels)
│   │   │
│   │   ├── 📁 crypto_cracking/
│   │   │   ├── caesar/
│   │   │   ├── xor/
│   │   │   ├── rsa/
│   │   │   └── ... (5+ challenges)
│   │   │
│   │   ├── 📁 osint_privacy/
│   │   │   ├── username_hunt/
│   │   │   ├── geolocation/
│   │   │   └── ... (3+ challenges)
│   │   │
│   │   └── 📁 smart_contracts/
│   │       ├── PrivacyLeak.sol
│   │       ├── Reentrancy.sol
│   │       └── ... (3+ contracts)
│   │
│   ├── 📁 utils/
│   │   ├── crypto.js                ❌ MISSING
│   │   ├── validators.js            ❌ MISSING
│   │   ├── logger.js                ❌ MISSING
│   │   ├── errors.js                ❌ MISSING
│   │   └── constants.js             ❌ MISSING
│   │
│   └── 📁 jobs/
│       ├── cleanupContainers.js     ❌ MISSING
│       ├── updateLeaderboard.js     ❌ MISSING
│       └── sendNotifications.js     ❌ MISSING
│
├── 📁 contracts/                    ❌ MISSING ENTIRE DIRECTORY
│   ├── 📁 contracts/
│   │   ├── BadgeNFT.sol
│   │   └── ChallengeFactory.sol
│   ├── 📁 scripts/
│   │   ├── deploy.js
│   │   └── mint-badge.js
│   ├── 📁 test/
│   │   └── BadgeNFT.test.js
│   └── hardhat.config.js
│
├── 📁 frontend/                     ❌ MISSING ENTIRE DIRECTORY
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── 📁 src/
│   │   ├── 📁 app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── challenges/
│   │   │   ├── leaderboard/
│   │   │   ├── teams/
│   │   │   └── profile/
│   │   ├── 📁 components/
│   │   │   ├── ChallengeCard.tsx
│   │   │   ├── Leaderboard.tsx
│   │   │   ├── TeamManager.tsx
│   │   │   └── BadgeDisplay.tsx
│   │   ├── 📁 hooks/
│   │   ├── 📁 lib/
│   │   └── 📁 types/
│   └── 📁 public/
│
├── 📁 tests/                        ❌ MISSING ENTIRE DIRECTORY
│   ├── 📁 unit/
│   │   ├── auth.test.js
│   │   ├── challenge.test.js
│   │   └── flagValidator.test.js
│   ├── 📁 integration/
│   │   ├── api.test.js
│   │   └── challenges.test.js
│   ├── 📁 e2e/
│   │   └── gameplay.test.js
│   └── jest.config.js
│
└── 📁 .github/                      ❌ MISSING ENTIRE DIRECTORY
    ├── 📁 workflows/
    │   ├── ci.yml
    │   └── deploy.yml
    ├── CONTRIBUTING.md
    └── PULL_REQUEST_TEMPLATE.md
```

### 12.2 Priority File Creation Order

**Week 1 (MVP):**
1. `server.js` - Express server entry point
2. `src/config/database.js` - PostgreSQL connection
3. `src/models/User.js` - User model
4. `src/models/Challenge.js` - Challenge model
5. `src/api/routes/auth.js` - Authentication routes
6. `src/api/routes/challenges.js` - Challenge routes
7. `src/services/flagValidator.js` - Flag checking logic
8. `docker-compose.yml` - Local infrastructure

**Week 2 (Challenges):**
9. `src/challenges/steganography/level1/` - First working challenge
10. `src/challenges/crypto/caesar/` - Second challenge
11. `src/challenges/osint/username_hunt/` - Third challenge
12. `src/services/challengeEngine.js` - Challenge runner

**Week 3-4 (Expansion):**
13. Remaining challenges
14. Frontend scaffolding
15. Smart contracts
16. NFT integration

---

## 13. Conclusion

### 13.1 Honest Assessment Summary

**Current State:** Concept document only (5% complete)
- ✅ Project idea and feature list defined
- ✅ Basic dependencies declared
- ❌ No functional code
- ❌ No database
- ❌ No challenges
- ❌ No authentication
- ❌ No frontend

**To Be Submission Ready:**
- ⏳ MVP Core: 2 weeks (40 hours)
- ⏳ Challenge Suite: 2 weeks (60 hours)
- ⏳ Gamification Features: 2 weeks (50 hours)
- ⏳ Frontend Development: 2 weeks (60 hours)
- ⏳ Testing & Polish: 1 week (40 hours)

**Total: ~250 hours over 8-10 weeks**

### 13.2 Strengths of the Concept

1. **Timely**: Privacy awareness is at an all-time high
2. **Educational**: Real skills, not just games
3. **Unique**: Privacy-focused CTF is an underserved niche
4. **Scalable**: Challenge-based content is extensible
5. **Sustainable**: Clear monetization path

### 13.3 Recommended Next Steps

1. **Immediate**: Create MVP with 3 challenges and basic auth (1 week)
2. **Short-term**: Deploy to staging, gather feedback (1 week)
3. **Medium-term**: Build full challenge suite + gamification (4 weeks)
4. **Pre-submission**: Polish, document, create demo video (2 weeks)

### 13.4 Final Notes

This PRD serves as both an honest assessment of the current minimal state and a comprehensive blueprint for building a world-class privacy CTF platform. The thevirus.zip concept has strong potential for the Gamification prize category, but requires significant implementation effort to realize that potential.

The architecture and design decisions documented here provide a solid foundation for development. With focused effort over 8-10 weeks, this project can evolve from a concept into a compelling, educational, and engaging platform that makes privacy education truly addictive.

---

**Document Version:** 1.0.0  
**Last Updated:** 2026-01-30  
**Next Review:** Upon implementation start  
**Author:** Kilo Code / thegit.network  
**Status:** Blueprint for Implementation
