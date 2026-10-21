export type SpiceLevel = 'Mild' | 'Medium' | 'Hot (Traditional)' | 'Extra Fiery Shito';

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
<<<<<<< HEAD
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'jollof' | 'bowls' | 'suya' | 'sides' | 'drinks';
=======
  category?: 'side' | 'protein' | 'addon' | 'swallow';
}

export type MenuCategory = 
  | 'jollof' 
  | 'banku-fufu' 
  | 'yam-cassava' 
  | 'soups-stews' 
  | 'chops-sides' 
  | 'custom-chef';

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
>>>>>>> main
  price: number;
  description: string;
  image: string;
  tag?: string;
  spicyLevel?: number; // 0 to 3
  isCustomizable?: boolean;
<<<<<<< HEAD
=======
  sidesOptions?: { name: string; extraPrice: number }[];
>>>>>>> main
  proteinOptions?: { name: string; extraPrice: number }[];
  availableAddOns?: CustomizationOption[];
}

export interface SelectedCustomization {
<<<<<<< HEAD
=======
  selectedSideOrSwallow?: string;
>>>>>>> main
  protein?: string;
  proteinExtraPrice: number;
  spiceLevel: SpiceLevel;
  selectedAddOns: CustomizationOption[];
  specialInstructions?: string;
<<<<<<< HEAD
=======
  isOffMenuCustom?: boolean;
  offMenuDishName?: string;
  offMenuDetails?: string;
  customizationFee?: number;
>>>>>>> main
}

export interface CartItem {
  id: string; // unique cart line id
  menuItem: MenuItem;
  quantity: number;
  customization?: SelectedCustomization;
  itemTotalPrice: number;
}

export type PaymentMethod = 'cashapp' | 'zelle' | 'apple_cash';

export type OrderStatus = 
  | 'pending_payment'
  | 'payment_verified'
  | 'preparing_in_kitchen'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface PaymentProof {
  method: PaymentMethod;
  senderTagOrName: string;
  transactionId: string;
  proofImageUrl?: string;
  submittedAt: string;
  verifiedAt?: string;
  isVerified: boolean;
  memoMatched: boolean;
  duplicateDetected: boolean;
  verificationNotes?: string;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
  apartmentSuite?: string;
  city: string;
  postalCode?: string;
  deliveryNotes?: string;
  preferredPayment: PaymentMethod;
  paymentIdentifier: string; // $cashapp tag or zelle name/phone
}

export interface Order {
  id: string; // e.g. MUK-8492
  createdAt: string;
  customer: CustomerDetails;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentProof?: PaymentProof;
  estimatedDeliveryMinutes: number;
  riderName?: string;
  riderPhone?: string;
  channel: 'whatsapp' | 'imessage' | 'sms' | 'concierge_chat';
}

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user' | 'system';
  text: string;
  timestamp: string;
  quickReplies?: string[];
  orderPreview?: Order;
}
