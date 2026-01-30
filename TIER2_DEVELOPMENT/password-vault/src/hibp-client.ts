/**
 * HIBP (HaveIBeenPwned) API Client
 * Checks passwords against known data breaches using k-anonymity
 */

import { createHash } from 'crypto';

const HIBP_API_BASE = 'https://api.pwnedpasswords.com/range';

export interface BreachCheckResult {
  isBreached: boolean;
  breachCount: number;
  severity: 'safe' | 'low' | 'medium' | 'high' | 'critical';
}

export interface PasswordHealthScore {
  score: number;
  category: 'very_weak' | 'weak' | 'fair' | 'strong' | 'very_strong';
  isBreached: boolean;
  breachCount: number;
  crackTime: string;
  suggestions: string[];
}

export class HibpClient {
  private apiBase: string;
  private userAgent: string;

  constructor(userAgent = 'PasswordVault-Client') {
    this.apiBase = HIBP_API_BASE;
    this.userAgent = userAgent;
  }

  async checkPassword(password: string): Promise<BreachCheckResult> {
    const hash = createHash('sha1').update(password).digest('hex').toUpperCase();
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5);

    try {
      const response = await fetch(`${this.apiBase}/${prefix}`, {
        headers: {
          'User-Agent': this.userAgent,
          'Add-Padding': 'true',
        },
      });

      if (!response.ok) {
        throw new Error(`HIBP API error: ${response.status}`);
      }

      const data = await response.text();
      const breaches = this.parseBreachResponse(data, suffix);

      return {
        isBreached: breaches.count > 0,
        breachCount: breaches.count,
        severity: this.calculateSeverity(breaches.count),
      };
    } catch (error) {
      console.error('HIBP check failed:', error);
      return { isBreached: true, breachCount: -1, severity: 'high' };
    }
  }

  private parseBreachResponse(data: string, targetSuffix: string): { count: number } {
    for (const line of data.split('\n')) {
      const [hashSuffix, count] = line.split(':');
      if (hashSuffix === targetSuffix) {
        return { count: parseInt(count, 10) || 0 };
      }
    }
    return { count: 0 };
  }

  private calculateSeverity(count: number): BreachCheckResult['severity'] {
    if (count === 0) return 'safe';
    if (count < 10) return 'low';
    if (count < 100) return 'medium';
    if (count < 1000) return 'high';
    return 'critical';
  }
}

export class PasswordAnalyzer {
  analyze(password: string) {
    const length = password.length;
    let hasLower = false, hasUpper = false, hasNumbers = false, hasSymbols = false;

    for (const char of password) {
      if (/[a-z]/.test(char)) hasLower = true;
      else if (/[A-Z]/.test(char)) hasUpper = true;
      else if (/[0-9]/.test(char)) hasNumbers = true;
      else hasSymbols = true;
    }

    let charsetSize = 0;
    if (hasLower) charsetSize += 26;
    if (hasUpper) charsetSize += 26;
    if (hasNumbers) charsetSize += 10;
    if (hasSymbols) charsetSize += 32;

    const entropy = length * Math.log2(charsetSize || 1);

    return { entropy, length, hasLower, hasUpper, hasNumbers, hasSymbols };
  }

  estimateCrackTime(entropy: number): string {
    const guessesPerSecond = 10e9;
    const seconds = Math.pow(2, entropy) / guessesPerSecond;

    if (seconds < 1) return 'instant';
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
    return 'centuries';
  }

  generateSuggestions(analysis: ReturnType<PasswordAnalyzer['analyze']>): string[] {
    const suggestions: string[] = [];
    if (analysis.length < 12) suggestions.push('Use at least 12 characters');
    if (!analysis.hasUpper) suggestions.push('Add uppercase letters');
    if (!analysis.hasLower) suggestions.push('Add lowercase letters');
    if (!analysis.hasNumbers) suggestions.push('Add numbers');
    if (!analysis.hasSymbols) suggestions.push('Add special characters');
    return suggestions;
  }
}

export class PasswordHealthChecker {
  private hibp = new HibpClient();
  private analyzer = new PasswordAnalyzer();

  async checkHealth(password: string): Promise<PasswordHealthScore> {
    const breachResult = await this.hibp.checkPassword(password);
    const analysis = this.analyzer.analyze(password);
    const crackTime = this.analyzer.estimateCrackTime(analysis.entropy);
    const suggestions = this.analyzer.generateSuggestions(analysis);

    let score = Math.min(analysis.length * 2, 30);
    if (analysis.hasLower) score += 10;
    if (analysis.hasUpper) score += 10;
    if (analysis.hasNumbers) score += 10;
    if (analysis.hasSymbols) score += 10;
    score += Math.min(analysis.entropy / 4, 20);
    
    if (breachResult.isBreached) score = Math.max(0, score - 50);
    score = Math.min(Math.round(score), 100);

    let category: PasswordHealthScore['category'];
    if (score < 20) category = 'very_weak';
    else if (score < 40) category = 'weak';
    else if (score < 60) category = 'fair';
    else if (score < 80) category = 'strong';
    else category = 'very_strong';

    if (breachResult.isBreached) {
      suggestions.unshift(`WARNING: Password found in ${breachResult.breachCount.toLocaleString()} breaches!`);
    }

    return { score, category, isBreached: breachResult.isBreached, breachCount: breachResult.breachCount, crackTime, suggestions };
  }
}