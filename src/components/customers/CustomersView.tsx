import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Star, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  Instagram, 
  Send, 
  ChevronLeft, 
  ExternalLink,
  MessageSquare,
  Sparkles,
  Tag
} from 'lucide-react';
import { Customer, Order } from '../../types';
import { toPersianDigits, formatToman, formatPhoneNumber } from '../../utils/persian';

interface CustomersViewProps {
  customers: Customer[];
  orders: Order[];
  onSelectCustomer: (customer: Customer) => void;
  onOpenNewCustomer: () => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  orders,
  onSelectCustomer,
  onOpenNewCustomer,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | 'vip' | 'regular' | 'new'>('all');

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.socialHandle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.province.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = tierFilter === 'all' || c.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
            باشگاه مشتریان و CRM بافت
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            ثبت پرونده مشتریان وفادار، سابقه خریدها، ترجیحات سایز و آدرس‌های پستی
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenNewCustomer}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/25 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            <span>افزودن مشتری جدید</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-850">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی مشتری بر اساس نام، تلفن، آیدی یا استان..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-9 pl-3 text-xs text-slate-800 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        {/* Tier Tabs */}
        <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800 text-xs font-semibold">
          <button
            onClick={() => setTierFilter('all')}
            className={`rounded-lg px-3 py-1 transition-all ${
              tierFilter === 'all' ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-700 dark:text-white' : 'text-slate-500'
            }`}
          >
            همه ({toPersianDigits(customers.length)})
          </button>
          <button
            onClick={() => setTierFilter('vip')}
            className={`flex items-center gap-1 rounded-lg px-3 py-1 transition-all ${
              tierFilter === 'vip' ? 'bg-white text-purple-600 shadow-xs dark:bg-slate-700 dark:text-purple-300' : 'text-slate-500'
            }`}
          >
            <Star className="h-3 w-3 fill-purple-500 text-purple-500" />
            وفادار (VIP)
          </button>
          <button
            onClick={() => setTierFilter('regular')}
            className={`rounded-lg px-3 py-1 transition-all ${
              tierFilter === 'regular' ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-700 dark:text-white' : 'text-slate-500'
            }`}
          >
            مشتریان عادی
          </button>
          <button
            onClick={() => setTierFilter('new')}
            className={`rounded-lg px-3 py-1 transition-all ${
              tierFilter === 'new' ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-700 dark:text-white' : 'text-slate-500'
            }`}
          >
            تازه وارد
          </button>
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCustomers.map((cust) => {
          const isVip = cust.tier === 'vip';
          return (
            <div
              key={cust.id}
              onClick={() => onSelectCustomer(cust)}
              className="group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:shadow-md hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-850 dark:hover:border-indigo-700 cursor-pointer"
            >
              {/* Top Row: Avatar & Handle */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={cust.avatarUrl}
                    alt={cust.name}
                    className="h-12 w-12 rounded-full object-cover shadow-xs ring-2 ring-indigo-500/20"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {cust.name}
                    </h3>
                    <p className="text-xs text-slate-400 dir-ltr text-right font-mono">{cust.socialHandle}</p>
                  </div>
                </div>

                {isVip ? (
                  <span className="flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                    <Star className="h-2.5 w-2.5 fill-purple-600 text-purple-600" />
                    VIP
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    مشتری عادی
                  </span>
                )}
              </div>

              {/* Stats Box */}
              <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400">مجموع خریدها</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{formatToman(cust.totalSpent)}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">تعداد سفارش</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{toPersianDigits(cust.ordersCount)} سفارش</p>
                </div>
              </div>

              {/* Contact & Location */}
              <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span className="font-num font-medium">{formatPhoneNumber(cust.phone)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span className="truncate">{cust.province}، {cust.city}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="mt-3 flex flex-wrap gap-1">
                {cust.tags.map((tag, i) => (
                  <span key={i} className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Footer View link */}
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs font-bold text-indigo-600 dark:border-slate-800 dark:text-indigo-400">
                <span>مشاهده پروفایل و سوابق</span>
                <ChevronLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
