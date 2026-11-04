import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { OrdersView } from './components/orders/OrdersView';
import { OrderDetailDrawer } from './components/orders/OrderDetailDrawer';
import { NewOrderModal } from './components/orders/NewOrderModal';
import { InboxView } from './components/inbox/InboxView';
import { CustomersView } from './components/customers/CustomersView';
import { CustomerDetailDrawer } from './components/customers/CustomerDetailDrawer';
import { InventoryView } from './components/inventory/InventoryView';
import { ProductEditModal } from './components/inventory/ProductEditModal';
import { ShippingView } from './components/shipping/ShippingView';
import { AiScannerModal } from './components/ai/AiScannerModal';
import { OnboardingView } from './components/onboarding/OnboardingView';
import { DesignSystemView } from './components/design-system/DesignSystemView';

import { mockOrders, mockProducts, mockCustomers, mockConversations, mockMerchantProfile } from './data/mockData';
import { Order, Product, Customer, Conversation, OrderStatus } from './types';

export function App() {
  // App State
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);

  // Modals & Drawers State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [isAiScannerOpen, setIsAiScannerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [orderDraft, setOrderDraft] = useState<Partial<Order> | undefined>(undefined);

  // Toggle Theme class on document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Order Handlers
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handleUpdatePaymentStatus = (orderId: string, status: 'paid' | 'pending' | 'review_needed') => {
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, paymentStatus: status, status: status === 'paid' ? 'confirmed' : o.status } : o)));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, paymentStatus: status, status: status === 'paid' ? 'confirmed' : selectedOrder.status });
    }
  };

  const handleSaveNewOrder = (newOrder: Order) => {
    setOrders([newOrder, ...orders]);
    setOrderDraft(undefined);
  };

  // Chat Handlers
  const handleSendMessage = (conversationId: string, text: string) => {
    setConversations(
      conversations.map((c) => {
        if (c.id === conversationId) {
          const newMsg = {
            id: `msg-${Date.now()}`,
            sender: 'merchant' as const,
            text,
            timestamp: 'همین الان',
          };
          return {
            ...c,
            lastMessage: text,
            lastMessageTime: 'همین الان',
            unreadCount: 0,
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );
  };

  const handleConvertChatToOrder = (conv: Conversation) => {
    setOrderDraft({
      customerName: conv.customerName,
      socialHandle: conv.socialHandle,
      channel: conv.channel,
      phone: conv.messages.find((m) => m.text.includes('09') || m.text.includes('۰۹'))?.text.match(/09\d{9}|۰۹[۰-۹]{9}/)?.[0] || '۰۹۱۲۳۴۵۶۷۸۹',
      address: 'تهران، خیابان ولیعصر، بالاتر از میدان ونک',
      city: 'تهران',
      province: 'تهران',
    });
    setIsNewOrderModalOpen(true);
  };

  // Product Handlers
  const handleSaveProduct = (prod: Product) => {
    const exists = products.some((p) => p.id === prod.id);
    if (exists) {
      setProducts(products.map((p) => (p.id === prod.id ? prod : p)));
    } else {
      setProducts([prod, ...products]);
    }
    setEditingProduct(null);
    setIsAddingProduct(false);
  };

  const handleDeleteProduct = (prodId: string) => {
    if (confirm('آیا از حذف این کالا از انبار اطمینان دارید؟')) {
      setProducts(products.filter((p) => p.id !== prodId));
    }
  };

  // Counts for Badges
  const unreadMessagesCount = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
  const newOrdersCount = orders.filter((o) => o.status === 'new').length;
  const lowStockCount = products.filter((p) => p.isLowStock).length;

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-900 dark:text-slate-100 font-sans">
      {/* 1. Permanent Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'ai-scanner') {
            setIsAiScannerOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        unreadCount={unreadMessagesCount}
        newOrdersCount={newOrdersCount}
        lowStockCount={lowStockCount}
        instagramHandle={mockMerchantProfile.instagramHandle}
        telegramChannel={mockMerchantProfile.telegramChannel}
      />

      {/* 2. Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Top Navbar */}
        <Navbar
          darkMode={theme === 'dark'}
          setDarkMode={(isDark) => setTheme(isDark ? 'dark' : 'light')}
          storeSettings={mockMerchantProfile}
          onOpenAiScanner={() => setIsAiScannerOpen(true)}
          onOpenNewOrder={() => {
            setOrderDraft(undefined);
            setIsNewOrderModalOpen(true);
          }}
          onNavigate={(tab) => setCurrentTab(tab)}
          unreadCount={unreadMessagesCount}
          pendingOrdersCount={newOrdersCount}
        />

        {/* Dynamic Main View */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {currentTab === 'dashboard' && (
            <DashboardView
              orders={orders}
              products={products}
              conversations={conversations}
              onOpenNewOrder={() => {
                setOrderDraft(undefined);
                setIsNewOrderModalOpen(true);
              }}
              onOpenAiScanner={() => setIsAiScannerOpen(true)}
              onSelectOrder={(ord) => setSelectedOrder(ord)}
              onNavigate={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'orders' && (
            <OrdersView
              orders={orders}
              onSelectOrder={(ord) => setSelectedOrder(ord)}
              onOpenNewOrder={() => {
                setOrderDraft(undefined);
                setIsNewOrderModalOpen(true);
              }}
              onOpenAiScanner={() => setIsAiScannerOpen(true)}
              onUpdateOrderStatus={handleUpdateOrderStatus}
            />
          )}

          {currentTab === 'inbox' && (
            <InboxView
              conversations={conversations}
              customers={customers}
              onSendMessage={handleSendMessage}
              onConvertChatToOrder={handleConvertChatToOrder}
              onOpenAiScanner={() => setIsAiScannerOpen(true)}
            />
          )}

          {currentTab === 'customers' && (
            <CustomersView
              customers={customers}
              orders={orders}
              onSelectCustomer={(cust) => setSelectedCustomer(cust)}
              onOpenNewCustomer={() => {
                const newC: Customer = {
                  id: `cust-${Date.now()}`,
                  name: 'مشتری جدید',
                  phone: '۰۹۱۲۰۰۰۰۰۰۰',
                  socialHandle: '@new_customer',
                  channel: 'instagram',
                  avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
                  totalSpent: 0,
                  ordersCount: 0,
                  lastOrderDate: 'امروز',
                  tier: 'new',
                  city: 'تهران',
                  province: 'تهران',
                  address: 'تهران، میدان ونک',
                  postalCode: '۱۹۹۸۷۶۵۴۳۲',
                  notes: ['مشتری تازه وارد'],
                  tags: ['جدید'],
                };
                setCustomers([newC, ...customers]);
                setSelectedCustomer(newC);
              }}
            />
          )}

          {currentTab === 'inventory' && (
            <InventoryView
              products={products}
              onOpenAddProduct={() => {
                setEditingProduct(null);
                setIsAddingProduct(true);
              }}
              onEditProduct={(p) => setEditingProduct(p)}
              onDeleteProduct={handleDeleteProduct}
            />
          )}

          {currentTab === 'shipping' && <ShippingView />}

          {currentTab === 'onboarding' && <OnboardingView />}

          {currentTab === 'design-system' && <DesignSystemView />}
        </main>
      </div>

      {/* 3. Global Drawers & Modals */}
      {/* Order Detail Drawer */}
      {selectedOrder && (
        <OrderDetailDrawer
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={handleUpdateOrderStatus}
          onUpdatePaymentStatus={handleUpdatePaymentStatus}
        />
      )}

      {/* Customer Detail Drawer */}
      {selectedCustomer && (
        <CustomerDetailDrawer
          customer={selectedCustomer}
          orders={orders}
          onClose={() => setSelectedCustomer(null)}
          onSelectOrder={(ord) => setSelectedOrder(ord)}
          onOpenNewOrderForCustomer={(cust) => {
            setSelectedCustomer(null);
            setOrderDraft({
              customerName: cust.name,
              phone: cust.phone,
              socialHandle: cust.socialHandle,
              channel: cust.channel,
              province: cust.province,
              city: cust.city,
              address: cust.address,
              postalCode: cust.postalCode,
            });
            setIsNewOrderModalOpen(true);
          }}
        />
      )}

      {/* New Order Modal */}
      {isNewOrderModalOpen && (
        <NewOrderModal
          products={products}
          onClose={() => {
            setIsNewOrderModalOpen(false);
            setOrderDraft(undefined);
          }}
          onSaveOrder={handleSaveNewOrder}
          initialDraft={orderDraft}
        />
      )}

      {/* Product Add / Edit Modal */}
      {(isAddingProduct || editingProduct) && (
        <ProductEditModal
          product={editingProduct}
          onClose={() => {
            setIsAddingProduct(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
        />
      )}

      {/* AI Receipt & Order Scanner Modal */}
      {isAiScannerOpen && (
        <AiScannerModal
          products={products}
          onClose={() => setIsAiScannerOpen(false)}
          onOrderParsed={(draft) => {
            setOrderDraft(draft);
            setIsNewOrderModalOpen(true);
          }}
        />
      )}
    </div>
  );
}

export default App;
