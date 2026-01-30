/**
 * Messaging Client for Quantum Terminal
 */

import { HybridEncryption } from '../crypto/hybrid';

export interface Message {
  id: string;
  username: string;
  text: string;
  timestamp: number;
  encrypted: boolean;
}

export interface ClientConfig {
  username: string;
  room: string;
  useHybrid: boolean;
  serverUrl?: string;
}

export class MessagingClient {
  private config: ClientConfig;
  private encryption: HybridEncryption;
  private messageHandlers: ((msg: Message) => void)[] = [];
  private connected = false;

  constructor(config: ClientConfig) {
    this.config = {
      serverUrl: 'wss://relay.choom.chat',
      ...config
    };
    this.encryption = new HybridEncryption();
  }

  async connect(): Promise<void> {
    this.connected = true;
    console.log(`Connecting to ${this.config.serverUrl}/room/${this.config.room}`);
  }

  async sendMessage(text: string): Promise<void> {
    if (!this.connected) throw new Error('Not connected');
    console.log(`Sent: ${text}`);
  }

  onMessage(handler: (msg: Message) => void): void {
    this.messageHandlers.push(handler);
  }

  disconnect(): void {
    this.connected = false;
  }
}
