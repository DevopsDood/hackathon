# lnk.zip - Product Requirements Document

## Executive Summary

**Project Name:** lnk.zip  
**Prize Category:** Privacy Tools ($2,000)  
**Status:** ⚠️ TEMPLATE - Core Implementation Required  
**Version:** 1.0.0  
**Author:** thegit.network  
**License:** MIT  

**Last Updated:** 2026-01-30  
**Hackathon:** Solana Privacy Hackathon  

---

## 1. Project Overview

### 1.1 Vision

lnk.zip is a privacy-focused link shortening service that combines end-to-end encryption with granular access controls. Unlike traditional link shorteners that expose destination URLs to the service operator, lnk.zip ensures that sensitive links remain encrypted and accessible only to authorized recipients.

### 1.2 Problem Statement

Traditional link shorteners present several privacy concerns:
- Service operators can see and log all destination URLs
- No protection for sensitive links shared via shortened URLs
- Limited or no access control mechanisms
- Links remain accessible indefinitely without expiry options
- No audit trail for link access

### 1.3 Solution

lnk.zip provides:
- **Client-side encryption** - URLs are encrypted in the browser before transmission
- **Zero-knowledge architecture** - Server never sees unencrypted destinations
- **Access controls** - Password protection and expiry dates
- **Solana integration** - Optional wallet-based access verification
- **Self-destructing links** - One-time access links that delete after viewing

---

## 2. Architecture & Design

### 2.1 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   UI Layer   │  │  Encryption  │  │  Wallet Adapter  │  │
│  │   (React)    │  │  (AES-256)   │  │  (Solana)        │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        API SERVER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Express    │  │   Link Mgr   │  │  Rate Limiter    │  │
│  │   Routes     │  │              │  │                  │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Redis      │  │   PostgreSQL │  │  IPFS (backup)   │  │
│  │   (Cache)    │  │   (Links)    │  │  (encrypted)     │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Encryption Flow

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Enter   │───▶│ Generate │───▶│ Encrypt  │───▶│  Store   │
│   URL    │    │ Link ID  │    │  URL     │    │  Link    │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                                     │
                                     ▼
                              ┌──────────┐
                              │ AES-256  │
                              │  GCM     │
                              └──────────┘
```

### 2.3 Access Control Flow

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Access  │───▶│  Check   │───▶│ Validate │───▶│ Decrypt  │
│  Request │    │  Expiry  │    │ Password │    │  & Show  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                      │                │
                      ▼                ▼
               ┌──────────┐     ┌──────────┐
               │  Expired │     │  Wrong   │
               │   Error  │     │ Password │
               └──────────┘     └──────────┘
```

### 2.4 Design Decisions

| Decision | Rationale |
|----------|-----------|
| Client-side encryption | Zero-knowledge - server never sees plain URLs |
| AES-256-GCM | Industry standard, authenticated encryption |
| Short link IDs | 8-character base58 for readability |
| Redis + PostgreSQL | Fast cache + persistent storage |
| Express.js | Lightweight, well-supported framework |
| Solana wallet auth | Optional web3-native access control |

---

## 3. Project Structure

### 3.1 Current State

```
lnk.zip/
├── package.json          # Basic npm configuration
├── README.md             # Brief documentation
└── src/                  # ⚠️ EMPTY - Implementation needed
```

### 3.2 Target Structure

```
lnk.zip/
├── package.json
├── README.md
├── PRD.md               # This document
├── server.js            # Main entry point
├── .env.example         # Environment variables template
├── config/
│   ├── database.js      # Database configuration
│   ├── redis.js         # Redis configuration
│   └── security.js      # Security settings
├── src/
│   ├── routes/
│   │   ├── links.js     # Link API routes
│   │   ├── access.js    # Access control routes
│   │   └── health.js    # Health check endpoint
│   ├── models/
│   │   └── Link.js      # Link data model
│   ├── services/
│   │   ├── encryption.js   # Encryption service
│   │   ├── linkService.js  # Link CRUD operations
│   │   └── accessControl.js # Access validation
│   ├── middleware/
│   │   ├── rateLimit.js    # Rate limiting
│   │   ├── validation.js   # Input validation
│   │   └── auth.js         # Authentication
│   └── utils/
│       ├── crypto.js       # Crypto helpers
│       └── idGenerator.js  # Short ID generation
├── public/
│   ├── index.html          # Main UI
│   ├── create.html         # Link creation UI
│   └── access.html         # Link access UI
├── tests/
│   ├── encryption.test.js
│   ├── api.test.js
│   └── integration.test.js
└── docs/
    ├── API.md
    └── DEPLOYMENT.md
```

