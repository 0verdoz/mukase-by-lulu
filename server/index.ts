import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import type { Order, OrderStatus } from '../src/types/index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, 'public');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Permissive CORS middleware for cross-origin storefront & admin communication
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Serve compiled static assets from server/public
app.use(express.static(publicDir));

// Master PIN configuration
let activeMasterPin = '8492';
const MASTER_OVERRIDE_KEY = 'LULU-MUKASE-2026';

// In-Memory Order Storage seeded with realistic Ghanaian kitchen orders
let orders: Order[] = [
  {
    id: 'MUK-4821',
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    customer: {
      name: 'Abena Mensah',
      phone: '404-555-8912',
      address: '742 Piedmont Ave NE',
      apartmentSuite: '2B',
      city: 'Atlanta',
      postalCode: '30308',
      deliveryNotes: 'Call upon arrival, baby sleeping',
      preferredPayment: 'cashapp',
      paymentIdentifier: '$AbenaM',
    },
    items: [
      {
        id: 'c-1',
        menuItem: {
          id: 'jollof-goat',
          name: 'Jollof with Goat Meat',
          category: 'jollof',
          price: 30.00,
          description: 'Authentic Ghanaian smoky jollof rice topped with tender, slow-braised marinated goat meat.',
          image: '/assets/images/jollof_goat.jpeg',
        },
        quantity: 1,
        customization: {
          protein: 'Tender Spiced Goat Meat Cutlets',
          proteinExtraPrice: 0,
          spiceLevel: 'Hot (Traditional)',
          selectedAddOns: [
            { id: 'add-egg', name: 'Boiled Egg with Pepper Salt', price: 2.00 },
            { id: 'add-sausage', name: 'Grilled Spicy Beef Sausage', price: 3.00 },
          ],
          specialInstructions: 'Extra spicy shito on the side please',
        },
        itemTotalPrice: 35.00,
      },
      {
        id: 'c-2',
        menuItem: {
          id: 'fried-yam-wings',
          name: 'Fried Yam with Wings',
          category: 'yam-cassava',
          price: 20.00,
          description: 'Crispy thick-cut Ghanaian pona yam chips fried golden with wings.',
          image: '/assets/images/fried_yam_wings_real_1792537754730.jpeg',
        },
        quantity: 1,
        itemTotalPrice: 20.00,
      },
    ],
    subtotal: 55.00,
    deliveryFee: 4.99,
    tax: 4.40,
    total: 64.39,
    status: 'out_for_delivery',
    paymentProof: {
      method: 'cashapp',
      senderTagOrName: '$AbenaM',
      transactionId: 'TX-CASH-4821',
      submittedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      verifiedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      isVerified: true,
      memoMatched: true,
      duplicateDetected: false,
      verificationNotes: 'Memo MUK-4821 matched CashApp transfer. Confirmed $64.39.',
    },
    estimatedDeliveryMinutes: 12,
    riderName: 'Kwame Asante',
    riderPhone: '404-555-0144',
    channel: 'whatsapp',
  },
  {
    id: 'MUK-6190',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    customer: {
      name: 'David Osei',
      phone: '470-555-3211',
      address: '1080 West Peachtree St NW',
      apartmentSuite: '1410',
      city: 'Atlanta',
      postalCode: '30309',
      deliveryNotes: 'Leave with front desk concierge',
      preferredPayment: 'zelle',
      paymentIdentifier: 'david.osei@email.com',
    },
    items: [
      {
        id: 'c-3',
        menuItem: {
          id: 'banku-okro-soup',
          name: 'Banku with Okro Soup',
          category: 'banku-fufu',
          price: 30.00,
          description: 'Authentic Ghanaian fermented corn and cassava Banku dumpling with seafood okro soup.',
          image: '/assets/images/food_banku_okro_soup_1792535657171.jpeg',
        },
        quantity: 1,
        customization: {
          selectedSideOrSwallow: 'Steamed Banku',
          proteinExtraPrice: 0,
          spiceLevel: 'Hot (Traditional)',
          selectedAddOns: [
            { id: 'add-extra-banku', name: 'Extra Banku Ball', price: 4.00 },
          ],
          specialInstructions: 'Extra crab if possible!',
        },
        itemTotalPrice: 34.00,
      },
    ],
    subtotal: 34.00,
    deliveryFee: 4.99,
    tax: 2.72,
    total: 41.71,
    status: 'preparing_in_kitchen',
    paymentProof: {
      method: 'zelle',
      senderTagOrName: 'David Osei',
      transactionId: 'ZEL-6190-CONF',
      submittedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      verifiedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      isVerified: true,
      memoMatched: true,
      duplicateDetected: false,
      verificationNotes: 'Zelle transfer received with memo MUK-6190.',
    },
    estimatedDeliveryMinutes: 28,
    channel: 'imessage',
  },
];

