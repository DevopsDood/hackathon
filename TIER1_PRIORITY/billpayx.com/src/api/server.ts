/**
 * Stealth Payment Gateway API Server
 * 
 * Express server providing REST API endpoints for stealth payment operations
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PaymentScanner, ScanOptions } from '../stealth/scan';
import { StealthKeyManager } from '../stealth/keys';

// Extend Express Request to include our custom properties
declare global {
  namespace Express {
    interface Request {
      merchantId?: string;
      scanner?: PaymentScanner;
    }
  }
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Store active scanners (in production, use Redis or database)
const scanners = new Map<string, PaymentScanner>();
const keyManager = new StealthKeyManager();

// ============================================================================
// Middleware
// ============================================================================

/**
 * Merchant authentication middleware
 * In production, use proper JWT or API key authentication
 */
const authenticateMerchant = (req: Request, res: Response, next: NextFunction): void => {
  const merchantKey = req.headers['x-merchant-key'] as string;
  
  if (!merchantKey) {
    res.status(401).json({
      success: false,
      error: 'Missing merchant key',
      code: 'UNAUTHORIZED',
    });
    return;
  }
  
  // In production, validate against database
  req.merchantId = merchantKey;
  next();
};

/**
 * Initialize scanner for merchant
 */
const initScanner = (req: Request, res: Response, next: NextFunction): void => {
  const merchantId = req.merchantId;
  
  if (!merchantId) {
    res.status(401).json({
      success: false,
      error: 'Merchant not authenticated',
      code: 'UNAUTHORIZED',
    });
    return;
  }
  
  // Get or create scanner for this merchant
  let scanner = scanners.get(merchantId);
  if (!scanner) {
    // In production, derive from merchant's stored private key
    const mockPrivateKey = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      mockPrivateKey[i] = Math.floor(Math.random() * 256);
    }
    scanner = new PaymentScanner(mockPrivateKey, process.env.SOLANA_RPC_URL);
    scanners.set(merchantId, scanner);
  }
  
  req.scanner = scanner;
  next();
};

// ============================================================================
// Health Check
// ============================================================================

/**
 * @route GET /health
 * @desc Health check endpoint
 * @access Public
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'stealth-payment-gateway',
    version: '1.0.0',
  });
});

// ============================================================================
// Payment Endpoints
// ============================================================================

/**
 * @route POST /api/v1/payments/create
 * @desc Create a new stealth payment request
 * @access Private
 */
