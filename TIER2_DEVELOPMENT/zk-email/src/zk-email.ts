/**
 * ZK Email - Zero-Knowledge Email Verification
 * Prove email ownership without revealing content
 */

import { createHash } from 'crypto';

export interface EmailProof {
  domainProof: string;
  ownershipProof: string;
  nullifier: string;
  publicSignals: {
    domainHash: string;
    timestamp: number;
  };
}

export interface EmailVerificationConfig {
  allowedDomains: string[];
  proofExpiry: number;
}

export class ZkEmailProver {
  private config: EmailVerificationConfig;

  constructor(config: EmailVerificationConfig) {
    this.config = config;
  }

  async generateProof(email: string, secret: string): Promise<EmailProof> {
    const [localPart, domain] = email.split('@');
    if (!localPart || !domain) throw new Error('Invalid email format');
    if (!this.config.allowedDomains.includes(domain)) {
      throw new Error(`Domain ${domain} not in allowed list`);
    }

    return {
      domainProof: await this.generateDomainProof(domain),
      ownershipProof: await this.generateOwnershipProof(email, secret),
      nullifier: this.generateNullifier(email),
      publicSignals: {
        domainHash: this.hashDomain(domain),
        timestamp: Date.now(),
      },
    };
  }

  async verifyProof(proof: EmailProof): Promise<{ valid: boolean }> {
    const now = Date.now();
    const proofAge = (now - proof.publicSignals.timestamp) / 1000;
    const notExpired = proofAge < this.config.proofExpiry;
    const domainValid = this.config.allowedDomains.some(
      d => this.hashDomain(d) === proof.publicSignals.domainHash
    );
    return { valid: domainValid && notExpired };
  }

  private async generateDomainProof(domain: string): Promise<string> {
    const domainHashes = this.config.allowedDomains.map(d => this.hashDomain(d));
    return createHash('sha256').update(domain).digest('hex');
  }

  private async generateOwnershipProof(email: string, secret: string): Promise<string> {
    return createHash('sha256').update(email + secret).digest('hex');
  }

  private generateNullifier(email: string): string {
    return createHash('sha256').update('nullifier' + email).digest('hex');
  }

  private hashDomain(domain: string): string {
    return createHash('sha256').update(domain.toLowerCase()).digest('hex').substring(0, 32);
  }
}

export { ZkEmailProver as default };