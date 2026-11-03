export interface KitchenOrder {
  id: string;
  ticketNumber: string;
  customerName: string;
  orderType: 'Dine-In' | 'Takeaway' | 'Delivery';
  tableOrAddress: string;
  createdAt: string;
  items: {
    name: string;
    quantity: number;
    notes?: string;
    station: 'Grill' | 'Pots' | 'Fryer' | 'Pass';
  }[];
  totalPrice: string;
  status: 'received' | 'cooking' | 'ready' | 'dispatched';
  spiceLevel: 'Mild' | 'Medium' | 'Hot' | 'Extra Shito';
}

export const INITIAL_ORDERS: KitchenOrder[] = [
  {
    id: 'ord-1042',
    ticketNumber: '#1042',
    customerName: 'Kofi Mensah',
    orderType: 'Dine-In',
    tableOrAddress: 'Table 4 · Courtyard',
    createdAt: '2 mins ago',
    items: [
      { name: 'Smoky Party Jollof Rice', quantity: 2, notes: 'Extra crispy bottom pot (kanzo)', station: 'Pots' },
      { name: 'Chargrilled Suya Beef Skewers', quantity: 1, notes: 'Medium well, spiced yaji dust', station: 'Grill' },
      { name: 'Sweet Fried Kelewele', quantity: 1, notes: 'Fresh ginger marinade', station: 'Fryer' },
    ],
    totalPrice: '₵185.00',
    status: 'cooking',
    spiceLevel: 'Hot',
  },
  {
    id: 'ord-1043',
    ticketNumber: '#1043',
    customerName: 'Abena Osei',
    orderType: 'Delivery',
    tableOrAddress: 'Cantonments, Apt 3B',
    createdAt: '5 mins ago',
    items: [
      { name: 'Slow-Braised Goat Light Soup', quantity: 1, notes: 'Authentic habanero broth', station: 'Pots' },
      { name: 'Pounded Steamed Fufu', quantity: 2, notes: 'Freshly wrapped in leaf', station: 'Pots' },
    ],
    totalPrice: '₵140.00',
    status: 'cooking',
    spiceLevel: 'Extra Shito',
  },
  {
    id: 'ord-1044',
    ticketNumber: '#1044',
    customerName: 'Yaw Boateng',
    orderType: 'Takeaway',
    tableOrAddress: 'Counter Pickup',
    createdAt: '8 mins ago',
    items: [
      { name: 'Crispy Seasoned Tilapia', quantity: 1, notes: 'Stuffed with fresh peppers & onions', station: 'Grill' },
      { name: 'Hot Fermented Banku', quantity: 2, notes: 'Extra hot ground green pepper dip', station: 'Pots' },
    ],
    totalPrice: '₵160.00',
    status: 'ready',
    spiceLevel: 'Medium',
  },
  {
    id: 'ord-1045',
    ticketNumber: '#1045',
    customerName: 'Ama Serwaa',
    orderType: 'Delivery',
    tableOrAddress: 'Airport Residential',
    createdAt: '11 mins ago',
    items: [
      { name: 'Red-Red Bean Stew', quantity: 1, notes: 'Slow-simmered black eyed peas with palm oil', station: 'Pots' },
      { name: 'Caramelized Fried Plantains', quantity: 1, notes: 'Sprinkled with gari foto', station: 'Fryer' },
      { name: 'Fried Gizzard Bites', quantity: 1, notes: 'Tossed in pepper sauce', station: 'Fryer' },
    ],
    totalPrice: '₵125.00',
    status: 'dispatched',
    spiceLevel: 'Mild',
  },
];

export const MUKASE_DIAGNOSTICS = {
  service: 'Mukase Sync Engine',
  version: '2.4.1-human',
  runtime: 'Node.js 22 LTS · Render Web Service',
  handshakeProtocol: 'WebSocket (WSS) + SSE Fallback',
  uptime: '99.99%',
  uptimeSeconds: 84320,
  averageLatencyMs: 1.4,
  connectedTerminals: [
    { name: 'Kitchen Admin Main KDS', ip: '192.168.1.101', status: 'connected', latency: '0.8ms' },
    { name: 'Grill Station Display', ip: '192.168.1.104', status: 'connected', latency: '1.2ms' },
    { name: 'Storefront Web Ingress', ip: 'edge.mukase.kitchen', status: 'connected', latency: '1.9ms' },
    { name: 'Rider Dispatch Courier Terminal', ip: '192.168.1.110', status: 'connected', latency: '1.1ms' },
  ],
  throughput: {
    requestsPerMinute: 342,
    ticketsDispatchedToday: 418,
    zeroPacketDropGuarantee: true,
  },
};
