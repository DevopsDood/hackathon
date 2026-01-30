/**
 * Tests for Messaging Client
 */

import { MessagingClient, ClientConfig, Message } from '../src/core/messaging';

describe('MessagingClient', () => {
  let client: MessagingClient;
  const defaultConfig: ClientConfig = {
    username: 'testuser',
    room: 'testroom',
    useHybrid: true,
  };

  beforeEach(() => {
    client = new MessagingClient(defaultConfig);
  });

  afterEach(() => {
    client.disconnect();
  });

  describe('Constructor', () => {
    it('should create client with default config', () => {
      expect(client).toBeDefined();
    });

    it('should create client with custom server URL', () => {
      const customClient = new MessagingClient({
        ...defaultConfig,
        serverUrl: 'wss://custom.server.com',
      });
      expect(customClient).toBeDefined();
    });

    it('should create client with PQ-only mode', () => {
      const pqClient = new MessagingClient({
        username: 'pquser',
        room: 'pqroom',
        useHybrid: false,
      });
      expect(pqClient).toBeDefined();
    });
  });

  describe('Connection', () => {
    it('should connect successfully', async () => {
      await expect(client.connect()).resolves.not.toThrow();
    });

    it('should be able to disconnect', async () => {
      await client.connect();
      expect(() => client.disconnect()).not.toThrow();
    });

    it('should allow multiple connect calls', async () => {
      await client.connect();
      await expect(client.connect()).resolves.not.toThrow();
    });
  });

  describe('Message Sending', () => {
    beforeEach(async () => {
      await client.connect();
    });

    it('should send a message', async () => {
      await expect(client.sendMessage('Hello, World!')).resolves.not.toThrow();
    });

    it('should send multiple messages', async () => {
      await client.sendMessage('Message 1');
      await client.sendMessage('Message 2');
      await client.sendMessage('Message 3');
      // If we get here without error, test passes
      expect(true).toBe(true);
    });

    it('should send empty messages', async () => {
      await expect(client.sendMessage('')).resolves.not.toThrow();
    });

    it('should send long messages', async () => {
      const longMessage = 'A'.repeat(1000);
      await expect(client.sendMessage(longMessage)).resolves.not.toThrow();
    });

    it('should fail to send when not connected', async () => {
      const newClient = new MessagingClient(defaultConfig);
      await expect(newClient.sendMessage('test')).rejects.toThrow('Not connected');
    });

    it('should send messages with special characters', async () => {
      await expect(client.sendMessage('Hello! @#$%^&*()')).resolves.not.toThrow();
    });

    it('should send unicode messages', async () => {
      await expect(client.sendMessage('Hello 世界 🌍')).resolves.not.toThrow();
    });
  });

  describe('Message Handling', () => {
    it('should register message handler', () => {
      const handler = jest.fn();
      expect(() => client.onMessage(handler)).not.toThrow();
    });

    it('should allow multiple handlers', () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();
      
      client.onMessage(handler1);
      client.onMessage(handler2);
      
      // If we get here without error, test passes
      expect(true).toBe(true);
    });
  });
});
