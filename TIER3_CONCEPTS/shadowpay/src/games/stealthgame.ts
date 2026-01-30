/**
 * ShadowPay StealthGame Integration
 * 
 * Private in-game payments and currency transfers using ShadowPay
 */

import { 
  ShadowPay, 
  type PaymentIntent, 
  type PaymentResult,
  type BalanceResult 
} from '../shadowpay';

import { type PaymentNote } from '../stealth/stealth-address';

// Game-specific types
export interface GameItem {
  id: string;
  name: string;
  description: string;
  price: bigint;
  category: 'weapon' | 'armor' | 'consumable' | 'cosmetic' | 'currency';
  metadata?: Record<string, any>;
}

export interface GamePurchaseResult {
  success: boolean;
  paymentId: string;
  item: GameItem & { quantity: number };
  timestamp: number;
}

export interface CurrencyTransferResult {
  transferId: string;
  amount: bigint;
  recipientId: string;
  memo?: string;
  timestamp: number;
}

export interface TableJoinResult {
  success: boolean;
  tableEntry: TableEntry;
  stakeProofId: string;
}

export interface TableEntry {
  tableId: string;
  playerId: string;
  stakeAmount: bigint;
  seatNumber: number;
  joinedAt: number;
}

export interface GameWithdrawalResult {
  withdrawalId: string;
  amount: bigint;
  targetAddress: string;
  timestamp: number;
}

export interface GameConfig {
  gameId: string;
  merchantViewKey: Uint8Array;
  tableConfig: TableConfig;
}

export interface TableConfig {
  minStake: bigint;
  maxStake: bigint;
  maxPlayers: number;
  feePercent: number;
}

/**
 * ShadowPay Integration for StealthGame
 */
export class StealthGameIntegration {
  private shadowpay: ShadowPay;
  private config: GameConfig;
  private playerId: string;
  private playerViewKey!: Uint8Array;
  private playerSpendKey!: Uint8Array;
  private gameState: GameState;

  constructor(config: GameConfig, wallet?: any) {
    this.config = config;
    this.shadowpay = new ShadowPay({ network: 'devnet' }, wallet);
    this.playerId = this.generatePlayerId();
    this.gameState = new GameState();
  }

  /**
   * Initialize player with ShadowPay
   */
  async initializePlayer(): Promise<void> {
    // Generate player keys
    const keys = await this.shadowpay.generateReceiveKeys();
    this.playerViewKey = keys.viewKey;
    this.playerSpendKey = keys.spendKey;

    // Initialize game state
    await this.gameState.initialize(this.playerId, this.playerViewKey);

    console.log(`Player ${this.playerId} initialized with ShadowPay`);
  }

  /**
   * Get player's current game balance
   */
  async getGameBalance(): Promise<BalanceResult> {
    const notes = await this.gameState.getPlayerNotes(this.playerId);
    return this.shadowpay.getBalance(notes);
  }

  /**
   * Purchase in-game item with private payment
   */
  async purchaseItem(
    item: GameItem,
    quantity: number = 1
  ): Promise<GamePurchaseResult> {
    const totalCost = item.price * BigInt(quantity);

    // Check balance
    const balance = await this.getGameBalance();
    if (balance.totalBalance < totalCost) {
      throw new Error(`Insufficient balance. Required: ${totalCost}, Available: ${balance.totalBalance}`);
    }

    // Create stealth payment to game merchant
    const payment = await this.shadowpay.createPayment({
      amount: totalCost,
      recipientViewKey: this.config.merchantViewKey,
      memo: `GAME_ITEM:${item.id}:${quantity}`,
      hideAmount: true,
    });

    // Record purchase in game state
    await this.gameState.recordPurchase({
      playerId: this.playerId,
      itemId: item.id,
      quantity,
      paymentProof: payment.proofId,
      timestamp: Date.now(),
    });

    return {
      success: true,
      paymentId: payment.proofId,
      item: {
        ...item,
        quantity,
      },
      timestamp: Date.now(),
    };
  }

