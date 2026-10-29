import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  Plus, 
  Copy, 
  Check, 
  Send, 
  Instagram, 
  Clock, 
  Tag, 
  CreditCard,
  MessageSquare
} from 'lucide-react';
import { Customer, Order } from '../../types';
import { toPersianDigits, formatToman, formatPhoneNumber } from '../../utils/persian';

interface CustomerDetailDrawerProps {
  customer: Customer | null;
  orders: Order[];
  onClose: () => void;
  onSelectOrder: (order: Order) => void;
  onOpenNewOrderForCustomer: (customer: Customer) => void;
}

export const CustomerDetailDrawer: React.FC<CustomerDetailDrawerProps> = ({
  customer,
  orders,
  onClose,
  onSelectOrder,
  onOpenNewOrderForCustomer,
}) => {
  const [newNote, setNewNote] = useState('');
  const [notesList, setNotesList] = useState<string[]>(customer?.notes || []);
  const [copied, setCopied] = useState(false);

  if (!customer) return null;

  const customerOrders = orders.filter((o) => o.customerName === customer.name || o.phone === customer.phone);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotesList([...notesList, newNote.trim()]);
    setNewNote('');
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(`${customer.name} - ${customer.phone}\n${customer.province}، ${customer.address}\nکدپستی: ${customer.postalCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="relative flex h-full w-full max-w-xl flex-col bg-white shadow-2xl dark:bg-slate-900 overflow-y-auto">
        {/* Top Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
          <div className="flex items-center gap-3">
            <img
              src={customer.avatarUrl}
              alt={customer.name}
              className="h-11 w-11 rounded-full object-cover ring-2 ring-indigo-500/30"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{customer.name}</h3>
                {customer.tier === 'vip' && (
                  <span className="flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                    <Star className="h-2.5 w-2.5 fill-purple-600" />
                    VIP
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 dir-ltr text-right font-mono">{customer.socialHandle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="space-y-6 p-6">
          {/* Quick Action Button: Create Order */}
          <button
            onClick={() => onOpenNewOrderForCustomer(customer)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-md shadow-indigo-500/25 hover:bg-indigo-700 active:scale-98 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>ثبت سفارش اختصاصی برای {customer.name}</span>
          </button>

          {/* CRM Lifetime Stats */}
          <div className="grid grid-cols-3 gap-3 rounded-2xl bg-slate-50 p-3.5 text-center dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400">مجموع خرید (LTV)</span>
              <p className="mt-1 font-black text-xs md:text-sm text-slate-900 dark:text-white">{formatToman(customer.totalSpent)}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">تعداد سفارش‌ها</span>
              <p className="mt-1 font-black text-xs md:text-sm text-indigo-600 dark:text-indigo-400">{toPersianDigits(customer.ordersCount)} بار</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">آخرین خرید</span>
              <p className="mt-1 font-bold text-xs text-slate-700 dark:text-slate-300 font-num">{customer.lastOrderDate}</p>
            </div>
          </div>

          {/* Saved Address & Contact Details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs dark:border-slate-800 dark:bg-slate-850">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white mb-3">اطلاعات تماس و نشانی پستی</h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  تلفن همراه:
                </span>
                <span className="font-num font-bold text-slate-800 dark:text-slate-200">{formatPhoneNumber(customer.phone)}</span>
              </div>

              <div className="flex items-start justify-between gap-3">
                <span className="text-slate-400 flex items-center gap-1.5 shrink-0">
                  <MapPin className="h-3.5 w-3.5 mt-0.5" />
                  آدرس:
                </span>
                <div className="text-left">
                  <p className="text-slate-800 dark:text-slate-200 font-medium">{customer.province}، {customer.city}، {customer.address}</p>
                  <p className="text-[11px] text-slate-400 font-num mt-0.5">کد پستی: {toPersianDigits(customer.postalCode)}</p>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={copyAddress}
                  className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-50 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'کپی شد!' : 'کپی آدرس'}</span>
                </button>

                <a
                  href={`tel:${customer.phone}`}
                  className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <Phone className="h-3.5 w-3.5 text-indigo-500" />
                  <span>تماس</span>
                </a>
              </div>
            </div>
          </div>

          {/* Private Merchant Notes & Customer Preferences */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs dark:border-slate-800 dark:bg-slate-850">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white mb-3">یادداشت‌های محرمانه فروشنده</h4>
            <div className="space-y-2 mb-3">
              {notesList.map((note, idx) => (
                <div key={idx} className="flex items-start gap-2 rounded-xl bg-slate-50 p-2.5 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <span className="text-indigo-600 mt-0.5">•</span>
                  <span>{note}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="ثبت یادداشت جدید (مثلا سایز مورد علاقه، حساسیت پارچه)..."
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-700"
              >
                افزودن
              </button>
            </form>
          </div>

          {/* Past Order History */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs dark:border-slate-800 dark:bg-slate-850">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white mb-3">تاریخچه و سوابق سفارش‌های قبلی</h4>
            {customerOrders.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">سفارشی برای این مشتری یافت نشد.</p>
            ) : (
              <div className="space-y-2.5">
                {customerOrders.map((ord) => (
                  <div
                    key={ord.id}
                    onClick={() => {
                      onClose();
                      onSelectOrder(ord);
                    }}
                    className="flex items-center justify-between rounded-xl border border-slate-100 p-3 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs dark:bg-indigo-950 dark:text-indigo-300">
                        {ord.orderNumber.slice(-3)}
                      </div>
                      <div>
                        <p className="font-bold text-xs text-slate-900 dark:text-white">{ord.items[0]?.title}</p>
                        <p className="text-[10px] text-slate-400 font-num">{ord.createdAt}</p>
                      </div>
                    </div>

                    <div className="text-left">
                      <p className="font-bold text-xs text-slate-900 dark:text-white">{formatToman(ord.grandTotal)}</p>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400">تکمیل شده</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