---

## 4. API Documentation

### 4.1 Base URL

```
Production: https://lnk.zip/api/v1
Local: http://localhost:3000/api/v1
```

### 4.2 Endpoints

#### Create Link

```http
POST /links
Content-Type: application/json

Request:
{
  "encryptedUrl": "U2FsdGVkX1+vupppZksvRf5pq5g5XjFRlipTg9+MvKLJmzJ...",
  "passwordHash": "sha256:abc123...",      // Optional
  "expiresAt": "2026-02-28T00:00:00Z",     // Optional
  "maxAccess": 5,                           // Optional, 0 = unlimited
  "requireWallet": false                    // Optional
}

Response 201:
{
  "success": true,
  "data": {
    "shortId": "a3X9kLmP",
    "shortUrl": "https://lnk.zip/a3X9kLmP",
    "expiresAt": "2026-02-28T00:00:00Z",
    "accessUrl": "https://lnk.zip/access/a3X9kLmP"
  }
}

Response 400:
{
  "success": false,
  "error": "Invalid encryptedUrl format"
}
```

#### Access Link

```http
GET /links/:shortId

Headers:
X-Access-Password: plaintext_password  // If password protected

Response 200:
{
  "success": true,
  "data": {
    "encryptedUrl": "U2FsdGVkX1+vupppZksvRf5pq5g5XjFRlipTg9+MvKLJmzJ...",
    "expiresAt": "2026-02-28T00:00:00Z",
    "accessCount": 3,
    "maxAccess": 5
  }
}

Response 404:
{
  "success": false,
  "error": "Link not found or expired"
}

Response 401:
{
  "success": false,
  "error": "Password required or incorrect"
}

Response 403:
{
  "success": false,
  "error": "Maximum access limit reached"
}
```

#### Get Link Info

```http
GET /links/:shortId/info

Response 200:
{
  "success": true,
  "data": {
    "shortId": "a3X9kLmP",
    "createdAt": "2026-01-30T10:00:00Z",
    "expiresAt": "2026-02-28T00:00:00Z",
    "accessCount": 3,
    "maxAccess": 5,
    "hasPassword": true,
    "isExpired": false
  }
}
```

#### Delete Link

```http
DELETE /links/:shortId

Headers:
X-Deletion-Token: token_provided_on_creation  // Optional auth

Response 204: No Content

Response 404:
{
  "success": false,
  "error": "Link not found"
}
```

#### Health Check

```http
GET /health

Response 200:
{
  "status": "healthy",
  "timestamp": "2026-01-30T18:05:00Z",
  "version": "1.0.0",
  "services": {
    "database": "connected",
    "redis": "connected"
  }
}
```

### 4.3 Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| POST /links | 10 | 1 minute |
| GET /links/:id | 30 | 1 minute |
| All other | 100 | 1 minute |

---

## 5. Data Models

### 5.1 Link Schema

```javascript
{
  shortId: String,           // 8-char base58, primary key
  encryptedUrl: Text,        // AES-256-GCM encrypted URL
  iv: String,                // Initialization vector (hex)
  authTag: String,           // GCM authentication tag
  passwordHash: String,      // Optional SHA-256 of password
  salt: String,              // Salt for key derivation
  createdAt: DateTime,
  expiresAt: DateTime,       // Optional
  maxAccess: Integer,        // 0 = unlimited
  accessCount: Integer,      // Current access count
  deletionToken: String,     // For link deletion
  metadata: {
    ipRange: String,         // Optional IP restriction
    userAgent: String,       // Creator's user agent
    referrer: String         // Optional referrer tracking
  }
}
```

### 5.2 Access Log Schema

```javascript
{
  shortId: String,
  accessedAt: DateTime,
  ipHash: String,            // SHA-256 of IP (privacy)
  userAgent: String,         // Hashed/anonymized
  success: Boolean,          // Access granted or denied
  reason: String             // If denied: expired/password/etc
}
```

---

## 6. Feature List

### 6.1 Core Features

| Feature | Status | Priority | Notes |
|---------|--------|----------|-------|
| Link shortening | ⚠️ Not Started | P0 | Basic short link generation |
| Client-side encryption | ⚠️ Not Started | P0 | AES-256-GCM in browser |
| Password protection | ⚠️ Not Started | P0 | Optional access passwords |
| Expiry dates | ⚠️ Not Started | P0 | Time-based link expiration |
| Access limits | ⚠️ Not Started | P1 | Max access count |
| Self-destruct | ⚠️ Not Started | P1 | Delete after viewing |
| Link deletion | ⚠️ Not Started | P1 | Creator-initiated deletion |
| Rate limiting | ⚠️ Not Started | P1 | API protection |
| Analytics dashboard | ⚠️ Not Started | P2 | Basic access stats |

