/**
 * Password Vault - Main Entry Point
 */

export { HibpClient, PasswordHealthChecker, PasswordAnalyzer } from './hibp-client.js';
export { PasswordVault } from './vault.js';
export type { BreachCheckResult, PasswordHealthScore } from './hibp-client.js';
export type { VaultEntry, DecryptedEntry } from './vault.js';

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Password Vault - Secure password storage with HIBP');
    console.log('Commands:');
    console.log('  check <password>    Check password against HIBP');
    console.log('  health <password>   Get full health score');
    process.exit(0);
  }

  const command = args[0];

  if (command === 'check' && args[1]) {
    const { HibpClient } = await import('./hibp-client.js');
    const hibp = new HibpClient();
    const result = await hibp.checkPassword(args[1]);
    console.log('Breach Check:');
    console.log('  Breached:', result.isBreached);
    console.log('  Count:', result.breachCount);
    console.log('  Severity:', result.severity);
  }

  if (command === 'health' && args[1]) {
    const { PasswordHealthChecker } = await import('./hibp-client.js');
    const checker = new PasswordHealthChecker();
    const result = await checker.checkHealth(args[1]);
    console.log('Health Score:', result.score, '/ 100');
    console.log('Category:', result.category);
    console.log('Breached:', result.isBreached);
    console.log('Crack Time:', result.crackTime);
    console.log('Suggestions:', result.suggestions.join(', '));
  }
}