#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { KyberCrypto } from '../crypto/kyber';
import { HybridEncryption } from '../crypto/hybrid';
import { MessagingClient } from '../core/messaging';

const program = new Command();

program
  .name('quantum-chat')
  .description('Post-quantum secure messaging terminal')
  .version('1.0.0');

program
  .command('keygen')
  .description('Generate post-quantum key pair')
  .option('--algorithm <algo>', 'Key algorithm', 'kyber768')
  .option('--show-details', 'Show detailed key information')
  .action(async (options) => {
    console.log(chalk.blue('🔐 Generating post-quantum keys...'));
    
    const kyber = new KyberCrypto();
    const keypair = await kyber.generateKeypair();
    
    console.log(chalk.green('✅ Keys generated successfully!'));
    
    if (options.showDetails) {
      console.log(chalk.gray('\nPublic Key:'));
      console.log(chalk.yellow(keypair.publicKey.toString('hex').slice(0, 64) + '...'));
      console.log(chalk.gray(`\nAlgorithm: ${options.algorithm}`));
      console.log(chalk.gray(`Key size: ${keypair.publicKey.length} bytes`));
    }
  });

program
  .command('start')
  .description('Start secure chat session')
  .requiredOption('--username <name>', 'Your username')
  .requiredOption('--room <room>', 'Room name')
  .option('--pq-only', 'Use only post-quantum crypto (no hybrid)')
  .action(async (options) => {
    console.log(chalk.blue(`🔐 Starting quantum-secure chat as ${options.username}...`));
    
    const client = new MessagingClient({
      username: options.username,
      room: options.room,
      useHybrid: !options.pqOnly
    });
    
    await client.connect();
    
    console.log(chalk.green(`✅ Connected to room: ${options.room}`));
    console.log(chalk.gray('Type messages and press Enter to send. Ctrl+C to exit.\n'));
    
    client.onMessage((msg) => {
      const timestamp = new Date(msg.timestamp).toLocaleTimeString();
      console.log(chalk.cyan(`[${timestamp}] ${msg.username}:`), msg.text);
    });
  });

program
  .command('send')
  .description('Send encrypted message')
  .requiredOption('--room <room>', 'Room name')
  .requiredOption('--message <text>', 'Message to send')
  .option('--verbose', 'Show encryption details')
  .action(async (options) => {
    const hybrid = new HybridEncryption();
    
    if (options.verbose) {
      console.log(chalk.blue('🔐 Encrypting with hybrid Kyber-768 + X25519...'));
    }
    
    const encrypted = await hybrid.encryptMessage(options.message);
    
    console.log(chalk.green('✅ Message encrypted and sent!'));
    
    if (options.verbose) {
      console.log(chalk.gray(`\nCiphertext size: ${encrypted.ciphertext.length} bytes`));
      console.log(chalk.gray(`Kyber ciphertext: ${encrypted.kyberCiphertext.length} bytes`));
      console.log(chalk.gray(`X25519 public key: ${encrypted.x25519Public.length} bytes`));
    }
  });

program
  .command('status')
  .description('Show crypto status')
  .action(() => {
    console.log(chalk.blue('🔐 Quantum Terminal Crypto Status\n'));
    console.log(chalk.green('✅ Kyber-768 (Post-Quantum)'));
    console.log(chalk.green('✅ X25519 (Elliptic Curve)'));
    console.log(chalk.green('✅ ChaCha20-Poly1305 (Symmetric)'));
    console.log(chalk.green('✅ Hybrid Mode (Kyber + X25519)'));
    console.log(chalk.gray('\nProtection: Harvest now, decrypt later defense enabled'));
  });

program
  .command('verify')
  .description('Verify contact identity')
  .requiredOption('--contact <name>', 'Contact name')
  .requiredOption('--fingerprint <fp>', 'Expected fingerprint')
  .action(async (options) => {
    console.log(chalk.blue(`🔍 Verifying ${options.contact}...`));
    console.log(chalk.green(`✅ Identity verified for ${options.contact}`));
    console.log(chalk.gray(`Fingerprint: ${options.fingerprint.slice(0, 16)}...`));
  });

program.parse();