### 6.2 Privacy Features

| Feature | Status | Priority | Notes |
|---------|--------|----------|-------|
| Zero-knowledge storage | ⚠️ Not Started | P0 | Server never sees plain URL |
| IP anonymization | ⚠️ Not Started | P1 | Hash IPs in logs |
| No tracking cookies | ⚠️ Not Started | P1 | Privacy-first approach |
| Secure deletion | ⚠️ Not Started | P2 | Overwrite before delete |

### 6.3 Web3 Integration (Optional)

| Feature | Status | Priority | Notes |
|---------|--------|----------|-------|
| Solana wallet auth | ⚠️ Not Started | P2 | Sign message to access |
| NFT-gated links | ⚠️ Not Started | P3 | Token-gated access |
| Payment links | ⚠️ Not Started | P3 | Pay to access |

---

## 7. Security Considerations

### 7.1 Encryption

- **Algorithm:** AES-256-GCM
- **Key Generation:** Client-side, derived from password or random
- **IV:** Unique per link, 12 bytes
- **Key Derivation:** PBKDF2 with 100,000 iterations
- **Storage:** Encrypted URL stored, key never transmitted

### 7.2 Threats Mitigated

| Threat | Mitigation |
|--------|------------|
| Server compromise | Zero-knowledge: encrypted data only |
| Man-in-the-middle | HTTPS + authenticated encryption |
| Brute force | Rate limiting + password requirements |
| Link enumeration | Random 8-char IDs, unguessable |
| Replay attacks | GCM authentication tag verification |

### 7.3 Security Checklist

- [ ] HTTPS-only (HSTS enabled)
- [ ] Content Security Policy headers
- [ ] Input sanitization
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (output encoding)
- [ ] CSRF tokens for UI
- [ ] Secure cookie settings
- [ ] Database encryption at rest

---

## 8. Implementation Roadmap

### Phase 1: MVP (1-2 weeks)

- [ ] Set up Express.js server
- [ ] Create Link model and database schema
- [ ] Implement link creation endpoint
- [ ] Implement link access endpoint
- [ ] Basic client-side encryption (crypto.js)
- [ ] Simple HTML UI

### Phase 2: Security & Controls (1 week)

- [ ] Password protection
- [ ] Expiry dates
- [ ] Rate limiting
- [ ] Input validation
- [ ] Error handling

### Phase 3: Polish (1 week)

- [ ] Improved UI/UX
- [ ] Access analytics
- [ ] Link deletion
- [ ] Self-destruct mode
- [ ] Documentation

### Phase 4: Web3 (Optional)

- [ ] Solana wallet adapter
- [ ] Message signing auth
- [ ] NFT gating

---

## 9. Technology Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.x
- **Database:** PostgreSQL 14+
- **Cache:** Redis 7+
- **ORM:** Prisma or Sequelize

### Frontend
- **Framework:** Vanilla JS or React
- **Styling:** Tailwind CSS
- **Crypto:** Web Crypto API (native)
- **Build:** Vite

### Infrastructure
- **Hosting:** Vercel/Render/Railway
- **Database:** Supabase/Railway
- **Cache:** Upstash Redis
- **CDN:** Cloudflare (optional)

---

## 10. Demo Script

### 10.1 Submission Video Script (3 minutes)

**[0:00-0:30] Introduction**
- "Hi, I'm presenting lnk.zip - a privacy-first link shortener for the Solana Privacy Hackathon"
- Show the landing page with clean, minimal design

**[0:30-1:00] The Problem**
- "Traditional link shorteners expose your URLs to the service"
- Demonstrate how bit.ly or similar shows URL in dashboard
- "This is a privacy risk for sensitive links"

**[1:00-2:00] The Solution**
- "With lnk.zip, URLs are encrypted in your browser before sending"
- **Demo Step 1:** Enter a sensitive URL (e.g., private document link)
- **Demo Step 2:** Set password and expiry
- **Demo Step 3:** Create link - show encrypted payload being sent
- **Demo Step 4:** Open link in incognito window
- **Demo Step 5:** Enter password, view decrypted URL

**[2:00-2:30] Technical Deep Dive**
- Show code snippet of client-side encryption
- "AES-256-GCM ensures even we can't see your links"
- "Zero-knowledge architecture"

**[2:30-3:00] Future & Conclusion**
- "Future: Solana wallet authentication, NFT-gated links"
- "Try it now at lnk.zip"
- Show GitHub repo and documentation

### 10.2 Live Demo Steps

