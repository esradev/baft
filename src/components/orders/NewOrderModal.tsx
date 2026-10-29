import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Instagram, 
  Send, 
  ShoppingBag, 
  CreditCard, 
  Truck, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Order, Product, CourierType, PaymentMethod, ChannelType } from '../../types';
import { IRAN_PROVINCES, formatToman, toPersianDigits, COURIER_MAP } from '../../utils/persian';

interface NewOrderModalProps {
  products: Product[];
  onClose: () => void;
  onSaveOrder: (newOrder: Order) => void;
  initialDraft?: Partial<Order>;
}

export const NewOrderModal: React.FC<NewOrderModalProps> = ({
  products,
  onClose,
  onSaveOrder,
  initialDraft,
}) => {
  const [customerName, setCustomerName] = useState(initialDraft?.customerName || '');
  const [phone, setPhone] = useState(initialDraft?.phone || '');
  const [socialHandle, setSocialHandle] = useState(initialDraft?.socialHandle || '@');
  const [channel, setChannel] = useState<ChannelType>(initialDraft?.channel || 'instagram');
  const [province, setProvince] = useState(initialDraft?.province || 'تهران');
  const [city, setCity] = useState(initialDraft?.city || 'تهران');
  const [address, setAddress] = useState(initialDraft?.address || '');
  const [postalCode, setPostalCode] = useState(initialDraft?.postalCode || '');
  const [courier, setCourier] = useState<CourierType>('post_pishtaz');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card_to_card');
  const [discount, setDiscount] = useState(0);
  const [customerNote, setCustomerNote] = useState('');

  // Selected Order Items
  const [selectedItems, setSelectedItems] = useState<{
    productId: string;
    title: string;
    image: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
  }[]>([
    {
      productId: products[0]?.id || 'prod-1',
      title: products[0]?.title || 'مانتو کتی لینن ژاکارد',
      image: products[0]?.images[0] || '',
      size: products[0]?.variations[0]?.size || 'سایز ۱',
      color: products[0]?.variations[0]?.color || 'کرم',
      quantity: 1,
      price: products[0]?.price || 980000,
    }
  ]);

  const handleAddItem = () => {
    const defaultProd = products[0];
    if (defaultProd) {
      setSelectedItems([
        ...selectedItems,
        {
          productId: defaultProd.id,
          title: defaultProd.title,
          image: defaultProd.images[0],
          size: defaultProd.variations[0]?.size || 'استاندارد',
          color: defaultProd.variations[0]?.color || 'پیش‌فرض',
          quantity: 1,
          price: defaultProd.price,
        }
      ]);
    }
  };

  const handleRemoveItem = (index: number) => {
    if (selectedItems.length > 1) {
      setSelectedItems(selectedItems.filter((_, i) => i !== index));
    }
  };

  const handleProductChange = (index: number, prodId: string) => {
    const found = products.find(p => p.id === prodId);
    if (!found) return;
    const updated = [...selectedItems];
    updated[index] = {
      productId: found.id,
      title: found.title,
      image: found.images[0],
      size: found.variations[0]?.size || 'استاندارد',
      color: found.variations[0]?.color || 'پیش‌فرض',
      quantity: 1,
      price: found.price,
    };
    setSelectedItems(updated);
  };

  const getShippingCost = (c: CourierType) => {
    switch (c) {
      case 'post_pishtaz': return 55000;
      case 'tipax': return 75000;
      case 'chapar': return 70000;
      case 'peyk': return 45000;
      default: return 55000;
    }
  };

  const subtotal = selectedItems.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const shippingCost = getShippingCost(courier);
  const grandTotal = Math.max(0, subtotal + shippingCost - discount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !address) {
      alert('لطفاً نام، تلفن و آدرس پستی را وارد کنید.');
      return;
    }

    const orderNumber = `BFT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName,
      phone,
      socialHandle,
      channel,
      status: 'confirmed',
      items: selectedItems,
      totalAmount: subtotal,
      shippingCost,
      discount,
      grandTotal,
      paymentMethod,
      paymentStatus: 'paid',
      bankRefNumber: `TRX-${Math.floor(100000 + Math.random() * 900000)}`,
      courier,
      trackingNumber: `29817400${Math.floor(10000000 + Math.random() * 90000000)}`,
      address: `${province}، ${city}، ${address}`,
      city,
      province,
      postalCode: postalCode || '1998765432',
      createdAt: 'امروز - همین الان',
      updatedAt: 'امروز - همین الان',
      notes: 'ثبت دستی توسط فروشنده',
      customerNote,
    };

    onSaveOrder(newOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-3xl bg-white shadow-2xl dark:bg-slate-900 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-white">ثبت سفارش جدید</h3>
              <p className="text-xs text-slate-400">سفارش دریافتی از دایرکت یا تلگرام را به سیستم اضافه کنید</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Customer & Social Handle */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-850">
            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 mb-3">۱. اطلاعات مشتری و شبکه اجتماعی</h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">نام و نام‌خانوادگی *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="مثال: فاطمه رضایی"
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">شماره تماس همراه *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 font-num"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">کانال ثبت سفارش</label>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setChannel('instagram')}
                    className={`flex flex-1 items-center justify-center gap-1 rounded-xl py-2 text-xs font-bold transition-all ${
                      channel === 'instagram' ? 'bg-pink-600 text-white' : 'bg-white border text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Instagram className="h-3.5 w-3.5" />
                    <span>دایرکت</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setChannel('telegram')}
                    className={`flex flex-1 items-center justify-center gap-1 rounded-xl py-2 text-xs font-bold transition-all ${
                      channel === 'telegram' ? 'bg-sky-500 text-white' : 'bg-white border text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Send className="h-3.5 w-3.5 -rotate-45" />
                    <span>تلگرام</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">آیدی / یوزرنیم اینستاگرام یا تلگرام</label>
              <input
                type="text"
                value={socialHandle}
                onChange={(e) => setSocialHandle(e.target.value)}
                placeholder="@username"
                className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dir-ltr text-right"
              />
            </div>
          </div>

          {/* Delivery Address */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-850">
            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 mb-3">۲. نشانی و اطلاعات ارسال پستی</h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">استان</label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  {IRAN_PROVINCES.map((pr) => (
                    <option key={pr} value={pr}>{pr}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">شهر</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="مثال: تهران"
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">کدپستی ۱۰ رقمی</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="۱۹۹۸۷۶۵۴۳۲"
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 font-num"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">آدرس پستی کامل *</label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="خیابان، کوچه، پلاک، واحد..."
                className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Product Items Picker */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-850">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">۳. انتخاب محصولات سفارش</h4>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>افزودن قلم کالا</span>
              </button>
            </div>

            <div className="space-y-3">
              {selectedItems.map((item, idx) => (
                <div key={idx} className="flex flex-wrap items-center gap-2 rounded-xl bg-white p-3 border border-slate-200 shadow-xs dark:bg-slate-800 dark:border-slate-700">
                  <div className="flex-1 min-w-[180px]">
                    <label className="block text-[10px] text-slate-400 mb-0.5">نام کالا</label>
                    <select
                      value={item.productId}
                      onChange={(e) => handleProductChange(idx, e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>{p.title} - {formatToman(p.price)}</option>
                      ))}
                    </select>
                  </div>

                  <div className="w-24">
                    <label className="block text-[10px] text-slate-400 mb-0.5">سایز / رنگ</label>
                    <input
                      type="text"
                      value={item.size}
                      onChange={(e) => {
                        const copy = [...selectedItems];
                        copy[idx].size = e.target.value;
                        setSelectedItems(copy);
                      }}
                      className="w-full rounded-lg border border-slate-200 p-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div className="w-16">
                    <label className="block text-[10px] text-slate-400 mb-0.5">تعداد</label>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => {
                        const copy = [...selectedItems];
                        copy[idx].quantity = parseInt(e.target.value, 10) || 1;
                        setSelectedItems(copy);
                      }}
                      className="w-full rounded-lg border border-slate-200 p-1.5 text-xs text-center font-bold dark:border-slate-700 dark:bg-slate-800 dark:text-white font-num"
                    />
                  </div>

                  <div className="text-left w-24">
                    <label className="block text-[10px] text-slate-400 mb-0.5">قیمت کل</label>
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {formatToman(item.price * item.quantity)}
                    </span>
                  </div>

                  {selectedItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Courier & Payment Method */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-850">
              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 mb-2">۴. روش ارسال</h4>
              <div className="space-y-1.5 text-xs">
                {(['post_pishtaz', 'tipax', 'peyk'] as CourierType[]).map((c) => (
                  <label key={c} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-2.5 cursor-pointer hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="courier"
                        checked={courier === c}
                        onChange={() => setCourier(c)}
                        className="text-indigo-600"
                      />
                      <span>{COURIER_MAP[c].icon} {COURIER_MAP[c].label}</span>
                    </div>
                    <span className="font-bold text-slate-700 dark:text-slate-300 font-num">{formatToman(getShippingCost(c))}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-850">
              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 mb-2">۵. روش پرداخت</h4>
              <div className="space-y-1.5 text-xs">
                {(['card_to_card', 'zarinpal', 'cash_on_delivery'] as PaymentMethod[]).map((p) => (
                  <label key={p} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-2.5 cursor-pointer hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === p}
                        onChange={() => setPaymentMethod(p)}
                        className="text-indigo-600"
                      />
                      <span>{p === 'card_to_card' ? '💳 کارت به کارت (واریزی)' : p === 'zarinpal' ? '🌐 درگاه زرین‌پال' : '💵 پرداخت در محل (COD)'}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing Calculation Summary */}
          <div className="rounded-2xl bg-indigo-50/80 p-4 text-xs dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>جمع اقلام سفارش:</span>
                <span className="font-bold">{formatToman(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>هزینه ارسال ({COURIER_MAP[courier].label}):</span>
                <span className="font-bold">{formatToman(shippingCost)}</span>
              </div>
              <div className="flex justify-between border-t border-indigo-200/60 pt-2 font-black text-sm text-slate-900 dark:border-indigo-900 dark:text-white">
                <span>مبلغ کل قابل پرداخت:</span>
                <span className="text-indigo-700 dark:text-indigo-300">{formatToman(grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-md shadow-indigo-500/25 hover:bg-indigo-700"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>ثبت و ذخیره نهایی سفارش</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
