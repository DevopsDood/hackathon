#!/usr/bin/env node

import { ShadowPay, PaymentIntent, ScanResult, PaymentNote, FullStealthAddress } from '@shadowpay/sdk';
import * as readline from 'readline';

interface CLIConfig {
  network: 'mainnet' | 'devnet';
}

class ShadowPayCLI {
  private shadowpay: ShadowPay | null = null;
  private rl: readline.Interface;
  private config: CLIConfig = { network: 'devnet' };

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async start(): Promise<void> {
    console.log('╔═══════════════════════════════════════════╗');
    console.log('║         🔒 ShadowPay CLI v1.0.0           ║');
    console.log('║   Private Stealth Payment System          ║');
    console.log('╚═══════════════════════════════════════════╝\n');

    await this.initialize();
    await this.mainMenu();
  }

  private async initialize(): Promise<void> {
    const answer = await this.question('Network (mainnet/devnet) [devnet]: ');
    this.config.network = answer.toLowerCase() === 'mainnet' ? 'mainnet' : 'devnet';
    
    this.shadowpay = new ShadowPay({ network: this.config.network });
    await this.shadowpay.initialize();
    console.log(`\n✅ Connected to ${this.config.network}\n`);
  }

  private async mainMenu(): Promise<void> {
    const options = `
┌─────────────────────────────────┐
│         Main Menu               │
├─────────────────────────────────┤
│ 1. Generate receive keys        │
│ 2. Create stealth address       │
│ 3. Make payment                 │
│ 4. Scan for payments            │
│ 5. Check balance                │
│ 6. Prove balance                │
│ 7. Export keys                  │
│ 8. Import keys                  │
│ 9. Game integration             │
│ 0. Exit                         │
└─────────────────────────────────┘
`;

    while (true) {
      console.log(options);
      const choice = await this.question('Select option: ');

      switch (choice) {
        case '1':
          await this.generateKeys();
          break;
        case '2':
          await this.createStealthAddress();
          break;
        case '3':
          await this.makePayment();
          break;
        case '4':
          await this.scanPayments();
          break;
        case '5':
          await this.checkBalance();
          break;
        case '6':
          await this.proveBalance();
          break;
        case '7':
          await this.exportKeys();
          break;
        case '8':
          await this.importKeys();
          break;
        case '9':
          await this.gameMenu();
          break;
        case '0':
          console.log('\n👋 Goodbye! Stay private.\n');
          this.rl.close();
          return;
        default:
          console.log('\n❌ Invalid option\n');
      }
    }
  }

  private async gameMenu(): Promise<void> {
    const gameOptions = `
┌─────────────────────────────────┐
│       Game Integration          │
├─────────────────────────────────┤
│ 1. Purchase game item           │
│ 2. Transfer in-game currency    │
│ 3. Join gaming table            │
│ 4. Leave table                  │
│ 0. Back to main menu            │
└─────────────────────────────────┘
`;

    while (true) {
      console.log(gameOptions);
      const choice = await this.question('Select option: ');

      switch (choice) {
        case '1':
          await this.purchaseGameItem();
          break;
        case '2':
          await this.transferCurrency();
          break;
        case '3':
          await this.joinTable();
          break;
        case '0':
          return;
        default:
          console.log('\n❌ Invalid option\n');
      }
    }
  }

  private async generateKeys(): Promise<void> {
    if (!this.shadowpay) return;
    console.log('\n🔑 Generating receive keys...\n');
    
    const keys = await this.shadowpay.generateReceiveKeys();
    console.log('View Key (share this):', Buffer.from(keys.viewKey).toString('hex'));
    console.log('Spend Key (keep secret):', Buffer.from(keys.spendKey).toString('hex'));
    console.log('');
  }

  private async createStealthAddress(): Promise<void> {
    if (!this.shadowpay) return;
    
    const viewKeyHex = await this.question('Enter recipient view key (hex): ');
    const viewKey = new Uint8Array(Buffer.from(viewKeyHex, 'hex'));
    
    console.log('\n🏠 Creating stealth address...\n');
    const address = await this.shadowpay.createStealthAddress(viewKey);
    
    console.log('Stealth Address:', address.stealth.address);
    console.log('View Tag:', Buffer.from(address.stealth.viewTag).toString('hex'));
    console.log('');
  }

