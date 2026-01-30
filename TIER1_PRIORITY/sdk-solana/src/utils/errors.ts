/**
 * SDK-Solana Error Definitions
 * 
 * Comprehensive error handling for the privacy-focused Solana SDK.
 */

// ============================================================================
// SDK Error Code Enum
// ============================================================================

export enum SDKErrorCode {
  INVALID_CONFIG = 'INVALID_CONFIG',
  INVALID_PUBLIC_KEY = 'INVALID_PUBLIC_KEY',
  INVALID_PRIVATE_KEY = 'INVALID_PRIVATE_KEY',
  INVALID_COMMITMENT = 'INVALID_COMMITMENT',
  INVALID_PROOF = 'INVALID_PROOF',
  INVALID_STEALTH_ADDRESS = 'INVALID_STEALTH_ADDRESS',
  MERKLE_PROOF_FAILED = 'MERKLE_PROOF_FAILED',
  RANGE_PROOF_FAILED = 'RANGE_PROOF_FAILED',
  CRYPTO_ERROR = 'CRYPTO_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',
}

// ============================================================================
// Helper to convert Uint8Array to hex string
// ============================================================================

function toHexString(bytes: Uint8Array, truncate: boolean = false): string {
  const hex = Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return truncate && hex.length > 16 ? hex.slice(0, 16) + '...' : hex;
}

// ============================================================================
// SDK Error Class
// ============================================================================

export class SDKError extends Error {
  code: SDKErrorCode;
  details?: Record<string, unknown>;
  timestamp: Date;

  constructor(
    code: SDKErrorCode,
    message: string,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'SDKError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date();
  }

  /**
   * Convert error to JSON for logging/API responses
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack,
    };
  }

  /**
   * Create an error from a caught exception
   */
  static from(error: unknown, code: SDKErrorCode = SDKErrorCode.CRYPTO_ERROR): SDKError {
    if (error instanceof SDKError) {
      return error;
    }
    
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new SDKError(code, message, {
      originalError: error instanceof Error ? error.toString() : String(error),
    });
  }
}

// ============================================================================
// Error Factory Functions
// ============================================================================

export function invalidConfig(message: string, details?: Record<string, unknown>): SDKError {
  return new SDKError(SDKErrorCode.INVALID_CONFIG, message, details);
}

export function invalidPublicKey(key: string | Uint8Array, details?: Record<string, unknown>): SDKError {
  const keyStr = key instanceof Uint8Array ? toHexString(key, true) : key;
  return new SDKError(SDKErrorCode.INVALID_PUBLIC_KEY, `Invalid public key: ${keyStr}`, details);
}

export function invalidPrivateKey(details?: Record<string, unknown>): SDKError {
  return new SDKError(SDKErrorCode.INVALID_PRIVATE_KEY, 'Invalid private key', details);
}

export function invalidCommitment(details?: Record<string, unknown>): SDKError {
  return new SDKError(SDKErrorCode.INVALID_COMMITMENT, 'Invalid commitment', details);
}

export function invalidProof(message: string, details?: Record<string, unknown>): SDKError {
  return new SDKError(SDKErrorCode.INVALID_PROOF, `Invalid proof: ${message}`, details);
}

export function invalidStealthAddress(address: string, details?: Record<string, unknown>): SDKError {
  return new SDKError(
    SDKErrorCode.INVALID_STEALTH_ADDRESS,
    `Invalid stealth address: ${address}`,
    details
  );
}

export function merkleProofFailed(leaf: Uint8Array, root: Uint8Array, details?: Record<string, unknown>): SDKError {
  return new SDKError(
    SDKErrorCode.MERKLE_PROOF_FAILED,
    'Merkle proof verification failed',
    {
      leaf: toHexString(leaf, true),
      root: toHexString(root, true),
      ...details,
    }
  );
}

