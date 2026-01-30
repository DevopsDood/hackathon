/**
 * ShadowPay Utilities
 * Common helper functions and utilities
 */

/**
 * Convert Uint8Array to hex string
 */
export function arrayToHex(arr: Uint8Array): string {
  return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Convert hex string to Uint8Array
 */
export function hexToArray(hex: string): Uint8Array {
  const clean = hex.replace(/^0x/, '');
  const bytes = new Uint8Array(Math.ceil(clean.length / 2));
  for (let i = 0; i < clean.length; i += 2) {
    bytes[Math.floor(i / 2)] = parseInt(clean.slice(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Convert bigint to Uint8Array (little-endian)
 */
export function bigIntToBytes(value: bigint, length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    bytes[i] = Number(value & 0xffn);
    value >>= 8n;
  }
  return bytes;
}

/**
 * Convert Uint8Array to bigint (little-endian)
 */
export function bytesToBigInt(bytes: Uint8Array): bigint {
  let result = 0n;
  for (let i = bytes.length - 1; i >= 0; i--) {
    result = (result << 8n) + BigInt(bytes[i]);
  }
  return result;
}

/**
 * Generate random bytes
 */
export function randomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

/**
 * Generate random bigint within range
 */
export function randomBigInt(min: bigint, max: bigint): bigint {
  const range = max - min;
  const bytes = randomBytes(32);
  let value = bytesToBigInt(bytes) % range;
  if (value < 0) value = -value;
  return min + value;
}

/**
 * Concatenate Uint8Arrays
 */
export function concatArrays(...arrays: Uint8Array[]): Uint8Array {
  const result = new Uint8Array(arrays.reduce((sum, arr) => sum + arr.length, 0));
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

/**
 * Compare two Uint8Arrays
 */
export function arrayEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/**
 * Check if value is zero
 */
export function isZero(arr: Uint8Array): boolean {
  return arr.every(b => b === 0);
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: bigint, decimals: number = 9): string {
  const divisor = 10n ** BigInt(decimals);
  const whole = amount / divisor;
  const fraction = amount % divisor;
  const fractionStr = fraction.toString().padStart(decimals, '0');
  return `${whole}.${fractionStr}`;
}

/**
 * Parse currency from string
 */
export function parseCurrency(str: string, decimals: number = 9): bigint {
  const [whole, fraction = '0'] = str.split('.');
  const wholeNum = BigInt(whole) * (10n ** BigInt(decimals));
  const fractionNum = BigInt(fraction.padEnd(decimals, '0').slice(0, decimals));
  return wholeNum + fractionNum;
}

/**
 * Validate stealth address format
 */
export function isValidStealthAddress(address: string): boolean {
  return /^shadow_[A-Za-z0-9+/=]{40,60}$/.test(address);
}

/**
 * Generate payment memo
 */
export function createPaymentMemo(type: string, data: Record<string, any>): string {
  return `${type}:${JSON.stringify(data)}`;
}

/**
 * Parse payment memo
 */
export function parsePaymentMemo(memo: string): { type: string; data: Record<string, any> } | null {
  try {
    const [type, dataStr] = memo.split(':');
    return {
      type,
      data: JSON.parse(dataStr),
    };
  } catch {
    return null;
  }
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Retry with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create proof ID
 */
export function createProofId(): string {
  const bytes = randomBytes(16);
  return 'sp_' + arrayToHex(bytes);
}

/**
 * Validate amount is positive
 */
export function validatePositiveAmount(amount: bigint): void {
  if (amount <= 0n) {
    throw new Error('Amount must be positive');
  }
}

/**
 * Validate amount doesn't exceed maximum
 */
export function validateMaxAmount(amount: bigint, max: bigint): void {
  if (amount > max) {
    throw new Error(`Amount exceeds maximum of ${max}`);
  }
}

/**
 * Clamp value between min and max
 */
export function clamp(value: bigint, min: bigint, max: bigint): bigint {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

/**
 * Calculate percentage
 */
export function percentage(value: bigint, total: bigint, decimals: number = 2): number {
  if (total === 0n) return 0;
  const percent = (Number(value) / Number(total)) * 100;
  return Math.round(percent * Math.pow(10, decimals)) / Math.pow(10, decimals);
}
