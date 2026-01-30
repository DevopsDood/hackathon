/**
 * Stealth Address Module
 * 
 * Exports all stealth address functionality
 */

export { StealthKeyManager, ScanResult } from './keys';
export { 
  PaymentScanner, 
  createScanner, 
  exportStealthPrivateKey,
  type DetectedPayment,
  type ScanOptions,
  type ScanResult as PaymentScanResult,
} from './scan';
