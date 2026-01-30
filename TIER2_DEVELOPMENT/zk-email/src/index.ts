export { ZkEmailProver } from './zk-email.js';
export type { EmailProof, EmailVerificationConfig } from './zk-email.js';

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('ZK Email - Zero-Knowledge Email Verification');
    console.log('Commands:');
    console.log('  prove <email> <secret>    Generate proof');
    console.log('  verify <proof>            Verify proof');
    process.exit(0);
  }

  if (args[0] === 'prove' && args[1] && args[2]) {
    const { ZkEmailProver } = await import('./zk-email.js');
    const prover = new ZkEmailProver({
      allowedDomains: ['gmail.com', 'yahoo.com', 'outlook.com'],
      proofExpiry: 3600,
    });
    const proof = await prover.generateProof(args[1], args[2]);
    console.log('Generated proof:');
    console.log(JSON.stringify(proof, null, 2));
  }
}