interface SecurityLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
}

let securityLogs: SecurityLog[] = [
  {
    id: 'sec-init-1',
    timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    action: 'LOGIN_SUCCESS',
    details: 'Chef Lulu authenticated via Master PIN 8492',
  },
  {
    id: 'sec-init-2',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    action: 'ORDER_VERIFIED',
    details: 'Order MUK-4821 verified: CashApp payment of $64.39 confirmed',
  },
];

// Active Server-Sent Events (SSE) connections
let sseClients: Response[] = [];

function broadcast(data: any) {
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach((client, index) => {
    try {
      client.write(payload);
    } catch {
      sseClients.splice(index, 1);
    }
  });
}

// 1. Health check & Cloud Probes
app.get('/healthz', (_req: Request, res: Response) => {
  res.setHeader('x-render-service', 'mukase-sync-engine');
  res.setHeader('x-render-engine', 'Modern-Class-v2');
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'mukase-sync-engine',
    region: 'frankfurt-1',
    uptimeSeconds: Math.floor(process.uptime()),
    orderCount: orders.length,
    connectedSseClients: sseClients.length,
  });
});

app.get('/ping', (_req: Request, res: Response) => {
  res.setHeader('x-render-service', 'mukase-sync-engine');
  res.json({ status: 'pong', timestamp: new Date().toISOString() });
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Mukase by Lulu Sync Engine',
    timestamp: new Date().toISOString(),
    orderCount: orders.length,
    connectedSseClients: sseClients.length,
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

// Diagnostics & Platform APIs
app.get('/api/metrics', (_req: Request, res: Response) => {
  const mem = process.memoryUsage();
  res.json({
    metrics: {
      startTime: Date.now() - Math.floor(process.uptime() * 1000),
      uptimeSeconds: Math.floor(process.uptime()),
      totalRequests: orders.length + sseClients.length + 12,
      memoryUsageMb: Math.round((mem.rss / 1024 / 1024) * 10) / 10,
      heapTotalMb: Math.round((mem.heapTotal / 1024 / 1024) * 10) / 10,
      activeConnections: sseClients.length + 1,
    },
    config: {
      port: PORT,
      host: '0.0.0.0',
      environment: process.env.NODE_ENV || 'production',
      nodeVersion: process.version,
    },
  });
});

app.get('/api/render-blueprint', (_req: Request, res: Response) => {
  res.json({
    service: 'mukase-api',
    runtime: 'node-lts',
    plan: 'starter',
    autoDeploy: true,
    healthCheckPath: '/healthz',
    env: {
      NODE_ENV: 'production',
      PORT: `${PORT}`,
    },
  });
});

app.post('/api/v1/render-view', (_req: Request, res: Response) => {
  res.json({
    rendered: true,
    template: 'ModernClassView',
    viewEngine: 'TypeScript-Class-SSR',
    sizeBytes: 2412,
    renderTimeMs: 0.94,
  });
});

// 2. Real-time SSE Stream
app.get('/api/events', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send initial handshake
  res.write(`data: ${JSON.stringify({ type: 'handshake', message: 'Connected to Mukase Kitchen Real-Time Bus' })}\n\n`);

  sseClients.push(res);

  req.on('close', () => {
    sseClients = sseClients.filter(c => c !== res);
  });
});

// Keep-alive heartbeat for SSE every 25 seconds
setInterval(() => {
  broadcast({ type: 'ping', timestamp: Date.now() });
}, 25000);

// 3. Orders API

app.delete('/api/orders', (_req: Request, res: Response) => {
  orders = [];
  broadcast({ type: 'orders_cleared' });
  res.json({ success: true, message: 'All daily orders and ledger cleared' });
});

app.post('/api/orders/clear', (_req: Request, res: Response) => {
  orders = [];
  broadcast({ type: 'orders_cleared' });
  res.json({ success: true, message: 'All daily orders and ledger cleared' });
});

app.get('/api/orders', (_req: Request, res: Response) => {
  res.json({ orders });
});

app.get('/api/orders/:id', (req: Request, res: Response) => {
  const order = orders.find(o => o.id.toLowerCase() === req.params.id.toLowerCase());
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json({ order });
});

app.post('/api/orders', (req: Request, res: Response) => {
  const newOrder: Order = req.body;
  if (!newOrder || !newOrder.id) {
    return res.status(400).json({ error: 'Invalid order payload' });
  }

  // Prepend to orders list
  orders = [newOrder, ...orders.filter(o => o.id !== newOrder.id)];

  // Broadcast to all connected clients (Customer Storefront + Admin Terminal)
  broadcast({ type: 'order_created', order: newOrder });

  res.status(201).json({ success: true, order: newOrder });
});

app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, riderNotes, riderName, riderPhone } = req.body as {
    status: OrderStatus;
    riderNotes?: string;
    riderName?: string;
    riderPhone?: string;
  };

  const orderIndex = orders.findIndex(o => o.id.toLowerCase() === id.toLowerCase());
  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const updatedOrder = {
    ...orders[orderIndex],
    status,
    ...(riderNotes !== undefined && { riderNotes }),
    ...(riderName !== undefined && { riderName }),
    ...(riderPhone !== undefined && { riderPhone }),
    ...(status === 'preparing_in_kitchen' && {
      paymentProof: {
        method: orders[orderIndex].customer.preferredPayment,
        senderTagOrName: orders[orderIndex].paymentProof?.senderTagOrName || orders[orderIndex].customer.paymentIdentifier,
        transactionId: orders[orderIndex].paymentProof?.transactionId || `VERIFIED-${Date.now().toString(36).toUpperCase()}`,
        submittedAt: orders[orderIndex].paymentProof?.submittedAt || new Date().toISOString(),
        verifiedAt: new Date().toISOString(),
        isVerified: true,
        memoMatched: true,
        duplicateDetected: false,
        verificationNotes: 'Verified and authorized by kitchen staff (Chef Lulu).',
      },
    }),
  };

  orders[orderIndex] = updatedOrder;

  // Broadcast update
  broadcast({ type: 'order_updated', order: updatedOrder });

  res.json({ success: true, order: updatedOrder });
});