  /**
   * Transfer in-game currency to another player privately
   */
  async transferCurrency(
    recipientPlayerId: string,
    amount: bigint,
    memo?: string
  ): Promise<CurrencyTransferResult> {
    // Get recipient's stealth address from game state
    const recipientInfo = await this.gameState.getPlayerInfo(recipientPlayerId);
    if (!recipientInfo) {
      throw new Error('Recipient player not found');
    }

    // Create stealth payment to recipient
    const payment = await this.shadowpay.createPayment({
      amount,
      recipientViewKey: recipientInfo.viewKey,
      memo: memo ? `GAME_TRANSFER:${memo}` : 'GAME_TRANSFER',
      hideAmount: true,
      hideRecipient: true, // Even sender can't prove who received
    });

    // Record transfer in game state
    await this.gameState.recordTransfer({
      fromPlayerId: this.playerId,
      toPlayerId: recipientPlayerId,
      amount,
      transferId: payment.proofId,
      timestamp: Date.now(),
    });

    return {
      transferId: payment.proofId,
      amount,
      recipientId: recipientPlayerId,
      memo,
      timestamp: Date.now(),
    };
  }

  /**
   * Join a game table with stake
   */
  async joinTable(
    tableId: string,
    stakeAmount: bigint
  ): Promise<TableJoinResult> {
    // Validate stake amount
    if (stakeAmount < this.config.tableConfig.minStake) {
      throw new Error(`Stake too low. Minimum: ${this.config.tableConfig.minStake}`);
    }
    if (stakeAmount > this.config.tableConfig.maxStake) {
      throw new Error(`Stake too high. Maximum: ${this.config.tableConfig.maxStake}`);
    }

    // Check balance
    const balance = await this.getGameBalance();
    if (balance.totalBalance < stakeAmount) {
      throw new Error(`Insufficient balance for stake`);
    }

    // Create stake commitment
    const stakeProof = await this.shadowpay.proveBalance(
      await this.gameState.getPlayerNotes(this.playerId),
      stakeAmount
    );

    // Get seat number
    const seatNumber = await this.gameState.reserveSeat(tableId, this.playerId);

    // Create table entry
    const tableEntry: TableEntry = {
      tableId,
      playerId: this.playerId,
      stakeAmount,
      seatNumber,
      joinedAt: Date.now(),
    };

    // Record in game state
    await this.gameState.joinTable(tableEntry);

    return {
      success: true,
      tableEntry,
      stakeProofId: this.arrayToHex(stakeProof.commitment),
    };
  }

  /**
   * Leave a game table
   */
  async leaveTable(tableId: string): Promise<{ success: boolean; refundAmount: bigint }> {
    const tableEntry = await this.gameState.getTableEntry(tableId, this.playerId);
    if (!tableEntry) {
      throw new Error('Not at this table');
    }

    // Calculate refund (stake minus any fees)
    const feePercent = this.config.tableConfig.feePercent;
    const fee = (tableEntry.stakeAmount * BigInt(feePercent)) / 100n;
    const refundAmount = tableEntry.stakeAmount - fee;

    // Record leaving
    await this.gameState.leaveTable(tableId, this.playerId);

    return {
      success: true,
      refundAmount,
    };
  }

  /**
   * Withdraw winnings from game
   */
  async withdrawWinnings(
    targetViewKey?: Uint8Array
  ): Promise<GameWithdrawalResult> {
    // Get winnings from game state
    const winnings = await this.gameState.getPlayerWinnings(this.playerId);
    if (winnings <= 0n) {
      throw new Error('No winnings to withdraw');
    }

    // Use provided view key or player's own
    const viewKey = targetViewKey || this.playerViewKey;

    // Create withdrawal
    const withdrawal = await this.shadowpay.withdraw(
      await this.gameState.getPlayerNotes(this.playerId),
      viewKey,
      winnings
    );

    // Clear winnings in game state
    await this.gameState.clearWinnings(this.playerId);

    return {
      withdrawalId: withdrawal.withdrawalId,
      amount: withdrawal.amount,
      targetAddress: withdrawal.targetAddress,
      timestamp: Date.now(),
    };
  }

  /**
   * Deposit funds to game
   */
  async depositToGame(amount: bigint): Promise<{ success: boolean; depositId: string }> {
    // Create game note for the deposit
    const note = await this.gameState.createNote(this.playerId, amount);

    return {
      success: true,
      depositId: this.arrayToHex(note.commitment),
    };
  }

