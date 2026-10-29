export type ChannelType = 'instagram' | 'telegram';

export type OrderStatus = 'new' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';

export type PaymentMethod = 'card_to_card' | 'zarinpal' | 'idpay' | 'cash_on_delivery';

export type PaymentStatus = 'paid' | 'pending' | 'review_needed' | 'failed';

export type CourierType = 'post_pishtaz' | 'tipax' | 'chapar' | 'peyk';

export interface OrderItem {
  productId: string;
  title: string;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
  price: number; // in Tomans
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. BFT-9402
  customerName: string;
  phone: string;
  socialHandle: string; // e.g. @fa_rezaee
  channel: ChannelType;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number; // Tomans
  shippingCost: number; // Tomans
  discount: number; // Tomans
  grandTotal: number; // Tomans
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  bankRefNumber?: string;
  paymentSlipUrl?: string;
  courier: CourierType;
  trackingNumber?: string; // Barcode or Post Tracking code
  address: string;
  city: string;
  province: string;
  postalCode: string;
  createdAt: string; // Shamsi or ISO
  updatedAt: string;
  notes?: string;
  customerNote?: string;
}

export interface Customer {
  id: string;
  name: string;
  socialHandle: string;
  channel: ChannelType;
  phone: string;
  email?: string;
  avatarUrl: string;
  tier: 'vip' | 'regular' | 'new' | 'inactive';
  totalSpent: number; // Tomans
  ordersCount: number;
  lastOrderDate: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  notes: string[];
  tags: string[];
}

export interface ProductVariation {
  id: string;
  size: string;
  color: string;
  colorHex: string;
  stock: number;
}

export interface Product {
  id: string;
  title: string;
  sku: string;
  category: string;
  price: number; // Tomans
  costPrice: number; // Tomans
  stock: number;
  isLowStock: boolean;
  images: string[];
  variations: ProductVariation[];
  soldCount: number;
  rating: number;
  instagramSynced: boolean;
  telegramSynced: boolean;
  description: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: 'customer' | 'merchant' | 'system';
  text: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'voice' | 'receipt' | 'product';
  timestamp: string;
  isRead: boolean;
  isReceipt?: boolean;
  receiptData?: {
    amount: number;
    bank: string;
    refCode: string;
    cardLastDigits: string;
  };
}

export interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  socialHandle: string;
  channel: ChannelType;
  avatarUrl: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: 'active' | 'waiting_payment' | 'order_placed' | 'shipped';
  tags: string[];
  messages: ChatMessage[];
  pendingOrderDraft?: Partial<Order>;
}

export interface ShippingRate {
  province: string;
  cities: string[];
  pishtazCost: number;
  tipaxCost: number;
  peykCost?: number;
  estimatedDays: string;
}

export interface StoreSettings {
  storeName: string;
  category: string;
  instagramHandle: string;
  telegramChannel: string;
  cardNumber: string;
  shebaNumber: string;
  bankName: string;
  cardHolderName: string;
  zarinpalMerchantId: string;
  enablePostPishtaz: boolean;
  enableTipax: boolean;
  enablePeyk: boolean;
  defaultPishtazCost: number;
  smsTrackingNotification: boolean;
  isSetupCompleted: boolean;
}