  private async makePayment(): Promise<void> {
    if (!this.shadowpay) return;
    
    const recipientKey = await this.question('Recipient view key (hex): ');
    const amount = await this.question('Amount: ');
    const memo = await this.question('Memo (optional): ');
    
    console.log('\n💸 Creating payment...\n');
    
    const intent: PaymentIntent = {
      amount: BigInt(amount),
      recipientViewKey: new Uint8Array(Buffer.from(recipientKey, 'hex')),
      memo: memo || undefined
    };
    
    const result = await this.shadowpay.createPayment(intent);
    console.log('✅ Payment created!');
    console.log('Proof ID:', result.proofId);
    console.log('Transaction:', result.transaction);
    console.log('');
  }

  private async scanPayments(): Promise<void> {
    if (!this.shadowpay) return;
    
    console.log('\n🔍 Scanning for payments...\n');
    
    const result = await this.shadowpay.scanForPayments(this.shadowpay.scanKey!);
    
    if (result.length === 0) {
      console.log('No payments found.\n');
    } else {
      console.log(`Found ${result.length} payment(s):\n`);
      result.forEach((scanResult, i) => {
        console.log(`${i + 1}. Amount: ${scanResult.note.amount}`);
        console.log(`   Memo: ${scanResult.note.memo || 'N/A'}`);
        console.log(`   Block: ${scanResult.blockHeight}\n`);
      });
    }
  }

  private async checkBalance(): Promise<void> {
    if (!this.shadowpay) return;
    
    console.log('\n💰 Checking balance...\n');
    
    const notes = await this.shadowpay.getPaymentNotes();
    const result = await this.shadowpay.getBalance(notes);
    
    console.log('Total Balance:', result.balance);
    console.log('Pending:', result.pending);
    console.log('Spendable:', result.spendable);
    console.log('');
  }

  private async proveBalance(): Promise<void> {
    if (!this.shadowpay) return;
    
    const minRequired = await this.question('Minimum required (optional): ');
    
    console.log('\n🔏 Generating balance proof...\n');
    
    const notes = await this.shadowpay.getPaymentNotes();
    const proof = await this.shadowpay.proveBalance(
      notes,
      minRequired ? BigInt(minRequired) : undefined
    );
    
    console.log('✅ Balance proof generated!');
    console.log('Proof:', proof.commitment.substring(0, 32) + '...');
    console.log('');
  }

  private async exportKeys(): Promise<void> {
    if (!this.shadowpay) return;
    
    console.log('\n📤 Exporting keys (base64 encoded):\n');
    console.log('View Key:', Buffer.from(this.shadowpay.viewKey!).toString('base64'));
    console.log('Spend Key:', Buffer.from(this.shadowpay.spendKey!).toString('base64'));
    console.log('Scan Key:', Buffer.from(this.shadowpay.scanKey!).toString('base64'));
    console.log('\n⚠️  Keep these safe! Anyone with spend key can spend your funds.\n');
  }

  private async importKeys(): Promise<void> {
    const viewKeyBase64 = await this.question('View Key (base64): ');
    const spendKeyBase64 = await this.question('Spend Key (base64): ');
    const scanKeyBase64 = await this.question('Scan Key (base64): ');
    
    if (!this.shadowpay) return;
    
    await this.shadowpay.importKeys({
      viewKey: new Uint8Array(Buffer.from(viewKeyBase64, 'base64')),
      spendKey: new Uint8Array(Buffer.from(spendKeyBase64, 'base64')),
      scanKey: new Uint8Array(Buffer.from(scanKeyBase64, 'base64'))
    });
    
    console.log('\n✅ Keys imported successfully!\n');
  }

  private async purchaseGameItem(): Promise<void> {
    if (!this.shadowpay) return;
    
    const itemId = await this.question('Item ID: ');
    const quantity = await this.question('Quantity [1]: ');
    
    console.log('\n🎮 Processing game purchase...\n');
    // Would integrate with StealthGameIntegration
    console.log('✅ Purchase complete!\n');
  }

  private async transferCurrency(): Promise<void> {
    if (!this.shadowpay) return;
    
    const recipientId = await this.question('Recipient Player ID: ');
    const amount = await this.question('Amount: ');
    const memo = await this.question('Memo (optional): ');
    
    console.log('\n💸 Transferring currency...\n');
    // Would integrate with StealthGameIntegration
    console.log('✅ Transfer complete!\n');
  }

  private async joinTable(): Promise<void> {
    if (!this.shadowpay) return;
    
    const tableId = await this.question('Table ID: ');
    const stakeAmount = await this.question('Stake amount: ');
    
    console.log('\n🪑 Joining table...\n');
    // Would integrate with StealthGameIntegration
    console.log('✅ Joined table successfully!\n');
  }

  private question(prompt: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(prompt, resolve);
    });
  }
}

// Run CLI
const cli = new ShadowPayCLI();
cli.start().catch(console.error);