  /**
   * Generate player ID
   */
  private generatePlayerId(): string {
    const bytes = new Uint8Array(8);
    crypto.getRandomValues(bytes);
    return 'player_' + Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Convert Uint8Array to hex string
   */
  private arrayToHex(arr: Uint8Array): string {
    return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
  }
}

/**
 * Mock Game State (in production, this would be a database)
 */
class GameState {
  private players: Map<string, PlayerInfo> = new Map();
  private tables: Map<string, TableState> = new Map();
  private purchases: PurchaseRecord[] = [];
  private transfers: TransferRecord[] = [];
  private notes: Map<string, PaymentNote[]> = new Map();

  async initialize(playerId: string, viewKey: Uint8Array): Promise<void> {
    this.players.set(playerId, {
      playerId,
      viewKey,
      winnings: 0n,
      joinedTables: [],
    });
    this.notes.set(playerId, []);
  }

  async getPlayerInfo(playerId: string): Promise<PlayerInfo | null> {
    return this.players.get(playerId) || null;
  }

  async getPlayerNotes(playerId: string): Promise<PaymentNote[]> {
    return this.notes.get(playerId) || [];
  }

  async createNote(playerId: string, amount: bigint): Promise<PaymentNote> {
    const randomness = crypto.getRandomValues(new Uint8Array(32));
    const note: PaymentNote = {
      commitment: crypto.getRandomValues(new Uint8Array(32)),
      amount,
      randomness,
      nullifierKey: crypto.getRandomValues(new Uint8Array(32)),
      viewKey: new Uint8Array(),
      spendKey: new Uint8Array(),
    };

    const existing = this.notes.get(playerId) || [];
    existing.push(note);
    this.notes.set(playerId, existing);

    return note;
  }

  async recordPurchase(record: PurchaseRecord): Promise<void> {
    this.purchases.push(record);
  }

  async recordTransfer(record: TransferRecord): Promise<void> {
    this.transfers.push(record);
  }

  async reserveSeat(tableId: string, playerId: string): Promise<number> {
    let table = this.tables.get(tableId);
    if (!table) {
      table = { tableId, players: new Map(), seatCounter: 0 };
      this.tables.set(tableId, table);
    }
    table.seatCounter++;
    table.players.set(playerId, { seatNumber: table.seatCounter, stake: 0n });
    return table.seatCounter;
  }

  async joinTable(entry: TableEntry): Promise<void> {
    const table = this.tables.get(entry.tableId);
    if (table) {
      table.players.set(entry.playerId, { 
        seatNumber: entry.seatNumber, 
        stake: entry.stakeAmount 
      });
    }
  }

  async getTableEntry(tableId: string, playerId: string): Promise<TableEntry | null> {
    const table = this.tables.get(tableId);
    if (!table) return null;
    const player = table.players.get(playerId);
    if (!player) return null;
    return {
      tableId,
      playerId,
      stakeAmount: player.stake,
      seatNumber: player.seatNumber,
      joinedAt: Date.now(),
    };
  }

  async leaveTable(tableId: string, playerId: string): Promise<void> {
    const table = this.tables.get(tableId);
    if (table) {
      table.players.delete(playerId);
    }
  }

  async getPlayerWinnings(playerId: string): Promise<bigint> {
    const player = this.players.get(playerId);
    return player?.winnings || 0n;
  }

  async clearWinnings(playerId: string): Promise<void> {
    const player = this.players.get(playerId);
    if (player) {
      player.winnings = 0n;
    }
  }
}

// Supporting types
interface PlayerInfo {
  playerId: string;
  viewKey: Uint8Array;
  winnings: bigint;
  joinedTables: string[];
}

interface TableState {
  tableId: string;
  players: Map<string, { seatNumber: number; stake: bigint }>;
  seatCounter: number;
}

interface PurchaseRecord {
  playerId: string;
  itemId: string;
  quantity: number;
  paymentProof: string;
  timestamp: number;
}

interface TransferRecord {
  fromPlayerId: string;
  toPlayerId: string;
  amount: bigint;
  transferId: string;
  timestamp: number;
}