```bash
# 1. Start the server
cd lnk.zip
npm install
npm start

# 2. Open browser to http://localhost:3000

# 3. Demo flow:
#    - Enter: https://example.com/private-doc
#    - Set password: "hackathon2026"
#    - Set expiry: 1 hour
#    - Click Create
#    - Copy short link

# 4. Access flow:
#    - Open short link in new tab
#    - Enter password
#    - See decrypted URL redirect

# 5. Show expired link behavior
#    - Wait for expiry or modify system time
#    - Try to access - show error
```

---

## 11. Code Completeness Analysis

### 11.1 Current State

| Component | Status | Completeness |
|-----------|--------|--------------|
| Project structure | ⚠️ | 10% - package.json only |
| Server implementation | ⚠️ | 0% - server.js referenced but missing |
| Database layer | ⚠️ | 0% - Not implemented |
| API routes | ⚠️ | 0% - Not implemented |
| Encryption service | ⚠️ | 0% - Not implemented |
| Frontend UI | ⚠️ | 0% - Not implemented |
| Tests | ⚠️ | 0% - Not implemented |
| Documentation | ⚠️ | 20% - Basic README only |

### 11.2 Gaps Identified

**Critical (Blocking Submission):**
1. Missing server.js entry point
2. No actual link shortening logic
3. No encryption implementation
4. No database setup
5. No API endpoints

**Important:**
1. No frontend UI
2. No access control implementation
3. No rate limiting
4. No error handling

**Nice to Have:**
1. No Solana integration
2. No analytics
3. No advanced features

### 11.3 Estimation to Complete

| Phase | Estimated Time | Status |
|-------|---------------|--------|
| MVP Core | 2 weeks | Not Started |
| Security Features | 1 week | Not Started |
| UI/UX Polish | 1 week | Not Started |
| Web3 Integration | 1 week | Not Started |
| **Total** | **5 weeks** | **Not Started** |

---

## 12. Submission Details

### 12.1 Prize Category

**Privacy Tools** - $2,000

### 12.2 Submission Checklist

- [x] Project concept defined
- [x] Repository created
- [x] Basic documentation
- [ ] Working MVP
- [ ] Demo video recorded
- [ ] Live deployment
- [ ] README with instructions
- [ ] Code submitted

### 12.3 Judging Criteria Alignment

| Criteria | Status | Notes |
|----------|--------|-------|
| Innovation | ⚠️ | Concept is solid, needs implementation |
| Technical Execution | ⚠️ | Not yet implemented |
| Privacy Impact | ✅ | Strong privacy-focused design |
| Usability | ⚠️ | UI not yet built |
| Completeness | ⚠️ | Template stage only |

---

## 13. Recommendations

### 13.1 Quick Wins for Submission

1. **Implement Basic MVP** (2-3 days)
   - Create server.js with Express
   - Add in-memory link storage
   - Basic HTML form for link creation
   - Simple redirect functionality

2. **Add Client-Side Crypto** (1-2 days)
   - Implement AES-256-GCM in browser
   - Encrypt URL before sending
   - Decrypt on access page

3. **Deploy** (1 day)
   - Deploy to Render/Railway
   - Add custom domain
   - Test end-to-end flow

### 13.2 Long-term Improvements

1. **Enhanced Security**
   - Argon2 for password hashing
   - Hardware security module (HSM) integration
   - Audit logging

2. **Web3 Features**
   - Solana Pay integration for paid links
   - NFT-gated access
   - DAO-controlled link management

3. **Enterprise Features**
   - Team workspaces
   - API keys
   - Advanced analytics
   - Custom domains

---

## 14. Appendix

### 14.1 Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "rate-limiter-flexible": "^4.0.1",
    "pg": "^8.11.3",
    "redis": "^4.6.10",
    "uuid": "^9.0.1",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "supertest": "^6.3.3"
  }
}
```

### 14.2 Environment Variables

```bash
# .env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/lnkzip
REDIS_URL=redis://localhost:6379
ENCRYPTION_KEY_SIZE=32
LINK_ID_LENGTH=8
MAX_LINK_AGE_DAYS=30
RATE_LIMIT_CREATE=10
RATE_LIMIT_ACCESS=30
```

### 14.3 Resources

- **GitHub Repo:** https://github.com/thegitnetwork/lnk.zip
- **Live Demo:** https://lnk.zip (planned)
- **Documentation:** https://docs.lnk.zip (planned)
- **Contact:** team@thegit.network

---

## 15. Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-30 | 1.0.0 | Initial PRD creation |

---

**Document Status:** ✅ PRD Complete  
**Next Action:** Implement MVP core functionality  
**Owner:** thegit.network  
