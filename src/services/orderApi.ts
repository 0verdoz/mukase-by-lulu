import { Order, OrderStatus } from '../types';

export interface AppSettings {
  checkoutMode: 'hybrid' | 'whatsapp_only';
}

const isBrowser = typeof window !== 'undefined';
const isLocalhost = isBrowser && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const rawApi = ((import.meta as any).env?.VITE_API_URL as string | undefined)?.trim()?.replace(/\/+$/, '');
const configuredApi = rawApi ? (rawApi.endsWith('/api') ? rawApi : `${rawApi}/api`) : '';
const PRODUCTION_API_URL = 'https://mukase-api.onrender.com/api';
const API_BASE = configuredApi || (isLocalhost ? 'http://localhost:5000/api' : PRODUCTION_API_URL);

/**
 * Check if the backend sync server is reachable
 */
export async function checkServerHealth(): Promise<boolean> {
  if (!API_BASE) return false;
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Fetch all orders from the shared sync server
 */

/**
 * Clear all daily orders and reset ledger on the shared sync server
 */
export async function clearRemoteOrders(): Promise<boolean> {
  if (!API_BASE) return false;
  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'DELETE',
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchRemoteOrders(): Promise<Order[] | null> {
  if (!API_BASE) return null;
  try {
    const res = await fetch(`${API_BASE}/orders`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return null;
    const data = await res.json();
    return data.orders || [];
  } catch {
    return null;
  }
}

/**
 * Push newly placed customer order to the shared sync server
 */
export async function pushRemoteOrder(order: Order): Promise<boolean> {
  if (!API_BASE) return false;
  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Update order status on the shared server (e.g. from kitchen staff)
 */
export async function updateRemoteOrderStatus(
  orderId: string,
  status: OrderStatus,
  riderNotes?: string,
  riderName?: string,
  riderPhone?: string
): Promise<Order | null> {
  if (!API_BASE) return null;
  try {
    const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(orderId)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, riderNotes, riderName, riderPhone }),
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.order || null;
  } catch {
    return null;
  }
}

/**
 * Submit payment notification/proof to shared server (never auto-approves)
 */
export async function submitRemotePaymentProof(
  orderId: string,
  proof: {
    transactionId?: string;
    memoEntered?: string;
    amountPaid?: number;
    senderHandle?: string;
    rawText?: string;
  }
): Promise<Order | null> {
  if (!API_BASE) return null;
  try {
    const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(orderId)}/proof`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proof),
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.order || null;
  } catch {
    return null;
  }
}

/**
 * Fetch shared app settings (e.g. checkoutMode)
 */
export async function fetchRemoteSettings(): Promise<AppSettings | null> {
  if (!API_BASE) return null;
  try {
    const res = await fetch(`${API_BASE}/settings`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Update app settings from Admin Terminal
 */
export async function updateRemoteSettings(settings: Partial<AppSettings>): Promise<AppSettings | null> {
  if (!API_BASE) return null;
  try {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.settings || null;
  } catch {
    return null;
  }
}

/**
 * Subscribe to real-time Server-Sent Events (SSE) from the sync engine
 */
export function subscribeToSyncStream(callbacks: {
  onOrderCreated?: (order: Order) => void;
  onOrderUpdated?: (order: Order) => void;
  onOrdersCleared?: () => void;
  onSettingsUpdated?: (settings: AppSettings) => void;
  onStatusChange?: (connected: boolean) => void;
}): () => void {
  if (!API_BASE) {
    callbacks.onStatusChange?.(false);
    return () => {};
  }

  const eventsUrl = `${API_BASE}/events`;
  let eventSource: EventSource | null = null;
  let retryTimer: any = null;

  function connect() {
    try {
      eventSource = new EventSource(eventsUrl);

      eventSource.onopen = () => {
        callbacks.onStatusChange?.(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'order_created' && payload.order) {
            callbacks.onOrderCreated?.(payload.order);
          } else if (payload.type === 'orders_cleared') {
            callbacks.onOrdersCleared?.();
          } else if (payload.type === 'order_updated' && payload.order) {
            callbacks.onOrderUpdated?.(payload.order);
          } else if (payload.type === 'settings_updated' && payload.settings) {
            callbacks.onSettingsUpdated?.(payload.settings);
          }
        } catch {
          // ignore malformed frame
        }
      };

      eventSource.onerror = () => {
        callbacks.onStatusChange?.(false);
        eventSource?.close();
        eventSource = null;
        retryTimer = setTimeout(connect, 6000);
      };
    } catch {
      callbacks.onStatusChange?.(false);
      retryTimer = setTimeout(connect, 8000);
    }
  }

  connect();

  return () => {
    if (retryTimer) clearTimeout(retryTimer);
    if (eventSource) eventSource.close();
  };
}
