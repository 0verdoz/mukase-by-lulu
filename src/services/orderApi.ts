import { Order, OrderStatus } from '../types';

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Check if the backend sync server is reachable
 */
export async function checkServerHealth(): Promise<boolean> {
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
export async function fetchRemoteOrders(): Promise<Order[] | null> {
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
 * Push payment proof verification to the shared server
 */
export async function submitRemotePaymentProof(
  orderId: string,
  proof: { transactionId: string; senderHandle: string; memoEntered: string }
): Promise<Order | null> {
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
 * Subscribe to real-time Server-Sent Events (SSE) from the sync engine
 */
export function subscribeToSyncStream(callbacks: {
  onOrderCreated?: (order: Order) => void;
  onOrderUpdated?: (order: Order) => void;
  onStatusChange?: (connected: boolean) => void;
}): () => void {
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
          } else if (payload.type === 'order_updated' && payload.order) {
            callbacks.onOrderUpdated?.(payload.order);
          }
        } catch {
          // ignore malformed frame
        }
      };

      eventSource.onerror = () => {
        callbacks.onStatusChange?.(false);
        eventSource?.close();
        eventSource = null;
        // Exponential/gentle reconnection
        retryTimer = setTimeout(connect, 4000);
      };
    } catch {
      callbacks.onStatusChange?.(false);
      retryTimer = setTimeout(connect, 5000);
    }
  }

  connect();

  return () => {
    if (retryTimer) clearTimeout(retryTimer);
    if (eventSource) eventSource.close();
  };
}