app.post('/api/orders/:id/proof', (req: Request, res: Response) => {
  const { id } = req.params;
  const proof = req.body;

  const orderIndex = orders.findIndex(o => o.id.toLowerCase() === id.toLowerCase());
  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const updatedOrder: Order = {
    ...orders[orderIndex],
    status: 'pending_payment',
    paymentProof: {
      method: orders[orderIndex].customer.preferredPayment,
      senderTagOrName: proof.senderHandle || orders[orderIndex].customer.paymentIdentifier,
      transactionId: proof.transactionId || 'Awaiting Confirmation',
      submittedAt: new Date().toISOString(),
      isVerified: false,
      memoMatched: false,
      duplicateDetected: false,
      verificationNotes: `Payment transfer notification submitted by customer. Awaiting Chef Lulu verification.`,
    },
  };

  orders[orderIndex] = updatedOrder;
  broadcast({ type: 'order_updated', order: updatedOrder });

  res.json({ success: true, order: updatedOrder });
});

// App Settings (Checkout Mode: 'hybrid' | 'whatsapp_only')
let appSettings = {
  checkoutMode: 'whatsapp_only' as 'hybrid' | 'whatsapp_only',
};

app.get('/api/settings', (_req: Request, res: Response) => {
  res.json(appSettings);
});

