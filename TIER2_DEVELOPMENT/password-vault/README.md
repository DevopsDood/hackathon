# Password Vault

Secure password storage with HaveIBeenPwned breach checking and password health scoring.

## Features

- **HIBP Integration**: Check passwords against 11+ billion breached credentials
- **k-Anonymity**: Only sends first 5 chars of SHA-1 hash to HIBP
- **Password Health Score**: 0-100 scoring with detailed analysis
- **AES-256-GCM Encryption**: Military-grade encryption for stored passwords
- **Password Analysis**: Entropy calculation and crack time estimation

## Prize Competition Fit

### Security Category ($5,000)
- **HIBP Integration**: Real-time breach checking
- **k-Anonymity**: Privacy-preserving password verification
- **Encryption**: AES-256-GCM with scrypt key derivation

### Privacy Tooling ($3,000)
- **Breach Monitoring**: Alerts for compromised credentials
- **Health Scoring**: Quantified password strength

### Authentication ($2,000)
- **Password Management**: Secure storage solution

## Installation

```bash
cd TIER2_DEVELOPMENT/password-vault
npm install
npm run build
```

## Usage

### CLI

```bash
# Check password against HIBP
node dist/index.js check "password123"

# Get full health score
node dist/index.js health "password123"
```

### Library

```typescript
import { PasswordVault, PasswordHealthChecker } from 'password-vault';

const vault = new PasswordVault();
await vault.initialize('master-password');

const entry = await vault.addEntry('GitHub', 'user@example.com', 'MyS3cur3P@ss!');
console.log('Health Score:', entry.healthScore?.score);
```

## Competition Submission

**Challenge**: Security + Privacy Tooling + Authentication  
**Domain**: themail.host/vault  
**Prize Target**: $10,000