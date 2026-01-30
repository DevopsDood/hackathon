/**
 * ShadowPay SDK - Privacy-First Payment System
 * 
 * Main entry point for the ShadowPay SDK providing:
 * - Stealth addresses for unlinkable payments
 * - ZK proofs for private balance verification
 * - Anonymous transaction capabilities
 */

export { ShadowPayStealth, createStealthTransaction, type StealthAddress, type FullStealthAddress, type ScanResult, type PaymentNote, type StealthTransaction } from './stealth/stealth-address';
export { ShadowPayZK, type BalanceProof, type PaymentProof, type RangeProofData, type MerkleProof } from './zk/balance-proof';
export { ShadowPay, type PaymentIntent, type PaymentResult, type WithdrawalResult, type BalanceResult } from './shadowpay';
export { StealthGameIntegration, type GameItem, type GamePurchaseResult, type CurrencyTransferResult, type TableJoinResult, type GameWithdrawalResult } from './games/stealthgame';