app.post('/api/v1/payments/create', authenticateMerchant, async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'USDC', orderId, expiresIn = 60 } = req.body;
    
    // Validate inputs
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      res.status(400).json({
        success: false,
        error: 'Invalid amount',
        code: 'INVALID_AMOUNT',
      });
      return;
    }
    
    if (!orderId) {
      res.status(400).json({
        success: false,
        error: 'Missing orderId',
        code: 'MISSING_ORDER_ID',
      });
      return;
    }
    
    // Generate ephemeral keys for this payment
    const ephemeral = await keyManager.generateEphemeralKeys();
    
    // Generate payment ID
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Calculate expiration
    const expiresAt = new Date(Date.now() + expiresIn * 60000);
    
    // In production, store payment request in database
    // For now, return mock response
    res.json({
      success: true,
      data: {
        paymentId,
        ephemeralPublicKey: Buffer.from(ephemeral.publicKey).toString('base64'),
        amount,
        currency,
        orderId,
        status: 'pending',
        expiresAt: expiresAt.toISOString(),
        paymentUrl: `${process.env.PAYMENT_BASE_URL || 'https://billpayx.com'}/pay/${paymentId}`,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
          `${process.env.PAYMENT_BASE_URL || 'https://billpayx.com'}/pay/${paymentId}`
        )}`,
      },
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create payment',
      code: 'INTERNAL_ERROR',
    });
  }
});

/**
 * @route GET /api/v1/payments/:id/status
 * @desc Get payment status
 * @access Private
 */
app.get('/api/v1/payments/:id/status', authenticateMerchant, initScanner, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const scanner = req.scanner!;
    
    // Check if payment is in detected payments
    const payment = scanner.getPayment(id);
    
    if (payment) {
      res.json({
        success: true,
        data: {
          paymentId: id,
          status: 'completed',
          stealthAddress: payment.stealthAddress,
          amount: payment.amount.toString(),
          currency: payment.tokenMint || 'SOL',
          detectedAt: payment.detectedAt.toISOString(),
          transactionSignature: payment.transactionSignature,
        },
      });
      return;
    }
    
    // In production, check database for pending payments
    res.json({
      success: true,
      data: {
        paymentId: id,
        status: 'pending',
        detectedAt: null,
        transactionSignature: null,
      },
    });
  } catch (error) {
    console.error('Error getting payment status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get payment status',
      code: 'INTERNAL_ERROR',
    });
  }
});

/**
 * @route POST /api/v1/payments/verify
 * @desc Verify a payment with optional proof
 * @access Private
 */
app.post('/api/v1/payments/verify', authenticateMerchant, async (req: Request, res: Response) => {
  try {
    const { paymentId, proof } = req.body;
    
    if (!paymentId) {
      res.status(400).json({
        success: false,
        error: 'Missing paymentId',
        code: 'MISSING_PAYMENT_ID',
      });
      return;
    }
    
    // In production, verify ZK proof if provided
    // For now, return mock verification
    res.json({
      success: true,
      data: {
        valid: true,
        paymentId,
        verifiedAt: new Date().toISOString(),
        proofType: proof ? 'zk' : 'none',
      },
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify payment',
      code: 'INTERNAL_ERROR',
    });
  }
});

// ============================================================================
// Merchant Endpoints
// ============================================================================

/**
 * @route GET /api/v1/merchant/balance
 * @desc Get merchant's stealth balance
 * @access Private
 */
app.get('/api/v1/merchant/balance', authenticateMerchant, initScanner, async (req: Request, res: Response) => {
  try {
    const scanner = req.scanner!;
    const payments = scanner.getDetectedPayments();
    
    // Calculate totals by currency
    const balances: Record<string, { total: string; count: number }> = {};
    
    for (const payment of payments) {
      const currency = payment.tokenMint || 'SOL';
      if (!balances[currency]) {
        balances[currency] = { total: '0', count: 0 };
      }
      balances[currency].total = (BigInt(balances[currency].total) + payment.amount).toString();
      balances[currency].count++;
    }
    
    res.json({
      success: true,
      data: {
        totalBalance: scanner.getTotalBalance().toString(),
        balances,
        paymentCount: payments.length,
        stealthAddresses: payments.map(p => ({
          address: p.stealthAddress,
          balance: p.amount.toString(),
          viewTag: p.viewTag,
          detectedAt: p.detectedAt.toISOString(),
        })),
      },
    });
  } catch (error) {
    console.error('Error getting balance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get balance',
      code: 'INTERNAL_ERROR',
    });
  }
});

/**
 * @route POST /api/v1/merchant/scan
 * @desc Scan for new payments
 * @access Private
 */
app.post('/api/v1/merchant/scan', authenticateMerchant, initScanner, async (req: Request, res: Response) => {
  try {
    const { fromBlock, toBlock, tokenMint, minAmount, limit } = req.body;
    const scanner = req.scanner!;
    
    const options: ScanOptions = {
      fromBlock,
      toBlock,
      tokenMint,
      minAmount: minAmount ? BigInt(minAmount) : undefined,
      limit,
    };
    
    const result = await scanner.scanForPayments(options);
    
    res.json({
      success: true,
      data: {
        scannedBlocks: result.blocksScanned,
        lastBlock: result.lastBlock,
        scanDuration: result.scanDuration,
        newPayments: result.payments.length,
        payments: result.payments.map(p => ({
          paymentId: p.paymentId,
          stealthAddress: p.stealthAddress,
          amount: p.amount.toString(),
          currency: p.tokenMint || 'SOL',
          blockNumber: p.blockNumber,
          detectedAt: p.detectedAt.toISOString(),
        })),
      },
    });
  } catch (error) {
    console.error('Error scanning for payments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to scan for payments',
      code: 'INTERNAL_ERROR',
    });
  }
});

/**
 * @route POST /api/v1/merchant/withdraw
 * @desc Withdraw from stealth addresses
 * @access Private
 */
app.post('/api/v1/merchant/withdraw', authenticateMerchant, initScanner, async (req: Request, res: Response) => {
  try {
    const { amount, recipient, currency = 'SOL' } = req.body;
    
    if (!recipient) {
      res.status(400).json({
        success: false,
        error: 'Missing recipient address',
        code: 'MISSING_RECIPIENT',
      });
      return;
    }
    
    // In production, create and sign withdrawal transaction
    const withdrawalId = `wd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    res.json({
      success: true,
      data: {
        withdrawalId,
        amount: amount?.toString() || 'all',
        recipient,
        currency,
        status: 'pending',
        estimatedCompletion: new Date(Date.now() + 60000).toISOString(),
      },
    });
  } catch (error) {
    console.error('Error processing withdrawal:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process withdrawal',
      code: 'INTERNAL_ERROR',
    });
  }
});

// ============================================================================
// Error Handling
// ============================================================================

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    code: 'NOT_FOUND',
    path: req.path,
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
  });
});

// ============================================================================
// Server Startup
// ============================================================================

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Stealth Payment Gateway API running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 RPC URL: ${process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'}`);
  });
}

export default app;
export { app, scanners, keyManager };
