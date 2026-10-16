import { Order, PaymentProof } from '../types';
import { LULU_CASHAPP_TAG } from './checkout';

// In-memory + localStorage registry of verified transaction IDs to detect reuse / replay scams
const STORAGE_KEY_USED_TX = 'mukase_registered_transactions';

export function getRegisteredTransactions(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USED_TX);
    if (raw) {
      const arr = JSON.parse(raw);
      return new Set(arr);
    }
  } catch (e) {
    console.error('Error reading registered transactions', e);
  }
  // Default seeded past transactions so test duplicate checks work out of the box
  return new Set(['CASH-9981-OLD', 'ZEL-554109', 'APL-774120']);
}

export function registerTransactionId(txId: string): void {
  const current = getRegisteredTransactions();
  current.add(txId.trim().toUpperCase());
  try {
    localStorage.setItem(STORAGE_KEY_USED_TX, JSON.stringify(Array.from(current)));
  } catch (e) {
    console.error('Error saving transaction registry', e);
  }
}

export interface VerificationCheckResult {
  isLegitimate: boolean;
  score: number; // 0 to 100
  memoMatched: boolean;
  duplicateDetected: boolean;
  amountMatched: boolean;
  timeWindowValid: boolean;
  recipientMatched: boolean;
  flags: string[];
  recommendation: 'APPROVE_AUTOMATICALLY' | 'MANUAL_REVIEW_REQUIRED' | 'REJECT_SUSPECTED_FRAUD';
}

/**
 * Intelligent Anti-Fraud Rule Engine without 3rd-party paid gateways
 */
export function analyzePaymentProof(
  order: Order,
  proof: {
    transactionId: string;
    memoEntered: string;
    amountPaid: number;
    senderHandle: string;
    rawTextOrReceipt?: string;
  }
): VerificationCheckResult {
  const flags: string[] = [];
  let score = 100;
  const cleanTxId = proof.transactionId.trim().toUpperCase();
  const registeredTxs = getRegisteredTransactions();

  // 1. Replay / Duplicate Transaction ID check
  let duplicateDetected = false;
  if (registeredTxs.has(cleanTxId)) {
    duplicateDetected = true;
    score -= 60;
    flags.push(`CRITICAL: Transaction Reference ID "${cleanTxId}" has already been used in a previous order. High risk of duplicate receipt scam.`);
  }

  // 2. Memo Check (Must match order ID, e.g. MUK-8492)
  const normalizedMemo = proof.memoEntered.trim().toUpperCase();
  const expectedMemo = order.id.trim().toUpperCase();
  const memoMatched = normalizedMemo.includes(expectedMemo);

  if (!memoMatched) {
    score -= 25;
    flags.push(`Memo Mismatch: Expected order code "${expectedMemo}", but entered memo was "${proof.memoEntered || 'None'}". Staff must verify fund ownership.`);
  }

  // 3. Amount Matching Check
  const amountDifference = Math.abs(proof.amountPaid - order.total);
  const amountMatched = amountDifference < 0.05;

  if (!amountMatched) {
    score -= 40;
    flags.push(`Amount Discrepancy: Order total is $${order.total.toFixed(2)}, but submitted payment proof claims $${proof.amountPaid.toFixed(2)}. Difference of $${amountDifference.toFixed(2)}.`);
  }

  // 4. Time window check (proof submitted within reasonable window)
  const orderTime = new Date(order.createdAt).getTime();
  const now = Date.now();
  const diffMinutes = (now - orderTime) / (1000 * 60);
  const timeWindowValid = diffMinutes <= 120; // 2 hour window

  if (!timeWindowValid) {
    score -= 15;
    flags.push('Payment timestamp is over 2 hours from order creation. Check bank app for stale screenshot.');
  }

  // 5. Recipient Handle Match (for CashApp)
  let recipientMatched = true;
  if (proof.rawTextOrReceipt) {
    const rawLower = proof.rawTextOrReceipt.toLowerCase();
    if (order.customer.preferredPayment === 'cashapp') {
      if (!rawLower.includes('mukasebylulu') && !rawLower.includes('mukase by lulu')) {
        recipientMatched = false;
        score -= 30;
        flags.push(`Recipient Tag Mismatch: Receipt text does not mention ${LULU_CASHAPP_TAG}. Verify that payment was actually sent to Lulu.`);
      }
    }
  }

  score = Math.max(0, Math.min(100, score));

  let recommendation: VerificationCheckResult['recommendation'] = 'APPROVE_AUTOMATICALLY';
  if (duplicateDetected || score < 50) {
    recommendation = 'REJECT_SUSPECTED_FRAUD';
  } else if (score < 85 || !memoMatched || !amountMatched) {
    recommendation = 'MANUAL_REVIEW_REQUIRED';
  }

  return {
    isLegitimate: score >= 75 && !duplicateDetected && amountMatched,
    score,
    memoMatched,
    duplicateDetected,
    amountMatched,
    timeWindowValid,
    recipientMatched,
    flags,
    recommendation,
  };
}
