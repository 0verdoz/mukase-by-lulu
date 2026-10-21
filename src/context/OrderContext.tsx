import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, CustomerDetails, MenuItem, Order, OrderStatus, SelectedCustomization, ChatMessage } from '../types';
import { generateOrderCode } from '../utils/checkout';
import { analyzePaymentProof, registerTransactionId } from '../utils/fraudVerification';
import {
  fetchRemoteOrders,
  pushRemoteOrder,
  updateRemoteOrderStatus,
  submitRemotePaymentProof,
  subscribeToSyncStream,
} from '../services/orderApi';

const STORAGE_KEY_ORDERS = 'mukase_orders_list';
const STORAGE_KEY_CART = 'mukase_cart_items';
const STORAGE_KEY_CUSTOMER = 'mukase_customer_info';

interface OrderContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem, customization?: SelectedCustomization, quantity?: number) => void;
  updateCartQuantity: (cartItemId: string, newQty: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  customer: CustomerDetails;
  updateCustomer: (details: Partial<CustomerDetails>) => void;

  orders: Order[];
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  createOrder: (channel?: 'whatsapp' | 'imessage' | 'sms' | 'concierge_chat') => Order;
  submitPaymentProof: (orderId: string, proof: {
    transactionId: string;
    memoEntered: string;
    amountPaid: number;
    senderHandle: string;
    proofImageUrl?: string;
    rawText?: string;
  }) => { success: boolean; message: string; score: number };
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, riderNotes?: string) => void;
  findOrderById: (orderId: string) => Order | undefined;

  // Lulu Concierge Chat
  chatMessages: ChatMessage[];
  sendUserMessage: (text: string) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;

  // View state switches
  currentView: 'menu' | 'story' | 'track' | 'kitchen';
  setCurrentView: (view: 'menu' | 'story' | 'track' | 'kitchen') => void;
  trackingOrderId: string;
  setTrackingOrderId: (id: string) => void;

  // Cart Drawer & Customize Modal
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  customizingItem: MenuItem | null;
  setCustomizingItem: (item: MenuItem | null) => void;
  orderConfirmationModal: Order | null;
  setOrderConfirmationModal: (order: Order | null) => void;

  // Privacy & Terms Modal
  legalModalState: { isOpen: boolean; tab: 'privacy' | 'terms' };
  openLegalModal: (tab?: 'privacy' | 'terms') => void;
  closeLegalModal: () => void;

  // Kitchen Story Modal
  isStoryOpen: boolean;
  setIsStoryOpen: (open: boolean) => void;
}

const DEFAULT_CUSTOMER: CustomerDetails = {
  name: '',
  phone: '',
  address: '',
  apartmentSuite: '',
  city: 'Atlanta',
  postalCode: '30309',
  deliveryNotes: '',
  preferredPayment: 'cashapp',
  paymentIdentifier: '',
};