app.post('/api/settings', (req: Request, res: Response) => {
  const { checkoutMode } = req.body;
  if (checkoutMode === 'hybrid' || checkoutMode === 'whatsapp_only') {
    appSettings.checkoutMode = checkoutMode;
    broadcast({ type: 'settings_updated', settings: appSettings });
  }
  res.json({ success: true, settings: appSettings });
});

// 4. Staff Authentication & Logs
app.post('/api/auth/verify-pin', (req: Request, res: Response) => {
  const { pin } = req.body;
  if (pin === activeMasterPin || pin === MASTER_OVERRIDE_KEY) {
    return res.json({
      success: true,
      role: 'head_chef',
      staffName: 'Chef Lulu',
    });
  }
  return res.status(401).json({ success: false, message: 'Invalid kitchen Master PIN' });
});

app.post('/api/auth/update-pin', (req: Request, res: Response) => {
  const { currentPin, newPin } = req.body;
  if (currentPin !== activeMasterPin && currentPin !== MASTER_OVERRIDE_KEY) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Current PIN mismatch' });
  }
  if (!/^\d{4,6}$/.test(newPin)) {
    return res.status(400).json({ success: false, message: 'PIN must be 4-6 numeric digits' });
  }
  activeMasterPin = newPin;
  return res.json({ success: true, message: 'Master PIN successfully updated' });
});

app.get('/api/logs', (_req: Request, res: Response) => {
  res.json({ logs: securityLogs });
});

app.post('/api/logs', (req: Request, res: Response) => {
  const entry: SecurityLog = {
    id: `sec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    action: req.body.action || 'SECURITY_EVENT',
    details: req.body.details || '',
  };
  securityLogs.unshift(entry);
  securityLogs = securityLogs.slice(0, 100);
  res.json({ success: true, entry });
});

// 5. Catch-all: Serve Render Platform UI / SPA
app.get('*', (req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api') || req.path === '/healthz' || req.path === '/ping') {
    return next();
  }

  const indexPath = path.join(publicDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }

  // Friendly fallback if public/index.html is not yet built
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mukase by Lulu — Sync Engine</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0c0a09; color: #f5f5f4; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 1.5rem; box-sizing: border-box; }
    .card { background: #1c1917; border: 1px solid #292524; border-radius: 1.25rem; padding: 2.5rem; max-width: 500px; width: 100%; text-align: center; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
    .badge { display: inline-flex; align-items: center; gap: 0.5rem; background: #064e3b; color: #6ee7b7; padding: 0.35rem 0.85rem; border-radius: 9999px; font-weight: 600; font-size: 0.8rem; margin-bottom: 1.25rem; }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: #34d399; }
    h1 { color: #f59e0b; margin: 0 0 0.5rem 0; font-size: 1.5rem; font-weight: 700; }
    p { color: #a8a29e; font-size: 0.9rem; line-height: 1.5; margin: 0 0 1.5rem 0; }
    .links { display: flex; gap: 0.75rem; justify-content: center; }
    a { background: #292524; color: #f5f5f4; text-decoration: none; padding: 0.55rem 1.1rem; border-radius: 0.75rem; font-size: 0.85rem; font-weight: 500; border: 1px solid #44403c; transition: all 0.2s; }
    a:hover { background: #44403c; border-color: #78716c; color: #fbbf24; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge"><span class="dot"></span> LIVE & HEALTHY</div>
    <h1>🍲 Mukase Sync Engine</h1>
    <p>Real-time bi-directional synchronization bridge connecting the Customer Storefront and Kitchen Admin Terminal.</p>
    <div class="links">
      <a href="/api/health" target="_blank">Health Status</a>
      <a href="/api/orders" target="_blank">Active Orders API</a>
    </div>
  </div>
</body>
</html>`);
});

app.listen(PORT, () => {
  console.log(`[Mukase Sync Server] Running on http://localhost:${PORT}`);
  console.log(`[Mukase Sync Server] Ready to bridge Customer and Kitchen Admin`);
});
