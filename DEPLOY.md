# Hackathon Deployment Guide

## NPM Packages (Publish to npmjs.com)

### 1. sdk-solana
- **Project Name:** `sdk-solana`
- **NPM Package:** `@thegit/solana`
- **Description:** Privacy-focused SDK for Solana with ZK primitives, stealth addresses, and private transfers
- **Track:** Privacy Tooling
- **Commands:**
  ```bash
  cd TIER1_PRIORITY/sdk-solana
  npm install && npm run build
  npm publish --access public
  ```

### 2. password-vault
- **Project Name:** `password-vault`
- **NPM Package:** `password-vault`
- **Description:** Encrypted password vault with HIBP breach checking and password health scoring
- **Track:** Privacy Tooling
- **Commands:**
  ```bash
  cd TIER2_DEVELOPMENT/password-vault
  npm install && npm run build
  npm publish --access public
  ```

### 3. zk-email
- **Project Name:** `zk-email`
- **NPM Package:** `zk-email`
- **Description:** Zero-knowledge email verification using ZK proofs
- **Track:** Privacy Tooling
- **Commands:**
  ```bash
  cd TIER2_DEVELOPMENT/zk-email
  npm install && npm run build
  npm publish --access public
  ```

---

## Web Applications (Deploy to Cloudflare Pages)

### 4. choom.chat (Quantum Terminal)
- **Project Name:** `choom-chat`
- **Description:** Post-quantum secure terminal and messaging application with Kyber-768 + X25519 hybrid encryption
- **Track:** Open Track
- **Build Output Directory:** `.next`
- **Commands:**
  ```bash
  cd TIER1_PRIORITY/choom.chat
  npm install
  npm run build:web
  npx wrangler pages deploy .next --project-name=choom-chat
  ```

### 5. shadowpay
- **Project Name:** `shadowpay`
- **Description:** Private stealth payment system with ZK balance proofs and Aztec/Solana support
- **Track:** Private Payments
- **Build Output Directory:** `packages/web/.next` or `packages/web/.output`
- **Commands:**
  ```bash
  cd TIER3_CONCEPTS/shadowpay
  npm install && npm run install:all
  npm run build:sdk && npm run build:web
  cd packages/web
  npx wrangler pages deploy .next --project-name=shadowpay
  ```
- **Also publish CLI:**
  ```bash
  cd TIER3_CONCEPTS/shadowpay/packages/cli
  npm publish --access public
  ```

---

## Rust Binary (Local Build)

### 6. vpn-daemon
- **Project Name:** `vpn-daemon`
- **Description:** Post-Quantum VPN Daemon with Kyber-768 + WireGuard hybrid encryption
- **Track:** Open Track
- **Commands:**
  ```bash
  cd TIER2_DEVELOPMENT/vpn-daemon
  cargo build --release --strip
  # Binary: target/release/vpn-daemon
  ```

---

## Quick Deploy All

```bash
# NPM packages
cd TIER1_PRIORITY/sdk-solana && npm install && npm run build && npm publish --access public
cd TIER2_DEVELOPMENT/password-vault && npm install && npm run build && npm publish --access public
cd TIER2_DEVELOPMENT/zk-email && npm install && npm run build && npm publish --access public

# Web apps
cd TIER1_PRIORITY/choom.chat && npm install && npm run build:web && npx wrangler pages deploy .next --project-name=choom-chat
cd TIER3_CONCEPTS/shadowpay && npm install && npm run install:all && npm run build:web && cd packages/web && npx wrangler pages deploy .next --project-name=shadowpay

# Rust
cd TIER2_DEVELOPMENT/vpn-daemon && cargo build --release --strip
```
