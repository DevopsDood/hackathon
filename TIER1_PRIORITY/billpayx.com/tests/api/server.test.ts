/**
 * Tests for API Server
 */

import request from 'supertest';
import app from '../../src/api/server';

describe('API Server', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('service', 'stealth-payment-gateway');
      expect(response.body).toHaveProperty('version', '1.0.0');
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/unknown-route')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Endpoint not found');
      expect(response.body).toHaveProperty('code', 'NOT_FOUND');
    });
  });
});

describe('Payment Endpoints', () => {
  const mockMerchantKey = 'test_merchant_key_123';

  describe('POST /api/v1/payments/create', () => {
    it('should create a new payment', async () => {
      const response = await request(app)
        .post('/api/v1/payments/create')
        .set('x-merchant-key', mockMerchantKey)
        .send({
          amount: 100,
          currency: 'USDC',
          orderId: 'order_123',
          expiresIn: 60,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('paymentId');
      expect(response.body.data).toHaveProperty('ephemeralPublicKey');
      expect(response.body.data).toHaveProperty('amount', 100);
      expect(response.body.data).toHaveProperty('currency', 'USDC');
      expect(response.body.data).toHaveProperty('orderId', 'order_123');
      expect(response.body.data).toHaveProperty('status', 'pending');
      expect(response.body.data).toHaveProperty('paymentUrl');
      expect(response.body.data).toHaveProperty('qrCode');
    });

    it('should return 400 for invalid amount', async () => {
      const response = await request(app)
        .post('/api/v1/payments/create')
        .set('x-merchant-key', mockMerchantKey)
        .send({
          amount: -100,
          currency: 'USDC',
          orderId: 'order_123',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe('INVALID_AMOUNT');
    });

    it('should return 400 for missing orderId', async () => {
      const response = await request(app)
        .post('/api/v1/payments/create')
        .set('x-merchant-key', mockMerchantKey)
        .send({
          amount: 100,
          currency: 'USDC',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe('MISSING_ORDER_ID');
    });

    it('should return 401 without merchant key', async () => {
      const response = await request(app)
        .post('/api/v1/payments/create')
        .send({
          amount: 100,
          currency: 'USDC',
          orderId: 'order_123',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe('UNAUTHORIZED');
    });
  });

  describe('GET /api/v1/payments/:id/status', () => {
    it('should return payment status', async () => {
      const response = await request(app)
        .get('/api/v1/payments/pay_123/status')
        .set('x-merchant-key', mockMerchantKey)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('paymentId', 'pay_123');
      expect(response.body.data).toHaveProperty('status');
    });

    it('should return 401 without merchant key', async () => {
      const response = await request(app)
        .get('/api/v1/payments/pay_123/status')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/payments/verify', () => {
    it('should verify a payment', async () => {
      const response = await request(app)
        .post('/api/v1/payments/verify')
        .set('x-merchant-key', mockMerchantKey)
        .send({
          paymentId: 'pay_123',
          proof: 'mock_proof',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('valid', true);
      expect(response.body.data).toHaveProperty('paymentId', 'pay_123');
      expect(response.body.data).toHaveProperty('verifiedAt');
    });

    it('should return 400 for missing paymentId', async () => {
      const response = await request(app)
        .post('/api/v1/payments/verify')
        .set('x-merchant-key', mockMerchantKey)
        .send({
          proof: 'mock_proof',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe('MISSING_PAYMENT_ID');
    });
  });
});

describe('Merchant Endpoints', () => {
  const mockMerchantKey = 'test_merchant_key_456';

  describe('GET /api/v1/merchant/balance', () => {
    it('should return merchant balance', async () => {
      const response = await request(app)
        .get('/api/v1/merchant/balance')
        .set('x-merchant-key', mockMerchantKey)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalBalance');
      expect(response.body.data).toHaveProperty('balances');
      expect(response.body.data).toHaveProperty('paymentCount');
      expect(response.body.data).toHaveProperty('stealthAddresses');
    });

    it('should return 401 without merchant key', async () => {
      const response = await request(app)
        .get('/api/v1/merchant/balance')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/merchant/scan', () => {
    it('should scan for payments', async () => {
      const response = await request(app)
        .post('/api/v1/merchant/scan')
        .set('x-merchant-key', mockMerchantKey)
        .send({
          fromBlock: 1000000,
          toBlock: 1000100,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('scannedBlocks');
      expect(response.body.data).toHaveProperty('lastBlock');
      expect(response.body.data).toHaveProperty('scanDuration');
      expect(response.body.data).toHaveProperty('newPayments');
      expect(response.body.data).toHaveProperty('payments');
    });

    it('should accept optional parameters', async () => {
      const response = await request(app)
        .post('/api/v1/merchant/scan')
        .set('x-merchant-key', mockMerchantKey)
        .send({
          fromBlock: 1000000,
          toBlock: 1000100,
          tokenMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          minAmount: '1000000',
          limit: 50,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/v1/merchant/withdraw', () => {
    it('should process withdrawal request', async () => {
      const response = await request(app)
        .post('/api/v1/merchant/withdraw')
        .set('x-merchant-key', mockMerchantKey)
        .send({
          amount: 100,
          recipient: 'SolanaAddress123',
          currency: 'SOL',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('withdrawalId');
      expect(response.body.data).toHaveProperty('amount');
      expect(response.body.data).toHaveProperty('recipient', 'SolanaAddress123');
      expect(response.body.data).toHaveProperty('currency', 'SOL');
      expect(response.body.data).toHaveProperty('status', 'pending');
    });

    it('should return 400 for missing recipient', async () => {
      const response = await request(app)
        .post('/api/v1/merchant/withdraw')
        .set('x-merchant-key', mockMerchantKey)
        .send({
          amount: 100,
          currency: 'SOL',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe('MISSING_RECIPIENT');
    });

    it('should accept "all" as amount', async () => {
      const response = await request(app)
        .post('/api/v1/merchant/withdraw')
        .set('x-merchant-key', mockMerchantKey)
        .send({
          amount: 'all',
          recipient: 'SolanaAddress123',
          currency: 'SOL',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.amount).toBe('all');
    });
  });
});
