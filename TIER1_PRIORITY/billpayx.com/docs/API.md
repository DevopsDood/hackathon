# Stealth Payment Gateway API Documentation

**Version:** 1.0.0  
**Base URL:** `https://api.billpayx.com`  
**Protocol:** REST + JSON

---

## Table of Contents

1. [Authentication](#authentication)
2. [Payment Endpoints](#payment-endpoints)
3. [Merchant Endpoints](#merchant-endpoints)
4. [Error Handling](#error-handling)
5. [Rate Limiting](#rate-limiting)
6. [SDK Examples](#sdk-examples)

---

## Authentication

All API requests require authentication using a merchant API key passed in the header.

### Header Format

```http
x-merchant-key: your_merchant_api_key_here
```

### Example

```bash
curl -H "x-merchant-key: mk_live_1234567890" \
  https://api.billpayx.com/api/v1/merchant/balance
```

---

## Payment Endpoints

### Create Payment

Create a new stealth payment request.

**Endpoint:** `POST /api/v1/payments/create`

**Headers:**
```http
Content-Type: application/json
x-merchant-key: your_key_here
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `amount` | number | Yes | Payment amount |
| `currency` | string | Yes | Currency code (SOL, USDC, USDT) |
| `orderId` | string | Yes | Merchant's order ID |
| `expiresIn` | number | No | Expiration in minutes (default: 60) |
| `metadata` | object | No | Additional metadata |

**Example Request:**
```json
{
  "amount": 100.00,
  "currency": "USDC",
  "orderId": "order_123",
  "expiresIn": 60,
  "metadata": {
    "customerId": "cust_456",
    "productId": "prod_789"
  }
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "paymentId": "pay_1234567890",
    "ephemeralPublicKey": "A1B2C3D4E5F6...",
    "amount": 100.00,
    "currency": "USDC",
    "orderId": "order_123",
    "status": "pending",
    "expiresAt": "2026-01-30T21:15:58.506Z",
    "paymentUrl": "https://billpayx.com/pay/pay_1234567890",
    "qrCode": "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=..."
  }
}
```

---

### Get Payment Status

Check the status of a payment.

**Endpoint:** `GET /api/v1/payments/:id/status`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Payment ID |

**Example Response:**
```json
{
  "success": true,
  "data": {
    "paymentId": "pay_1234567890",
    "status": "completed",
    "stealthAddress": "stealth_A1B2C3D4...",
    "amount": "1000000000",
    "currency": "USDC",
    "detectedAt": "2026-01-30T20:20:00.000Z",
    "confirmedAt": "2026-01-30T20:21:00.000Z",
    "transactionSignature": "5UjG..."
  }
}
```

**Status Values:**
- `pending` - Payment not yet detected
- `detected` - Payment detected on blockchain
- `confirmed` - Payment confirmed (N confirmations)
- `expired` - Payment expired
- `failed` - Payment failed

---

### Verify Payment

Verify a payment with optional ZK proof.

**Endpoint:** `POST /api/v1/payments/verify`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `paymentId` | string | Yes | Payment ID |
| `proof` | string | No | ZK proof (base64 encoded) |
| `publicSignals` | array | No | Public inputs for verification |

**Example Request:**
```json
{
  "paymentId": "pay_1234567890",
  "proof": "base64_encoded_proof...",
  "publicSignals": ["signal1", "signal2"]
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "paymentId": "pay_1234567890",
    "verifiedAt": "2026-01-30T20:25:00.000Z",
    "proofType": "zk"
  }
}
```

---

## Merchant Endpoints

### Get Balance

Get merchant's total balance across all stealth addresses.

**Endpoint:** `GET /api/v1/merchant/balance`

**Example Response:**
```json
{
  "success": true,
  "data": {
    "totalBalance": "5000000000",
    "balances": {
      "SOL": {
        "total": "1000000000",
        "count": 5
      },
      "USDC": {
        "total": "4000000000",
        "count": 10
      }
    },
    "paymentCount": 15,
    "stealthAddresses": [
      {
        "address": "stealth_A1B2C3D4...",
        "balance": "100000000",
        "viewTag": 42,
        "detectedAt": "2026-01-30T20:00:00.000Z"
      }
    ]
  }
}
```

---

### Scan for Payments

Scan blockchain for new stealth payments.

**Endpoint:** `POST /api/v1/merchant/scan`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fromBlock` | number | No | Start scanning from this block |
| `toBlock` | number | No | End scanning at this block |
| `tokenMint` | string | No | Filter by token mint address |
| `minAmount` | string | No | Minimum amount (as string for precision) |
| `limit` | number | No | Maximum results to return |

**Example Request:**
```json
{
  "fromBlock": 12345678,
  "toBlock": 12345778,
  "tokenMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "minAmount": "1000000",
  "limit": 50
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "scannedBlocks": 100,
    "lastBlock": 12345778,
    "scanDuration": 1500,
    "newPayments": 3,
    "payments": [
      {
        "paymentId": "pay_abc123",
        "stealthAddress": "stealth_A1B2C3D4...",
        "amount": "1000000000",
        "currency": "USDC",
        "blockNumber": 12345700,
        "detectedAt": "2026-01-30T20:15:00.000Z"
      }
    ]
  }
}
```

---

### Withdraw

Withdraw funds from stealth addresses.

**Endpoint:** `POST /api/v1/merchant/withdraw`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `amount` | number \| "all" | Yes | Amount to withdraw or "all" |
| `recipient` | string | Yes | Destination wallet address |
| `currency` | string | Yes | Currency to withdraw |
| `priorityFee` | number | No | Priority fee in lamports |

**Example Request:**
```json
{
  "amount": 100,
  "recipient": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "currency": "SOL",
  "priorityFee": 10000
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "withdrawalId": "wd_1234567890",
    "amount": "100",
    "recipient": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    "currency": "SOL",
    "status": "pending",
    "estimatedCompletion": "2026-01-30T20:30:00.000Z"
  }
}
```

---

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "error": "Human readable error message",
  "code": "ERROR_CODE",
  "details": {} // Optional additional details
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid merchant key |
| `INVALID_AMOUNT` | 400 | Invalid payment amount |
| `MISSING_ORDER_ID` | 400 | Order ID not provided |
| `MISSING_PAYMENT_ID` | 400 | Payment ID not provided |
| `MISSING_RECIPIENT` | 400 | Recipient address not provided |
| `PAYMENT_NOT_FOUND` | 404 | Payment not found |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `NOT_FOUND` | 404 | Endpoint not found |

---

## Rate Limiting

API requests are rate limited based on the endpoint:

| Endpoint | Limit |
|----------|-------|
| `/health` | 100/minute |
| `/api/v1/payments/*` | 60/minute |
| `/api/v1/merchant/*` | 30/minute |

Rate limit headers are included in responses:

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1643572800
```

---

## SDK Examples

### JavaScript/TypeScript

```typescript
import { StealthGateway } from '@thegit/stealth-gateway';

const gateway = new StealthGateway({
  apiKey: 'your_api_key',
  baseUrl: 'https://api.billpayx.com'
});

// Create payment
const payment = await gateway.createPayment({
  amount: 100,
  currency: 'USDC',
  orderId: 'order_123'
});

console.log('Payment URL:', payment.url);

// Check status
const status = await gateway.getPaymentStatus(payment.paymentId);
console.log('Status:', status.status);

// Scan for payments
const scan = await gateway.scanForPayments({
  fromBlock: 12345678
});
console.log('New payments:', scan.newPayments);
```

### cURL

```bash
# Create payment
curl -X POST https://api.billpayx.com/api/v1/payments/create \
  -H "Content-Type: application/json" \
  -H "x-merchant-key: your_api_key" \
  -d '{
    "amount": 100,
    "currency": "USDC",
    "orderId": "order_123"
  }'

# Check balance
curl https://api.billpayx.com/api/v1/merchant/balance \
  -H "x-merchant-key: your_api_key"

# Scan for payments
curl -X POST https://api.billpayx.com/api/v1/merchant/scan \
  -H "Content-Type: application/json" \
  -H "x-merchant-key: your_api_key" \
  -d '{
    "fromBlock": 12345678,
    "limit": 50
  }'
```

### Python

```python
import requests

api_key = 'your_api_key'
base_url = 'https://api.billpayx.com'
headers = {
    'Content-Type': 'application/json',
    'x-merchant-key': api_key
}

# Create payment
response = requests.post(
    f'{base_url}/api/v1/payments/create',
    headers=headers,
    json={
        'amount': 100,
        'currency': 'USDC',
        'orderId': 'order_123'
    }
)
payment = response.json()
print(f"Payment URL: {payment['data']['paymentUrl']}")

# Check balance
response = requests.get(
    f'{base_url}/api/v1/merchant/balance',
    headers=headers
)
balance = response.json()
print(f"Total Balance: {balance['data']['totalBalance']}")
```

---

## Webhooks

Webhooks can be configured to receive real-time payment notifications.

### Webhook Events

| Event | Description |
|-------|-------------|
| `payment.detected` | Payment detected on blockchain |
| `payment.confirmed` | Payment confirmed with N blocks |
| `payment.expired` | Payment expired |
| `withdrawal.completed` | Withdrawal completed |

### Webhook Payload

```json
{
  "event": "payment.detected",
  "timestamp": "2026-01-30T20:20:00.000Z",
  "data": {
    "paymentId": "pay_123",
    "amount": "1000000000",
    "currency": "USDC",
    "stealthAddress": "stealth_A1B2C3D4..."
  }
}
```

---

## Changelog

### v1.0.0 (2026-01-30)
- Initial API release
- Payment creation and tracking
- Stealth address scanning
- Withdrawal functionality
- ZK proof verification

---

**Support:** support@billpayx.com  
**Docs:** https://docs.billpayx.com  
**GitHub:** https://github.com/thegitnetwork/stealth-gateway
