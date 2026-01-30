/**
 * Password Vault - Secure password storage with HIBP integration
 */

import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';
import { PasswordHealthChecker, PasswordHealthScore } from './hibp-client.js';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 32;
const KEY_LENGTH = 32;

export interface VaultEntry {
  id: string;
  name: string;
  username: string;
  encryptedPassword: Buffer;
  iv: Buffer;
  authTag: Buffer;
  salt: Buffer;
  url?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  healthScore?: PasswordHealthScore;
}

export interface DecryptedEntry {
  id: string;
  name: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
  healthScore?: PasswordHealthScore;
}

export class PasswordVault {
  private masterKey: Buffer | null = null;
  private entries: Map<string, VaultEntry> = new Map();
  private healthChecker: PasswordHealthChecker;

  constructor() {
    this.healthChecker = new PasswordHealthChecker();
  }

  async initialize(masterPassword: string): Promise<void> {
    const salt = randomBytes(SALT_LENGTH);
    this.masterKey = scryptSync(masterPassword, salt, KEY_LENGTH);
  }

  async addEntry(
    name: string,
    username: string,
    password: string,
    url?: string,
    notes?: string
  ): Promise<VaultEntry> {
    if (!this.masterKey) throw new Error('Vault not initialized');

    const healthScore = await this.healthChecker.checkHealth(password);
    const salt = randomBytes(SALT_LENGTH);
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, this.masterKey, iv);
    
    const encryptedPassword = Buffer.concat([cipher.update(password, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();

    const entry: VaultEntry = {
      id: this.generateId(),
      name, username, encryptedPassword, iv, authTag, salt,
      url, notes,
      createdAt: new Date(),
      updatedAt: new Date(),
      healthScore,
    };

    this.entries.set(entry.id, entry);
    return entry;
  }

  getEntry(id: string): DecryptedEntry {
    if (!this.masterKey) throw new Error('Vault not initialized');

    const entry = this.entries.get(id);
    if (!entry) throw new Error('Entry not found');

    const decipher = createDecipheriv(ALGORITHM, this.masterKey, entry.iv);
    decipher.setAuthTag(entry.authTag);
    
    const password = Buffer.concat([decipher.update(entry.encryptedPassword), decipher.final()]).toString('utf8');

    return { id: entry.id, name: entry.name, username: entry.username, password, url: entry.url, notes: entry.notes, healthScore: entry.healthScore };
  }

  async updateHealthScores(): Promise<void> {
    if (!this.masterKey) return;
    for (const [id, entry] of this.entries) {
      try {
        const decrypted = this.getEntry(id);
        entry.healthScore = await this.healthChecker.checkHealth(decrypted.password);
        entry.updatedAt = new Date();
      } catch (error) {
        console.error(`Failed to update health for entry ${id}:`, error);
      }
    }
  }

  getAllEntries(): Omit<VaultEntry, 'encryptedPassword' | 'iv' | 'authTag' | 'salt'>[] {
    return Array.from(this.entries.values()).map(entry => ({
      id: entry.id, name: entry.name, username: entry.username,
      url: entry.url, notes: entry.notes,
      createdAt: entry.createdAt, updatedAt: entry.updatedAt, healthScore: entry.healthScore,
    }));
  }

  getAtRiskEntries(): VaultEntry[] {
    return Array.from(this.entries.values()).filter(entry => {
      if (!entry.healthScore) return false;
      return entry.healthScore.isBreached || entry.healthScore.score < 60;
    });
  }

  deleteEntry(id: string): boolean {
    return this.entries.delete(id);
  }

  lock(): void {
    this.masterKey = null;
  }

  isLocked(): boolean {
    return this.masterKey === null;
  }

  private generateId(): string {
    return randomBytes(16).toString('hex');
  }

  export(): string {
    return JSON.stringify({ entries: Array.from(this.entries.entries()), exportedAt: new Date().toISOString() });
  }

  import(encryptedData: string): void {
    const data = JSON.parse(encryptedData);
    this.entries = new Map(data.entries);
  }
}