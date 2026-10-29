import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Sun, 
  Moon, 
  Smartphone, 
  Bell, 
  Plus, 
  Store, 
  ExternalLink,
  MessageSquare,
  PackageCheck,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { StoreSettings } from '../../types';
import { toPersianDigits } from '../../utils/persian';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  storeSettings: StoreSettings;
  onOpenAiScanner: () => void;
  onOpenNewOrder: () => void;
  onToggleMobilePreview: () => void;
  onNavigate: (tab: string) => void;
  unreadCount: number;
  pendingOrdersCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  storeSettings,
  onOpenAiScanner,
  onOpenNewOrder,
  onToggleMobilePreview,
  onNavigate,
  unreadCount,
  pendingOrdersCount,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showStoreMenu, setShowStoreMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-900/90 lg:px-6">
      {/* Left side (in RTL: Right side): Search & Channel Live Status */}
      <div className="flex items-center gap-3 md:gap-4 flex-1 max-w-xl">
        <div className="relative w-full max-w-xs md:max-w-sm">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="جستجوی سریع سفارش، مشتری، تلفن، کالا..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-9 pl-4 text-xs md:text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-800"
          />
        </div>

        {/* Social Status Badges */}
        <div className="hidden lg:flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-pink-500/10 to-rose-500/10 px-2.5 py-1 text-pink-600 dark:text-pink-400 border border-pink-200/50 dark:border-pink-800/40">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
            </span>
            <span className="font-medium">دایرکت اینستاگرام: متصل</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-sky-500/10 px-2.5 py-1 text-sky-600 dark:text-sky-400 border border-sky-200/50 dark:border-sky-800/40">
            <span className="h-2 w-2 rounded-full bg-sky-500"></span>
            <span className="font-medium">ربات تلگرام: فعال</span>
          </div>
        </div>
      </div>

      {/* Right side (in RTL: Left side): Actions, AI Scanner, Notifications, Theme, User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* AI Receipt & Order Scanner Button */}
        <button
          onClick={onOpenAiScanner}
          className="relative group flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-3.5 py-2 text-xs md:text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:scale-[1.02] hover:shadow-indigo-500/40 active:scale-95"
          title="استخراج هوشمند سفارش از اسکرین‌شات دایرکت یا فیش واریز با هوش مصنوعی بافت"
        >
          <Sparkles className="h-4 w-4 animate-spin-slow text-amber-300" />
          <span className="hidden sm:inline">اسکن هوشمند فیش (AI)</span>
          <span className="sm:hidden">اسکن هوشمند</span>
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-300"></span>
          </span>
        </button>

        {/* Quick New Order */}
        <button
          onClick={onOpenNewOrder}
          className="hidden sm:flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/80 px-3 py-2 text-xs md:text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-300 dark:hover:bg-indigo-900/60"
        >
          <Plus className="h-4 w-4" />
          <span>ثبت سفارش جدید</span>
        </button>

        {/* Mobile Companion Simulator Button */}
        <button
          onClick={onToggleMobilePreview}
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          title="پیش‌نمایش نسخه همراه موبایل"
        >
          <Smartphone className="h-4 w-4" />
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            title="اعلان‌ها"
          >
            <Bell className="h-4 w-4" />
            {(unreadCount > 0 || pendingOrdersCount > 0) && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {toPersianDigits(unreadCount + pendingOrdersCount)}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute left-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-800 z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">اعلان‌های اخیر بافت</span>
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                  {toPersianDigits(3)} اعلان جدید
                </span>
              </div>
              <div className="mt-2 space-y-2 text-xs">
                <div 
                  onClick={() => { setShowNotifications(false); onNavigate('inbox'); }}
                  className="flex items-start gap-2.5 rounded-xl p-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer"
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-pink-100 text-pink-600 dark:bg-pink-950/60 dark:text-pink-400">
                    <MessageSquare className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-100">فیش واریز جدید از فاطمه رضایی</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">مبلغ ۱,۳۰۵,۰۰۰ تومان در انتظار تایید شماست.</p>
                  </div>
                </div>

                <div 
                  onClick={() => { setShowNotifications(false); onNavigate('orders'); }}
                  className="flex items-start gap-2.5 rounded-xl p-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer"
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                    <PackageCheck className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-100">سفارش BFT-1047 تایید شد</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">مریم حسینی با درگاه زرین‌پال پرداخت کرد.</p>
                  </div>
                </div>

                <div 
                  onClick={() => { setShowNotifications(false); onNavigate('inventory'); }}
                  className="flex items-start gap-2.5 rounded-xl p-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer"
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                    <AlertTriangle className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-100">هشدار کسری موجودی</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">شلوار واید لینن پاکتی کمتر از ۳ عدد موجود است.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle (Dark / Light) */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          title={darkMode ? 'حالت روشن' : 'حالت تاریک'}
        >
          {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
        </button>

        {/* Store Profile Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowStoreMenu(!showStoreMenu)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white py-1.5 px-2.5 text-xs font-semibold text-slate-800 transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-750"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xs shadow-sm">
              ب
            </div>
            <span className="hidden md:inline max-w-[100px] truncate">{storeSettings?.storeName}</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {showStoreMenu && (
            <div className="absolute left-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-800 z-50">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{storeSettings?.storeName}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 dir-ltr text-right">@{storeSettings?.instagramHandle}</p>
              </div>
              <div className="mt-1 space-y-1 text-xs">
                <button
                  onClick={() => { setShowStoreMenu(false); onNavigate('onboarding'); }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <Store className="h-3.5 w-3.5 text-indigo-500" />
                  <span>تنظیمات و راه‌اندازی فروشگاه</span>
                </button>
                <button
                  onClick={() => { setShowStoreMenu(false); onNavigate('design-system'); }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-purple-500" />
                  <span>راهنمای سیستم طراحی بافت</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