// Initial sample orders to populate the kitchen dashboard immediately
const INITIAL_DEMO_ORDERS: Order[] = [
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
      deliveryNotes: 'Call upon arrival, do not ring bell baby sleeping',
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
          description: 'Authentic Ghanaian smoky jollof rice topped with tender, slow-braised marinated goat meat...',
          image: '/src/assets/images/jollof_goat_real_1792537753380.jpg',
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
          description: 'Crispy thick-cut Ghanaian pona yam chips fried golden with wings...',
          image: '/src/assets/images/fried_yam_wings_real_1792537754730.jpg',
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
          description: 'Authentic Ghanaian fermented corn and cassava Banku dumpling...',
          image: '/src/assets/images/food_banku_okro_soup_1792535657171.jpg',
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

const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'bot',
    text: "Akwaaba! 🇬🇭 Welcome to Mukase by Lulu. We are currently accepting orders for our new menu: Jollof with wings ($28) or goat ($30), Banku with okro soup ($30), Pounded Fufu ($30), Waakye special ($28), Fried Yam ($20-$25), and custom Egusi/Efo Riro ($28+). You can also request dishes outside the menu! How can we help?",
    timestamp: 'Just now',
    quickReplies: [
      'View New Kitchen Menu',
      'Our Kitchen Story',
      'Order Custom Off-Menu Dish',
      'Track My Order',
      'How Payment & Anti-Scam Verification Works',
      'Delivery Radius & Fees',
    ],
  },
];

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CART);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [customer, setCustomer] = useState<CustomerDetails>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CUSTOMER);
      return stored ? { ...DEFAULT_CUSTOMER, ...JSON.parse(stored) } : DEFAULT_CUSTOMER;
    } catch {
      return DEFAULT_CUSTOMER;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ORDERS);
      return stored ? JSON.parse(stored) : INITIAL_DEMO_ORDERS;
    } catch {
      return INITIAL_DEMO_ORDERS;
    }
  });

  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [currentView, setCurrentView] = useState<'menu' | 'story' | 'track' | 'kitchen'>('menu');
  const [trackingOrderId, setTrackingOrderId] = useState<string>('MUK-4821');

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [orderConfirmationModal, setOrderConfirmationModal] = useState<Order | null>(null);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);

  const [legalModalState, setLegalModalState] = useState<{ isOpen: boolean; tab: 'privacy' | 'terms' }>({
    isOpen: false,
    tab: 'privacy',
  });

  const openLegalModal = (tab: 'privacy' | 'terms' = 'privacy') => {
    setLegalModalState({ isOpen: true, tab });
  };

  const closeLegalModal = () => {
    setLegalModalState(prev => ({ ...prev, isOpen: false }));
  };

  const isStoryOpen = currentView === 'story';
  const setIsStoryOpen = (open: boolean) => {
    if (open) {
      setCurrentView('story');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentView === 'story') {
      setCurrentView('menu');
    }
  };

  // Sync to storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CUSTOMER, JSON.stringify(customer));
  }, [customer]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
  }, [orders]);

  // Real-time synchronization with shared backend engine
  useEffect(() => {
    let isMounted = true;

    // Fetch latest remote orders on mount
    fetchRemoteOrders().then(remoteOrders => {
      if (isMounted && remoteOrders && remoteOrders.length > 0) {
        setOrders(prev => {
          const remoteIds = new Set(remoteOrders.map(r => r.id));
          const uniqueLocals = prev.filter(l => !remoteIds.has(l.id));
          return [...remoteOrders, ...uniqueLocals];
        });
      }
    });

    // Subscribe to SSE stream for live updates (order_created, order_updated)
    const unsubscribe = subscribeToSyncStream({
      onOrderCreated: (newOrder) => {
        if (!isMounted) return;
        setOrders(prev => {
          if (prev.some(o => o.id === newOrder.id)) return prev;
          return [newOrder, ...prev];
        });
      },
      onOrderUpdated: (updatedOrder) => {
        if (!isMounted) return;
        setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
        setActiveOrder(prev => (prev && prev.id === updatedOrder.id ? updatedOrder : prev));
      },
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const addToCart = (item: MenuItem, customization?: SelectedCustomization, quantity: number = 1) => {
    const proteinExtra = customization?.proteinExtraPrice || 0;
    const addOnsExtra = customization?.selectedAddOns.reduce((sum, a) => sum + a.price, 0) || 0;
    const customFee = customization?.customizationFee || 0;
    const singleUnitPrice = item.price + proteinExtra + addOnsExtra + customFee;
    const itemTotalPrice = singleUnitPrice * quantity;

    const newCartItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      menuItem: item,
      quantity,
      customization,
      itemTotalPrice,
    };

    setCart(prev => [...prev, newCartItem]);
    setIsCartOpen(true);
  };

  const updateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.id === cartItemId) {
          const proteinExtra = item.customization?.proteinExtraPrice || 0;
          const addOnsExtra = item.customization?.selectedAddOns.reduce((sum, a) => sum + a.price, 0) || 0;
          const customFee = item.customization?.customizationFee || 0;
          const singleUnitPrice = item.menuItem.price + proteinExtra + addOnsExtra + customFee;
          return {
            ...item,
            quantity: newQty,
            itemTotalPrice: singleUnitPrice * newQty,
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateCustomer = (details: Partial<CustomerDetails>) => {
    setCustomer(prev => ({ ...prev, ...details }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.itemTotalPrice, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const createOrder = (channel: 'whatsapp' | 'imessage' | 'sms' | 'concierge_chat' = 'whatsapp'): Order => {
    const subtotal = cartTotal;
    const deliveryFee = 4.99;
    const tax = +(subtotal * 0.08).toFixed(2);
    const total = +(subtotal + deliveryFee + tax).toFixed(2);
    const uniqueId = generateOrderCode();

    const newOrder: Order = {
      id: uniqueId,
      createdAt: new Date().toISOString(),
      customer: { ...customer },
      items: [...cart],
      subtotal,
      deliveryFee,
      tax,
      total,
      status: 'pending_payment',
      estimatedDeliveryMinutes: 35,
      riderName: 'Kwame A.',
      riderPhone: '404-555-0144',
      channel,
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    setTrackingOrderId(newOrder.id);
    clearCart();
    setIsCartOpen(false);
    setOrderConfirmationModal(newOrder);

    // Push to shared backend engine (syncs to Standalone Admin on port 3001)
    pushRemoteOrder(newOrder).catch(() => {});

    // Also push a chat message to the concierge
    setChatMessages(prev => [
      ...prev,
      {
        id: `chat-${Date.now()}`,
        sender: 'bot',
        text: `Order *${uniqueId}* has been generated for $${total.toFixed(2)}! Please send payment via ${customer.preferredPayment.toUpperCase()} with memo "${uniqueId}". Once sent, paste your Transaction ID or receipt here for automated verification.`,
        timestamp: 'Just now',
        orderPreview: newOrder,
        quickReplies: ['Upload Payment Proof', 'Track My Order', 'Speak to Chef Lulu'],
      },
    ]);

    return newOrder;
  };

  const submitPaymentProof = (orderId: string, proof: {
    transactionId: string;
    memoEntered: string;
    amountPaid: number;
    senderHandle: string;
    proofImageUrl?: string;
    rawText?: string;
  }) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) {
      return { success: false, message: 'Order not found.', score: 0 };
    }

    const analysis = analyzePaymentProof(targetOrder, proof);

    // If legitimate or manual review, we store the proof
    const newStatus: OrderStatus = analysis.isLegitimate ? 'payment_verified' : 'pending_payment';

    if (analysis.isLegitimate) {
      registerTransactionId(proof.transactionId);
    }

    const updatedProof = {
      method: targetOrder.customer.preferredPayment,
      senderTagOrName: proof.senderHandle || targetOrder.customer.paymentIdentifier,
      transactionId: proof.transactionId,
      proofImageUrl: proof.proofImageUrl,
      submittedAt: new Date().toISOString(),
      verifiedAt: analysis.isLegitimate ? new Date().toISOString() : undefined,
      isVerified: analysis.isLegitimate,
      memoMatched: analysis.memoMatched,
      duplicateDetected: analysis.duplicateDetected,
      verificationNotes: analysis.flags.join(' | ') || 'All security invariants passed (Memo matched, unique TxID, exact amount).',
    };

    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: newStatus, paymentProof: updatedProof } : o))
    );

    if (activeOrder && activeOrder.id === orderId) {
      setActiveOrder(prev => (prev ? { ...prev, status: newStatus, paymentProof: updatedProof } : null));
    }

    // Push proof to shared backend
    submitRemotePaymentProof(orderId, {
      transactionId: proof.transactionId,
      senderHandle: proof.senderHandle || targetOrder.customer.paymentIdentifier,
      memoEntered: proof.memoEntered,
    }).catch(() => {});

    let feedbackMsg = '';
    if (analysis.isLegitimate) {
      feedbackMsg = `Payment verified! Score: ${analysis.score}/100. Chef Lulu's kitchen has been notified to fire up the pots!`;
    } else if (analysis.duplicateDetected) {
      feedbackMsg = `FLAGGED: Duplicate transaction ID detected. Reference "${proof.transactionId}" was already processed.`;
    } else {
      feedbackMsg = `Proof received (Score: ${analysis.score}/100). Flagged for quick manual approval by staff: ${analysis.flags[0] || 'Verification in progress'}`;
    }

    return {
      success: analysis.isLegitimate,
      message: feedbackMsg,
      score: analysis.score,
    };
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, riderNotes?: string) => {
    setOrders(prev =>
      prev.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            status: newStatus,
            deliveryNotes: riderNotes || o.customer.deliveryNotes,
          };
        }
        return o;
      })
    );

    if (activeOrder && activeOrder.id === orderId) {
      setActiveOrder(prev => (prev ? { ...prev, status: newStatus } : null));
    }

    // Push updated status to shared backend engine (syncs to customer live tracker)
    updateRemoteOrderStatus(orderId, newStatus, riderNotes).catch(() => {});
  };

  const findOrderById = (orderId: string) => {
    return orders.find(o => o.id.toLowerCase() === orderId.toLowerCase().trim());
  };

  const sendUserMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
    };

    setChatMessages(prev => [...prev, userMsg]);

    // Automated smart concierge answers
    setTimeout(() => {
      const lower = text.toLowerCase();
      let botResponse = '';
      let quickReplies: string[] = ['Track My Order', 'Customization Info', 'Payment Verification Help'];

      if (lower.includes('track') || lower.includes('status') || lower.includes('where is my food')) {
        const orderMatch = text.match(/muk-\d{4}/i);
        const searchedId = orderMatch ? orderMatch[0].toUpperCase() : trackingOrderId;
        const found = findOrderById(searchedId);
        if (found) {
          const statusLabels: Record<OrderStatus, string> = {
            pending_payment: '⏳ Awaiting Payment Memo Verification',
            payment_verified: '✅ Payment Confirmed by Kitchen',
            preparing_in_kitchen: '🔥 Simmering in Lulu’s Kitchen',
            out_for_delivery: '🛵 Courier En Route (ETA ~12 mins)',
            delivered: '🎉 Delivered! Enjoy your meal',
            cancelled: '❌ Order Cancelled',
          };
          botResponse = `Order *${found.id}* is currently: ${statusLabels[found.status]}. Total: $${found.total.toFixed(2)} for ${found.items.length} items to ${found.customer.address}.`;
          quickReplies = ['View Live Map Tracking', 'Contact Courier', 'Order Again'];
        } else {
          botResponse = `I couldn't find that order code. Please provide your 7-character code (e.g. MUK-8492) or use the Track Order tab on top.`;
          quickReplies = ['MUK-4821', 'MUK-6190'];
        }
      } else if (lower.includes('payment') || lower.includes('scam') || lower.includes('cashapp') || lower.includes('zelle') || lower.includes('memo')) {
        botResponse = `To prevent scams and duplicate receipt fraud, Mukase by Lulu requires your unique Order Code (e.g. "MUK-8492") in your CashApp ($MukaseByLulu) or Zelle memo field. Our verification system automatically audits the transaction reference number and prevents recycled receipts!`;
        quickReplies = ['Submit Payment Proof', 'View CashApp Tag', 'Order Now'];
      } else if (lower.includes('allergy') || lower.includes('peanut') || lower.includes('suya') || lower.includes('vegan')) {
        botResponse = `Nut Allergy Warning: Beef Suya skewers contain traditional Yaji spice made with roasted peanuts (Kuli-Kuli). For nut-free options, enjoy our Smoky Party Jollof, Special Waakye Bowl, and Kelewele without peanut garnish!`;
        quickReplies = ['View Menu', 'Customize Waakye', 'Track Order'];
      } else if (lower.includes('delivery') || lower.includes('radius') || lower.includes('fee')) {
        botResponse = `We deliver within an 8-mile radius of Midtown Atlanta (Peachtree, Buckhead, Downtown, West Midtown, Decatur). Delivery is a flat $4.99 and average prep+delivery time is 30–40 minutes!`;
        quickReplies = ['Start Order', 'View Menu'];
      } else {
        botResponse = `Thank you for contacting Mukase by Lulu! 🇬🇭 We specialize in authentic West African homestyle dishes: Jollof with goat ($30) or wings ($28), Banku with okro soup ($30), Pounded Fufu ($30), Waakye, and custom Egusi/Efo Riro with your choice of swallow. You can also request dishes outside the menu!`;
        quickReplies = ['View Complete Menu', 'Order Off-Menu Custom', 'Track My Order', 'Payment FAQ'];
      }

      setChatMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: botResponse,
          timestamp: 'Just now',
          quickReplies,
        },
      ]);
    }, 600);
  };

  return (
    <OrderContext.Provider
      value={{
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
        customer,
        updateCustomer,
        orders,
        activeOrder,
        setActiveOrder,
        createOrder,
        submitPaymentProof,
        updateOrderStatus,
        findOrderById,
        chatMessages,
        sendUserMessage,
        isChatOpen,
        setIsChatOpen,
        currentView,
        setCurrentView,
        trackingOrderId,
        setTrackingOrderId,
        isCartOpen,
        setIsCartOpen,
        customizingItem,
        setCustomizingItem,
        orderConfirmationModal,
        setOrderConfirmationModal,
        legalModalState,
        openLegalModal,
        closeLegalModal,
        isStoryOpen,
        setIsStoryOpen,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