export function rangeProofFailed(value: bigint, min: bigint, max: bigint): SDKError {
  return new SDKError(
    SDKErrorCode.RANGE_PROOF_FAILED,
    `Range proof verification failed for value ${value} in range [${min}, ${max}]`
  );
}

export function cryptoError(message: string, details?: Record<string, unknown>): SDKError {
  return new SDKError(SDKErrorCode.CRYPTO_ERROR, message, details);
}

export function networkError(endpoint: string, status: number, details?: Record<string, unknown>): SDKError {
  return new SDKError(
    SDKErrorCode.NETWORK_ERROR,
    `Network request failed to ${endpoint}: HTTP ${status}`,
    details
  );
}

export function timeout(operation: string, ms: number): SDKError {
  return new SDKError(
    SDKErrorCode.TIMEOUT,
    `Operation '${operation}' timed out after ${ms}ms`
  );
}

export function notImplemented(feature: string): SDKError {
  return new SDKError(
    SDKErrorCode.NOT_IMPLEMENTED,
    `Feature not implemented: ${feature}`
  );
}

// ============================================================================
// Error Validation Helpers
// ============================================================================

/**
 * Assert a condition or throw an SDKError
 */
export function assert(
  condition: boolean,
  code: SDKErrorCode,
  message: string,
  details?: Record<string, unknown>
): asserts condition {
  if (!condition) {
    throw new SDKError(code, message, details);
  }
}

/**
 * Assert a value is defined or throw an SDKError
 */
export function assertDefined<T>(
  value: T | undefined | null,
  code: SDKErrorCode,
  message: string,
  details?: Record<string, unknown>
): asserts value is T {
  if (value === undefined || value === null) {
    throw new SDKError(code, message, details);
  }
}

/**
 * Assert a buffer has the expected length
 */
export function assertBufferLength(
  buffer: Uint8Array,
  expected: number,
  name: string
): void {
  assert(
    buffer.length === expected,
    SDKErrorCode.INVALID_CONFIG,
    `${name} must be ${expected} bytes, got ${buffer.length}`
  );
}

/**
 * Assert a bigint is within a range
 */
export function assertBigintRange(
  value: bigint,
  min: bigint,
  max: bigint,
  name: string
): void {
  assert(
    value >= min && value <= max,
    SDKErrorCode.INVALID_CONFIG,
    `${name} must be between ${min} and ${max}, got ${value}`
  );
}

// ============================================================================
// Result Type for Error Handling
// ============================================================================

/**
 * Result type for operations that can fail
 */
export type Result<T, E = SDKError> =
  | { ok: true; value: T }
  | { ok: false; error: E };

/**
 * Create a successful result
 */
export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

/**
 * Create a failed result
 */
export function fail<T, E>(error: E): Result<T, E> {
  return { ok: false, error };
}

/**
 * Map over a result's value
 */
export function map<T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> {
  if (result.ok) {
    return { ok: true, value: fn(result.value) };
  }
  return { ok: false, error: result.error };
}

/**
 * Flat-map over a result
 */
export function flatMap<T, U, E>(result: Result<T, E>, fn: (value: T) => Result<U, E>): Result<U, E> {
  if (result.ok) {
    return fn(result.value);
  }
  return { ok: false, error: result.error };
}

/**
 * Get value or throw error
 */
export function unwrap<T, E = SDKError>(result: Result<T, E>): T {
  if (result.ok) {
    return result.value;
  }
  throw result.error;
}

/**
 * Get value or default
 */
export function unwrapOr<T>(result: Result<T>, defaultValue: T): T {
  if (result.ok) {
    return result.value;
  }
  return defaultValue;
}

/**
 * Check if result is ok
 */
export function isOk<T, E>(result: Result<T, E>): result is { ok: true; value: T } {
  return result.ok;
}

/**
 * Check if result is failed
 */
export function isFail<T, E>(result: Result<T, E>): result is { ok: false; error: E } {
  return !result.ok;
}

